import type { Input } from "electron";

/** Acciones de atajo de Catrip Connect (menú + paleta). */
export type CatripShortcutAction =
  | { type: "settings" }
  | { type: "hide" }
  | { type: "quit" }
  | { type: "quickSwitcher" }
  | { type: "fullscreen" }
  | { type: "toggleZen" }
  | { type: "urgentNow" }
  | { type: "reload" }
  | { type: "newChat" }
  | { type: "phoneChat" }
  | { type: "newAccount" }
  | { type: "switchAccount"; index: number }
  | { type: "exitZen" };

function hasPrimaryModifier(input: Input): boolean {
  return !!(input.control || input.meta);
}

/**
 * Detecta atajos de Catrip a partir de un evento `before-input-event`.
 * Devuelve null si la tecla no corresponde a un atajo de la app.
 */
export function matchCatripShortcut(input: Input): CatripShortcutAction | null {
  if (input.type !== "keyDown") return null;

  if (input.key === "Escape" && !hasPrimaryModifier(input) && !input.alt) {
    return { type: "exitZen" };
  }

  if (!hasPrimaryModifier(input)) {
    if (!input.alt && !input.shift && input.key === "F5") return { type: "reload" };
    if (!input.alt && !input.shift && input.key === "F11") return { type: "fullscreen" };
    return null;
  }

  if (input.alt) return null;

  const key = input.key.length === 1 ? input.key.toLowerCase() : input.key;

  if (input.shift && key === "z") return { type: "toggleZen" };
  if (input.shift && key === "a") return { type: "urgentNow" };

  if (input.shift) return null;

  switch (key) {
    case "p":
      return { type: "settings" };
    case "w":
      return { type: "hide" };
    case "q":
      return { type: "quit" };
    case "k":
      return { type: "quickSwitcher" };
    case "n":
      return { type: "newChat" };
    case "m":
      return { type: "phoneChat" };
    case "u":
      return { type: "newAccount" };
    default:
      break;
  }

  if (key >= "1" && key <= "9") {
    return { type: "switchAccount", index: Number(key) - 1 };
  }

  return null;
}
