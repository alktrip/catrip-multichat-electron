import React from "react";
import AccountAvatar from "./AccountAvatar";
import { pickTopUrgentChats, formatRelativeTime } from "../../main/pendingInboxModel";
import type { PendingAccountRef } from "../../main/pendingInboxModel";
import type { AccountActivityMap } from "../../preload/preload";

type Props = {
  accounts: PendingAccountRef[];
  activityByAccount: AccountActivityMap;
  onOpenChat: (accountId: string, chatName: string) => void;
  onOpenAllPending: () => void;
  onClose: () => void;
};

export default function UrgentNowPanel({
  accounts,
  activityByAccount,
  onOpenChat,
  onOpenAllPending,
  onClose,
}: Props) {
  const items = React.useMemo(
    () => pickTopUrgentChats(accounts, activityByAccount, 3),
    [accounts, activityByAccount],
  );

  const totalPending = React.useMemo(() => {
    let n = 0;
    for (const a of accounts) {
      n += activityByAccount[a.id]?.unread ?? 0;
    }
    return n;
  }, [accounts, activityByAccount]);

  return (
    <div className="catrip-urgent-panel" role="dialog" aria-label="Urgente ahora">
      <div className="catrip-urgent-panel-header">
        <div>
          <div className="catrip-urgent-panel-title">Ahora mismo</div>
          <div className="catrip-urgent-panel-sub">
            {items.length > 0
              ? "Lo más urgente en todas tus cuentas"
              : "Sin conversaciones pendientes"}
          </div>
        </div>
        <button type="button" className="catrip-urgent-panel-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      </div>

      {items.length === 0 ? (
        <p className="catrip-urgent-panel-empty">Estás al día. No hay chats sin leer.</p>
      ) : (
        <ul className="catrip-urgent-panel-list">
          {items.map((item) => (
            <li key={`${item.accountId}:${item.chatName}`}>
              <button
                type="button"
                className="catrip-urgent-panel-row"
                onClick={() => {
                  onOpenChat(item.accountId, item.chatName);
                  onClose();
                }}
              >
                <AccountAvatar icon={item.accountIcon} labelFallback={item.accountLabel} size={34} />
                <div className="catrip-urgent-panel-row-body">
                  <div className="catrip-urgent-panel-row-top">
                    <span className="catrip-urgent-panel-name">{item.chatName}</span>
                    <span className="catrip-urgent-panel-time">
                      {formatRelativeTime(item.lastActivityAt)}
                    </span>
                  </div>
                  <div className="catrip-urgent-panel-meta">
                    <span>{item.accountLabel}</span>
                    {item.unreadCount > 0 ? (
                      <span className="catrip-urgent-panel-unread">
                        {item.unreadCount > 99 ? "99+" : item.unreadCount} sin leer
                      </span>
                    ) : null}
                  </div>
                  {item.preview ? (
                    <div className="catrip-urgent-panel-preview">{item.preview}</div>
                  ) : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="catrip-urgent-panel-footer">
        {totalPending > 0 ? (
          <button type="button" className="catrip-urgent-panel-link" onClick={onOpenAllPending}>
            Ver todas las pendientes ({totalPending > 99 ? "99+" : totalPending})
          </button>
        ) : (
          <span className="catrip-text-hint" style={{ fontSize: 12 }}>
            Esc o clic fuera para cerrar
          </span>
        )}
      </div>
    </div>
  );
}
