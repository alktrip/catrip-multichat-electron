import { app, type WebContents } from "electron";
import type { Settings } from "./settings";
import { buildWhatsAppWebUserAgent } from "./chromiumUserAgent";
import { resolveEffectiveChromiumProfile, resolveOzonePlatform } from "./chromiumLaunch";

export type PerformanceDiagnosticsAccountView = {
  accountId: string;
  label: string;
  url: string;
  suspended: boolean;
  attached: boolean;
  processId: number | null;
  osProcessId: number | null;
  memoryWorkingSetKb: number | null;
};

export type PerformanceDiagnosticsData = {
  collectedAt: string;
  appVersion: string;
  electronVersion: string;
  chromeVersion: string;
  nodeVersion: string;
  platform: string;
  arch: string;
  userAgent: string;
  chromiumProfile: string;
  effectiveChromiumProfile: ReturnType<typeof resolveEffectiveChromiumProfile>;
  ozonePlatformSetting: string;
  resolvedOzonePlatform: string | null;
  maxLiveAccounts: number;
  prewarmOnHover: boolean;
  rendererProcessLimit: number;
  gpuBoost: boolean;
  processMemory: NodeJS.MemoryUsage;
  appMetrics: Array<{
    type: string;
    pid: number;
    memoryWorkingSetKb: number;
    cpuPercent?: number;
  }>;
  accounts: PerformanceDiagnosticsAccountView[];
  liveViewCount: number;
  suspendedCount: number;
  heartbeatStats: {
    totalExecutions: number;
    lastExecutionAt: string | null;
  };
};

export type PerformanceDiagnosticsDeps = {
  getSettings: () => Settings;
  getAppVersion: () => string;
  getAccounts: () => Array<{ id: string; label: string }>;
  getActiveAccountId: () => string | null;
  getAttachedViewId: () => string | null;
  getSuspendedIds: () => ReadonlySet<string>;
  getViewForAccount: (id: string) => { webContents: WebContents } | undefined;
  getHeartbeatStats: () => { totalExecutions: number; lastExecutionAt: number | null };
};

function metricForWebContents(wc: WebContents): {
  processId: number | null;
  osProcessId: number | null;
  memoryWorkingSetKb: number | null;
} {
  try {
    if (wc.isDestroyed()) {
      return { processId: null, osProcessId: null, memoryWorkingSetKb: null };
    }
    const pid = wc.getProcessId();
    const metrics = app.getAppMetrics();
    const match = metrics.find((m) => m.pid === pid);
    return {
      processId: pid,
      osProcessId: match?.pid ?? null,
      memoryWorkingSetKb: match?.memory?.workingSetSize ?? null,
    };
  } catch {
    return { processId: null, osProcessId: null, memoryWorkingSetKb: null };
  }
}

export function collectPerformanceDiagnostics(
  deps: PerformanceDiagnosticsDeps,
): PerformanceDiagnosticsData {
  const settings = deps.getSettings();
  const metrics = (() => {
    try {
      return app.getAppMetrics().map((m) => ({
        type: String(m.type),
        pid: m.pid,
        memoryWorkingSetKb: m.memory?.workingSetSize ?? 0,
        cpuPercent: typeof m.cpu?.percentCPUUsage === "number" ? m.cpu.percentCPUUsage : undefined,
      }));
    } catch {
      return [];
    }
  })();

  const suspended = deps.getSuspendedIds();
  const attachedId = deps.getAttachedViewId();
  const heartbeat = deps.getHeartbeatStats();

  const accounts = deps.getAccounts().map((acc) => {
    const view = deps.getViewForAccount(acc.id);
    const wc = view?.webContents;
    let url = "";
    let proc = {
      processId: null as number | null,
      osProcessId: null as number | null,
      memoryWorkingSetKb: null as number | null,
    };
    if (wc && !wc.isDestroyed()) {
      try {
        url = wc.getURL();
      } catch {
        url = "";
      }
      proc = metricForWebContents(wc);
    }
    return {
      accountId: acc.id,
      label: acc.label,
      url,
      suspended: suspended.has(acc.id),
      attached: attachedId === acc.id,
      ...proc,
    };
  });

  return {
    collectedAt: new Date().toISOString(),
    appVersion: deps.getAppVersion(),
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    userAgent: buildWhatsAppWebUserAgent(),
    chromiumProfile: settings.performance.chromiumProfile,
    effectiveChromiumProfile: resolveEffectiveChromiumProfile(settings.performance),
    ozonePlatformSetting: settings.performance.ozonePlatform,
    resolvedOzonePlatform: resolveOzonePlatform(settings.performance.ozonePlatform),
    rendererProcessLimit: settings.performance.rendererProcessLimit,
    maxLiveAccounts: settings.performance.maxLiveAccounts,
    prewarmOnHover: settings.performance.prewarmOnHover,
    gpuBoost: settings.performance.gpuBoost,
    processMemory: process.memoryUsage(),
    appMetrics: metrics,
    accounts,
    liveViewCount: accounts.filter((a) => !a.suspended && a.url).length,
    suspendedCount: suspended.size,
    heartbeatStats: {
      totalExecutions: heartbeat.totalExecutions,
      lastExecutionAt:
        heartbeat.lastExecutionAt != null
          ? new Date(heartbeat.lastExecutionAt).toISOString()
          : null,
    },
  };
}
