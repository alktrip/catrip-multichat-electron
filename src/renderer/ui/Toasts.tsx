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

const ICON_BY_KIND: Record<ToastKind, string> = {
  success: "✓",
  info: "i",
  error: "!",
};

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  return (
    <div role="status" className={`catrip-toast catrip-toast--${item.kind}`}>
      <span className="catrip-toast-icon" aria-hidden>
        {ICON_BY_KIND[item.kind]}
      </span>
      <span className="catrip-toast-message">{item.message}</span>
      <button
        type="button"
        className="catrip-toast-close"
        onClick={() => onDismiss(item.id)}
        aria-label="Cerrar notificación"
        title="Cerrar"
      >
        ×
      </button>
    </div>
  );
}
