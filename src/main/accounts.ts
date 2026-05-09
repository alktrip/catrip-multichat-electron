import { app, session } from "electron";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getNewIconSvg } from "./userIcon";

export type Account = {
  id: string;
  label: string;
  /** SVG del avatar, como `User.icon` en el proyecto PyQt (`UserIcon.get_new_icon_svg()`). */
  icon: string;
};

type AccountsState = {
  version: 1;
  activeId: string | null;
  accounts: Account[];
};

function statePath() {
  return path.join(app.getPath("userData"), "accounts.json");
}

function defaultState(): AccountsState {
  return { version: 1, activeId: null, accounts: [] };
}

function normalizeIcon(raw: unknown): string {
  if (typeof raw === "string" && raw.includes("<svg")) {
    return raw.includes("{}") ? raw.replace(/\{\}/g, "") : raw;
  }
  return getNewIconSvg();
}

export function loadAccountsState(): AccountsState {
  try {
    const p = statePath();
    if (!fs.existsSync(p)) return defaultState();
    const raw = fs.readFileSync(p, "utf-8");
    const parsed = JSON.parse(raw) as AccountsState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.accounts)) return defaultState();
    let migrated = false;
    const accounts: Account[] = [];
    for (const a of parsed.accounts) {
      if (!a || typeof a.id !== "string" || typeof a.label !== "string") continue;
      const hadIcon = typeof (a as Account).icon === "string" && (a as Account).icon.includes("<svg");
      const icon = hadIcon ? normalizeIcon((a as Account).icon) : getNewIconSvg();
      if (!hadIcon) migrated = true;
      accounts.push({ id: a.id, label: a.label.trim(), icon });
    }
    const next: AccountsState = {
      version: 1,
      activeId: typeof parsed.activeId === "string" ? parsed.activeId : null,
      accounts,
    };
    if (migrated) saveAccountsState(next);
    return next;
  } catch {
    return defaultState();
  }
}

export function saveAccountsState(state: AccountsState) {
  const p = statePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(state, null, 2), "utf-8");
}

export function createAccount(state: AccountsState, label?: string): Account {
  const id = crypto.randomUUID();
  const acc: Account = {
    id,
    label: (label || `Cuenta ${state.accounts.length + 1}`).trim(),
    icon: getNewIconSvg(),
  };
  state.accounts.push(acc);
  if (!state.activeId) state.activeId = acc.id;
  return acc;
}

export function regenerateAccountIcon(
  accounts: Account[],
  accountId: string
): Account | null {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return null;
  acc.icon = getNewIconSvg();
  return acc;
}

export function ensureElectronSessionForAccount(accountId: string) {
  return session.fromPartition(`persist:acct-${accountId}`);
}
