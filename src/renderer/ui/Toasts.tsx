/**
 * Sistema de toasts apilables para feedback no intrusivo.
 *
 * Uso:
 *   const toasts = useToasts();
 *   toasts.success("Cuenta renombrada");
 *   toasts.info("Caché limpiada (3 cuentas)");
 *   toasts.error("No se pudo eliminar la cuenta", { duration: 0 }); // permanente
 *
 * Características:
 *   - Tres tipos: `success` (verde), `info` (gris-azul) y `error` (rojo).
 *   - Auto-desaparición en 3.5 s por defecto. `duration: 0` = persistente.
 *   - Apilan en la esquina inferior izquierda con un pequeño gap.
 *   - Cada toast tiene un botón de cierre manual.
 *   - Animación de entrada con muelle (cubic-bezier(0.34, 1.56, 0.64, 1)).
 *   - Respeta `prefers-reduced-motion`.
 *   - `aria-live="polite"` para que los lectores de pantalla los anuncien.
 *
 * Implementación:
 *   - `<ToastsProvider>` instala el contexto y renderiza el viewport.
 *   - Los timeouts de auto-dismiss se trackean en un `Map` y se limpian al
 *     desmontar el provider o al descartarse manualmente, evitando leaks.
 */

import React from "react";
import { useTranslation } from "react-i18next";

export type ToastKind = "success" | "info" | "error";

export type ToastItem = {
  id: number;
  kind: ToastKind;
  message: React.ReactNode;
  duration: number;
};

export type ToastOptions = {
  /** Milisegundos hasta auto-desaparición. `0` = persiste hasta cerrar manualmente. */
  duration?: number;
};

export type ToastsApi = {
  push: (kind: ToastKind, message: React.ReactNode, opts?: ToastOptions) => number;
  success: (message: React.ReactNode, opts?: ToastOptions) => number;
  info: (message: React.ReactNode, opts?: ToastOptions) => number;
  error: (message: React.ReactNode, opts?: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const DEFAULT_DURATION_MS = 3500;

const ToastsContext = React.createContext<ToastsApi | null>(null);

const SVG_COMMON = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ToastKindIcon({ kind }: { kind: ToastKind }) {
  if (kind === "success") {
    return (
      <svg {...SVG_COMMON}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  if (kind === "info") {
    return (
      <svg {...SVG_COMMON}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  }
  return (
    <svg {...SVG_COMMON}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function ToastsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(1);
  const timeouts = React.useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = React.useCallback((id: number) => {
    const t = timeouts.current.get(id);
    if (t) {
      clearTimeout(t);
      timeouts.current.delete(id);
    }
    setItems((arr) => arr.filter((it) => it.id !== id));
  }, []);

  const push = React.useCallback<ToastsApi["push"]>((kind, message, opts) => {
    const id = idRef.current++;
    const duration = opts?.duration ?? DEFAULT_DURATION_MS;
    const item: ToastItem = { id, kind, message, duration };
    setItems((arr) => [...arr, item]);
    if (duration > 0) {
      const t = setTimeout(() => {
        timeouts.current.delete(id);
        setItems((arr) => arr.filter((it) => it.id !== id));
      }, duration);
      timeouts.current.set(id, t);
    }
    return id;
  }, []);

  React.useEffect(
    () => () => {
      const map = timeouts.current;
      for (const t of map.values()) clearTimeout(t);
      map.clear();
    },
    [],
  );

  const api = React.useMemo<ToastsApi>(
    () => ({
      push,
      success: (m, o) => push("success", m, o),
      info: (m, o) => push("info", m, o),
      error: (m, o) => push("error", m, o),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastsContext.Provider value={api}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastsContext.Provider>
  );
}

export function useToasts(): ToastsApi {
  const ctx = React.useContext(ToastsContext);
  if (!ctx) {
    throw new Error("useToasts() debe usarse dentro de <ToastsProvider>.");
  }
  return ctx;
}

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="catrip-toast-viewport" aria-live="polite" aria-atomic="false">
      {items.map((it) => (
        <ToastView key={it.id} item={it} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const { t } = useTranslation();
  return (
    <div role="status" className={`catrip-toast catrip-toast--${item.kind}`}>
      <span className="catrip-toast-icon">
        <ToastKindIcon kind={item.kind} />
      </span>
      <span className="catrip-toast-message">{item.message}</span>
      <button
        type="button"
        className="catrip-toast-close"
        onClick={() => onDismiss(item.id)}
        aria-label={t("toasts.closeNotification")}
        title={t("toasts.close")}
      >
        ×
      </button>
    </div>
  );
}
