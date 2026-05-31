/* Catrip Connect — Command Palette (Ctrl+K)
 * Define la lista de comandos navegables desde la paleta y el filtrado.
 * Tipos puros: aquí no se renderiza nada.
 */
import type { TFunction } from "i18next";
import type { SystemIconName } from "./SystemIconImg";
import type { SettingsPage } from "./SettingsView";
import type { PendingChatItem } from "../../main/pendingInboxModel";
import {
  COMMAND_GROUP_KEYS,
  type CommandGroupKey,
  commandGroupLabel,
} from "../../shared/i18n/formatters";

export type CommandIcon =
  | { kind: "system"; name: SystemIconName }
  | { kind: "avatar"; data: string; fallback: string }
  | { kind: "symbol"; char: string };

export type CommandGroup = CommandGroupKey;

export const COMMAND_GROUPS: CommandGroup[] = COMMAND_GROUP_KEYS;

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
  t: TFunction;
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
  labelKey: string;
  keywords: string[];
  glyph: string;
}> = [
  {
    page: "general",
    labelKey: "settings.pages.general",
    keywords: ["escala", "tema", "minimizar", "tray", "descargas", "downloads", "scale", "theme"],
    glyph: "G",
  },
  {
    page: "accounts",
    labelKey: "settings.pages.accounts",
    keywords: ["accounts", "iconos", "renombrar", "avatar", "cuentas"],
    glyph: "C",
  },
  {
    page: "notifications",
    labelKey: "settings.pages.notifications",
    keywords: ["notifications", "alertas", "alerts", "notificaciones"],
    glyph: "N",
  },
  {
    page: "performance",
    labelKey: "settings.pages.performance",
    keywords: ["performance", "caché", "cache", "códecs", "codecs", "memoria", "rendimiento"],
    glyph: "R",
  },
  {
    page: "network",
    labelKey: "settings.pages.network",
    keywords: ["network", "proxy", "vpn", "internet", "red"],
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
  const { t } = ctx;
  const cmds: Command[] = [];

  ctx.accounts.forEach((a, idx) => {
    const isActive = a.id === ctx.activeAccountId;
    const shortcut = idx < 9 ? `Ctrl+${idx + 1}` : undefined;
    cmds.push({
      id: `account:${a.id}`,
      label: a.label,
      description: isActive ? t("commands.activeAccount") : t("commands.switchAccount"),
      group: "accounts",
      keywords: ["cuenta", "account", "switch", a.label],
      shortcut,
      icon: { kind: "avatar", data: a.icon, fallback: a.label },
      perform: () => ctx.setActiveAccount(a.id),
    });
  });

  cmds.push({
    id: "action:new-account",
    label: t("commands.newAccount"),
    group: "actions",
    shortcut: "Ctrl+U",
    keywords: ["añadir", "agregar", "crear", "create", "new account", "nova conta"],
    icon: { kind: "system", name: "new-account" },
    perform: () => ctx.createAccount(),
  });

  if (ctx.mode === "browser") {
    cmds.push({
      id: "action:new-chat",
      label: t("commands.newChat"),
      group: "actions",
      shortcut: "Ctrl+N",
      keywords: ["new chat", "compose", "mensaje", "message"],
      icon: { kind: "system", name: "new-chat" },
      perform: () => ctx.triggerNewChat(),
    });
  }

  cmds.push({
    id: "action:phone-chat",
    label: t("commands.phoneChat"),
    group: "actions",
    shortcut: "Ctrl+M",
    keywords: ["telefono", "phone", "número", "msisdn", "teléfono"],
    icon: { kind: "system", name: "new-chat-number" },
    perform: () => ctx.openPhoneDialog(),
  });

  cmds.push({
    id: "action:urgent-now",
    label: t("commands.urgentNow"),
    description: t("commands.urgentNowDesc"),
    group: "actions",
    shortcut: "Ctrl+Shift+A",
    keywords: ["urgente", "ahora", "now", "rapido", "inbox", "pendientes", "top"],
    icon: { kind: "system", name: "urgent-now" },
    perform: () => ctx.openUrgentNow(),
  });

  cmds.push({
    id: "action:activity-center",
    label: t("commands.activityCenter"),
    description: t("commands.activityCenterDesc"),
    group: "actions",
    keywords: ["actividad", "activity", "resumen", "inbox", "sin leer", "unread", "cuentas"],
    icon: { kind: "symbol", char: "▤" },
    perform: () => ctx.openActivityCenter(),
  });

  cmds.push({
    id: "action:pending-inbox",
    label: t("commands.pendingInbox"),
    description: t("commands.pendingInboxDesc"),
    group: "actions",
    keywords: ["pendientes", "pending", "inbox", "sin leer", "unread", "chats", "urgente"],
    icon: { kind: "symbol", char: "✉" },
    perform: () => ctx.openPendingInbox(),
  });

  if (ctx.mode === "browser") {
    if (!ctx.zen) {
      cmds.push({
        id: "action:zen-on",
        label: t("commands.zenOn"),
        group: "actions",
        shortcut: "Ctrl+Shift+Z",
        keywords: ["zen", "fullscreen", "ocultar rail", "focus"],
        icon: { kind: "system", name: "zen-mode" },
        perform: () => ctx.toggleZen(true),
      });
    } else {
      cmds.push({
        id: "action:zen-off",
        label: t("commands.zenOff"),
        group: "actions",
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
      label: t("commands.openSettings", { page: t(sp.labelKey) }),
      group: "navigation",
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
      label: showSidebar ? t("commands.hideSidebar") : t("commands.showSidebar"),
      group: "appearance",
      keywords: ["rail", "sidebar", "barra lateral", "ocultar", "mostrar", "hide", "show"],
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
        ? t("commands.disableNotifications")
        : t("commands.enableNotifications"),
      group: "appearance",
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
        label: t("commands.uiScale", { scale: sc.label }),
        group: "appearance",
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
  t: TFunction,
): Command[] {
  return items.map((item) => {
    const unreadPart =
      item.unreadCount > 0
        ? t("commands.unreadSuffix", { count: item.unreadCount })
        : "";
    const previewPart = item.preview ? ` · ${item.preview}` : "";
    return {
      id: `chat:${item.accountId}:${encodeURIComponent(item.chatName)}`,
      label: item.chatName,
      description: `${item.accountLabel}${previewPart}${unreadPart}`,
      group: "chats",
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

export { commandGroupLabel };
