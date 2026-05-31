import React from "react";
import type { DevContextDto } from "../../preload/preload";

const APP_VERSION = typeof __CATRIP_APP_VERSION__ === "string" ? __CATRIP_APP_VERSION__ : "0.0.0";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="catrip-dev-banner-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function DevBanner() {
  const [expanded, setExpanded] = React.useState(false);
  const [ctx, setCtx] = React.useState<DevContextDto | null>(null);
  const [accounts, setAccounts] = React.useState<Array<{ id: string; label: string }>>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const bridgeReady = typeof window.catrip?.getDevContext === "function";
  const isBrowserPreview = !!window.__CATRIP_BROWSER_PREVIEW__;

  React.useEffect(() => {
    if (!bridgeReady) return;
    const api = window.catrip!;
    let mounted = true;

    const refresh = async () => {
      try {
        const [devCtx, accs, active] = await Promise.all([
          api.getDevContext!(),
          api.listAccounts!(),
          api.getActiveAccountId!(),
        ]);
        if (!mounted) return;
        setCtx(devCtx);
        setAccounts(accs ?? []);
        setActiveId(active);
      } catch {
        // ignore
      }
    };

    void refresh();
    const offActive = api.onActiveAccountChanged?.((id) => setActiveId(id));
    const offList = api.onAccountsListChanged?.((accs) => setAccounts(accs ?? []));

    return () => {
      mounted = false;
      offActive?.();
      offList?.();
    };
  }, [bridgeReady]);

  const rendererUrl =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.href
      : "http://localhost:5173/";

  const activeLabel = accounts.find((a) => a.id === activeId)?.label ?? "—";
  const runtimeLine = isBrowserPreview
    ? "Preview navegador · datos simulados"
    : bridgeReady
      ? `Electron · ${ctx?.platform ?? "…"}/${ctx?.arch ?? "…"} · ${accounts.length} cuenta(s)`
      : "Solo renderer (sin preload de Electron)";

  return (
    <aside
      className={`catrip-dev-banner${expanded ? " is-expanded" : ""}`}
      aria-label="Información de desarrollo"
    >
      <button
        type="button"
        className="catrip-dev-banner-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        title={expanded ? "Contraer banner de desarrollo" : "Expandir banner de desarrollo"}
      >
        <span className="catrip-dev-banner-badge">DEV</span>
        <span className="catrip-dev-banner-summary">
          Catrip Connect v{ctx?.appVersion ?? APP_VERSION} · {runtimeLine}
          {bridgeReady && activeId ? ` · activa: ${activeLabel}` : ""}
        </span>
        <span className="catrip-dev-banner-chevron" aria-hidden>
          {expanded ? "▾" : "▴"}
        </span>
      </button>

      {expanded ? (
        <div className="catrip-dev-banner-body">
          <p className="catrip-dev-banner-lead">
            Modo desarrollo: UI servida por Vite. WhatsApp Web y la lógica de cuentas viven en el
            proceso principal de Electron; abrir esta URL en un navegador externo muestra solo el
            shell React.
          </p>

          <dl className="catrip-dev-banner-grid">
            <Row label="Renderer (Vite)" value={<code>{rendererUrl}</code>} />
            <Row label="Versión app" value={ctx?.appVersion ?? APP_VERSION} />
            <Row
              label="Runtime"
              value={
                bridgeReady ? (
                  <>
                    Electron {ctx?.electronVersion} · Chromium {ctx?.chromeVersion} · Node{" "}
                    {ctx?.nodeVersion}
                  </>
                ) : (
                  "Navegador sin bridge IPC (window.catrip no disponible)"
                )
              }
            />
            <Row
              label="Plataforma"
              value={
                bridgeReady
                  ? `${ctx?.platform ?? "—"} (${ctx?.arch ?? "—"}) · empaquetado: ${
                      ctx?.isPackaged ? "sí" : "no"
                    }`
                  : navigator.platform
              }
            />
            {bridgeReady ? (
              <>
                <Row label="userData" value={<code>{ctx?.userData ?? "—"}</code>} />
                <Row label="Cuentas" value={`${accounts.length} configurada(s)`} />
                <Row
                  label="Cuenta activa"
                  value={activeId ? `${activeLabel} (${activeId})` : "—"}
                />
                <Row label="Modo E2E" value={ctx?.e2eMode ? "CATRIP_E2E=1" : "desactivado"} />
              </>
            ) : null}
            <Row
              label="Comandos útiles"
              value={
                <code>npm run dev · npm run build · npm run test:unit · npm run test:e2e</code>
              }
            />
            <Row
              label="Atajos UI"
              value={
                <code>
                  Ctrl+K paleta · Ctrl+P ajustes · Ctrl+Shift+Z zen · ▤ centro de actividad
                </code>
              }
            />
          </dl>

          {bridgeReady && ctx && Object.keys(ctx.catripEnv).length > 0 ? (
            <div className="catrip-dev-banner-env">
              <div className="catrip-dev-banner-env-title">
                Variables de entorno (CATRIP_* / Vite)
              </div>
              <dl className="catrip-dev-banner-grid">
                {Object.entries(ctx.catripEnv)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([k, v]) => (
                    <Row key={k} label={k} value={<code>{v}</code>} />
                  ))}
              </dl>
            </div>
          ) : null}

          {!bridgeReady ? (
            <p className="catrip-dev-banner-hint">
              Para el contexto completo, ejecuta <code>npm run dev</code> y usa la ventana Electron
              (no abras solo el navegador en el puerto 5173).
            </p>
          ) : null}

          {bridgeReady && typeof window.catrip?.previewUpdateDialog === "function" ? (
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="catrip-btn catrip-btn-primary"
                onClick={() => void window.catrip!.previewUpdateDialog!()}
              >
                Probar diálogo de actualización (v1.5.0)
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
