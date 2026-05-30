import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Zap, Loader2, Plus, ArrowLeft, Download, X } from "lucide-react";
import { slugify } from "@/lib/utils-energyia";
import { getSupabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/admin")({ component: Admin });

interface Membro {
  id: string; nome: string; email: string; telefone?: string; slug: string; ativo: boolean; created_at: string;
}
interface LeadFull {
  id: string; nome: string; telefone: string; email?: string;
  slug_origem?: string; created_at: string; usuario_id?: string;
}

function Admin() {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [membros, setMembros] = useState<Membro[]>([]);
  const [leads, setLeads] = useState<LeadFull[]>([]);
  const [tab, setTab] = useState<"membros" | "leads">("membros");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Passa o redirect para voltar ao /admin após o login
        navigate({ to: "/login", search: { redirect: "/admin" } as any });
      } else if (role !== null && role !== "admin") {
        navigate({ to: "/painel" });
      }
    }
  }, [user, role, loading, navigate]);

  const load = async () => {
    const supabase = await getSupabase();
    const { data: m } = await supabase.from("usuarios").select("id,nome,email,telefone,slug,ativo,created_at").order("created_at", { ascending: false });
    setMembros((m as Membro[]) ?? []);
    const { data: l } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads((l as LeadFull[]) ?? []);
  };

  useEffect(() => { if (role === "admin") load(); }, [role]);

  const toggleAtivo = async (m: Membro) => {
    const supabase = await getSupabase();
    await supabase.from("usuarios").update({ ativo: !m.ativo }).eq("id", m.id);
    toast.success(`Membro ${!m.ativo ? "ativado" : "desativado"}`);
    load();
  };

  const exportCsv = () => {
    const header = "Nome,Telefone,Email,Membro origem,Data\n";
    const rows = leads.map((l) => {
      const membro = membros.find((m) => m.id === l.usuario_id)?.nome || l.slug_origem || "";
      return `"${l.nome}","${l.telefone}","${l.email || ""}","${membro}","${new Date(l.created_at).toLocaleString("pt-BR")}"`;
    }).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Mostra loading enquanto carrega ou enquanto role ainda não chegou
  if (loading || role === null) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]"><Loader2 className="h-6 w-6 animate-spin text-[#F57C00]" /></div>;
  }

  if (role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#F57C00]" fill="#F57C00" />
            <span className="text-lg font-bold text-[#1A1A1A]">EnergyIA</span>
            <span className="ml-2 rounded bg-[#F57C00]/10 px-2 py-0.5 text-xs font-semibold text-[#F57C00]">ADMIN</span>
          </Link>
          <Link to="/painel" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#FAFAFA]">
            <ArrowLeft className="h-4 w-4" /> Meu painel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Painel administrativo</h1>

        <div className="flex gap-2 border-b border-[#E0E0E0]">
          {(["membros", "leads"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition ${tab === t ? "border-b-2 border-[#F57C00] text-[#F57C00]" : "text-[#666] hover:text-[#1A1A1A]"}`}>
              {t === "membros" ? `Membros (${membros.length})` : `Leads (${leads.length})`}
            </button>
          ))}
        </div>

        {tab === "membros" && (
          <section className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Membros</h2>
              <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#F57C00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E65100]">
                <Plus className="h-4 w-4" /> Criar novo membro
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#E0E0E0] text-left text-xs uppercase text-[#666]">
                  <tr><th className="py-2 pr-4">Nome</th><th className="py-2 pr-4">Slug</th><th className="py-2 pr-4">E-mail</th>
                    <th className="py-2 pr-4">Telefone</th><th className="py-2 pr-4">Status</th><th className="py-2">Cadastro</th></tr>
                </thead>
                <tbody>
                  {membros.map((m) => (
                    <tr key={m.id} className="border-b border-[#E0E0E0]/50">
                      <td className="py-2.5 pr-4 font-medium">{m.nome}</td>
                      <td className="py-2.5 pr-4 text-[#666]">/{m.slug}</td>
                      <td className="py-2.5 pr-4">{m.email}</td>
                      <td className="py-2.5 pr-4">{m.telefone || "-"}</td>
                      <td className="py-2.5 pr-4">
                        <button onClick={() => toggleAtivo(m)}
                          className={`rounded-full px-3 py-0.5 text-xs font-semibold ${m.ativo ? "bg-[#2E7D32]/10 text-[#2E7D32]" : "bg-[#C62828]/10 text-[#C62828]"}`}>
                          {m.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="py-2.5 text-[#666]">{new Date(m.created_at).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "leads" && (
          <section className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Todos os leads</h2>
              <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E0E0E0] px-4 py-2 text-sm font-medium text-[#333] hover:bg-[#FAFAFA]">
                <Download className="h-4 w-4" /> Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#E0E0E0] text-left text-xs uppercase text-[#666]">
                  <tr><th className="py-2 pr-4">Nome</th><th className="py-2 pr-4">Telefone</th><th className="py-2 pr-4">E-mail</th>
                    <th className="py-2 pr-4">Membro origem</th><th className="py-2">Data</th></tr>
                </thead>
                <tbody>
                  {leads.map((l) => {
                    const membro = membros.find((m) => m.id === l.usuario_id);
                    return (
                      <tr key={l.id} className="border-b border-[#E0E0E0]/50">
                        <td className="py-2.5 pr-4 font-medium">{l.nome}</td>
                        <td className="py-2.5 pr-4">{l.telefone}</td>
                        <td className="py-2.5 pr-4">{l.email || "-"}</td>
                        <td className="py-2.5 pr-4 text-[#666]">{membro?.nome || l.slug_origem}</td>
                        <td className="py-2.5 text-[#666]">{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {showCreate && <CreateMember onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />}
    </div>
  );
}

function CreateMember({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", telefone: "", slug: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const supabase = await getSupabase();
    const slug = slugify(form.slug || form.nome);
    const { data, error } = await supabase.functions.invoke("admin-create-member", {
      body: { ...form, slug },
    });
    setSubmitting(false);
    if (error || (data as any)?.error) {
      toast.error("Erro: " + (error?.message || (data as any)?.error));
    } else {
      toast.success("Membro criado!");
      onCreated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1A1A1A]">Novo membro</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-[#666]" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {(["nome", "email", "senha", "telefone", "slug"] as const).map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-medium uppercase text-[#666]">{k}</label>
              <input required={k !== "telefone" && k !== "slug"} type={k === "senha" ? "password" : k === "email" ? "email" : "text"}
                value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm focus:border-[#F57C00] focus:outline-none" />
            </div>
          ))}
          <button type="submit" disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-2.5 text-sm font-semibold text-white hover:bg-[#E65100] disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Criar membro
          </button>
        </form>
      </div>
    </div>
  );
}
