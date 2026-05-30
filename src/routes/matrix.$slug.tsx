import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MatrixLayout } from "./matrix";

export const Route = createFileRoute("/matrix/$slug")({
  component: MatrixSlugPage,
});

interface Consultor {
  id: string; nome: string; slug: string; cidade?: string; foto_url?: string;
  whatsapp?: string; email?: string;
  link_ebook?: string; link_patrocinador?: string;
  link_ferramentas?: string;
}

export function MatrixSlugPage() {
  const { slug } = Route.useParams();
  const [c, setC] = useState<Consultor | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${url}/rest/v1/usuarios_public?select=id,nome,slug,cidade,foto_url,whatsapp,email,telefone,link_ebook,link_patrocinador,link_ferramentas&slug=eq.${encodeURIComponent(slug)}&ativo=eq.true&limit=1`,
          { headers: { apikey: key, authorization: `Bearer ${key}` } }
        );
        const data = await res.json();
        const consultor = Array.isArray(data) ? data[0] : null;
        if (consultor) setC(consultor);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      }
    })();
  }, [slug]);

  if (notFound) {
    return (
      <div style={{ display:"flex", minHeight:"100vh", alignItems:"center", justifyContent:"center", background:"#080808", color:"#fff", textAlign:"center", padding:24 }}>
        <div>
          <div style={{ fontSize:40, marginBottom:16 }}>⚡</div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:700 }}>Consultor não encontrado</h1>
          <p style={{ color:"rgba(255,255,255,0.5)", marginTop:8 }}>Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div style={{ display:"flex", minHeight:"100vh", alignItems:"center", justifyContent:"center", background:"#080808" }}>
        <div style={{ width:32, height:32, border:"3px solid #F57C00", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <MatrixLayout
      linkMetodo={c.link_ebook || "#"}
      linkPatrocinador={c.link_patrocinador || "#"}
      linkFerramentas={c.link_ferramentas || "#"}
      consultor={{ nome: c.nome, foto_url: c.foto_url, cidade: c.cidade, whatsapp: c.whatsapp }}
    />
  );
}
