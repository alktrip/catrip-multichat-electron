/**
 * Genera src/shared/locales/LANG/manual.json para los 9 idiomas de la app.
 * Ejecutar: node _scripts/build-manual-locale-files.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  manualDe,
  manualEn,
  manualFr,
  manualIt,
  manualJa,
  manualKo,
  manualPt,
  manualZh,
} from "./manual-locale-translations.mjs";
import { applyManualIdiomaPatch } from "./manual-idioma-patch.mjs";
import { applyManualVideollamadasPatch } from "./manual-videollamadas-patch.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const localesDir = path.join(root, "src/shared/locales");
const MANUAL_VERSION = "1.7.0";
const LANGS = ["es", "en", "pt", "fr", "de", "ko", "ja", "it", "zh"];

/** @type {Record<string, string | null>} */
const ILLUSTRATION_BY_SECTION = {
  "primeros-pasos": "qr",
  ventana: "layout",
  cuentas: "accounts",
  "reposo-cuentas": "accounts",
  zen: "zen",
  "ahora-mismo": "urgent",
  paleta: "palette",
  "ajustes-notificaciones": "notification",
  bandeja: "tray",
};

/**
 * @param {string} id
 * @param {object} section
 */
function finalizeSection(id, section) {
  return {
    id,
    title: section.title,
    illustration: ILLUSTRATION_BY_SECTION[id] ?? null,
    paragraphs: section.paragraphs ?? null,
    bullets: section.bullets ?? null,
    steps: section.steps ?? null,
    note: section.note ?? null,
    table: section.table ?? null,
  };
}

/**
 * @param {object} intro
 * @param {object[]} sections
 */
function buildManual(intro, sections) {
  return {
    intro,
    sections: sections.map((s) => finalizeSection(s.id, s)),
  };
}

const INTROS = {
  es: {
    title: "Manual de Catrip Connect",
    subtitle:
      "Guía para el día a día: varias cuentas de WhatsApp en un solo programa, en el idioma que elijas.",
    versionNote: `Versión del manual: ${MANUAL_VERSION}`,
    tocTitle: "Índice",
    closeAria: "Cerrar manual",
    footer: "Esc para cerrar · Clic fuera del panel también cierra",
  },
  en: {
    title: "Catrip Connect User Manual",
    subtitle:
      "Your day-to-day guide: multiple WhatsApp accounts in one desktop app, in the language you choose.",
    versionNote: `Manual version: ${MANUAL_VERSION}`,
    tocTitle: "Contents",
    closeAria: "Close manual",
    footer: "Esc to close · Click outside the panel also closes",
  },
  pt: {
    title: "Manual do Catrip Connect",
    subtitle:
      "Guia para o dia a dia: várias contas do WhatsApp num único programa, sem complicações.",
    versionNote: `Versão do manual: ${MANUAL_VERSION}`,
    tocTitle: "Índice",
    closeAria: "Fechar manual",
    footer: "Esc para fechar · Clic fora do painel também fecha",
  },
  fr: {
    title: "Manuel de Catrip Connect",
    subtitle:
      "Guide au quotidien : plusieurs comptes WhatsApp dans une seule application, en toute simplicité.",
    versionNote: `Version du manuel : ${MANUAL_VERSION}`,
    tocTitle: "Sommaire",
    closeAria: "Fermer le manuel",
    footer: "Échap pour fermer · Un clic à l'extérieur du panneau ferme aussi",
  },
  de: {
    title: "Catrip Connect – Benutzerhandbuch",
    subtitle:
      "Alltagshilfe: mehrere WhatsApp-Konten in einer Desktop-App – unkompliziert und übersichtlich.",
    versionNote: `Handbuchversion: ${MANUAL_VERSION}`,
    tocTitle: "Inhalt",
    closeAria: "Handbuch schließen",
    footer: "Esc zum Schließen · Klick außerhalb des Panels schließt ebenfalls",
  },
  ko: {
    title: "Catrip Connect 사용자 매뉴얼",
    subtitle: "일상 가이드: 하나의 프로그램에서 여러 WhatsApp 계정을 간편하게 사용하세요.",
    versionNote: `매뉴얼 버전: ${MANUAL_VERSION}`,
    tocTitle: "목차",
    closeAria: "매뉴얼 닫기",
    footer: "Esc로 닫기 · 패널 밖을 클릭해도 닫힙니다",
  },
  ja: {
    title: "Catrip Connect ユーザーマニュアル",
    subtitle: "日常使いのガイド：ひとつのアプリで複数の WhatsApp アカウントをシンプルに。",
    versionNote: `マニュアル版: ${MANUAL_VERSION}`,
    tocTitle: "目次",
    closeAria: "マニュアルを閉じる",
    footer: "Esc で閉じる · パネル外をクリックしても閉じます",
  },
  it: {
    title: "Manuale di Catrip Connect",
    subtitle:
      "Guida quotidiana: più account WhatsApp in un'unica applicazione, senza complicazioni.",
    versionNote: `Versione del manuale: ${MANUAL_VERSION}`,
    tocTitle: "Indice",
    closeAria: "Chiudi manuale",
    footer: "Esc per chiudere · Clic fuori dal pannello chiude anche",
  },
  zh: {
    title: "Catrip Connect 用户手册",
    subtitle: "日常使用指南：在一个程序中管理多个 WhatsApp 账户，简单省心。",
    versionNote: `手册版本：${MANUAL_VERSION}`,
    tocTitle: "目录",
    closeAria: "关闭手册",
    footer: "按 Esc 关闭 · 点击面板外部也会关闭",
  },
};

// Spanish source (from src/renderer/ui/userManualContent.ts)
const manualEs = [
  {
    id: "bienvenida",
    title: "¿Qué es Catrip Connect?",
    paragraphs: [
      "Catrip Connect es un programa para el ordenador que te permite usar WhatsApp Web con una o varias cuentas a la vez. Cada cuenta es independiente: los mensajes, contactos y archivos de una no se mezclan con los de otra.",
      "La pantalla principal muestra WhatsApp tal como lo conoces en el navegador, pero con herramientas extra: cambiar de cuenta con un clic, ahorrar memoria suspendiendo cuentas que no uses, un vistazo rápido a lo más urgente («Ahora mismo»), ver todos los mensajes sin leer, buscar chats desde Ctrl+K, recibir avisos en el escritorio y mucho más.",
    ],
  },
  {
    id: "primeros-pasos",
    title: "Primeros pasos",
    steps: [
      "Abre Catrip Connect desde el menú de aplicaciones de tu sistema (busca «Catrip Connect»).",
      "Si es la primera vez, pulsa el botón para crear tu primera cuenta. Dale un nombre que reconozcas, por ejemplo «Personal» o «Trabajo».",
      "Aparecerá el código QR de WhatsApp Web. En el móvil abre WhatsApp → Dispositivos vinculados → Vincular dispositivo y escanea el código.",
      "Cuando la conexión esté lista, verás tus chats en la zona grande de la ventana.",
      "Para añadir otra cuenta, usa el botón «Nueva cuenta» en la barra lateral o el menú Cuentas.",
    ],
    note: "Si el código QR caduca, recarga la vista con la tecla F5 o el menú Chat → Recargar.",
  },
  {
    id: "ventana",
    title: "Cómo está organizada la ventana",
    paragraphs: [
      "La ventana tiene dos zonas principales. A la izquierda está la barra lateral (a veces la llamamos «el rail»): ahí ves los iconos de tus cuentas y algunos accesos rápidos. A la derecha, la parte grande, es WhatsApp Web de la cuenta que tengas seleccionada.",
      "Arriba encontrarás la barra de menús (Archivo, Ver, Chat, Cuentas, Ayuda) si la tienes activada en Ajustes. Desde ahí puedes hacer casi todo lo que explicamos en este manual.",
    ],
    bullets: [
      "Parte superior del rail: avatares de tus cuentas (clic para cambiar, arrastrar para reordenar).",
      "Parte inferior del rail: botones de acción — nueva cuenta, chat por número, nuevo chat, ⚡ Ahora mismo, ✉ pendientes, ▤ actividad, ajustes y modo Zen.",
      "Zona central: chats, llamadas y archivos de WhatsApp Web.",
      "Menú superior: accesos organizados por categorías (incluye Ver → Ahora mismo).",
    ],
  },
  {
    id: "cuentas",
    title: "Trabajar con varias cuentas",
    paragraphs: [
      "Puedes tener varias cuentas de WhatsApp en la misma aplicación. Cada una tiene su propio icono de color en la barra lateral.",
    ],
    bullets: [
      "Haz clic en un icono para cambiar a esa cuenta.",
      "Arrastra un icono hacia arriba o abajo para cambiar el orden de la lista.",
      "El punto verde o el número sobre el icono indica mensajes sin leer en esa cuenta.",
      "Si una cuenta lleva un rato sin usarse, puede pasar a «en reposo»: el avatar se ve más tenue y el tooltip lo indica. La sesión sigue guardada; un clic la reactiva al instante.",
      "Pasa el ratón sobre un icono para ver si está conectada, en reposo, esperando QR o sin internet.",
      "Atajo rápido: Ctrl+1 abre la primera cuenta, Ctrl+2 la segunda, y así hasta Ctrl+9.",
    ],
    note: "En Ajustes → Cuentas puedes renombrar cada cuenta, cambiar el color del icono o eliminarla si ya no la necesitas. En Ajustes → Rendimiento configuras cuándo entran en reposo las cuentas inactivas.",
  },
  {
    id: "reposo-cuentas",
    title: "Cuentas en reposo (ahorro de memoria)",
    paragraphs: [
      "Con varias cuentas abiertas, cada una consume memoria y procesador mientras mantiene WhatsApp Web cargado. Catrip Connect puede «dormir» las cuentas que no uses: cierra la vista interna de WhatsApp pero conserva tu sesión (cookies y login) en el disco.",
      "Así la aplicación va más ligera con tres, cuatro o más cuentas, sin tener que cerrar sesión ni volver a escanear el QR cada vez.",
    ],
    steps: [
      "Usa una cuenta con normalidad; al cambiar a otra, la anterior empieza a contar el tiempo de inactividad.",
      "Tras el umbral configurado (por defecto 15 minutos), la cuenta entra en reposo: su avatar en el rail se ve atenuado.",
      "Para reactivarla, haz clic en su avatar, elige un chat desde ✉ pendientes, Ctrl+K o abre un enlace wa.me dirigido a esa cuenta.",
      "WhatsApp Web se vuelve a cargar en unos segundos con la misma sesión; no hace falta escanear de nuevo el QR.",
    ],
    bullets: [
      "Activado por defecto en Ajustes → Rendimiento → «Suspender cuentas inactivas».",
      "Puedes elegir el tiempo de espera: 5, 10, 15, 30 o 60 minutos.",
      "La cuenta activa nunca se suspende.",
      "Si hay una videollamada en curso en una cuenta, no se suspende hasta que cuelgues.",
      "Desactivar la opción reactiva de inmediato todas las cuentas que estuvieran en reposo.",
    ],
    note: "Mientras una cuenta está en reposo, los avisos y contadores de esa cuenta pueden no actualizarse hasta que la abras. La cuenta activa y las que uses con frecuencia siguen recibiendo notificaciones con normalidad.",
  },
  {
    id: "zen",
    title: "Modo Zen (solo el chat)",
    paragraphs: [
      "El modo Zen oculta la barra lateral para que WhatsApp ocupe toda la ventana. Es útil cuando quieres concentrarte en una conversación.",
    ],
    bullets: [
      "Actívalo desde el menú Ver → Modo Zen, con Ctrl+Shift+Z o buscando «Zen» en la paleta de comandos (Ctrl+K).",
      "Para volver a la vista normal, pulsa Escape o repite el atajo.",
      "Al entrar en Ajustes, el modo Zen se desactiva solo.",
    ],
    note: "En modo Zen no verás el botón ⚡ del rail; sal del modo Zen o usa Ctrl+Shift+A para abrir «Ahora mismo».",
  },
  {
    id: "ahora-mismo",
    title: "«Ahora mismo» — lo urgente en un vistazo",
    paragraphs: [
      "«Ahora mismo» es un panel pequeño que aparece junto a la barra lateral. Muestra hasta tres conversaciones con mensajes sin leer, las más urgentes de todas tus cuentas. A diferencia de las ventanas grandes (centro de actividad o acciones pendientes), no tapa WhatsApp: puedes leer el resumen y seguir viendo el chat al lado.",
    ],
    steps: [
      "Pulsa el botón ⚡ en la barra lateral, usa Ctrl+Shift+A o el menú Ver → Ahora mismo.",
      "Revisa la lista: verás el nombre del contacto, la cuenta (Personal, Trabajo…), cuántos mensajes sin leer hay y una línea del último mensaje.",
      "Haz clic en una fila para abrir ese chat en la cuenta correcta. El panel se cierra solo.",
      "Si necesitas ver más conversaciones, pulsa «Ver todas las pendientes» al pie del panel.",
      "Para cerrar sin abrir nada: pulsa Escape, la X del panel o haz clic fuera de él.",
    ],
    bullets: [
      "Un punto verde en el botón ⚡ indica que hay chats urgentes pendientes.",
      "Si no hay mensajes sin leer, el panel te lo dirá («Estás al día»).",
      "También puedes escribir «Ahora mismo» en la paleta Ctrl+K.",
    ],
    note: "El panel usa la misma información que WhatsApp Web sobre mensajes sin leer. Si acabas de leer un chat en el móvil, puede tardar unos segundos en desaparecer de la lista.",
  },
  {
    id: "actividad",
    title: "Centro de actividad y acciones pendientes",
    paragraphs: [
      "Además de «Ahora mismo», tienes dos vistas más amplias cuando necesitas revisar todo con calma.",
    ],
    table: {
      headers: ["Herramienta", "Cuándo usarla", "Cómo abrirla"],
      rows: [
        [
          "⚡ Ahora mismo",
          "Vistazo rápido: top 3 urgentes sin tapar la pantalla",
          "Botón ⚡, Ctrl+Shift+A, Ver → Ahora mismo",
        ],
        [
          "▤ Centro de actividad",
          "Resumen por cuenta: quién escribió y vista previa",
          "Botón ▤ o Ctrl+K → «actividad»",
        ],
        [
          "✉ Acciones pendientes",
          "Lista completa de todos los chats sin leer",
          "Botón ✉ o Ctrl+K → «pendientes»",
        ],
        [
          "Ctrl+K → Chats",
          "Buscar un contacto concreto por nombre o texto",
          "Ctrl+K y escribe el nombre",
        ],
      ],
    },
    bullets: [
      "Centro de actividad (▤): una tarjeta por cuenta con total de no leídos y último mensaje.",
      "Acciones pendientes (✉): lista plana ordenada por urgencia en todas las cuentas.",
      "Desde «Ahora mismo» puedes saltar a la bandeja completa con un solo clic.",
    ],
  },
  {
    id: "paleta",
    title: "Paleta de comandos (buscador rápido)",
    paragraphs: [
      "Pulsa Ctrl+K en cualquier momento para abrir un buscador. Escribe lo que buscas y la lista se filtra al instante.",
      "Además de cuentas y acciones, puedes buscar conversaciones con mensajes sin leer: escribe el nombre del contacto, un fragmento del último mensaje o el nombre de la cuenta (por ejemplo «Ana» o «Trabajo presupuesto»). Al elegir un chat, la app abre esa conversación en la cuenta correcta.",
    ],
    bullets: [
      "Flechas arriba y abajo para elegir una opción.",
      "Enter para ejecutarla (abrir chat, cambiar cuenta —reactivándola si estaba en reposo—, abrir «Ahora mismo», ir a Ajustes, etc.).",
      "Escape para cerrar sin hacer nada.",
      "Los chats aparecen arriba en la sección «Chats» cuando coinciden con lo que escribes.",
      "Comandos útiles: «Ahora mismo», «Acciones pendientes», «Centro de actividad», «Nueva cuenta», «Modo Zen».",
    ],
    note: "La búsqueda de chats usa las conversaciones sin leer que WhatsApp Web muestra en cada cuenta. Si un chat no tiene mensajes pendientes, puede que no aparezca hasta que llegue actividad nueva.",
  },
  {
    id: "chat-numero",
    title: "Escribir a alguien por número",
    steps: [
      "Pulsa Ctrl+M o busca «teléfono» en la paleta (Ctrl+K).",
      "Escribe el número con prefijo internacional, por ejemplo +34612345678.",
      "Pulsa Aceptar. Se abrirá la conversación en la cuenta que tengas activa.",
    ],
    note: "El número debe incluir el código del país (el + y los dígitos correspondientes).",
  },
  {
    id: "enlaces",
    title: "Abrir enlaces de WhatsApp desde internet",
    paragraphs: [
      "Si alguien te envía un enlace tipo wa.me o abres un enlace whatsapp:// desde otra aplicación, Catrip Connect puede abrir el chat directamente.",
    ],
    bullets: [
      "Tras instalar la aplicación, en Ajustes → General puedes registrar Catrip Connect como programa predeterminado para enlaces WhatsApp.",
      "En «Enlaces WhatsApp entrantes» eliges qué cuenta usar: preguntar si hay varias, siempre la cuenta activa o una cuenta fija.",
      "Si el enlace trae un mensaje precargado, aparecerá listo para enviar en el chat.",
      "Las invitaciones a grupos (chat.whatsapp.com) también se pueden abrir en la app.",
    ],
    note: "Si el navegador dice que no hay aplicación disponible, usa el botón «Registrar como app predeterminada» en Ajustes → General.",
  },
  {
    id: "ajustes-general",
    title: "Ajustes — General",
    paragraphs: [
      "Abre Ajustes con Ctrl+P o desde el menú Archivo. La sección General controla el comportamiento diario de la aplicación.",
    ],
    bullets: [
      "Iniciar minimizada: la app arranca en la bandeja sin mostrar ventana.",
      "Mostrar barra lateral: oculta o muestra la columna de cuentas (necesaria para ⚡, ✉ y ▤).",
      "Mostrar barra de menú: la franja Archivo / Ver / Chat arriba.",
      "Al cerrar, minimizar a la bandeja: al pulsar la X, la app sigue en segundo plano (recomendado).",
      "Iniciar automáticamente con el sistema: abre Catrip Connect al encender el ordenador.",
      "Carpeta de descargas: dónde se guardan archivos que recibes por WhatsApp.",
      "Escala de interfaz: agranda o reduce textos e iconos (100 % a 200 %).",
      "Buscar actualizaciones al iniciar: avisa cuando hay una versión nueva.",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "Ajustes — Cuentas",
    bullets: [
      "Renombrar: cambia el nombre visible de la cuenta (solo en Catrip Connect, no en WhatsApp).",
      "Regenerar icono o elegir variante de color: personaliza el avatar de la barra lateral.",
      "Notificaciones por cuenta: activa o silencia avisos de una cuenta concreta.",
      "Eliminar cuenta: quita la sesión de la app (no borra WhatsApp del móvil).",
    ],
    note: "Eliminar una cuenta en Catrip Connect no cierra tu WhatsApp en el teléfono; solo deja de mostrarla en el programa.",
  },
  {
    id: "ajustes-notificaciones",
    title: "Ajustes — Notificaciones",
    bullets: [
      "Notificaciones del sistema: avisos en el escritorio cuando llegan mensajes.",
      "Mostrar nombre de la cuenta: en el aviso verás si es «Trabajo», «Personal», etc.",
      "Mostrar detalle (preview): una línea del mensaje en el aviso.",
      "No molestar: sin avisos emergentes (el contador en la bandeja sigue funcionando).",
      "Sonido del sistema: pitido al recibir un aviso.",
    ],
    note: "Al hacer clic en una notificación, la ventana se abre y se selecciona la cuenta que recibió el mensaje. Puedes usar después ⚡ para ver qué más queda pendiente.",
  },
  {
    id: "ajustes-red",
    title: "Ajustes — Red",
    paragraphs: [
      "Solo necesitas esta sección si tu conexión pasa por un proxy (red de empresa, VPN especial, etc.). Activa «Proxy de red» e introduce las reglas que te haya dado tu administrador.",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "Ajustes — Rendimiento",
    paragraphs: [
      "Esta sección ayuda a equilibrar fluidez, consumo de memoria y estabilidad cuando usas varias cuentas a la vez.",
    ],
    bullets: [
      "Suspender cuentas inactivas: libera RAM cerrando la vista de WhatsApp de las cuentas que no selecciones durante un rato. La sesión permanece en el disco.",
      "Suspender tras (minutos): cuánto tiempo debe pasar sin usar una cuenta antes de que entre en reposo (5 a 60 minutos).",
      "Refuerzo GPU: mejora la fluidez de vídeos en algunos equipos Linux. Requiere reiniciar la app.",
      "Límite de procesos del renderer: útil si usas muchas cuentas y el ordenador va justo de memoria. Requiere reiniciar.",
      "Evitar suspensión durante videollamada: el equipo no se duerme mientras hay una llamada activa en WhatsApp Web (bloqueo de energía del sistema).",
      "Limpiar caché: si WhatsApp va lento o fallan archivos, prueba vaciar la caché (no cierra sesión).",
    ],
    note: "La suspensión de cuentas y el límite de procesos atacan el mismo problema (memoria) desde ángulos distintos: la primera cierra vistas que no usas; el segundo limita cuántos procesos Chromium puede abrir en total.",
  },
  {
    id: "bandeja",
    title: "Icono en la bandeja del sistema",
    paragraphs: [
      "Junto al reloj del escritorio (Linux) aparece el icono de Catrip Connect. Desde ahí puedes restaurar la ventana o salir por completo.",
    ],
    bullets: [
      "Clic en el icono: muestra u oculta la ventana principal.",
      "Menú contextual: lista tus cuentas con estado y mensajes sin leer; también permite salir.",
      "Contador en el icono: muestra cuántos mensajes sin leer hay en total (si está activado en Ajustes).",
      "Al restaurar desde la bandeja, la ventana vuelve al mismo tamaño y posición que tenía antes.",
    ],
  },
  {
    id: "actualizaciones",
    title: "Actualizar la aplicación",
    paragraphs: [
      "Con «Buscar actualizaciones al iniciar» activo, Catrip Connect comprueba si hay versiones nuevas en internet.",
    ],
    bullets: [
      "Si instalaste el paquete .deb: la app te muestra las novedades y puedes descargar el instalador a una carpeta que elijas, o abrir el enlace en el navegador. Tú decides cuándo instalar.",
      "Si usas AppImage: la descarga puede hacerse sola; cuando esté lista, pulsa «Reiniciar ahora».",
      "El panel de actualización tiene scroll para leer todas las novedades sin agrandar la ventana.",
    ],
  },
  {
    id: "atajos",
    title: "Atajos de teclado",
    table: {
      headers: ["Atajo", "Qué hace"],
      rows: [
        ["Ctrl+K", "Abrir buscador (chats sin leer, cuentas y acciones)"],
        ["Ctrl+P", "Abrir Ajustes"],
        ["Ctrl+1 … Ctrl+9", "Ir a la cuenta 1, 2, 3… (hasta 9)"],
        ["Ctrl+N", "Nuevo chat en WhatsApp Web"],
        ["Ctrl+M", "Chat por número de teléfono"],
        ["Ctrl+U", "Nueva cuenta"],
        ["Ctrl+Shift+A", "Abrir o cerrar «Ahora mismo» (top 3 urgentes)"],
        ["Ctrl+Shift+Z", "Activar o desactivar modo Zen"],
        ["Escape", "Cerrar «Ahora mismo», salir del modo Zen o cerrar paleta"],
        ["Ctrl+W", "Ocultar ventana"],
        ["Ctrl+Q", "Salir de la aplicación"],
        ["F5", "Recargar WhatsApp Web"],
        ["F11", "Pantalla completa"],
      ],
    },
    note: "También puedes ver una lista rápida en Ayuda → Atajos de teclado y el manual completo en Ayuda → Manual de usuario.",
  },
  {
    id: "problemas",
    title: "Consejos y problemas frecuentes",
    bullets: [
      "WhatsApp no carga o sale en negro: menú Chat → Recargar (F5). Si persiste, en Ajustes → Rendimiento prueba activar o desactivar «Refuerzo GPU» y reinicia.",
      "No aparece el código QR: comprueba tu internet y recarga con F5.",
      "No llegan notificaciones: revisa Ajustes → Notificaciones y que el sistema permita avisos para Catrip Connect.",
      "«Ahora mismo» está vacío pero sé que hay mensajes: espera unos segundos o abre ✉ Acciones pendientes; WhatsApp Web debe detectar los no leídos primero.",
      "Un avatar se ve apagado («en reposo»): es normal si no usas esa cuenta hace un rato. Haz clic para reactivarla; también puedes desactivar la suspensión en Ajustes → Rendimiento.",
      "No recibo avisos de una cuenta en reposo: mientras duerme, esa cuenta no comprueba mensajes nuevos. Ábrela o reduce el tiempo de suspensión si necesitas avisos más frecuentes.",
      "No veo el botón ⚡: activa «Mostrar barra lateral» en Ajustes y sal del modo Zen.",
      "No se ven los iconos de la bandeja: en algunas distribuciones Linux hace falta instalar soporte para iconos de bandeja (AppIndicator).",
      "Enlace wa.me no abre la app: registra Catrip Connect en Ajustes → General y cierra el navegador antes de probar de nuevo.",
      "Varias cuentas van lentas: activa «Suspender cuentas inactivas», reduce el límite de procesos o usa menos cuentas activas a la vez.",
    ],
    note: "Mantener la aplicación actualizada suele resolver fallos de compatibilidad con WhatsApp Web.",
  },
  {
    id: "ayuda",
    title: "Más ayuda",
    paragraphs: [
      "Desde el menú Ayuda puedes abrir este manual de usuario, la lista de atajos de teclado y la ventana «Acerca de» con la versión instalada.",
      "Catrip Connect usa WhatsApp Web oficial dentro del programa: todo lo que funciona en web.whatsapp.com (chats, archivos, estados según soporte) funciona igual aquí.",
    ],
    bullets: [
      "Manual de usuario: guía completa con índice (esta ventana).",
      "Atajos de teclado: referencia rápida.",
      "Acerca de: número de versión instalada.",
    ],
  },
];

function applyManualPatches(sections, locale) {
  return applyManualVideollamadasPatch(applyManualIdiomaPatch(sections, locale), locale);
}

const MANUALS = {
  es: () => buildManual(INTROS.es, applyManualPatches(manualEs, "es")),
  en: () => buildManual(INTROS.en, applyManualPatches(manualEn, "en")),
  pt: () => buildManual(INTROS.pt, applyManualPatches(manualPt, "pt")),
  fr: () => buildManual(INTROS.fr, applyManualPatches(manualFr, "fr")),
  de: () => buildManual(INTROS.de, applyManualPatches(manualDe, "de")),
  ko: () => buildManual(INTROS.ko, applyManualPatches(manualKo, "ko")),
  ja: () => buildManual(INTROS.ja, applyManualPatches(manualJa, "ja")),
  it: () => buildManual(INTROS.it, applyManualPatches(manualIt, "it")),
  zh: () => buildManual(INTROS.zh, applyManualPatches(manualZh, "zh")),
};

for (const lang of LANGS) {
  const dir = path.join(localesDir, lang);
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, "manual.json");
  const manual = MANUALS[lang]();
  fs.writeFileSync(outPath, `${JSON.stringify(manual, null, 2)}\n`, "utf8");
  const lines = fs.readFileSync(outPath, "utf8").split("\n").length;
  console.log(`Wrote ${outPath} (${lines} lines)`);
}
