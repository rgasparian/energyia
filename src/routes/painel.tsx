import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Zap, Copy, ExternalLink, Loader2, LogOut, Upload, Shield } from "lucide-react";
import { slugify, cleanPhone, appUrl } from "@/lib/utils-energyia";
import { getSupabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/painel")({ component: Painel });

interface Profile {
  id: string;
  nome: string; email: string; telefone?: string; instagram?: string;
  cidade?: string; foto_url?: string; video_url?: string; whatsapp?: string;
  pix?: string; slug: string; link_cta?: string;
  link_externo_1?: string; link_externo_2?: string;
  texto_cta?: string; headline?: string; subheadline?: string;
  link_ebook?: string; link_patrocinador?: string; link_cliente?: string; link_guia?: string;
  facebook?: string; youtube?: string;
}

interface Lead {
  id: string; nome: string; telefone: string; email?: string; created_at: string;
}

function Painel() {
  const navigate = useNavigate();
  const { user, role, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const supabase = await getSupabase();
      let { data: p } = await supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle();
      if (!p) {
        // Auto-cria perfil básico se não existir (ex.: usuário criado antes do trigger)
        const baseSlug = (user.email?.split("@")[0] || "user") + "-" + user.id.slice(0, 6);
        const { data: created, error: insErr } = await supabase
          .from("usuarios")
          .insert({
            id: user.id,
            email: user.email ?? "",
            nome: (user.user_metadata as any)?.nome || user.email?.split("@")[0] || "Membro",
            slug: baseSlug,
          })
          .select("*")
          .maybeSingle();
        if (insErr) {
          toast.error("Erro ao criar perfil: " + insErr.message);
          return;
        }
        p = created;
      }
      if (p) setProfile(p as Profile);
      const { data: l } = await supabase.from("leads").select("id,nome,telefone,email,created_at").order("created_at", { ascending: false });
      setLeads((l as Lead[]) ?? []);
    })();
  }, [user]);

  const update = (k: keyof Profile, v: string) => setProfile((p) => p ? { ...p, [k]: v } : p);

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    const supabase = await getSupabase();
    const slug = slugify(profile.slug || profile.nome);
    // Check slug uniqueness
    const { data: existing } = await supabase.from("usuarios").select("id").eq("slug", slug).neq("id", profile.id).maybeSingle();
    if (existing) {
      setSaving(false);
      toast.error("Este link personalizado já está em uso. Escolha outro.");
      return;
    }
    const { error } = await supabase.from("usuarios").update({
      nome: profile.nome, telefone: profile.telefone, instagram: profile.instagram,
      cidade: profile.cidade, video_url: profile.video_url, whatsapp: cleanPhone(profile.whatsapp || ""),
      pix: profile.pix, slug, link_cta: profile.link_cta,
      link_externo_1: profile.link_externo_1, link_externo_2: profile.link_externo_2,
      texto_cta: profile.texto_cta, headline: profile.headline, subheadline: profile.subheadline,
      link_ebook: profile.link_ebook, link_patrocinador: profile.link_patrocinador,
      link_cliente: profile.link_cliente, link_guia: profile.link_guia,
      facebook: profile.facebook, youtube: profile.youtube,
    }).eq("id", profile.id);
    setSaving(false);
    if (error) toast.error("Erro ao salvar: " + error.message);
    else { toast.success("Alterações salvas!"); setProfile({ ...profile, slug }); }
  };

  const uploadPhoto = async (file: File) => {
    if (!profile || !file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Imagem maior que 5MB."); return; }
    setUploading(true);
    const supabase = await getSupabase();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/foto.${ext}`;
    const { error } = await supabase.storage.from("fotos-perfil").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("fotos-perfil").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    await supabase.from("usuarios").update({ foto_url: url }).eq("id", profile.id);
    setProfile({ ...profile, foto_url: url });
    setUploading(false);
    toast.success("Foto atualizada!");
  };

  if (loading || !profile) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]"><Loader2 className="h-6 w-6 animate-spin text-[#F57C00]" /></div>;
  }

  const publicUrl = `${appUrl()}/${profile.slug}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#F57C00]" fill="#F57C00" />
            <span className="text-lg font-bold text-[#1A1A1A]">EnergyIA</span>
          </Link>
          <div className="flex items-center gap-3">
            {role === "admin" && (
              <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#FAFAFA]">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            <button onClick={() => { signOut(); navigate({ to: "/login" }); }} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#FAFAFA]">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Painel do membro</h1>
          <p className="text-sm text-[#666]">Bem-vindo, {profile.nome}</p>
        </div>

        {/* Minhas páginas */}
        <section className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-[#1A1A1A]">Minhas páginas</h2>
          <p className="mb-4 text-sm text-[#666]">Todas as páginas do sistema são automaticamente personalizadas com o seu slug <code className="rounded bg-[#FAFAFA] px-1.5 py-0.5">{profile.slug}</code>. Quando novos modelos forem publicados, eles aparecerão aqui automaticamente.</p>
          <div className="space-y-3">
            {[
              { nome: "Perfil simples", descricao: "Página de apresentação básica com seus contatos.", url: `${appUrl()}/${profile.slug}` },
              { nome: "Página de captação (Energyia)", descricao: "Landing page completa com simulador, 3 ofertas e captura de leads.", url: `${appUrl()}/consultor/${profile.slug}` },
            ].map((p) => (
              <div key={p.url} className="rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] p-4">
                <div className="mb-2">
                  <div className="font-semibold text-[#1A1A1A]">{p.nome}</div>
                  <div className="text-xs text-[#666]">{p.descricao}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="flex-1 rounded bg-white px-3 py-2 text-xs text-[#333] break-all border border-[#E0E0E0]">{p.url}</code>
                  <button onClick={() => { navigator.clipboard.writeText(p.url); toast.success("Link copiado!"); }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#F57C00] px-3 py-2 text-xs font-semibold text-white hover:bg-[#E65100]">
                    <Copy className="h-3.5 w-3.5" /> Copiar
                  </button>
                  <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-xs font-medium text-[#333] hover:bg-[#FAFAFA]">
                    <ExternalLink className="h-3.5 w-3.5" /> Abrir
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editar perfil */}
        <section className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Editar perfil</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome completo" value={profile.nome} onChange={(v) => update("nome", v)} />
            <Field label="WhatsApp (com DDI, ex: 5511999999999)" value={profile.whatsapp || ""} onChange={(v) => update("whatsapp", v)} />
            <Field label="Instagram (@handle)" value={profile.instagram || ""} onChange={(v) => update("instagram", v)} />
            <Field label="Cidade" value={profile.cidade || ""} onChange={(v) => update("cidade", v)} />
            <Field label="PIX (chave)" value={profile.pix || ""} onChange={(v) => update("pix", v)} />
            <Field label="Slug (URL personalizada)" value={profile.slug} onChange={(v) => update("slug", v)} />
            <Field label="URL do vídeo (YouTube/Vimeo)" value={profile.video_url || ""} onChange={(v) => update("video_url", v)} full />
            <Field label="Headline da página" value={profile.headline || ""} onChange={(v) => update("headline", v)} full />
            <Field label="Subheadline da página" value={profile.subheadline || ""} onChange={(v) => update("subheadline", v)} full />
            <Field label="Texto do botão CTA" value={profile.texto_cta || ""} onChange={(v) => update("texto_cta", v)} />
            <Field label="Link CTA" value={profile.link_cta || ""} onChange={(v) => update("link_cta", v)} />
            <Field label="Link extra 1" value={profile.link_externo_1 || ""} onChange={(v) => update("link_externo_1", v)} />
            <Field label="Link extra 2" value={profile.link_externo_2 || ""} onChange={(v) => update("link_externo_2", v)} />

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[#333]">Foto de perfil</label>
              <div className="flex items-center gap-4">
                {profile.foto_url && <img src={profile.foto_url} alt="" className="h-20 w-20 rounded-full border border-[#E0E0E0] object-cover" />}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#E0E0E0] px-4 py-2 text-sm font-medium text-[#333] hover:bg-[#FAFAFA]">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Enviando..." : "Enviar nova foto"}
                  <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => e.target.files && uploadPhoto(e.target.files[0])} />
                </label>
              </div>
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F57C00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#E65100] disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar alterações
          </button>
        </section>

        {/* Links da página de captação */}
        <section className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-[#1A1A1A]">Links da página de captação</h2>
          <p className="mb-4 text-sm text-[#666]">Estes links substituem os placeholders <code>[LINK_PATROCINADOR]</code>, <code>[LINK_CLIENTE]</code>, etc. na sua landing page pública.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Link do e-book / checkout (Opção 1 — INICIAR AGORA)" value={profile.link_ebook || ""} onChange={(v) => update("link_ebook", v)} full />
            <Field label="Link do patrocinador / Matrix (Opção 2 — CONSULTOR MATRIX)" value={profile.link_patrocinador || ""} onChange={(v) => update("link_patrocinador", v)} full />
            <Field label="Link do guia grátis (Opção 3 — BAIXAR GUIA)" value={profile.link_guia || ""} onChange={(v) => update("link_guia", v)} full />
            <Field label="Link cadastro de cliente" value={profile.link_cliente || ""} onChange={(v) => update("link_cliente", v)} full />
          </div>
          <button onClick={save} disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F57C00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#E65100] disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar alterações
          </button>
        </section>

        {/* Redes sociais */}
        <section className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Redes sociais (aparecem no rodapé)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Facebook (URL completa)" value={profile.facebook || ""} onChange={(v) => update("facebook", v)} />
            <Field label="YouTube (URL completa)" value={profile.youtube || ""} onChange={(v) => update("youtube", v)} />
          </div>
          <button onClick={save} disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F57C00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#E65100] disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar alterações
          </button>
        </section>

        {/* Meus leads */}
        <section className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Meus leads ({leads.length})</h2>
          {leads.length === 0 ? (
            <p className="text-sm text-[#666]">Nenhum lead ainda. Divulgue seu link!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#E0E0E0] text-left text-xs uppercase text-[#666]">
                  <tr>
                    <th className="py-2 pr-4">Nome</th><th className="py-2 pr-4">Telefone</th>
                    <th className="py-2 pr-4">E-mail</th><th className="py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-[#E0E0E0]/50">
                      <td className="py-2.5 pr-4 font-medium text-[#1A1A1A]">{l.nome}</td>
                      <td className="py-2.5 pr-4 text-[#333]">{l.telefone}</td>
                      <td className="py-2.5 pr-4 text-[#333]">{l.email || "-"}</td>
                      <td className="py-2.5 text-[#666]">{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, full }: { label: string; value: string; onChange: (v: string) => void; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-[#333]">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm focus:border-[#F57C00] focus:outline-none focus:ring-2 focus:ring-[#F57C00]/20" />
    </div>
  );
}
