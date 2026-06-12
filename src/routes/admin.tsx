// src/routes/admin.tsx
// ============================================================
// Painel Admin — com drawer de gerenciamento por membro
// Funcionalidades: editar perfil, alterar senha, log de auditoria
// Acesso exclusivo: role = 'admin'
// ============================================================

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

// ─── Tipos ───────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────

function iniciais(nome: string): string {
  return nome
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function iconeAcao(acao: string): string {
  switch (acao) {
    case "alterar_senha": return "🔐";
    case "editar_perfil": return "✏️";
    case "desativar":     return "🚫";
    case "ativar":        return "✅";
    default:              return "📋";
  }
}

function labelAcao(acao: string): string {
  switch (acao) {
    case "alterar_senha": return "Senha alterada pelo admin";
    case "editar_perfil": return "Perfil editado pelo admin";
    case "desativar":     return "Conta desativada pelo admin";
    case "ativar":        return "Conta ativada pelo admin";
    default:              return acao;
  }
}

// ─── Componente principal ─────────────────────────────────────

function AdminPage() {
  const navigate = useNavigate();

  const [loading, setLoading]         = useState(true);
  const [membros, setMembros]         = useState<Membro[]>([]);
  const [membroAtivo, setMembroAtivo] = useState<Membro | null>(null);
  const [abaDrawer, setAbaDrawer]     = useState<"perfil" | "senha" | "links" | "auditoria">("perfil");
  const [auditLog, setAuditLog]       = useState<AuditLog[]>([]);
  const [toast, setToast]             = useState<{ msg: string; tipo: "ok" | "erro" } | null>(null);

  // form states
  const [formPerfil, setFormPerfil] = useState<Partial<Membro>>({});
  const [novaSenha, setNovaSenha]   = useState("");
  const [salvando, setSalvando]     = useState(false);

  // ─── Verificar role admin ─────────────────────────────────

  useEffect(() => {
    (async () => {
      const { data: roleData } = await supabase.rpc("get_my_role");
      if (roleData !== "admin") {
        navigate({ to: "/painel" });
        return;
      }
      await carregarMembros();
      setLoading(false);
    })();
  }, []);

  // ─── Carregar membros ─────────────────────────────────────

  async function carregarMembros() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setMembros(data as Membro[]);
  }

  // ─── Abrir drawer ─────────────────────────────────────────

  async function abrirDrawer(membro: Membro) {
    setMembroAtivo(membro);
    setFormPerfil(membro);
    setNovaSenha("");
    setAbaDrawer("perfil");
    await carregarAuditoria(membro.id);
  }

  async function carregarAuditoria(targetId: string) {
    const { data } = await supabase
      .from("admin_audit_log")
      .select("*")
      .eq("target_id", targetId)
      .order("created_at", { ascending: false })
      .limit(20);

    setAuditLog((data as AuditLog[]) ?? []);
  }

  function fecharDrawer() {
    setMembroAtivo(null);
    setAuditLog([]);
  }

  // ─── Chamar Edge Function ─────────────────────────────────

  async function chamarEdgeFunction(acao: string, dados?: Record<string, unknown>) {
    if (!membroAtivo) return;
    setSalvando(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-manage-member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          target_id:   membroAtivo.id,
          target_slug: membroAtivo.slug,
          acao,
          dados,
        }),
      }
    );

    const json = await res.json();
    setSalvando(false);

    if (!res.ok || json.error) {
      mostrarToast(json.error ?? "Erro ao executar ação", "erro");
      return;
    }

    mostrarToast(json.mensagem ?? "Ação executada", "ok");
    await carregarMembros();
    await carregarAuditoria(membroAtivo.id);

    // Atualizar membro ativo com novos dados
    const atualizado = membros.find((m) => m.id === membroAtivo.id);
    if (atualizado) setMembroAtivo({ ...atualizado, ...formPerfil });
  }

  // ─── Salvar perfil ────────────────────────────────────────

  async function salvarPerfil() {
    await chamarEdgeFunction("editar_perfil", { perfil: formPerfil });
  }

  // ─── Alterar senha ────────────────────────────────────────

  async function alterarSenha() {
    if (novaSenha.length < 6) {
      mostrarToast("Senha deve ter no mínimo 6 caracteres", "erro");
      return;
    }
    await chamarEdgeFunction("alterar_senha", { nova_senha: novaSenha });
    setNovaSenha("");
  }

  // ─── Ativar / Desativar conta ─────────────────────────────

  async function toggleAtivo() {
    if (!membroAtivo) return;
    const acao = membroAtivo.ativo ? "desativar" : "ativar";
    await chamarEdgeFunction(acao);
    setMembroAtivo({ ...membroAtivo, ativo: !membroAtivo.ativo });
  }

  // ─── Toast ────────────────────────────────────────────────

  function mostrarToast(msg: string, tipo: "ok" | "erro") {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  }

  // ─── Render ───────────────────────────────────────────────

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.loadingText}>Carregando painel...</div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.logo}>⚡ Energy<span style={{ color: "#F57C00" }}>IA</span></div>
        <nav>
          {[
            { label: "Membros", icon: "👥", path: "/admin" },
            { label: "Leads",   icon: "📋", path: "/admin/leads" },
            { label: "Painel",  icon: "🏠", path: "/painel" },
          ].map((item) => (
            <button
              key={item.path}
              style={s.navItem}
              onClick={() => navigate({ to: item.path as never })}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>
        {/* Banner de modo gerenciamento */}
        {membroAtivo && (
          <div style={s.banner}>
            <span>
              👁️ Você está gerenciando a conta de <strong>{membroAtivo.nome}</strong>. Alterações serão registradas no log de auditoria.
            </span>
            <button style={s.bannerBtn} onClick={fecharDrawer}>
              ↩ Fechar gerenciamento
            </button>
          </div>
        )}

        {/* Header */}
        <div style={s.topbar}>
          <h1 style={s.topbarTitle}>Membros da equipe</h1>
          <button style={s.btnPrimary} onClick={() => navigate({ to: "/cadastro" })}>
            + Novo membro
          </button>
        </div>

        {/* Tabela */}
        <div style={s.tableWrap}>
          <div style={s.tableHeader}>
            <span>Membro</span>
            <span>E-mail</span>
            <span>Slug</span>
            <span>Status</span>
            <span>Cadastro</span>
            <span></span>
          </div>

          {membros.map((m) => (
            <div key={m.id} style={s.tableRow}>
              <div>
                <div style={s.memberName}>{m.nome}</div>
                <div style={s.memberSlug}>/consultor/{m.slug}</div>
              </div>
              <div style={s.cellText}>{m.email}</div>
              <div style={s.cellText}>{m.slug}</div>
              <div>
                <span style={m.ativo ? s.badgeAtivo : s.badgeInativo}>
                  {m.ativo ? "ativo" : "inativo"}
                </span>
              </div>
              <div style={s.cellMuted}>{formatarData(m.created_at)}</div>
              <div>
                <button style={s.btnGerenciar} onClick={() => abrirDrawer(m)}>
                  ⚙️ Gerenciar
                </button>
              </div>
            </div>
          ))}

          {membros.length === 0 && (
            <div style={s.empty}>Nenhum membro cadastrado ainda.</div>
          )}
        </div>
      </main>

      {/* ── Drawer overlay ── */}
      {membroAtivo && (
        <div style={s.overlay} onClick={fecharDrawer}>
          <aside style={s.drawer} onClick={(e) => e.stopPropagation()}>
            {/* Header do drawer */}
            <div style={s.drawerHeader}>
              <div style={s.avatar}>{iniciais(membroAtivo.nome)}</div>
              <div>
                <div style={s.drawerNome}>{membroAtivo.nome}</div>
                <div style={s.drawerMeta}>energyia.club/consultor/{membroAtivo.slug}</div>
              </div>
              <button style={s.btnClose} onClick={fecharDrawer}>✕</button>
            </div>

            {/* Abas */}
            <div style={s.tabRow}>
              {(["perfil", "senha", "links", "auditoria"] as const).map((aba) => (
                <button
                  key={aba}
                  style={abaDrawer === aba ? s.tabAtivo : s.tab}
                  onClick={() => setAbaDrawer(aba)}
                >
                  {aba.charAt(0).toUpperCase() + aba.slice(1)}
                </button>
              ))}
            </div>

            {/* Corpo do drawer */}
            <div style={s.drawerBody}>

              {/* ── ABA PERFIL ── */}
              {abaDrawer === "perfil" && (
                <div>
                  <div style={s.sectionTitle}>Dados pessoais</div>
                  {[
                    { label: "Nome completo", key: "nome" },
                    { label: "WhatsApp (com DDI)", key: "whatsapp" },
                    { label: "Telefone", key: "telefone" },
                    { label: "Instagram", key: "instagram" },
                    { label: "Cidade", key: "cidade" },
                    { label: "Slug (URL)", key: "slug" },
                  ].map(({ label, key }) => (
                    <div key={key} style={s.fieldRow}>
                      <label style={s.fieldLabel}>{label}</label>
                      <input
                        style={s.fieldInput}
                        value={(formPerfil as Record<string, string>)[key] ?? ""}
                        onChange={(e) =>
                          setFormPerfil((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                    </div>
                  ))}

                  <div style={{ marginTop: 16 }}>
                    <div style={s.sectionTitle}>Status da conta</div>
                    <button
                      style={membroAtivo.ativo ? s.btnDanger : s.btnSuccess}
                      onClick={toggleAtivo}
                      disabled={salvando}
                    >
                      {membroAtivo.ativo ? "🚫 Desativar conta" : "✅ Ativar conta"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── ABA SENHA ── */}
              {abaDrawer === "senha" && (
                <div>
                  <div style={s.sectionTitle}>🔐 Alterar senha</div>
                  <div style={s.avisoBox}>
                    Somente o administrador pode alterar senhas. Esta ação será registrada no log de auditoria com data e hora.
                  </div>
                  <div style={s.fieldRow}>
                    <label style={s.fieldLabel}>Nova senha</label>
                    <input
                      type="text"
                      style={s.fieldInput}
                      placeholder="Mínimo 6 caracteres"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                  </div>
                  <button
                    style={{ ...s.btnPrimary, marginTop: 8, width: "100%" }}
                    onClick={alterarSenha}
                    disabled={salvando || novaSenha.length < 6}
                  >
                    {salvando ? "Alterando..." : "Confirmar nova senha"}
                  </button>
                </div>
              )}

              {/* ── ABA LINKS ── */}
              {abaDrawer === "links" && (
                <div>
                  <div style={s.sectionTitle}>Links de afiliado</div>
                  {[
                    { label: "Link Ebook (R$17)", key: "link_ebook" },
                    { label: "Link Patrocinador (R$249,90)", key: "link_patrocinador" },
                    { label: "Link Ferramentas (R$197)", key: "link_ferramentas" },
                    { label: "Link Cliente", key: "link_cliente" },
                    { label: "Link Guia", key: "link_guia" },
                  ].map(({ label, key }) => (
                    <div key={key} style={s.fieldRow}>
                      <label style={s.fieldLabel}>{label}</label>
                      <input
                        style={s.fieldInput}
                        value={(formPerfil as Record<string, string>)[key] ?? ""}
                        onChange={(e) =>
                          setFormPerfil((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        placeholder="https://"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ── ABA AUDITORIA ── */}
              {abaDrawer === "auditoria" && (
                <div>
                  <div style={s.sectionTitle}>📋 Histórico de ações do admin</div>
                  {auditLog.length === 0 ? (
                    <div style={s.empty}>Nenhuma ação registrada ainda.</div>
                  ) : (
                    auditLog.map((log) => (
                      <div key={log.id} style={s.auditItem}>
                        <span style={s.auditIcon}>{iconeAcao(log.acao)}</span>
                        <div>
                          <div style={s.auditAcao}>{labelAcao(log.acao)}</div>
                          <div style={s.auditMeta}>
                            Admin: {log.admin_slug} · {formatarData(log.created_at)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer do drawer */}
            {(abaDrawer === "perfil" || abaDrawer === "links") && (
              <div style={s.drawerFooter}>
                <button style={s.btnSecondary} onClick={fecharDrawer}>
                  Cancelar
                </button>
                <button
                  style={s.btnPrimary}
                  onClick={salvarPerfil}
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ ...s.toast, background: toast.tipo === "ok" ? "#2E7D32" : "#C62828" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#FAFAFA",
    fontFamily: "DM Sans, sans-serif",
    position: "relative",
  },
  loadingWrap: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: "#FAFAFA",
  },
  loadingText: { color: "#666", fontSize: 16 },

  // sidebar
  sidebar: {
    width: 220,
    background: "#1A1A1A",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flexShrink: 0,
  },
  logo: {
    fontSize: 20, fontWeight: 700, color: "#fff",
    padding: "8px 8px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: 12,
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 8,
    background: "transparent", border: "none",
    color: "#ccc", fontSize: 14, cursor: "pointer",
    textAlign: "left", width: "100%",
  },

  // main
  main: { flex: 1, display: "flex", flexDirection: "column" },
  banner: {
    background: "#FFF3E0",
    borderBottom: "1px solid #FFB74D",
    padding: "10px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontSize: 13, color: "#E65100",
  },
  bannerBtn: {
    background: "white", border: "1px solid #FFB74D", color: "#E65100",
    borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer",
    marginLeft: 16, whiteSpace: "nowrap",
  },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px", borderBottom: "1px solid #E0E0E0",
  },
  topbarTitle: { fontSize: 18, fontWeight: 600, color: "#1A1A1A", margin: 0 },

  // tabela
  tableWrap: { padding: "16px 24px", flex: 1 },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr 100px",
    gap: 8, padding: "8px 12px",
    fontSize: 11, color: "#888", textTransform: "uppercase",
    letterSpacing: "0.05em", borderBottom: "1px solid #E0E0E0",
    marginBottom: 4,
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr 100px",
    gap: 8, alignItems: "center",
    padding: "12px", borderRadius: 8,
    border: "1px solid transparent",
    marginBottom: 2,
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  memberName: { fontWeight: 600, fontSize: 14, color: "#1A1A1A" },
  memberSlug: { fontSize: 12, color: "#888" },
  cellText: { fontSize: 13, color: "#444" },
  cellMuted: { fontSize: 12, color: "#888" },
  badgeAtivo: {
    display: "inline-block", fontSize: 11,
    padding: "2px 10px", borderRadius: 20,
    background: "#E8F5E9", color: "#2E7D32",
  },
  badgeInativo: {
    display: "inline-block", fontSize: 11,
    padding: "2px 10px", borderRadius: 20,
    background: "#F5F5F5", color: "#888",
  },
  empty: { color: "#888", fontSize: 14, padding: "24px 0", textAlign: "center" },

  // botões
  btnPrimary: {
    background: "#F57C00", color: "white",
    border: "none", borderRadius: 8,
    padding: "9px 18px", fontSize: 13,
    fontWeight: 600, cursor: "pointer",
  },
  btnSecondary: {
    background: "#F5F5F5", color: "#444",
    border: "1px solid #E0E0E0", borderRadius: 8,
    padding: "9px 18px", fontSize: 13, cursor: "pointer",
  },
  btnGerenciar: {
    background: "white", border: "1px solid #E0E0E0", borderRadius: 6,
    padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#333",
  },
  btnDanger: {
    background: "#FFEBEE", color: "#C62828",
    border: "1px solid #EF9A9A", borderRadius: 8,
    padding: "8px 14px", fontSize: 13, cursor: "pointer",
    width: "100%", textAlign: "left",
  },
  btnSuccess: {
    background: "#E8F5E9", color: "#2E7D32",
    border: "1px solid #A5D6A7", borderRadius: 8,
    padding: "8px 14px", fontSize: 13, cursor: "pointer",
    width: "100%", textAlign: "left",
  },
  btnClose: {
    marginLeft: "auto", background: "none", border: "none",
    fontSize: 18, cursor: "pointer", color: "#888", padding: 4,
  },

  // drawer
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex", justifyContent: "flex-end",
    zIndex: 1000,
  },
  drawer: {
    width: 420, height: "100%",
    background: "#fff",
    borderLeft: "1px solid #E0E0E0",
    display: "flex", flexDirection: "column",
    overflowY: "auto",
  },
  drawerHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #E0E0E0",
    display: "flex", alignItems: "center", gap: 12,
    flexShrink: 0,
  },
  avatar: {
    width: 40, height: 40, borderRadius: "50%",
    background: "#E3F2FD", color: "#1565C0",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  drawerNome: { fontSize: 15, fontWeight: 600, color: "#1A1A1A" },
  drawerMeta: { fontSize: 12, color: "#888" },

  // abas
  tabRow: {
    display: "flex", gap: 4, padding: "12px 20px",
    borderBottom: "1px solid #E0E0E0", flexShrink: 0,
  },
  tab: {
    padding: "5px 12px", borderRadius: 6,
    border: "1px solid #E0E0E0",
    background: "white", color: "#666",
    fontSize: 12, cursor: "pointer",
  },
  tabAtivo: {
    padding: "5px 12px", borderRadius: 6,
    border: "1px solid #F57C00",
    background: "#F57C00", color: "white",
    fontSize: 12, cursor: "pointer",
    fontWeight: 600,
  },

  // corpo drawer
  drawerBody: { flex: 1, padding: "16px 20px", overflowY: "auto" },
  sectionTitle: {
    fontSize: 11, fontWeight: 600, color: "#888",
    textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: 12,
  },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { display: "block", fontSize: 12, color: "#666", marginBottom: 4 },
  fieldInput: {
    width: "100%", border: "1px solid #E0E0E0",
    borderRadius: 6, padding: "7px 10px",
    fontSize: 13, color: "#1A1A1A",
    background: "#FAFAFA", boxSizing: "border-box",
  },
  avisoBox: {
    background: "#FFF8E1", border: "1px solid #FFE082",
    borderRadius: 8, padding: "10px 14px",
    fontSize: 13, color: "#5D4037",
    marginBottom: 16, lineHeight: 1.5,
  },

  // auditoria
  auditItem: {
    display: "flex", gap: 10, alignItems: "flex-start",
    padding: "10px 0", borderBottom: "1px solid #F5F5F5",
  },
  auditIcon: { fontSize: 18, flexShrink: 0, marginTop: 2 },
  auditAcao: { fontSize: 13, color: "#1A1A1A", fontWeight: 500 },
  auditMeta: { fontSize: 12, color: "#888", marginTop: 2 },

  // footer drawer
  drawerFooter: {
    padding: "12px 20px",
    borderTop: "1px solid #E0E0E0",
    display: "flex", gap: 8, flexShrink: 0,
    justifyContent: "flex-end",
  },

  // toast
  toast: {
    position: "fixed", bottom: 24, right: 24,
    color: "white", padding: "12px 20px",
    borderRadius: 8, fontSize: 14, fontWeight: 500,
    zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
};
