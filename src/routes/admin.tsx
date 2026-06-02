import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Zap, Loader2, Plus, ArrowLeft, Download, X, ToggleLeft, ToggleRight, Pencil, KeyRound, Trash2 } from "lucide-react";
import { slugify } from "@/lib/utils-energyia";
import { getSupabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/admin")({ component: Admin });

interface Membro {
  id: string; nome: string; email: string; telefone?: string; slug: string; ativo: boolean; created_at: string; role?: string; usuario_matrix?: string;
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
  const [editando, setEditando] = useState<Membro | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({ to: "/login", search: { redirect: "/admin" } as any });
      } else if (role !== null && role !== "admin") {
        navigate({ to: "/painel" });
      }
    }
  }, [user, role, loading, navigate]);

  const load = async () => {
    const supabase = await getSupabase();
    const { data: m } = await supabase.from("usuarios").select("id,nome,email,telefone,slug,ativo,created_at,role,usuario_matrix").order("created_at", { ascending: false });
    setMembros((m as Membro[]) ?? []);
    const { data: l } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads((l as LeadFull[]) ?? []);
  };

  useEffect(() => { if (role === "admin") load(); }, [role]);

  const toggleAtivo = async (m: Membro) => {
    const novoStatus = !m.ativo;
    const confirmMsg = novoStatus
      ? `Ativar ${m.nome}? Ele voltará a ter acesso ao sistema.`
      : `Desativar ${m.nome}? Ele perderá o acesso ao sistema.`;
    if (!window.confirm(confirmMsg)) return;

    setToggling(m.id);
    const supabase = await getSupabase();
    const { error, data } = await supabase
      .from("usuarios")
      .update({ ativo: novoStatus })
      .eq("id", m.id)
      .select();

    setToggling(null);

    if (error) {
      toast.error("Erro ao atualizar status: " + error.message);
    } else if (!data || data.length === 0) {
      toast.error("Atualização bloqueada pelo banco. Verifique as políticas RLS.");
    } else {
      setMembros(prev => prev.map(item => item.id === m.id ? { ...item, ativo: novoStatus } : item));
      toast.success(`${m.nome} foi ${novoStatus ? "ativado ✅" : "desativado 🔴"} com sucesso.`);
    }
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

  if (loading || role === null) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]"><Loader2 className="h-6 w-6 animate-spin text-[#F57C00]" /></div>;
  }

  if (role !== "admin") return null;

  const ativos = membros.filter(m => m.ativo).length;
  const inativos = membros.filter(m => !m.ativo).length;

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
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Membros</h2>
                <p className="mt-0.5 text-xs text-[#666]">
                  <span className="font-medium text-[#2E7D32]">{ativos} ativos</span>
                  {inativos > 0 && <span className="ml-2 font-medium text-[#C62828]">{inativos} inativos</span>}
                </p>
              </div>
              <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#F57C00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E65100]">
                <Plus className="h-4 w-4" /> Criar novo membro
              </button>
            </div>

            {/* Tabela desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#E0E0E0] text-left text-xs uppercase text-[#666]">
                  <tr>
                    <th className="py-2 pr-4">Nome</th>
                    <th className="py-2 pr-4">Usuário</th>
                    <th className="py-2 pr-4">E-mail</th>
                    <th className="py-2 pr-4">Telefone</th>
                    <th className="py-2 pr-4">Matrix</th>
                    <th className="py-2 pr-4">Cadastro</th>
                    <th className="py-2 text-center">Acesso</th>
                    <th className="py-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {membros.map((m) => (
                    <tr key={m.id} className={`border-b border-[#E0E0E0]/50 transition ${!m.ativo ? "opacity-50" : ""}`}>
                      <td className="py-3 pr-4 font-medium">{m.nome}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-[#666]">/{m.slug}</td>
                      <td className="py-3 pr-4">{m.email}</td>
                      <td className="py-3 pr-4">{m.telefone || "-"}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-[#666]">{m.usuario_matrix || "-"}</td>
                      <td className="py-3 pr-4 text-[#666]">{new Date(m.created_at).toLocaleDateString("pt-BR")}</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => toggleAtivo(m)}
                          disabled={toggling === m.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                          style={{
                            background: m.ativo ? "#2E7D3215" : "#C6282815",
                            color: m.ativo ? "#2E7D32" : "#C62828",
                            border: `1px solid ${m.ativo ? "#2E7D3240" : "#C6282840"}`,
                          }}
                        >
                          {toggling === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : m.ativo ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                          {m.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <button onClick={() => setEditando(m)}
                          className="inline-flex items-center justify-center rounded-lg border border-[#E0E0E0] p-2 text-[#666] hover:border-[#F57C00] hover:text-[#F57C00] transition">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="md:hidden space-y-3">
              {membros.map((m) => (
                <div key={m.id} className={`rounded-xl border border-[#E0E0E0] p-4 ${!m.ativo ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{m.nome}</p>
                      <p className="text-xs text-[#666] font-mono">/{m.slug}</p>
                      <p className="text-xs text-[#666] mt-1">{m.email}</p>
                      {m.telefone && <p className="text-xs text-[#666]">{m.telefone}</p>}
                      {m.usuario_matrix && <p className="text-xs text-[#F57C00] font-mono mt-1">Matrix: {m.usuario_matrix}</p>}
                      <p className="text-xs text-[#999] mt-1">Cadastro: {new Date(m.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <button onClick={() => setEditando(m)}
                      className="rounded-lg border border-[#E0E0E0] p-2 text-[#666] hover:border-[#F57C00] hover:text-[#F57C00]">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <button onClick={() => toggleAtivo(m)} disabled={toggling === m.id}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition"
                      style={{
                        background: m.ativo ? "#2E7D3215" : "#C6282815",
                        color: m.ativo ? "#2E7D32" : "#C62828",
                        border: `1px solid ${m.ativo ? "#2E7D3240" : "#C6282840"}`,
                      }}>
                      {toggling === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : m.ativo ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                      {m.ativo ? "Ativo — clique para desativar" : "Inativo — clique para ativar"}
                    </button>
                  </div>
                </div>
              ))}
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
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#E0E0E0] text-left text-xs uppercase text-[#666]">
                  <tr>
                    <th className="py-2 pr-4">Nome</th>
                    <th className="py-2 pr-4">Telefone</th>
                    <th className="py-2 pr-4">E-mail</th>
                    <th className="py-2 pr-4">Membro origem</th>
                    <th className="py-2">Data</th>
                  </tr>
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
            <div className="md:hidden space-y-3">
              {leads.map((l) => {
                const membro = membros.find((m) => m.id === l.usuario_id);
                return (
                  <div key={l.id} className="rounded-xl border border-[#E0E0E0] p-4">
                    <p className="font-semibold text-[#1A1A1A]">{l.nome}</p>
                    <p className="text-xs text-[#666] mt-1">{l.telefone}</p>
                    {l.email && <p className="text-xs text-[#666]">{l.email}</p>}
                    <p className="text-xs text-[#999] mt-1">Origem: {membro?.nome || l.slug_origem || "-"}</p>
                    <p className="text-xs text-[#999]">{new Date(l.created_at).toLocaleString("pt-BR")}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {showCreate && <CreateMember onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />}
      {editando && <EditMember membro={editando} onClose={() => setEditando(null)} onSaved={() => { setEditando(null); load(); }} />}
    </div>
  );
}

function EditMember({ membro, onClose, onSaved }: { membro: Membro; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    nome: membro.nome,
    telefone: membro.telefone || "",
    slug: membro.slug,
    usuario_matrix: membro.usuario_matrix || "",
    role: membro.role || "membro",
  });
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [erroSlug, setErroSlug] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroSlug("");
    setSaving(true);
    const supabase = await getSupabase();
    const novoSlug = slugify(form.slug) || slugify(form.nome);
    const { error } = await supabase.from("usuarios").update({
      nome: form.nome,
      telefone: form.telefone || null,
      slug: novoSlug,
      usuario_matrix: form.usuario_matrix.trim().toLowerCase() || null,
      role: form.role,
    }).eq("id", membro.id);
    setSaving(false);
    if (error) {
      if (error.message.includes("duplicate key") && error.message.includes("slug")) {
        setErroSlug("Este usuário já está em uso. Escolha outro nome para a página.");
      } else {
        toast.error("Erro ao salvar: " + error.message);
      }
    } else {
      toast.success("Dados atualizados com sucesso!");
      onSaved();
    }
  };

  const resetSenha = async () => {
    if (!window.confirm(`Enviar e-mail de redefinição de senha para ${membro.email}?`)) return;
    setSendingReset(true);
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(membro.email, {
      redirectTo: "https://energyia.club/painel",
    });
    setSendingReset(false);
    if (error) {
      toast.error("Erro ao enviar: " + error.message);
    } else {
      toast.success(`E-mail de redefinição enviado para ${membro.email} ✅`);
    }
  };

  const deletar = async () => {
    setDeleting(true);
    const supabase = await getSupabase();
    await supabase.functions.invoke("admin-delete-member", { body: { userId: membro.id } });
    setDeleting(false);
    toast.success(`${membro.nome} foi removido do sistema.`);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1A1A1A]">Editar membro</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-[#666]" /></button>
        </div>

        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#666]">Nome</label>
            <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required
              className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm focus:border-[#F57C00] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#666]">Telefone / WhatsApp</label>
            <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm focus:border-[#F57C00] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#666]">Usuário da página</label>
            <input value={form.slug} onChange={(e) => { setForm({ ...form, slug: e.target.value }); setErroSlug(""); }} required
              className={`w-full rounded-lg border px-3 py-2.5 text-sm font-mono focus:outline-none ${erroSlug ? "border-[#C62828]" : "border-[#E0E0E0] focus:border-[#F57C00]"}`} />
            {erroSlug ? (
              <p className="mt-1 text-xs text-[#C62828] font-medium">⚠️ {erroSlug}</p>
            ) : (
              <p className="mt-1 text-xs text-[#999]">Página: energyia.club/consultor/{slugify(form.slug) || slugify(form.nome)}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#666]">Usuário Matrix</label>
            <input value={form.usuario_matrix} onChange={(e) => setForm({ ...form, usuario_matrix: e.target.value })}
              placeholder="usuario-matrix"
              className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm font-mono focus:border-[#F57C00] focus:outline-none" />
            <p className="mt-1 text-xs text-[#999]">
              Link: escritorio.matrix360.com.br/{form.usuario_matrix.trim().toLowerCase() || "..."}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#666]">Perfil</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-[#E0E0E0] px-3 py-2.5 text-sm focus:border-[#F57C00] focus:outline-none">
              <option value="membro">Membro</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-[#666]">E-mail</label>
            <p className="rounded-lg bg-[#F5F5F5] px-3 py-2.5 text-sm text-[#666]">{membro.email}</p>
            <p className="mt-0.5 text-xs text-[#999]">O e-mail não pode ser alterado por aqui.</p>
          </div>
          <button type="submit" disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-3 text-sm font-semibold text-white hover:bg-[#E65100] disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar alterações
          </button>
        </form>

        <div className="mt-4 space-y-2 border-t border-[#E0E0E0] pt-4">
          <button onClick={resetSenha} disabled={sendingReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E0E0E0] py-3 text-sm font-medium text-[#333] hover:bg-[#FAFAFA] disabled:opacity-60">
            {sendingReset ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Enviar redefinição de senha
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#C62828]/30 py-3 text-sm font-medium text-[#C62828] hover:bg-[#C62828]/5">
              <Trash2 className="h-4 w-4" /> Excluir membro
            </button>
          ) : (
            <div className="rounded-lg border border-[#C62828]/30 bg-[#C62828]/5 p-4">
              <p className="text-center text-sm text-[#C62828] font-medium">Confirmar exclusão de {membro.nome}?</p>
              <p className="mt-1 text-center text-xs text-[#666]">Esta ação não pode ser desfeita.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-lg border border-[#E0E0E0] py-2.5 text-sm font-medium text-[#333] hover:bg-white">
                  Cancelar
                </button>
                <button onClick={deletar} disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#C62828] py-2.5 text-sm font-semibold text-white hover:bg-[#B71C1C] disabled:opacity-60">
                  {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateMember({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", telefone: "", slug: "", usuario_matrix: "" });
  const [submitting, setSubmitting] = useState(false);
  const [erros, setErros] = useState<{ email?: string; slug?: string }>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErros({});
    setSubmitting(true);
    const supabase = await getSupabase();
    const slug = slugify(form.slug || form.nome);
    const { data, error } = await supabase.functions.invoke("admin-create-member", {
      body: { ...form, slug, usuario_matrix: form.usuario_matrix.trim().toLowerCase() },
    });
    setSubmitting(false);
    const errMsg = error?.message || (data as any)?.error || "";
    if (errMsg) {
      if (errMsg.includes("already registered") || errMsg.includes("email")) {
        setErros({ email: "Este e-mail já está cadastrado." });
      } else if (errMsg.includes("slug") || errMsg.includes("duplicate")) {
        setErros({ slug: "Este usuário já está em uso. Escolha outro." });
      } else {
        toast.error("Erro: " + errMsg);
      }
    } else {
      toast.success("Membro criado com sucesso!");
      onCreated();
    }
  };

  const labels: Record<string, string> = {
    nome: "Nome completo",
    email: "E-mail",
    senha: "Senha",
    telefone: "Telefone / WhatsApp",
    slug: "Usuário da página",
    usuario_matrix: "Usuário Matrix",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1A1A1A]">Novo membro</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-[#666]" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {(["nome", "email", "senha", "telefone", "slug", "usuario_matrix"] as const).map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-medium uppercase text-[#666]">{labels[k]}</label>
              <input
                required={k !== "telefone" && k !== "slug" && k !== "usuario_matrix"}
                type={k === "senha" ? "password" : k === "email" ? "email" : "text"}
                value={form[k]}
                onChange={(e) => { setForm({ ...form, [k]: e.target.value }); setErros(prev => ({ ...prev, [k]: undefined })); }}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none ${erros[k as keyof typeof erros] ? "border-[#C62828]" : "border-[#E0E0E0] focus:border-[#F57C00]"}`}
              />
              {erros[k as keyof typeof erros] && (
                <p className="mt-1 text-xs text-[#C62828] font-medium">⚠️ {erros[k as keyof typeof erros]}</p>
              )}
            </div>
          ))}
          <button type="submit" disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F57C00] py-3 text-sm font-semibold text-white hover:bg-[#E65100] disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Criar membro
          </button>
        </form>
      </div>
    </div>
  );
}
