import React from "react";
import AccountAvatar from "./AccountAvatar";
import { buildPendingChatItems, formatRelativeTime } from "../../main/pendingInboxModel";
import type { PendingAccountRef } from "../../main/pendingInboxModel";
import type { AccountActivityMap } from "../../preload/preload";

type Props = {
  accounts: PendingAccountRef[];
  activityByAccount: AccountActivityMap;
  onOpenChat: (accountId: string, chatName: string) => void;
};

export default function PendingInbox({ accounts, activityByAccount, onOpenChat }: Props) {
  const items = React.useMemo(
    () => buildPendingChatItems(accounts, activityByAccount),
    [accounts, activityByAccount],
  );

  const totalUnread = React.useMemo(
    () => items.reduce((sum, item) => sum + item.unreadCount, 0),
    [items],
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
            Acciones pendientes
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#b8c4c4", lineHeight: 1.5 }}>
            Chats sin leer de todas las cuentas, ordenados por urgencia. Clic para abrir el chat en
            WhatsApp Web.
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

      {items.length === 0 ? (
        <p className="catrip-text-hint" style={{ margin: 0 }}>
          No hay chats pendientes en ninguna cuenta.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {items.map((item) => (
            <li key={`${item.accountId}:${item.chatName}`}>
              <button
                type="button"
                onClick={() => onOpenChat(item.accountId, item.chatName)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.22)",
                  padding: "12px 14px",
                  cursor: "pointer",
                  color: "#eef2f2",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <AccountAvatar icon={item.accountIcon} labelFallback={item.accountLabel} size={40} />
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
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{item.chatName}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{item.accountLabel}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af" }}>
                      {formatRelativeTime(item.lastActivityAt)}
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
                    {item.preview || "Mensajes sin leer"}
                  </div>
                </div>
                <span
                  className="catrip-unread-dot"
                  data-count={item.unreadCount > 99 ? "99+" : item.unreadCount}
                  aria-label={`${item.unreadCount} sin leer en este chat`}
                  style={{ position: "static", marginTop: 4 }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
