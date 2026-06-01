import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-browser";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function traduzirErro(msg: string): string {
  if (msg.includes("Email not confirmed")) return "Você precisa confirmar seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("User not found")) return "Nenhuma conta encontrada com este e-mail.";
  if (msg.includes("Too many requests")) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  if (msg.includes("Email rate limit exceeded")) return "Limite de e-mails atingido. Tente novamente em alguns minutos.";
  return msg;
}

function Login() {
  const { signIn, user, role, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirectTo = search?.get("redirect") || null;

  useEffect(() => {
    if (!loading && user && role !== null) {
      if (redirectTo) {
        window.location.href = redirectTo;
      } else if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/painel";
      }
    }
  }, [user, role, loading, redirectTo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setSubmitting(false);
      toast.error(traduzirErro(error));
    }
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu e-mail para recuperar a senha.");
      return;
    }
    setSubmitting(true);
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://energyia.club/painel",
    });
    setSubmitting(false);
    if (error) {
      toast.error(traduzirErro(error.message));
    } else {
      setResetSent(true);
    }
  };

  if (resetMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2">
            <Zap className="h-7 w-7 text-[#F57C00]" fill="#F57C00" />
            <span className="text-2xl font-bold text-[#1A1A1A]">EnergyIA</span>
          </Link>
          <div className="rounded-xl border border-[#E0E0E0] bg-white p-8 shadow-sm">
            {resetSent ? (
              <>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">E-mail enviado!</h1>
                <p className="mt-2 text-sm text-[#666]">
                  Enviamos um link para <strong>{email}</strong>. Clique no link do e-mail para redefinir sua senha.
                </p>
                <button
                  onClick={() => { setResetMode(false); setResetSent(false); }}
                  className="mt-6 w-full rounded-lg border border-[#E0E0E0] py-3 text-sm font-semibold text-[#333] hover:bg-[#FAFAFA]"
                >
                  Voltar para o login
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Recuperar senha</h1>
                <p className="mt-1 text-sm text-[#666]">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
                <form onSubmit={onReset} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#333]">E-mail</label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#E0E0E0] px-4 py-2.5 text-sm focus:border-[#F57C00] focus:outline-none focus:ring-2 focus:ring-[#F57C00]/20"
                      placeholder="voce@email.com"
                    />
                  </div>
                  <button
                    type="submit" disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-3 text-sm font-semibold text-white transition hover:bg-[#E65100] disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Enviar link de recuperação
                  </button>
                </form>
                <button
                  onClick={() => setResetMode(false)}
                  className="mt-4 w-full text-center text-xs text-[#666] hover:underline"
                >
                  Voltar para o login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Zap className="h-7 w-7 text-[#F57C00]" fill="#F57C00" />
          <span className="text-2xl font-bold text-[#1A1A1A]">EnergyIA</span>
        </Link>
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Entrar</h1>
          <p className="mt-1 text-sm text-[#666]">Acesse sua área do membro</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#333]">E-mail</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#E0E0E0] px-4 py-2.5 text-sm focus:border-[#F57C00] focus:outline-none focus:ring-2 focus:ring-[#F57C00]/20"
                placeholder="voce@email.com"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-[#333]">Senha</label>
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-xs text-[#F57C00] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#E0E0E0] px-4 py-2.5 text-sm focus:border-[#F57C00] focus:outline-none focus:ring-2 focus:ring-[#F57C00]/20"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-3 text-sm font-semibold text-white transition hover:bg-[#E65100] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-[#666]">
            Não tem conta?{" "}
            <Link to="/cadastro" className="font-semibold text-[#F57C00] hover:underline">
              Cadastre-se como afiliado
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
