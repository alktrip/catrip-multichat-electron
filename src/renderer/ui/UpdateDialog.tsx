import React from "react";

export type UpdateDialogButton = {
  id: string;
  label: string;
  primary?: boolean;
};

export type UpdateDialogPayload = {
  title: string;
  message: string;
  releaseNotes: string;
  footerHint?: string;
  releaseUrl?: string;
  buttons: UpdateDialogButton[];
};

function renderReleaseNotes(notes: string) {
  const lines = notes.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    const isSection =
      trimmed.length > 0 &&
      trimmed.length <= 48 &&
      (/^(novedades|correcciones|cambiado|añadido|documentación|para quién)/i.test(trimmed) ||
        /^#{1,3}\s/.test(line) ||
        /^catrip connect \d/i.test(trimmed));

    if (isSection) {
      const label = trimmed.replace(/^#{1,3}\s+/, "");
      return (
        <div
          key={`h-${i}`}
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: "#ffffff",
            marginTop: i === 0 ? 0 : 14,
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </div>
      );
    }

    if (!trimmed) {
      return <div key={`s-${i}`} style={{ height: 6 }} aria-hidden />;
    }

    return (
      <div
        key={`l-${i}`}
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          color: "#dce4e4",
          paddingLeft: trimmed.startsWith("•") || trimmed.startsWith("-") ? 4 : 0,
        }}
      >
        {line}
      </div>
    );
  });
}

export default function UpdateDialog({
  payload,
  onAction,
  onDismiss,
}: {
  payload: UpdateDialogPayload;
  onAction: (buttonId: string) => void;
  onDismiss: () => void;
}) {
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="catrip-update-dialog-title"
      className="catrip-overlay-veil catrip-update-dialog-veil"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <div
        className="catrip-overlay-panel catrip-update-dialog-panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="catrip-update-dialog-header">
          <div
            id="catrip-update-dialog-title"
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            {payload.message}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#b8c4c4", lineHeight: 1.45 }}>
            {payload.title}
          </div>
        </div>

        <div className="catrip-update-dialog-notes" role="region" aria-label="Notas de la versión">
          {renderReleaseNotes(payload.releaseNotes)}
        </div>

        {payload.footerHint ? (
          <div className="catrip-update-dialog-hint">{payload.footerHint}</div>
        ) : null}

        <div className="catrip-update-dialog-footer">
          <div className="catrip-update-dialog-actions">
            {payload.buttons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                className={btn.primary ? "catrip-btn catrip-btn-primary" : "catrip-btn"}
                onClick={() => onAction(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>
          {payload.releaseUrl ? (
            <button
              type="button"
              className="catrip-update-dialog-link"
              onClick={() => onAction("open-release-url")}
            >
              Ver release completa en GitHub
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
