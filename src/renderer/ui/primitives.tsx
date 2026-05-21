import React from "react";

/** Interruptor para ajustes (role="switch", estilo escritorio). */
export function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="catrip-toggle-row">
      <div className="catrip-toggle-row-text">
        <span id={id} className="catrip-toggle-row-label">
          {label}
        </span>
        {description ? <span className="catrip-toggle-row-desc">{description}</span> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        className={`catrip-switch${checked ? " is-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="catrip-switch-thumb" aria-hidden />
      </button>
    </div>
  );
}
