import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import React from "react";
import { cleanPhone } from "@/lib/utils-energyia";

export const Route = createFileRoute("/matrix/$slug")({
  component: MatrixSlugPage,
});

interface Consultor {
  id: string; nome: string; slug: string; cidade?: string; foto_url?: string;
  whatsapp?: string; email?: string; telefone?: string;
  link_ebook?: string; link_patrocinador?: string; link_ferramentas?: string;
  usuario_matrix?: string;
}

const DEFAULT_EBOOK = "https://pay.hotmart.com/E105718812K";
const LOGO = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABVAOgDASIAAhEBAxEB/8QAHQABAQEBAQEAAwEAAAAAAAAAAAcIBgUEAQIDCf/EAE0QAAECBQIDBQMEDQoFBQAAAAECAwAEBQYRByESMUEIExRRYSJxgTKRobEVFiM3UlNydIKSssHCJDM1NkJDc3Wi8SU0s8PRk6Ph4vD/xAAbAQABBQEBAAAAAAAAAAAAAAAAAwQFBgcBAv/EADYRAAEDAwIDBgUCBQUAAAAAAAEAAgMEBREhMRJBUQYTYXGBoRQikcHRsfAVIzJi4SRCUrLx/9oADAMBAAIRAxEAPwC/9oevz9GtKWlqdMLl3J58tuOIVhXdhJJAI5ZOPhnzjNylFSipRJUTkkncxbu1M/8A0BKg/j3FD/0wP3xEW0qWtKEDKlEADzMUe9yF1W5udsfote7IwtjtjHgauJJ+pH2Xr2pclXtiqNz9KmltKSrK2iT3bo/BUnqP/wAI1LYV20y76MmfkFcDqMJmJdR9tlXkfMHoevvyBzlqaR2pTaSy3VZBNSnikF55xauHi6hKQcAD546eg2hbdBnDOUilNSb6kFCltqVuk9CCcHlE3a6Krpf6iOE8tdFUu0V2tlxz3bXcY2dgYPnrnHTmF7sIQidVOU17QF1TFBthmn0+YUxO1FZTxoVhaGk/KII5EkpHxMZsUpS1FSlFSjuSTkmO01puD7YL9nFtL4pWT/krG+2EE8R+KuL4YjnLXo8zcFwSVGlCEuzToQFHkkc1KPuAJ+EUS51DqqqIbqNh+/ErZOz9Ey225rpNCRxOPv7Bf0tS4qrbNWaqNKmFNrQfabJPA4nqlQ6g/wC0alsC76ZeFGE7JK7t9GEzMso5Uyr94PQ9ffkR41O0jsaVk22HqUuccSPaeemHApZ88JUAPgI9m3rHte35/wAfR6YZSY4SgqRMOnKT0IKiCPeInrZQ1lIcOILTuMn20VM7QXe2XNuWNcJBscDB8DrnHuF0cIQidVOSEIQISEIQISEIQISEIQISEIQISEIQISEIQISEIQISEIQIWe+08/xXbTJbP83IcePynFD+GJzaEv4u7KRK4z308y287gEdl2in++1Jdb/ESrTf0FX8UeFpKx4nUihN+U2lz9UFX7oolX/MuBH92Pstktn+nsjXdGE+xK1rCEIvaxtI5rU64PtasqoVJCwmY4O6lt/7xWwPw3V8I6WID2mK/wCJrUlbrK/ucmjv3wOrix7IPuTv+nDG5VPw9M5432Hmf3lTFhoPjq5kRHyjU+Q/O3qo+SSSSck8zFq7MtvccxP3M+jZseFliRtxHBWR7hwj4mIuy2488hlpCluLUEoSkZKidgBGwbFoTdt2nT6OgJ42Gh3qgPlOHdZ+cn4Yis2Km72o7w7N/Xkr/wBsbh8PRdy06yaeg3+w9V7cIQi6LKEhH85t4S8q6+QVBtBWQOuBmJvbGslCq886xMyj1NZZYU8t99xJSAnG2BuSc7AQhLUxQuDXuwTsnlNb6mqY58LC4N3wqZCI7UNeKU1OKbkaDNTMuDgOuPpbJ9QnB+uO1tzUK2qzbczXRN+DYlMCaRMbLaJ5bDOc9Mc+XPaEYrjTSuLWPGQnNRY7hTsD5IiAfXfbbUeq62ER2o680tqbU3IUGamWAcB1x8NE+vDhX1x3tg3rSLykHH6cXGnmSA/Lu4C0Z5HbYg77+kdhuFNM/gjfkrlVZa+ki76aMhvXT3xt6rpYR413XNR7Vpf2Qq8x3aCeFttA4nHVeSR1+odTEvd18lRNFLVsvKl87LVOBK8fk8BH0x2or6endwyOwf30XKKzV1cwvgjJHXQfqRlWmETSf1kt1qgS1VlJaZmS66WnZbiShxk4yOIbgg9CP/Ij63NUJBFhN3caXMlhc34YMcaeIHffPLG0cFwpjnD9hn0Xo2SvABMRGTwjbfovXr+oNoUGqu0uq1fw820ElbfhnV4yARulJHIjrHUxkLUW4Gbou6brcvLuS7b4bAbWQSOFCU9PdF6sPVOn3bcCKPL0qalnFNqc43HEkez02hjR3ds0z43kYzhu+u/+Oil7r2ZkpKWOaJpJ4cvyR8pwNtvHrsqHCJtR9XaVULpFCVTZiW+6OIXMOOp4EBAUSo+mEmPKrmulJlagqXpVHfqLCVY79T3chXqkcJJHvxDt1zpWt4i/TbmoxnZ+5Pf3YiOcZ5beecL9dX9Ta5bN0Jo1Il5VKG2kuOOPoKysq3wNxgCKLYladuK0adWX2Aw7MtcS0J5BQJSSPQkZHoY4jVi6LXpdQprNy2kmpzLkqHklXCS0CSCjJ57g+kdBWLyaoliU25JahPPU95ltSmmFJT4ZCkjhyOWN8bctobwzFlRK58uWjlg6J7U0oloadkVPwvcccWR8x18eZ6+QXZQjidO9SKReU3MSTDDslNtJC0tPKBLiepTjy6j1j1L/ALup9nUZNQnkLeU44G2WGyApw9efQDf/AHh+2qhdF3wd8vVQz7dVMqBTOYeM8l0UI4/Tm+BegmXpajTUpKsYSX3VghSz/ZGOe258tvOEKRSsmYHsOQUjU00tLIYpRhw3H/igetb/AIjVCtLzkJcQgfotpT+6Pr0BY77VCnLIyGW3l/8AtqT/ABRz+ob/AIm/K88ORqD4HuCyB9AjtezOx3l9zbx5M09ZHvK0D6sxSIP5lxB/uz75WuVn8ixlvSMD2wtGRydQugyWqFPtl5aQxPU9TqBgZDoUrG/qlCh78R1kZz14qsxJasy07Kr4X6ewwps+SgorH1xa7lUmmiEg6j/KzewW9twqHQn/AIux58j9VoyMlattTLOpFdTN57wzRUnP4JAKP9JTGqaHUZer0aTqkqcszTKXUb7gEZwfUcj7oi3acoXdzdOuNlHsugyr5H4QypB+I4h+iIaXyLvaUPbyOfRSfZCoFNcTDIMFwI9Rr9lzOgVvCt3y3OPthUrTE+IXkZBXybHvz7X6Mabif6DW99hLFYmXUcM1Uj4lw9Qgj7mP1d/0jHu6k3Ci2LOnqpxYfCO7lh5uq2T83P3AwrbIm0dHxv56n9+Sb9oKl90uhii1APC37+/svktK6jXb3uSmMuBUnTAw01jG68uBxWefMAc/7PqY66IH2YX1KuKtIWoqW5LIcJJySQvn/qi+Qvbah1RTiR25J/Splf6JlFWmFmwDf+oyfU6r5ax/RE5/gL/ZMZR0wtxm6bylKTMrUiWIU4+UnCihIzge/YfGNXVj+iJz/AX+yYzh2dvvks/mrv1CI67MbJVQNdsT9wpzs1M+G3VkjDggDH0cq5cumFoP2zNSslR2JSYQwosPoJ40rAOCST7Q88xBNM6Cm57ulKI++41KOkuTHAdylCScD1PLPTMaxqH/ACEx/hK+oxmrs9ffMlfzd79mE7nSxCqgaGgAnBx5hOOz9wqTb6t7nkloyMnODg9fJWWs6XWdN0N6RlKMxKvd0Qy+2T3iFY2JJO+/nziN9nmbdl9SpZhCiETTDrbgzzASVj6UiNNxlzQP76VL/If/AOiuPdxhjiq6cxgDJ5eY/KSsdTNU22tbM4uAbkZOeTvwF++rFRnbs1SeprKioMzIp0q3nYEK4SfivJz5Y8otdvaYWfS6W3KvUiXn3+DDsxMJ41LV1IzskeQEQy5iu2NZpicmm1cEtVxOYxupsuBwY/RMaikZuWnpNmck30Py7yAttxByFJPIiOWqKOaaZ0oy7PNeu0dRNTUlLHTuLYy3lpk4G+Pqs4a5WLJWpPys9SEqRT5ziT3SlFXdODfAJ3wQds55H0jvdGqBSbj0lYp9ZlPFSwnnHAjvFI9oHAOUkHqY8btOVuUd+xtAZcQ5MsrVMPgHJbyMJB9TknHljzjrOzt97Zn86d+sR4p4YRc3xtA4cbcuWUrXVVU7s/DNI4h/EMHnzwc/f1US1do9OoN/T9LpUv4eUaS0UN8al4y2kndRJ5k9Y0ZbthWnb1SFSo9J8NNJSUBzxDq9jzGFKIiBa+ffSqn5DH/RRGo4UtUMZqZ/lHynTTbU7dEj2jq5xb6PDz87DxanXRu/X1WPhTZqsX05SpM8L83PrZSeg4lkEn0Azn0i90rRu0JJqXLgnJmZZWlZeU9jiUDn5I2x6fTEi08+/VJ/5i7/ABxqOErLSQyte97cnONUv2rudVTPiiheWjhycaZ5LPfae/rbTPzD/uKiwWHLsTemtElZlpDzD1LZQ42sZCklsAgxH+09/W2mfmH/AHFRZdOPvf2//lzH7AhzRDNwnTC6kiyUhHU/dZ8vu3qnptezE7S3XESxcL0g/wCg5tq8yM4PmD6x+a7VaxqvfMhKS7JYSUBttriKkMJxlxw/SfMgJHPEe7rzd/2xVlm1KOgTDMq+AtSE8Snpj5ISnHQZxtzJPkI5yyaxUtNb9W3VZQoCf5PPNbFXdnB4knrjZQ8xt1iFm7tlQ6Jrj3RcM9P3+9cK2UpnlomVMjAakMPDncjrj6fXllaVtiiyNvUOWpFPRwsMJxk81nqo+pO8I+2TmWJyUam5V1LzDyAttxByFJPIiOWqKOaaZ0oy7PNeu0dRNTUlLHTuLYy3lpk4G+Pqs4a5WLJWpPys9SEqRT5ziT3SlFXdODfAJ3wQds55H0jvdGqBSbj0lYp9ZlPFSwnnHAjvFI9oHAOUkHqY8btOVuUd+xtAZcQ5MsrVMPgHJbyMJB9TknHljzjrOzt97Zn86d+sR4p4YRc3xtA4cbcuWUrXVVU7s/DNI4h/EMHnzwc/f1US1do9OoN/T9LpUv4eUaS0UN8al4y2kndRJ5k9Y0ZbthWnb1SFSo9J8NNJSUBzxDq9jzGFKIiBa+ffSqn5DH/RRGo4UtUMZqZ/lHynTTbU7dEj2jq5xb6PDz87DxanXRu/X1WPhTZqsX05SpM8L83PrZSeg4lkEn0Azn0i90rRu0JJqXLgnJmZZWlZeU9jiUDn5I2x6fTEi08+/VJ/5i7/ABxqOErLSQyte97cnONUv2rudVTPiiheWjhycaZ5LPfae/rbTPzD/uKiwWHLsTemtElZlpDzD1LZQ42sZCklsAgxH+09/W2mfmH/AHFRZdOPvf2//lzH7AhzRDNwnTC6kiyUhHU/dZ8vu3qnptezE7S3XESxcL0g/wCg5tq8yM4PmD6x+a7VaxqvfMhKS7JYSUBttriKkMJxlxw/SfMgJHPEe7rzd/2xVlm1KOgTDMq+AtSE8Snpj5ISnHQZxtzJPkI5yyaxUtNb9W3VZQoCf5PPNbFXdnB4knrjZQ8xt1iFm7tlQ6Jrj3RcM9P3+9cK2UpnlomVMjAakMPDncjrj6fXllaVtiiyNvUOWpFPRwsMJxk81nqo+pO8I+2TmWJyUam5V1LzDyAttxByFJPIiOWqKOaaZ0oy7PNeu0dRNTUlLHTuLYy3lpk4G+Pqs4a5WLJWpPys9SEqRT5ziT3SlFXdODfAJ3wQds55H0jvdGqBSbj0lYp9ZlPFSwnnHAjvFI9oHAOUkHqY8btOVuUd+xtAZcQ5MsrVMPgHJbyMJB9TknHljzjrOzt97Zn86d+sR4p4YRc3xtA4cbcuWUrXVVU7s/DNI4h/EMHnzwc/f1US1do9OoN/T9LpUv4eUaS0UN8al4y2kndRJ5k9Y0ZbthWnb1SFSo9J8NNJSUBzxDq9jzGFKIiBa+ffSqn5DH/RRGo4UtUMZqZ/lHynTTbU7dEj2jq5xb6PDz87DxanXRu/X1WPhTZqsX05SpM8L83PrZSeg4lkEn0Azn0i90rRu0JJqXLgnJmZZWlZeU9jiUDn5I2x6fTEi08+/VJ/5i7/ABxqOErLSQyte97cnONUv2rudVTPiiheWjhycaZ5LPfae/rbTPzD/uKiwWHLsTemtElZlpDzD1LZQ42sZCklsAgxH+09/W2mfmH/AHFRZdOPvf2//lzH7AhzRDNwnTC6kiyUhHU/dZ8vu3qnptezE7S3XESxcL0g/wCg5tq8yM4PmD6x+a";

export function MatrixSlugPage() {
  const { slug } = Route.useParams();
  const [c, setC] = useState<Consultor | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${url}/rest/v1/usuarios_public?select=id,nome,slug,cidade,foto_url,whatsapp,email,telefone,link_ebook,link_patrocinador,link_ferramentas,usuario_matrix&slug=eq.${encodeURIComponent(slug)}&ativo=eq.true&limit=1`,
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
      <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",background:"#080808",color:"#fff",textAlign:"center",padding:24}}>
        <div>
          <div style={{fontSize:40,marginBottom:16}}>⚡</div>
          <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:700}}>Consultor não encontrado</h1>
          <p style={{color:"rgba(255,255,255,0.5)",marginTop:8}}>Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",background:"#080808"}}>
        <div style={{width:32,height:32,border:"3px solid #F57C00",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const linkMetodo = c.link_ebook || DEFAULT_EBOOK;
  const linkPatrocinador = c.usuario_matrix
    ? `https://escritorio.matrix360.com.br/${c.usuario_matrix}`
    : "https://escritorio.matrix360.com.br/";
  const linkFerramentas = c.link_ferramentas || "#";
  const wa = cleanPhone(c.whatsapp || "");
  const whatsappLink = wa ? `https://wa.me/${wa}` : "#";

  return (
    <MatrixLayout
      linkMetodo={linkMetodo}
      linkPatrocinador={linkPatrocinador}
      linkFerramentas={linkFerramentas}
      consultor={{
        nome: c.nome,
        foto_url: c.foto_url,
        cidade: c.cidade,
        whatsapp: c.whatsapp,
      }}
    />
  );
}

export function MatrixLayout({
  linkMetodo,
  linkPatrocinador,
  linkFerramentas,
  consultor,
}: {
  linkMetodo: string;
  linkPatrocinador: string;
  linkFerramentas: string;
  consultor?: { nome: string; foto_url?: string; cidade?: string; whatsapp?: string } | null;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;background:#080808;color:#fff;font-size:16px;line-height:1.6;overflow-x:hidden;}
        h1,h2,h3,h4,.outfit{font-family:'Outfit',sans-serif;line-height:1.1;}
        a{color:inherit;text-decoration:none;}
        ul{list-style:none;}
        img{max-width:100%;display:block;}
        :root{--orange:#F57C00;--orange-deep:#E65100;--red:#E24B4A;--bg:#080808;--bg-alt:#111;--border:rgba(255,255,255,0.08);--border-or:rgba(245,124,0,0.25);--muted:rgba(255,255,255,0.55);--dim:rgba(255,255,255,0.35);}
        .container{max-width:960px;margin:0 auto;padding:0 24px;position:relative;z-index:1;}
        .container-sm{max-width:720px;margin:0 auto;padding:0 24px;}
        section{padding:80px 0;}
        .sec-dark{background:var(--bg-alt);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .sec-label{font-size:11px;font-weight:500;letter-spacing:.14em;color:var(--orange);text-transform:uppercase;margin-bottom:12px;}
        .sec-title{font-family:'Outfit',sans-serif;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-0.02em;color:#fff;margin-bottom:16px;}
        .sec-sub{font-size:16px;color:var(--muted);line-height:1.7;font-weight:300;max-width:580px;}
        .btn-orange{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;background:#F57C00!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border:2px solid #F57C00!important;border-radius:10px!important;padding:15px 28px!important;font-family:'Outfit',sans-serif!important;font-weight:700!important;font-size:15px!important;cursor:pointer!important;text-decoration:none!important;letter-spacing:.02em!important;transition:background .2s!important;}
        .btn-orange:hover{background:#E65100!important;border-color:#E65100!important;}
        .btn-orange-full{display:block!important;width:100%!important;padding:14px!important;background:#F57C00!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border:2px solid #F57C00!important;border-radius:10px!important;font-family:'Outfit',sans-serif!important;font-weight:800!important;font-size:14px!important;cursor:pointer!important;text-align:center!important;text-decoration:none!important;letter-spacing:.03em!important;}
        .btn-orange-full:hover{background:#E65100!important;border-color:#E65100!important;}
        .btn-light{display:block!important;width:100%!important;padding:14px!important;background:rgba(255,255,255,0.1)!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border:1px solid rgba(255,255,255,0.25)!important;border-radius:10px!important;font-family:'Outfit',sans-serif!important;font-weight:700!important;font-size:14px!important;cursor:pointer!important;text-align:center!important;text-decoration:none!important;letter-spacing:.02em!important;}
        .btn-outline-or{display:block!important;width:100%!important;padding:14px!important;background:transparent!important;color:#F57C00!important;-webkit-text-fill-color:#F57C00!important;border:2px solid #F57C00!important;border-radius:10px!important;font-family:'Outfit',sans-serif!important;font-weight:800!important;font-size:14px!important;cursor:pointer!important;text-align:center!important;text-decoration:none!important;letter-spacing:.02em!important;}
        nav{position:sticky;top:0;z-index:100;background:rgba(8,8,8,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:14px 0;}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;}
        .nav-brand{display:flex;align-items:center;gap:12px;}
        .nav-energyia{display:flex;align-items:center;gap:8px;}
        .nav-bolt{width:32px;height:32px;background:var(--orange);border-radius:8px;display:flex;align-items:center;justify-content:center;}
        .nav-energyia-name{font-family:'Outfit',sans-serif;font-weight:700;font-size:18px;color:#fff;letter-spacing:-.02em;}
        .nav-divider{width:1px;height:28px;background:rgba(255,255,255,0.12);}
        .nav-matrix-logo{height:28px;width:auto;}
        .hero{padding:100px 0 80px;position:relative;overflow:hidden;}
        .hero-glow{position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:700px;height:500px;background:radial-gradient(ellipse,rgba(245,124,0,0.16) 0%,transparent 70%);pointer-events:none;}
        .hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(229,57,53,0.12);border:1px solid rgba(229,57,53,0.3);color:#EF9A9A;font-size:12px;font-weight:500;padding:6px 14px;border-radius:20px;margin-bottom:28px;letter-spacing:.04em;}
        .hero h1{font-size:clamp(36px,6vw,64px);font-weight:800;letter-spacing:-0.03em;line-height:1.05;margin-bottom:24px;color:#fff;}
        .hero h1 em{font-style:normal;color:var(--orange);}
        .hero-sub{font-size:18px;color:var(--muted);max-width:560px;line-height:1.7;margin-bottom:40px;font-weight:300;}
        .hero-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:44px;}
        .hero-pill{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);font-size:12px;padding:5px 12px;border-radius:20px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .hero-content>*{animation:fadeUp .6s ease both;}
        .hero-content>*:nth-child(1){animation-delay:.05s}.hero-content>*:nth-child(2){animation-delay:.15s}.hero-content>*:nth-child(3){animation-delay:.25s}.hero-content>*:nth-child(4){animation-delay:.35s}.hero-content>*:nth-child(5){animation-delay:.42s}
        .prob-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:40px;}
        .prob-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 22px;display:flex;align-items:flex-start;gap:14px;}
        .prob-icon{width:32px;height:32px;border-radius:8px;background:rgba(226,75,74,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .prob-card p{font-size:14px;color:rgba(255,255,255,0.7);line-height:1.55;font-style:italic;}
        .sol-step{display:flex;gap:24px;align-items:flex-start;padding:28px 0;border-bottom:1px solid var(--border);}
        .sol-step:last-child{border-bottom:none;}
        .sol-num{width:44px;height:44px;border-radius:50%;background:rgba(245,124,0,0.12);border:1px solid rgba(245,124,0,0.3);color:var(--orange);font-family:'Outfit',sans-serif;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .sol-title{font-family:'Outfit',sans-serif;font-weight:600;font-size:17px;margin-bottom:6px;color:#fff;}
        .sol-desc{font-size:14px;color:var(--muted);line-height:1.6;font-weight:300;}
        .matrix-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(245,124,0,0.12);border:1px solid rgba(245,124,0,0.3);color:#FFB74D;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:.05em;}
        .matrix-box{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:14px;padding:28px;margin-top:24px;}
        .matrix-main{background:rgba(245,124,0,0.06);border:1px solid var(--border-or);border-radius:10px;padding:20px 24px;text-align:center;margin-bottom:20px;}
        .matrix-main strong{font-size:16px;color:#fff;font-family:'Outfit',sans-serif;}
        .matrix-main .acc{color:var(--orange);font-weight:700;display:block;margin-top:6px;font-size:15px;}
        .matrix-main .note{font-size:11px;color:var(--dim);margin-top:6px;}
        .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;}
        .stat-card{border:1px solid var(--border-or);border-radius:10px;padding:16px;text-align:center;background:rgba(245,124,0,0.04);}
        .stat-card .num{font-family:'Outfit',sans-serif;font-size:24px;font-weight:900;color:var(--orange);}
        .stat-card .lbl{font-size:11px;color:var(--dim);margin-top:4px;}
        .acionistas{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .acionista{background:rgba(255,255,255,0.04);border-top:3px solid var(--orange);border-radius:10px;padding:18px;}
        .acionista strong{color:var(--orange);font-family:'Outfit',sans-serif;font-size:15px;display:block;margin-bottom:6px;}
        .acionista p{font-size:13px;color:var(--muted);line-height:1.6;}
        .marcas-title{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin:24px 0 12px;}
        .marcas-list{display:flex;flex-wrap:wrap;gap:8px;}
        .marca-pill{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:7px 14px;font-size:13px;color:rgba(255,255,255,0.7);}
        .tools-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:40px;}
        .tool-card{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:14px;padding:22px;transition:border-color .2s,background .2s;}
        .tool-card:hover{border-color:rgba(245,124,0,0.3);background:rgba(245,124,0,0.04);}
        .tool-card.wide{grid-column:1/-1;}
        .tool-icon-wrap{width:40px;height:40px;border-radius:10px;background:rgba(245,124,0,0.1);display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
        .tool-title{font-family:'Outfit',sans-serif;font-weight:600;font-size:15px;margin-bottom:6px;color:#fff;}
        .tool-desc{font-size:13px;color:var(--muted);line-height:1.55;}
        .bonus-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px;}
        .bonus-card{border:1px solid var(--border-or);border-radius:14px;padding:28px;background:rgba(245,124,0,0.05);position:relative;overflow:hidden;}
        .bonus-label{position:absolute;top:14px;right:14px;font-size:10px;font-weight:700;letter-spacing:.1em;color:var(--orange);opacity:.6;}
        .bonus-num{font-family:'Outfit',sans-serif;font-size:44px;font-weight:800;color:rgba(245,124,0,0.12);line-height:1;margin-bottom:12px;}
        .bonus-title{font-family:'Outfit',sans-serif;font-weight:700;font-size:16px;margin-bottom:8px;color:#fff;}
        .bonus-desc{font-size:13px;color:var(--muted);line-height:1.6;}
        .pers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:36px;}
        .pers-item{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:16px;display:flex;align-items:center;gap:10px;}
        .pers-item span{font-size:13px;color:rgba(255,255,255,0.65);}
        .combos-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:44px;align-items:start;}
        .combo-card{border-radius:18px;padding:28px;position:relative;}
        .combo-card.plain{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-top:3px solid rgba(255,255,255,0.12);}
        .combo-card.featured{background:rgba(245,124,0,0.06);border:2px solid var(--orange);border-top:3px solid var(--orange);}
        .combo-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--orange);color:#fff;font-size:10px;font-weight:800;letter-spacing:.08em;padding:4px 14px;border-radius:20px;white-space:nowrap;font-family:'Outfit',sans-serif;}
        .combo-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-bottom:8px;}
        .combo-lbl.or{color:var(--orange);}
        .combo-title{font-family:'Outfit',sans-serif;font-weight:700;font-size:18px;margin-bottom:6px;color:#fff;}
        .combo-sub{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:16px;line-height:1.5;}
        .combo-list{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;}
        .combo-list li{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5;}
        .combo-list li.bonus-item{color:#FFB74D;font-weight:600;}
        .combo-list li.green-item{color:#81C784;}
        .combo-divider{height:1px;background:var(--border);margin:16px 0;}
        .price-from{font-size:12px;color:var(--dim);text-decoration:line-through;margin-bottom:4px;}
        .price-main{font-family:'Outfit',sans-serif;font-size:34px;font-weight:800;color:var(--orange);line-height:1;margin-bottom:4px;}
        .price-note{font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px;}
        .combo-destaque{background:rgba(245,124,0,0.1);border:1px solid rgba(245,124,0,0.3);border-radius:8px;padding:10px 12px;font-size:12px;color:#FFB74D;font-weight:600;line-height:1.5;margin-bottom:16px;text-align:center;}
        .faq-list{display:flex;flex-direction:column;gap:2px;margin-top:40px;}
        .faq-item{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;}
        .faq-btn{width:100%;background:none;border:none;color:#fff;padding:20px 24px;text-align:left;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:600;font-size:15px;display:flex;justify-content:space-between;align-items:center;gap:16px;}
        .faq-btn:hover{background:rgba(255,255,255,0.03);}
        .faq-ans{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.7;max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s ease;padding:0 24px;}
        .cta-section{padding:100px 0;text-align:center;position:relative;overflow:hidden;}
        .cta-glow{position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(245,124,0,0.15) 0%,transparent 70%);pointer-events:none;}
        footer{border-top:1px solid var(--border);padding:28px 0;text-align:center;font-size:12px;color:rgba(255,255,255,0.25);}
        @media(max-width:680px){
          .prob-grid,.tools-grid,.bonus-grid,.combos-grid,.pers-grid,.stats-grid,.acionistas{grid-template-columns:1fr!important;}
          .tool-card.wide{grid-column:auto!important;}
          .hero{padding:60px 0 50px!important;}
          section{padding:60px 0!important;}
          .hero h1{font-size:34px!important;}
          .hero-sub{font-size:16px!important;}
          .nav-matrix-logo{height:22px!important;}
        }
      `}</style>

      <nav>
        <div className="container">
          <div className="nav-inner">
            <div className="nav-brand">
              <div className="nav-energyia">
                <div className="nav-bolt">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
                </div>
                <span className="nav-energyia-name">EnergyIA</span>
              </div>
              <div className="nav-divider"/>
              <img src={LOGO} alt="Matrix 360" className="nav-matrix-logo"/>
            </div>
            <button className="btn-orange" style={{padding:"10px 20px",fontSize:13}} onClick={()=>document.getElementById("combos")?.scrollIntoView({behavior:"smooth"})}>Ver combos</button>
          </div>
        </div>
      </nav>



      <section className="hero">
        <div className="hero-glow"/>
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF9A9A"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
              Exclusivo Consultores Matrix 360
            </div>
            <h1 className="outfit">Seu cliente quer economizar<br/>— mas tem <em>medo de mudar</em></h1>
            <p className="hero-sub">O EnergyIA ajuda o consultor Matrix a conduzir o cliente com clareza, reduzir o medo da decisão e fechar mais — sem depender só do desconto.</p>
            <div className="hero-pills">
              {["Página de captura","Simulador de desconto","Script de IA","Cartão virtual","Método Híbrido"].map(t=>(
                <span key={t} className="hero-pill">{t}</span>
              ))}
            </div>
            <button className="btn-orange" onClick={()=>document.getElementById("combos")?.scrollIntoView({behavior:"smooth"})}>
              Quero o Método + Ferramentas
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </section>

      <section className="sec-dark">
        <div className="container">
          <div className="sec-label">O problema real</div>
          <h2 className="sec-title outfit">Vender desconto não basta</h2>
          <p className="sec-sub">O cliente até se interessa — mas na hora de decidir, trava.</p>
          <div className="prob-grid">
            {['"Energia compartilhada? Nunca ouvi falar. Parece golpe."','"E se não funcionar? Tenho medo de me arrepender."','"Você tem alguma página que eu possa ver? Um site?"',"O cliente some depois da visita — sem ferramentas para continuar o contato."].map(t=>(
              <div key={t} className="prob-card">
                <div className="prob-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
                <p>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="sec-label">A solução</div>
          <h2 className="sec-title outfit">Consciência para o cliente.<br/>Confiança para o consultor.</h2>
          <p className="sec-sub">Não é só uma ferramenta digital — é um método que orienta o cliente até a decisão de aderir, reduzindo o medo em cada etapa.</p>
          <div style={{marginTop:44}}>
            {[
              {n:"1",t:"O cliente entende o que é energia compartilhada",d:"A página de captura educa, orienta e responde as dúvidas antes de você chegar. O cliente chega na conversa preparado — não assustado."},
              {n:"2",t:"O medo da decisão diminui",d:"O simulador mostra a economia real. O método ajuda você a identificar o bloqueio de cada cliente e conduzir a conversa certa — sem pressão."},
              {n:"3",t:"O consultor fecha com mais segurança",d:"Com ferramentas profissionais e um método claro, você para de depender só do desconto para convencer. A venda acontece porque o cliente se sente seguro."},
            ].map(s=>(
              <div key={s.n} className="sol-step">
                <div className="sol-num">{s.n}</div>
                <div><div className="sol-title">{s.t}</div><p className="sol-desc">{s.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-dark">
        <div className="container">
          <div className="matrix-tag">★ Exclusivo Matrix 360</div>
          <div className="sec-label">A empresa por trás</div>
          <h2 className="sec-title outfit">A diferença que fecha a venda</h2>
          <p className="sec-sub">Qualquer pessoa fala que vende energia. O que fecha a venda é mostrar quem está por trás.</p>
          <div className="matrix-box">
            <div className="matrix-main">
              <strong>A Matrix é a 2ª maior comercializadora de energia do Brasil</strong>
              <span className="acc">e a 1ª entre as empresas privadas independentes.</span>
              <span className="note">*A única empresa à frente tem participação do governo. Na iniciativa privada, a Matrix é líder.</span>
            </div>
            <div className="stats-grid">
              {[["+4.300","unidades consumidoras"],["~50K","clientes ativos"],["+150","usinas parceiras"],["20+DF","estados cobertos"]].map(([n,l])=>(
                <div key={l} className="stat-card"><div className="num">{n}</div><div className="lbl">{l}</div></div>
              ))}
            </div>
            <div className="acionistas">
              <div className="acionista"><strong>Duferco</strong><p>Grupo presente em 22 países. Receita de USD 28 bi. Comercializou +679 TWh de energia no mundo.</p></div>
              <div className="acionista"><strong style={{color:"#fff"}}>Prisma Capital</strong><p>Gestora brasileira independente. R4 bi em ativos. Mais de 100 transações desde a fundação.</p></div>
            </div>
            <div className="marcas-title">Marcas que confiam na Matrix</div>
            <div className="marcas-list">
              {["Toyota","Burger King","Magazine Luiza","Panasonic","Assaí","Vulcabras"].map(m=>(
                <span key={m} className="marca-pill">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="sec-label">O que está incluído</div>
          <h2 className="sec-title outfit">Ferramentas do combo</h2>
          <p className="sec-sub">Tudo personalizado com seu nome, foto, WhatsApp e dados de contato.</p>
          <div className="tools-grid">
            <div className="tool-card"><div className="tool-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg></div><div className="tool-title">Página de captura de clientes</div><p className="tool-desc">Orienta e conduz o cliente até a adesão — educa, tira dúvidas e prepara a decisão antes de você chegar.</p></div>
            <div className="tool-card"><div className="tool-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div className="tool-title">Página de captura de consultores</div><p className="tool-desc">Recrute novos consultores com sua própria página de apresentação e simulador de ganhos.</p></div>
            <div className="tool-card"><div className="tool-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div><div className="tool-title">Simulador de desconto</div><p className="tool-desc">Mostre a economia real em segundos, na hora da visita. O número concreto ajuda o cliente a decidir.</p></div>
            <div className="tool-card"><div className="tool-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div className="tool-title">Simulador de ganhos</div><p className="tool-desc">Apresente o potencial de renda para quem quer se tornar consultor na sua equipe.</p></div>
            <div className="tool-card wide"><div className="tool-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M8 12h.01M16 12h.01"/></svg></div><div className="tool-title">Cartão virtual</div><p className="tool-desc">Sua página com todos os seus links em um só lugar — WhatsApp, simulador, página de clientes, redes sociais. Profissional e fácil de compartilhar.</p></div>
          </div>
        </div>
      </section>

      <section className="sec-dark">
        <div className="container">
          <div className="sec-label">Bônus incluídos</div>
          <h2 className="sec-title outfit">O que vem de presente</h2>
          <div className="bonus-grid">
            <div className="bonus-card"><div className="bonus-label">BÔNUS</div><div className="bonus-num">01</div><div className="bonus-title">Script de IA para WhatsApp</div><p className="bonus-desc">Instrução personalizada para usar com IA e responder objeções, qualificar clientes e criar mensagens que convertem — configurado para o seu perfil e empresa.</p></div>
            <div className="bonus-card"><div className="bonus-label">BÔNUS</div><div className="bonus-num">02</div><div className="bonus-title">Método Híbrido (ebook)</div><p className="bonus-desc">Como combinar a abordagem porta a porta com ferramentas digitais — sem abandonar o que já funciona na sua venda presencial.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="sec-label">Personalização</div>
          <h2 className="sec-title outfit">Tudo no seu nome</h2>
          <p className="sec-sub">As ferramentas são as mesmas para todos — a diferença é que ficam com a sua identidade.</p>
          <div className="pers-grid">
            {[
              {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,l:"Seu nome"},
              {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,l:"Sua foto ou marca pessoal"},
              {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>,l:"Seu WhatsApp"},
              {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,l:"Sua região de atendimento"},
              {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,l:"Desconto oferecido"},
              {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,l:"Dados de contato"},
            ].map(p=>(<div key={p.l} className="pers-item">{p.svg}<span>{p.l}</span></div>))}
          </div>
        </div>
      </section>

      <section id="combos" className="sec-dark">
        <div className="container">
          <div className="sec-label">Combos</div>
          <h2 className="sec-title outfit">Escolha seu ponto de entrada</h2>
          <p className="sec-sub">Três caminhos. Comece pelo método ou entre direto como Consultor Matrix.</p>
          <div className="combos-grid">
            <div className="combo-card plain">
              <div className="combo-lbl">Opção 1</div>
              <div className="combo-title">Método EnergyIA</div>
              <p className="combo-sub">O método completo para vender com mais consciência e menos objeção</p>
              <ul className="combo-list">
                <li className="green-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Método Híbrido (ebook)</li>
                <li className="green-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Como conduzir o cliente até a decisão</li>
                <li className="green-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Como lidar com objeções</li>
                <li className="green-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Script de IA para WhatsApp</li>
              </ul>
              <div className="combo-divider"/>
              <div className="price-from">De R$ 97,00</div>
              <div className="price-main">R$ 17</div>
              <div className="price-note">ou 2 x R$ 8,95</div>
              <a href={linkMetodo} className="btn-light">Quero por R$ 17</a>
            </div>

            <div className="combo-card featured">
              <div className="combo-badge">★ RECOMENDADO</div>
              <div className="combo-lbl or" style={{marginTop:12}}>Opção 2</div>
              <div className="combo-title">Consultor Matrix 360</div>
              <p className="combo-sub">Plataforma + treinamento + link próprio + bônus exclusivo</p>
              <ul className="combo-list">
                <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Tudo do Método EnergyIA</li>
                <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Plataforma Matrix com link próprio</li>
                <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Materiais de marketing prontos</li>
                <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>Canal exclusivo de suporte</li>
                <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>R00 por indicação (pré-lançamento)</li>
                <li className="bonus-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFB74D" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>🎁 Bônus: Combo Ferramentas incluso</li>
              </ul>
              <div className="combo-divider"/>
              <div className="price-main">R$ 249,90</div>
              <div className="price-note">+ R4,90/mês · parcele em até 3x no cartão</div>
              <div className="combo-destaque">✅ Somente este combo oferece a opção de ser consultor oficial da Matrix</div>
              <a href={linkPatrocinador} className="btn-orange-full">ENTRAR COMO CONSULTOR MATRIX</a>
            </div>

            <div className="combo-card plain">
              <div className="combo-lbl">Opção 3</div>
              <div className="combo-title">Combo Ferramentas</div>
              <p className="combo-sub">Todas as ferramentas para vender com profissionalismo</p>
              <ul className="combo-list">
                {["Página de captura de clientes","Página de captura de consultores","Simulador de desconto","Simulador de ganhos","Cartão virtual","Bônus: Script de IA","Bônus: Método Híbrido (ebook)"].map(i=>(
                  <li key={i}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>{i}</li>
                ))}
              </ul>
              <div className="combo-divider"/>
              <div className="price-from">De R$ 497,00</div>
              <div className="price-main">R$ 197</div>
              <div className="price-note">ou 10 x R$ 19,70</div>
              <a href={linkFerramentas} className="btn-outline-or">Quero por R$ 197</a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-sm">
          <div className="sec-label">Dúvidas frequentes</div>
          <h2 className="sec-title outfit">FAQ</h2>
          <div className="faq-list">
            {[
              {q:"Preciso saber de tecnologia para usar?",a:"Não. Tudo é configurado para você — basta informar seus dados e as ferramentas ficam prontas para usar."},
              {q:"Preciso mudar de distribuidora?",a:"Não. Sua distribuidora continua sendo a mesma — CEMIG, COPEL, ENEL, Energisa, Equatorial, seja qual for. A Matrix injeta créditos descontados na sua fatura. Você não muda nada na rotina."},
              {q:"Funciona para qualquer estado?",a:"A Matrix opera em 20 estados + DF: PR, SP, MG, GO, BA, PE, CE, RN, ES, MS, MT, TO, AL, PA, MA, PI e outras praças."},
              {q:"O desconto é garantido?",a:"No Energia Fácil, o desconto é garantido pela própria Matrix, mesmo se a distribuidora falhar. É a Garantia Matrix. No GD Padrão o desconto depende da distribuidora local."},
              {q:"Como recebo as ferramentas depois de comprar?",a:"Assim que o pagamento é confirmado, o acesso é liberado na área administrativa do ambiente de compra e enviado também por e-mail. Se precisar de ajuda, pode chamar pelo WhatsApp."},
              {q:"Isso é seguro? É regulamentado?",a:"Sim. GD é regulamentado pela ANEEL, através da lei 14.300. A Matrix é comercializadora homologada, opera desde 2019 e é a 2ª maior do Brasil — presente no ranking oficial da CCEE."},
              {q:"O script de IA conecta ao WhatsApp automaticamente?",a:"Não. O script é uma instrução personalizada que você usa manualmente com ferramentas de IA para criar mensagens, responder objeções e qualificar clientes."},
            ].map((f,i)=><FaqItem key={i} q={f.q} a={f.a} openFaq={openFaq} setOpenFaq={setOpenFaq} index={i}/>)}
          </div>
        </div>
      </section>

      <section className="cta-section sec-dark">
        <div className="cta-glow"/>
        <div className="container" style={{textAlign:"center"}}>
          <h2 className="sec-title outfit" style={{maxWidth:560,margin:"0 auto 16px"}}>Pronto para vender com mais profissionalismo?</h2>
          <p className="sec-sub" style={{margin:"0 auto 40px",textAlign:"center"}}>Comece hoje. Sem mensalidade. Sem complicação.</p>
          <button className="btn-orange" onClick={()=>document.getElementById("combos")?.scrollIntoView({behavior:"smooth"})} style={{margin:"0 auto"}}>
            Ver os combos
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.3)",marginTop:16}}>Dúvidas antes de comprar? Fale pelo WhatsApp.</p>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>© {new Date().getFullYear()} EnergyIA × Matrix 360. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}

function FaqItem({q,a,openFaq,setOpenFaq,index}:{q:string;a:string;openFaq:number|null;setOpenFaq:(i:number|null)=>void;index:number}) {
  const open = openFaq === index;
  return (
    <div className="faq-item" style={open?{borderColor:"rgba(245,124,0,0.2)"}:{}}>
      <button className="faq-btn outfit" onClick={()=>setOpenFaq(open?null:index)}>
        {q}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="#F57C00" style={{flexShrink:0,transition:"transform .3s",transform:open?"rotate(45deg)":"none"}}>
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
      <div className="faq-ans" style={{maxHeight:open?300:0,padding:open?"0 24px 20px":"0 24px"}}>{a}</div>
    </div>
  );
}
