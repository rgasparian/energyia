import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, ArrowRight, Users, Link2, Activity } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#F57C00]" fill="#F57C00" />
            <span className="text-xl font-bold">EnergyIA</span>
          </div>
          <Link
            to="/login"
            className="rounded-lg bg-[#F57C00] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#E65100]"
          >
            Entrar na plataforma
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F57C00]/30 bg-[#F57C00]/10 px-4 py-1.5 text-xs font-medium text-[#F57C00]">
            <Zap className="h-3 w-3" /> Energia compartilhada inteligente
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Sua página de captação personalizada,{" "}
            <span className="text-[#F57C00]">gerada automaticamente</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Cada membro da equipe tem sua própria página com seus dados, seu WhatsApp e seu link de conversão.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#F57C00] px-7 py-4 text-base font-semibold text-white transition hover:bg-[#E65100]"
            >
              Entrar na plataforma
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-3">
          {[
            { icon: Users, t: "Página por membro", d: "Cada vendedor ganha um link próprio: meusite.com/seunome" },
            { icon: Link2, t: "Captura automática", d: "Leads vão direto para o painel e seu WhatsApp" },
            { icon: Activity, t: "Acompanhe resultados", d: "Veja em tempo real quem está convertendo" },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <f.icon className="mb-4 h-8 w-8 text-[#F57C00]" />
              <h3 className="text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-white/60">{f.d}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">
        © {new Date().getFullYear()} EnergyIA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
