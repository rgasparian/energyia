import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

// ─── Tipos ────────────────────────────────────────────────────

type Aba = "perfil" | "senha" | "links" | "auditoria";

interface Membro {
  id: string;
  nome: string;
  email: string;
  slug: string;
  telefone: string;
  whatsapp: string;
  instagram: string;
  cidade: string;
  foto_url: string;
  link_ebook: string;
  link_patrocinador: string;
  link_ferramentas: string;
  link_cliente: string;
  link_guia: string;
  ativo: boolean;
  role: string;
  created_at: string;
}

interface AuditLog {
  id: string;
  acao: string;
  detalhes: string;
  admin_slug: string;
  created_at: string;
}

type Toast = { msg: string; tipo: "ok" | "erro" };

// ─── Helpers ──────────────────────────────────────────────────

function iniciais(nome: string) {
  return nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function dataFmt(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ICONE_ACAO: Record<string, string> = {
  alterar_senha: "🔐",
  editar_perfil: "✏️",
  desativar: "🚫",
  ativar: "✅",
};

const LABEL_ACAO: Record<string, string> = {
  alterar_senha: "Senha alterada pelo admin",
  editar_perfil: "Perfil editado pelo admin",
  desativar: "Conta desativada",
  ativar: "Conta ativada",
};

// ─── Componente ───────────────────────────────────────────────

function AdminPage() {
  const navigate = useNavigate();

  const [loading, setLoading]         = useState(true);
  const [membros, setMembros]         = useState<Membro[]>([]);
  const [alvo, setAlvo]               = useState<Membro | null>(null);
  const [aba, setAba]                 = useState<Aba>("perfil");
  const [auditLog, setAuditLog]       = useState<AuditLog[]>([]);
  const [formPerfil, setFormPerfil]   = useState<Partial<Membro>>({});
  const [novaSenha, setNovaSenha]     = useState("");
  const [salvando, setSalvando]       = useState(false);
  const [toast, setToast]             = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Verificar role ──────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const supabase = await getSupabase();
      const { data: role } = await supabase.rpc("get_my_role");
      if (role !== "admin") { navigate({ to: "/painel" }); return; }
      await buscarMembros();
      setLoading(false);
    })();
  }, []);

  // ── Membros ─────────────────────────────────────────────────

  async function buscarMembros() {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMembros(data as Membro[]);
  }

  // ── Drawer ──────────────────────────────────────────────────

  async function abrirDrawer(m: Membro) {
    setAlvo(m);
    setFormPerfil(m);
    setNovaSenha("");
    setAba("perfil");
    await buscarAuditoria(m.id);
  }

  function fecharDrawer() {
    setAlvo(null);
    setAuditLog([]);
  }

  async function buscarAuditoria(id: string) {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from("admin_audit_log")
      .select("*")
      .eq("target_id", id)
      .order("created_at", { ascending: false })
      .limit(30);
    setAuditLog((data as AuditLog[]) ?? []);
  }

  // ── Edge Function ────────────────────────────────────────────

  async function chamarEdge(acao: string, dados?: Record<string, unknown>) {
    if (!alvo) return false;
    setSalvando(true);

    const supabase = await getSupabase();
    const { data: sessao } = await supabase.auth.getSession();
    const token = sessao?.session?.access_token ?? "";

    const resp = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-manage-member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          target_id: alvo.id,
          target_slug: alvo.slug,
          acao,
          dados,
        }),
      }
    );

    const json = await resp.json();
    setSalvando(false);

    if (!resp.ok || json.error) {
      exibirToast(json.error ?? "Erro ao executar ação", "erro");
      return false;
    }

    exibirToast(json.mensagem ?? "Ação executada com sucesso", "ok");
    await buscarMembros();
    await buscarAuditoria(alvo.id);
    return true;
  }

  // ── Ações ────────────────────────────────────────────────────

  async function salvarPerfil() {
    await chamarEdge("editar_perfil", { perfil: formPerfil });
  }

  async function alterarSenha() {
    if (novaSenha.length < 6) {
      exibirToast("Senha deve ter no mínimo 6 caracteres", "erro");
      return;
    }
    const ok = await chamarEdge("alterar_senha", { nova_senha: novaSenha });
    if (ok) setNovaSenha("");
  }

  async function toggleAtivo() {
    if (!alvo) return;
    const acao = alvo.ativo ? "desativar" : "ativar";
    const ok = await chamarEdge(acao);
    if (ok) setAlvo({ ...alvo, ativo: !alvo.ativo });
  }

  // ── Toast ────────────────────────────────────────────────────

  function exibirToast(msg: string, tipo: "ok" | "erro") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, tipo });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  // ── Render ───────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <span style={s.loadingText}>Carregando painel...</span>
      </div>
    );
  }

  return (
    <div style={s.page}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          ⚡ Energy<span style={{ color: "#F57C00" }}>IA</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Membros", icon: "👥", to: "/admin" },
            { label: "Painel",  icon: "🏠", to: "/painel" },
          ].map((item) => (
            <button
              key={item.to}
              style={s.navItem}
              onClick={() => navigate({ to: item.to as never })}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Conteúdo ── */}
      <main style={s.main}>

        {/* Banner laranja de modo gerenciamento */}
        {alvo && (
          <div style={s.banner}>
            <span>
              👁️ Gerenciando conta de <strong>{alvo.nome}</strong> — ações registradas em auditoria.
            </span>
            <button style={s.bannerBtn} onClick={fecharDrawer}>
              ↩ Sair do gerenciamento
            </button>
          </div>
        )}

        {/* Topbar */}
        <div style={s.topbar}>
          <h1 style={s.titulo}>Membros da equipe</h1>
          <button style={s.btnPrimary} onClick={() => navigate({ to: "/cadastro" })}>
            + Novo membro
          </button>
        </div>

        {/* Tabela de membros */}
        <div style={s.tableWrap}>
          <div style={s.tableHeader}>
            <span>Membro</span>
            <span>E-mail</span>
            <span>Slug</span>
            <span>Status</span>
            <span>Cadastro</span>
            <span></span>
          </div>

          {membros.length === 0 && (
            <div style={s.vazio}>Nenhum membro cadastrado.</div>
          )}

          {membros.map((m) => (
            <div key={m.id} style={s.tableRow}>
              <div>
                <div style={s.membroNome}>{m.nome}</div>
                <div style={s.membroSlug}>/consultor/{m.slug}</div>
              </div>
              <div style={s.celula}>{m.email}</div>
              <div style={s.celula}>{m.slug}</div>
              <div>
                <span style={m.ativo ? s.badgeAtivo : s.badgeInativo}>
                  {m.ativo ? "ativo" : "inativo"}
                </span>
              </div>
              <div style={s.celulaApagada}>{dataFmt(m.created_at)}</div>
              <div>
                <button style={s.btnGerenciar} onClick={() => abrirDrawer(m)}>
                  ⚙️ Gerenciar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Drawer lateral ── */}
      {alvo && (
        <div style={s.overlay} onClick={fecharDrawer}>
          <aside style={s.drawer} onClick={(e) => e.stopPropagation()}>

            {/* Cabeçalho do drawer */}
            <div style={s.drawerHead}>
              <div style={s.avatar}>{iniciais(alvo.nome)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.drawerNome}>{alvo.nome}</div>
                <div style={s.drawerMeta}>energyia.club/consultor/{alvo.slug}</div>
              </div>
              <button style={s.btnFechar} onClick={fecharDrawer}>✕</button>
            </div>

            {/* Abas */}
            <div style={s.abaRow}>
              {(["perfil", "senha", "links", "auditoria"] as Aba[]).map((a) => (
                <button
                  key={a}
                  style={aba === a ? s.abaAtiva : s.aba}
                  onClick={() => setAba(a)}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>

            {/* Corpo */}
            <div style={s.drawerBody}>

              {/* ── ABA PERFIL ── */}
              {aba === "perfil" && (
                <>
                  <div style={s.secTitulo}>Dados pessoais</div>
                  {([
                    { label: "Nome completo",      key: "nome" },
                    { label: "WhatsApp (com DDI)", key: "whatsapp" },
                    { label: "Telefone",           key: "telefone" },
                    { label: "Instagram",          key: "instagram" },
                    { label: "Cidade",             key: "cidade" },
                    { label: "Slug (URL)",         key: "slug" },
                  ] as { label: string; key: keyof Membro }[]).map(({ label, key }) => (
                    <div key={key} style={s.campo}>
                      <label style={s.campoLabel}>{label}</label>
                      <input
                        style={s.campoInput}
                        value={(formPerfil[key] as string) ?? ""}
                        onChange={(e) =>
                          setFormPerfil((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                    </div>
                  ))}

                  <div style={{ marginTop: 20 }}>
                    <div style={s.secTitulo}>Status da conta</div>
                    <button
                      style={alvo.ativo ? s.btnDesativar : s.btnAtivar}
                      onClick={toggleAtivo}
                      disabled={salvando}
                    >
                      {alvo.ativo ? "🚫 Desativar conta" : "✅ Ativar conta"}
                    </button>
                  </div>
                </>
              )}

              {/* ── ABA SENHA ── */}
              {aba === "senha" && (
                <>
                  <div style={s.secTitulo}>🔐 Alterar senha do membro</div>
                  <div style={s.aviso}>
                    Apenas administradores podem redefinir senhas. Esta ação será registrada no log de auditoria com data, hora e responsável.
                  </div>
                  <div style={s.campo}>
                    <label style={s.campoLabel}>Nova senha</label>
                    <input
                      type="text"
                      style={s.campoInput}
                      placeholder="Mínimo 6 caracteres"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                  </div>
                  <button
                    style={{ ...s.btnPrimary, width: "100%", marginTop: 8 }}
                    onClick={alterarSenha}
                    disabled={salvando || novaSenha.length < 6}
                  >
                    {salvando ? "Alterando..." : "Confirmar nova senha"}
                  </button>
                </>
              )}

              {/* ── ABA LINKS ── */}
              {aba === "links" && (
                <>
                  <div style={s.secTitulo}>Links de afiliado</div>
                  {([
                    { label: "Link Ebook (R$17)",            key: "link_ebook" },
                    { label: "Link Patrocinador (R$249,90)", key: "link_patrocinador" },
                    { label: "Link Ferramentas (R$197)",     key: "link_ferramentas" },
                    { label: "Link Cliente",                 key: "link_cliente" },
                    { label: "Link Guia",                    key: "link_guia" },
                  ] as { label: string; key: keyof Membro }[]).map(({ label, key }) => (
                    <div key={key} style={s.campo}>
                      <label style={s.campoLabel}>{label}</label>
                      <input
                        style={s.campoInput}
                        placeholder="https://"
                        value={(formPerfil[key] as string) ?? ""}
                        onChange={(e) =>
                          setFormPerfil((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                </>
              )}

              {/* ── ABA AUDITORIA ── */}
              {aba === "auditoria" && (
                <>
                  <div style={s.secTitulo}>📋 Histórico de ações admin</div>
                  {auditLog.length === 0 ? (
                    <div style={s.vazio}>Nenhuma ação registrada ainda.</div>
                  ) : (
                    auditLog.map((log) => (
                      <div key={log.id} style={s.auditItem}>
                        <span style={s.auditIcone}>
                          {ICONE_ACAO[log.acao] ?? "📋"}
                        </span>
                        <div>
                          <div style={s.auditAcao}>
                            {LABEL_ACAO[log.acao] ?? log.acao}
                          </div>
                          <div style={s.auditMeta}>
                            Admin: {log.admin_slug} · {dataFmt(log.created_at)}
                          </div>
                          {log.detalhes && (
                            <div style={s.auditDetalhe}>{log.detalhes}</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Footer com botões de salvar */}
            {(aba === "perfil" || aba === "links") && (
              <div style={s.drawerFooter}>
                <button style={s.btnSecondary} onClick={fecharDrawer}>
                  Cancelar
                </button>
                <button style={s.btnPrimary} onClick={salvarPerfil} disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            ...s.toast,
            background: toast.tipo === "ok" ? "#2E7D32" : "#C62828",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#F5F5F5",
    fontFamily: "DM Sans, sans-serif",
    position: "relative",
  },
  loadingWrap: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: "#F5F5F5",
  },
  loadingText: { fontSize: 15, color: "#888" },

  // sidebar
  sidebar: {
    width: 220, flexShrink: 0,
    background: "#1A1A1A",
    padding: "24px 16px",
    display: "flex", flexDirection: "column", gap: 0,
  },
  logo: {
    fontSize: 20, fontWeight: 700, color: "#fff",
    padding: "8px 8px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 16,
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 8,
    background: "transparent", border: "none",
    color: "#bbb", fontSize: 14, cursor: "pointer",
    textAlign: "left", width: "100%",
    transition: "background 0.15s",
  },

  // main
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },

  // banner
  banner: {
    background: "#FFF3E0",
    borderBottom: "2px solid #F57C00",
    padding: "10px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontSize: 13, color: "#E65100", gap: 16,
  },
  bannerBtn: {
    background: "#fff", border: "1px solid #F57C00", color: "#E65100",
    borderRadius: 6, padding: "5px 14px", fontSize: 12,
    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
  },

  // topbar
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px", borderBottom: "1px solid #E0E0E0",
    background: "#fff",
  },
  titulo: { fontSize: 18, fontWeight: 600, color: "#1A1A1A", margin: 0 },

  // tabela
  tableWrap: { padding: "20px 24px", flex: 1 },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr 110px",
    gap: 8, padding: "8px 14px",
    fontSize: 11, color: "#999",
    textTransform: "uppercase", letterSpacing: "0.05em",
    borderBottom: "1px solid #E0E0E0", marginBottom: 6,
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr 110px",
    gap: 8, alignItems: "center",
    padding: "12px 14px", borderRadius: 8,
    background: "#fff", marginBottom: 4,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #EBEBEB",
  },
  membroNome: { fontWeight: 600, fontSize: 14, color: "#1A1A1A" },
  membroSlug: { fontSize: 11, color: "#999", marginTop: 2 },
  celula: { fontSize: 13, color: "#555" },
  celulaApagada: { fontSize: 12, color: "#aaa" },
  badgeAtivo: {
    display: "inline-block", fontSize: 11,
    padding: "3px 10px", borderRadius: 20,
    background: "#E8F5E9", color: "#2E7D32", fontWeight: 600,
  },
  badgeInativo: {
    display: "inline-block", fontSize: 11,
    padding: "3px 10px", borderRadius: 20,
    background: "#F5F5F5", color: "#999",
  },
  vazio: { color: "#aaa", fontSize: 14, padding: "32px 0", textAlign: "center" },
  btnGerenciar: {
    background: "#fff", border: "1px solid #E0E0E0", borderRadius: 6,
    padding: "6px 12px", fontSize: 12, cursor: "pointer", color: "#444",
  },

  // botões gerais
  btnPrimary: {
    background: "#F57C00", color: "#fff",
    border: "none", borderRadius: 8,
    padding: "9px 18px", fontSize: 13,
    fontWeight: 600, cursor: "pointer",
  },
  btnSecondary: {
    background: "#F5F5F5", color: "#555",
    border: "1px solid #E0E0E0", borderRadius: 8,
    padding: "9px 18px", fontSize: 13, cursor: "pointer",
  },
  btnDesativar: {
    background: "#FFEBEE", color: "#C62828",
    border: "1px solid #FFCDD2", borderRadius: 8,
    padding: "9px 16px", fontSize: 13, cursor: "pointer",
    width: "100%", textAlign: "left",
  },
  btnAtivar: {
    background: "#E8F5E9", color: "#2E7D32",
    border: "1px solid #C8E6C9", borderRadius: 8,
    padding: "9px 16px", fontSize: 13, cursor: "pointer",
    width: "100%", textAlign: "left",
  },

  // overlay e drawer
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex", justifyContent: "flex-end",
    zIndex: 1000,
  },
  drawer: {
    width: 440, height: "100%",
    background: "#fff",
    borderLeft: "1px solid #E0E0E0",
    display: "flex", flexDirection: "column",
    overflowY: "auto",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
  },

  // cabeçalho drawer
  drawerHead: {
    padding: "16px 20px",
    borderBottom: "1px solid #EBEBEB",
    display: "flex", alignItems: "center", gap: 12,
    flexShrink: 0,
  },
  avatar: {
    width: 42, height: 42, borderRadius: "50%",
    background: "#E3F2FD", color: "#1565C0",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 15, fontWeight: 700, flexShrink: 0,
  },
  drawerNome: { fontSize: 15, fontWeight: 600, color: "#1A1A1A" },
  drawerMeta: { fontSize: 12, color: "#999", marginTop: 2 },
  btnFechar: {
    marginLeft: "auto", background: "none", border: "none",
    fontSize: 18, cursor: "pointer", color: "#aaa", padding: 4, flexShrink: 0,
  },

  // abas
  abaRow: {
    display: "flex", gap: 6, padding: "12px 20px",
    borderBottom: "1px solid #EBEBEB", flexShrink: 0,
    flexWrap: "wrap",
  },
  aba: {
    padding: "5px 14px", borderRadius: 6,
    border: "1px solid #E0E0E0",
    background: "#fff", color: "#666",
    fontSize: 12, cursor: "pointer",
  },
  abaAtiva: {
    padding: "5px 14px", borderRadius: 6,
    border: "1px solid #F57C00",
    background: "#F57C00", color: "#fff",
    fontSize: 12, cursor: "pointer", fontWeight: 600,
  },

  // corpo drawer
  drawerBody: { flex: 1, padding: "20px", overflowY: "auto" },
  secTitulo: {
    fontSize: 11, fontWeight: 600, color: "#aaa",
    textTransform: "uppercase", letterSpacing: "0.07em",
    marginBottom: 14,
  },
  campo: { marginBottom: 14 },
  campoLabel: { display: "block", fontSize: 12, color: "#777", marginBottom: 4 },
  campoInput: {
    width: "100%", border: "1px solid #E0E0E0",
    borderRadius: 7, padding: "8px 10px",
    fontSize: 13, color: "#1A1A1A",
    background: "#FAFAFA", boxSizing: "border-box",
    outline: "none",
  },
  aviso: {
    background: "#FFF8E1", border: "1px solid #FFE082",
    borderRadius: 8, padding: "10px 14px",
    fontSize: 13, color: "#5D4037",
    marginBottom: 18, lineHeight: 1.6,
  },

  // auditoria
  auditItem: {
    display: "flex", gap: 12, alignItems: "flex-start",
    padding: "12px 0", borderBottom: "1px solid #F5F5F5",
  },
  auditIcone: { fontSize: 20, flexShrink: 0, marginTop: 1 },
  auditAcao: { fontSize: 13, color: "#1A1A1A", fontWeight: 500 },
  auditMeta: { fontSize: 12, color: "#aaa", marginTop: 2 },
  auditDetalhe: { fontSize: 12, color: "#777", marginTop: 4, fontStyle: "italic" },

  // footer drawer
  drawerFooter: {
    padding: "14px 20px",
    borderTop: "1px solid #EBEBEB",
    display: "flex", gap: 8, justifyContent: "flex-end",
    flexShrink: 0,
  },

  // toast
  toast: {
    position: "fixed", bottom: 24, right: 24,
    color: "#fff", padding: "13px 22px",
    borderRadius: 8, fontSize: 14, fontWeight: 500,
    zIndex: 9999, boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
    maxWidth: 380,
  },
};
