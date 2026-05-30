/** Lógica pura para suspender cuentas inactivas (WebContentsView destruida, sesión en disco). */

export const SUSPEND_AFTER_MINUTE_OPTIONS = [5, 10, 15, 30, 60] as const;
export type SuspendAfterMinutes = (typeof SUSPEND_AFTER_MINUTE_OPTIONS)[number];

export const DEFAULT_SUSPEND_AFTER_MINUTES: SuspendAfterMinutes = 15;

export function normalizeSuspendAfterMinutes(raw: unknown): SuspendAfterMinutes {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_SUSPEND_AFTER_MINUTES;
  const rounded = Math.round(n);
  if ((SUSPEND_AFTER_MINUTE_OPTIONS as readonly number[]).includes(rounded)) {
    return rounded as SuspendAfterMinutes;
  }
  return DEFAULT_SUSPEND_AFTER_MINUTES;
}

export type SuspendCandidateInput = {
  enabled: boolean;
  accountId: string;
  activeAccountId: string | null;
  hasLiveView: boolean;
  alreadySuspended: boolean;
  lastActiveAtMs: number | undefined;
  nowMs: number;
  suspendAfterMinutes: number;
  callActive: boolean;
};

export function shouldSuspendAccount(input: SuspendCandidateInput): boolean {
  if (!input.enabled) return false;
  if (input.alreadySuspended) return false;
  if (!input.hasLiveView) return false;
  if (input.accountId === input.activeAccountId) return false;
  if (input.callActive) return false;
  const last = input.lastActiveAtMs ?? input.nowMs;
  const thresholdMs = Math.max(1, input.suspendAfterMinutes) * 60 * 1000;
  return input.nowMs - last >= thresholdMs;
}

export function buildSuspendedMap(
  accountIds: readonly string[],
  suspendedIds: ReadonlySet<string>,
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const id of accountIds) {
    out[id] = suspendedIds.has(id);
  }
  return out;
}
