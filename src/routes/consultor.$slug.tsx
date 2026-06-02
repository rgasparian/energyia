import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { cleanPhone } from "@/lib/utils-energyia";
import { Zap, MessageCircle, ChevronDown, Menu, X, Calendar, Sparkles, RefreshCw, Trophy, Users, TrendingUp, Clock } from "lucide-react";

export const Route = createFileRoute("/consultor/$slug")({
  loader: async ({ params }) => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;

    const response = await fetch(`${url}/rest/v1/usuarios_public?select=*&slug=eq.${encodeURIComponent(params.slug)}&limit=1`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) ? (data[0] as Consultor | undefined) ?? null : (data as Consultor | null);
  },
  component: ConsultorPage,
});

interface Consultor {
  id: string; nome: string; slug: string; cidade?: string; foto_url?: string;
  whatsapp?: string; email?: string; telefone?: string;
  instagram?: string; facebook?: string; youtube?: string;
  link_ebook?: string; link_cliente?: string; link_guia?: string; link_patrocinador?: string;
  usuario_matrix?: string;
}

const IMG = {
  logo: "/energyia-logo.svg",
  logoFooter: "/energyia-logo-footer.svg",
  robo: "/energyia-robo.svg",
  marcas1: "/energyia-marcas-1.svg",
  marcas2: "/energyia-marcas-2.svg",
};

export function ConsultorPage() {
  const c = Route.useLoaderData();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;700&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  if (!c) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] px-4 text-center text-white" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <div>
          <Zap className="mx-auto mb-4 h-10 w-10 text-[#F57C00]" />
          <h1 className="text-2xl font-bold">Consultor não encontrado</h1>
        </div>
      </div>
    );
  }

  const wa = cleanPhone(c.whatsapp || "");
  const whatsappLink = wa ? `https://wa.me/${wa}` : "#";
  const ig = (c.instagram || "").replace(/^@/, "");
  const matrixLink = c.usuario_matrix
    ? `https://escritorio.matrix360.com.br/${c.usuario_matrix}`
    : "https://escritorio.matrix360.com.br/";
  const ebookLink = c.link_ebook || "https://pay.hotmart.com/E105718812K";
  const guiaLink = c.link_guia || "https://drive.google.com/file/d/1o5XMzN3-PO_jRbgAbSAThl-bCuuWYApV/view?usp=drive_link";
  const ferramentasLink = c.link_ferramentas || "https://go.hotmart.com/S106094049W";

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif", color: "#1A1A1A" }} className="bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <img src={IMG.logo} alt="EnergyIA" width={180} />
          <div className="hidden gap-8 md:flex">
            <a href="#" className="text-sm font-medium hover:text-[#F57C00]">Início</a>
            <a href="#simulador" className="text-sm font-medium hover:text-[#F57C00]">Simulador</a>
            <a href="#pacotes" className="text-sm font-medium hover:text-[#F57C00]">Pacotes</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t bg-white px-4 py-3 md:hidden">
            <a href="#" onClick={() => setMenuOpen(false)} className="block py-2 text-sm">Início</a>
            <a href="#simulador" onClick={() => setMenuOpen(false)} className="block py-2 text-sm">Simulador</a>
            <a href="#pacotes" onClick={() => setMenuOpen(false)} className="block py-2 text-sm">Pacotes</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="px-4 pb-16 pt-20 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <h1 style={{ fontFamily: "Sora, sans-serif" }} className="text-3xl font-extrabold leading-tight md:text-5xl">
              Como Usar IA para Conseguir Mais Clientes na Revenda de Energia Solar Compartilhada
            </h1>
            <p className="mt-5 text-lg text-[#555]">
              O guia para autônomos, consultores e vendedores que querem construir uma carteira recorrente — sem instalar nada, sem investimento inicial, sem depender de sorte para fechar.
            </p>
            <a href="#pacotes" className="mt-7 inline-flex rounded-lg bg-[#F57C00] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#E65100]">
              GUIA PRÁTICO + MÉTODO
            </a>
          </div>
          <div className="md:col-span-2">
            <img src={IMG.robo} alt="Robô EnergyIA" className="mx-auto w-full max-w-sm" />
          </div>
        </div>
      </section>

      {/* CONSULTOR CARD */}
      <section className="bg-[#fff8f4] py-8">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4">
          {c.foto_url ? (
            <img src={c.foto_url} alt={c.nome} className="h-16 w-16 rounded-full border-2 border-[#F57C00] object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F57C00] text-2xl font-bold text-white">{c.nome.charAt(0)}</div>
          )}
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F57C00]">Seu consultor</p>
            <p className="text-lg font-bold">{c.nome}</p>
            {c.cidade && <p className="text-sm text-[#666]">{c.cidade}</p>}
          </div>
          {wa && (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="hidden rounded-lg bg-[#25D366] px-4 py-2 text-sm font-bold text-white sm:inline-flex">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* O PROBLEMA */}
      <Section label="O PROBLEMA" title="A conta que ninguém deixa de pagar — e que pode te gerar renda todo mês">
        <div className="grid gap-6 text-[#555] md:grid-cols-2">
          <div className="space-y-4">
            <p>A energia elétrica é a única conta que o brasileiro não consegue deixar de pagar. Não tem como cancelar, não tem como parcelar, não tem como negociar. Só pagar — e todo mês.</p>
            <p>Mas existe um mercado que poucas pessoas conhecem e que cresce 40% ao ano no Brasil: energia compartilhada por geração distribuída. Você não instala nada. Não muda de distribuidora. Paga menos — e ainda pode ganhar indicando outros.</p>
          </div>
          <div className="space-y-4">
            <p>Desde 2023, mais de 3 milhões de brasileiros aderiram ao modelo. A regulamentação federal (Lei 14.300) abriu o mercado para comercializadoras independentes. E o modelo de consultores — pessoas que indicam o serviço e ganham recorrência por cliente ativo — ainda está no começo.</p>
            <p>Quem entra agora constrói uma carteira enquanto o mercado ainda tem espaço. Daqui a 3 anos, o espaço vai ser bem menor.</p>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-[#F57C00] bg-[#fff8f4] p-6">
          <p className="font-bold text-[#1A1A1A]">
            O consultor que usa IA para prospectar consegue 10x mais leads qualificados com o mesmo tempo que o consultor tradicional usa para abordar 2 pessoas.
          </p>
        </div>
      </Section>

      {/* COMO FUNCIONA */}
      <div className="bg-[#F5F5F5]">
        <Section label="COMO FUNCIONA" title="Energia compartilhada em 3 linhas">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Usina gera", d: "Usinas solares e eólicas parceiras injetam energia na rede elétrica nacional." },
              { n: "02", t: "Crédito na conta", d: "Esses créditos são transferidos para a sua fatura — abatendo o valor que você pagaria à distribuidora." },
              { n: "03", t: "Você paga menos", d: "Sem obra, sem painel, sem investimento. Só o desconto — de até 20% no Energia Fácil e até 35% no GD Padrão." },
            ].map((it) => (
              <div key={it.n} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="text-4xl font-extrabold text-[#F57C00]" style={{ fontFamily: "Sora, sans-serif" }}>{it.n}</div>
                <h3 className="mt-3 text-lg font-bold">{it.t}</h3>
                <p className="mt-2 text-sm text-[#555]">{it.d}</p>
              </div>
            ))}
          </div>
          <img src={IMG.marcas1} alt="Marcas clientes" className="mx-auto mt-10 w-full max-w-3xl" />
        </Section>
      </div>

      {/* QUEM É A MATRIX */}
      <Section label="QUEM ESTÁ POR TRÁS" title="A Matrix Energia — 2ª maior comercializadora do Brasil">
        <p className="text-[#555]">
          A Matrix Energia é a empresa por trás do produto que você vai oferecer. Opera desde 2019, é homologada pela ANEEL e aparece no ranking oficial da CCEE — a câmara de comercialização de energia elétrica do Brasil. Presente em 20 estados + DF.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["2019", "Ano de fundação"], ["20+", "Estados atendidos"],
            ["150+", "Usinas parceiras"], ["2ª", "Maior do Brasil"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-[#F5F5F5] p-5 text-center">
              <div className="text-3xl font-extrabold text-[#F57C00]" style={{ fontFamily: "Sora, sans-serif" }}>{n}</div>
              <div className="mt-1 text-xs text-[#666]">{l}</div>
            </div>
          ))}
        </div>
        <img src={IMG.marcas2} alt="Parceiros" className="mx-auto mt-8 w-full max-w-3xl" />
        <div className="mt-8 rounded-xl bg-[#1A1A1A] p-6 text-white">
          <p className="text-lg italic">"Não somos uma startup. Somos uma empresa regulamentada, com track record, ranking público e garantia contratual de desconto."</p>
        </div>
      </Section>

      {/* O QUE VOCÊ GANHA */}
      <div className="bg-[#F5F5F5]">
        <Section label="O QUE VOCÊ GANHA" title="Três fontes de renda — em cima da mesma conta de luz">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { I: Zap, t: "Comissão de Conexão", d: "Ganhe por cada cliente ativo que você conectar. Calculado sobre o valor faturável da conta — pago pela Matrix no fechamento do mês." },
              { I: RefreshCw, t: "Recorrência Mensal", d: "Todo mês que o cliente estiver ativo, você recebe um percentual do consumo. Acumula com o tempo — e cresce conforme sua carteira cresce." },
              { I: Trophy, t: "Bônus de Volume", d: "Alcançou a meta do mês? Recebe bônus adicionais por volume. Quanto mais você fecha, mais o bônus representa." },
            ].map(({ I, t, d }) => (
              <div key={t} className="rounded-xl bg-white p-6 shadow-sm">
                <I className="h-10 w-10 text-[#F57C00]" />
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-[#555]">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-[#1A1A1A] p-6 text-white">
            <p className="text-sm opacity-80">10 clientes com conta média de R$350</p>
            <p className="mt-2">→ Comissão conexão: <strong className="text-[#F57C00]">~R$ 1.785</strong></p>
            <p>→ Recorrência mensal no mês 12: <strong className="text-[#F57C00]">~R$ 300/mês</strong></p>
            <p>→ Total acumulado em 12 meses: <strong className="text-[#F57C00]">~R$ 25.000+</strong></p>
            <p className="mt-3 text-xs text-white/50">Não é promessa. É matemática — e te mostramos o caminho.</p>
          </div>
        </Section>
      </div>

      {/* O FATOR IA */}
      <Section label="O FATOR IA" title="A janela que está aberta agora — e não vai ficar para sempre">
        <p className="text-[#555]">
          Inteligência Artificial está transformando o jeito de vender. Não daqui a 5 anos. <strong>Agora.</strong> E no mercado de energia, quem adotar primeiro vai construir uma carteira enorme enquanto os outros ainda estão prospectando manualmente.
        </p>
        <p className="mt-4 font-bold text-[#F57C00]">
          Enquanto o consultor tradicional aborda um cliente por dia, o consultor que usa IA qualifica dezenas — e só fala com quem já quer fechar.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            { I: Sparkles, t: "Funil completo no WhatsApp", d: "Automação com IA que qualifica e aquece o lead — 24h por dia, sem você precisar estar online. O lead entra frio e sai pronto para fechar." },
            { I: Users, t: "Rodízio para anunciantes", d: "Sistema de tráfego pago com rodízio entre consultores — reduz o custo individual e maximiza o resultado coletivo do grupo." },
            { I: TrendingUp, t: "Criativo no Meta sem infringir regras", d: "O que falar nos anúncios para atrair leads qualificados sem ser reprovado ou ter a conta bloqueada no Meta." },
            { I: MessageCircle, t: "Script de fechamento", d: "Do primeiro contato ao link de assinatura — testado e ajustado para o mercado de energia. Resposta para cada objeção." },
            { I: Clock, t: "Carteira escalável", d: "Como construir uma base que cresce através de indicações e expansão de rede — com renda recorrente aumentando todo mês." },
          ].map(({ I, t, d }) => (
            <div key={t} className="flex gap-4 rounded-xl border border-[#eee] bg-white p-5">
              <I className="h-8 w-8 flex-shrink-0 text-[#F57C00]" />
              <div>
                <h4 className="font-bold">{t}</h4>
                <p className="mt-1 text-sm text-[#555]">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl bg-[#1A1A1A] p-6 text-white">
          <p className="text-lg italic">"A IA está no pico de adoção. Quem entrar no mercado de energia usando IA agora <span className="text-[#F57C00] font-bold">vai construir uma carteira que os outros vão demorar anos para alcançar.</span>"</p>
        </div>
      </Section>

      {/* PACOTES */}
      <div id="pacotes" className="bg-[#F5F5F5]">
        <Section label="PRÓXIMOS PASSOS" title="Você tem o mapa. Agora precisa da rota.">
          <p className="text-[#555]">Você entendeu o mercado, quem é a Matrix, como funciona o produto, o que você ganha e como a IA acelera tudo. Agora são três caminhos:</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* OPÇÃO 1 */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="h-1 bg-[#F57C00]" />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#666]">OPÇÃO 1</p>
                <h3 className="mt-2 text-xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Método EnergyIA</h3>
                <p className="mt-2 text-sm text-[#666]">Como configurar sua automação de IA no WhatsApp para conquistar clientes e consultores de energia.</p>
                <p className="mt-4 text-sm text-[#999] line-through">Valor real: R$ 97,00</p>
                <p className="text-5xl font-extrabold" style={{ fontFamily: "Sora, sans-serif" }}>R$ 17</p>
                <p className="text-xs font-bold text-[#F57C00]">Preço de pré-lançamento</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {["Funil completo do anúncio ao fechamento", "Script de Automação de IA no WhatsApp", "Script de prospecção e fechamento", "Script Configuração de anúncios no Meta", "Sem precisar saber programar"].map((it) => (
                    <li key={it} className="flex gap-2"><span className="text-green-600">✓</span>{it}</li>
                  ))}
                </ul>
                <a href={ebookLink} target="_blank" rel="noreferrer" className="mt-6 block rounded-lg bg-[#F57C00] py-3 text-center text-sm font-bold text-white hover:bg-[#E65100]">
                  INICIAR AGORA POR R$ 17
                </a>
              </div>
            </div>
            {/* OPÇÃO 2 — DESTAQUE */}
            <div className="relative overflow-hidden rounded-xl border-2 border-[#F57C00] bg-white shadow-xl lg:scale-105">
              <div className="h-1 bg-[#F57C00]" />
              <div className="absolute right-4 top-3 rounded-full bg-[#F57C00] px-3 py-1 text-xs font-bold text-white">★ RECOMENDADO</div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#F57C00]">OPÇÃO 2</p>
                <h3 className="mt-2 text-xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Consultor Matrix 360</h3>
                <p className="mt-2 text-sm text-[#666]">Acesso à plataforma, treinamento, materiais de marketing, canal exclusivo e seu link de indicação próprio.</p>
                <p className="mt-4 text-5xl font-extrabold text-[#F57C00]" style={{ fontFamily: "Sora, sans-serif" }}>R$ 249,90</p>
                <p className="text-xs text-[#666]">+ R$ 34,90/mês · Parcele em até 3x no cartão</p>
                <div className="mt-3 rounded-md bg-[#fff8f4] p-3 text-xs text-red-700">
                  ⚠️ Pré-lançamento · Vagas limitadas · Preço pode ser reajustado sem aviso
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  <li className="flex gap-2"><span className="text-green-600">✓</span>Tudo do Método EnergyIA incluso</li>
                  <li className="flex gap-2"><span className="text-green-600">✓</span>Plataforma Matrix com link próprio</li>
                  <li className="flex gap-2"><span className="text-green-600">✓</span>Materiais de marketing prontos</li>
                  <li className="flex gap-2"><span className="text-green-600">✓</span>Canal exclusivo de suporte</li>
                  <li className="flex gap-2"><span className="text-green-600">✓</span><span className="font-bold text-[#F57C00]">Bônus pré-lançamento: R$100 por indicação</span></li>
                </ul>
                <a href={matrixLink} target="_blank" rel="noreferrer" className="mt-6 block rounded-lg bg-[#F57C00] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-orange-200 hover:bg-[#E65100]">
                  ENTRAR COMO CONSULTOR MATRIX
                </a>
              </div>
            </div>
            {/* OPÇÃO 3 */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="h-1 bg-gray-300" />
              <div className="p-6 text-center">
                <Calendar className="mx-auto h-12 w-12 text-[#F57C00]" />
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#666]">PREFERE CONVERSAR ANTES?</p>
                <h3 className="mt-2 text-xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Agende 20 minutos</h3>
                <p className="mt-3 text-sm text-[#666]">Apresentamos o plano de negócios completo, o simulador personalizado para o seu perfil e respondemos tudo antes de você decidir.</p>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-6 block rounded-lg border-2 border-[#F57C00] py-3 text-sm font-bold text-[#F57C00] hover:bg-[#fff8f4]">
                  → AGENDAR CONVERSA ←
                </a>
                <a href={guiaLink} target="_blank" rel="noreferrer" className="mt-3 block rounded-lg border border-[#F57C00] bg-black py-3 text-sm font-bold text-white">
                  → BAIXAR GUIA GRÁTIS ←
                </a>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* SIMULADOR */}
      <div id="simulador" className="bg-white">
        <Section label="SIMULADOR" title="Quanto você pode ganhar como Consultor Matrix?">
          <Simulador linkPatrocinador={matrixLink} />
        </Section>
      </div>

      {/* FAQ */}
      <div className="bg-[#F5F5F5]">
        <Section label="DÚVIDAS FREQUENTES" title="Tudo o que você precisa saber antes de começar">
          <div className="mx-auto max-w-3xl space-y-3">
            {[
              { q: "Preciso ter experiência em vendas ou energia?", a: "Não. O método e os materiais foram desenhados para quem está começando do zero. A Matrix entrega o produto pronto, o treinamento e o link de indicação — você só precisa seguir o passo a passo." },
              { q: "Preciso investir em anúncios para conseguir clientes?", a: "Não obrigatoriamente. Você pode começar só com sua rede no WhatsApp. Anúncios aceleram, mas não são pré-requisito. No Método EnergyIA mostramos como qualificar leads orgânicos com IA." },
              { q: "Quanto tempo leva para receber a primeira comissão?", a: "Assim que o cliente entra no faturamento da distribuidora (geralmente 30 a 60 dias após a assinatura), a Matrix processa a comissão de conexão no fechamento do mês seguinte." },
              { q: "A recorrência é vitalícia?", a: "Enquanto o cliente estiver ativo na carteira, você recebe o percentual mensal. Se o cliente cancela, a recorrência dele para — mas o restante da sua carteira continua gerando renda." },
              { q: "Posso ser consultor trabalhando em outra coisa?", a: "Sim. A maioria começa em paralelo. Como tudo é digital (WhatsApp + link), dá para fazer nas brechas do dia." },
              { q: "Como funciona o pagamento da Matrix?", a: "Comissões pagas mensalmente via PIX/conta bancária cadastrada na plataforma, com extrato detalhado por cliente e tipo (conexão, recorrência, bônus, override)." },
              { q: "E se eu não gostar? Tem garantia?", a: "O Método EnergyIA (R$17) tem 7 dias de garantia incondicional. O Consultor Matrix 360 não tem fidelidade — cancela a mensalidade quando quiser." },
            ].map((it, i) => (
              <FaqItem key={i} q={it.q} a={it.a} />
            ))}
          </div>
        </Section>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <img src={IMG.logoFooter} alt="EnergyIA" width={160} />
              <p className="mt-3 text-sm text-white/60">Energia compartilhada com IA.</p>
            </div>
            <div>
              <p className="text-sm font-bold">Contato</p>
              <div className="mt-3 space-y-1 text-sm text-white/70">
                <p>{c.nome}</p>
                {c.email && <p>{c.email}</p>}
                {c.telefone && <p>{c.telefone}</p>}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">Redes</p>
              <div className="mt-3 flex gap-3 text-sm">
                {wa && <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#F57C00]">WhatsApp</a>}
                {ig && <a href={`https://instagram.com/${ig}`} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#F57C00]">Instagram</a>}
                {c.facebook && <a href={c.facebook} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#F57C00]">Facebook</a>}
                {c.youtube && <a href={c.youtube} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#F57C00]">YouTube</a>}
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} EnergyIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      {wa && (
        <a href={whatsappLink} target="_blank" rel="noreferrer"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110">
          <MessageCircle className="h-7 w-7" />
        </a>
      )}
    </div>
  );
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[#F57C00]">{label}</p>
        <h2 style={{ fontFamily: "Sora, sans-serif" }} className="mt-2 text-2xl font-extrabold md:text-4xl">{title}</h2>
        <div className="mt-3 h-1 w-16 bg-[#F57C00]" />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

// === SIMULADOR ===
function Simulador({ linkPatrocinador }: { linkPatrocinador: string }) {
  const [tab, setTab] = useState<"mes1" | "ano" | "time">("mes1");
  const [conta, setConta] = useState(350);
  const [clientes, setClientes] = useState(5);
  const [consultores, setConsultores] = useState(3);

  const fmt = (n: number) => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const calc = useMemo(() => {
    const faturavel = conta * 0.85;
    const conexaoUnit = faturavel * 0.6;
    const recorrenciaUnit = faturavel * 0.01;
    const bonus = clientes >= 4 ? 1200 : clientes >= 2 ? 500 : clientes >= 1 ? 200 : 0;

    const conexaoMes1 = conexaoUnit * clientes;
    const recorrMes1 = recorrenciaUnit * clientes;
    const totalMes1 = conexaoMes1 + recorrMes1 + bonus;

    let conexao12 = 0, recorr12 = 0, bonus12 = 0;
    for (let m = 1; m <= 12; m++) {
      conexao12 += conexaoUnit * clientes;
      recorr12 += recorrenciaUnit * clientes * m;
      bonus12 += bonus;
    }
    const total12 = conexao12 + recorr12 + bonus12;

    const expansao = consultores * 100;
    const ativacao = consultores * 30;
    const clientesTime = clientes * consultores;
    const conexaoIndireta = conexaoUnit * clientesTime * 0.04;
    const recorrIndireta = recorrenciaUnit * clientesTime * 0.03;
    const subRede = expansao + ativacao;
    const subOverride = conexaoIndireta + recorrIndireta;
    const totalTime = totalMes1 + subRede + subOverride;

    return { conexaoMes1, recorrMes1, bonus, totalMes1, conexao12, recorr12, bonus12, total12, subRede, subOverride, totalTime, clientesTime, expansao, ativacao, conexaoIndireta, recorrIndireta };
  }, [conta, clientes, consultores]);

  const resultValue = tab === "mes1" ? calc.totalMes1 : tab === "ano" ? calc.total12 : calc.totalTime;
  const resultLabel = tab === "mes1" ? "Ganho estimado · 1º Mês" : tab === "ano" ? "Acumulado em 12 meses" : "Total com Time";

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl">
      <div className="bg-[#1A1A1A] p-7 text-white">
        <span className="inline-block rounded-full border border-[#F57C00]/30 bg-[#F57C00]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#F57C00]">Simulador de Comissão</span>
        <h3 className="mt-3 text-2xl font-extrabold" style={{ fontFamily: "Sora, sans-serif" }}>Quanto você pode ganhar como Consultor Matrix?</h3>
        <p className="mt-2 text-sm text-white/50">Ajuste os sliders abaixo. Valores calculados com <strong className="text-white/80">regras reais do plano de comissão</strong>.</p>
      </div>

      <div className="grid grid-cols-3 gap-1 bg-[#111] p-1">
        {[["mes1", "1º Mês"], ["ano", "12 Meses"], ["time", "Com Time"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as "mes1" | "ano" | "time")}
            className={`rounded-md py-3 text-sm font-semibold transition ${tab === k ? "bg-[#F57C00] text-white" : "text-white/40 hover:text-white/70"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-5 bg-white p-6 md:p-8">
        <SliderRow label="Conta média (R$)" value={fmt(conta)} min={100} max={2000} step={50} current={conta} setValue={setConta} fmtMin="R$ 100" fmtMax="R$ 2.000" />
        <SliderRow label="Clientes no mês" value={`${clientes} clientes`} min={1} max={30} step={1} current={clientes} setValue={setClientes} fmtMin="1" fmtMax="30" />
        <SliderRow label="Consultores no time" value={`${consultores} consultores`} min={1} max={20} step={1} current={consultores} setValue={setConsultores} fmtMin="1" fmtMax="20" />
      </div>

      <div className="bg-[#F57C00] p-7 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">{resultLabel}</p>
        <p className="my-2 text-5xl font-black md:text-6xl">{fmt(resultValue)}</p>
        <p className="text-sm text-white/85">Baseado em <strong>{clientes} cliente(s)</strong> com conta média de <strong>{fmt(conta)}</strong>{tab === "time" && <> + <strong>{consultores} consultor(es)</strong> no time</>}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={linkPatrocinador} target="_blank" rel="noreferrer" className="rounded-lg bg-[#1A1A1A] px-5 py-3 text-sm font-bold hover:bg-black">Quero ser Consultor Matrix</a>
          <span className="rounded-lg bg-black/25 px-4 py-3 text-xs text-white/90">Valores reais do plano</span>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8">
        {tab === "mes1" && (
          <div className="mx-auto max-w-md rounded-lg border border-[#F57C00] p-5">
            <p className="text-xs font-bold uppercase tracking-widest">Detalhamento · 1º Mês</p>
            <p className="text-xs text-[#999]">Como esse valor é composto</p>
            <Row label="Comissão de conexão" value={fmt(calc.conexaoMes1)} />
            <Row label="Recorrência (mês 1)" value={fmt(calc.recorrMes1)} />
            <Row label="Bônus de volume" value={fmt(calc.bonus)} />
            <div className="mt-3 flex justify-between border-t-2 pt-3 font-extrabold">
              <span>Total estimado</span><span className="text-lg text-[#F57C00]">{fmt(calc.totalMes1)}</span>
            </div>
          </div>
        )}
        {tab === "ano" && (
          <div className="mx-auto max-w-md rounded-lg border border-[#F57C00] p-5">
            <p className="text-xs font-bold uppercase tracking-widest">Você · 12 Meses</p>
            <p className="text-xs text-[#999]">Acumulado projetado</p>
            <Row label="Conexões (12 meses)" value={fmt(calc.conexao12)} />
            <Row label="Recorrência acumulada" value={fmt(calc.recorr12)} />
            <Row label="Bônus de volume (12x)" value={fmt(calc.bonus12)} />
            <div className="mt-3 flex justify-between border-t-2 pt-3 font-extrabold">
              <span>Total 12 meses</span><span className="text-lg text-[#F57C00]">{fmt(calc.total12)}</span>
            </div>
          </div>
        )}
        {tab === "time" && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[#eee] p-4">
              <p className="text-sm font-bold">Você (direto)</p>
              <Row label="Subtotal você" value={fmt(calc.totalMes1)} />
            </div>
            <div className="rounded-lg border border-[#eee] p-4">
              <p className="text-sm font-bold">Expansão de Rede</p>
              <Row label="Expansão" value={fmt(calc.expansao)} />
              <Row label="Ativação mensal" value={fmt(calc.ativacao)} />
              <Row label="Subtotal rede" value={fmt(calc.subRede)} />
            </div>
            <div className="rounded-lg border border-[#eee] p-4">
              <p className="text-sm font-bold">Override (Indireto)</p>
              <Row label="Conexão indireta" value={fmt(calc.conexaoIndireta)} />
              <Row label="Recorrência indireta" value={fmt(calc.recorrIndireta)} />
              <Row label="Subtotal override" value={fmt(calc.subOverride)} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t bg-white p-4 text-xs leading-relaxed text-[#aaa]">
        * Simulação baseada nas regras do plano de comissão Matrix. Comissão de conexão = 60% do valor faturável (85% da conta). Recorrência = 1% ao mês por cliente ativo. Bônus de volume: 1 cliente=R$200, 2=R$500, 4+=R$1.200. Override de rede: 4% conexão + 3% recorrência indireta. Bônus expansão R$100/consultor (mês 1) + ativação R$30/mês. Valores estimados.
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, current, setValue, fmtMin, fmtMax }: { label: string; value: string; min: number; max: number; step: number; current: number; setValue: (n: number) => void; fmtMin: string; fmtMax: string }) {
  const pct = ((current - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
      <div className="md:w-44">
        <p className="text-xs font-bold uppercase tracking-widest text-[#999]">{label}</p>
        <p className="text-base font-extrabold">{value}</p>
      </div>
      <div className="flex-1">
        <input type="range" min={min} max={max} step={step} value={current} onChange={(e) => setValue(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded bg-gray-200"
          style={{ background: `linear-gradient(to right, #F57C00 0%, #F57C00 ${pct}%, #e0e0e0 ${pct}%, #e0e0e0 100%)` }} />
        <div className="mt-1 flex justify-between text-[11px] text-[#bbb]"><span>{fmtMin}</span><span>{fmtMax}</span></div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm last:border-b-0">
      <span className="text-[#555]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-[#eee] bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-semibold text-[#1A1A1A]">{q}</span>
        <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#F57C00] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-relaxed text-[#555]">{a}</div>}
    </div>
  );
}
