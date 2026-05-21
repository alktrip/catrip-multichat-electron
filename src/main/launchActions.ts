/** Acciones del lanzador (Desktop Actions / argv). */
export type CatripLaunchAction = "open" | "focus" | "new-account";

const ACTION_ALIASES: Record<string, CatripLaunchAction> = {
  open: "open",
  focus: "focus",
  "new-account": "new-account",
  newaccount: "new-account",
};

/**
 * Detecta `--catrip-action=focus` (y alias cortos) en argv de arranque o second-instance.
 */
export function parseLaunchAction(argv: readonly string[]): CatripLaunchAction | null {
  for (const raw of argv) {
    const arg = String(raw || "").trim();
    if (!arg) continue;
    if (arg === "--catrip-focus") return "focus";
    if (arg === "--catrip-new-account") return "new-account";
    if (arg === "--catrip-open") return "open";
    const m = arg.match(/^--catrip-action=(.+)$/i);
    if (m) {
      const key = m[1].toLowerCase().replace(/_/g, "-");
      const hit = ACTION_ALIASES[key];
      if (hit) return hit;
    }
  }
  return null;
}
