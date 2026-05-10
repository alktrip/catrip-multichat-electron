import React from "react";

/** Data URL para `<img>` a partir del SVG guardado por cuenta (origen: `UserIcon` / PyQt). */
export function accountIconSrc(iconSvg: string): string {
  const cleaned = iconSvg.includes("{}") ? iconSvg.replace(/\{\}/g, "") : iconSvg;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleaned)}`;
}

export default function AccountAvatar({
  icon,
  labelFallback,
  size = 40,
  style,
}: {
  icon?: string;
  labelFallback: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  if (icon && icon.startsWith("data:image/")) {
    return (
      <img
        src={icon}
        width={size}
        height={size}
        alt=""
        draggable={false}
        style={{
          display: "block",
          borderRadius: Math.max(8, size * 0.25),
          objectFit: "cover",
          ...style,
        }}
      />
    );
  }
  if (icon && icon.includes("<svg")) {
    return (
      <img
        src={accountIconSrc(icon)}
        width={size}
        height={size}
        alt=""
        draggable={false}
        style={{
          display: "block",
          borderRadius: Math.max(8, size * 0.25),
          objectFit: "cover",
          ...style,
        }}
      />
    );
  }
  const letter = labelFallback.trim().slice(0, 1).toUpperCase() || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(8, size * 0.25),
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E1E1E1",
        fontWeight: 700,
        fontSize: size * 0.42,
        ...style,
      }}
    >
      {letter}
    </div>
  );
}
