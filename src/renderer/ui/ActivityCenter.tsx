import React from "react";
import AccountAvatar from "./AccountAvatar";
import type { AccountSessionStatus } from "../../preload/preload";

export type ActivityAccount = {
  id: string;
  label: string;
  icon: string;
  notificationsEnabled?: boolean;
};

export type ActivitySnapshot = {
  unread: number;
  status: AccountSessionStatus;
  lastSender: string | null;
  lastPreview: string | null;
  lastActivityAt: number | null;
  unreadChats: Array<{ name: string; preview: string; unreadCount: number }>;
};

const STATUS_LABEL: Record<AccountSessionStatus, string> = {
  loading: "Cargando…",
  qr: "Esperando QR",
  connected: "Conectada",
  offline: "Sin red",
};

const STATUS_COLOR: Record<AccountSessionStatus, string> = {
  loading: "#9ca3af",
  qr: "#fbbf24",
  connected: "#34d399",
  offline: "#f87171",
};

function formatRelativeTime(ts: number | null): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  if (diff < 45_000) return "Ahora";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}

type Props = {
  accounts: ActivityAccount[];
  activeId: string | null;
  activityByAccount: Record<string, ActivitySnapshot>;
  onSelectAccount: (id: string) => void;
};

export default function ActivityCenter({
  accounts,
  activeId,
  activityByAccount,
  onSelectAccount,
}: Props) {
  const sorted = React.useMemo(() => {
    return accounts.slice().sort((a, b) => {
      const aa = activityByAccount[a.id];
      const bb = activityByAccount[b.id];
      const ua = aa?.unread ?? 0;
      const ub = bb?.unread ?? 0;
      if (ua !== ub) return ub - ua;
      const ta = aa?.lastActivityAt ?? 0;
      const tb = bb?.lastActivityAt ?? 0;
      return tb - ta;
    });
  }, [accounts, activityByAccount]);

  const totalUnread = React.useMemo(
    () => sorted.reduce((sum, a) => sum + (activityByAccount[a.id]?.unread ?? 0), 0),
    [sorted, activityByAccount],
  );

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
            Centro de actividad
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#b8c4c4", lineHeight: 1.5 }}>
            Resumen de todas tus cuentas. Clic para abrir la conversación en esa cuenta.
          </p>
        </div>
        {totalUnread > 0 ? (
          <span
            style={{
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 700,
              padding: "6px 10px",
              borderRadius: 999,
              background: "var(--catrip-accent-soft)",
              border: "1px solid var(--catrip-accent-border)",
              color: "#c8f5dc",
            }}
          >
            {totalUnread > 99 ? "99+" : totalUnread} sin leer
          </span>
        ) : null}
      </div>

      {sorted.length === 0 ? (
        <p className="catrip-text-hint" style={{ margin: 0 }}>
          Añade una cuenta para ver actividad aquí.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((a) => {
            const snap = activityByAccount[a.id];
            const unread = snap?.unread ?? 0;
            const status = snap?.status ?? "loading";
            const isActive = a.id === activeId;
            const preview =
              snap?.lastPreview ||
              (unread > 0 ? "Tienes mensajes sin leer" : "Sin actividad reciente");
            const sender = snap?.lastSender;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onSelectAccount(a.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: isActive
                      ? "1px solid rgb(var(--catrip-accent-rgb) / 0.55)"
                      : "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    background: isActive ? "rgba(52, 211, 153, 0.08)" : "rgba(0,0,0,0.22)",
                    padding: "12px 14px",
                    cursor: "pointer",
                    color: "#eef2f2",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <AccountAvatar icon={a.icon} labelFallback={a.label} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{a.label}</span>
                      {isActive ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "#34d399",
                          }}
                        >
                          Activa
                        </span>
                      ) : null}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: STATUS_COLOR[status],
                        }}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af" }}>
                        {formatRelativeTime(snap?.lastActivityAt ?? null)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#dce4e4",
                        lineHeight: 1.45,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sender ? (
                        <>
                          <span style={{ fontWeight: 600 }}>{sender}</span>
                          {preview ? `: ${preview}` : ""}
                        </>
                      ) : (
                        preview
                      )}
                    </div>
                    {snap && snap.unreadChats.length > 1 ? (
                      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                        {snap.unreadChats.slice(1, 4).map((chat) => (
                          <div
                            key={`${a.id}-${chat.name}`}
                            style={{
                              fontSize: 12,
                              color: "#b8c4c4",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            · {chat.name}
                            {chat.preview ? `: ${chat.preview}` : ""}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {unread > 0 && a.notificationsEnabled !== false ? (
                    <span
                      className="catrip-unread-dot"
                      data-count={unread > 99 ? "99+" : unread}
                      aria-label={`${unread} sin leer`}
                      style={{ position: "static", marginTop: 4 }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
