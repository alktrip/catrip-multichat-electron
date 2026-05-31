/** Límite de WebContentsView vivas y selección de cuentas a suspender. */

/** 0 = sin límite (desactivado). */
export const MAX_LIVE_ACCOUNT_OPTIONS = [0, 1, 2, 3, 4, 6] as const;
export type MaxLiveAccounts = (typeof MAX_LIVE_ACCOUNT_OPTIONS)[number];

export const DEFAULT_MAX_LIVE_ACCOUNTS: MaxLiveAccounts = 0;

export function normalizeMaxLiveAccounts(raw: unknown): MaxLiveAccounts {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_MAX_LIVE_ACCOUNTS;
  const rounded = Math.round(n);
  if ((MAX_LIVE_ACCOUNT_OPTIONS as readonly number[]).includes(rounded)) {
    return rounded as MaxLiveAccounts;
  }
  return DEFAULT_MAX_LIVE_ACCOUNTS;
}

export type LiveViewLimitInput = {
  /** 0 = ilimitado. */
  maxLiveAccounts: number;
  activeAccountId: string | null;
  liveAccountIds: readonly string[];
  lastActiveAtMs: Readonly<Record<string, number>>;
  /** Cuentas con llamada activa; no se suspenden por límite. */
  callActiveIds: ReadonlySet<string>;
};

/**
 * Devuelve ids de cuentas inactivas a suspender para respetar el límite.
 * Orden: menos recientemente usadas primero.
 */
export function accountsToSuspendForLiveLimit(input: LiveViewLimitInput): string[] {
  const limit = input.maxLiveAccounts;
  if (!Number.isFinite(limit) || limit <= 0) return [];
  const live = [...input.liveAccountIds];
  if (live.length <= limit) return [];

  const excess = live.length - limit;
  const candidates = live
    .filter((id) => id !== input.activeAccountId)
    .filter((id) => !input.callActiveIds.has(id))
    .sort((a, b) => {
      const ta = input.lastActiveAtMs[a] ?? 0;
      const tb = input.lastActiveAtMs[b] ?? 0;
      return ta - tb;
    });

  return candidates.slice(0, excess);
}
