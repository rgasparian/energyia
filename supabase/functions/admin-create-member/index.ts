import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    // Verify caller is an admin
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await callerClient.auth.getUser();
    if (!user) return json({ error: "Não autenticado" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some((r: any) => r.role === "admin")) {
      return json({ error: "Apenas administradores podem criar membros" }, 403);
    }

    const body = await req.json();
    const { nome, email, senha, telefone, slug } = body;
    if (!nome || !email || !senha) return json({ error: "Nome, e-mail e senha são obrigatórios" }, 400);

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email, password: senha, email_confirm: true,
      user_metadata: { nome, telefone, slug },
    });
    if (createErr) return json({ error: createErr.message }, 400);

    // Trigger creates profile + role. Ensure slug + phone are set.
    await admin.from("usuarios").update({ nome, telefone, slug }).eq("id", created.user!.id);

    // Optional welcome email via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: "EnergyIA <onboarding@resend.dev>",
            to: [email],
            subject: "Bem-vindo à EnergyIA!",
            html: `<h2>Olá, ${nome}!</h2><p>Sua conta foi criada. Acesse com:</p>
              <p><strong>E-mail:</strong> ${email}<br/><strong>Senha:</strong> ${senha}</p>
              <p>Recomendamos alterar sua senha após o primeiro login.</p>`,
          }),
        });
      } catch (_) { /* ignore */ }
    }

    return json({ success: true, id: created.user!.id });
  } catch (e: any) {
    return json({ error: e?.message || "Erro interno" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
