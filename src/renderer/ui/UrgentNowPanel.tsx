import React from "react";
import { useTranslation } from "react-i18next";
import AccountAvatar from "./AccountAvatar";
import { pickTopUrgentChats, formatRelativeTimeI18n } from "../../shared/i18n/pendingInboxI18n";
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
  const { t } = useTranslation();
  const items = React.useMemo(
    () => pickTopUrgentChats(accounts, activityByAccount, 3),
    [accounts, activityByAccount],
  );

  return (
    <div className="catrip-urgent-panel" role="dialog" aria-label={t("urgent.aria")}>
      <div className="catrip-urgent-panel-header">
        <div>
          <div className="catrip-urgent-panel-title">{t("urgent.title")}</div>
          <div className="catrip-urgent-panel-sub">
            {items.length > 0 ? t("urgent.subtitle") : t("urgent.subtitleEmpty")}
          </div>
        </div>
        <button
          type="button"
          className="catrip-urgent-panel-close"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          ×
        </button>
      </div>

      {items.length === 0 ? (
        <p className="catrip-urgent-panel-empty">{t("urgent.empty")}</p>
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
                <AccountAvatar
                  icon={item.accountIcon}
                  labelFallback={item.accountLabel}
                  size={36}
                />
                <div className="catrip-urgent-panel-row-body">
                  <div className="catrip-urgent-panel-row-top">
                    <div className="catrip-urgent-panel-row-title">{item.chatName}</div>
                    <div className="catrip-urgent-panel-row-time">
                      {formatRelativeTimeI18n(t, item.lastActivityAt)}
                    </div>
                  </div>
                  <div className="catrip-urgent-panel-row-meta">
                    <span>{item.accountLabel}</span>
                    {item.unreadCount > 0 ? (
                      <span className="catrip-urgent-panel-unread">
                        {item.unreadCount > 99 ? "99+" : item.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  {item.preview ? (
                    <div className="catrip-urgent-panel-row-preview">{item.preview}</div>
                  ) : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 ? (
        <button type="button" className="catrip-urgent-panel-all" onClick={onOpenAllPending}>
          {t("urgent.viewAll")}
        </button>
      ) : null}
    </div>
  );
}
