import React from "react";

export function Overlay({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 84,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 560,
          maxWidth: "calc(100vw - 28px)",
          maxHeight: "min(82vh, 720px)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.22)",
          background: "#353a3a",
          color: "#eef2f2",
          boxShadow: "0 20px 56px rgba(0,0,0,0.65), 0 0 1px rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            flex: "1 1 auto",
            minHeight: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

