import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Zap, Loader2, MessageCircle, Instagram, Copy, ExternalLink } from "lucide-react";
import { toEmbedUrl, cleanPhone } from "@/lib/utils-energyia";
import { getSupabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/$slug")({ component: PublicPage });

interface PublicProfile {
  id: string; nome: string; cidade?: string; foto_url?: string; video_url?: string;
  whatsapp?: string; instagram?: string; pix?: string; slug: string;
  link_cta?: string; link_externo_1?: string; link_externo_2?: string;
  texto_cta?: string; headline?: string; subheadline?: string;
}

function PublicPage() {
  const { slug } = Route.useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = await getSupabase();
      const { data } = await supabase.from("usuarios_public" as never).select("*").eq("slug", slug).maybeSingle();
      if (data) setProfile(data as PublicProfile);
      else setNotFound(true);
    })();
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    const supabase = await getSupabase();
    const lead = {
      nome: form.nome, telefone: cleanPhone(form.telefone), email: form.email || null,
      usuario_id: profile.id, slug_origem: profile.slug, origem: "pagina_publica",
    };
    const { error } = await supabase.from("leads").insert(lead);
    if (error) { toast.error("Erro ao enviar."); setSubmitting(false); return; }

    // Webhook Make.com (optional)
    const hook = import.meta.env.VITE_WEBHOOK_MAKE;
    if (hook) {
      fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          membro_nome: profile.nome, membro_slug: profile.slug, membro_whatsapp: profile.whatsapp,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Recebemos seus dados!");
  };

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] px-4 text-center text-white">
        <div>
          <Zap className="mx-auto mb-4 h-10 w-10 text-[#F57C00]" />
          <h1 className="text-2xl font-bold">Página indisponível</h1>
          <p className="mt-2 text-white/60">Esta página não está disponível no momento.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]"><Loader2 className="h-6 w-6 animate-spin text-[#F57C00]" /></div>;
  }

  const embed = profile.video_url ? toEmbedUrl(profile.video_url) : null;
  const wa = cleanPhone(profile.whatsapp || "");
  const ig = (profile.instagram || "").replace(/^@/, "");

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-12">
      <header className="bg-[#1A1A1A] py-4 text-center">
        <div className="inline-flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#F57C00]" fill="#F57C00" />
          <span className="font-bold text-white">EnergyIA</span>
        </div>
      </header>

      <main className="mx-auto max-w-xl space-y-5 px-4 pt-8">
        <div className="text-center">
          {profile.foto_url ? (
            <img src={profile.foto_url} alt={profile.nome} className="mx-auto h-28 w-28 rounded-full border-4 border-white object-cover shadow-md" />
          ) : (
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#F57C00] text-3xl font-bold text-white shadow-md">
              {profile.nome.charAt(0)}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold text-[#1A1A1A]">{profile.nome}</h1>
          {profile.cidade && <p className="text-sm text-[#666]">{profile.cidade}</p>}
        </div>

        {embed && (
          <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-black shadow-sm">
            <div className="aspect-video"><iframe src={embed} className="h-full w-full" allow="autoplay; encrypted-media" allowFullScreen /></div>
          </div>
        )}

        {(profile.headline || profile.subheadline) && (
          <div className="text-center">
            {profile.headline && <h2 className="text-xl font-bold text-[#1A1A1A]">{profile.headline}</h2>}
            {profile.subheadline && <p className="mt-2 text-[#666]">{profile.subheadline}</p>}
          </div>
        )}

        <div className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
          {submitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">✓</div>
              <p className="font-semibold text-[#1A1A1A]">Recebemos seus dados!</p>
              <p className="mt-1 text-sm text-[#666]">Em breve entraremos em contato.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <h3 className="text-center text-lg font-semibold text-[#1A1A1A]">Quero saber mais</h3>
              <input required placeholder="Nome completo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-lg border border-[#E0E0E0] px-4 py-3 text-sm focus:border-[#F57C00] focus:outline-none" />
              <input required type="tel" placeholder="WhatsApp" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                className="w-full rounded-lg border border-[#E0E0E0] px-4 py-3 text-sm focus:border-[#F57C00] focus:outline-none" />
              <input type="email" placeholder="E-mail (opcional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-[#E0E0E0] px-4 py-3 text-sm focus:border-[#F57C00] focus:outline-none" />
              <button type="submit" disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-3 text-sm font-semibold text-white hover:bg-[#E65100] disabled:opacity-60">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {profile.texto_cta || "Quero saber mais"}
              </button>
            </form>
          )}
        </div>

        {profile.link_cta && (
          <a href={profile.link_cta} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#E65100]">
            <ExternalLink className="h-4 w-4" /> {profile.texto_cta || "Saiba mais"}
          </a>
        )}
        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1faa53]">
            <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
          </a>
        )}
        {ig && (
          <a href={`https://instagram.com/${ig}`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#E0E0E0] bg-white py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-sm hover:bg-[#FAFAFA]">
            <Instagram className="h-4 w-4" /> @{ig}
          </a>
        )}
        {profile.link_externo_1 && (
          <a href={profile.link_externo_1} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#E0E0E0] bg-white py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-sm hover:bg-[#FAFAFA]">
            <ExternalLink className="h-4 w-4" /> Link adicional
          </a>
        )}
        {profile.link_externo_2 && (
          <a href={profile.link_externo_2} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#E0E0E0] bg-white py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-sm hover:bg-[#FAFAFA]">
            <ExternalLink className="h-4 w-4" /> Link adicional
          </a>
        )}
        {profile.pix && (
          <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase text-[#666]">Chave PIX</p>
            <div className="flex items-center justify-between gap-2">
              <code className="flex-1 truncate text-sm text-[#1A1A1A]">{profile.pix}</code>
              <button onClick={() => { navigator.clipboard.writeText(profile.pix!); toast.success("PIX copiado!"); }}
                className="rounded-md border border-[#E0E0E0] p-2 hover:bg-[#FAFAFA]"><Copy className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
