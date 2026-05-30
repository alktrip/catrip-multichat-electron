import React from "react";

/** Ilustraciones esquemáticas del manual (no capturas reales). */

export function IllustrationAppLayout() {
  return (
    <svg viewBox="0 0 480 220" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="220" rx="10" fill="#2a2e2e" stroke="rgba(255,255,255,0.12)" />
      <rect x="8" y="8" width="56" height="204" rx="6" fill="#1d1f1f" stroke="rgba(255,255,255,0.08)" />
      <text x="36" y="24" textAnchor="middle" fill="#7dd3a8" fontSize="9" fontWeight="700">
        Barra
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="18"
          y={36 + i * 44}
          width="36"
          height="36"
          rx="8"
          fill={i === 0 ? "rgb(37 211 102 / 0.35)" : "rgba(255,255,255,0.08)"}
          stroke={i === 0 ? "#25D366" : "rgba(255,255,255,0.1)"}
        />
      ))}
      <rect x="72" y="8" width="400" height="204" rx="6" fill="#111b21" stroke="rgba(255,255,255,0.06)" />
      <text x="272" y="110" textAnchor="middle" fill="#8696a0" fontSize="13">
        WhatsApp Web (cuenta activa)
      </text>
    </svg>
  );
}

export function IllustrationAccounts() {
  return (
    <svg viewBox="0 0 480 120" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="120" rx="10" fill="#2a2e2e" stroke="rgba(255,255,255,0.12)" />
      {["Personal", "Trabajo", "Familia"].map((label, i) => (
        <g key={label} transform={`translate(${24 + i * 150}, 20)`}>
          <rect width="120" height="80" rx="8" fill="#353a3a" stroke="rgba(255,255,255,0.1)" />
          <circle cx="36" cy="40" r="18" fill="rgba(37,211,102,0.25)" stroke="#25D366" />
          <text x="62" y="36" fill="#eef2f2" fontSize="11" fontWeight="600">
            {label}
          </text>
          <text x="62" y="52" fill="#8696a0" fontSize="9">
            Cuenta {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function IllustrationTray() {
  return (
    <svg viewBox="0 0 480 100" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="100" rx="10" fill="#2a2e2e" stroke="rgba(255,255,255,0.12)" />
      <rect x="180" y="72" width="120" height="20" rx="4" fill="#1a1c1c" />
      <circle cx="210" cy="82" r="10" fill="#25D366" />
      <text x="240" y="86" fill="#dce4e4" fontSize="10">
        Icono en bandeja
      </text>
      <path d="M210 50 L210 68" stroke="#7dd3a8" strokeWidth="2" markerEnd="url(#arrow)" />
      <rect x="160" y="12" width="160" height="36" rx="6" fill="#353a3a" stroke="rgba(255,255,255,0.15)" />
      <text x="240" y="34" textAnchor="middle" fill="#eef2f2" fontSize="10">
        Ventana minimizada
      </text>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#7dd3a8" />
        </marker>
      </defs>
    </svg>
  );
}

export function IllustrationZen() {
  return (
    <svg viewBox="0 0 480 100" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="100" rx="10" fill="#111b21" stroke="rgba(255,255,255,0.12)" />
      <text x="240" y="55" textAnchor="middle" fill="#8696a0" fontSize="14">
        Solo el chat — sin barra lateral
      </text>
      <text x="240" y="78" textAnchor="middle" fill="#25D366" fontSize="10">
        Modo Zen activo
      </text>
    </svg>
  );
}

export function IllustrationNotification() {
  return (
    <svg viewBox="0 0 480 110" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="110" rx="10" fill="#2a2e2e" stroke="rgba(255,255,255,0.12)" />
      <rect x="280" y="16" width="180" height="56" rx="8" fill="#353a3a" stroke="rgba(37,211,102,0.4)" />
      <text x="294" y="36" fill="#25D366" fontSize="10" fontWeight="700">
        Catrip Connect
      </text>
      <text x="294" y="52" fill="#eef2f2" fontSize="10">
        Trabajo · Ana
      </text>
      <text x="294" y="66" fill="#b8c4c4" fontSize="9">
        ¿Quedamos a las 18:00?
      </text>
      <rect x="24" y="24" width="200" height="62" rx="6" fill="#1d1f1f" stroke="rgba(255,255,255,0.08)" />
      <text x="124" y="58" textAnchor="middle" fill="#8696a0" fontSize="11">
        Clic → abre esa cuenta
      </text>
    </svg>
  );
}

export function IllustrationCommandPalette() {
  return (
    <svg viewBox="0 0 480 130" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="130" rx="10" fill="rgba(0,0,0,0.35)" />
      <rect x="60" y="20" width="360" height="90" rx="10" fill="#353a3a" stroke="rgba(255,255,255,0.18)" />
      <rect x="76" y="32" width="328" height="24" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" />
      <text x="88" y="48" fill="#8696a0" fontSize="11">
        Buscar acción o cuenta…
      </text>
      <rect x="76" y="64" width="328" height="22" rx="4" fill="rgba(37,211,102,0.15)" />
      <text x="88" y="78" fill="#eef2f2" fontSize="10">
        Centro de actividad
      </text>
      <text x="380" y="48" fill="#7dd3a8" fontSize="9">
        Ctrl+K
      </text>
    </svg>
  );
}

export function IllustrationQr() {
  return (
    <svg viewBox="0 0 480 140" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="140" rx="10" fill="#2a2e2e" stroke="rgba(255,255,255,0.12)" />
      <rect x="160" y="20" width="100" height="100" rx="4" fill="#fff" />
      <g fill="#111">
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2, 3, 4].map((c) =>
            (r + c) % 2 === 0 ? (
              <rect key={`${r}-${c}`} x={168 + c * 16} y={28 + r * 16} width="12" height="12" />
            ) : null,
          ),
        )}
      </g>
      <text x="290" y="60" fill="#eef2f2" fontSize="11">
        1. Abre WhatsApp
      </text>
      <text x="290" y="78" fill="#eef2f2" fontSize="11">
        en el móvil
      </text>
      <text x="290" y="102" fill="#8696a0" fontSize="10">
        2. Escanea el código
      </text>
    </svg>
  );
}

/** Panel compacto «Ahora mismo» anclado al rail. */
export function IllustrationUrgentNow() {
  return (
    <svg viewBox="0 0 480 200" className="catrip-manual-illus" aria-hidden>
      <rect width="480" height="200" rx="10" fill="#2a2e2e" stroke="rgba(255,255,255,0.12)" />
      <rect x="12" y="12" width="52" height="176" rx="6" fill="#1d1f1f" stroke="rgba(255,255,255,0.08)" />
      <rect x="22" y="120" width="32" height="32" rx="8" fill="rgba(37,211,102,0.2)" stroke="#25D366" />
      <text x="38" y="140" textAnchor="middle" fill="#dce4e4" fontSize="14">
        ⚡
      </text>
      <circle cx="48" cy="126" r="4" fill="#25D366" />
      <rect x="78" y="48" width="280" height="132" rx="10" fill="#353a3a" stroke="rgba(255,255,255,0.15)" />
      <text x="92" y="68" fill="#ffffff" fontSize="11" fontWeight="700">
        Ahora mismo
      </text>
      <text x="92" y="82" fill="#b8c4c4" fontSize="9">
        Lo más urgente en todas tus cuentas
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="88"
          y={92 + i * 28}
          width="260"
          height="22"
          rx="6"
          fill="rgba(0,0,0,0.22)"
          stroke="rgba(255,255,255,0.06)"
        />
      ))}
      <text x="96" y="106" fill="#eef2f2" fontSize="9">
        Ana · Personal
      </text>
      <text x="96" y="134" fill="#eef2f2" fontSize="9">
        Cliente · Trabajo
      </text>
      <text x="96" y="162" fill="#eef2f2" fontSize="9">
        Equipo · Trabajo
      </text>
      <rect x="72" y="12" width="396" height="176" rx="6" fill="#111b21" opacity="0.35" />
      <text x="270" y="28" textAnchor="middle" fill="#8696a0" fontSize="10">
        WhatsApp sigue visible — sin tapar la pantalla
      </text>
    </svg>
  );
}
