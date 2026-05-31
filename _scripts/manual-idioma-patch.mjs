/**
 * Parches del manual para documentar la selección de idioma (i18n).
 * Se inserta la sección `idioma` tras `ajustes-general` y se actualizan secciones relacionadas.
 */

const SUPPORTED_LIST = {
  es: "Español, English, Português, Français, Deutsch, 한국어, 日本語, Italiano o 简体中文",
  en: "Spanish, English, Portuguese, French, German, Korean, Japanese, Italian, or Simplified Chinese",
  pt: "Espanhol, English, Português, Français, Deutsch, 한국어, 日本語, Italiano ou 简体中文",
  fr: "Espagnol, English, Português, Français, Deutsch, 한국어, 日本語, Italiano ou 简体中文",
  de: "Spanisch, English, Português, Français, Deutsch, 한국어, 日本語, Italiano oder 简体中文",
  ko: "스페인어, English, Português, Français, Deutsch, 한국어, 日本語, Italiano, 简体中文",
  ja: "スペイン語、English、Português、Français、Deutsch、한국어、日本語、Italiano、简体中文",
  it: "Spagnolo, English, Português, Français, Deutsch, 한국어, 日本語, Italiano o 简体中文",
  zh: "西班牙语、English、Português、Français、Deutsch、한국어、日本語、Italiano、简体中文",
};

/** @type {Record<string, object>} */
export const IDIOMA_SECTIONS = {
  es: {
    id: "idioma",
    title: "Idioma de la interfaz",
    paragraphs: [
      "Catrip Connect está disponible en varios idiomas. Puedes cambiar el idioma de menús, ventanas, manual de usuario, notificaciones del sistema e icono de bandeja sin reiniciar la aplicación.",
    ],
    steps: [
      "Abre Ajustes con Ctrl+P, el botón de engranaje del rail lateral o el menú Archivo → Ajustes.",
      "En el panel izquierdo elige General.",
      "Arriba del todo verás «Idioma de la interfaz». Abre el desplegable.",
      `Elige un idioma concreto (${SUPPORTED_LIST.es}) o «Idioma del sistema» para seguir el idioma del ordenador.`,
      "El cambio se aplica al instante y se guarda automáticamente para futuros arranques.",
    ],
    bullets: [
      "Qué cambia: menús superiores (Archivo, Ver, Chat…), barra lateral, modales, paleta Ctrl+K, pantalla de Ajustes, este manual (Ayuda → Manual de usuario), notificaciones nativas y menú del icono en la bandeja.",
      "Qué no cambia: WhatsApp Web dentro de la ventana usa su propio idioma (el de tu móvil o el configurado en web.whatsapp.com), independiente de Catrip Connect.",
      "Si tienes el manual abierto y cambias el idioma, el texto se actualiza al momento.",
      "Con «Idioma del sistema», la app detecta el locale del SO; si no está soportado, usa inglés por defecto.",
    ],
    note: "En la paleta de comandos (Ctrl+K) puedes escribir «idioma», «language» o «ajustes» para ir a General.",
  },
  en: {
    id: "idioma",
    title: "Interface language",
    paragraphs: [
      "Catrip Connect is available in several languages. You can change the language of menus, windows, this user manual, system notifications, and the tray icon without restarting the app.",
    ],
    steps: [
      "Open Settings with Ctrl+P, the gear button on the sidebar rail, or File → Settings.",
      "In the left panel choose General.",
      "At the top you will see Interface language. Open the dropdown.",
      `Pick a specific language (${SUPPORTED_LIST.en}) or System language to follow your computer locale.`,
      "The change applies instantly and is saved automatically for future launches.",
    ],
    bullets: [
      "What changes: top menus (File, View, Chat…), sidebar rail, modals, Ctrl+K palette, Settings screen, this manual (Help → User manual), native notifications, and the tray icon menu.",
      "What does not change: WhatsApp Web inside the window uses its own language (from your phone or web.whatsapp.com settings), independent of Catrip Connect.",
      "If the manual is open when you switch language, the text updates immediately.",
      "With System language, the app reads the OS locale; if unsupported, English is used by default.",
    ],
    note: "In the command palette (Ctrl+K) you can type language or settings to jump to General.",
  },
  pt: {
    id: "idioma",
    title: "Idioma da interface",
    paragraphs: [
      "O Catrip Connect está disponível em vários idiomas. Pode mudar o idioma dos menus, janelas, manual de utilizador, notificações do sistema e ícone da bandeja sem reiniciar a aplicação.",
    ],
    steps: [
      "Abra Definições com Ctrl+P, o botão de engrenagem no rail lateral ou o menu Ficheiro → Definições.",
      "No painel esquerdo escolha Geral.",
      "No topo verá Idioma da interface. Abra a lista.",
      `Escolha um idioma (${SUPPORTED_LIST.pt}) ou Idioma do sistema para seguir o idioma do computador.`,
      "A alteração aplica-se de imediato e guarda-se automaticamente para arranques futuros.",
    ],
    bullets: [
      "O que muda: menus superiores, rail lateral, modais, paleta Ctrl+K, ecrã de Definições, este manual (Ajuda → Manual de utilizador), notificações nativas e menu do ícone na bandeja.",
      "O que não muda: o WhatsApp Web na janela usa o seu próprio idioma, independente do Catrip Connect.",
      "Se o manual estiver aberto ao mudar o idioma, o texto atualiza na hora.",
      "Com Idioma do sistema, a app deteta o locale do SO; se não for suportado, usa inglês por defeito.",
    ],
    note: "Na paleta de comandos (Ctrl+K) pode escrever idioma, language ou definições para ir a Geral.",
  },
  fr: {
    id: "idioma",
    title: "Langue de l'interface",
    paragraphs: [
      "Catrip Connect est disponible en plusieurs langues. Vous pouvez changer la langue des menus, fenêtres, manuel utilisateur, notifications système et icône de la barre des tâches sans redémarrer l'application.",
    ],
    steps: [
      "Ouvrez Paramètres avec Ctrl+P, le bouton engrenage du rail latéral ou le menu Fichier → Paramètres.",
      "Dans le panneau de gauche choisissez Général.",
      "En haut vous verrez Langue de l'interface. Ouvrez la liste.",
      `Choisissez une langue (${SUPPORTED_LIST.fr}) ou Langue du système pour suivre celle de l'ordinateur.`,
      "Le changement est immédiat et enregistré automatiquement pour les prochains lancements.",
    ],
    bullets: [
      "Ce qui change : menus supérieurs, rail latéral, modales, palette Ctrl+K, écran Paramètres, ce manuel (Aide → Manuel utilisateur), notifications natives et menu de l'icône dans la barre.",
      "Ce qui ne change pas : WhatsApp Web dans la fenêtre garde sa propre langue, indépendamment de Catrip Connect.",
      "Si le manuel est ouvert lors du changement, le texte se met à jour aussitôt.",
      "Avec Langue du système, l'app lit le locale du SO ; si non pris en charge, l'anglais est utilisé par défaut.",
    ],
    note: "Dans la palette de commandes (Ctrl+K), tapez langue, language ou paramètres pour aller à Général.",
  },
  de: {
    id: "idioma",
    title: "Oberflächensprache",
    paragraphs: [
      "Catrip Connect ist in mehreren Sprachen verfügbar. Sie können Menüs, Fenster, Benutzerhandbuch, Systembenachrichtigungen und Tray-Symbolmenü ändern, ohne die App neu zu starten.",
    ],
    steps: [
      "Öffnen Sie Einstellungen mit Ctrl+P, der Zahnrad-Schaltfläche am Rail oder Datei → Einstellungen.",
      "Wählen Sie im linken Panel Allgemein.",
      "Oben sehen Sie Oberflächensprache. Öffnen Sie die Auswahlliste.",
      `Wählen Sie eine Sprache (${SUPPORTED_LIST.de}) oder Systemsprache für die Sprache des Computers.`,
      "Die Änderung gilt sofort und wird für künftige Starts automatisch gespeichert.",
    ],
    bullets: [
      "Was sich ändert: obere Menüs, Sidebar-Rail, Modale, Ctrl+K-Palette, Einstellungsbildschirm, dieses Handbuch (Hilfe → Benutzerhandbuch), native Benachrichtigungen und Tray-Menü.",
      "Was sich nicht ändert: WhatsApp Web im Fenster behält seine eigene Sprache, unabhängig von Catrip Connect.",
      "Ist das Handbuch geöffnet, aktualisiert sich der Text sofort beim Sprachwechsel.",
      "Bei Systemsprache liest die App das OS-Locale; wenn nicht unterstützt, wird Englisch als Standard verwendet.",
    ],
    note: "In der Befehlspalette (Ctrl+K) können Sie Sprache, language oder Einstellungen eingeben, um zu Allgemein zu springen.",
  },
  ko: {
    id: "idioma",
    title: "인터페이스 언어",
    paragraphs: [
      "Catrip Connect는 여러 언어를 지원합니다. 앱을 재시작하지 않고도 메뉴, 창, 사용자 매뉴얼, 시스템 알림, 트레이 아이콘 메뉴의 언어를 변경할 수 있습니다.",
    ],
    steps: [
      "Ctrl+P, 사이드바 레일의 설정(톱니) 버튼 또는 파일 → 설정으로 설정을 엽니다.",
      "왼쪽 패널에서 일반을 선택합니다.",
      "맨 위에 인터페이스 언어가 있습니다. 드롭다운을 엽니다.",
      `구체적인 언어(${SUPPORTED_LIST.ko}) 또는 시스템 언어를 선택합니다.`,
      "변경은 즉시 적용되며 이후 실행을 위해 자동 저장됩니다.",
    ],
    bullets: [
      "변경되는 것: 상단 메뉴, 사이드바 레일, 모달, Ctrl+K 팔레트, 설정 화면, 이 매뉴얼(도움말 → 사용자 매뉴얼), 네이티브 알림, 트레이 메뉴.",
      "변경되지 않는 것: 창 안의 WhatsApp Web은 Catrip Connect와 별개로 자체 언어를 사용합니다.",
      "매뉴얼을 연 상태에서 언어를 바꾸면 텍스트가 바로 갱신됩니다.",
      "시스템 언어 선택 시 OS 로케일을 읽으며, 미지원이면 기본값은 영어입니다.",
    ],
    note: "명령 팔레트(Ctrl+K)에서 language, idioma, settings 등을 검색해 일반으로 이동할 수 있습니다.",
  },
  ja: {
    id: "idioma",
    title: "インターフェース言語",
    paragraphs: [
      "Catrip Connect は複数言語に対応しています。アプリを再起動せずに、メニュー、ウィンドウ、ユーザーマニュアル、システム通知、トレイアイコンメニューの言語を変更できます。",
    ],
    steps: [
      "Ctrl+P、サイドバーレールの設定（歯車）ボタン、またはファイル → 設定で設定を開きます。",
      "左パネルで一般を選びます。",
      "一番上にインターフェース言語があります。ドロップダウンを開きます。",
      `言語（${SUPPORTED_LIST.ja}）またはシステム言語を選びます。`,
      "変更はすぐ反映され、次回以降の起動のために自動保存されます。",
    ],
    bullets: [
      "変わるもの：上部メニュー、サイドバーレール、モーダル、Ctrl+K パレット、設定画面、このマニュアル（ヘルプ → ユーザーマニュアル）、ネイティブ通知、トレイメニュー。",
      "変わらないもの：ウィンドウ内の WhatsApp Web は Catrip Connect とは別の言語設定を使います。",
      "マニュアルを開いたまま言語を変えると、テキストは即座に更新されます。",
      "システム言語では OS のロケールを読み取り、未対応の場合は既定で英語になります。",
    ],
    note: "コマンドパレット（Ctrl+K）で language、idioma、settings などと入力すると一般に移動できます。",
  },
  it: {
    id: "idioma",
    title: "Lingua dell'interfaccia",
    paragraphs: [
      "Catrip Connect è disponibile in più lingue. Puoi cambiare la lingua di menu, finestre, manuale utente, notifiche di sistema e menu dell'icona nella tray senza riavviare l'app.",
    ],
    steps: [
      "Apri Impostazioni con Ctrl+P, il pulsante ingranaggio del rail laterale o menu File → Impostazioni.",
      "Nel pannello sinistro scegli Generale.",
      "In alto vedrai Lingua dell'interfaccia. Apri elenco a discesa.",
      `Scegli una lingua (${SUPPORTED_LIST.it}) o Lingua di sistema per seguire quella del computer.`,
      "La modifica è immediata e viene salvata automaticamente per i prossimi avvii.",
    ],
    bullets: [
      "Cosa cambia: menu superiori, rail laterale, modali, palette Ctrl+K, schermata Impostazioni, questo manuale (Aiuto → Manuale utente), notifiche native e menu tray.",
      "Cosa non cambia: WhatsApp Web nella finestra usa la propria lingua, indipendentemente da Catrip Connect.",
      "Se il manuale è aperto, il testo si aggiorna subito al cambio lingua.",
      "Con Lingua di sistema l'app legge il locale del SO; se non supportato, usa l'inglese per impostazione predefinita.",
    ],
    note: "Nella palette comandi (Ctrl+K) puoi digitare lingua, language o impostazioni per andare a Generale.",
  },
  zh: {
    id: "idioma",
    title: "界面语言",
    paragraphs: [
      "Catrip Connect 支持多种语言。无需重启应用即可更改菜单、窗口、用户手册、系统通知和托盘图标菜单的语言。",
    ],
    steps: [
      "通过 Ctrl+P、侧边栏齿轮按钮或文件 → 设置打开设置。",
      "在左侧面板选择常规。",
      "顶部有界面语言，打开下拉列表。",
      `选择具体语言（${SUPPORTED_LIST.zh}）或系统语言以跟随计算机语言。`,
      "更改立即生效，并自动保存供下次启动使用。",
    ],
    bullets: [
      "会更新的内容：顶部菜单、侧边栏、模态框、Ctrl+K 命令面板、设置界面、本手册（帮助 → 用户手册）、原生通知和托盘菜单。",
      "不会更改的内容：窗口内的 WhatsApp Web 使用自己的语言，与 Catrip Connect 无关。",
      "若手册已打开，切换语言后文本会立即更新。",
      "选择系统语言时，应用读取操作系统区域；若不受支持，默认使用英语。",
    ],
    note: "在命令面板（Ctrl+K）中可搜索 language、idioma 或 settings 快速进入常规设置。",
  },
};

/** @type {Record<string, { bienvenidaExtra: string; ajustesBullet: string; paletaBullet: string; ayudaBullet: string; problemaBullet: string }>} */
const PATCHES = {
  es: {
    bienvenidaExtra:
      " También puedes cambiar el idioma de toda la interfaz (menús, manual y notificaciones) desde Ajustes → General",
    ajustesBullet:
      "Idioma de la interfaz: español, inglés, portugués, francés, alemán, coreano, japonés, italiano, chino simplificado o idioma del sistema (consulta la sección «Idioma de la interfaz» en este manual).",
    paletaBullet:
      "Para cambiar el idioma escribe «idioma», «language» o «ajustes» y elige Abrir Ajustes → General.",
    ayudaBullet:
      "Manual de usuario: guía completa con índice en el idioma que hayas elegido (incluye esta sección sobre idiomas).",
    problemaBullet:
      "La interfaz está en un idioma pero WhatsApp en otro: es normal. Catrip Connect y WhatsApp Web tienen idiomas independientes; cambia el de Catrip en Ajustes → General → Idioma de la interfaz.",
  },
  en: {
    bienvenidaExtra:
      " You can also change the entire interface language (menus, manual, and notifications) from Settings → General",
    ajustesBullet:
      "Interface language: Spanish, English, Portuguese, French, German, Korean, Japanese, Italian, Simplified Chinese, or system language (see the Interface language section in this manual).",
    paletaBullet:
      "To change language type language, idioma, or settings and pick Open Settings → General.",
    ayudaBullet:
      "User manual: full indexed guide in your chosen language (including this languages section).",
    problemaBullet:
      "The interface is in one language but WhatsApp in another: that is normal. Catrip Connect and WhatsApp Web use separate language settings; change Catrip under Settings → General → Interface language.",
  },
  pt: {
    bienvenidaExtra:
      " Também pode mudar o idioma de toda a interface (menus, manual e notificações) em Definições → Geral",
    ajustesBullet:
      "Idioma da interface: espanhol, inglês, português, francês, alemão, coreano, japonês, italiano, chinês simplificado ou idioma do sistema (ver secção Idioma da interface neste manual).",
    paletaBullet:
      "Para mudar o idioma escreva idioma, language ou definições e escolha Abrir Definições → Geral.",
    ayudaBullet:
      "Manual de utilizador: guia completa com índice no idioma escolhido (inclui esta secção sobre idiomas).",
    problemaBullet:
      "A interface está num idioma e o WhatsApp noutro: é normal. Catrip Connect e WhatsApp Web têm idiomas independentes; mude o do Catrip em Definições → Geral → Idioma da interface.",
  },
  fr: {
    bienvenidaExtra:
      " Vous pouvez aussi changer la langue de toute l'interface (menus, manuel et notifications) dans Paramètres → Général",
    ajustesBullet:
      "Langue de l'interface : espagnol, anglais, portugais, français, allemand, coréen, japonais, italien, chinois simplifié ou langue du système (voir la section Langue de l'interface dans ce manuel).",
    paletaBullet:
      "Pour changer la langue, tapez langue, language ou paramètres et choisissez Ouvrir Paramètres → Général.",
    ayudaBullet:
      "Manuel utilisateur : guide complet indexé dans la langue choisie (y compris cette section sur les langues).",
    problemaBullet:
      "L'interface est dans une langue et WhatsApp dans une autre : c'est normal. Catrip Connect et WhatsApp Web ont des langues indépendantes ; changez celle de Catrip dans Paramètres → Général → Langue de l'interface.",
  },
  de: {
    bienvenidaExtra:
      " Sie können auch die Sprache der gesamten Oberfläche (Menüs, Handbuch und Benachrichtigungen) unter Einstellungen → Allgemein ändern",
    ajustesBullet:
      "Oberflächensprache: Spanisch, Englisch, Portugiesisch, Französisch, Deutsch, Koreanisch, Japanisch, Italienisch, Vereinfachtes Chinesisch oder Systemsprache (siehe Abschnitt Oberflächensprache in diesem Handbuch).",
    paletaBullet:
      "Zum Sprachwechsel Sprache, language oder Einstellungen eingeben und Einstellungen → Allgemein öffnen.",
    ayudaBullet:
      "Benutzerhandbuch: vollständiger indexierter Leitfaden in der gewählten Sprache (einschließlich dieses Sprachabschnitts).",
    problemaBullet:
      "Oberfläche in einer Sprache, WhatsApp in einer anderen: normal. Catrip Connect und WhatsApp Web haben getrennte Spracheinstellungen; Catrip unter Einstellungen → Allgemein → Oberflächensprache ändern.",
  },
  ko: {
    bienvenidaExtra:
      " 설정 → 일반에서 전체 인터페이스 언어(메뉴, 매뉴얼, 알림)도 변경할 수 있습니다",
    ajustesBullet:
      "인터페이스 언어: 스페인어, 영어, 포르투갈어, 프랑스어, 독일어, 한국어, 일본어, 이탈리아어, 중국어 간체 또는 시스템 언어(이 매뉴얼의 인터페이스 언어 섹션 참고).",
    paletaBullet:
      "언어 변경: Ctrl+K에서 language, idioma 또는 settings를 검색해 설정 → 일반으로 이동.",
    ayudaBullet:
      "사용자 매뉴얼: 선택한 언어로 된 전체 색인 가이드(언어 섹션 포함).",
    problemaBullet:
      "인터페이스와 WhatsApp 언어가 다름: 정상입니다. Catrip Connect와 WhatsApp Web은 별도 언어 설정을 사용합니다. 설정 → 일반 → 인터페이스 언어에서 변경하세요.",
  },
  ja: {
    bienvenidaExtra:
      " 設定 → 一般からインターフェース全体の言語（メニュー、マニュアル、通知）も変更できます",
    ajustesBullet:
      "インターフェース言語：スペイン語、英語、ポルトガル語、フランス語、ドイツ語、韓国語、日本語、イタリア語、簡体字中国語、またはシステム言語（本マニュアルのインターフェース言語の章を参照）。",
    paletaBullet:
      "言語変更：Ctrl+K で language、idioma、settings と入力し、設定 → 一般を開く。",
    ayudaBullet:
      "ユーザーマニュアル：選択した言語の完全な索引付きガイド（言語の章を含む）。",
    problemaBullet:
      "インターフェースと WhatsApp の言語が異なる：正常です。Catrip Connect と WhatsApp Web は別の言語設定です。設定 → 一般 → インターフェース言語で変更してください。",
  },
  it: {
    bienvenidaExtra:
      " Puoi anche cambiare la lingua dell'intera interfaccia (menu, manuale e notifiche) da Impostazioni → Generale",
    ajustesBullet:
      "Lingua dell'interfaccia: spagnolo, inglese, portoghese, francese, tedesco, coreano, giapponese, italiano, cinese semplificato o lingua di sistema (vedi sezione Lingua dell'interfaccia in questo manuale).",
    paletaBullet:
      "Per cambiare lingua digita lingua, language o impostazioni e apri Impostazioni → Generale.",
    ayudaBullet:
      "Manuale utente: guida completa indicizzata nella lingua scelta (include questa sezione sulle lingue).",
    problemaBullet:
      "Interfaccia in una lingua e WhatsApp in un'altra: è normale. Catrip Connect e WhatsApp Web hanno lingue indipendenti; cambia quella di Catrip in Impostazioni → Generale → Lingua dell'interfaccia.",
  },
  zh: {
    bienvenidaExtra: "，还可在设置 → 常规中更改整个界面语言（菜单、手册和通知）",
    ajustesBullet:
      "界面语言：西班牙语、英语、葡萄牙语、法语、德语、韩语、日语、意大利语、简体中文或系统语言（见本手册的界面语言章节）。",
    paletaBullet: "更改语言：在 Ctrl+K 中搜索 language、idioma 或 settings，打开设置 → 常规。",
    ayudaBullet: "用户手册：以所选语言显示的完整索引指南（含语言章节）。",
    problemaBullet:
      "界面与 WhatsApp 语言不同：属正常现象。Catrip Connect 与 WhatsApp Web 语言独立；请在设置 → 常规 → 界面语言中更改 Catrip。",
  },
};

/**
 * @param {object[]} sections
 * @param {string} locale
 * @returns {object[]}
 */
export function applyManualIdiomaPatch(sections, locale) {
  const patch = PATCHES[locale] ?? PATCHES.en;
  const idioma = IDIOMA_SECTIONS[locale] ?? IDIOMA_SECTIONS.en;

  const out = sections.map((section) => {
    if (section.id === "bienvenida" && section.paragraphs?.[1]) {
      const p1 = section.paragraphs[1];
      if (!/idioma|language|langue|sprache|言語|语言|lingua|interface/i.test(p1)) {
        return {
          ...section,
          paragraphs: [
            section.paragraphs[0],
            `${p1}${patch.bienvenidaExtra}.`,
          ],
        };
      }
    }
    if (section.id === "ajustes-general" && section.bullets) {
      const hasLang = section.bullets.some((b) =>
        /idioma|language|langue|sprache|言語|语言|lingua|interface/i.test(b),
      );
      return {
        ...section,
        bullets: hasLang ? section.bullets : [patch.ajustesBullet, ...section.bullets],
      };
    }
    if (section.id === "paleta" && section.bullets) {
      const hasLang = section.bullets.some((b) => /idioma|language|langue/i.test(b));
      return {
        ...section,
        bullets: hasLang ? section.bullets : [...section.bullets, patch.paletaBullet],
      };
    }
    if (section.id === "ayuda" && section.bullets) {
      return {
        ...section,
        bullets: section.bullets.map((b, i) => (i === 0 ? patch.ayudaBullet : b)),
      };
    }
    if (section.id === "problemas" && section.bullets) {
      const hasLang = section.bullets.some((b) => /WhatsApp.*idioma|language.*WhatsApp/i.test(b));
      return {
        ...section,
        bullets: hasLang ? section.bullets : [...section.bullets, patch.problemaBullet],
      };
    }
    return section;
  });

  if (out.some((s) => s.id === "idioma")) return out;

  const idx = out.findIndex((s) => s.id === "ajustes-general");
  if (idx >= 0) {
    out.splice(idx + 1, 0, idioma);
  } else {
    out.push(idioma);
  }

  return out;
}
