import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
const DEFAULT_FERRAMENTAS = "#";

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
  const linkFerramentas = c.link_ferramentas || DEFAULT_FERRAMENTAS;
  const wa = cleanPhone(c.whatsapp || "");
  const whatsappLink = wa ? `https://wa.me/${wa}` : "#";

  return <MatrixContent c={c} linkMetodo={linkMetodo} linkPatrocinador={linkPatrocinador} linkFerramentas={linkFerramentas} whatsappLink={whatsappLink} openFaq={openFaq} setOpenFaq={setOpenFaq} />;
}

function MatrixContent({ c, linkMetodo, linkPatrocinador, linkFerramentas, whatsappLink, openFaq, setOpenFaq }: any) {
  const faqs = [
    {q:"Preciso saber de tecnologia para usar?",a:"Não. Tudo é configurado para você — basta informar seus dados e as ferramentas ficam prontas para usar."},
    {q:"Preciso mudar de distribuidora?",a:"Não. Sua distribuidora continua sendo a mesma. A Matrix injeta créditos descontados na sua fatura. Você não muda nada na rotina."},
    {q:"Funciona para qualquer estado?",a:"A Matrix opera em 20 estados + DF: PR, SP, MG, GO, BA, PE, CE, RN, ES, MS, MT, TO, AL, PA, MA, PI e outras praças."},
    {q:"O desconto é garantido?",a:"No Energia Fácil, o desconto é garantido pela própria Matrix. É a Garantia Matrix. No GD Padrão o desconto depende da distribuidora local."},
    {q:"Como recebo as ferramentas depois de comprar?",a:"Assim que o pagamento é confirmado, o acesso é liberado e enviado por e-mail. Se precisar de ajuda, pode chamar pelo WhatsApp."},
    {q:"Isso é seguro? É regulamentado?",a:"Sim. GD é regulamentado pela ANEEL, lei 14.300. A Matrix é comercializadora homologada desde 2019 — 2ª maior do Brasil."},
    {q:"O script de IA conecta ao WhatsApp automaticamente?",a:"Não. É uma instrução que você usa manualmente com ferramentas de IA para criar mensagens e qualificar clientes."},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;background:#080808;color:#fff;font-size:16px;line-height:1.6;overflow-x:hidden;}
        h1,h2,h3,h4{font-family:'Outfit',sans-serif;line-height:1.1;}
        a{color:inherit;text-decoration:none;}
        ul{list-style:none;}
        img{max-width:100%;display:block;}
        :root{--orange:#F57C00;--bg-alt:#111;--border:rgba(255,255,255,0.08);--border-or:rgba(245,124,0,0.25);--muted:rgba(255,255,255,0.55);--dim:rgba(255,255,255,0.35);}
        .container{max-width:960px;margin:0 auto;padding:0 24px;}
        .container-sm{max-width:720px;margin:0 auto;padding:0 24px;}
        section{padding:80px 0;}
        .sec-dark{background:var(--bg-alt);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .sec-label{font-size:11px;font-weight:500;letter-spacing:.14em;color:var(--orange);text-transform:uppercase;margin-bottom:12px;}
        .sec-title{font-family:'Outfit',sans-serif;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-0.02em;color:#fff;margin-bottom:16px;}
        .sec-sub{font-size:16px;color:var(--muted);line-height:1.7;font-weight:300;max-width:580px;}
        .btn-orange-full{display:block!important;width:100%!important;padding:14px!important;background:#F57C00!important;color:#fff!important;border:2px solid #F57C00!important;border-radius:10px!important;font-family:'Outfit',sans-serif!important;font-weight:800!important;font-size:14px!important;text-align:center!important;text-decoration:none!important;}
        .btn-light{display:block!important;width:100%!important;padding:14px!important;background:rgba(255,255,255,0.1)!important;color:#fff!important;border:1px solid rgba(255,255,255,0.25)!important;border-radius:10px!important;font-family:'Outfit',sans-serif!important;font-weight:700!important;font-size:14px!important;text-align:center!important;text-decoration:none!important;}
        .btn-outline-or{display:block!important;width:100%!important;padding:14px!important;background:transparent!important;color:#F57C00!important;border:2px solid #F57C00!important;border-radius:10px!important;font-family:'Outfit',sans-serif!important;font-weight:800!important;font-size:14px!important;text-align:center!important;text-decoration:none!important;}
        nav{position:sticky;top:0;z-index:100;background:rgba(8,8,8,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:14px 0;}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;}
        .nav-energyia{display:flex;align-items:center;gap:8px;}
        .nav-bolt{width:32px;height:32px;background:#F57C00;border-radius:8px;display:flex;align-items:center;justify-content:center;}
        .combos-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:44px;align-items:start;}
        .combo-card{border-radius:18px;padding:28px;position:relative;}
        .combo-card.plain{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-top:3px solid rgba(255,255,255,0.12);}
        .combo-card.featured{background:rgba(245,124,0,0.06);border:2px solid #F57C00;border-top:3px solid #F57C00;}
        .combo-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:#F57C00;color:#fff;font-size:10px;font-weight:800;padding:4px 14px;border-radius:20px;white-space:nowrap;}
        .combo-list{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;}
        .combo-list li{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5;}
        .combo-list li.bonus-item{color:#FFB74D;font-weight:600;}
        .combo-list li.green-item{color:#81C784;}
        .combo-divider{height:1px;background:var(--border);margin:16px 0;}
        .price-from{font-size:12px;color:var(--dim);text-decoration:line-through;margin-bottom:4px;}
        .price-main{font-family:'Outfit',sans-serif;font-size:34px;font-weight:800;color:#F57C00;line-height:1;margin-bottom:4px;}
        .price-note{font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px;}
        .combo-destaque{background:rgba(245,124,0,0.1);border:1px solid rgba(245,124,0,0.3);border-radius:8px;padding:10px 12px;font-size:12px;color:#FFB74D;font-weight:600;margin-bottom:16px;text-align:center;}
        .faq-list{display:flex;flex-direction:column;gap:2px;margin-top:40px;}
        .faq-item{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;}
        .faq-btn{width:100%;background:none;border:none;color:#fff;padding:20px 24px;text-align:left;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:600;font-size:15px;display:flex;justify-content:space-between;align-items:center;gap:16px;}
        .faq-ans{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.7;overflow:hidden;transition:max-height .3s ease,padding .3s ease;padding:0 24px;}
        footer{border-top:1px solid var(--border);padding:28px 0;text-align:center;font-size:12px;color:rgba(255,255,255,0.25);}
        @media(max-width:680px){.combos-grid{grid-template-columns:1fr!important;}section{padding:60px 0!important;}}
      `}</style>

      <nav>
        <div className="container">
          <div className="nav-inner">
            <div className="nav-energyia">
              <div className="nav-bolt">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
              </div>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,color:"#fff"}}>EnergyIA</span>
            </div>
            <a href="#combos" style={{background:"#F57C00",color:"#fff",padding:"10px 20px",borderRadius:10,fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,textDecoration:"none"}}>Ver combos</a>
          </div>
        </div>
      </nav>

      <div style={{background:"rgba(245,124,0,0.06)",borderBottom:"1px solid rgba(245,124,0,0.2)",padding:"14px 24px"}}>
        <div className="container" style={{display:"flex",alignItems:"center",gap:14}}>
          {c.foto_url
            ? <img src={c.foto_url} alt={c.nome} style={{width:44,height:44,borderRadius:"50%",border:"2px solid #F57C00",objectFit:"cover"}}/>
            : <div style={{width:44,height:44,borderRadius:"50%",background:"#F57C00",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,color:"#fff"}}>{c.nome.charAt(0)}</div>
          }
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#F57C00"}}>Seu consultor</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:"#fff"}}>{c.nome}</div>
            {c.cidade && <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{c.cidade}</div>}
          </div>
          {whatsappLink !== "#" && (
            <a href={whatsappLink} target="_blank" rel="noreferrer"
              style={{marginLeft:"auto",background:"#25D366",color:"#fff",padding:"8px 16px",borderRadius:8,fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,textDecoration:"none"}}>
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <section style={{padding:"80px 0",background:"#080808"}}>
        <div className="container">
          <div className="sec-label">Combos</div>
          <h2 className="sec-title">Escolha seu ponto de entrada</h2>
          <p className="sec-sub">Três caminhos. Comece pelo método ou entre direto como Consultor Matrix.</p>
          <div id="combos" className="combos-grid">

            <div className="combo-card plain">
              <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:8}}>Opção 1</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,marginBottom:6,color:"#fff"}}>Método EnergyIA</div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:16,lineHeight:1.5}}>O método completo para vender com mais consciência e menos objeção</p>
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
              <a href={linkMetodo} target="_blank" rel="noreferrer" className="btn-light">Quero por R$ 17</a>
            </div>

            <div className="combo-card featured">
              <div className="combo-badge">★ RECOMENDADO</div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#F57C00",marginBottom:8,marginTop:12}}>Opção 2</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,marginBottom:6,color:"#fff"}}>Consultor Matrix 360</div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:16,lineHeight:1.5}}>Plataforma + treinamento + link próprio + bônus exclusivo</p>
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
              <a href={linkPatrocinador} target="_blank" rel="noreferrer" className="btn-orange-full">ENTRAR COMO CONSULTOR MATRIX</a>
            </div>

            <div className="combo-card plain">
              <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:8}}>Opção 3</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,marginBottom:6,color:"#fff"}}>Combo Ferramentas</div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:16,lineHeight:1.5}}>Todas as ferramentas para vender com profissionalismo</p>
              <ul className="combo-list">
                {["Página de captura de clientes","Página de captura de consultores","Simulador de desconto","Simulador de ganhos","Cartão virtual","Bônus: Script de IA","Bônus: Método Híbrido (ebook)"].map(i=>(
                  <li key={i}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>{i}</li>
                ))}
              </ul>
              <div className="combo-divider"/>
              <div className="price-from">De R$ 497,00</div>
              <div className="price-main">R$ 197</div>
              <div className="price-note">ou 10 x R$ 19,70</div>
              <a href={linkFerramentas} target="_blank" rel="noreferrer" className="btn-outline-or">Quero por R$ 197</a>
            </div>

          </div>
        </div>
      </section>

      <section style={{padding:"80px 0"}}>
        <div className="container-sm">
          <div className="sec-label">Dúvidas frequentes</div>
          <h2 className="sec-title">FAQ</h2>
          <div className="faq-list">
            {faqs.map((f,i)=>(
              <div key={i} className="faq-item">
                <button className="faq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  {f.q}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="#F57C00" style={{flexShrink:0,transition:"transform .3s",transform:openFaq===i?"rotate(45deg)":"none"}}>
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <div className="faq-ans" style={{maxHeight:openFaq===i?300:0,padding:openFaq===i?"0 24px 20px":"0 24px"}}>{f.a}</div>
              </div>
            ))}
          </div>
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

