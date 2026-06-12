// supabase/functions/admin-manage-member/index.ts
// ============================================================
// Edge Function: admin-manage-member
// Permite ao admin alterar senha e editar perfil de qualquer membro.
// Usa SERVICE_ROLE_KEY — nunca expor no frontend.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verificar que quem chama é um admin autenticado
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cliente com a chave do usuário (para verificar role)
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verificar role do usuário logado
    const { data: roleData, error: roleError } = await supabaseUser.rpc("get_my_role");
    if (roleError || roleData !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado — somente administradores" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Buscar dados do admin para o log
    const { data: { user: adminUser } } = await supabaseUser.auth.getUser();
    const { data: adminData } = await supabaseUser
      .from("usuarios")
      .select("slug")
      .eq("id", adminUser!.id)
      .single();

    // 2. Cliente com SERVICE_ROLE — pode tudo no Supabase Auth
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    // 3. Ler body da requisição
    const body = await req.json();
    const { target_id, target_slug, acao, dados } = body;
    // acao: 'alterar_senha' | 'editar_perfil' | 'desativar' | 'ativar'
    // dados: { nova_senha?: string, perfil?: Record<string, any> }

    if (!target_id || !acao) {
      return new Response(JSON.stringify({ error: "Parâmetros inválidos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let resultado: string = "";

    // 4. Executar ação
    if (acao === "alterar_senha") {
      if (!dados?.nova_senha || dados.nova_senha.length < 6) {
        return new Response(JSON.stringify({ error: "Senha deve ter no mínimo 6 caracteres" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(target_id, {
        password: dados.nova_senha,
      });

      if (error) throw error;
      resultado = "Senha alterada com sucesso";

    } else if (acao === "editar_perfil") {
      if (!dados?.perfil) {
        return new Response(JSON.stringify({ error: "Dados de perfil ausentes" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Campos permitidos para edição pelo admin
      const camposPermitidos = [
        "nome", "telefone", "whatsapp", "instagram", "facebook",
        "youtube", "cidade", "slug", "foto_url",
        "link_ebook", "link_patrocinador", "link_ferramentas",
        "link_cliente", "link_guia", "headline", "subheadline",
        "texto_cta", "link_cta", "link_externo_1", "link_externo_2",
        "ativo",
      ];

      const perfilFiltrado: Record<string, unknown> = {};
      for (const campo of camposPermitidos) {
        if (dados.perfil[campo] !== undefined) {
          perfilFiltrado[campo] = dados.perfil[campo];
        }
      }

      const { error } = await supabaseAdmin
        .from("usuarios")
        .update(perfilFiltrado)
        .eq("id", target_id);

      if (error) throw error;
      resultado = "Perfil atualizado com sucesso";

    } else if (acao === "desativar") {
      const { error } = await supabaseAdmin
        .from("usuarios")
        .update({ ativo: false })
        .eq("id", target_id);

      if (error) throw error;
      resultado = "Conta desativada";

    } else if (acao === "ativar") {
      const { error } = await supabaseAdmin
        .from("usuarios")
        .update({ ativo: true })
        .eq("id", target_id);

      if (error) throw error;
      resultado = "Conta ativada";

    } else {
      return new Response(JSON.stringify({ error: "Ação desconhecida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Registrar no log de auditoria
    await supabaseAdmin.from("admin_audit_log").insert({
      admin_id:    adminUser!.id,
      admin_slug:  adminData?.slug ?? "admin",
      target_id,
      target_slug: target_slug ?? "desconhecido",
      acao,
      detalhes: resultado,
    });

    return new Response(JSON.stringify({ ok: true, mensagem: resultado }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
