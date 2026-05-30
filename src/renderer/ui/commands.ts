/* Catrip Connect — Command Palette (Ctrl+K)
 * Define la lista de comandos navegables desde la paleta y el filtrado.
 * Tipos puros: aquí no se renderiza nada.
 */
import type { SystemIconName } from "./SystemIconImg";
import type { SettingsPage } from "./SettingsView";
import type { PendingChatItem } from "../../main/pendingInboxModel";

export type CommandIcon =
  | { kind: "system"; name: SystemIconName }
  | { kind: "avatar"; data: string; fallback: string }
  | { kind: "symbol"; char: string };

export type CommandGroup = "Chats" | "Cuentas" | "Acciones" | "Navegación" | "Apariencia";

export const COMMAND_GROUPS: CommandGroup[] = [
  "Chats",
  "Cuentas",
  "Acciones",
  "Navegación",
  "Apariencia",
];

export type Command = {
  id: string;
  label: string;
  description?: string;
  group: CommandGroup;
  keywords?: string[];
  shortcut?: string;
  icon: CommandIcon;
  perform: () => void | Promise<void>;
};

export type CommandAccount = { id: string; label: string; icon: string };

export type CommandSettingsShape = {
  general: {
    showSidebar?: boolean;
    uiScale?: number;
  };
  notifications?: { enabled?: boolean };
  [k: string]: unknown;
};

export type CommandContext = {
  accounts: CommandAccount[];
  activeAccountId: string | null;
  settings: CommandSettingsShape | null;
  zen: boolean;
  mode: "browser" | "settings";
  /* Acciones que el componente App expone al construir comandos. */
  setActiveAccount: (id: string) => void;
  goToSettings: (page?: SettingsPage) => void;
  toggleZen: (next: boolean) => void;
  openPhoneDialog: () => void;
  triggerNewChat: () => void;
  createAccount: () => void;
  applySettings: (next: CommandSettingsShape) => void;
  openActivityCenter: () => void;
  openPendingInbox: () => void;
  openUrgentNow: () => void;
};

const SETTINGS_PAGES: ReadonlyArray<{
  page: SettingsPage;
  label: string;
  keywords: string[];
  glyph: string;
}> = [
  {
    page: "general",
    label: "General",
    keywords: ["escala", "tema", "minimizar", "tray", "descargas", "downloads"],
    glyph: "G",
  },
  {
    page: "accounts",
    label: "Cuentas",
    keywords: ["accounts", "iconos", "renombrar", "avatar"],
    glyph: "C",
  },
  {
    page: "notifications",
    label: "Notificaciones",
    keywords: ["notifications", "alertas", "alerts"],
    glyph: "N",
  },
  {
    page: "performance",
    label: "Rendimiento",
    keywords: ["performance", "caché", "cache", "códecs", "codecs", "memoria"],
    glyph: "R",
  },
  {
    page: "network",
    label: "Red",
    keywords: ["network", "proxy", "vpn", "internet"],
    glyph: "P",
  },
];

const UI_SCALES: ReadonlyArray<{ value: number; label: string }> = [
  { value: 1, label: "100 %" },
  { value: 1.1, label: "110 %" },
  { value: 1.25, label: "125 %" },
  { value: 1.5, label: "150 %" },
  { value: 1.75, label: "175 %" },
  { value: 2, label: "200 %" },
];

export function buildCommands(ctx: CommandContext): Command[] {
  const cmds: Command[] = [];

  ctx.accounts.forEach((a, idx) => {
    const isActive = a.id === ctx.activeAccountId;
    // Las primeras 9 cuentas tienen un atajo Ctrl+1..9 ya implementado en la
    // app; lo exponemos aquí para que el usuario lo descubra desde la paleta.
    const shortcut = idx < 9 ? `Ctrl+${idx + 1}` : undefined;
    cmds.push({
      id: `account:${a.id}`,
      label: a.label,
      description: isActive ? "Cuenta activa" : "Cambiar a esta cuenta",
      group: "Cuentas",
      keywords: ["cuenta", "account", "switch", a.label],
      shortcut,
      icon: { kind: "avatar", data: a.icon, fallback: a.label },
      perform: () => ctx.setActiveAccount(a.id),
    });
  });

  cmds.push({
    id: "action:new-account",
    label: "Nueva cuenta",
    group: "Acciones",
    shortcut: "Ctrl+U",
    keywords: ["añadir", "agregar", "crear", "create", "new account"],
    icon: { kind: "system", name: "new-account" },
    perform: () => ctx.createAccount(),
  });

  if (ctx.mode === "browser") {
    cmds.push({
      id: "action:new-chat",
      label: "Nuevo chat (WhatsApp Web)",
      group: "Acciones",
      shortcut: "Ctrl+N",
      keywords: ["new chat", "compose", "mensaje", "message"],
      icon: { kind: "system", name: "new-chat" },
      perform: () => ctx.triggerNewChat(),
    });
  }

  cmds.push({
    id: "action:phone-chat",
    label: "Chat por número de teléfono…",
    group: "Acciones",
    shortcut: "Ctrl+M",
    keywords: ["telefono", "phone", "número", "msisdn"],
    icon: { kind: "system", name: "new-chat-number" },
    perform: () => ctx.openPhoneDialog(),
  });

  cmds.push({
    id: "action:urgent-now",
    label: "Ahora mismo",
    description: "Top 3 chats urgentes sin abrir un panel grande",
    group: "Acciones",
    shortcut: "Ctrl+Shift+A",
    keywords: ["urgente", "ahora", "now", "rapido", "inbox", "pendientes", "top"],
    icon: { kind: "system", name: "urgent-now" },
    perform: () => ctx.openUrgentNow(),
  });

  cmds.push({
    id: "action:activity-center",
    label: "Centro de actividad",
    description: "Resumen de todas las cuentas y mensajes sin leer",
    group: "Acciones",
    keywords: ["actividad", "activity", "resumen", "inbox", "sin leer", "unread", "cuentas"],
    icon: { kind: "symbol", char: "▤" },
    perform: () => ctx.openActivityCenter(),
  });

  cmds.push({
    id: "action:pending-inbox",
    label: "Acciones pendientes",
    description: "Chats sin leer ordenados por urgencia en todas las cuentas",
    group: "Acciones",
    keywords: ["pendientes", "pending", "inbox", "sin leer", "unread", "chats", "urgente"],
    icon: { kind: "symbol", char: "✉" },
    perform: () => ctx.openPendingInbox(),
  });

  if (ctx.mode === "browser") {
    if (!ctx.zen) {
      cmds.push({
        id: "action:zen-on",
        label: "Activar modo Zen",
        group: "Acciones",
        shortcut: "Ctrl+Shift+Z",
        keywords: ["zen", "fullscreen", "ocultar rail", "focus"],
        icon: { kind: "system", name: "zen-mode" },
        perform: () => ctx.toggleZen(true),
      });
    } else {
      cmds.push({
        id: "action:zen-off",
        label: "Salir del modo Zen",
        group: "Acciones",
        shortcut: "Esc",
        keywords: ["zen", "exit", "salir"],
        icon: { kind: "system", name: "zen-mode" },
        perform: () => ctx.toggleZen(false),
      });
    }
  }

  for (const sp of SETTINGS_PAGES) {
    cmds.push({
      id: `goto:settings:${sp.page}`,
      label: `Abrir Ajustes → ${sp.label}`,
      group: "Navegación",
      shortcut: sp.page === "general" ? "Ctrl+P" : undefined,
      keywords: ["ajustes", "settings", "preferencias", ...sp.keywords],
      icon: { kind: "symbol", char: sp.glyph },
      perform: () => ctx.goToSettings(sp.page),
    });
  }

  if (ctx.settings) {
    const s = ctx.settings;
    const showSidebar = s.general.showSidebar !== false;
    cmds.push({
      id: "toggle:sidebar",
      label: showSidebar ? "Ocultar barra lateral (rail)" : "Mostrar barra lateral (rail)",
      group: "Apariencia",
      keywords: ["rail", "sidebar", "barra lateral", "ocultar", "mostrar"],
      icon: { kind: "symbol", char: "▎" },
      perform: () =>
        ctx.applySettings({
          ...s,
          general: { ...s.general, showSidebar: !showSidebar },
        }),
    });

    const notifEnabled = s.notifications?.enabled !== false;
    cmds.push({
      id: "toggle:notifications",
      label: notifEnabled
        ? "Desactivar notificaciones del sistema"
        : "Activar notificaciones del sistema",
      group: "Apariencia",
      keywords: ["notifications", "alertas", "silencio", "mute"],
      icon: { kind: "symbol", char: "♪" },
      perform: () =>
        ctx.applySettings({
          ...s,
          notifications: { ...(s.notifications ?? {}), enabled: !notifEnabled },
        }),
    });

    const currentScale = s.general.uiScale ?? 1;
    for (const sc of UI_SCALES) {
      if (sc.value === currentScale) continue;
      cmds.push({
        id: `scale:${sc.value}`,
        label: `Escala de la interfaz: ${sc.label}`,
        group: "Apariencia",
        keywords: ["zoom", "scale", "tamaño", "ui", "escala"],
        icon: { kind: "symbol", char: "%" },
        perform: () =>
          ctx.applySettings({
            ...s,
            general: { ...s.general, uiScale: sc.value },
          }),
      });
    }
  }

  return cmds;
}

export function buildChatSearchCommands(
  items: PendingChatItem[],
  openChat: (accountId: string, chatName: string) => void,
): Command[] {
  return items.map((item) => {
    const unreadPart = item.unreadCount > 0 ? ` · ${item.unreadCount} sin leer` : "";
    const previewPart = item.preview ? ` · ${item.preview}` : "";
    return {
      id: `chat:${item.accountId}:${encodeURIComponent(item.chatName)}`,
      label: item.chatName,
      description: `${item.accountLabel}${previewPart}${unreadPart}`,
      group: "Chats",
      keywords: [
        item.chatName,
        item.preview,
        item.accountLabel,
        "chat",
        "conversacion",
        "conversación",
        "mensaje",
      ],
      icon: { kind: "avatar", data: item.accountIcon, fallback: item.accountLabel },
      perform: () => openChat(item.accountId, item.chatName),
    };
  });
}

/* Filtrado por tokens AND: cada palabra de la consulta debe aparecer en
 * algún lugar (label, descripción o palabras clave). Case-insensitive y
 * sin diacríticos para que "Conexion" empareje con "conexión", etc. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterCommands(commands: Command[], query: string): Command[] {
  const q = normalize(query.trim());
  if (!q) return commands;
  const tokens = q.split(/\s+/).filter(Boolean);
  return commands.filter((c) => {
    const haystack = normalize([c.label, c.description ?? "", ...(c.keywords ?? [])].join(" "));
    return tokens.every((t) => haystack.includes(t));
  });
}
