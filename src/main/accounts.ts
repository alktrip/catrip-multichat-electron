import { app, session, type Session } from "electron";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getIconVariants, getNewIconSvg, isLegacyIconSvg } from "./userIcon";

export type Account = {
  id: string;
  label: string;
  /** Avatar por cuenta: SVG en texto o Data URL (`data:image/...;base64,...`). */
  icon: string;
  /** Variantes pre-generadas del avatar (SVG). */
  iconVariants?: string[];
  /** Si false, no emitir notificaciones nativas para esta cuenta. */
  notificationsEnabled?: boolean;
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
  if (typeof raw === "string") {
    if (raw.startsWith("data:image/")) return raw;
    if (raw.includes("<svg")) return raw.includes("{}") ? raw.replace(/\{\}/g, "") : raw;
  }
  return getNewIconSvg("fallback");
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
      const labelTrimmed = a.label.trim();
      const hadIcon = typeof (a as Account).icon === "string";
      let icon = normalizeIcon((a as Account).icon);
      if (!hadIcon) migrated = true;
      const variantsRaw = (a as Account).iconVariants;
      let iconVariants: string[] | undefined =
        Array.isArray(variantsRaw) &&
        variantsRaw.every((x) => typeof x === "string" && x.includes("<svg"))
          ? variantsRaw
          : undefined;
      // Migración estilo "monogram": SVGs antiguos (logo embebido o template
      // legado) se reemplazan por avatares nuevos manteniendo `id` como seed
      // para que el color sea estable. La inicial se toma de `label`.
      if (isLegacyIconSvg(icon) || (iconVariants && iconVariants.some(isLegacyIconSvg))) {
        icon = getNewIconSvg(a.id, labelTrimmed);
        iconVariants = getIconVariants(a.id, 5, labelTrimmed);
        migrated = true;
      }
      const notifEnabledRaw = (a as Account).notificationsEnabled;
      const notificationsEnabled = typeof notifEnabledRaw === "boolean" ? notifEnabledRaw : true;
      accounts.push({ id: a.id, label: labelTrimmed, icon, iconVariants, notificationsEnabled });
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
  const finalLabel = (label || `Cuenta ${state.accounts.length + 1}`).trim();
  const iconVariants = getIconVariants(id, 5, finalLabel);
  const acc: Account = {
    id,
    label: finalLabel,
    icon: iconVariants[0] || getNewIconSvg(id, finalLabel),
    iconVariants,
    notificationsEnabled: true,
  };
  state.accounts.push(acc);
  if (!state.activeId) state.activeId = acc.id;
  return acc;
}

export function renameAccount(
  accounts: Account[],
  accountId: string,
  nextLabel: string,
): Account | null {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return null;
  const label = (nextLabel || "").trim();
  if (!label.length) return acc;
  const labelChanged = label !== acc.label;
  acc.label = label;
  // Si cambió la inicial, regenera el avatar manteniendo el id como seed:
  // el color del fondo permanece estable y solo se actualiza la letra.
  if (labelChanged) {
    acc.icon = getNewIconSvg(accountId, label);
    acc.iconVariants = getIconVariants(accountId, 5, label);
  }
  return acc;
}

export function ensureAccountIconVariants(
  accounts: Account[],
  accountId: string,
  count = 5,
): { account: Account; variants: string[] } | null {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return null;
  if (!acc.iconVariants || acc.iconVariants.length < 1) {
    acc.iconVariants = getIconVariants(accountId, count, acc.label);
    if (!acc.icon || !acc.icon.includes("<svg"))
      acc.icon = acc.iconVariants[0] || getNewIconSvg(accountId, acc.label);
  }
  return { account: acc, variants: acc.iconVariants };
}

export function setAccountIconVariant(
  accounts: Account[],
  accountId: string,
  idx: number,
): Account | null {
  const ensured = ensureAccountIconVariants(accounts, accountId, 5);
  if (!ensured) return null;
  const i = Math.max(0, Math.min(ensured.variants.length - 1, Math.floor(idx)));
  ensured.account.icon = ensured.variants[i] || ensured.account.icon;
  return ensured.account;
}

export function setAccountNotificationsEnabled(
  accounts: Account[],
  accountId: string,
  enabled: boolean,
): Account | null {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return null;
  acc.notificationsEnabled = !!enabled;
  return acc;
}

export function regenerateAccountIcon(accounts: Account[], accountId: string): Account | null {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return null;
  // Rotar a la siguiente variante. Las variantes son determinísticas por
  // (id, índice), así que basta con localizar el índice actual y avanzar.
  // Si el icono actual no coincide con ninguna variante (legacy / migración
  // recién aplicada), arrancamos en 0.
  const variants = getIconVariants(accountId, 5, acc.label);
  const currentIdx = variants.indexOf(acc.icon);
  const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % variants.length : 0;
  acc.iconVariants = variants;
  acc.icon = variants[nextIdx] || getNewIconSvg(accountId, acc.label);
  return acc;
}

/**
 * Elimina una cuenta del array (in-place) y calcula el nuevo `activeId` si la
 * borrada era la activa. Política: si era la activa, se selecciona la cuenta
 * que ocupa la misma posición tras el splice (la "siguiente"); si era la
 * última, se cae a la anterior; si no quedan cuentas, `null`.
 *
 * Esta función NO toca `BrowserView`s, sesiones ni archivos. El orquestador
 * en `main.ts` se encarga de eso para mantener `accounts.ts` libre de
 * dependencias del runtime de Electron (más allá de `session`).
 */
export function deleteAccount(
  accounts: Account[],
  activeId: string | null,
  accountId: string,
): { removed: Account; newActiveId: string | null } | null {
  const idx = accounts.findIndex((a) => a.id === accountId);
  if (idx < 0) return null;
  const [removed] = accounts.splice(idx, 1);

  let newActiveId = activeId;
  if (activeId === accountId) {
    if (accounts.length === 0) {
      newActiveId = null;
    } else {
      newActiveId = accounts[Math.min(idx, accounts.length - 1)].id;
    }
  }
  return { removed, newActiveId };
}

import { ensureSessionCodeCache } from "./whatsappViewRuntime";

const sessionsCodeCacheReady = new WeakSet<Session>();

export function ensureElectronSessionForAccount(accountId: string) {
  const ses = session.fromPartition(`persist:acct-${accountId}`);
  if (!sessionsCodeCacheReady.has(ses)) {
    sessionsCodeCacheReady.add(ses);
    ensureSessionCodeCache(ses, accountId);
  }
  return ses;
}
