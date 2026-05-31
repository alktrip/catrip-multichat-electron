import React from "react";
import { useTranslation } from "react-i18next";
import AccountAvatar from "./AccountAvatar";
import { buildPendingChatItems, formatRelativeTimeI18n } from "../../shared/i18n/pendingInboxI18n";
import type { PendingAccountRef } from "../../main/pendingInboxModel";
import type { AccountActivityMap } from "../../preload/preload";

type Props = {
  accounts: PendingAccountRef[];
  activityByAccount: AccountActivityMap;
  onOpenChat: (accountId: string, chatName: string) => void;
};

export default function PendingInbox({ accounts, activityByAccount, onOpenChat }: Props) {
  const { t } = useTranslation();
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
            {t("pending.title")}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#b8c4c4", lineHeight: 1.5 }}>
            {t("pending.subtitle")}
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
            {t("common.unread", { count: totalUnread > 99 ? 99 : totalUnread })}
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="catrip-text-hint" style={{ margin: 0 }}>
          {t("pending.empty")}
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
                <AccountAvatar
                  icon={item.accountIcon}
                  labelFallback={item.accountLabel}
                  size={40}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{item.chatName}</span>
                    {item.unreadCount > 0 ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "var(--catrip-accent-soft)",
                          border: "1px solid var(--catrip-accent-border)",
                          color: "#c8f5dc",
                        }}
                      >
                        {item.unreadCount > 99 ? "99+" : item.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <div className="catrip-text-hint" style={{ fontSize: 12, marginBottom: 4 }}>
                    {item.accountLabel}
                  </div>
                  {item.preview ? (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#dce4e4",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.preview}
                    </div>
                  ) : null}
                  <div className="catrip-text-hint" style={{ fontSize: 11, marginTop: 4 }}>
                    {formatRelativeTimeI18n(t, item.lastActivityAt)}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
