import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/matrix")({
  component: MatrixPage,
});

// ↓↓↓ LINKS PADRÃO DA PÁGINA GENÉRICA (sem slug)
const LINK_METODO       = "#";  // substitua quando disponível
const LINK_PATROCINADOR = "#";  // substitua quando disponível
const LINK_FERRAMENTAS  = "#";  // substitua quando disponível

function MatrixPage() {
  return <MatrixLayout linkMetodo={LINK_METODO} linkPatrocinador={LINK_PATROCINADOR} linkFerramentas={LINK_FERRAMENTAS} />;
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
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const LOGO_MATRIX = "data:image/png;base64,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";

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const faqs = [
    { q: "Preciso saber de tecnologia para usar?", a: "Não. Tudo é configurado para você — basta informar seus dados e as ferramentas ficam prontas para usar." },
    { q: "Preciso mudar de distribuidora?", a: "Não. Sua distribuidora continua sendo a mesma — CEMIG, COPEL, ENEL, Energisa, Equatorial, seja qual for. A Matrix injeta créditos descontados na sua fatura. Você não muda nada na rotina." },
    { q: "Funciona para qualquer estado?", a: "A Matrix opera em 20 estados + DF: PR, SP, MG, GO, BA, PE, CE, RN, ES, MS, MT, TO, AL, PA, MA, PI e outras praças." },
    { q: "O desconto é garantido?", a: "No Energia Fácil, o desconto é garantido pela própria Matrix, mesmo se a distribuidora falhar. É a Garantia Matrix. No GD Padrão o desconto depende da distribuidora local." },
    { q: "Como recebo as ferramentas depois de comprar?", a: "Assim que o pagamento é confirmado, o acesso é liberado na área administrativa do ambiente de compra e enviado também por e-mail. Se precisar de ajuda, pode chamar pelo WhatsApp." },
    { q: "Isso é seguro? É regulamentado?", a: "Sim. GD é regulamentado pela ANEEL, através da lei 14.300. A Matrix é comercializadora homologada, opera desde 2019 e é a 2ª maior do Brasil — presente no ranking oficial da CCEE." },
    { q: "O script de IA conecta ao WhatsApp automaticamente?", a: "Não. O script é uma instrução personalizada que você usa manualmente com ferramentas de IA para criar mensagens, responder objeções e qualificar clientes. A integração automática é um recurso disponível em outra etapa." },
  ];

  const s: React.CSSProperties = {};

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080808", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .lp a{color:inherit;text-decoration:none;}
        .lp ul{list-style:none;}
        .tool-card:hover{border-color:rgba(245,124,0,0.3)!important;background:rgba(245,124,0,0.04)!important;}
        .faq-ans{overflow:hidden;transition:max-height .3s ease,padding .3s ease;}
        @media(max-width:680px){
          .prob-grid,.tools-grid,.bonus-grid,.combos-grid,.pers-grid,.stats-grid,.acionistas{grid-template-columns:1fr!important;}
          .tool-wide{grid-column:auto!important;}
          .hero-sec{padding:60px 0 50px!important;}
          .lp section{padding:60px 0!important;}
        }
      `}</style>

      <div className="lp">

        {/* NAV */}
        <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,8,8,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"14px 0" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:32, height:32, background:"#F57C00", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
                </div>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:"#fff" }}>EnergyIA</span>
              </div>
              <div style={{ width:1, height:26, background:"rgba(255,255,255,0.12)" }}/>
              <img src={LOGO_MATRIX} alt="Matrix 360" style={{ height:26, width:"auto" }}/>
            </div>
            <button onClick={() => scrollTo("combos")} style={{ background:"#F57C00", color:"#fff", border:"none", padding:"10px 20px", borderRadius:8, fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              Ver combos
            </button>
          </div>
        </nav>

        {/* CONSULTOR CARD — aparece só quando há slug */}
        {consultor && (
          <div style={{ background:"rgba(245,124,0,0.06)", borderBottom:"1px solid rgba(245,124,0,0.2)", padding:"14px 24px" }}>
            <div style={{ maxWidth:960, margin:"0 auto", display:"flex", alignItems:"center", gap:14 }}>
              {consultor.foto_url
                ? <img src={consultor.foto_url} alt={consultor.nome} style={{ width:44, height:44, borderRadius:"50%", border:"2px solid #F57C00", objectFit:"cover" }}/>
                : <div style={{ width:44, height:44, borderRadius:"50%", background:"#F57C00", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:"#fff" }}>{consultor.nome.charAt(0)}</div>
              }
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"#F57C00" }}>Seu consultor</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:"#fff" }}>{consultor.nome}</div>
                {consultor.cidade && <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>{consultor.cidade}</div>}
              </div>
              {consultor.whatsapp && (
                <a href={`https://wa.me/${consultor.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                  style={{ marginLeft:"auto", background:"#25D366", color:"#fff", padding:"8px 16px", borderRadius:8, fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12 }}>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {/* HERO */}
        <section className="hero-sec" style={{ padding:"100px 0 80px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-120, left:"50%", transform:"translateX(-50%)", width:700, height:500, background:"radial-gradient(ellipse,rgba(245,124,0,0.16) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(229,57,53,0.12)", border:"1px solid rgba(229,57,53,0.3)", color:"#EF9A9A", fontSize:12, fontWeight:500, padding:"6px 14px", borderRadius:20, marginBottom:28, letterSpacing:".04em" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF9A9A"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
              Exclusivo Consultores Matrix 360
            </div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(36px,6vw,62px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.05, marginBottom:24, color:"#fff" }}>
              Seu cliente quer economizar<br/>— mas tem <span style={{ color:"#F57C00" }}>medo de mudar</span>
            </h1>
            <p style={{ fontSize:18, color:"rgba(255,255,255,0.6)", maxWidth:560, lineHeight:1.7, marginBottom:40, fontWeight:300 }}>
              O EnergyIA ajuda o consultor Matrix a conduzir o cliente com clareza, reduzir o medo da decisão e fechar mais — sem depender só do desconto.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:44 }}>
              {["Página de captura","Simulador de desconto","Script de IA","Cartão virtual","Método Híbrido"].map(t => (
                <span key={t} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontSize:12, padding:"5px 12px", borderRadius:20 }}>{t}</span>
              ))}
            </div>
            <button onClick={() => scrollTo("combos")} style={{ display:"inline-flex", alignItems:"center", gap:10, background:"#F57C00", color:"#fff", padding:"16px 32px", borderRadius:10, fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, border:"none", cursor:"pointer" }}>
              Quero o Método + Ferramentas
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </section>

        {/* PROBLEMA */}
        <section style={{ padding:"80px 0", background:"#111", borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>O problema real</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:16, color:"#fff" }}>Vender desconto não basta</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontWeight:300 }}>O cliente até se interessa — mas na hora de decidir, trava.</p>
            <div className="prob-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:40 }}>
              {[
                '"Energia compartilhada? Nunca ouvi falar. Parece golpe."',
                '"E se não funcionar? Tenho medo de me arrepender."',
                '"Você tem alguma página que eu possa ver? Um site?"',
                "O cliente some depois da visita — sem ferramentas para continuar o contato.",
              ].map(t => (
                <div key={t} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"20px 22px", display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:"rgba(226,75,74,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </div>
                  <p style={{ fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.55, fontStyle:"italic" }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUÇÃO */}
        <section style={{ padding:"80px 0" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>A solução</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:16, color:"#fff" }}>Consciência para o cliente.<br/>Confiança para o consultor.</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontWeight:300, maxWidth:580 }}>Não é só uma ferramenta digital — é um método que orienta o cliente até a decisão de aderir, reduzindo o medo em cada etapa.</p>
            <div style={{ marginTop:44 }}>
              {[
                { n:"1", t:"O cliente entende o que é energia compartilhada", d:"A página de captura educa, orienta e responde as dúvidas antes de você chegar. O cliente chega na conversa preparado — não assustado." },
                { n:"2", t:"O medo da decisão diminui", d:"O simulador mostra a economia real. O método ajuda você a identificar o bloqueio de cada cliente e conduzir a conversa certa — sem pressão." },
                { n:"3", t:"O consultor fecha com mais segurança", d:"Com ferramentas profissionais e um método claro, você para de depender só do desconto para convencer. A venda acontece porque o cliente se sente seguro." },
              ].map((step, i) => (
                <div key={step.n} style={{ display:"flex", gap:24, alignItems:"flex-start", padding:"28px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(245,124,0,0.12)", border:"1px solid rgba(245,124,0,0.3)", color:"#F57C00", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{step.n}</div>
                  <div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:17, marginBottom:6, color:"#fff" }}>{step.t}</div>
                    <p style={{ fontSize:14, color:"rgba(255,255,255,0.55)", lineHeight:1.6, fontWeight:300 }}>{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO EXCLUSIVA MATRIX */}
        <section style={{ padding:"80px 0", background:"#111", borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(245,124,0,0.12)", border:"1px solid rgba(245,124,0,0.3)", color:"#FFB74D", fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:20, marginBottom:16 }}>★ Exclusivo Matrix 360</div>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>A empresa por trás</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:16, color:"#fff" }}>A diferença que fecha a venda</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontWeight:300, maxWidth:580 }}>Qualquer pessoa fala que vende energia. O que fecha a venda é mostrar quem está por trás.</p>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:28, marginTop:24 }}>
              <div style={{ background:"rgba(245,124,0,0.06)", border:"1px solid rgba(245,124,0,0.25)", borderRadius:10, padding:"20px 24px", textAlign:"center", marginBottom:20 }}>
                <strong style={{ fontSize:16, color:"#fff", fontFamily:"'Outfit',sans-serif" }}>A Matrix é a 2ª maior comercializadora de energia do Brasil</strong>
                <span style={{ color:"#F57C00", fontWeight:700, display:"block", marginTop:6, fontSize:15 }}>e a 1ª entre as empresas privadas independentes.</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:6, display:"block" }}>*A única empresa à frente tem participação do governo. Na iniciativa privada, a Matrix é líder.</span>
              </div>
              <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                {[["+ 4.300","unidades consumidoras"],["~50K","clientes ativos"],["+ 150","usinas parceiras"],["20+DF","estados cobertos"]].map(([n,l]) => (
                  <div key={l} style={{ border:"1px solid rgba(245,124,0,0.25)", borderRadius:10, padding:16, textAlign:"center", background:"rgba(245,124,0,0.04)" }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:900, color:"#F57C00" }}>{n}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="acionistas" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:"rgba(255,255,255,0.04)", borderTop:"3px solid #F57C00", borderRadius:10, padding:18 }}>
                  <strong style={{ color:"#F57C00", fontFamily:"'Outfit',sans-serif", fontSize:15, display:"block", marginBottom:6 }}>Duferco</strong>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>Grupo presente em 22 países. Receita de USD 28 bi. Comercializou +679 TWh de energia no mundo.</p>
                </div>
                <div style={{ background:"rgba(255,255,255,0.04)", borderTop:"3px solid #F57C00", borderRadius:10, padding:18 }}>
                  <strong style={{ color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:15, display:"block", marginBottom:6 }}>Prisma Capital</strong>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>Gestora brasileira independente. R4 bi em ativos. Mais de 100 transações desde a fundação.</p>
                </div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", margin:"24px 0 12px" }}>Marcas que confiam na Matrix</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["Toyota","Burger King","Magazine Luiza","Panasonic","Assaí","Vulcabras"].map(m => (
                  <span key={m} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"7px 14px", fontSize:13, color:"rgba(255,255,255,0.7)" }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FERRAMENTAS */}
        <section style={{ padding:"80px 0" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>O que está incluído</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:16, color:"#fff" }}>Ferramentas do combo</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontWeight:300 }}>Tudo personalizado com seu nome, foto, WhatsApp e dados de contato.</p>
            <div className="tools-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginTop:40 }}>
              {[
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>, t:"Página de captura de clientes", d:"Orienta e conduz o cliente até a adesão — educa, tira dúvidas e prepara a decisão antes de você chegar.", wide:false },
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, t:"Página de captura de consultores", d:"Recrute novos consultores com sua própria página de apresentação e simulador de ganhos.", wide:false },
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, t:"Simulador de desconto", d:"Mostre a economia real em segundos, na hora da visita. O número concreto ajuda o cliente a decidir.", wide:false },
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, t:"Simulador de ganhos", d:"Apresente o potencial de renda para quem quer se tornar consultor na sua equipe.", wide:false },
                { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M8 12h.01M16 12h.01"/></svg>, t:"Cartão virtual", d:"Sua página com todos os seus links em um só lugar — WhatsApp, simulador, página de clientes, redes sociais.", wide:true },
              ].map(f => (
                <div key={f.t} className={`tool-card${f.wide ? " tool-wide" : ""}`} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:22, transition:"border-color .2s,background .2s", gridColumn: f.wide ? "1/-1" : "auto" }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:"rgba(245,124,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>{f.icon}</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:15, marginBottom:6, color:"#fff" }}>{f.t}</div>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.55 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BÔNUS */}
        <section style={{ padding:"80px 0", background:"#111", borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>Bônus incluídos</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:40, color:"#fff" }}>O que vem de presente</h2>
            <div className="bonus-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { n:"01", t:"Script de IA para WhatsApp", d:"Instrução personalizada para usar com IA e responder objeções, qualificar clientes e criar mensagens que convertem — configurado para o seu perfil e empresa." },
                { n:"02", t:"Método Híbrido (ebook)", d:"Como combinar a abordagem porta a porta com ferramentas digitais — sem abandonar o que já funciona na sua venda presencial." },
              ].map(b => (
                <div key={b.n} style={{ border:"1px solid rgba(245,124,0,0.25)", borderRadius:14, padding:28, background:"rgba(245,124,0,0.05)", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:14, right:14, fontSize:10, fontWeight:700, letterSpacing:".1em", color:"#F57C00", opacity:.6 }}>BÔNUS</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:44, fontWeight:800, color:"rgba(245,124,0,0.12)", lineHeight:1, marginBottom:12 }}>{b.n}</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, marginBottom:8, color:"#fff" }}>{b.t}</div>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PERSONALIZAÇÃO */}
        <section style={{ padding:"80px 0" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>Personalização</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:16, color:"#fff" }}>Tudo no seu nome</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontWeight:300, maxWidth:580 }}>As ferramentas são as mesmas para todos — a diferença é que ficam com a sua identidade.</p>
            <div className="pers-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:36 }}>
              {[
                { svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, l:"Seu nome" },
                { svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, l:"Sua foto ou marca pessoal" },
                { svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>, l:"Seu WhatsApp" },
                { svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, l:"Sua região de atendimento" },
                { svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>, l:"Desconto oferecido" },
                { svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, l:"Dados de contato" },
              ].map(p => (
                <div key={p.l} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:16, display:"flex", alignItems:"center", gap:10 }}>
                  {p.svg}<span style={{ fontSize:13, color:"rgba(255,255,255,0.65)" }}>{p.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMBOS */}
        <section id="combos" style={{ padding:"80px 0", background:"#111", borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>Combos</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:16, color:"#fff" }}>Escolha seu ponto de entrada</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontWeight:300 }}>Três caminhos. Comece pelo método ou entre direto como Consultor Matrix.</p>
            <div className="combos-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginTop:44, alignItems:"start" }}>

              {/* MÉTODO */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderTop:"3px solid rgba(255,255,255,0.15)", borderRadius:18, padding:28 }}>
                <div style={{ display:"inline-flex", fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:20, marginBottom:16, background:"rgba(46,125,50,0.15)", color:"#81C784", border:"1px solid rgba(46,125,50,0.3)" }}>Entrada</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, marginBottom:6, color:"#fff" }}>Método EnergyIA</div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:16, lineHeight:1.5 }}>O método completo para vender com mais consciência e menos objeção</p>
                <ul style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:20 }}>
                  {["Método Híbrido (ebook)","Como conduzir o cliente até a decisão","Como lidar com objeções","Script de IA para atendimento no WhatsApp"].map(i => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:12, color:"#81C784", lineHeight:1.5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" style={{ flexShrink:0, marginTop:2 }}><polyline points="20 6 9 17 4 12"/></svg>{i}
                    </li>
                  ))}
                </ul>
                <div style={{ height:1, background:"rgba(255,255,255,0.08)", margin:"16px 0" }}/>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", textDecoration:"line-through", marginBottom:4 }}>De R$ 97,00</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:34, fontWeight:800, color:"#F57C00", lineHeight:1, marginBottom:4 }}>R$ 17</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>ou 2 x R$ 8,95</div>
                <a href={linkMetodo} target="_blank" rel="noreferrer" style={{ display:"block", width:"100%", padding:14, background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.25)", borderRadius:10, fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, textAlign:"center", textDecoration:"none" }}>
                  Quero por R$ 17
                </a>
              </div>

              {/* CONSULTOR MATRIX */}
              <div style={{ background:"rgba(245,124,0,0.06)", border:"2px solid #F57C00", borderTop:"3px solid #F57C00", borderRadius:18, padding:28, position:"relative" }}>
                <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:"#F57C00", color:"#fff", fontSize:10, fontWeight:800, letterSpacing:".08em", padding:"4px 14px", borderRadius:20, whiteSpace:"nowrap", fontFamily:"'Outfit',sans-serif" }}>★ RECOMENDADO</div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"#F57C00", marginBottom:8, marginTop:12 }}>Opção 2</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, marginBottom:6, color:"#fff" }}>Consultor Matrix 360</div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:16, lineHeight:1.5 }}>Plataforma + treinamento + link próprio + bônus exclusivo</p>
                <ul style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:20 }}>
                  {["Tudo do Método EnergyIA","Plataforma Matrix com link próprio","Materiais de marketing prontos","Canal exclusivo de suporte","R00 por indicação (pré-lançamento)"].map(i => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:12, color:"rgba(255,255,255,0.8)", lineHeight:1.5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{ flexShrink:0, marginTop:2 }}><polyline points="20 6 9 17 4 12"/></svg>{i}
                    </li>
                  ))}
                  <li style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:12, color:"#FFB74D", fontWeight:600, lineHeight:1.5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFB74D" strokeWidth="2.5" style={{ flexShrink:0, marginTop:2 }}><polyline points="20 6 9 17 4 12"/></svg>🎁 Bônus: Combo Ferramentas incluso
                  </li>
                </ul>
                <div style={{ height:1, background:"rgba(255,255,255,0.08)", margin:"16px 0" }}/>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:34, fontWeight:800, color:"#F57C00", lineHeight:1, marginBottom:4 }}>R$ 249,90</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:14 }}>+ R4,90/mês · parcele em até 3x no cartão</div>
                <div style={{ background:"rgba(245,124,0,0.1)", border:"1px solid rgba(245,124,0,0.3)", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#FFB74D", fontWeight:600, lineHeight:1.5, marginBottom:16, textAlign:"center" }}>
                  ✅ Somente este combo oferece a opção de ser consultor oficial da Matrix
                </div>
                <a href={linkPatrocinador} target="_blank" rel="noreferrer" style={{ display:"block", width:"100%", padding:14, background:"#F57C00", color:"#fff", border:"none", borderRadius:10, fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, textAlign:"center", textDecoration:"none", letterSpacing:".02em" }}>
                  ENTRAR COMO CONSULTOR MATRIX
                </a>
              </div>

              {/* COMBO FERRAMENTAS */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderTop:"3px solid rgba(255,255,255,0.15)", borderRadius:18, padding:28 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:8 }}>Opção 3</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, marginBottom:6, color:"#fff" }}>Combo Ferramentas</div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:16, lineHeight:1.5 }}>Todas as ferramentas para vender com profissionalismo</p>
                <ul style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:20 }}>
                  {["Página de captura de clientes","Página de captura de consultores","Simulador de desconto","Simulador de ganhos","Cartão virtual","Bônus: Script de IA","Bônus: Método Híbrido (ebook)"].map(i => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:12, color:"rgba(255,255,255,0.8)", lineHeight:1.5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{ flexShrink:0, marginTop:2 }}><polyline points="20 6 9 17 4 12"/></svg>{i}
                    </li>
                  ))}
                </ul>
                <div style={{ height:1, background:"rgba(255,255,255,0.08)", margin:"16px 0" }}/>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", textDecoration:"line-through", marginBottom:4 }}>De R$ 497,00</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:34, fontWeight:800, color:"#F57C00", lineHeight:1, marginBottom:4 }}>R$ 197</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>ou 10 x R$ 19,70</div>
                <a href={linkFerramentas} target="_blank" rel="noreferrer" style={{ display:"block", width:"100%", padding:14, background:"transparent", color:"#F57C00", border:"2px solid #F57C00", borderRadius:10, fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, textAlign:"center", textDecoration:"none", letterSpacing:".02em" }}>
                  Quero por R$ 197
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding:"80px 0" }}>
          <div style={{ maxWidth:720, margin:"0 auto", padding:"0 24px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:".14em", color:"#F57C00", textTransform:"uppercase", marginBottom:12 }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:40, color:"#fff" }}>FAQ</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {faqs.map((f, i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, overflow:"hidden" }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width:"100%", background:"none", border:"none", color:"#fff", padding:"20px 24px", textAlign:"left", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:15, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                    {f.q}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2" style={{ flexShrink:0, transition:"transform .3s", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <div className="faq-ans" style={{ fontSize:14, color:"rgba(255,255,255,0.55)", lineHeight:1.7, maxHeight: faqOpen === i ? 300 : 0, padding: faqOpen === i ? "0 24px 20px" : "0 24px" }}>
                    {f.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{ padding:"100px 0", textAlign:"center", position:"relative", overflow:"hidden", background:"#111", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ position:"absolute", bottom:-100, left:"50%", transform:"translateX(-50%)", width:600, height:400, background:"radial-gradient(ellipse,rgba(245,124,0,0.15) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:16, maxWidth:560, margin:"0 auto 16px", color:"#fff" }}>Pronto para vender com mais profissionalismo?</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontWeight:300, maxWidth:580, margin:"0 auto 40px" }}>Comece hoje. Sem mensalidade. Sem complicação.</p>
            <button onClick={() => scrollTo("combos")} style={{ display:"inline-flex", alignItems:"center", gap:10, background:"#F57C00", color:"#fff", padding:"16px 32px", borderRadius:10, fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, border:"none", cursor:"pointer" }}>
              Ver os combos
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.3)", marginTop:16 }}>Dúvidas antes de comprar? Fale pelo WhatsApp.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"28px 0", textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.25)" }}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px" }}>
            © {new Date().getFullYear()} EnergyIA × Matrix 360. Todos os direitos reservados.
          </div>
        </footer>

      </div>
    </div>
  );
}

import React from "react";
