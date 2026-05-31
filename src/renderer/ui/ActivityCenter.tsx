import React from "react";
import { useTranslation } from "react-i18next";
import AccountAvatar from "./AccountAvatar";
import type { AccountSessionStatus } from "../../preload/preload";
import { formatRelativeTimeI18n, sessionStatusLabel } from "../../shared/i18n/formatters";

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

const STATUS_COLOR: Record<AccountSessionStatus, string> = {
  loading: "#9ca3af",
  qr: "#fbbf24",
  connected: "#34d399",
  offline: "#f87171",
};

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
  const { t } = useTranslation();

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
            {t("activity.title")}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#b8c4c4", lineHeight: 1.5 }}>
            {t("activity.subtitle")}
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
            {totalUnread > 99 ? "99+" : totalUnread} {t("common.unreadLabel")}
          </span>
        ) : null}
      </div>

      {sorted.length === 0 ? (
        <p className="catrip-text-hint" style={{ margin: 0 }}>
          {t("activity.empty")}
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
          {sorted.map((a) => {
            const snap = activityByAccount[a.id];
            const unread = snap?.unread ?? 0;
            const status = snap?.status ?? "loading";
            const isActive = a.id === activeId;
            const preview =
              snap?.lastPreview ||
              (unread > 0 ? t("activity.previewUnread") : t("activity.noRecentActivity"));
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
                          {t("activity.active")}
                        </span>
                      ) : null}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: STATUS_COLOR[status],
                        }}
                      >
                        {sessionStatusLabel(t, status)}
                      </span>
                      {unread > 0 ? (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: "var(--catrip-accent-soft)",
                            border: "1px solid var(--catrip-accent-border)",
                            color: "#c8f5dc",
                          }}
                        >
                          {unread > 99 ? "99+" : unread}
                        </span>
                      ) : null}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#dce4e4",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sender ? `${sender}: ${preview}` : preview}
                    </div>
                    <div className="catrip-text-hint" style={{ fontSize: 11, marginTop: 4 }}>
                      {formatRelativeTimeI18n(t, snap?.lastActivityAt ?? null)}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
