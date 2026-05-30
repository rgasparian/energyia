import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const { signIn, user, role, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pega o parâmetro redirect da URL se existir
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirectTo = search?.get("redirect") || null;

  useEffect(() => {
    if (!loading && user && role !== null) {
      if (redirectTo) {
        navigate({ to: redirectTo as any });
      } else if (role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/painel" });
      }
    }
  }, [user, role, loading, navigate, redirectTo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("Erro ao entrar: " + error);
    }
    // Não navega aqui — o useEffect acima cuida do redirect após o role carregar
  };

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
              <label className="mb-1.5 block text-sm font-medium text-[#333]">Senha</label>
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
              Entrar
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
