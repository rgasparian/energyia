import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-browser";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro")({ component: Cadastro });

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function traduzirErro(msg: string): string {
  if (msg.includes("User already registered")) return "Este e-mail já está cadastrado.";
  if (msg.includes("Email not confirmed")) return "Você precisa confirmar seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("Password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (msg.includes("duplicate key") && msg.includes("slug")) return "Este usuário já está em uso. Escolha outro nome para sua página.";
  if (msg.includes("duplicate key")) return "Já existe um cadastro com esses dados.";
  if (msg.includes("Unable to validate email address")) return "E-mail inválido. Verifique o endereço digitado.";
  return msg;
}

function Cadastro() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cadastrado, setCadastrado] = useState(false);
  const [emailCadastrado, setEmailCadastrado] = useState("");

  useEffect(() => {
    if (!loading && user) navigate({ to: "/painel" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setSubmitting(true);
    const supabase = await getSupabase();
    const finalSlug = slug.trim() ? slugify(slug) : slugify(nome) || slugify(email.split("@")[0]);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `https://energyia.club/painel`,
        data: {
          nome,
          telefone,
          slug: finalSlug,
          role: "membro",
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(traduzirErro(error.message));
      return;
    }
    setEmailCadastrado(email);
    setCadastrado(true);
  };

  if (cadastrado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2">
            <Zap className="h-7 w-7 text-[#F57C00]" fill="#F57C00" />
            <span className="text-2xl font-bold text-[#1A1A1A]">EnergyIA</span>
          </Link>
          <div className="mb-4 text-6xl">📧</div>
          <div className="rounded-xl border border-[#E0E0E0] bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Confirme seu e-mail</h1>
            <p className="mt-3 text-sm text-[#444] leading-relaxed">
              Enviamos um link de confirmação para:
            </p>
            <p className="mt-2 rounded-lg bg-[#F5F5F5] px-4 py-2 font-mono text-sm font-semibold text-[#F57C00]">
              {emailCadastrado}
            </p>
            <p className="mt-4 text-sm text-[#444] leading-relaxed">
              <strong>Antes de entrar, você precisa clicar no link</strong> que enviamos para o seu e-mail. Verifique também a pasta de spam.
            </p>
            <div className="mt-4 rounded-lg bg-[#FFF3E0] border border-[#F57C00]/20 px-4 py-3">
              <p className="text-xs text-[#E65100] font-medium">
                ⚠️ Não consegue entrar? Verifique sua caixa de entrada e clique no link de confirmação antes de tentar acessar.
              </p>
            </div>
            <Link
              to="/login"
              className="mt-6 flex items-center justify-center rounded-lg bg-[#F57C00] py-3 text-sm font-semibold text-white hover:bg-[#E65100]"
            >
              Já confirmei — ir para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Zap className="h-7 w-7 text-[#F57C00]" fill="#F57C00" />
          <span className="text-2xl font-bold text-[#1A1A1A]">EnergyIA</span>
        </Link>
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Cadastro de Afiliado</h1>
          <p className="mt-1 text-sm text-[#666]">Crie sua conta e ganhe sua página personalizada</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Nome completo" value={nome} onChange={setNome} required placeholder="Seu nome" />
            <Field label="E-mail" type="email" value={email} onChange={setEmail} required placeholder="voce@email.com" />
            <Field label="WhatsApp" value={telefone} onChange={setTelefone} placeholder="(11) 99999-9999" />
            <div>
              <Field
                label="Usuário da sua página (opcional)"
                value={slug}
                onChange={setSlug}
                placeholder="seunome"
              />
              <p className="mt-1 text-xs text-[#666]">
                Sua página será: <span className="font-mono">energyia.club/{slug ? slugify(slug) : slugify(nome) || "seunome"}</span>
              </p>
            </div>
            <Field label="Senha" type="password" value={password} onChange={setPassword} required placeholder="Mínimo 6 caracteres" />
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-3 text-sm font-semibold text-white transition hover:bg-[#E65100] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar conta
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-[#666]">
            Já tem conta?{" "}
            <Link to="/login" className="font-semibold text-[#F57C00] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#333]">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#E0E0E0] px-4 py-2.5 text-sm focus:border-[#F57C00] focus:outline-none focus:ring-2 focus:ring-[#F57C00]/20"
      />
    </div>
  );
}
