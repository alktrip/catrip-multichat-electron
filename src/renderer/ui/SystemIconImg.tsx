import React from "react";

/** Nombres alineados con `assets/icons/system/*.svg` (origen: `SystemIcon.py`). */
export type SystemIconName =
  | "new-account"
  | "open-settings"
  | "new-chat"
  | "new-chat-number"
  | "urgent-now"
  | "zen-mode";

export default function SystemIconImg({
  name,
  size = 20,
  style,
}: {
  name: SystemIconName;
  size?: number;
  style?: React.CSSProperties;
}) {
  const src = `${import.meta.env.BASE_URL}system/${name}.svg`;
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      style={{ display: "block", flexShrink: 0, pointerEvents: "none", ...style }}
    />
  );
}
