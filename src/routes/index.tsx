import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

// ↓↓↓ LINKS DE COMPRA — substitua o # pelo link real quando disponível
const LINK_METODO = "#";       // Método EnergyIA R$17
const LINK_FERRAMENTAS  = "#";       // Combo Ferramentas R$197

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0D0D0D", color: "#fff", overflowX: "hidden" }}>

      {/* FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .lp h1,.lp h2,.lp h3,.lp .syne{font-family:'Syne',sans-serif;}
        .lp a{color:inherit;text-decoration:none;}
        .lp ul{list-style:none;}
        .hero-glow{position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:700px;height:500px;background:radial-gradient(ellipse,rgba(245,124,0,0.18) 0%,transparent 70%);pointer-events:none;}
        .cta-glow{position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(245,124,0,0.15) 0%,transparent 70%);pointer-events:none;}
        .tool-card:hover{border-color:rgba(245,124,0,0.3)!important;background:rgba(245,124,0,0.04)!important;}
        .faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s ease;padding:0 24px;}
        .faq-item.open .faq-a{max-height:200px;padding:0 24px 20px;}
        .faq-item.open .faq-arrow{transform:rotate(45deg);}
        .faq-arrow{transition:transform .3s;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .hero-content>*{animation:fadeUp .6s ease both;}
        .hero-content>*:nth-child(1){animation-delay:.05s}
        .hero-content>*:nth-child(2){animation-delay:.15s}
        .hero-content>*:nth-child(3){animation-delay:.25s}
        .hero-content>*:nth-child(4){animation-delay:.35s}
        .hero-content>*:nth-child(5){animation-delay:.42s}
        @media(max-width:680px){
          .prob-grid,.tools-grid,.bonus-grid,.combos-grid,.pers-grid{grid-template-columns:1fr!important;}
          .tool-wide{grid-column:auto!important;}
          .hero-section{padding:60px 0 50px!important;}
          .lp section{padding:60px 0!important;}
        }
      `}</style>

      <div className="lp">

        {/* NAV */}
        <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(13,13,13,0.85)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"14px 0"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,background:"#F57C00",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
              </div>
              <div>
                <div className="syne" style={{fontWeight:700,fontSize:20,letterSpacing:"-0.02em"}}>EnergyIA</div>
                <div style={{fontSize:9,fontWeight:300,letterSpacing:".15em",color:"#888",marginTop:-4}}>MÉTODO INTELIGENTE</div>
              </div>
            </div>
            <button onClick={()=>scrollTo("combos")} style={{background:"#F57C00",color:"white",border:"none",padding:"10px 20px",borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
              Ver combos
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero-section" style={{padding:"100px 0 80px",position:"relative",overflow:"hidden"}}>
          <div className="hero-glow"/>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px",position:"relative",zIndex:1}}>
            <div className="hero-content">
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(245,124,0,0.12)",border:"1px solid rgba(245,124,0,0.3)",color:"#FFB74D",fontSize:12,fontWeight:500,padding:"6px 14px",borderRadius:20,marginBottom:28,letterSpacing:".04em"}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB74D"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
                Para consultores de energia compartilhada
              </div>
              <h1 className="syne" style={{fontSize:"clamp(36px,6vw,64px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.05,marginBottom:24}}>
                Seu cliente quer economizar<br/>— mas tem <span style={{color:"#F57C00"}}>medo de mudar</span>
              </h1>
              <p style={{fontSize:18,color:"rgba(255,255,255,0.6)",maxWidth:560,lineHeight:1.7,marginBottom:40,fontWeight:300}}>
                O EnergyIA ajuda o consultor a conduzir o cliente com clareza, reduzir o medo da decisão e fechar mais — sem depender só do desconto.
              </p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:44}}>
                {["Página de captura","Simulador de desconto","Script de IA","Cartão virtual","Método Híbrido"].map(t=>(
                  <span key={t} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:12,padding:"5px 12px",borderRadius:20}}>{t}</span>
                ))}
              </div>
              <button onClick={()=>scrollTo("combos")} style={{display:"inline-flex",alignItems:"center",gap:10,background:"#F57C00",color:"white",padding:"16px 32px",borderRadius:10,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,border:"none",cursor:"pointer"}}>
                Quero o EnergyIA
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* PROBLEMA */}
        <section style={{padding:"80px 0",background:"#111",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".14em",color:"#F57C00",textTransform:"uppercase",marginBottom:12}}>O problema real</div>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:16}}>Vender desconto não basta</h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",lineHeight:1.7,fontWeight:300}}>O cliente até se interessa — mas na hora de decidir, trava.</p>
            <div className="prob-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:40}}>
              {[
                "\"Energia compartilhada? Nunca ouvi falar. Parece golpe.\"",
                "\"E se não funcionar? Tenho medo de me arrepender.\"",
                "\"Você tem alguma página que eu possa ver? Um site?\"",
                "O cliente some depois da visita — sem ferramentas para continuar o contato.",
              ].map(t=>(
                <div key={t} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"20px 22px",display:"flex",alignItems:"flex-start",gap:14}}>
                  <div style={{width:32,height:32,borderRadius:8,background:"rgba(226,75,74,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </div>
                  <p style={{fontSize:14,color:"rgba(255,255,255,0.65)",lineHeight:1.55,fontStyle:"italic"}}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUÇÃO */}
        <section style={{padding:"80px 0"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".14em",color:"#F57C00",textTransform:"uppercase",marginBottom:12}}>A solução</div>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:16}}>Consciência para o cliente.<br/>Confiança para o consultor.</h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",lineHeight:1.7,fontWeight:300,maxWidth:580}}>Não é só uma ferramenta digital — é um método que orienta o cliente até a decisão de aderir, reduzindo o medo em cada etapa.</p>
            <div style={{marginTop:44}}>
              {[
                {n:"1",t:"O cliente entende o que é energia compartilhada",d:"A página de captura educa, orienta e responde as dúvidas antes de você chegar. O cliente chega na conversa preparado — não assustado."},
                {n:"2",t:"O medo da decisão diminui",d:"O simulador mostra a economia real. O método ajuda você a identificar o bloqueio de cada cliente e conduzir a conversa certa — sem pressão."},
                {n:"3",t:"O consultor fecha com mais segurança",d:"Com ferramentas profissionais e um método claro, você para de depender só do desconto para convencer. A venda acontece porque o cliente se sente seguro."},
              ].map((s,i)=>(
                <div key={s.n} style={{display:"flex",gap:24,alignItems:"flex-start",padding:"28px 0",borderBottom:i<2?"1px solid rgba(255,255,255,0.08)":"none"}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(245,124,0,0.12)",border:"1px solid rgba(245,124,0,0.3)",color:"#F57C00",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.n}</div>
                  <div>
                    <div className="syne" style={{fontWeight:600,fontSize:17,marginBottom:6}}>{s.t}</div>
                    <p style={{fontSize:14,color:"rgba(255,255,255,0.55)",lineHeight:1.6,fontWeight:300}}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FERRAMENTAS */}
        <section style={{padding:"80px 0",background:"#111",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".14em",color:"#F57C00",textTransform:"uppercase",marginBottom:12}}>O que está incluído</div>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:16}}>Ferramentas do combo</h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",lineHeight:1.7,fontWeight:300}}>Tudo personalizado com seu nome, foto, WhatsApp e dados de contato.</p>
            <div className="tools-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginTop:40}}>
              {[
                {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>, t:"Página de captura de clientes", d:"Orienta e conduz o cliente até a adesão — educa, tira dúvidas e prepara a decisão antes de você chegar.", wide:false},
                {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, t:"Página de captura de consultores", d:"Recrute novos consultores com sua própria página de apresentação e simulador de ganhos.", wide:false},
                {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, t:"Simulador de desconto", d:"Mostre a economia real em segundos, na hora da visita. O número concreto ajuda o cliente a decidir.", wide:false},
                {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, t:"Simulador de ganhos", d:"Apresente o potencial de renda para quem quer se tornar consultor na sua equipe.", wide:false},
                {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M8 12h.01M16 12h.01"/></svg>, t:"Cartão virtual", d:"Sua página com todos os seus links em um só lugar — WhatsApp, simulador, página de clientes, redes sociais. Profissional e fácil de compartilhar.", wide:true},
              ].map(f=>(
                <div key={f.t} className={`tool-card${f.wide?" tool-wide":""}`} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:22,transition:"border-color .2s,background .2s",gridColumn:f.wide?"1/-1":"auto"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:"rgba(245,124,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>{f.icon}</div>
                  <div className="syne" style={{fontWeight:600,fontSize:15,marginBottom:6}}>{f.t}</div>
                  <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.55}}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BONUS */}
        <section style={{padding:"80px 0"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".14em",color:"#F57C00",textTransform:"uppercase",marginBottom:12}}>Bônus incluídos</div>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:40}}>O que vem de presente</h2>
            <div className="bonus-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {n:"01",t:"Script de IA para WhatsApp",d:"Instrução personalizada para usar com IA e responder objeções, qualificar clientes e criar mensagens que convertem — configurado para o seu perfil e empresa."},
                {n:"02",t:"Método Híbrido (ebook)",d:"Como combinar a abordagem porta a porta com ferramentas digitais — sem abandonar o que já funciona na sua venda presencial."},
              ].map(b=>(
                <div key={b.n} style={{border:"1px solid rgba(245,124,0,0.2)",borderRadius:14,padding:28,background:"rgba(245,124,0,0.04)",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:14,right:14,fontSize:10,fontWeight:700,letterSpacing:".1em",color:"#F57C00",opacity:0.6}}>BÔNUS</div>
                  <div className="syne" style={{fontSize:44,fontWeight:800,color:"rgba(245,124,0,0.12)",lineHeight:1,marginBottom:12}}>{b.n}</div>
                  <div className="syne" style={{fontWeight:700,fontSize:16,marginBottom:8}}>{b.t}</div>
                  <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PERSONALIZAÇÃO */}
        <section style={{padding:"80px 0",background:"#111",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".14em",color:"#F57C00",textTransform:"uppercase",marginBottom:12}}>Personalização</div>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:16}}>Tudo no seu nome</h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",lineHeight:1.7,fontWeight:300,maxWidth:580}}>As ferramentas são as mesmas para todos — a diferença é que ficam com a sua identidade.</p>
            <div className="pers-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:36}}>
              {[
                {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,l:"Seu nome"},
                {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,l:"Sua foto ou marca pessoal"},
                {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>,l:"Seu WhatsApp"},
                {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,l:"Sua região de atendimento"},
                {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,l:"Desconto oferecido"},
                {svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,l:"Dados de contato"},
              ].map(p=>(
                <div key={p.l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:16,display:"flex",alignItems:"center",gap:10}}>
                  {p.svg}
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{p.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMBOS */}
        <section id="combos" style={{padding:"80px 0"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".14em",color:"#F57C00",textTransform:"uppercase",marginBottom:12}}>Combos</div>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:16}}>Escolha seu ponto de entrada</h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",lineHeight:1.7,fontWeight:300}}>Comece pelo método ou vá direto para o combo completo de ferramentas.</p>
            <div className="combos-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:44,alignItems:"start"}}>

              {/* MÉTODO */}
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:32}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,letterSpacing:".06em",padding:"5px 12px",borderRadius:20,marginBottom:16,background:"rgba(46,125,50,0.15)",color:"#81C784",border:"1px solid rgba(46,125,50,0.3)"}}>Entrada</div>
                <div className="syne" style={{fontWeight:700,fontSize:20,marginBottom:6}}>Método EnergyIA</div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:20,lineHeight:1.5}}>O método completo para vender com mais consciência e menos objeção</p>
                <ul style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                  {["Método Híbrido (ebook)","Como conduzir o cliente até a decisão","Como lidar com objeções","Script de IA para atendimento no WhatsApp"].map(i=>(
                    <li key={i} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#81C784" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>{i}
                    </li>
                  ))}
                </ul>
                <div style={{height:1,background:"rgba(255,255,255,0.08)",margin:"20px 0"}}/>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",textDecoration:"line-through",marginBottom:4}}>De R$ 97,00</div>
                <div className="syne" style={{fontSize:36,fontWeight:800,color:"#F57C00",lineHeight:1,marginBottom:4}}>R$ 17</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:20}}>ou 2 x R$ 8,95</div>
                {/* ↓↓↓ LINK DE COMPRA — MÉTODO R$17 — substitua LINK_METODO quando disponível */}
                <a href={LINK_METODO} style={{display:"block",width:"100%",padding:14,background:"transparent",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",textAlign:"center"}}>
                  Quero por R$ 17
                </a>
              </div>

              {/* COMBO */}
              <div style={{background:"rgba(245,124,0,0.06)",border:"2px solid #F57C00",borderRadius:18,padding:32}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,letterSpacing:".06em",padding:"5px 12px",borderRadius:20,marginBottom:16,background:"rgba(245,124,0,0.15)",color:"#FFB74D",border:"1px solid rgba(245,124,0,0.3)"}}>⚡ Mais completo</div>
                <div className="syne" style={{fontWeight:700,fontSize:20,marginBottom:6}}>Combo Ferramentas</div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:20,lineHeight:1.5}}>Tudo que você precisa para vender com profissionalismo</p>
                <ul style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                  {["Página de captura de clientes","Página de captura de consultores","Simulador de desconto","Simulador de ganhos","Cartão virtual","Bônus: Script de IA","Bônus: Método Híbrido (ebook)"].map(i=>(
                    <li key={i} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>{i}
                    </li>
                  ))}
                </ul>
                <div style={{height:1,background:"rgba(255,255,255,0.08)",margin:"20px 0"}}/>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",textDecoration:"line-through",marginBottom:4}}>De R$ 497,00</div>
                <div className="syne" style={{fontSize:36,fontWeight:800,color:"#F57C00",lineHeight:1,marginBottom:4}}>R$ 197</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:20}}>ou 10 x R$ 19,70</div>
                {/* ↓↓↓ LINK DE COMPRA — COMBO R$197 — substitua LINK_FERRAMENTAS quando disponível */}
                <a href={LINK_FERRAMENTAS} style={{display:"block",width:"100%",padding:14,background:"#F57C00",color:"white",border:"none",borderRadius:10,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",textAlign:"center"}}>
                  Quero por R$ 197
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{padding:"80px 0",background:"#111",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{maxWidth:720,margin:"0 auto",padding:"0 24px"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:".14em",color:"#F57C00",textTransform:"uppercase",marginBottom:12}}>Dúvidas frequentes</div>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:40}}>FAQ</h2>
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {[
                {q:"Preciso saber de tecnologia para usar?",a:"Não. Tudo é configurado para você — basta informar seus dados e as ferramentas ficam prontas para usar."},
                {q:"Funciona para qualquer estado?",a:"As ferramentas funcionam em qualquer lugar do Brasil. O percentual de desconto disponível pode variar por região."},
                {q:"Já sou consultor de outra empresa. Posso usar?",a:"Sim, desde que você atue com energia compartilhada. As ferramentas são independentes e se adaptam ao seu contexto."},
                {q:"Como recebo as ferramentas depois de comprar?",a:"Assim que o pagamento é confirmado, o acesso é liberado na área administrativa do ambiente de compra e enviado também por e-mail. Se precisar de ajuda na configuração, pode chamar pelo WhatsApp."},
                {q:"O script de IA conecta ao WhatsApp automaticamente?",a:"Não. O script é uma instrução personalizada que você usa manualmente com ferramentas de IA para criar mensagens, responder objeções e qualificar clientes. A integração automática é um recurso disponível em outra etapa."},
              ].map(f=>(
                <FaqItem key={f.q} q={f.q} a={f.a}/>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{padding:"100px 0",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div className="cta-glow"/>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px",position:"relative",zIndex:1}}>
            <h2 className="syne" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:16,maxWidth:560,margin:"0 auto 16px"}}>Pronto para vender com mais profissionalismo?</h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.55)",lineHeight:1.7,fontWeight:300,maxWidth:580,margin:"0 auto 40px"}}>Comece hoje. Sem mensalidade. Sem complicação.</p>
            <button onClick={()=>scrollTo("combos")} style={{display:"inline-flex",alignItems:"center",gap:10,background:"#F57C00",color:"white",padding:"16px 32px",borderRadius:10,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,border:"none",cursor:"pointer"}}>
              Ver os combos
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.3)",marginTop:16}}>Dúvidas antes de comprar? Fale pelo WhatsApp.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"28px 0",textAlign:"center",fontSize:12,color:"rgba(255,255,255,0.25)"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>
            © {new Date().getFullYear()} EnergyIA — Método Inteligente. Todos os direitos reservados.
          </div>
        </footer>

      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,overflow:"hidden",marginBottom:2}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:"none",border:"none",color:"white",padding:"20px 24px",textAlign:"left",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:15,display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
        {q}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{flexShrink:0,transition:"transform .3s",transform:open?"rotate(45deg)":"rotate(0deg)"}}>
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
      <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.7,maxHeight:open?200:0,overflow:"hidden",transition:"max-height .3s ease, padding .3s ease",padding:open?"0 24px 20px":"0 24px"}}>
        {a}
      </div>
    </div>
  );
}

import React from "react";
