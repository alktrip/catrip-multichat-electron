/**
 * Genera src/shared/locales/LANG/translation.json desde el catálogo embebido.
 * Ejecutar: node _scripts/build-locale-files.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assignPt,
  assignFr,
  assignDe,
  assignKo,
  assignJa,
  assignIt,
  assignZh,
} from "./locale-catalogs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const localesDir = path.join(root, "src/shared/locales");

/** @type {Record<string, Record<string, unknown>>} */
const catalog = {
  es: {
    common: {
      cancel: "Cancelar",
      save: "Guardar",
      accept: "Aceptar",
      close: "Cerrar",
      back: "Atrás",
      exit: "Salir",
      loading: "Cargando…",
      deleting: "Eliminando…",
      cleaning: "Limpiando…",
      checking: "Comprobando…",
      rename: "Renombrar",
      delete: "Eliminar",
      deletePermanently: "Eliminar definitivamente",
      noResults: "Sin resultados",
      dash: "—",
      now: "Ahora",
      minutesAgo: "Hace {{count}} min",
      hoursAgo: "Hace {{count}} h",
      daysAgo: "Hace {{count}} d",
      unread: "{{count}} sin leer",
      unreadOne: "1 sin leer",
      unreadLabel: "sin leer",
      messagesUnread: "{{count}} mensajes sin leer",
      accountDefault: "Cuenta {{n}}",
      thisAccount: "esta cuenta",
      theAccount: "la cuenta",
      variant: "Variante {{n}}",
      version: "Versión",
      automatic: "Automático",
      noAccounts: "(sin cuentas)",
    },
    sessionStatus: {
      loading: "Cargando…",
      qr: "Esperando QR",
      connected: "Conectada",
      offline: "Sin red",
    },
    commandGroups: {
      chats: "Chats",
      accounts: "Cuentas",
      actions: "Acciones",
      navigation: "Navegación",
      appearance: "Apariencia",
    },
    commands: {
      activeAccount: "Cuenta activa",
      switchAccount: "Cambiar a esta cuenta",
      newAccount: "Nueva cuenta",
      newChat: "Nuevo chat (WhatsApp Web)",
      phoneChat: "Chat por número de teléfono…",
      urgentNow: "Ahora mismo",
      urgentNowDesc: "Top 3 chats urgentes sin abrir un panel grande",
      activityCenter: "Centro de actividad",
      activityCenterDesc: "Resumen de todas las cuentas y mensajes sin leer",
      pendingInbox: "Acciones pendientes",
      pendingInboxDesc: "Chats sin leer ordenados por urgencia en todas las cuentas",
      zenOn: "Activar modo Zen",
      zenOff: "Salir del modo Zen",
      openSettings: "Abrir Ajustes → {{page}}",
      hideSidebar: "Ocultar barra lateral (rail)",
      showSidebar: "Mostrar barra lateral (rail)",
      disableNotifications: "Desactivar notificaciones del sistema",
      enableNotifications: "Activar notificaciones del sistema",
      uiScale: "Escala de la interfaz: {{scale}}",
      unreadSuffix: " · {{count}} sin leer",
    },
    settings: {
      title: "AJUSTES",
      tools: "HERRAMIENTAS",
      pages: {
        general: "General",
        accounts: "Cuentas",
        notifications: "Notificaciones",
        performance: "Rendimiento (experimental)",
        network: "Red",
      },
      language: {
        label: "Idioma de la interfaz",
        hint: "Por defecto usa el idioma del sistema; si no está disponible, se muestra en inglés. Afecta menús, notificaciones y textos de Catrip Connect. WhatsApp Web usa su propio idioma.",
        system: "Idioma del sistema",
        whatsappNotice: {
          title: "WhatsApp Web usa un idioma independiente",
          metaRestriction:
            "Meta no permite que aplicaciones de terceros (como Catrip Connect) cambien el idioma de WhatsApp Web mediante su plataforma. Por las restricciones de uso y privacidad de WhatsApp, debes configurar el idioma del chat manualmente dentro de WhatsApp Web.",
          intro:
            "El idioma de Catrip Connect (menús, notificaciones y textos de la aplicación) ya se actualizó al que acabas de elegir.",
          stepsTitle: "Para cambiar el idioma de WhatsApp Web:",
          step1: "Abre WhatsApp Web en la ventana principal (cuenta activa).",
          step2: "Pulsa el menú ⋮ (tres puntos), arriba a la izquierda, y entra en Ajustes.",
          step3: "Ve a Idioma y selecciona el que prefieras para WhatsApp.",
        },
      },
      scale: {
        title: "Escala",
        hint: "Afecta la UI y WhatsApp Web. Se aplica al instante.",
      },
      general: {
        startMinimized: "Iniciar minimizada",
        showSidebar: "Mostrar barra lateral",
        showMenuBar: "Mostrar barra de menú",
        closeToTray: "Al cerrar, minimizar a la bandeja (tray)",
        autoStart: "Iniciar automáticamente con el sistema",
        incomingLinks: "Enlaces WhatsApp entrantes",
        incomingLinksHint:
          "Al abrir whatsapp:// o wa.me desde el sistema.",
        incomingLinkAuto: "Preguntar si hay varias cuentas",
        incomingLinkActive: "Siempre la cuenta activa",
        incomingLinkFixed: "Cuenta fija",
        registerProtocol: "Registrar como app predeterminada (whatsapp://)",
        registerProtocolHint:
          "whatsapp:// — Tras registrar, el sistema puede abrir enlaces compatibles directamente en Catrip.",
        checkUpdates: "Buscar actualizaciones al iniciar (GitHub Releases)",
        updateChannel: "Canal de actualización",
        updateChannelStable: "Estable (releases)",
        updateChannelBeta: "Beta (pre-releases)",
        updateChannelHint:
          "AppImage: descarga e instala al reiniciar. Instalación .deb: se te preguntará si quieres descargar el paquete a una carpeta o abrir solo el enlace de GitHub; el changelog y SHA-512 del .deb se muestran en el diálogo.",
        openDownloads: "Abrir archivos descargados con la app predeterminada",
        askSaveAs: "Preguntar siempre “Guardar como…”",
        downloadsSection: "Descargas",
        downloadsFolder: "Carpeta de descargas",
        downloadsPlaceholder: "(usar la carpeta del sistema)",
        chooseDownloadsFolder: "Elegir carpeta…",
        clearDownloadsFolder: "Usar carpeta del sistema",
        resetDownloads: "Restablecer",
        downloadsFilenameHint:
          "WhatsApp Web controla el nombre del archivo. Si un archivo existe, se generará un nombre alternativo.",
        waylandBrowserTitle: "https://wa.me en el navegador",
        waylandBrowserIntro:
          "En Wayland/Linux el navegador no delega HTTPS a apps arbitrarias. Opciones reales:",
        waylandOption1:
          "Usar enlaces que redirijan a whatsapp:// (p. ej. desde otra app o marcador).",
        waylandOption2:
          "En el navegador: menú del enlace → Abrir con… → Catrip Connect (si aparece tras registrar).",
        waylandOption3:
          "Extensión del navegador que envíe wa.me al protocolo (no incluida en Catrip).",
        waylandOption4:
          "Dentro de la app: Ctrl+M (chat por número) o pegar el enlace si el sistema lo entrega a Catrip.",
        waylandTerminal: "También puedes ejecutar en terminal: npm run register:whatsapp",
      },
      accounts: {
        newAccount: "Nueva cuenta",
        hint: "Renombra y selecciona un ícono por cuenta. El rail usa estos mismos datos.",
        accountName: "Nombre de la cuenta",
        internalId: "Identificador interno",
        notifications: "Notificaciones para esta cuenta",
        chooseIcon: "Elegir ícono",
        regenerateIcon: "Variante",
        regenerateIconTitle: "Volver al ícono generado (variante)",
        deleteTitle: "Eliminar esta cuenta y todos sus datos",
        renamed: "Cuenta «{{from}}» renombrada a «{{to}}».",
        deleteConfirm: "¿Eliminar la cuenta «{{name}}»?",
        deleteWarning:
          "Se borrará permanentemente toda su sesión de WhatsApp Web (cookies, almacenamiento local, IndexedDB, Service Workers y caché HTTP). Esta acción no se puede deshacer.",
        deleteHint:
          "Si solo quieres dejar de recibir notificaciones, puedes desactivarlas desde la tarjeta sin perder la sesión.",
        deleted: "Cuenta «{{name}}» eliminada.",
        deleteFailed: "No se pudo eliminar «{{name}}».",
        deleteError: "Error al eliminar «{{name}}». Revisa la consola.",
      },
      notifications: {
        trayBadge: "Badge del tray según WhatsApp Web (no leídos)",
        dockBadge: "Badge en el icono del dock / lanzador (Linux)",
        enabled: "Notificaciones del sistema",
        showAccountName: "Mostrar nombre de la cuenta",
        showPreview: "Mostrar detalle (preview)",
        doNotDisturb: "No molestar (sin avisos nativos)",
        playSound: "Sonido del sistema en notificaciones",
        badgeSumHint:
          "Suma no leídos de todas las cuentas. Requiere soporte del entorno (GNOME/KDE).",
        manualBadgeLabel: "Badge manual (prueba; vacío = automático)",
        riseHint:
          "Aviso cuando suben los no leídos en cualquier cuenta (con límite por cuenta). Al pulsar la notificación se enfoca la ventana y se activa esa cuenta.",
      },
      performance: {
        gpuBoost: "Refuerzo GPU al arrancar (experimental)",
        suspendInactive: "Suspender cuentas inactivas",
        suspendAfter: "Suspender tras (minutos)",
        inhibitSleep: "Evitar suspensión durante videollamada",
        clearCache: "Limpiar caché HTTP (todas las cuentas)",
        checkCodecs: "Comprobar códecs ahora",
        cacheCleared: "Caché HTTP limpiada.",
        cacheFailed: "No se pudo limpiar la caché.",
        rendererLimit: "Límite de procesos del renderer",
        rendererLimitHint: "0 = predeterminado de Chromium. Requiere reiniciar la app.",
        gpuInfo:
          "Catrip Connect usa la GPU de Chromium para dibujar la ventana, el rail y cada cuenta de WhatsApp Web. En Linux la ventana va opaca por defecto (mejor composición). Solo desactiva la GPU si ves pantalla negra:",
        gpuBoostHint:
          "Activa rasterización reforzada, zero-copy y VA-API ampliado en Linux. Reinicia la app tras cambiar esta opción o el límite de procesos.",
        rendererDefault: "Predeterminado",
        minutesOption: "{{count}} minutos",
        suspendAfterLabel: "Suspender tras (minutos sin usar la cuenta)",
        suspendHint:
          "Libera RAM cerrando la vista de WhatsApp de las cuentas que no uses; la sesión (cookies) se conserva. Al volver a la cuenta se reactiva al instante. Mientras esté en reposo, los avisos de esa cuenta pueden no actualizarse.",
        inhibitSleepHint:
          "Usa el bloqueo de energía de Electron (equivalente a portal/systemd-inhibit en Linux) mientras WhatsApp Web detecta una llamada activa.",
        storageSection: "Almacenamiento",
        storageHint:
          "Limpia la caché HTTP de todas las cuentas (reduce espacio; normalmente mantiene la sesión).",
        mediaDiagSection: "Diagnóstico multimedia (WhatsApp Web)",
        mediaDiagHint:
          "Comprueba si Chromium puede reproducir códecs típicos de vídeo/audio en la sesión de la cuenta activa (misma ventana que WhatsApp Web). Funciona aunque estés en esta pantalla de ajustes.",
        mediaDiagFootnote:
          "Si decodingInfo_mp4_h264_aac.supported es false o MediaSource rechaza los MIME de MP4, audio/vídeo en WhatsApp pueden fallar.",
      },
      network: {
        proxy: "Proxy de red",
        proxyRules: "Reglas de proxy",
        proxyHint: 'Ej.: http=host:8080;https=host:8080',
        proxyRulesLabel: "Reglas del proxy",
        applyOnSaveHint: "Se aplica al guardar (no hay botón Apply aún).",
        proxyPlaceholder: 'Ej: "http=127.0.0.1:8080;https=127.0.0.1:8080"',
      },
    },
    app: {
      onboarding: {
        aria: "Bienvenida",
        title: "Bienvenido a Catrip Connect",
        subtitle:
          "Cliente multicuenta de WhatsApp Web. Añade tu primera cuenta para empezar a chatear desde el escritorio.",
        addFirst: "Añadir tu primera cuenta",
        hint: "También puedes pulsar el botón + del rail (lateral izquierdo, parpadea en verde).",
      },
      rail: {
        createFirst: "Crear tu primera cuenta",
        newAccount: "Nueva cuenta",
        phoneChat: "Nuevo chat por número de teléfono",
        newChat: "Nuevo chat (WhatsApp Web)",
        urgentNow: "Ahora mismo — chats más urgentes (Ctrl+Shift+A)",
        pending: "Acciones pendientes",
        activity: "Centro de actividad",
        settings: "Ajustes",
        zen: "Modo Zen (Esc para salir)",
        suspended: " · En reposo (ahorra memoria)",
        tooltip:
          "{{label}} · {{status}}{{unread}}{{suspended}} · Arrastrar para reordenar · Clic derecho: variante",
      },
      palette: {
        title: "Paleta de comandos",
        placeholder: "Buscar chats, cuentas o acciones…",
        hint: "↑ ↓ para navegar • Intro para ejecutar • Esc para cerrar",
      },
      shortcuts: {
        title: "Atajos de teclado",
        hint: "Referencia rápida; también están en el menú superior.",
        footer: "Esc cierra este cuadro. Clic fuera del panel también lo cierra.",
        file: "Archivo",
        view: "Ver",
        chat: "Chat",
        accounts: "Cuentas",
        settings: "Ajustes",
        hideWindow: "Ocultar ventana",
        quit: "Salir",
        quickSwitch: "Cambio rápido de cuenta",
        urgentNow: "Ahora mismo (top 3 urgentes)",
        fullscreen: "Pantalla completa",
        zenMode: "Modo Zen",
        exitZen: "Salir del modo Zen",
        reload: "Recargar WhatsApp Web",
        newChat: "Nuevo chat (WhatsApp Web)",
        phoneChat: "Chat por número de teléfono",
        newAccount: "Nueva cuenta",
        switchAccount: "Cambiar de cuenta (posición en la lista)",
      },
      about: {
        title: "Acerca de Catrip Connect",
        description:
          "Cliente de escritorio para WhatsApp Web con varias cuentas y sesiones aisladas.",
        electronNote:
          "Electron + Chromium embebido para reproducir audio y vídeo de forma fiable.",
        inspired:
          "Inspirado en ideas del proyecto ZapZap (PyQt6 + WebEngine). Implementación independiente en Electron.",
      },
      incomingLink: {
        title: "Abrir enlace de WhatsApp",
        destination: "Destino:",
        preloaded: "Incluye mensaje precargado.",
        chooseAccount: "Elige la cuenta:",
      },
      phone: {
        title: "Enviar mensaje a…",
        hint: "Introduzca el número de teléfono con código de país (ej.: +5511999999999):",
        footer: "Intro para abrir el chat • Esc para cerrar",
      },
      saveFile: "Guardar archivo",
      chooseDownloads: "Elegir carpeta de descargas",
      updateDialog: {
        releaseNotesAria: "Notas de la versión",
        openRelease: "Ver release completo en GitHub",
      },
    },
    activity: {
      title: "Centro de actividad",
      subtitle: "Resumen de mensajes sin leer en todas tus cuentas.",
      totalUnread: "{{count}} sin leer en total",
      noUnread: "Sin mensajes sin leer",
      lastMessage: "Último mensaje",
      openAccount: "Abrir cuenta",
      empty: "Añade una cuenta para ver actividad aquí.",
      active: "Activa",
      previewUnread: "Tienes mensajes sin leer",
      noRecentActivity: "Sin actividad reciente",
    },
    pending: {
      title: "Acciones pendientes",
      subtitle:
        "Chats sin leer de todas las cuentas, ordenados por urgencia. Clic para abrir el chat en WhatsApp Web.",
      empty: "No hay chats sin leer. ¡Estás al día!",
    },
    urgent: {
      aria: "Urgente ahora",
      title: "Ahora mismo",
      subtitle: "Lo más urgente en todas tus cuentas",
      subtitleEmpty: "Sin conversaciones pendientes",
      empty: "Estás al día. No hay chats sin leer.",
      viewAll: "Ver todas las pendientes",
    },
    main: {
      menus: {
        file: "Archivo",
        view: "Ver",
        chat: "Chat",
        accounts: "Cuentas",
        help: "Ayuda",
        settings: "Ajustes",
        hide: "Ocultar",
        quit: "Salir",
        quickSwitch: "Cambio rápido de cuenta…",
        fullscreen: "Pantalla completa",
        zenMode: "Modo Zen",
        urgentNow: "Ahora mismo",
        reload: "Recargar",
        newChat: "Nuevo chat",
        phoneChat: "Por número de teléfono",
        newAccount: "Nueva cuenta",
        userManual: "Manual de usuario",
        shortcuts: "Atajos de teclado",
        about: "Acerca de",
      },
      tray: {
        show: "Mostrar",
        hide: "Ocultar",
        settings: "Ajustes",
        closeToTray: "Cerrar a bandeja (toggle)",
        accounts: "Cuentas",
        quit: "Salir",
        unreadSummary: "{{count}} mensajes sin leer",
        unreadSummaryOne: "1 mensaje sin leer",
      },
      notifications: {
        oneUnread: "Tienes 1 chat sin leer.",
        manyUnread: "Tienes {{count}} chats sin leer.",
        generic: "Tienes chats sin leer.",
      },
      dialogs: {
        saveFile: "Guardar archivo",
        chooseDownloads: "Elegir carpeta de descargas",
        groupInvite: "Invitación a grupo",
      },
      accountMenu: {
        active: " (activa)",
        unread: " · {{count}} sin leer",
      },
      updates: {
        available: "Actualización disponible",
        availableMessage: "Catrip Connect {{version}} está listo para instalar.",
        newVersion: "Nueva versión disponible",
        newVersionMessage: "Hay una actualización: Catrip Connect {{version}}",
        verifyFailed: "No se pudo verificar el paquete .deb",
        verifyTitle: "Verificación de descarga",
        integrityOk: "Integridad verificada (SHA-512).",
        integrityFail:
          "La suma SHA-512 del archivo descargado no coincide con la publicada en GitHub.",
        downloadComplete: "Descarga completada",
        downloadCompleteMessage: "Paquete .deb guardado",
        downloadFailed: "Error al descargar",
        downloadFailedMessage: "No se pudo guardar el .deb",
        manualDownload: "Descarga manual",
        chooseDebFolder: "Elegir carpeta para guardar el .deb",
        restartNow: "Reiniciar ahora",
        installLater: "Instalar más tarde",
        later: "Más tarde",
        understood: "Entendido",
        download: "Descargar…",
        downloadLinkOnly: "Solo enlace de descarga",
        openFolder: "Abrir carpeta",
        openBrowser: "Abrir enlace en el navegador",
        debPromptHint:
          "¿Quieres descargar el paquete .deb a una carpeta de tu elección?\n(Si prefieres no descargar desde la app, podrás abrir el enlace de GitHub.)",
        debManualFooterHint:
          "Descarga el instalador .deb desde:\n{{debUrl}}\n\nLuego instálalo con apt o tu gestor de paquetes.",
        debInstallHint: "Instálalo con:\nsudo apt install ./{{filename}}",
        restartFooterHint:
          "La aplicación se reiniciará para aplicar la actualización.{{integrityLine}}",
        previewFooterHint:
          "Vista previa del diálogo de actualización (desarrollo). Desplázate para leer todas las notas.",
        downloadHttpError: "No se pudo descargar ({{status}} {{statusText}})",
        openRelease: "Ver release completo en GitHub",
      },
      integrations: {
        autostartOff: "Autoinicio desactivado.",
        autostartOn: "Autoinicio activado ({{path}}).",
        exeNotFound: "No se encontró el ejecutable de Catrip Connect.",
        linuxOnly: "Solo disponible en Linux.",
        protocolRegistered:
          "Protocolo whatsapp:// registrado. Los enlaces https://wa.me abiertos en el navegador no se pasan automáticamente a Catrip: usa whatsapp://, Abrir con… del navegador o una extensión.",
        protocolFailed: "No se pudo registrar el protocolo.",
        protocolRegisteredShort: "Protocolo registrado.",
        noReleaseNotes: "Sin notas de la versión.",
      },
      diagnostics: {
        noActiveAccount: "No hay cuenta activa.",
        viewUnavailable: "La vista web no está disponible.",
        whatsappNotLoaded:
          "La cuenta activa aún no muestra web.whatsapp.com. Abre WhatsApp Web en el navegador integrado e inténtalo de nuevo.",
        genericError: "Error: {{message}}",
      },
      desktop: {
        genericName: "Mensajería",
        comment: "Cliente multi-cuenta de WhatsApp Web",
        actionOpen: "Abrir Catrip Connect",
        actionFocus: "Enfocar ventana",
        actionNewAccount: "Nueva cuenta",
      },
    },
      toasts: {
        close: "Cerrar",
        closeNotification: "Cerrar notificación",
      },
  },
};

// English translations
catalog.en = JSON.parse(JSON.stringify(catalog.es));
Object.assign(catalog.en.common, {
  cancel: "Cancel",
  save: "Save",
  accept: "Accept",
  close: "Close",
  back: "Back",
  exit: "Quit",
  loading: "Loading…",
  deleting: "Deleting…",
  cleaning: "Clearing…",
  checking: "Checking…",
  rename: "Rename",
  delete: "Delete",
  deletePermanently: "Delete permanently",
  noResults: "No results",
  now: "Now",
  minutesAgo: "{{count}} min ago",
  hoursAgo: "{{count}} h ago",
  daysAgo: "{{count}} d ago",
  unread: "{{count}} unread",
  unreadOne: "1 unread",
  unreadLabel: "unread",
  messagesUnread: "{{count}} unread messages",
  accountDefault: "Account {{n}}",
  thisAccount: "this account",
  theAccount: "the account",
  variant: "Variant {{n}}",
  version: "Version",
  automatic: "Automatic",
  noAccounts: "(no accounts)",
});
Object.assign(catalog.en.sessionStatus, {
  loading: "Loading…",
  qr: "Waiting for QR",
  connected: "Connected",
  offline: "Offline",
});
Object.assign(catalog.en.commandGroups, {
  chats: "Chats",
  accounts: "Accounts",
  actions: "Actions",
  navigation: "Navigation",
  appearance: "Appearance",
});
Object.assign(catalog.en.commands, {
  activeAccount: "Active account",
  switchAccount: "Switch to this account",
  newAccount: "New account",
  newChat: "New chat (WhatsApp Web)",
  phoneChat: "Chat by phone number…",
  urgentNow: "Right now",
  urgentNowDesc: "Top 3 urgent chats without opening a large panel",
  activityCenter: "Activity center",
  activityCenterDesc: "Overview of all accounts and unread messages",
  pendingInbox: "Pending actions",
  pendingInboxDesc: "Unread chats sorted by urgency across all accounts",
  zenOn: "Enable Zen mode",
  zenOff: "Exit Zen mode",
  openSettings: "Open Settings → {{page}}",
  hideSidebar: "Hide sidebar (rail)",
  showSidebar: "Show sidebar (rail)",
  disableNotifications: "Disable system notifications",
  enableNotifications: "Enable system notifications",
  uiScale: "Interface scale: {{scale}}",
  unreadSuffix: " · {{count}} unread",
});
// ... I'll continue with a function to translate nested objects for other langs

/** Deep translate helper for pt, fr, de, ko, ja, it, zh */
const localeOverrides = {
  pt: {
    "common.cancel": "Cancelar",
    "common.save": "Salvar",
    "common.accept": "Aceitar",
    "common.close": "Fechar",
    "common.back": "Voltar",
    "common.exit": "Sair",
    "common.loading": "Carregando…",
    "settings.language.label": "Idioma da interface",
    "settings.language.hint":
      "Afeta menus, notificações e textos do Catrip Connect. O WhatsApp Web usa seu próprio idioma.",
    "settings.language.system": "Idioma do sistema",
    "app.onboarding.title": "Bem-vindo ao Catrip Connect",
    "main.menus.file": "Arquivo",
    "main.menus.help": "Ajuda",
    "main.menus.settings": "Configurações",
    "main.tray.show": "Mostrar",
    "main.tray.quit": "Sair",
  },
  fr: {
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.accept": "Accepter",
    "common.close": "Fermer",
    "common.back": "Retour",
    "common.exit": "Quitter",
    "common.loading": "Chargement…",
    "settings.language.label": "Langue de l'interface",
    "settings.language.system": "Langue du système",
    "app.onboarding.title": "Bienvenue dans Catrip Connect",
    "main.menus.file": "Fichier",
    "main.menus.help": "Aide",
    "main.menus.settings": "Paramètres",
    "main.tray.quit": "Quitter",
  },
  de: {
    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.accept": "OK",
    "common.close": "Schließen",
    "common.back": "Zurück",
    "common.exit": "Beenden",
    "common.loading": "Wird geladen…",
    "settings.language.label": "Oberflächensprache",
    "settings.language.system": "Systemsprache",
    "app.onboarding.title": "Willkommen bei Catrip Connect",
    "main.menus.file": "Datei",
    "main.menus.help": "Hilfe",
    "main.menus.settings": "Einstellungen",
    "main.tray.quit": "Beenden",
  },
  ko: {
    "common.cancel": "취소",
    "common.save": "저장",
    "common.accept": "확인",
    "common.close": "닫기",
    "common.back": "뒤로",
    "common.exit": "종료",
    "common.loading": "로딩 중…",
    "settings.language.label": "인터페이스 언어",
    "settings.language.system": "시스템 언어",
    "app.onboarding.title": "Catrip Connect에 오신 것을 환영합니다",
    "main.menus.file": "파일",
    "main.menus.help": "도움말",
    "main.menus.settings": "설정",
    "main.tray.quit": "종료",
  },
  ja: {
    "common.cancel": "キャンセル",
    "common.save": "保存",
    "common.accept": "OK",
    "common.close": "閉じる",
    "common.back": "戻る",
    "common.exit": "終了",
    "common.loading": "読み込み中…",
    "settings.language.label": "インターフェース言語",
    "settings.language.system": "システム言語",
    "app.onboarding.title": "Catrip Connect へようこそ",
    "main.menus.file": "ファイル",
    "main.menus.help": "ヘルプ",
    "main.menus.settings": "設定",
    "main.tray.quit": "終了",
  },
  it: {
    "common.cancel": "Annulla",
    "common.save": "Salva",
    "common.accept": "Accetta",
    "common.close": "Chiudi",
    "common.back": "Indietro",
    "common.exit": "Esci",
    "common.loading": "Caricamento…",
    "settings.language.label": "Lingua dell'interfaccia",
    "settings.language.system": "Lingua di sistema",
    "app.onboarding.title": "Benvenuto in Catrip Connect",
    "main.menus.file": "File",
    "main.menus.help": "Aiuto",
    "main.menus.settings": "Impostazioni",
    "main.tray.quit": "Esci",
  },
  zh: {
    "common.cancel": "取消",
    "common.save": "保存",
    "common.accept": "确定",
    "common.close": "关闭",
    "common.back": "返回",
    "common.exit": "退出",
    "common.loading": "加载中…",
    "settings.language.label": "界面语言",
    "settings.language.system": "系统语言",
    "app.onboarding.title": "欢迎使用 Catrip Connect",
    "main.menus.file": "文件",
    "main.menus.help": "帮助",
    "main.menus.settings": "设置",
    "main.tray.quit": "退出",
  },
};

function setByPath(obj, dotPath, value) {
  const parts = dotPath.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function getByPath(obj, dotPath) {
  return dotPath.split(".").reduce((o, k) => o?.[k], obj);
}

function flattenKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) keys.push(...flattenKeys(v, p));
    else keys.push(p);
  }
  return keys;
}

// Build full EN catalog properly (complete translation)
function deepAssignEn() {
  const en = catalog.en;
  Object.assign(en.settings.pages, {
    general: "General",
    accounts: "Accounts",
    notifications: "Notifications",
    performance: "Performance (experimental)",
    network: "Network",
  });
  Object.assign(en.settings, {
    title: "SETTINGS",
    tools: "TOOLS",
  });
  Object.assign(en.settings.language, {
    label: "Interface language",
    hint: "Defaults to your system language; if unavailable, English is used. Affects menus, notifications, and Catrip Connect text. WhatsApp Web uses its own language.",
    system: "System language",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "WhatsApp Web uses a separate language",
    metaRestriction:
      "Meta does not allow third-party apps (such as Catrip Connect) to change WhatsApp Web's language through its platform. Because of WhatsApp's usage restrictions and privacy rules, you must set the chat language manually inside WhatsApp Web.",
    intro:
      "Catrip Connect's language (menus, notifications, and app text) has been updated to your selection.",
    stepsTitle: "To change WhatsApp Web's language:",
    step1: "Open WhatsApp Web in the main window (active account).",
    step2: "Click the ⋮ menu (three dots) at the top left and open Settings.",
    step3: "Go to Language and choose your preferred language for WhatsApp.",
  });
  Object.assign(en.settings.scale, {
    title: "Scale",
    hint: "Affects the UI and WhatsApp Web. Applied instantly.",
  });
  Object.assign(en.settings.general, {
    startMinimized: "Start minimized",
    showSidebar: "Show sidebar",
    showMenuBar: "Show menu bar",
    closeToTray: "On close, minimize to tray",
    autoStart: "Start automatically with the system",
    incomingLinks: "Incoming WhatsApp links",
    incomingLinksHint: "When opening whatsapp:// or wa.me from the system.",
    incomingLinkAuto: "Ask when multiple accounts exist",
    incomingLinkActive: "Always the active account",
    incomingLinkFixed: "Fixed account",
    registerProtocol: "Register as default app (whatsapp://)",
    registerProtocolHint:
      "whatsapp:// — After registering, the system can open compatible links directly in Catrip.",
    checkUpdates: "Check for updates on startup (GitHub Releases)",
    updateChannel: "Update channel",
    updateChannelStable: "Stable (releases)",
    updateChannelBeta: "Beta (pre-releases)",
    updateChannelHint:
      "AppImage: downloads and installs when you restart. Installed .deb: you can download the package to a folder of your choice or open only the GitHub link; the changelog and .deb SHA-512 are shown in the dialog.",
    openDownloads: "Open downloaded files with default app",
    askSaveAs: "Always ask “Save as…”",
    downloadsSection: "Downloads",
    downloadsFolder: "Downloads folder",
    downloadsPlaceholder: "(use system downloads folder)",
    chooseDownloadsFolder: "Choose folder…",
    clearDownloadsFolder: "Use system folder",
    resetDownloads: "Reset",
    downloadsFilenameHint:
      "WhatsApp Web controls the file name. If the file already exists, an alternate name will be used.",
    waylandBrowserTitle: "https://wa.me in the browser",
    waylandBrowserIntro:
      "On Wayland/Linux, browsers do not hand off HTTPS links to arbitrary apps. Practical options:",
    waylandOption1:
      "Use links that redirect to whatsapp:// (e.g. from another app or a bookmark).",
    waylandOption2:
      "In the browser: link menu → Open with… → Catrip Connect (if listed after registering).",
    waylandOption3:
      "A browser extension that sends wa.me URLs to the protocol (not bundled with Catrip).",
    waylandOption4:
      "Inside the app: Ctrl+M (chat by number) or paste the link if the OS delivers it to Catrip.",
    waylandTerminal: "You can also run in a terminal: npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "New account",
    hint: "Rename and pick an icon per account. The rail uses the same data.",
    accountName: "Account name",
    internalId: "Internal identifier",
    notifications: "Notifications for this account",
    chooseIcon: "Choose icon",
    regenerateIcon: "Variant",
    regenerateIconTitle: "Restore generated icon (variant)",
    deleteTitle: "Delete this account and all its data",
    renamed: "Account «{{from}}» renamed to «{{to}}».",
    deleteConfirm: "Delete account «{{name}}»?",
    deleteWarning:
      "The entire WhatsApp Web session will be permanently deleted (cookies, local storage, IndexedDB, Service Workers and HTTP cache). This cannot be undone.",
    deleteHint:
      "To stop notifications only, disable them on the card without losing the session.",
    deleted: "Account «{{name}}» deleted.",
    deleteFailed: "Could not delete «{{name}}».",
    deleteError: "Error deleting «{{name}}». Check the console.",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "Tray badge from WhatsApp Web (unread)",
    dockBadge: "Badge on dock / launcher icon (Linux)",
    enabled: "System notifications",
    showAccountName: "Show account name",
    showPreview: "Show preview",
    doNotDisturb: "Do not disturb (no native alerts)",
    playSound: "System sound for notifications",
    badgeSumHint:
      "Sum unread across all accounts. Requires desktop environment support (GNOME/KDE).",
    manualBadgeLabel: "Manual badge (test; leave empty for automatic)",
    riseHint:
      "Notify when unread count increases on any account (per-account rate limit). Clicking the notification focuses the window and switches to that account.",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "GPU boost on startup (experimental)",
    gpuInfo:
      "Catrip Connect uses Chromium's GPU for the window, rail, and each WhatsApp Web account. On Linux the window is opaque by default (better compositing). Disable the GPU only if you see a black screen: CATRIP_DISABLE_GPU=1.",
    gpuBoostHint:
      "Enables reinforced rasterization, zero-copy, and extended VA-API on Linux. Restart the app after changing this or the process limit.",
    suspendInactive: "Suspend inactive accounts",
    suspendAfter: "Suspend after (minutes)",
    suspendAfterLabel: "Suspend after (minutes without using the account)",
    suspendHint:
      "Frees RAM by closing the WhatsApp view for unused accounts; the session (cookies) is kept. Switching back reloads instantly. While suspended, notifications for that account may not update.",
    inhibitSleep: "Prevent sleep during video call",
    inhibitSleepHint:
      "Uses Electron's power save blocker (similar to portal/systemd-inhibit on Linux) while WhatsApp Web detects an active call.",
    clearCache: "Clear HTTP cache (all accounts)",
    checkCodecs: "Check codecs now",
    cacheCleared: "HTTP cache cleared.",
    cacheFailed: "Could not clear cache.",
    rendererLimit: "Renderer process limit",
    rendererLimitHint: "0 = Chromium default. Requires app restart.",
    rendererDefault: "Default",
    minutesOption: "{{count}} minutes",
    storageSection: "Storage",
    storageHint:
      "Clears HTTP cache for all accounts (saves disk space; usually keeps the session).",
    mediaDiagSection: "Multimedia diagnostics (WhatsApp Web)",
    mediaDiagHint:
      "Checks whether Chromium can play typical video/audio codecs in the active account session (same window as WhatsApp Web). Works even while you are on this settings screen.",
    mediaDiagFootnote:
      "If decodingInfo_mp4_h264_aac.supported is false or MediaSource rejects MP4 MIME types, audio/video in WhatsApp may fail.",
  });
  Object.assign(en.settings.network, {
    proxy: "Network proxy",
    proxyRules: "Proxy rules",
    proxyRulesLabel: "Proxy rules",
    proxyHint: "E.g. http=host:8080;https=host:8080",
    proxyPlaceholder: "E.g. http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "Applied when you save (no Apply button yet).",
  });
  Object.assign(en.app.onboarding, {
    aria: "Welcome",
    title: "Welcome to Catrip Connect",
    subtitle:
      "Multi-account WhatsApp Web client. Add your first account to start chatting from the desktop.",
    addFirst: "Add your first account",
    hint: "You can also click the + button on the rail (left sidebar, blinking green).",
  });
  Object.assign(en.app.rail, {
    createFirst: "Create your first account",
    newAccount: "New account",
    phoneChat: "New chat by phone number",
    newChat: "New chat (WhatsApp Web)",
    urgentNow: "Right now — most urgent chats (Ctrl+Shift+A)",
    pending: "Pending actions",
    activity: "Activity center",
    settings: "Settings",
    zen: "Zen mode (Esc to exit)",
    suspended: " · Suspended (saves memory)",
    tooltip:
      "{{label}} · {{status}}{{unread}}{{suspended}} · Drag to reorder · Right-click: variant",
  });
  Object.assign(en.app.palette, {
    title: "Command palette",
    placeholder: "Search chats, accounts or actions…",
    hint: "↑ ↓ to navigate • Enter to run • Esc to close",
  });
  Object.assign(en.app.shortcuts, {
    title: "Keyboard shortcuts",
    hint: "Quick reference; also available in the top menu.",
    footer: "Esc closes this dialog. Click outside also closes it.",
    file: "File",
    view: "View",
    chat: "Chat",
    accounts: "Accounts",
    settings: "Settings",
    hideWindow: "Hide window",
    quit: "Quit",
    quickSwitch: "Quick account switch",
    urgentNow: "Right now (top 3 urgent)",
    fullscreen: "Fullscreen",
    zenMode: "Zen mode",
    exitZen: "Exit Zen mode",
    reload: "Reload WhatsApp Web",
    newChat: "New chat (WhatsApp Web)",
    phoneChat: "Chat by phone number",
    newAccount: "New account",
    switchAccount: "Switch account (list position)",
  });
  Object.assign(en.app.about, {
    title: "About Catrip Connect",
    description: "Desktop client for WhatsApp Web with multiple isolated accounts.",
    electronNote: "Electron + embedded Chromium for reliable audio and video playback.",
    inspired:
      "Inspired by ideas from the ZapZap project (PyQt6 + WebEngine). Independent Electron implementation.",
  });
  Object.assign(en.app.incomingLink, {
    title: "Open WhatsApp link",
    destination: "Destination:",
    preloaded: "Includes preloaded message.",
    chooseAccount: "Choose account:",
  });
  Object.assign(en.app.phone, {
    title: "Send message to…",
    hint: "Enter phone number with country code (e.g. +5511999999999):",
    footer: "Enter to open chat • Esc to close",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "Release notes",
    openRelease: "View full release on GitHub",
  });
  Object.assign(en.app, {
    saveFile: "Save file",
    chooseDownloads: "Choose downloads folder",
  });
  Object.assign(en.activity, {
    title: "Activity center",
    subtitle: "Unread message summary across all your accounts.",
    totalUnread: "{{count}} unread total",
    noUnread: "No unread messages",
    lastMessage: "Last message",
    openAccount: "Open account",
    empty: "Add an account to see activity here.",
    active: "Active",
    previewUnread: "You have unread messages",
    noRecentActivity: "No recent activity",
  });
  Object.assign(en.pending, {
    title: "Pending actions",
    subtitle:
      "Unread chats from all accounts, sorted by urgency. Click to open the chat in WhatsApp Web.",
    empty: "No unread chats. You're all caught up!",
  });
  Object.assign(en.urgent, {
    aria: "Urgent now",
    title: "Right now",
    subtitle: "Most urgent across all your accounts",
    subtitleEmpty: "No pending conversations",
    empty: "You're all caught up. No unread chats.",
    viewAll: "View all pending",
  });
  Object.assign(en.main.menus, {
    file: "File",
    view: "View",
    chat: "Chat",
    accounts: "Accounts",
    help: "Help",
    settings: "Settings",
    hide: "Hide",
    quit: "Quit",
    quickSwitch: "Quick account switch…",
    fullscreen: "Fullscreen",
    zenMode: "Zen mode",
    urgentNow: "Right now",
    reload: "Reload",
    newChat: "New chat",
    phoneChat: "By phone number",
    newAccount: "New account",
    userManual: "User manual",
    shortcuts: "Keyboard shortcuts",
    about: "About",
  });
  Object.assign(en.main.tray, {
    show: "Show",
    hide: "Hide",
    settings: "Settings",
    closeToTray: "Close to tray (toggle)",
    accounts: "Accounts",
    quit: "Quit",
    unreadSummary: "{{count}} unread messages",
    unreadSummaryOne: "1 unread message",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "You have 1 unread chat.",
    manyUnread: "You have {{count}} unread chats.",
    generic: "You have unread chats.",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "Save file",
    chooseDownloads: "Choose downloads folder",
    groupInvite: "Group invitation",
  });
  Object.assign(en.main.accountMenu, {
    active: " (active)",
    unread: " · {{count}} unread",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "Update available",
    availableMessage: "Catrip Connect {{version}} is ready to install.",
    newVersion: "New version available",
    newVersionMessage: "An update is available: Catrip Connect {{version}}",
    verifyFailed: "Download verification",
    verifyTitle: "Could not verify the .deb package",
    integrityOk: "Integrity verified (SHA-512).",
    integrityFail:
      "The SHA-512 checksum of the downloaded file does not match the one published on GitHub.",
    downloadComplete: "Download complete",
    downloadCompleteMessage: ".deb package saved",
    downloadFailed: "Download error",
    downloadFailedMessage: "Could not save the .deb",
    manualDownload: "Manual download",
    chooseDebFolder: "Choose folder to save the .deb",
    restartNow: "Restart now",
    installLater: "Install later",
    later: "Later",
    understood: "OK",
    download: "Download…",
    downloadLinkOnly: "Download link only",
    openFolder: "Open folder",
    openBrowser: "Open link in browser",
    debPromptHint:
      "Download the .deb package to a folder of your choice?\n(If you prefer not to download from the app, you can open the GitHub link instead.)",
    debManualFooterHint:
      "Download the .deb installer from:\n{{debUrl}}\n\nThen install it with apt or your package manager.",
    debInstallHint: "Install with:\nsudo apt install ./{{filename}}",
    restartFooterHint: "The app will restart to apply the update.{{integrityLine}}",
    previewFooterHint:
      "Update dialog preview (development). Scroll to read all release notes.",
    downloadHttpError: "Could not download ({{status}} {{statusText}})",
    openRelease: "View full release on GitHub",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "Autostart disabled.",
    autostartOn: "Autostart enabled ({{path}}).",
    exeNotFound: "Catrip Connect executable not found.",
    linuxOnly: "Available on Linux only.",
    protocolRegistered:
      "whatsapp:// registered and launcher actions updated. https://wa.me links opened in the browser are not passed to Catrip automatically: use whatsapp://, the browser's Open with… button, or an extension.",
    protocolFailed: "Registration failed.",
    protocolRegisteredShort: "Protocol registered.",
    noReleaseNotes: "No release notes for this version.",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "No active account.",
    viewUnavailable: "The embedded web view is not available.",
    whatsappNotLoaded:
      "The active account is not showing web.whatsapp.com yet. Open WhatsApp Web in the built-in browser and try again.",
    genericError: "An error occurred.",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "Messaging",
    comment: "Multi-account WhatsApp Web client",
    actionOpen: "Open Catrip Connect",
    actionFocus: "Focus window",
    actionNewAccount: "New account",
  });
  Object.assign(en.toasts, { close: "Close", closeNotification: "Close notification" });
}

deepAssignEn();

const localeAssigners = {
  pt: assignPt,
  fr: assignFr,
  de: assignDe,
  ko: assignKo,
  ja: assignJa,
  it: assignIt,
  zh: assignZh,
};

for (const [locale, assign] of Object.entries(localeAssigners)) {
  catalog[locale] = JSON.parse(JSON.stringify(catalog.en));
  assign(catalog[locale]);
}

for (const [locale, data] of Object.entries(catalog)) {
  const dir = path.join(localesDir, locale);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "translation.json"),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
  console.log(`Wrote ${locale}/translation.json`);
}
