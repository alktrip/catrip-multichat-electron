/**
 * Manual section content for non-Spanish locales.
 * Same section ids and structure as manualEs in build-manual-locale-files.mjs.
 */

export const manualEn = [
  {
    id: "bienvenida",
    title: "What is Catrip Connect?",
    paragraphs: [
      "Catrip Connect is a desktop app that lets you use WhatsApp Web with one or several accounts at once. Each account is independent: messages, contacts, and files from one do not mix with another.",
      "The main screen shows WhatsApp as you know it in the browser, with extra tools: switch accounts with one click, save memory by suspending accounts you are not using, a quick glance at what is most urgent (Right now), see all unread messages, search chats from Ctrl+K, get desktop notifications, and much more.",
    ],
  },
  {
    id: "primeros-pasos",
    title: "Getting started",
    steps: [
      "Open Catrip Connect from your system application menu (search for Catrip Connect).",
      "On first launch, click the button to create your first account. Give it a name you will recognize, for example Personal or Work.",
      "The WhatsApp Web QR code will appear. On your phone open WhatsApp → Linked devices → Link a device and scan the code.",
      "When the connection is ready, you will see your chats in the large area of the window.",
      "To add another account, use the New account button in the sidebar rail or the Accounts menu.",
    ],
    note: "If the QR code expires, reload the view with F5 or Chat → Reload.",
  },
  {
    id: "ventana",
    title: "How the window is organized",
    paragraphs: [
      "The window has two main areas. On the left is the sidebar rail: account icons and quick actions. On the right, the large area is WhatsApp Web for the account you have selected.",
      "At the top you will find the menu bar (File, View, Chat, Accounts, Help) if you enabled it in Settings. From there you can do almost everything described in this manual.",
    ],
    bullets: [
      "Top of the rail: your account avatars (click to switch, drag to reorder).",
      "Bottom of the rail: action buttons — new account, chat by number, new chat, ⚡ Right now, ✉ pending, ▤ activity, settings, and Zen mode.",
      "Center area: chats, calls, and files from WhatsApp Web.",
      "Top menu: organized shortcuts (includes View → Right now).",
    ],
  },
  {
    id: "cuentas",
    title: "Working with multiple accounts",
    paragraphs: [
      "You can have several WhatsApp accounts in the same app. Each one has its own colored icon in the sidebar rail.",
    ],
    bullets: [
      "Click an icon to switch to that account.",
      "Drag an icon up or down to change the list order.",
      "A green dot or number on the icon shows unread messages on that account.",
      "If an account has not been used for a while, it may go idle: the avatar looks dimmer and the tooltip says so. The session stays saved; one click wakes it instantly.",
      "Hover over an icon to see whether it is connected, idle, waiting for QR, or offline.",
      "Quick shortcut: Ctrl+1 opens the first account, Ctrl+2 the second, up to Ctrl+9.",
    ],
    note: "In Settings → Accounts you can rename each account, change the icon color, or remove it. In Settings → Performance you configure when inactive accounts go idle.",
  },
  {
    id: "reposo-cuentas",
    title: "Idle accounts (memory savings)",
    paragraphs: [
      "With several accounts open, each one uses memory and CPU while keeping WhatsApp Web loaded. Catrip Connect can put unused accounts to sleep: it closes the internal WhatsApp view but keeps your session (cookies and login) on disk.",
      "The app stays lighter with three, four, or more accounts without signing out or scanning the QR again each time.",
    ],
    steps: [
      "Use an account normally; when you switch to another, the previous one starts counting idle time.",
      "After the configured threshold (15 minutes by default), the account goes idle: its avatar on the rail looks faded.",
      "To wake it, click its avatar, pick a chat from ✉ pending, Ctrl+K, or open a wa.me link aimed at that account.",
      "WhatsApp Web reloads in a few seconds with the same session; no need to scan the QR again.",
    ],
    bullets: [
      "Enabled by default in Settings → Performance → Suspend inactive accounts.",
      "You can choose the wait time: 5, 10, 15, 30, or 60 minutes.",
      "The active account is never suspended.",
      "If a video call is in progress on an account, it is not suspended until you hang up.",
      "Turning the option off immediately wakes all accounts that were idle.",
    ],
    note: "While an account is idle, notifications and counters for that account may not update until you open it. The active account and ones you use often still get notifications normally.",
  },
  {
    id: "zen",
    title: "Zen mode (chat only)",
    paragraphs: [
      "Zen mode hides the sidebar rail so WhatsApp fills the whole window. Useful when you want to focus on one conversation.",
    ],
    bullets: [
      "Turn it on from View → Zen mode, with Ctrl+Shift+Z, or search Zen in the command palette (Ctrl+K).",
      "To return to normal view, press Escape or use the shortcut again.",
      "Entering Settings turns Zen mode off automatically.",
    ],
    note: "In Zen mode you will not see the ⚡ button on the rail; exit Zen or use Ctrl+Shift+A to open Right now.",
  },
  {
    id: "ahora-mismo",
    title: "Right now — urgent items at a glance",
    paragraphs: [
      "Right now is a small panel next to the sidebar rail. It shows up to three conversations with unread messages, the most urgent across all your accounts. Unlike the larger views (activity center or pending actions), it does not cover WhatsApp: you can read the summary and keep seeing the chat beside it.",
    ],
    steps: [
      "Press the ⚡ button on the sidebar rail, use Ctrl+Shift+A, or View → Right now.",
      "Review the list: contact name, account (Personal, Work…), unread count, and a line from the last message.",
      "Click a row to open that chat on the correct account. The panel closes on its own.",
      "To see more conversations, click View all pending at the bottom of the panel.",
      "To close without opening anything: press Escape, the panel X, or click outside it.",
    ],
    bullets: [
      "A green dot on the ⚡ button means urgent chats are waiting.",
      "If there are no unread messages, the panel tells you (You are all caught up).",
      "You can also type Right now in the Ctrl+K palette.",
    ],
    note: "The panel uses the same unread information as WhatsApp Web. If you just read a chat on your phone, it may take a few seconds to leave the list.",
  },
  {
    id: "actividad",
    title: "Activity center and pending actions",
    paragraphs: [
      "Besides Right now, you have two wider views when you need to review everything calmly.",
    ],
    table: {
      headers: ["Tool", "When to use it", "How to open it"],
      rows: [
        [
          "⚡ Right now",
          "Quick glance: top 3 urgent without covering the screen",
          "⚡ button, Ctrl+Shift+A, View → Right now",
        ],
        [
          "▤ Activity center",
          "Per-account summary: who wrote and preview",
          "▤ button or Ctrl+K → activity",
        ],
        ["✉ Pending actions", "Full list of all unread chats", "✉ button or Ctrl+K → pending"],
        ["Ctrl+K → Chats", "Find a specific contact by name or text", "Ctrl+K and type the name"],
      ],
    },
    bullets: [
      "Activity center (▤): one card per account with unread total and last message.",
      "Pending actions (✉): flat list sorted by urgency across all accounts.",
      "From Right now you can jump to the full inbox with one click.",
    ],
  },
  {
    id: "paleta",
    title: "Command palette (quick search)",
    paragraphs: [
      "Press Ctrl+K anytime to open a search box. Type what you need and the list filters instantly.",
      "Besides accounts and actions, you can search conversations with unread messages: type the contact name, part of the last message, or the account name (for example Ana or Work budget). Choosing a chat opens that conversation on the right account.",
    ],
    bullets: [
      "Up and down arrows to pick an option.",
      "Enter to run it (open chat, switch account — waking it if idle —, open Right now, go to Settings, etc.).",
      "Escape to close without doing anything.",
      "Matching chats appear at the top under Chats when they match what you type.",
      "Useful commands: Right now, Pending actions, Activity center, New account, Zen mode.",
    ],
    note: "Chat search uses unread conversations that WhatsApp Web shows per account. If a chat has no pending messages, it may not appear until new activity arrives.",
  },
  {
    id: "chat-numero",
    title: "Message someone by number",
    steps: [
      "Press Ctrl+M or search phone in the palette (Ctrl+K).",
      "Enter the number with international prefix, for example +34612345678.",
      "Press OK. The conversation opens on the account that is currently active.",
    ],
    note: "The number must include the country code (+ and the right digits).",
  },
  {
    id: "enlaces",
    title: "Open WhatsApp links from the web",
    paragraphs: [
      "If someone sends you a wa.me link or you open a whatsapp:// link from another app, Catrip Connect can open the chat directly.",
    ],
    bullets: [
      "After installing the app, in Settings → General you can register Catrip Connect as the default handler for WhatsApp links.",
      "Under Incoming WhatsApp links choose which account to use: ask if there are several, always the active account, or a fixed account.",
      "If the link includes a pre-filled message, it appears ready to send in the chat.",
      "Group invites (chat.whatsapp.com) can also open in the app.",
    ],
    note: "If the browser says no app is available, use Register as default app in Settings → General.",
  },
  {
    id: "ajustes-general",
    title: "Settings — General",
    paragraphs: [
      "Open Settings with Ctrl+P or from the File menu. General controls day-to-day app behavior.",
    ],
    bullets: [
      "Start minimized: the app launches to the tray without showing a window.",
      "Show sidebar rail: hide or show the account column (needed for ⚡, ✉, and ▤).",
      "Show menu bar: the File / View / Chat strip at the top.",
      "On close, minimize to tray: clicking X keeps the app in the background (recommended).",
      "Start automatically with the system: open Catrip Connect when the computer boots.",
      "Download folder: where files you receive on WhatsApp are saved.",
      "Interface scale: enlarge or shrink text and icons (100% to 200%).",
      "Check for updates on startup: notify when a new version is available.",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "Settings — Accounts",
    bullets: [
      "Rename: change the visible account name (only in Catrip Connect, not in WhatsApp).",
      "Regenerate icon or pick a color variant: customize the sidebar rail avatar.",
      "Per-account notifications: enable or mute alerts for one account.",
      "Remove account: remove the session from the app (does not delete WhatsApp on your phone).",
    ],
    note: "Removing an account in Catrip Connect does not log you out on your phone; it only stops showing it in the app.",
  },
  {
    id: "ajustes-notificaciones",
    title: "Settings — Notifications",
    bullets: [
      "System notifications: desktop alerts when messages arrive.",
      "Show account name: the alert shows whether it is Work, Personal, etc.",
      "Show preview: one line of the message in the alert.",
      "Do not disturb: no pop-up alerts (the tray counter still works).",
      "System sound: beep when a notification arrives.",
    ],
    note: "Clicking a notification opens the window and selects the account that received the message. You can then use ⚡ to see what else is pending.",
  },
  {
    id: "ajustes-red",
    title: "Settings — Network",
    paragraphs: [
      "You only need this section if your connection goes through a proxy (corporate network, special VPN, etc.). Enable Network proxy and enter the rules your administrator gave you.",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "Settings — Performance",
    paragraphs: [
      "This section helps balance smoothness, memory use, and stability when you use several accounts at once.",
    ],
    bullets: [
      "Suspend inactive accounts: frees RAM by closing the WhatsApp view for accounts you do not select for a while. The session stays on disk.",
      "Suspend after (minutes): how long without using an account before it goes idle (5 to 60 minutes).",
      "GPU boost: improves video smoothness on some Linux machines. Requires restarting the app.",
      "Renderer process limit: useful with many accounts when the computer is tight on memory. Requires restart.",
      "Prevent sleep during video call: the system does not sleep while an active call runs in WhatsApp Web (system power lock).",
      "Clear cache: if WhatsApp is slow or files fail, try clearing cache (does not sign you out).",
    ],
    note: "Account suspension and the process limit tackle the same problem (memory) from different angles: the first closes views you are not using; the second caps how many Chromium processes can open in total.",
  },
  {
    id: "bandeja",
    title: "System tray icon",
    paragraphs: [
      "Next to the desktop clock (Linux) you will see the Catrip Connect icon. From there you can restore the window or quit completely.",
    ],
    bullets: [
      "Click the icon: show or hide the main window.",
      "Context menu: lists your accounts with status and unread counts; also lets you quit.",
      "Icon badge: shows total unread messages (if enabled in Settings).",
      "When restoring from the tray, the window returns to the same size and position as before.",
    ],
  },
  {
    id: "actualizaciones",
    title: "Updating the app",
    paragraphs: [
      "With Check for updates on startup enabled, Catrip Connect checks for new versions online.",
    ],
    bullets: [
      "If you installed the .deb package: the app shows release notes and lets you download the installer to a folder you choose, or open the link in the browser. You decide when to install.",
      "If you use AppImage: the download may run on its own; when ready, click Restart now.",
      "The update panel scrolls so you can read all release notes without resizing the window.",
    ],
  },
  {
    id: "atajos",
    title: "Keyboard shortcuts",
    table: {
      headers: ["Shortcut", "What it does"],
      rows: [
        ["Ctrl+K", "Open search (unread chats, accounts, and actions)"],
        ["Ctrl+P", "Open Settings"],
        ["Ctrl+1 … Ctrl+9", "Go to account 1, 2, 3… (up to 9)"],
        ["Ctrl+N", "New chat in WhatsApp Web"],
        ["Ctrl+M", "Chat by phone number"],
        ["Ctrl+U", "New account"],
        ["Ctrl+Shift+A", "Open or close Right now (top 3 urgent)"],
        ["Ctrl+Shift+Z", "Toggle Zen mode"],
        ["Escape", "Close Right now, exit Zen mode, or close palette"],
        ["Ctrl+W", "Hide window"],
        ["Ctrl+Q", "Quit the application"],
        ["F5", "Reload WhatsApp Web"],
        ["F11", "Full screen"],
      ],
    },
    note: "You can also see a quick list under Help → Keyboard shortcuts and the full manual under Help → User manual.",
  },
  {
    id: "problemas",
    title: "Tips and common issues",
    bullets: [
      "WhatsApp does not load or shows black: Chat → Reload (F5). If it persists, in Settings → Performance try toggling GPU boost and restart.",
      "QR code does not appear: check your internet and reload with F5.",
      "Notifications do not arrive: check Settings → Notifications and that the system allows alerts for Catrip Connect.",
      "Right now is empty but I know there are messages: wait a few seconds or open ✉ Pending actions; WhatsApp Web must detect unreads first.",
      "An avatar looks dim (idle): normal if you have not used that account for a while. Click to wake it; you can also disable suspension in Settings → Performance.",
      "No alerts from an idle account: while sleeping it does not check for new messages. Open it or shorten the suspend time if you need alerts more often.",
      "I do not see the ⚡ button: enable Show sidebar rail in Settings and exit Zen mode.",
      "Tray icons do not show: on some Linux distributions you need tray icon support (AppIndicator).",
      "wa.me link does not open the app: register Catrip Connect in Settings → General and close the browser before trying again.",
      "Several accounts feel slow: enable Suspend inactive accounts, lower the process limit, or use fewer active accounts at once.",
    ],
    note: "Keeping the app updated usually fixes compatibility issues with WhatsApp Web.",
  },
  {
    id: "ayuda",
    title: "More help",
    paragraphs: [
      "From the Help menu you can open this user manual, the keyboard shortcut list, and the About window with the installed version.",
      "Catrip Connect uses official WhatsApp Web inside the app: everything that works on web.whatsapp.com (chats, files, status where supported) works the same here.",
    ],
    bullets: [
      "User manual: full guide with table of contents (this window).",
      "Keyboard shortcuts: quick reference.",
      "About: installed version number.",
    ],
  },
];

export const manualPt = [
  {
    id: "bienvenida",
    title: "O que é o Catrip Connect?",
    paragraphs: [
      "O Catrip Connect é um programa para computador que permite usar o WhatsApp Web com uma ou várias contas ao mesmo tempo. Cada conta é independente: as mensagens, contactos e ficheiros de uma não se misturam com os de outra.",
      "O ecrã principal mostra o WhatsApp tal como o conhece no navegador, mas com ferramentas extra: mudar de conta com um clique, poupar memória suspendendo contas que não usa, um olhar rápido ao mais urgente (Agora), ver todas as mensagens por ler, procurar conversas com Ctrl+K, receber avisos no ambiente de trabalho e muito mais.",
    ],
  },
  {
    id: "primeros-pasos",
    title: "Primeiros passos",
    steps: [
      "Abra o Catrip Connect no menu de aplicações do sistema (procure «Catrip Connect»).",
      "Na primeira vez, prima o botão para criar a sua primeira conta. Dê-lhe um nome que reconheça, por exemplo «Pessoal» ou «Trabalho».",
      "Aparecerá o código QR do WhatsApp Web. No telemóvel abra o WhatsApp → Dispositivos ligados → Ligar dispositivo e leia o código.",
      "Quando a ligação estiver pronta, verá as suas conversas na zona grande da janela.",
      "Para adicionar outra conta, use o botão «Nova conta» na barra lateral ou o menu Contas.",
    ],
    note: "Se o código QR expirar, recarregue a vista com F5 ou Chat → Recarregar.",
  },
  {
    id: "ventana",
    title: "Como a janela está organizada",
    paragraphs: [
      "A janela tem duas zonas principais. À esquerda está a barra lateral (por vezes chamamos «o rail»): aí vê os ícones das suas contas e alguns acessos rápidos. À direita, a parte grande, é o WhatsApp Web da conta selecionada.",
      "Em cima encontra a barra de menus (Ficheiro, Ver, Chat, Contas, Ajuda) se a tiver ativada em Definições. A partir daí pode fazer quase tudo o que explicamos neste manual.",
    ],
    bullets: [
      "Parte superior do rail: avatares das suas contas (clique para mudar, arrastar para reordenar).",
      "Parte inferior do rail: botões de ação — nova conta, chat por número, novo chat, ⚡ Agora, ✉ pendentes, ▤ atividade, definições e modo Zen.",
      "Zona central: conversas, chamadas e ficheiros do WhatsApp Web.",
      "Menu superior: acessos organizados por categorias (inclui Ver → Agora).",
    ],
  },
  {
    id: "cuentas",
    title: "Trabalhar com várias contas",
    paragraphs: [
      "Pode ter várias contas de WhatsApp na mesma aplicação. Cada uma tem o seu ícone de cor na barra lateral.",
    ],
    bullets: [
      "Clique num ícone para mudar para essa conta.",
      "Arraste um ícone para cima ou para baixo para alterar a ordem da lista.",
      "O ponto verde ou o número no ícone indica mensagens por ler nessa conta.",
      "Se uma conta ficar sem uso durante algum tempo, pode passar a «em repouso»: o avatar fica mais ténue e a dica indica-o. A sessão mantém-se guardada; um clique reativa-a de imediato.",
      "Passe o rato sobre um ícone para ver se está ligada, em repouso, à espera de QR ou sem internet.",
      "Atalho rápido: Ctrl+1 abre a primeira conta, Ctrl+2 a segunda, até Ctrl+9.",
    ],
    note: "Em Definições → Contas pode renomear cada conta, mudar a cor do ícone ou eliminá-la. Em Definições → Desempenho configura quando as contas inativas entram em repouso.",
  },
  {
    id: "reposo-cuentas",
    title: "Contas em repouso (poupança de memória)",
    paragraphs: [
      "Com várias contas abertas, cada uma consome memória e processador enquanto mantém o WhatsApp Web carregado. O Catrip Connect pode «adormecer» as contas que não usa: fecha a vista interna do WhatsApp mas conserva a sessão (cookies e login) no disco.",
      "Assim a aplicação fica mais leve com três, quatro ou mais contas, sem ter de terminar sessão nem voltar a ler o QR de cada vez.",
    ],
    steps: [
      "Use uma conta normalmente; ao mudar para outra, a anterior começa a contar o tempo de inatividade.",
      "Após o limiar configurado (por defeito 15 minutos), a conta entra em repouso: o avatar no rail fica atenuado.",
      "Para reativar, clique no avatar, escolha um chat em ✉ pendentes, Ctrl+K ou abra um link wa.me dirigido a essa conta.",
      "O WhatsApp Web volta a carregar em poucos segundos com a mesma sessão; não é preciso ler o QR outra vez.",
    ],
    bullets: [
      "Ativado por defeito em Definições → Desempenho → «Suspender contas inativas».",
      "Pode escolher o tempo de espera: 5, 10, 15, 30 ou 60 minutos.",
      "A conta ativa nunca é suspensa.",
      "Se houver uma videochamada em curso numa conta, não é suspensa até desligar.",
      "Desativar a opção reativa de imediato todas as contas que estavam em repouso.",
    ],
    note: "Enquanto uma conta está em repouso, os avisos e contadores dessa conta podem não atualizar até a abrir. A conta ativa e as que usa com frequência continuam a receber notificações normalmente.",
  },
  {
    id: "zen",
    title: "Modo Zen (só o chat)",
    paragraphs: [
      "O modo Zen oculta a barra lateral para o WhatsApp ocupar toda a janela. É útil quando quer concentrar-se numa conversa.",
    ],
    bullets: [
      "Ative-o em Ver → Modo Zen, com Ctrl+Shift+Z ou procure «Zen» na paleta de comandos (Ctrl+K).",
      "Para voltar à vista normal, prima Escape ou repita o atalho.",
      "Ao entrar em Definições, o modo Zen desativa-se sozinho.",
    ],
    note: "Em modo Zen não verá o botão ⚡ do rail; saia do modo Zen ou use Ctrl+Shift+A para abrir Agora.",
  },
  {
    id: "ahora-mismo",
    title: "Agora — o urgente num relance",
    paragraphs: [
      "Agora é um painel pequeno junto à barra lateral. Mostra até três conversas com mensagens por ler, as mais urgentes de todas as suas contas. Ao contrário das vistas grandes (centro de atividade ou ações pendentes), não tapa o WhatsApp: pode ler o resumo e continuar a ver o chat ao lado.",
    ],
    steps: [
      "Prima o botão ⚡ na barra lateral, use Ctrl+Shift+A ou Ver → Agora.",
      "Revise a lista: verá o nome do contacto, a conta (Pessoal, Trabalho…), quantas mensagens por ler há e uma linha da última mensagem.",
      "Clique numa linha para abrir essa conversa na conta certa. O painel fecha-se sozinho.",
      "Se precisar de ver mais conversas, prima «Ver todas as pendentes» no rodapé do painel.",
      "Para fechar sem abrir nada: prima Escape, o X do painel ou clique fora dele.",
    ],
    bullets: [
      "Um ponto verde no botão ⚡ indica que há conversas urgentes pendentes.",
      "Se não houver mensagens por ler, o painel diz-lhe («Está em dia»).",
      "Também pode escrever «Agora» na paleta Ctrl+K.",
    ],
    note: "O painel usa a mesma informação que o WhatsApp Web sobre mensagens por ler. Se acabou de ler uma conversa no telemóvel, pode demorar alguns segundos a sair da lista.",
  },
  {
    id: "actividad",
    title: "Centro de atividade e ações pendentes",
    paragraphs: [
      "Para além de Agora, tem duas vistas mais amplas quando precisa de rever tudo com calma.",
    ],
    table: {
      headers: ["Ferramenta", "Quando usar", "Como abrir"],
      rows: [
        [
          "⚡ Agora",
          "Olhar rápido: top 3 urgentes sem tapar o ecrã",
          "Botão ⚡, Ctrl+Shift+A, Ver → Agora",
        ],
        [
          "▤ Centro de atividade",
          "Resumo por conta: quem escreveu e pré-visualização",
          "Botão ▤ ou Ctrl+K → «atividade»",
        ],
        [
          "✉ Ações pendentes",
          "Lista completa de todas as conversas por ler",
          "Botão ✉ ou Ctrl+K → «pendentes»",
        ],
        ["Ctrl+K → Conversas", "Procurar um contacto por nome ou texto", "Ctrl+K e escreva o nome"],
      ],
    },
    bullets: [
      "Centro de atividade (▤): um cartão por conta com total de por ler e última mensagem.",
      "Ações pendentes (✉): lista plana ordenada por urgência em todas as contas.",
      "A partir de Agora pode saltar para a bandeja completa com um clique.",
    ],
  },
  {
    id: "paleta",
    title: "Paleta de comandos (pesquisa rápida)",
    paragraphs: [
      "Prima Ctrl+K a qualquer momento para abrir um pesquisador. Escreva o que procura e a lista filtra-se de imediato.",
      "Para além de contas e ações, pode procurar conversas com mensagens por ler: escreva o nome do contacto, um excerto da última mensagem ou o nome da conta (por exemplo «Ana» ou «Trabalho orçamento»). Ao escolher uma conversa, a app abre-a na conta certa.",
    ],
    bullets: [
      "Setas para cima e para baixo para escolher uma opção.",
      "Enter para executar (abrir conversa, mudar de conta — reativando se estava em repouso —, abrir Agora, ir a Definições, etc.).",
      "Escape para fechar sem fazer nada.",
      "As conversas aparecem no topo na secção «Conversas» quando coincidem com o que escreve.",
      "Comandos úteis: «Agora», «Ações pendentes», «Centro de atividade», «Nova conta», «Modo Zen».",
    ],
    note: "A pesquisa de conversas usa as conversas por ler que o WhatsApp Web mostra em cada conta. Se uma conversa não tiver mensagens pendentes, pode não aparecer até haver atividade nova.",
  },
  {
    id: "chat-numero",
    title: "Escrever a alguém por número",
    steps: [
      "Prima Ctrl+M ou procure «telefone» na paleta (Ctrl+K).",
      "Escreva o número com prefixo internacional, por exemplo +351912345678.",
      "Prima Aceitar. Abrir-se-á a conversa na conta que tiver ativa.",
    ],
    note: "O número deve incluir o indicativo do país (o + e os dígitos correspondentes).",
  },
  {
    id: "enlaces",
    title: "Abrir links do WhatsApp da internet",
    paragraphs: [
      "Se alguém lhe enviar um link wa.me ou abrir um link whatsapp:// noutra aplicação, o Catrip Connect pode abrir a conversa diretamente.",
    ],
    bullets: [
      "Após instalar a aplicação, em Definições → Geral pode registar o Catrip Connect como programa predefinido para links WhatsApp.",
      "Em «Links WhatsApp recebidos» escolhe que conta usar: perguntar se houver várias, sempre a conta ativa ou uma conta fixa.",
      "Se o link trouxer uma mensagem pré-carregada, aparece pronta a enviar na conversa.",
      "Convites para grupos (chat.whatsapp.com) também podem abrir na app.",
    ],
    note: "Se o navegador disser que não há aplicação disponível, use «Registar como app predefinida» em Definições → Geral.",
  },
  {
    id: "ajustes-general",
    title: "Definições — Geral",
    paragraphs: [
      "Abra Definições com Ctrl+P ou no menu Ficheiro. A secção Geral controla o comportamento diário da aplicação.",
    ],
    bullets: [
      "Iniciar minimizada: a app arranca na bandeja sem mostrar janela.",
      "Mostrar barra lateral: oculta ou mostra a coluna de contas (necessária para ⚡, ✉ e ▤).",
      "Mostrar barra de menus: a faixa Ficheiro / Ver / Chat em cima.",
      "Ao fechar, minimizar para a bandeja: ao premir o X, a app continua em segundo plano (recomendado).",
      "Iniciar automaticamente com o sistema: abre o Catrip Connect ao ligar o computador.",
      "Pasta de transferências: onde se guardam ficheiros recebidos no WhatsApp.",
      "Escala da interface: aumenta ou reduz textos e ícones (100 % a 200 %).",
      "Procurar atualizações ao iniciar: avisa quando há versão nova.",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "Definições — Contas",
    bullets: [
      "Renomear: muda o nome visível da conta (só no Catrip Connect, não no WhatsApp).",
      "Regenerar ícone ou escolher variante de cor: personaliza o avatar da barra lateral.",
      "Notificações por conta: ativa ou silencia avisos de uma conta concreta.",
      "Eliminar conta: remove a sessão da app (não apaga o WhatsApp do telemóvel).",
    ],
    note: "Eliminar uma conta no Catrip Connect não fecha o WhatsApp no telefone; só deixa de a mostrar no programa.",
  },
  {
    id: "ajustes-notificaciones",
    title: "Definições — Notificações",
    bullets: [
      "Notificações do sistema: avisos no ambiente de trabalho quando chegam mensagens.",
      "Mostrar nome da conta: no aviso verá se é «Trabalho», «Pessoal», etc.",
      "Mostrar detalhe (pré-visualização): uma linha da mensagem no aviso.",
      "Não incomodar: sem avisos emergentes (o contador na bandeja continua a funcionar).",
      "Som do sistema: sinal sonoro ao receber um aviso.",
    ],
    note: "Ao clicar numa notificação, a janela abre-se e seleciona-se a conta que recebeu a mensagem. Depois pode usar ⚡ para ver o que mais fica pendente.",
  },
  {
    id: "ajustes-red",
    title: "Definições — Rede",
    paragraphs: [
      "Só precisa desta secção se a ligação passar por um proxy (rede empresarial, VPN especial, etc.). Ative «Proxy de rede» e introduza as regras que o administrador lhe deu.",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "Definições — Desempenho",
    paragraphs: [
      "Esta secção ajuda a equilibrar fluidez, consumo de memória e estabilidade quando usa várias contas ao mesmo tempo.",
    ],
    bullets: [
      "Suspender contas inativas: liberta RAM fechando a vista do WhatsApp das contas que não seleciona durante algum tempo. A sessão permanece no disco.",
      "Suspender após (minutos): quanto tempo deve passar sem usar uma conta antes de entrar em repouso (5 a 60 minutos).",
      "Reforço GPU: melhora a fluidez de vídeos em alguns equipamentos Linux. Requer reiniciar a app.",
      "Limite de processos do renderer: útil com muitas contas quando o computador vai justo de memória. Requer reiniciar.",
      "Evitar suspensão durante videochamada: o equipamento não adormece enquanto há chamada ativa no WhatsApp Web (bloqueio de energia do sistema).",
      "Limpar cache: se o WhatsApp vai lento ou falham ficheiros, experimente esvaziar a cache (não termina sessão).",
    ],
    note: "A suspensão de contas e o limite de processos atacam o mesmo problema (memória) por ângulos distintos: a primeira fecha vistas que não usa; o segundo limita quantos processos Chromium pode abrir no total.",
  },
  {
    id: "bandeja",
    title: "Ícone na bandeja do sistema",
    paragraphs: [
      "Junto ao relógio do ambiente de trabalho (Linux) aparece o ícone do Catrip Connect. A partir daí pode restaurar a janela ou sair por completo.",
    ],
    bullets: [
      "Clique no ícone: mostra ou oculta a janela principal.",
      "Menu contextual: lista as suas contas com estado e mensagens por ler; também permite sair.",
      "Contador no ícone: mostra quantas mensagens por ler há no total (se estiver ativado em Definições).",
      "Ao restaurar da bandeja, a janela volta ao mesmo tamanho e posição de antes.",
    ],
  },
  {
    id: "actualizaciones",
    title: "Atualizar a aplicação",
    paragraphs: [
      "Com «Procurar atualizações ao iniciar» ativo, o Catrip Connect verifica se há versões novas na internet.",
    ],
    bullets: [
      "Se instalou o pacote .deb: a app mostra as novidades e pode descarregar o instalador para uma pasta à sua escolha, ou abrir o link no navegador. Você decide quando instalar.",
      "Se usa AppImage: a transferência pode fazer-se sozinha; quando estiver pronta, prima «Reiniciar agora».",
      "O painel de atualização tem scroll para ler todas as novidades sem aumentar a janela.",
    ],
  },
  {
    id: "atajos",
    title: "Atalhos de teclado",
    table: {
      headers: ["Atalho", "O que faz"],
      rows: [
        ["Ctrl+K", "Abrir pesquisa (conversas por ler, contas e ações)"],
        ["Ctrl+P", "Abrir Definições"],
        ["Ctrl+1 … Ctrl+9", "Ir para a conta 1, 2, 3… (até 9)"],
        ["Ctrl+N", "Nova conversa no WhatsApp Web"],
        ["Ctrl+M", "Conversa por número de telefone"],
        ["Ctrl+U", "Nova conta"],
        ["Ctrl+Shift+A", "Abrir ou fechar Agora (top 3 urgentes)"],
        ["Ctrl+Shift+Z", "Ativar ou desativar modo Zen"],
        ["Escape", "Fechar Agora, sair do modo Zen ou fechar paleta"],
        ["Ctrl+W", "Ocultar janela"],
        ["Ctrl+Q", "Sair da aplicação"],
        ["F5", "Recarregar WhatsApp Web"],
        ["F11", "Ecrã inteiro"],
      ],
    },
    note: "Também pode ver uma lista rápida em Ajuda → Atalhos de teclado e o manual completo em Ajuda → Manual do utilizador.",
  },
  {
    id: "problemas",
    title: "Dicas e problemas frequentes",
    bullets: [
      "O WhatsApp não carrega ou fica preto: Chat → Recarregar (F5). Se persistir, em Definições → Desempenho experimente ativar ou desativar «Reforço GPU» e reinicie.",
      "O código QR não aparece: verifique a internet e recarregue com F5.",
      "Não chegam notificações: reveja Definições → Notificações e que o sistema permita avisos para o Catrip Connect.",
      "Agora está vazio mas sei que há mensagens: espere alguns segundos ou abra ✉ Ações pendentes; o WhatsApp Web tem de detetar os por ler primeiro.",
      "Um avatar parece apagado («em repouso»): é normal se não usa essa conta há algum tempo. Clique para reativar; também pode desativar a suspensão em Definições → Desempenho.",
      "Não recebo avisos de uma conta em repouso: enquanto dorme, essa conta não verifica mensagens novas. Abra-a ou reduza o tempo de suspensão se precisar de avisos mais frequentes.",
      "Não vejo o botão ⚡: ative «Mostrar barra lateral» em Definições e saia do modo Zen.",
      "Não se vêem os ícones da bandeja: em algumas distribuições Linux é preciso instalar suporte para ícones de bandeja (AppIndicator).",
      "Link wa.me não abre a app: registe o Catrip Connect em Definições → Geral e feche o navegador antes de tentar de novo.",
      "Várias contas vão lentas: ative «Suspender contas inativas», reduza o limite de processos ou use menos contas ativas de uma vez.",
    ],
    note: "Manter a aplicação atualizada costuma resolver falhas de compatibilidade com o WhatsApp Web.",
  },
  {
    id: "ayuda",
    title: "Mais ajuda",
    paragraphs: [
      "No menu Ajuda pode abrir este manual do utilizador, a lista de atalhos de teclado e a janela «Acerca de» com a versão instalada.",
      "O Catrip Connect usa o WhatsApp Web oficial dentro do programa: tudo o que funciona em web.whatsapp.com (conversas, ficheiros, estados conforme suporte) funciona igual aqui.",
    ],
    bullets: [
      "Manual do utilizador: guia completa com índice (esta janela).",
      "Atalhos de teclado: referência rápida.",
      "Acerca de: número da versão instalada.",
    ],
  },
];

export const manualFr = [
  {
    id: "bienvenida",
    title: "Qu'est-ce que Catrip Connect ?",
    paragraphs: [
      "Catrip Connect est une application de bureau qui vous permet d'utiliser WhatsApp Web avec un ou plusieurs comptes en même temps. Chaque compte est indépendant : les messages, contacts et fichiers de l'un ne se mélangent pas avec ceux d'un autre.",
      "L'écran principal affiche WhatsApp comme dans le navigateur, avec des outils en plus : changer de compte en un clic, économiser la mémoire en suspendant les comptes inutilisés, un coup d'œil rapide sur l'urgent (Tout de suite), voir tous les messages non lus, chercher des discussions avec Ctrl+K, recevoir des alertes sur le bureau, et bien plus.",
    ],
  },
  {
    id: "primeros-pasos",
    title: "Premiers pas",
    steps: [
      "Ouvrez Catrip Connect depuis le menu des applications de votre système (recherchez « Catrip Connect »).",
      "La première fois, cliquez sur le bouton pour créer votre premier compte. Donnez-lui un nom reconnaissable, par exemple « Personnel » ou « Travail ».",
      "Le code QR WhatsApp Web s'affiche. Sur le téléphone ouvrez WhatsApp → Appareils connectés → Connecter un appareil et scannez le code.",
      "Quand la connexion est prête, vous voyez vos discussions dans la grande zone de la fenêtre.",
      "Pour ajouter un autre compte, utilisez le bouton « Nouveau compte » dans la barre latérale ou le menu Comptes.",
    ],
    note: "Si le code QR expire, rechargez la vue avec F5 ou Chat → Recharger.",
  },
  {
    id: "ventana",
    title: "Organisation de la fenêtre",
    paragraphs: [
      "La fenêtre comporte deux zones principales. À gauche, la barre latérale (parfois appelée « le rail ») : icônes de vos comptes et raccourcis. À droite, la grande zone est WhatsApp Web du compte sélectionné.",
      "En haut se trouve la barre de menus (Fichier, Affichage, Chat, Comptes, Aide) si vous l'avez activée dans Paramètres. Vous y trouvez presque tout ce que décrit ce manuel.",
    ],
    bullets: [
      "Haut du rail : avatars de vos comptes (clic pour changer, glisser pour réordonner).",
      "Bas du rail : boutons d'action — nouveau compte, chat par numéro, nouveau chat, ⚡ Tout de suite, ✉ en attente, ▤ activité, paramètres et mode Zen.",
      "Zone centrale : discussions, appels et fichiers WhatsApp Web.",
      "Menu supérieur : raccourcis par catégories (dont Affichage → Tout de suite).",
    ],
  },
  {
    id: "cuentas",
    title: "Travailler avec plusieurs comptes",
    paragraphs: [
      "Vous pouvez avoir plusieurs comptes WhatsApp dans la même application. Chacun a sa propre icône colorée dans la barre latérale.",
    ],
    bullets: [
      "Cliquez sur une icône pour passer à ce compte.",
      "Faites glisser une icône vers le haut ou le bas pour changer l'ordre.",
      "Un point vert ou un chiffre sur l'icône indique des messages non lus sur ce compte.",
      "Si un compte reste inutilisé un moment, il peut passer « en veille » : l'avatar est plus terne et l'infobulle l'indique. La session reste enregistrée ; un clic la réactive aussitôt.",
      "Survolez une icône pour voir si elle est connectée, en veille, en attente de QR ou hors ligne.",
      "Raccourci : Ctrl+1 ouvre le premier compte, Ctrl+2 le second, jusqu'à Ctrl+9.",
    ],
    note: "Dans Paramètres → Comptes vous pouvez renommer chaque compte, changer la couleur de l'icône ou le supprimer. Dans Paramètres → Performances vous configurez quand les comptes inactifs passent en veille.",
  },
  {
    id: "reposo-cuentas",
    title: "Comptes en veille (économie de mémoire)",
    paragraphs: [
      "Avec plusieurs comptes ouverts, chacun consomme mémoire et processeur tant que WhatsApp Web reste chargé. Catrip Connect peut « endormir » les comptes inutilisés : il ferme la vue interne WhatsApp mais conserve votre session (cookies et connexion) sur le disque.",
      "L'application reste plus légère avec trois, quatre comptes ou plus, sans vous déconnecter ni rescanner le QR à chaque fois.",
    ],
    steps: [
      "Utilisez un compte normalement ; en passant à un autre, le précédent commence à compter le temps d'inactivité.",
      "Après le seuil configuré (15 minutes par défaut), le compte passe en veille : son avatar sur le rail est atténué.",
      "Pour le réactiver, cliquez sur son avatar, choisissez un chat via ✉ en attente, Ctrl+K ou ouvrez un lien wa.me vers ce compte.",
      "WhatsApp Web se recharge en quelques secondes avec la même session ; pas besoin de rescanner le QR.",
    ],
    bullets: [
      "Activé par défaut dans Paramètres → Performances → « Suspendre les comptes inactifs ».",
      "Délai d'attente au choix : 5, 10, 15, 30 ou 60 minutes.",
      "Le compte actif n'est jamais suspendu.",
      "Si un appel vidéo est en cours sur un compte, il n'est pas suspendu tant que vous n'avez pas raccroché.",
      "Désactiver l'option réactive immédiatement tous les comptes en veille.",
    ],
    note: "Tant qu'un compte est en veille, les alertes et compteurs de ce compte peuvent ne pas se mettre à jour tant que vous ne l'ouvrez pas. Le compte actif et ceux que vous utilisez souvent reçoivent les notifications normalement.",
  },
  {
    id: "zen",
    title: "Mode Zen (chat seul)",
    paragraphs: [
      "Le mode Zen masque la barre latérale pour que WhatsApp occupe toute la fenêtre. Utile pour se concentrer sur une conversation.",
    ],
    bullets: [
      "Activez-le via Affichage → Mode Zen, avec Ctrl+Shift+Z ou en cherchant « Zen » dans la palette de commandes (Ctrl+K).",
      "Pour revenir à la vue normale, appuyez sur Échap ou répétez le raccourci.",
      "En entrant dans Paramètres, le mode Zen se désactive tout seul.",
    ],
    note: "En mode Zen vous ne verrez pas le bouton ⚡ du rail ; quittez le mode Zen ou utilisez Ctrl+Shift+A pour ouvrir Tout de suite.",
  },
  {
    id: "ahora-mismo",
    title: "Tout de suite — l'urgent en un coup d'œil",
    paragraphs: [
      "Tout de suite est un petit panneau à côté de la barre latérale. Il affiche jusqu'à trois conversations avec messages non lus, les plus urgentes parmi tous vos comptes. Contrairement aux grandes vues (centre d'activité ou actions en attente), il ne couvre pas WhatsApp : vous lisez le résumé et gardez le chat à côté.",
    ],
    steps: [
      "Appuyez sur le bouton ⚡ dans la barre latérale, utilisez Ctrl+Shift+A ou Affichage → Tout de suite.",
      "Parcourez la liste : nom du contact, compte (Personnel, Travail…), nombre de non lus et un extrait du dernier message.",
      "Cliquez sur une ligne pour ouvrir ce chat sur le bon compte. Le panneau se ferme seul.",
      "Pour voir plus de conversations, cliquez sur « Voir toutes les en attente » en bas du panneau.",
      "Pour fermer sans ouvrir : Échap, la croix du panneau ou clic à l'extérieur.",
    ],
    bullets: [
      "Un point vert sur le bouton ⚡ indique des chats urgents en attente.",
      "S'il n'y a pas de non lus, le panneau vous le dit (« Vous êtes à jour »).",
      "Vous pouvez aussi taper « Tout de suite » dans la palette Ctrl+K.",
    ],
    note: "Le panneau utilise les mêmes informations non lues que WhatsApp Web. Si vous venez de lire un chat sur le téléphone, il peut mettre quelques secondes à disparaître de la liste.",
  },
  {
    id: "actividad",
    title: "Centre d'activité et actions en attente",
    paragraphs: [
      "En plus de Tout de suite, vous avez deux vues plus larges pour tout revoir tranquillement.",
    ],
    table: {
      headers: ["Outil", "Quand l'utiliser", "Comment l'ouvrir"],
      rows: [
        [
          "⚡ Tout de suite",
          "Coup d'œil rapide : top 3 urgents sans couvrir l'écran",
          "Bouton ⚡, Ctrl+Shift+A, Affichage → Tout de suite",
        ],
        [
          "▤ Centre d'activité",
          "Résumé par compte : qui a écrit et aperçu",
          "Bouton ▤ ou Ctrl+K → « activité »",
        ],
        [
          "✉ Actions en attente",
          "Liste complète de tous les chats non lus",
          "Bouton ✉ ou Ctrl+K → « en attente »",
        ],
        ["Ctrl+K → Discussions", "Trouver un contact par nom ou texte", "Ctrl+K et tapez le nom"],
      ],
    },
    bullets: [
      "Centre d'activité (▤) : une carte par compte avec total de non lus et dernier message.",
      "Actions en attente (✉) : liste plate triée par urgence sur tous les comptes.",
      "Depuis Tout de suite vous pouvez aller à la boîte complète en un clic.",
    ],
  },
  {
    id: "paleta",
    title: "Palette de commandes (recherche rapide)",
    paragraphs: [
      "Appuyez sur Ctrl+K à tout moment pour ouvrir une recherche. Tapez ce que vous cherchez et la liste se filtre instantanément.",
      "Outre les comptes et actions, vous pouvez chercher des conversations avec messages non lus : nom du contact, extrait du dernier message ou nom du compte (par exemple « Ana » ou « Travail budget »). En choisissant un chat, l'app ouvre cette conversation sur le bon compte.",
    ],
    bullets: [
      "Flèches haut et bas pour choisir une option.",
      "Entrée pour l'exécuter (ouvrir un chat, changer de compte — le réactivant s'il était en veille —, ouvrir Tout de suite, aller aux Paramètres, etc.).",
      "Échap pour fermer sans rien faire.",
      "Les chats correspondants apparaissent en haut dans « Discussions ».",
      "Commandes utiles : « Tout de suite », « Actions en attente », « Centre d'activité », « Nouveau compte », « Mode Zen ».",
    ],
    note: "La recherche de chats utilise les conversations non lues affichées par WhatsApp Web sur chaque compte. Sans message en attente, un chat peut ne pas apparaître avant une nouvelle activité.",
  },
  {
    id: "chat-numero",
    title: "Écrire à quelqu'un par numéro",
    steps: [
      "Appuyez sur Ctrl+M ou cherchez « téléphone » dans la palette (Ctrl+K).",
      "Saisissez le numéro avec l'indicatif international, par exemple +33612345678.",
      "Validez. La conversation s'ouvre sur le compte actif.",
    ],
    note: "Le numéro doit inclure l'indicatif pays (le + et les chiffres correspondants).",
  },
  {
    id: "enlaces",
    title: "Ouvrir des liens WhatsApp depuis le web",
    paragraphs: [
      "Si quelqu'un vous envoie un lien wa.me ou si vous ouvrez un lien whatsapp:// depuis une autre application, Catrip Connect peut ouvrir le chat directement.",
    ],
    bullets: [
      "Après installation, dans Paramètres → Général vous pouvez enregistrer Catrip Connect comme application par défaut pour les liens WhatsApp.",
      "Dans « Liens WhatsApp entrants » choisissez le compte : demander s'il y en a plusieurs, toujours le compte actif ou un compte fixe.",
      "Si le lien contient un message prérempli, il apparaît prêt à envoyer dans le chat.",
      "Les invitations de groupe (chat.whatsapp.com) peuvent aussi s'ouvrir dans l'app.",
    ],
    note: "Si le navigateur indique qu'aucune application n'est disponible, utilisez « Enregistrer comme app par défaut » dans Paramètres → Général.",
  },
  {
    id: "ajustes-general",
    title: "Paramètres — Général",
    paragraphs: [
      "Ouvrez Paramètres avec Ctrl+P ou depuis le menu Fichier. La section Général contrôle le comportement quotidien de l'application.",
    ],
    bullets: [
      "Démarrer minimisée : l'app démarre dans la zone de notification sans afficher de fenêtre.",
      "Afficher la barre latérale : masque ou affiche la colonne des comptes (nécessaire pour ⚡, ✉ et ▤).",
      "Afficher la barre de menus : la bande Fichier / Affichage / Chat en haut.",
      "À la fermeture, minimiser dans la zone de notification : la croix laisse l'app en arrière-plan (recommandé).",
      "Démarrer automatiquement avec le système : ouvre Catrip Connect au démarrage de l'ordinateur.",
      "Dossier de téléchargement : où sont enregistrés les fichiers reçus sur WhatsApp.",
      "Échelle de l'interface : agrandit ou réduit textes et icônes (100 % à 200 %).",
      "Rechercher des mises à jour au démarrage : alerte quand une nouvelle version est disponible.",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "Paramètres — Comptes",
    bullets: [
      "Renommer : change le nom visible du compte (uniquement dans Catrip Connect, pas dans WhatsApp).",
      "Régénérer l'icône ou choisir une variante de couleur : personnalise l'avatar de la barre latérale.",
      "Notifications par compte : active ou coupe les alertes d'un compte précis.",
      "Supprimer le compte : retire la session de l'app (ne supprime pas WhatsApp sur le téléphone).",
    ],
    note: "Supprimer un compte dans Catrip Connect ne déconnecte pas WhatsApp sur le téléphone ; il cesse seulement d'être affiché dans le programme.",
  },
  {
    id: "ajustes-notificaciones",
    title: "Paramètres — Notifications",
    bullets: [
      "Notifications système : alertes sur le bureau à l'arrivée des messages.",
      "Afficher le nom du compte : l'alerte indique « Travail », « Personnel », etc.",
      "Afficher l'aperçu : une ligne du message dans l'alerte.",
      "Ne pas déranger : pas de pop-up (le compteur dans la zone de notification fonctionne toujours).",
      "Son système : bip à la réception d'une alerte.",
    ],
    note: "En cliquant sur une notification, la fenêtre s'ouvre et sélectionne le compte qui a reçu le message. Vous pouvez ensuite utiliser ⚡ pour voir ce qui reste en attente.",
  },
  {
    id: "ajustes-red",
    title: "Paramètres — Réseau",
    paragraphs: [
      "Cette section n'est utile que si votre connexion passe par un proxy (réseau d'entreprise, VPN particulier, etc.). Activez « Proxy réseau » et saisissez les règles fournies par votre administrateur.",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "Paramètres — Performances",
    paragraphs: [
      "Cette section aide à équilibrer fluidité, consommation mémoire et stabilité avec plusieurs comptes simultanés.",
    ],
    bullets: [
      "Suspendre les comptes inactifs : libère la RAM en fermant la vue WhatsApp des comptes non sélectionnés pendant un moment. La session reste sur le disque.",
      "Suspendre après (minutes) : délai sans utilisation avant la mise en veille (5 à 60 minutes).",
      "Renforcement GPU : améliore la fluidité vidéo sur certains PC Linux. Nécessite de redémarrer l'app.",
      "Limite de processus du renderer : utile avec beaucoup de comptes si la machine manque de mémoire. Redémarrage requis.",
      "Éviter la veille pendant un appel vidéo : le système ne s'endort pas pendant un appel actif dans WhatsApp Web (blocage d'énergie système).",
      "Vider le cache : si WhatsApp est lent ou que les fichiers échouent, essayez de vider le cache (sans déconnexion).",
    ],
    note: "La suspension des comptes et la limite de processus traitent le même problème (mémoire) sous des angles différents : la première ferme les vues inutilisées ; la seconde limite le nombre total de processus Chromium.",
  },
  {
    id: "bandeja",
    title: "Icône dans la zone de notification",
    paragraphs: [
      "À côté de l'horloge du bureau (Linux) apparaît l'icône Catrip Connect. Vous pouvez y restaurer la fenêtre ou quitter complètement.",
    ],
    bullets: [
      "Clic sur l'icône : affiche ou masque la fenêtre principale.",
      "Menu contextuel : liste vos comptes avec état et non lus ; permet aussi de quitter.",
      "Compteur sur l'icône : total des messages non lus (si activé dans Paramètres).",
      "En restaurant depuis la zone de notification, la fenêtre reprend la même taille et position qu'avant.",
    ],
  },
  {
    id: "actualizaciones",
    title: "Mettre à jour l'application",
    paragraphs: [
      "Avec « Rechercher des mises à jour au démarrage » activé, Catrip Connect vérifie les nouvelles versions en ligne.",
    ],
    bullets: [
      "Si vous avez installé le paquet .deb : l'app affiche les nouveautés et permet de télécharger l'installateur dans un dossier de votre choix, ou d'ouvrir le lien dans le navigateur. Vous décidez quand installer.",
      "Si vous utilisez AppImage : le téléchargement peut se faire seul ; une fois prêt, cliquez sur « Redémarrer maintenant ».",
      "Le panneau de mise à jour défile pour lire toutes les nouveautés sans agrandir la fenêtre.",
    ],
  },
  {
    id: "atajos",
    title: "Raccourcis clavier",
    table: {
      headers: ["Raccourci", "Action"],
      rows: [
        ["Ctrl+K", "Ouvrir la recherche (chats non lus, comptes et actions)"],
        ["Ctrl+P", "Ouvrir Paramètres"],
        ["Ctrl+1 … Ctrl+9", "Aller au compte 1, 2, 3… (jusqu'à 9)"],
        ["Ctrl+N", "Nouveau chat dans WhatsApp Web"],
        ["Ctrl+M", "Chat par numéro de téléphone"],
        ["Ctrl+U", "Nouveau compte"],
        ["Ctrl+Shift+A", "Ouvrir ou fermer Tout de suite (top 3 urgents)"],
        ["Ctrl+Shift+Z", "Activer ou désactiver le mode Zen"],
        ["Échap", "Fermer Tout de suite, quitter le mode Zen ou fermer la palette"],
        ["Ctrl+W", "Masquer la fenêtre"],
        ["Ctrl+Q", "Quitter l'application"],
        ["F5", "Recharger WhatsApp Web"],
        ["F11", "Plein écran"],
      ],
    },
    note: "Liste rapide aussi dans Aide → Raccourcis clavier et manuel complet dans Aide → Manuel utilisateur.",
  },
  {
    id: "problemas",
    title: "Conseils et problèmes fréquents",
    bullets: [
      "WhatsApp ne charge pas ou écran noir : Chat → Recharger (F5). Si ça persiste, dans Paramètres → Performances essayez d'activer ou désactiver « Renforcement GPU » et redémarrez.",
      "Le code QR n'apparaît pas : vérifiez Internet et rechargez avec F5.",
      "Pas de notifications : vérifiez Paramètres → Notifications et que le système autorise les alertes pour Catrip Connect.",
      "Tout de suite est vide mais je sais qu'il y a des messages : attendez quelques secondes ou ouvrez ✉ Actions en attente ; WhatsApp Web doit d'abord détecter les non lus.",
      "Un avatar est terne (« en veille ») : normal si vous n'utilisez pas ce compte depuis un moment. Cliquez pour le réactiver ; vous pouvez aussi désactiver la suspension dans Paramètres → Performances.",
      "Pas d'alertes d'un compte en veille : tant qu'il dort, ce compte ne vérifie pas les nouveaux messages. Ouvrez-le ou réduisez le délai de suspension si vous avez besoin d'alertes plus fréquentes.",
      "Je ne vois pas le bouton ⚡ : activez « Afficher la barre latérale » dans Paramètres et quittez le mode Zen.",
      "Pas d'icônes dans la zone de notification : sur certaines distributions Linux il faut installer le support des icônes de barre (AppIndicator).",
      "Le lien wa.me n'ouvre pas l'app : enregistrez Catrip Connect dans Paramètres → Général et fermez le navigateur avant de réessayer.",
      "Plusieurs comptes sont lents : activez « Suspendre les comptes inactifs », baissez la limite de processus ou utilisez moins de comptes actifs à la fois.",
    ],
    note: "Tenir l'application à jour résout souvent les problèmes de compatibilité avec WhatsApp Web.",
  },
  {
    id: "ayuda",
    title: "Plus d'aide",
    paragraphs: [
      "Depuis le menu Aide vous pouvez ouvrir ce manuel utilisateur, la liste des raccourcis clavier et la fenêtre « À propos » avec la version installée.",
      "Catrip Connect utilise le WhatsApp Web officiel dans le programme : tout ce qui fonctionne sur web.whatsapp.com (discussions, fichiers, statuts selon le support) fonctionne pareil ici.",
    ],
    bullets: [
      "Manuel utilisateur : guide complet avec sommaire (cette fenêtre).",
      "Raccourcis clavier : référence rapide.",
      "À propos : numéro de version installée.",
    ],
  },
];

export const manualDe = [
  {
    id: "bienvenida",
    title: "Was ist Catrip Connect?",
    paragraphs: [
      "Catrip Connect ist eine Desktop-Anwendung, mit der Sie WhatsApp Web mit einem oder mehreren Konten gleichzeitig nutzen können. Jedes Konto ist unabhängig: Nachrichten, Kontakte und Dateien eines Kontos vermischen sich nicht mit denen eines anderen.",
      "Der Hauptbildschirm zeigt WhatsApp wie im Browser, mit zusätzlichen Werkzeugen: Konto per Klick wechseln, Speicher sparen durch Aussetzen ungenutzter Konten, schneller Blick auf das Dringendste (Jetzt), alle ungelesenen Nachrichten sehen, Chats über Ctrl+K suchen, Desktop-Benachrichtigungen und vieles mehr.",
    ],
  },
  {
    id: "primeros-pasos",
    title: "Erste Schritte",
    steps: [
      "Öffnen Sie Catrip Connect über das Anwendungsmenü Ihres Systems (suchen Sie nach „Catrip Connect“).",
      "Beim ersten Start klicken Sie auf die Schaltfläche, um Ihr erstes Konto anzulegen. Geben Sie ihm einen erkennbaren Namen, z. B. „Privat“ oder „Arbeit“.",
      "Der WhatsApp-Web-QR-Code erscheint. Öffnen Sie auf dem Handy WhatsApp → Verknüpfte Geräte → Gerät verknüpfen und scannen Sie den Code.",
      "Wenn die Verbindung steht, sehen Sie Ihre Chats im großen Bereich des Fensters.",
      "Für ein weiteres Konto nutzen Sie „Neues Konto“ in der Seitenleiste oder im Menü Konten.",
    ],
    note: "Wenn der QR-Code abläuft, laden Sie die Ansicht mit F5 oder Chat → Neu laden.",
  },
  {
    id: "ventana",
    title: "Aufbau des Fensters",
    paragraphs: [
      "Das Fenster hat zwei Hauptbereiche. Links die Seitenleiste (manchmal „Rail“ genannt): Kontosymbole und Schnellzugriffe. Rechts der große Bereich ist WhatsApp Web des gewählten Kontos.",
      "Oben finden Sie die Menüleiste (Datei, Ansicht, Chat, Konten, Hilfe), wenn Sie sie in den Einstellungen aktiviert haben. Dort erreichen Sie fast alles aus diesem Handbuch.",
    ],
    bullets: [
      "Oben im Rail: Avatare Ihrer Konten (Klick zum Wechseln, Ziehen zum Sortieren).",
      "Unten im Rail: Aktionsschaltflächen — neues Konto, Chat per Nummer, neuer Chat, ⚡ Jetzt, ✉ ausstehend, ▤ Aktivität, Einstellungen und Zen-Modus.",
      "Mitte: Chats, Anrufe und Dateien von WhatsApp Web.",
      "Obenmenü: sortierte Zugriffe (inkl. Ansicht → Jetzt).",
    ],
  },
  {
    id: "cuentas",
    title: "Mit mehreren Konten arbeiten",
    paragraphs: [
      "Sie können mehrere WhatsApp-Konten in derselben App haben. Jedes hat ein eigenes farbiges Symbol in der Seitenleiste.",
    ],
    bullets: [
      "Klicken Sie auf ein Symbol, um zu diesem Konto zu wechseln.",
      "Ziehen Sie ein Symbol nach oben oder unten, um die Reihenfolge zu ändern.",
      "Ein grüner Punkt oder eine Zahl auf dem Symbol zeigt ungelesene Nachrichten auf diesem Konto.",
      "Wird ein Konto länger nicht genutzt, kann es „ruhend“ werden: der Avatar wirkt blasser, der Tooltip zeigt es. Die Sitzung bleibt gespeichert; ein Klick aktiviert sofort wieder.",
      "Fahren Sie mit der Maus über ein Symbol, um zu sehen, ob es verbunden, ruhend, QR wartend oder offline ist.",
      "Schnellzugriff: Ctrl+1 öffnet das erste Konto, Ctrl+2 das zweite, bis Ctrl+9.",
    ],
    note: "Unter Einstellungen → Konten können Sie jedes Konto umbenennen, die Symbolfarbe ändern oder es entfernen. Unter Einstellungen → Leistung legen Sie fest, wann inaktive Konten ruhen.",
  },
  {
    id: "reposo-cuentas",
    title: "Ruhende Konten (Speicher sparen)",
    paragraphs: [
      "Mit mehreren offenen Konten verbraucht jedes Speicher und CPU, solange WhatsApp Web geladen ist. Catrip Connect kann ungenutzte Konten „schlafen“ legen: die interne WhatsApp-Ansicht schließt, die Sitzung (Cookies und Login) bleibt auf der Festplatte.",
      "So bleibt die App mit drei, vier oder mehr Konten leichter, ohne sich abzumelden oder jedes Mal den QR neu zu scannen.",
    ],
    steps: [
      "Nutzen Sie ein Konto normal; beim Wechsel zu einem anderen zählt das vorherige die Inaktivitätszeit.",
      "Nach der eingestellten Schwelle (Standard 15 Minuten) geht das Konto in Ruhe: sein Avatar im Rail wirkt abgeschwächt.",
      "Zum Aktivieren klicken Sie den Avatar, wählen einen Chat über ✉ ausstehend, Ctrl+K oder öffnen einen wa.me-Link für dieses Konto.",
      "WhatsApp Web lädt in wenigen Sekunden mit derselben Sitzung neu; kein erneutes QR-Scannen nötig.",
    ],
    bullets: [
      "Standardmäßig aktiv unter Einstellungen → Leistung → „Inaktive Konten aussetzen“.",
      "Wartezeit wählbar: 5, 10, 15, 30 oder 60 Minuten.",
      "Das aktive Konto wird nie ausgesetzt.",
      "Läuft ein Videoanruf auf einem Konto, wird es nicht ausgesetzt, bis Sie auflegen.",
      "Deaktivieren der Option aktiviert sofort alle ruhenden Konten wieder.",
    ],
    note: "Während ein Konto ruht, können Benachrichtigungen und Zähler dieses Kontos erst nach dem Öffnen aktualisieren. Das aktive Konto und häufig genutzte erhalten Benachrichtigungen normal.",
  },
  {
    id: "zen",
    title: "Zen-Modus (nur Chat)",
    paragraphs: [
      "Der Zen-Modus blendet die Seitenleiste aus, damit WhatsApp das ganze Fenster füllt. Nützlich, wenn Sie sich auf ein Gespräch konzentrieren wollen.",
    ],
    bullets: [
      "Aktivieren über Ansicht → Zen-Modus, mit Ctrl+Shift+Z oder Suche nach „Zen“ in der Befehlspalette (Ctrl+K).",
      "Zur normalen Ansicht: Escape drücken oder den Kurzbefehl wiederholen.",
      "Beim Öffnen der Einstellungen schaltet sich der Zen-Modus automatisch aus.",
    ],
    note: "Im Zen-Modus sehen Sie die ⚡-Schaltfläche im Rail nicht; verlassen Sie Zen oder nutzen Sie Ctrl+Shift+A für Jetzt.",
  },
  {
    id: "ahora-mismo",
    title: "Jetzt — Dringendes auf einen Blick",
    paragraphs: [
      "Jetzt ist ein kleines Panel neben der Seitenleiste. Es zeigt bis zu drei Chats mit ungelesenen Nachrichten, die dringendsten über alle Konten. Anders als die großen Ansichten (Aktivitätszentrum oder ausstehende Aktionen) verdeckt es WhatsApp nicht: Sie lesen die Zusammenfassung und sehen den Chat daneben.",
    ],
    steps: [
      "Drücken Sie ⚡ in der Seitenleiste, Ctrl+Shift+A oder Ansicht → Jetzt.",
      "Prüfen Sie die Liste: Kontaktname, Konto (Privat, Arbeit…), Anzahl ungelesen und eine Zeile der letzten Nachricht.",
      "Klicken Sie eine Zeile, um den Chat im richtigen Konto zu öffnen. Das Panel schließt sich von selbst.",
      "Für mehr Chats klicken Sie unten auf „Alle Ausstehenden anzeigen“.",
      "Schließen ohne Öffnen: Escape, das X des Panels oder Klick außerhalb.",
    ],
    bullets: [
      "Ein grüner Punkt am ⚡-Button bedeutet dringende ausstehende Chats.",
      "Ohne Ungelesene sagt das Panel es Ihnen („Alles erledigt“).",
      "Sie können auch „Jetzt“ in der Ctrl+K-Palette eingeben.",
    ],
    note: "Das Panel nutzt dieselben Ungelesen-Infos wie WhatsApp Web. Wenn Sie einen Chat gerade auf dem Handy gelesen haben, kann es ein paar Sekunden dauern, bis er aus der Liste verschwindet.",
  },
  {
    id: "actividad",
    title: "Aktivitätszentrum und ausstehende Aktionen",
    paragraphs: [
      "Neben Jetzt gibt es zwei breitere Ansichten, wenn Sie alles in Ruhe prüfen möchten.",
    ],
    table: {
      headers: ["Werkzeug", "Wann nutzen", "So öffnen"],
      rows: [
        [
          "⚡ Jetzt",
          "Schneller Blick: Top 3 dringend ohne Bildschirm zu verdecken",
          "⚡-Button, Ctrl+Shift+A, Ansicht → Jetzt",
        ],
        [
          "▤ Aktivitätszentrum",
          "Zusammenfassung pro Konto: wer schrieb und Vorschau",
          "▤-Button oder Ctrl+K → „Aktivität“",
        ],
        [
          "✉ Ausstehende Aktionen",
          "Vollständige Liste aller ungelesenen Chats",
          "✉-Button oder Ctrl+K → „ausstehend“",
        ],
        ["Ctrl+K → Chats", "Kontakt per Name oder Text finden", "Ctrl+K und Namen eingeben"],
      ],
    },
    bullets: [
      "Aktivitätszentrum (▤): eine Karte pro Konto mit Ungelesen-Gesamt und letzter Nachricht.",
      "Ausstehende Aktionen (✉): flache Liste nach Dringlichkeit über alle Konten.",
      "Von Jetzt springen Sie mit einem Klick zur vollen Übersicht.",
    ],
  },
  {
    id: "paleta",
    title: "Befehlspalette (Schnellsuche)",
    paragraphs: [
      "Drücken Sie jederzeit Ctrl+K für eine Suche. Tippen Sie, was Sie brauchen, die Liste filtert sofort.",
      "Neben Konten und Aktionen können Sie Chats mit Ungelesenen suchen: Kontaktname, Text der letzten Nachricht oder Kontoname (z. B. „Anna“ oder „Arbeit Budget“). Beim Auswählen öffnet die App den Chat im richtigen Konto.",
    ],
    bullets: [
      "Pfeiltasten hoch/runter zur Auswahl.",
      "Enter zum Ausführen (Chat öffnen, Konto wechseln — ggf. aus Ruhe aktivieren —, Jetzt öffnen, Einstellungen, usw.).",
      "Escape zum Schließen ohne Aktion.",
      "Passende Chats erscheinen oben unter „Chats“.",
      "Nützliche Befehle: „Jetzt“, „Ausstehende Aktionen“, „Aktivitätszentrum“, „Neues Konto“, „Zen-Modus“.",
    ],
    note: "Die Chat-Suche nutzt ungelesene Unterhaltungen, die WhatsApp Web pro Konto anzeigt. Ohne ausstehende Nachrichten erscheint ein Chat ggf. erst bei neuer Aktivität.",
  },
  {
    id: "chat-numero",
    title: "Jemanden per Nummer anschreiben",
    steps: [
      "Drücken Sie Ctrl+M oder suchen Sie „Telefon“ in der Palette (Ctrl+K).",
      "Geben Sie die Nummer mit Ländervorwahl ein, z. B. +4915123456789.",
      "Bestätigen. Der Chat öffnet sich im aktiven Konto.",
    ],
    note: "Die Nummer muss die Ländervorwahl enthalten (+ und die richtigen Ziffern).",
  },
  {
    id: "enlaces",
    title: "WhatsApp-Links aus dem Web öffnen",
    paragraphs: [
      "Wenn Ihnen jemand einen wa.me-Link schickt oder Sie whatsapp:// aus einer anderen App öffnen, kann Catrip Connect den Chat direkt öffnen.",
    ],
    bullets: [
      "Nach der Installation können Sie unter Einstellungen → Allgemein Catrip Connect als Standard für WhatsApp-Links registrieren.",
      "Unter „Eingehende WhatsApp-Links“ wählen Sie das Konto: bei mehreren fragen, immer aktives Konto oder festes Konto.",
      "Enthält der Link eine vorgefüllte Nachricht, erscheint sie sendebereit im Chat.",
      "Gruppeneinladungen (chat.whatsapp.com) können ebenfalls in der App geöffnet werden.",
    ],
    note: "Meldet der Browser, dass keine App verfügbar ist, nutzen Sie „Als Standard-App registrieren“ unter Einstellungen → Allgemein.",
  },
  {
    id: "ajustes-general",
    title: "Einstellungen — Allgemein",
    paragraphs: [
      "Öffnen Sie Einstellungen mit Ctrl+P oder über das Datei-Menü. Allgemein steuert das tägliche Verhalten der App.",
    ],
    bullets: [
      "Minimiert starten: die App startet im Tray ohne Fenster.",
      "Seitenleiste anzeigen: Kontospalte ein-/ausblenden (nötig für ⚡, ✉ und ▤).",
      "Menüleiste anzeigen: die Leiste Datei / Ansicht / Chat oben.",
      "Beim Schließen in Tray minimieren: mit X läuft die App im Hintergrund weiter (empfohlen).",
      "Automatisch mit dem System starten: Catrip Connect beim Hochfahren öffnen.",
      "Download-Ordner: wo empfangene WhatsApp-Dateien landen.",
      "Interface-Skalierung: Text und Symbole vergrößern oder verkleinern (100 % bis 200 %).",
      "Beim Start nach Updates suchen: Hinweis bei neuer Version.",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "Einstellungen — Konten",
    bullets: [
      "Umbenennen: sichtbaren Kontonamen ändern (nur in Catrip Connect, nicht in WhatsApp).",
      "Symbol neu erzeugen oder Farbvariante wählen: Avatar in der Seitenleiste anpassen.",
      "Benachrichtigungen pro Konto: Alerts für ein Konto ein- oder ausschalten.",
      "Konto entfernen: Sitzung aus der App entfernen (löscht WhatsApp nicht auf dem Handy).",
    ],
    note: "Ein Konto in Catrip Connect zu entfernen meldet Sie auf dem Telefon nicht ab; es wird nur nicht mehr in der App angezeigt.",
  },
  {
    id: "ajustes-notificaciones",
    title: "Einstellungen — Benachrichtigungen",
    bullets: [
      "Systembenachrichtigungen: Desktop-Hinweise bei neuen Nachrichten.",
      "Kontoname anzeigen: im Hinweis steht „Arbeit“, „Privat“ usw.",
      "Vorschau anzeigen: eine Zeile der Nachricht im Hinweis.",
      "Nicht stören: keine Pop-ups (Tray-Zähler funktioniert weiter).",
      "Systemton: Signalton bei einer Benachrichtigung.",
    ],
    note: "Ein Klick auf eine Benachrichtigung öffnet das Fenster und wählt das empfangende Konto. Danach können Sie mit ⚡ sehen, was noch aussteht.",
  },
  {
    id: "ajustes-red",
    title: "Einstellungen — Netzwerk",
    paragraphs: [
      "Dieser Bereich ist nur nötig, wenn Ihre Verbindung über einen Proxy läuft (Firmennetz, spezielles VPN usw.). Aktivieren Sie „Netzwerk-Proxy“ und tragen Sie die Vorgaben Ihres Administrators ein.",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "Einstellungen — Leistung",
    paragraphs: [
      "Dieser Bereich hilft, Flüssigkeit, Speicherverbrauch und Stabilität bei mehreren gleichzeitigen Konten auszugleichen.",
    ],
    bullets: [
      "Inaktive Konten aussetzen: gibt RAM frei, indem die WhatsApp-Ansicht ungenutzter Konten geschlossen wird. Die Sitzung bleibt auf der Festplatte.",
      "Aussetzen nach (Minuten): wie lange ohne Nutzung bis Ruhezustand (5 bis 60 Minuten).",
      "GPU-Verstärkung: verbessert Videoflüssigkeit auf manchen Linux-Rechnern. App-Neustart nötig.",
      "Renderer-Prozesslimit: hilfreich bei vielen Konten bei knappem RAM. Neustart nötig.",
      "Ruhezustand während Videoanruf verhindern: das System schläft nicht, solange ein aktiver Anruf in WhatsApp Web läuft.",
      "Cache leeren: wenn WhatsApp langsam ist oder Dateien scheitern, Cache leeren (ohne Abmeldung).",
    ],
    note: "Kontoaussetzung und Prozesslimit gehen dasselbe Problem (Speicher) unterschiedlich an: erstes schließt ungenutzte Ansichten; zweites begrenzt Chromium-Prozesse insgesamt.",
  },
  {
    id: "bandeja",
    title: "Symbol im System-Tray",
    paragraphs: [
      "Neben der Uhr (Linux) erscheint das Catrip-Connect-Symbol. Dort können Sie das Fenster wiederherstellen oder ganz beenden.",
    ],
    bullets: [
      "Klick auf das Symbol: Hauptfenster ein- oder ausblenden.",
      "Kontextmenü: listet Konten mit Status und Ungelesenen; auch Beenden möglich.",
      "Zähler am Symbol: Gesamtzahl ungelesener Nachrichten (wenn in Einstellungen aktiv).",
      "Beim Wiederherstellen aus dem Tray: Fenster in gleicher Größe und Position wie zuvor.",
    ],
  },
  {
    id: "actualizaciones",
    title: "Die Anwendung aktualisieren",
    paragraphs: [
      "Mit aktivem „Beim Start nach Updates suchen“ prüft Catrip Connect online auf neue Versionen.",
    ],
    bullets: [
      "Bei installiertem .deb-Paket: die App zeigt Neuerungen und lädt den Installer in einen Ordner Ihrer Wahl oder öffnet den Link im Browser. Sie entscheiden, wann Sie installieren.",
      "Bei AppImage: der Download kann automatisch laufen; wenn fertig, „Jetzt neu starten“.",
      "Das Update-Panel scrollt, damit Sie alle Neuerungen lesen können, ohne das Fenster zu vergrößern.",
    ],
  },
  {
    id: "atajos",
    title: "Tastenkürzel",
    table: {
      headers: ["Kürzel", "Wirkung"],
      rows: [
        ["Ctrl+K", "Suche öffnen (ungelesene Chats, Konten und Aktionen)"],
        ["Ctrl+P", "Einstellungen öffnen"],
        ["Ctrl+1 … Ctrl+9", "Zu Konto 1, 2, 3… (bis 9)"],
        ["Ctrl+N", "Neuer Chat in WhatsApp Web"],
        ["Ctrl+M", "Chat per Telefonnummer"],
        ["Ctrl+U", "Neues Konto"],
        ["Ctrl+Shift+A", "Jetzt öffnen oder schließen (Top 3 dringend)"],
        ["Ctrl+Shift+Z", "Zen-Modus ein/aus"],
        ["Escape", "Jetzt schließen, Zen verlassen oder Palette schließen"],
        ["Ctrl+W", "Fenster ausblenden"],
        ["Ctrl+Q", "Anwendung beenden"],
        ["F5", "WhatsApp Web neu laden"],
        ["F11", "Vollbild"],
      ],
    },
    note: "Kurzliste auch unter Hilfe → Tastenkürzel und vollständiges Handbuch unter Hilfe → Benutzerhandbuch.",
  },
  {
    id: "problemas",
    title: "Tipps und häufige Probleme",
    bullets: [
      "WhatsApp lädt nicht oder bleibt schwarz: Chat → Neu laden (F5). Wenn es bleibt, unter Einstellungen → Leistung „GPU-Verstärkung“ umschalten und neu starten.",
      "QR-Code erscheint nicht: Internet prüfen und mit F5 neu laden.",
      "Keine Benachrichtigungen: Einstellungen → Benachrichtigungen und Systemberechtigung für Catrip Connect prüfen.",
      "Jetzt ist leer, aber es gibt Nachrichten: ein paar Sekunden warten oder ✉ Ausstehende Aktionen öffnen; WhatsApp Web muss Ungelesene zuerst erkennen.",
      "Avatar wirkt blass („ruhend“): normal bei längerer Nichtnutzung. Klicken zum Aktivieren; Aussetzen kann unter Einstellungen → Leistung deaktiviert werden.",
      "Keine Alerts von ruhendem Konto: im Schlaf prüft es keine neuen Nachrichten. Öffnen oder kürzere Aussetzzeit, wenn Sie öfter Alerts brauchen.",
      "Kein ⚡-Button: „Seitenleiste anzeigen“ in Einstellungen aktivieren und Zen-Modus verlassen.",
      "Keine Tray-Symbole: auf manchen Linux-Distributionen Tray-Unterstützung installieren (AppIndicator).",
      "wa.me-Link öffnet die App nicht: Catrip Connect unter Einstellungen → Allgemein registrieren und Browser schließen, dann erneut versuchen.",
      "Mehrere Konten langsam: „Inaktive Konten aussetzen“ aktivieren, Prozesslimit senken oder weniger Konten gleichzeitig aktiv nutzen.",
    ],
    note: "Aktuelle App-Version behebt oft Kompatibilitätsprobleme mit WhatsApp Web.",
  },
  {
    id: "ayuda",
    title: "Weitere Hilfe",
    paragraphs: [
      "Über das Hilfe-Menü öffnen Sie dieses Benutzerhandbuch, die Tastenkürzel-Liste und „Über“ mit der installierten Version.",
      "Catrip Connect nutzt offizielles WhatsApp Web in der App: alles, was auf web.whatsapp.com funktioniert (Chats, Dateien, Status je nach Support), funktioniert hier gleich.",
    ],
    bullets: [
      "Benutzerhandbuch: vollständiger Leitfaden mit Inhaltsverzeichnis (dieses Fenster).",
      "Tastenkürzel: Kurzreferenz.",
      "Über: installierte Versionsnummer.",
    ],
  },
];

export const manualKo = [
  {
    id: "bienvenida",
    title: "Catrip Connect란?",
    paragraphs: [
      "Catrip Connect는 하나 또는 여러 WhatsApp 계정을 동시에 WhatsApp Web으로 사용할 수 있는 데스크톱 프로그램입니다. 각 계정은 독립적이며, 한 계정의 메시지·연락처·파일이 다른 계정과 섞이지 않습니다.",
      "메인 화면은 브라우저에서 알고 있는 WhatsApp에 추가 도구를 더합니다. 클릭 한 번으로 계정 전환, 사용하지 않는 계정 일시 중지로 메모리 절약, 가장 긴급한 항목(지금) 빠른 확인, 읽지 않은 메시지 전체 보기, Ctrl+K로 채팅 검색, 바탕화면 알림 등.",
    ],
  },
  {
    id: "primeros-pasos",
    title: "시작하기",
    steps: [
      "시스템 앱 메뉴에서 Catrip Connect를 엽니다(「Catrip Connect」 검색).",
      "처음이면 첫 계정 만들기 버튼을 누릅니다. 「개인」, 「업무」처럼 알아볼 수 있는 이름을 지정하세요.",
      "WhatsApp Web QR 코드가 표시됩니다. 휴대폰에서 WhatsApp → 연결된 기기 → 기기 연결을 열고 코드를 스캔하세요.",
      "연결이 완료되면 창의 넓은 영역에 채팅이 보입니다.",
      "다른 계정을 추가하려면 사이드바 rail의 「새 계정」 버튼 또는 계정 메뉴를 사용하세요.",
    ],
    note: "QR 코드가 만료되면 F5 또는 채팅 → 새로고침으로 화면을 다시 로드하세요.",
  },
  {
    id: "ventana",
    title: "창 구성",
    paragraphs: [
      "창은 두 영역으로 나뉩니다. 왼쪽은 사이드바 rail(계정 아이콘과 빠른 실행). 오른쪽 넓은 영역은 선택한 계정의 WhatsApp Web입니다.",
      "상단에는 설정에서 활성화한 경우 메뉴 막대(파일, 보기, 채팅, 계정, 도움말)가 있습니다. 이 매뉴얼의 대부분 기능에 접근할 수 있습니다.",
    ],
    bullets: [
      "rail 상단: 계정 아바타(클릭으로 전환, 드래그로 순서 변경).",
      "rail 하단: 새 계정, 번호로 채팅, 새 채팅, ⚡ 지금, ✉ 대기, ▤ 활동, 설정, Zen 모드.",
      "중앙: WhatsApp Web의 채팅, 통화, 파일.",
      "상단 메뉴: 분류된 바로가기(보기 → 지금 포함).",
    ],
  },
  {
    id: "cuentas",
    title: "여러 계정 사용",
    paragraphs: [
      "한 앱에서 여러 WhatsApp 계정을 사용할 수 있습니다. 각 계정은 사이드바 rail에 색이 다른 아이콘이 있습니다.",
    ],
    bullets: [
      "아이콘을 클릭하면 해당 계정으로 전환합니다.",
      "아이콘을 위·아래로 드래그해 목록 순서를 바꿉니다.",
      "아이콘의 초록 점이나 숫자는 해당 계정의 읽지 않은 메시지를 뜻합니다.",
      "한동안 사용하지 않으면 「휴면」 상태가 될 수 있습니다. 아바타가 흐리게 보이고 툴팁에 표시됩니다. 세션은 저장되며 클릭 한 번으로 즉시 활성화됩니다.",
      "아이콘에 마우스를 올리면 연결됨, 휴면, QR 대기, 오프라인 여부를 확인할 수 있습니다.",
      "빠른 단축키: Ctrl+1은 첫 계정, Ctrl+2는 두 번째, Ctrl+9까지.",
    ],
    note: "설정 → 계정에서 이름 변경, 아이콘 색 변경, 삭제가 가능합니다. 설정 → 성능에서 비활성 계정이 휴면으로 들어가는 시점을 설정합니다.",
  },
  {
    id: "reposo-cuentas",
    title: "휴면 계정(메모리 절약)",
    paragraphs: [
      "여러 계정이 열려 있으면 각각 WhatsApp Web을 유지하며 메모리와 CPU를 사용합니다. Catrip Connect는 사용하지 않는 계정을 「잠들게」 할 수 있습니다. 내부 WhatsApp 화면은 닫고 세션(쿠키·로그인)은 디스크에 보관합니다.",
      "로그아웃하거나 매번 QR을 다시 스캔하지 않고도 3~4개 이상 계정에서 앱을 가볍게 유지할 수 있습니다.",
    ],
    steps: [
      "계정을 평소처럼 사용하세요. 다른 계정으로 바꾸면 이전 계정의 비활성 시간이 측정됩니다.",
      "설정된 임계값(기본 15분) 후 계정이 휴면으로 들어가며 rail의 아바타가 흐려집니다.",
      "다시 쓰려면 아바타를 클릭하거나 ✉ 대기, Ctrl+K에서 채팅을 고르거나 해당 계정용 wa.me 링크를 여세요.",
      "몇 초 안에 같은 세션으로 WhatsApp Web이 다시 로드됩니다. QR 재스캔은 필요 없습니다.",
    ],
    bullets: [
      "설정 → 성능 → 「비활성 계정 일시 중지」가 기본으로 켜져 있습니다.",
      "대기 시간: 5, 10, 15, 30, 60분 중 선택.",
      "활성 계정은 절대 일시 중지되지 않습니다.",
      "화상 통화 중인 계정은 끊기 전까지 일시 중지되지 않습니다.",
      "옵션을 끄면 휴면이던 모든 계정이 즉시 다시 활성화됩니다.",
    ],
    note: "휴면 중에는 해당 계정의 알림·카운터가 열기 전까지 갱신되지 않을 수 있습니다. 활성 계정과 자주 쓰는 계정은 알림을 정상적으로 받습니다.",
  },
  {
    id: "zen",
    title: "Zen 모드(채팅만)",
    paragraphs: [
      "Zen 모드는 사이드바 rail을 숨겨 WhatsApp이 창 전체를 채웁니다. 한 대화에 집중할 때 유용합니다.",
    ],
    bullets: [
      "보기 → Zen 모드, Ctrl+Shift+Z, 또는 명령 팔레트(Ctrl+K)에서 「Zen」 검색으로 켭니다.",
      "일반 보기로 돌아가려면 Escape를 누르거나 단축키를 다시 누르세요.",
      "설정에 들어가면 Zen 모드가 자동으로 꺼집니다.",
    ],
    note: "Zen 모드에서는 rail의 ⚡ 버튼이 보이지 않습니다. Zen을 끄거나 Ctrl+Shift+A로 지금을 여세요.",
  },
  {
    id: "ahora-mismo",
    title: "지금 — 긴급 항목 한눈에",
    paragraphs: [
      "지금은 사이드바 rail 옆의 작은 패널입니다. 모든 계정에서 가장 긴급한 읽지 않은 대화 최대 3개를 보여 줍니다. 활동 센터나 대기 작업 같은 큰 화면과 달리 WhatsApp을 가리지 않아 요약을 보며 옆에서 채팅을 볼 수 있습니다.",
    ],
    steps: [
      "사이드바 rail의 ⚡ 버튼, Ctrl+Shift+A, 또는 보기 → 지금을 사용하세요.",
      "목록을 확인합니다. 연락처 이름, 계정(개인, 업무…), 읽지 않은 수, 마지막 메시지 한 줄이 보입니다.",
      "행을 클릭하면 올바른 계정에서 해당 채팅이 열리고 패널은 자동으로 닫힙니다.",
      "더 많은 대화가 필요하면 패널 하단의 「모든 대기 항목 보기」를 누르세요.",
      "열지 않고 닫기: Escape, 패널 X, 또는 바깥 클릭.",
    ],
    bullets: [
      "⚡ 버튼의 초록 점은 긴급 대기 채팅이 있음을 뜻합니다.",
      "읽지 않은 메시지가 없으면 「모두 확인했습니다」라고 표시됩니다.",
      "Ctrl+K 팔레트에 「지금」을 입력해도 됩니다.",
    ],
    note: "패널은 WhatsApp Web과 같은 읽지 않음 정보를 사용합니다. 휴대폰에서 방금 읽은 채팅은 목록에서 사라지기까지 몇 초 걸릴 수 있습니다.",
  },
  {
    id: "actividad",
    title: "활동 센터와 대기 작업",
    paragraphs: ["지금 외에도 차분히 전체를 검토할 때 쓰는 두 가지 넓은 보기가 있습니다."],
    table: {
      headers: ["도구", "사용 시점", "여는 방법"],
      rows: [
        [
          "⚡ 지금",
          "빠른 확인: 화면을 가리지 않는 상위 3개 긴급",
          "⚡ 버튼, Ctrl+Shift+A, 보기 → 지금",
        ],
        ["▤ 활동 센터", "계정별 요약: 누가 썼는지와 미리보기", "▤ 버튼 또는 Ctrl+K → 「활동」"],
        ["✉ 대기 작업", "읽지 않은 모든 채팅 전체 목록", "✉ 버튼 또는 Ctrl+K → 「대기」"],
        ["Ctrl+K → 채팅", "이름이나 텍스트로 연락처 찾기", "Ctrl+K 후 이름 입력"],
      ],
    },
    bullets: [
      "활동 센터(▤): 계정마다 카드 하나, 읽지 않음 합계와 마지막 메시지.",
      "대기 작업(✉): 모든 계정의 긴급도 순 평면 목록.",
      "지금에서 클릭 한 번으로 전체 받은함으로 이동할 수 있습니다.",
    ],
  },
  {
    id: "paleta",
    title: "명령 팔레트(빠른 검색)",
    paragraphs: [
      "언제든 Ctrl+K로 검색창을 엽니다. 입력하면 목록이 즉시 필터됩니다.",
      "계정·작업 외에 읽지 않은 대화도 검색할 수 있습니다. 연락처 이름, 마지막 메시지 일부, 계정 이름(예: 「Ana」, 「업무 예산」)을 입력하세요. 채팅을 선택하면 올바른 계정에서 열립니다.",
    ],
    bullets: [
      "위·아래 화살표로 옵션 선택.",
      "Enter로 실행(채팅 열기, 계정 전환 — 휴면이면 활성화 —, 지금 열기, 설정 등).",
      "Escape로 아무 것도 하지 않고 닫기.",
      "일치하는 채팅은 「채팅」 섹션 상단에 표시됩니다.",
      "유용한 명령: 「지금」, 「대기 작업」, 「활동 센터」, 「새 계정」, 「Zen 모드」.",
    ],
    note: "채팅 검색은 각 계정의 WhatsApp Web에 표시된 읽지 않은 대화를 사용합니다. 대기 메시지가 없으면 새 활동이 있을 때까지 나타나지 않을 수 있습니다.",
  },
  {
    id: "chat-numero",
    title: "번호로 메시지 보내기",
    steps: [
      "Ctrl+M을 누르거나 팔레트(Ctrl+K)에서 「전화」를 검색하세요.",
      "국제 번호 형식으로 입력하세요. 예: +821012345678.",
      "확인을 누르면 현재 활성 계정에서 대화가 열립니다.",
    ],
    note: "번호에는 국가 코드(+와 해당 숫자)가 포함되어야 합니다.",
  },
  {
    id: "enlaces",
    title: "웹에서 WhatsApp 링크 열기",
    paragraphs: [
      "누군가 wa.me 링크를 보내거나 다른 앱에서 whatsapp:// 링크를 열면 Catrip Connect가 채팅을 바로 열 수 있습니다.",
    ],
    bullets: [
      "설치 후 설정 → 일반에서 Catrip Connect를 WhatsApp 링크 기본 앱으로 등록할 수 있습니다.",
      "「들어오는 WhatsApp 링크」에서 계정 선택: 여러 개면 묻기, 항상 활성 계정, 고정 계정.",
      "링크에 미리 채운 메시지가 있으면 채팅에 보낼 준비가 된 상태로 표시됩니다.",
      "그룹 초대(chat.whatsapp.com)도 앱에서 열 수 있습니다.",
    ],
    note: "브라우저에 사용 가능한 앱이 없다고 하면 설정 → 일반의 「기본 앱으로 등록」을 사용하고 브라우저를 닫은 뒤 다시 시도하세요.",
  },
  {
    id: "ajustes-general",
    title: "설정 — 일반",
    paragraphs: ["Ctrl+P 또는 파일 메뉴로 설정을 엽니다. 일반은 앱의 일상 동작을 제어합니다."],
    bullets: [
      "최소화 상태로 시작: 창 없이 트레이에서 시작.",
      "사이드바 rail 표시: 계정 열 표시/숨김(⚡, ✉, ▤에 필요).",
      "메뉴 막대 표시: 상단 파일/보기/채팅 막대.",
      "닫을 때 트레이로 최소화: X를 눌러도 백그라운드 실행(권장).",
      "시스템과 함께 자동 시작: 컴퓨터 부팅 시 Catrip Connect 실행.",
      "다운로드 폴더: WhatsApp으로 받은 파일 저장 위치.",
      "UI 배율: 텍스트·아이콘 크기 조절(100%~200%).",
      "시작 시 업데이트 확인: 새 버전 알림.",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "설정 — 계정",
    bullets: [
      "이름 변경: 계정 표시 이름 변경(Catrip Connect에만 해당, WhatsApp 아님).",
      "아이콘 재생성 또는 색 변형: 사이드바 rail 아바타 사용자 지정.",
      "계정별 알림: 특정 계정 알림 켜기/끄기.",
      "계정 삭제: 앱에서 세션 제거(휴대폰 WhatsApp은 삭제하지 않음).",
    ],
    note: "Catrip Connect에서 계정을 삭제해도 휴대폰 WhatsApp은 로그아웃되지 않으며, 프로그램에만 표시되지 않습니다.",
  },
  {
    id: "ajustes-notificaciones",
    title: "설정 — 알림",
    bullets: [
      "시스템 알림: 메시지 도착 시 바탕화면 알림.",
      "계정 이름 표시: 「업무」, 「개인」 등 표시.",
      "미리보기 표시: 알림에 메시지 한 줄.",
      "방해 금지: 팝업 없음(트레이 카운터는 계속 동작).",
      "시스템 소리: 알림 시 비프음.",
    ],
    note: "알림을 클릭하면 창이 열리고 메시지를 받은 계정이 선택됩니다. 이후 ⚡로 남은 대기 항목을 확인할 수 있습니다.",
  },
  {
    id: "ajustes-red",
    title: "설정 — 네트워크",
    paragraphs: [
      "연결이 프록시를 거치는 경우(회사망, 특수 VPN 등)에만 필요합니다. 「네트워크 프록시」를 켜고 관리자가 준 규칙을 입력하세요.",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "설정 — 성능",
    paragraphs: ["여러 계정을 동시에 쓸 때 유창성, 메모리, 안정성의 균형을 맞추는 섹션입니다."],
    bullets: [
      "비활성 계정 일시 중지: 잠시 선택하지 않은 계정의 WhatsApp 화면을 닫아 RAM 확보. 세션은 디스크에 유지.",
      "일시 중지까지(분): 휴면 전 비사용 시간(5~60분).",
      "GPU 강화: 일부 Linux에서 동영상 유창성 개선. 앱 재시작 필요.",
      "렌더러 프로세스 제한: 메모리가 부족하고 계정이 많을 때 유용. 재시작 필요.",
      "화상 통화 중 절전 방지: WhatsApp Web에서 통화 중 시스템이 잠들지 않음.",
      "캐시 지우기: WhatsApp이 느리거나 파일 오류 시 시도(로그아웃 없음).",
    ],
    note: "계정 일시 중지와 프로세스 제한은 같은 문제(메모리)를 다른 각도에서 다룹니다. 전자는 쓰지 않는 화면을 닫고, 후자는 Chromium 프로세스 총수를 제한합니다.",
  },
  {
    id: "bandeja",
    title: "시스템 트레이 아이콘",
    paragraphs: [
      "바탕화면 시계 옆(Linux)에 Catrip Connect 아이콘이 있습니다. 창 복원 또는 완전 종료가 가능합니다.",
    ],
    bullets: [
      "아이콘 클릭: 메인 창 표시/숨김.",
      "컨텍스트 메뉴: 계정 목록과 상태·읽지 않음, 종료.",
      "아이콘 배지: 읽지 않은 총 개수(설정에서 켠 경우).",
      "트레이에서 복원 시 이전과 같은 크기·위치로 돌아옵니다.",
    ],
  },
  {
    id: "actualizaciones",
    title: "앱 업데이트",
    paragraphs: [
      "「시작 시 업데이트 확인」이 켜져 있으면 Catrip Connect가 온라인에서 새 버전을 확인합니다.",
    ],
    bullets: [
      ".deb 패키지 설치 시: 새 소식을 보여 주고 설치 프로그램을 원하는 폴더에 받거나 브라우저에서 링크를 엽니다. 설치 시점은 사용자가 결정합니다.",
      "AppImage 사용 시: 다운로드가 자동일 수 있으며, 준비되면 「지금 다시 시작」을 누릅니다.",
      "업데이트 패널은 스크롤되어 창 크기를 바꾸지 않고 모든 새 소식을 읽을 수 있습니다.",
    ],
  },
  {
    id: "atajos",
    title: "키보드 단축키",
    table: {
      headers: ["단축키", "동작"],
      rows: [
        ["Ctrl+K", "검색 열기(읽지 않은 채팅, 계정, 작업)"],
        ["Ctrl+P", "설정 열기"],
        ["Ctrl+1 … Ctrl+9", "계정 1, 2, 3…(최대 9)"],
        ["Ctrl+N", "WhatsApp Web에서 새 채팅"],
        ["Ctrl+M", "전화번호로 채팅"],
        ["Ctrl+U", "새 계정"],
        ["Ctrl+Shift+A", "지금 열기/닫기(상위 3개 긴급)"],
        ["Ctrl+Shift+Z", "Zen 모드 켜기/끄기"],
        ["Escape", "지금 닫기, Zen 종료, 팔레트 닫기"],
        ["Ctrl+W", "창 숨기기"],
        ["Ctrl+Q", "앱 종료"],
        ["F5", "WhatsApp Web 새로고침"],
        ["F11", "전체 화면"],
      ],
    },
    note: "도움말 → 키보드 단축키에서 빠른 목록, 도움말 → 사용자 매뉴얼에서 전체 매뉴얼을 볼 수 있습니다.",
  },
  {
    id: "problemas",
    title: "팁과 자주 묻는 문제",
    bullets: [
      "WhatsApp이 로드되지 않거나 검은 화면: 채팅 → 새로고침(F5). 계속되면 설정 → 성능에서 「GPU 강화」를 바꾸고 재시작.",
      "QR 코드가 안 보임: 인터넷 확인 후 F5로 새로고침.",
      "알림이 안 옴: 설정 → 알림과 시스템에서 Catrip Connect 알림 허용 확인.",
      "지금이 비었는데 메시지가 있다고 생각함: 몇 초 기다리거나 ✉ 대기 작업 열기. WhatsApp Web이 먼저 읽지 않음을 감지해야 함.",
      "아바타가 흐림(「휴면」): 한동안 안 쓴 계정이면 정상. 클릭해 활성화하거나 설정 → 성능에서 일시 중지 끄기.",
      "휴면 계정 알림 없음: 잠든 동안 새 메시지를 확인하지 않음. 더 자주 알림이 필요하면 열거나 일시 중지 시간을 줄이세요.",
      "⚡ 버튼이 안 보임: 설정에서 「사이드바 rail 표시」 켜고 Zen 모드 종료.",
      "트레이 아이콘이 안 보임: 일부 Linux 배포판에서는 트레이 아이콘 지원(AppIndicator) 설치 필요.",
      "wa.me 링크가 앱을 안 염: 설정 → 일반에서 등록 후 브라우저를 닫고 다시 시도.",
      "여러 계정이 느림: 「비활성 계정 일시 중지」 켜기, 프로세스 제한 낮추기, 동시 활성 계정 수 줄이기.",
    ],
    note: "앱을 최신으로 유지하면 WhatsApp Web 호환 문제가 자주 해결됩니다.",
  },
  {
    id: "ayuda",
    title: "추가 도움말",
    paragraphs: [
      "도움말 메뉴에서 이 사용자 매뉴얼, 키보드 단축키 목록, 설치된 버전이 있는 「정보」 창을 열 수 있습니다.",
      "Catrip Connect는 공식 WhatsApp Web을 앱 안에서 사용합니다. web.whatsapp.com에서 되는 기능(채팅, 파일, 지원되는 상태 등)은 여기서도 동일합니다.",
    ],
    bullets: [
      "사용자 매뉴얼: 목차가 있는 전체 가이드(이 창).",
      "키보드 단축키: 빠른 참조.",
      "정보: 설치된 버전 번호.",
    ],
  },
];

export const manualJa = [
  {
    id: "bienvenida",
    title: "Catrip Connect とは？",
    paragraphs: [
      "Catrip Connect は、1 つまたは複数の WhatsApp アカウントを同時に WhatsApp Web で使えるデスクトップアプリです。各アカウントは独立しており、あるアカウントのメッセージ・連絡先・ファイルは他のアカウントと混ざりません。",
      "メイン画面はブラウザで知っている WhatsApp に加え、ワンクリックでアカウント切替、使わないアカウントの一時停止でメモリ節約、最も急ぎの項目（今すぐ）の素早い確認、未読メッセージ一覧、Ctrl+K でチャット検索、デスクトップ通知などの機能があります。",
    ],
  },
  {
    id: "primeros-pasos",
    title: "はじめに",
    steps: [
      "システムのアプリメニューから Catrip Connect を開きます（「Catrip Connect」で検索）。",
      "初回は最初のアカウントを作成するボタンを押します。「個人」「仕事」など分かる名前を付けてください。",
      "WhatsApp Web の QR コードが表示されます。スマホで WhatsApp → リンク済みデバイス → デバイスをリンクし、コードをスキャンします。",
      "接続が完了すると、ウィンドウの大きな領域にチャットが表示されます。",
      "別のアカウントを追加するには、サイドバー rail の「新しいアカウント」ボタンまたはアカウントメニューを使います。",
    ],
    note: "QR コードの有効期限が切れたら、F5 またはチャット → 再読み込みで画面を更新してください。",
  },
  {
    id: "ventana",
    title: "ウィンドウの構成",
    paragraphs: [
      "ウィンドウは 2 つの主な領域に分かれます。左はサイドバー rail（アカウントアイコンとクイック操作）。右の大きな領域は選択中のアカウントの WhatsApp Web です。",
      "上部には、設定で有効にした場合、メニューバー（ファイル、表示、チャット、アカウント、ヘルプ）があります。このマニュアルのほとんどの操作にアクセスできます。",
    ],
    bullets: [
      "rail 上部：アカウントのアバター（クリックで切替、ドラッグで並べ替え）。",
      "rail 下部：新しいアカウント、番号でチャット、新規チャット、⚡ 今すぐ、✉ 保留、▤ アクティビティ、設定、Zen モード。",
      "中央：WhatsApp Web のチャット、通話、ファイル。",
      "上部メニュー：分類されたショートカット（表示 → 今すぐ を含む）。",
    ],
  },
  {
    id: "cuentas",
    title: "複数アカウントの利用",
    paragraphs: [
      "1 つのアプリで複数の WhatsApp アカウントを使えます。各アカウントはサイドバー rail に色付きアイコンがあります。",
    ],
    bullets: [
      "アイコンをクリックするとそのアカウントに切り替わります。",
      "アイコンを上下にドラッグして一覧の順序を変えます。",
      "アイコンの緑の点や数字は、そのアカウントの未読メッセージを示します。",
      "しばらく使わないと「休止」状態になります。アバターが薄く表示され、ツールチップに表示されます。セッションは保存され、クリック 1 回で即座に再有効化されます。",
      "アイコンにマウスを乗せると、接続中、休止、QR 待ち、オフラインか確認できます。",
      "ショートカット：Ctrl+1 が 1 番目、Ctrl+2 が 2 番目、Ctrl+9 まで。",
    ],
    note: "設定 → アカウントで名前変更、アイコン色の変更、削除ができます。設定 → パフォーマンスで非アクティブアカウントが休止に入るタイミングを設定します。",
  },
  {
    id: "reposo-cuentas",
    title: "休止アカウント（メモリ節約）",
    paragraphs: [
      "複数アカウントを開くと、それぞれが WhatsApp Web を維持しながらメモリと CPU を使います。Catrip Connect は使わないアカウントを「スリープ」できます。内部の WhatsApp 画面は閉じ、セッション（Cookie・ログイン）はディスクに保持します。",
      "ログアウトや毎回の QR 再スキャンなしに、3〜4 以上のアカウントでもアプリを軽く保てます。",
    ],
    steps: [
      "通常どおりアカウントを使います。別のアカウントに切り替えると、前のアカウントの非アクティブ時間がカウントされます。",
      "設定したしきい値（既定 15 分）を過ぎると休止に入り、rail のアバターが薄く表示されます。",
      "再有効化はアバターをクリック、✉ 保留や Ctrl+K からチャットを選ぶ、またはそのアカウント向け wa.me リンクを開きます。",
      "数秒で同じセッションで WhatsApp Web が再読み込みされます。QR の再スキャンは不要です。",
    ],
    bullets: [
      "設定 → パフォーマンス →「非アクティブアカウントを一時停止」が既定でオン。",
      "待機時間：5、10、15、30、60 分から選択。",
      "アクティブなアカウントは一時停止されません。",
      "ビデオ通話中のアカウントは切るまで一時停止されません。",
      "オプションをオフにすると、休止中だったすべてのアカウントが即座に再有効化されます。",
    ],
    note: "休止中は、そのアカウントの通知・カウンターは開くまで更新されないことがあります。アクティブなアカウントとよく使うアカウントは通常どおり通知を受け取ります。",
  },
  {
    id: "zen",
    title: "Zen モード（チャットのみ）",
    paragraphs: [
      "Zen モードはサイドバー rail を隠し、WhatsApp がウィンドウ全体を占めます。1 つの会話に集中したいときに便利です。",
    ],
    bullets: [
      "表示 → Zen モード、Ctrl+Shift+Z、またはコマンドパレット（Ctrl+K）で「Zen」を検索してオンにします。",
      "通常表示に戻すには Escape を押すか、ショートカットを再度押します。",
      "設定を開くと Zen モードは自動でオフになります。",
    ],
    note: "Zen モードでは rail の ⚡ ボタンは表示されません。Zen を終了するか Ctrl+Shift+A で今すぐを開いてください。",
  },
  {
    id: "ahora-mismo",
    title: "今すぐ — 急ぎの項目を一覧",
    paragraphs: [
      "今すぐはサイドバー rail の横の小さなパネルです。すべてのアカウントで最も急ぎの未読会話を最大 3 件表示します。アクティビティセンターや保留アクションのような大きな画面と違い、WhatsApp を覆わないため、要約を見ながら横でチャットを続けられます。",
    ],
    steps: [
      "サイドバー rail の ⚡ ボタン、Ctrl+Shift+A、または表示 → 今すぐを使います。",
      "一覧を確認します。連絡先名、アカウント（個人、仕事…）、未読数、最後のメッセージ 1 行が表示されます。",
      "行をクリックすると正しいアカウントでそのチャットが開き、パネルは自動で閉じます。",
      "さらに会話を見るには、パネル下部の「すべての保留を表示」を押します。",
      "開かずに閉じる：Escape、パネルの X、または外側をクリック。",
    ],
    bullets: [
      "⚡ ボタンの緑の点は、急ぎの保留チャットがあることを示します。",
      "未読がなければ「すべて確認済み」と表示されます。",
      "Ctrl+K パレットに「今すぐ」と入力しても開けます。",
    ],
    note: "パネルは WhatsApp Web と同じ未読情報を使います。スマホで読み終えたチャットが一覧から消えるまで数秒かかることがあります。",
  },
  {
    id: "actividad",
    title: "アクティビティセンターと保留アクション",
    paragraphs: ["今すぐのほかに、落ち着いて全体を確認するときの 2 つの広いビューがあります。"],
    table: {
      headers: ["ツール", "使うタイミング", "開き方"],
      rows: [
        [
          "⚡ 今すぐ",
          "素早い確認：画面を覆わない上位 3 件の急ぎ",
          "⚡ ボタン、Ctrl+Shift+A、表示 → 今すぐ",
        ],
        [
          "▤ アクティビティセンター",
          "アカウント別の要約：誰が書いたかとプレビュー",
          "▤ ボタンまたは Ctrl+K →「アクティビティ」",
        ],
        ["✉ 保留アクション", "未読チャットの完全な一覧", "✉ ボタンまたは Ctrl+K →「保留」"],
        ["Ctrl+K → チャット", "名前やテキストで連絡先を検索", "Ctrl+K で名前を入力"],
      ],
    },
    bullets: [
      "アクティビティセンター（▤）：アカウントごとに 1 枚のカード、未読合計と最後のメッセージ。",
      "保留アクション（✉）：全アカウントを緊急度順に並べたフラットな一覧。",
      "今すぐからワンクリックで完全な受信トレイに移動できます。",
    ],
  },
  {
    id: "paleta",
    title: "コマンドパレット（クイック検索）",
    paragraphs: [
      "いつでも Ctrl+K で検索を開きます。入力すると一覧がすぐに絞り込まれます。",
      "アカウントやアクションに加え、未読のある会話も検索できます。連絡先名、最後のメッセージの一部、アカウント名（例：「Ana」「仕事 予算」）を入力してください。チャットを選ぶと正しいアカウントで開きます。",
    ],
    bullets: [
      "上下矢印でオプションを選択。",
      "Enter で実行（チャットを開く、アカウント切替 — 休止なら再有効化 —、今すぐを開く、設定へなど）。",
      "Escape で何もせず閉じる。",
      "一致するチャットは「チャット」セクションの上部に表示されます。",
      "便利なコマンド：「今すぐ」「保留アクション」「アクティビティセンター」「新しいアカウント」「Zen モード」。",
    ],
    note: "チャット検索は各アカウントの WhatsApp Web に表示される未読会話を使います。保留メッセージがないチャットは、新しい活動があるまで表示されないことがあります。",
  },
  {
    id: "chat-numero",
    title: "番号でメッセージを送る",
    steps: [
      "Ctrl+M を押すか、パレット（Ctrl+K）で「電話」を検索します。",
      "国際形式で番号を入力します。例：+819012345678。",
      "OK を押すと、現在アクティブなアカウントで会話が開きます。",
    ],
    note: "番号には国コード（+ と該当する桁）を含めてください。",
  },
  {
    id: "enlaces",
    title: "Web から WhatsApp リンクを開く",
    paragraphs: [
      "誰かが wa.me リンクを送ったり、別のアプリから whatsapp:// リンクを開いたりすると、Catrip Connect がチャットを直接開けます。",
    ],
    bullets: [
      "インストール後、設定 → 一般で Catrip Connect を WhatsApp リンクの既定アプリに登録できます。",
      "「受信 WhatsApp リンク」でアカウントを選択：複数ある場合は確認、常にアクティブ、アカウント固定。",
      "リンクに事前入力メッセージがある場合、チャットに送信準備済みで表示されます。",
      "グループ招待（chat.whatsapp.com）もアプリで開けます。",
    ],
    note: "ブラウザに利用可能なアプリがないと表示されたら、設定 → 一般の「既定アプリとして登録」を使い、ブラウザを閉じてから再試行してください。",
  },
  {
    id: "ajustes-general",
    title: "設定 — 一般",
    paragraphs: [
      "Ctrl+P またはファイルメニューから設定を開きます。一般はアプリの日常の動作を制御します。",
    ],
    bullets: [
      "最小化で起動：ウィンドウを表示せずトレイで起動。",
      "サイドバー rail を表示：アカウント列の表示/非表示（⚡、✉、▤ に必要）。",
      "メニューバーを表示：上部のファイル/表示/チャットの帯。",
      "閉じるときトレイに最小化：X を押してもバックグラウンドで動作（推奨）。",
      "システムと同時に自動起動：PC 起動時に Catrip Connect を開く。",
      "ダウンロードフォルダ：WhatsApp で受け取ったファイルの保存先。",
      "UI スケール：テキストとアイコンのサイズ（100%〜200%）。",
      "起動時に更新を確認：新しいバージョンを通知。",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "設定 — アカウント",
    bullets: [
      "名前の変更：表示名を変更（Catrip Connect のみ、WhatsApp ではない）。",
      "アイコンの再生成または色のバリエーション：サイドバー rail のアバターをカスタマイズ。",
      "アカウント別通知：特定アカウントのアラートのオン/オフ。",
      "アカウントの削除：アプリからセッションを削除（スマホの WhatsApp は削除しない）。",
    ],
    note: "Catrip Connect でアカウントを削除してもスマホの WhatsApp はログアウトされません。アプリに表示されなくなるだけです。",
  },
  {
    id: "ajustes-notificaciones",
    title: "設定 — 通知",
    bullets: [
      "システム通知：メッセージ到着時のデスクトップアラート。",
      "アカウント名を表示：「仕事」「個人」などを表示。",
      "プレビューを表示：通知にメッセージ 1 行。",
      "おやすみモード：ポップアップなし（トレイのカウンターは動作）。",
      "システム音：通知時のビープ。",
    ],
    note: "通知をクリックするとウィンドウが開き、メッセージを受け取ったアカウントが選択されます。その後 ⚡ で残りの保留を確認できます。",
  },
  {
    id: "ajustes-red",
    title: "設定 — ネットワーク",
    paragraphs: [
      "接続がプロキシ経由の場合（社内ネットワーク、特殊 VPN など）のみ必要です。「ネットワークプロキシ」を有効にし、管理者から渡されたルールを入力してください。",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "設定 — パフォーマンス",
    paragraphs: [
      "複数アカウントを同時に使うときの滑らかさ、メモリ、安定性のバランスを取るセクションです。",
    ],
    bullets: [
      "非アクティブアカウントを一時停止：しばらく選択しないアカウントの WhatsApp 画面を閉じて RAM を解放。セッションはディスクに保持。",
      "一時停止まで（分）：休止前の非使用時間（5〜60 分）。",
      "GPU ブースト：一部の Linux で動画の滑らかさを改善。アプリの再起動が必要。",
      "レンダラープロセス上限：メモリが足りずアカウントが多いときに有用。再起動が必要。",
      "ビデオ通話中のスリープ防止：WhatsApp Web で通話中はシステムがスリープしない。",
      "キャッシュをクリア：WhatsApp が遅い、ファイルが失敗する場合に試す（ログアウトしない）。",
    ],
    note: "アカウント一時停止とプロセス上限は同じ問題（メモリ）を別の角度から扱います。前者は使わない画面を閉じ、後者は Chromium プロセスの総数を制限します。",
  },
  {
    id: "bandeja",
    title: "システムトレイのアイコン",
    paragraphs: [
      "デスクトップの時計の横（Linux）に Catrip Connect のアイコンがあります。ウィンドウの復元や完全終了ができます。",
    ],
    bullets: [
      "アイコンをクリック：メインウィンドウの表示/非表示。",
      "コンテキストメニュー：アカウント一覧と状態・未読、終了。",
      "アイコンのバッジ：未読の合計（設定で有効な場合）。",
      "トレイから復元すると、以前と同じサイズ・位置に戻ります。",
    ],
  },
  {
    id: "actualizaciones",
    title: "アプリの更新",
    paragraphs: [
      "「起動時に更新を確認」が有効な場合、Catrip Connect はオンラインで新しいバージョンを確認します。",
    ],
    bullets: [
      ".deb パッケージをインストールした場合：新機能を表示し、インストーラを任意のフォルダにダウンロードするか、ブラウザでリンクを開けます。インストールのタイミングはユーザーが決めます。",
      "AppImage を使う場合：ダウンロードが自動のことがあり、準備ができたら「今すぐ再起動」を押します。",
      "更新パネルはスクロールでき、ウィンドウを大きくせずにすべての新機能を読めます。",
    ],
  },
  {
    id: "atajos",
    title: "キーボードショートカット",
    table: {
      headers: ["ショートカット", "動作"],
      rows: [
        ["Ctrl+K", "検索を開く（未読チャット、アカウント、アクション）"],
        ["Ctrl+P", "設定を開く"],
        ["Ctrl+1 … Ctrl+9", "アカウント 1、2、3…（最大 9）"],
        ["Ctrl+N", "WhatsApp Web で新規チャット"],
        ["Ctrl+M", "電話番号でチャット"],
        ["Ctrl+U", "新しいアカウント"],
        ["Ctrl+Shift+A", "今すぐを開く/閉じる（上位 3 件の急ぎ）"],
        ["Ctrl+Shift+Z", "Zen モードの切替"],
        ["Escape", "今すぐを閉じる、Zen を終了、パレットを閉じる"],
        ["Ctrl+W", "ウィンドウを隠す"],
        ["Ctrl+Q", "アプリを終了"],
        ["F5", "WhatsApp Web を再読み込み"],
        ["F11", "全画面"],
      ],
    },
    note: "ヘルプ → キーボードショートカットで簡易一覧、ヘルプ → ユーザーマニュアルで完全版を確認できます。",
  },
  {
    id: "problemas",
    title: "ヒントとよくある問題",
    bullets: [
      "WhatsApp が読み込まれない、画面が真っ黒：チャット → 再読み込み（F5）。続く場合は設定 → パフォーマンスで「GPU ブースト」を切り替えて再起動。",
      "QR コードが表示されない：インターネットを確認し F5 で再読み込み。",
      "通知が来ない：設定 → 通知と、システムで Catrip Connect の通知が許可されているか確認。",
      "今すぐが空だがメッセージがあるはず：数秒待つか ✉ 保留アクションを開く。WhatsApp Web が未読を検出する必要があります。",
      "アバターが薄い（「休止」）：しばらく使っていないと正常。クリックで再有効化、または設定 → パフォーマンスで一時停止をオフ。",
      "休止アカウントから通知が来ない：スリープ中は新着を確認しません。より頻繁に通知が必要なら開くか一時停止時間を短くしてください。",
      "⚡ ボタンが見えない：設定で「サイドバー rail を表示」をオンにし、Zen モードを終了。",
      "トレイアイコンが見えない：一部の Linux ディストリビューションではトレイアイコン対応（AppIndicator）のインストールが必要。",
      "wa.me リンクがアプリを開かない：設定 → 一般で登録し、ブラウザを閉じてから再試行。",
      "複数アカウントが重い：「非アクティブアカウントを一時停止」をオン、プロセス上限を下げる、同時にアクティブなアカウント数を減らす。",
    ],
    note: "アプリを最新に保つと、WhatsApp Web との互換性の問題がよく解消されます。",
  },
  {
    id: "ayuda",
    title: "さらにヘルプ",
    paragraphs: [
      "ヘルプメニューからこのユーザーマニュアル、キーボードショートカット一覧、インストール済みバージョンの「バージョン情報」ウィンドウを開けます。",
      "Catrip Connect は公式 WhatsApp Web をアプリ内で使用します。web.whatsapp.com で動作する機能（チャット、ファイル、サポートされるステータスなど）はここでも同様です。",
    ],
    bullets: [
      "ユーザーマニュアル：目次付きの完全ガイド（このウィンドウ）。",
      "キーボードショートカット：クイックリファレンス。",
      "バージョン情報：インストール済みのバージョン番号。",
    ],
  },
];

export const manualIt = [
  {
    id: "bienvenida",
    title: "Cos'è Catrip Connect?",
    paragraphs: [
      "Catrip Connect è un'applicazione desktop che consente di usare WhatsApp Web con uno o più account contemporaneamente. Ogni account è indipendente: messaggi, contatti e file di uno non si mescolano con quelli di un altro.",
      "La schermata principale mostra WhatsApp come nel browser, con strumenti extra: cambiare account con un clic, risparmiare memoria sospendendo gli account inutilizzati, uno sguardo rapido all'urgente (Adesso), vedere tutti i messaggi non letti, cercare chat con Ctrl+K, notifiche desktop e altro.",
    ],
  },
  {
    id: "primeros-pasos",
    title: "Primi passi",
    steps: [
      "Apri Catrip Connect dal menu applicazioni del sistema (cerca «Catrip Connect»).",
      "La prima volta, premi il pulsante per creare il primo account. Dagli un nome riconoscibile, ad esempio «Personale» o «Lavoro».",
      "Apparirà il codice QR di WhatsApp Web. Sul telefono apri WhatsApp → Dispositivi collegati → Collega dispositivo e scansiona il codice.",
      "Quando la connessione è pronta, vedrai le chat nell'area grande della finestra.",
      "Per aggiungere un altro account, usa il pulsante «Nuovo account» nella barra laterale o il menu Account.",
    ],
    note: "Se il codice QR scade, ricarica la vista con F5 o Chat → Ricarica.",
  },
  {
    id: "ventana",
    title: "Come è organizzata la finestra",
    paragraphs: [
      "La finestra ha due aree principali. A sinistra c'è la barra laterale (a volte la chiamiamo «il rail»): icone degli account e accessi rapidi. A destra, l'area grande è WhatsApp Web dell'account selezionato.",
      "In alto trovi la barra dei menu (File, Visualizza, Chat, Account, Aiuto) se l'hai attivata in Impostazioni. Da lì puoi fare quasi tutto ciò che spiega questo manuale.",
    ],
    bullets: [
      "Parte superiore del rail: avatar dei tuoi account (clic per cambiare, trascina per riordinare).",
      "Parte inferiore del rail: pulsanti — nuovo account, chat per numero, nuova chat, ⚡ Adesso, ✉ in sospeso, ▤ attività, impostazioni e modalità Zen.",
      "Zona centrale: chat, chiamate e file di WhatsApp Web.",
      "Menu superiore: scorciatoie per categoria (include Visualizza → Adesso).",
    ],
  },
  {
    id: "cuentas",
    title: "Lavorare con più account",
    paragraphs: [
      "Puoi avere più account WhatsApp nella stessa app. Ognuno ha la propria icona colorata nella barra laterale.",
    ],
    bullets: [
      "Clicca un'icona per passare a quell'account.",
      "Trascina un'icona su o giù per cambiare l'ordine dell'elenco.",
      "Il punto verde o il numero sull'icona indica messaggi non letti su quell'account.",
      "Se un account resta inutilizzato per un po', può andare «in riposo»: l'avatar appare più tenue e il tooltip lo indica. La sessione resta salvata; un clic la riattiva subito.",
      "Passa il mouse su un'icona per vedere se è connessa, in riposo, in attesa di QR o offline.",
      "Scorciatoia: Ctrl+1 apre il primo account, Ctrl+2 il secondo, fino a Ctrl+9.",
    ],
    note: "In Impostazioni → Account puoi rinominare ogni account, cambiare il colore dell'icona o eliminarlo. In Impostazioni → Prestazioni configuri quando gli account inattivi vanno in riposo.",
  },
  {
    id: "reposo-cuentas",
    title: "Account in riposo (risparmio memoria)",
    paragraphs: [
      "Con più account aperti, ognuno consuma memoria e CPU mantenendo WhatsApp Web caricato. Catrip Connect può «addormentare» gli account non usati: chiude la vista interna di WhatsApp ma conserva la sessione (cookie e login) su disco.",
      "L'app resta più leggera con tre, quattro o più account senza disconnettersi o riscansionare il QR ogni volta.",
    ],
    steps: [
      "Usa un account normalmente; passando a un altro, il precedente inizia a contare il tempo di inattività.",
      "Dopo la soglia configurata (predefinito 15 minuti), l'account va in riposo: il suo avatar sul rail appare attenuato.",
      "Per riattivarlo, clicca l'avatar, scegli una chat da ✉ in sospeso, Ctrl+K o apri un link wa.me per quell'account.",
      "WhatsApp Web si ricarica in pochi secondi con la stessa sessione; non serve riscansionare il QR.",
    ],
    bullets: [
      "Attivato per impostazione predefinita in Impostazioni → Prestazioni → «Sospendi account inattivi».",
      "Puoi scegliere l'attesa: 5, 10, 15, 30 o 60 minuti.",
      "L'account attivo non viene mai sospeso.",
      "Se c'è una videochiamata in corso su un account, non viene sospeso finché non riattacchi.",
      "Disattivare l'opzione riattiva subito tutti gli account che erano in riposo.",
    ],
    note: "Mentre un account è in riposo, avvisi e contatori di quell'account possono non aggiornarsi finché non lo apri. L'account attivo e quelli usati spesso ricevono notifiche normalmente.",
  },
  {
    id: "zen",
    title: "Modalità Zen (solo chat)",
    paragraphs: [
      "La modalità Zen nasconde la barra laterale così WhatsApp occupa tutta la finestra. Utile quando vuoi concentrarti su una conversazione.",
    ],
    bullets: [
      "Attivala da Visualizza → Modalità Zen, con Ctrl+Shift+Z o cercando «Zen» nella palette comandi (Ctrl+K).",
      "Per tornare alla vista normale, premi Escape o ripeti la scorciatoia.",
      "Entrando in Impostazioni, la modalità Zen si disattiva da sola.",
    ],
    note: "In modalità Zen non vedrai il pulsante ⚡ del rail; esci dalla modalità Zen o usa Ctrl+Shift+A per aprire Adesso.",
  },
  {
    id: "ahora-mismo",
    title: "Adesso — l'urgente a colpo d'occhio",
    paragraphs: [
      "Adesso è un pannello piccolo accanto alla barra laterale. Mostra fino a tre conversazioni con messaggi non letti, le più urgenti tra tutti i tuoi account. A differenza delle viste grandi (centro attività o azioni in sospeso), non copre WhatsApp: puoi leggere il riepilogo e continuare a vedere la chat accanto.",
    ],
    steps: [
      "Premi il pulsante ⚡ nella barra laterale, usa Ctrl+Shift+A o Visualizza → Adesso.",
      "Controlla l'elenco: nome del contatto, account (Personale, Lavoro…), quanti non letti e una riga dell'ultimo messaggio.",
      "Clicca una riga per aprire quella chat nell'account corretto. Il pannello si chiude da solo.",
      "Per vedere più conversazioni, premi «Vedi tutte in sospeso» in fondo al pannello.",
      "Per chiudere senza aprire nulla: Escape, la X del pannello o clic fuori.",
    ],
    bullets: [
      "Un punto verde sul pulsante ⚡ indica chat urgenti in attesa.",
      "Se non ci sono non letti, il pannello te lo dice («Sei in pari»).",
      "Puoi anche digitare «Adesso» nella palette Ctrl+K.",
    ],
    note: "Il pannello usa le stesse informazioni non lette di WhatsApp Web. Se hai appena letto una chat sul telefono, può volerci qualche secondo per uscire dall'elenco.",
  },
  {
    id: "actividad",
    title: "Centro attività e azioni in sospeso",
    paragraphs: ["Oltre ad Adesso, hai due viste più ampie quando devi rivedere tutto con calma."],
    table: {
      headers: ["Strumento", "Quando usarlo", "Come aprirlo"],
      rows: [
        [
          "⚡ Adesso",
          "Sguardo rapido: top 3 urgenti senza coprire lo schermo",
          "Pulsante ⚡, Ctrl+Shift+A, Visualizza → Adesso",
        ],
        [
          "▤ Centro attività",
          "Riepilogo per account: chi ha scritto e anteprima",
          "Pulsante ▤ o Ctrl+K → «attività»",
        ],
        [
          "✉ Azioni in sospeso",
          "Elenco completo di tutte le chat non lette",
          "Pulsante ✉ o Ctrl+K → «in sospeso»",
        ],
        ["Ctrl+K → Chat", "Trovare un contatto per nome o testo", "Ctrl+K e digita il nome"],
      ],
    },
    bullets: [
      "Centro attività (▤): una scheda per account con totale non letti e ultimo messaggio.",
      "Azioni in sospeso (✉): elenco piatto ordinato per urgenza su tutti gli account.",
      "Da Adesso puoi passare all'elenco completo con un clic.",
    ],
  },
  {
    id: "paleta",
    title: "Palette comandi (ricerca rapida)",
    paragraphs: [
      "Premi Ctrl+K in qualsiasi momento per aprire una ricerca. Scrivi ciò che cerchi e l'elenco si filtra subito.",
      "Oltre a account e azioni, puoi cercare conversazioni con non letti: nome del contatto, estratto dell'ultimo messaggio o nome account (ad esempio «Ana» o «Lavoro budget»). Scegliendo una chat, l'app la apre nell'account corretto.",
    ],
    bullets: [
      "Frecce su e giù per scegliere un'opzione.",
      "Invio per eseguirla (aprire chat, cambiare account — riattivandolo se in riposo —, aprire Adesso, andare a Impostazioni, ecc.).",
      "Escape per chiudere senza fare nulla.",
      "Le chat corrispondenti compaiono in alto nella sezione «Chat».",
      "Comandi utili: «Adesso», «Azioni in sospeso», «Centro attività», «Nuovo account», «Modalità Zen».",
    ],
    note: "La ricerca chat usa le conversazioni non lette che WhatsApp Web mostra per ogni account. Senza messaggi in sospeso, una chat può non apparire finché non arriva nuova attività.",
  },
  {
    id: "chat-numero",
    title: "Scrivere a qualcuno per numero",
    steps: [
      "Premi Ctrl+M o cerca «telefono» nella palette (Ctrl+K).",
      "Inserisci il numero con prefisso internazionale, ad esempio +393331234567.",
      "Premi OK. Si aprirà la conversazione nell'account attivo.",
    ],
    note: "Il numero deve includere il prefisso internazionale (+ e le cifre corrette).",
  },
  {
    id: "enlaces",
    title: "Aprire link WhatsApp dal web",
    paragraphs: [
      "Se qualcuno ti invia un link wa.me o apri un link whatsapp:// da un'altra app, Catrip Connect può aprire la chat direttamente.",
    ],
    bullets: [
      "Dopo l'installazione, in Impostazioni → Generale puoi registrare Catrip Connect come app predefinita per i link WhatsApp.",
      "In «Link WhatsApp in entrata» scegli quale account usare: chiedi se ce ne sono più, sempre l'account attivo o un account fisso.",
      "Se il link include un messaggio precaricato, appare pronto da inviare nella chat.",
      "Anche gli inviti a gruppi (chat.whatsapp.com) si possono aprire nell'app.",
    ],
    note: "Se il browser dice che non c'è un'app disponibile, usa «Registra come app predefinita» in Impostazioni → Generale.",
  },
  {
    id: "ajustes-general",
    title: "Impostazioni — Generale",
    paragraphs: [
      "Apri Impostazioni con Ctrl+P o dal menu File. La sezione Generale controlla il comportamento quotidiano dell'app.",
    ],
    bullets: [
      "Avvia minimizzata: l'app parte nella tray senza mostrare la finestra.",
      "Mostra barra laterale: nasconde o mostra la colonna account (necessaria per ⚡, ✉ e ▤).",
      "Mostra barra menu: la fascia File / Visualizza / Chat in alto.",
      "Alla chiusura, minimizza nella tray: premendo X l'app resta in background (consigliato).",
      "Avvia automaticamente con il sistema: apre Catrip Connect all'avvio del computer.",
      "Cartella download: dove si salvano i file ricevuti su WhatsApp.",
      "Scala interfaccia: ingrandisce o riduce testi e icone (100%–200%).",
      "Cerca aggiornamenti all'avvio: avvisa quando c'è una nuova versione.",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "Impostazioni — Account",
    bullets: [
      "Rinomina: cambia il nome visibile dell'account (solo in Catrip Connect, non in WhatsApp).",
      "Rigenera icona o scegli variante colore: personalizza l'avatar della barra laterale.",
      "Notifiche per account: attiva o silenzia avvisi di un account specifico.",
      "Elimina account: rimuove la sessione dall'app (non cancella WhatsApp sul telefono).",
    ],
    note: "Eliminare un account in Catrip Connect non disconnette WhatsApp sul telefono; smette solo di mostrarlo nel programma.",
  },
  {
    id: "ajustes-notificaciones",
    title: "Impostazioni — Notifiche",
    bullets: [
      "Notifiche di sistema: avvisi desktop all'arrivo dei messaggi.",
      "Mostra nome account: nell'avviso vedi se è «Lavoro», «Personale», ecc.",
      "Mostra anteprima: una riga del messaggio nell'avviso.",
      "Non disturbare: nessun pop-up (il contatore nella tray funziona ancora).",
      "Suono di sistema: bip alla ricezione di un avviso.",
    ],
    note: "Cliccando una notifica si apre la finestra e si seleziona l'account che ha ricevuto il messaggio. Poi puoi usare ⚡ per vedere cos'altro resta in sospeso.",
  },
  {
    id: "ajustes-red",
    title: "Impostazioni — Rete",
    paragraphs: [
      "Serve solo se la connessione passa per un proxy (rete aziendale, VPN speciale, ecc.). Attiva «Proxy di rete» e inserisci le regole fornite dall'amministratore.",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "Impostazioni — Prestazioni",
    paragraphs: [
      "Questa sezione aiuta a bilanciare fluidità, consumo di memoria e stabilità con più account contemporanei.",
    ],
    bullets: [
      "Sospendi account inattivi: libera RAM chiudendo la vista WhatsApp degli account non selezionati per un po'. La sessione resta su disco.",
      "Sospendi dopo (minuti): quanto tempo senza usare un account prima del riposo (5–60 minuti).",
      "Boost GPU: migliora la fluidità video su alcuni PC Linux. Richiede riavvio dell'app.",
      "Limite processi renderer: utile con molti account se il computer ha poca RAM. Richiede riavvio.",
      "Evita sospensione durante videochiamata: il sistema non va in standby con una chiamata attiva in WhatsApp Web.",
      "Svuota cache: se WhatsApp è lento o i file falliscono, prova a svuotare la cache (senza disconnessione).",
    ],
    note: "Sospensione account e limite processi affrontano lo stesso problema (memoria) da angoli diversi: la prima chiude viste inutilizzate; il secondo limita i processi Chromium totali.",
  },
  {
    id: "bandeja",
    title: "Icona nella tray di sistema",
    paragraphs: [
      "Accanto all'orologio del desktop (Linux) compare l'icona di Catrip Connect. Da lì puoi ripristinare la finestra o uscire completamente.",
    ],
    bullets: [
      "Clic sull'icona: mostra o nasconde la finestra principale.",
      "Menu contestuale: elenca i tuoi account con stato e non letti; consente anche di uscire.",
      "Contatore sull'icona: mostra i non letti totali (se attivato in Impostazioni).",
      "Ripristinando dalla tray, la finestra torna alle stesse dimensioni e posizione di prima.",
    ],
  },
  {
    id: "actualizaciones",
    title: "Aggiornare l'applicazione",
    paragraphs: [
      "Con «Cerca aggiornamenti all'avvio» attivo, Catrip Connect verifica nuove versioni online.",
    ],
    bullets: [
      "Se hai installato il pacchetto .deb: l'app mostra le novità e puoi scaricare l'installer in una cartella a scelta o aprire il link nel browser. Decidi tu quando installare.",
      "Se usi AppImage: il download può avvenire da solo; quando è pronto, premi «Riavvia ora».",
      "Il pannello aggiornamenti ha scroll per leggere tutte le novità senza ingrandire la finestra.",
    ],
  },
  {
    id: "atajos",
    title: "Scorciatoie da tastiera",
    table: {
      headers: ["Scorciatoia", "Cosa fa"],
      rows: [
        ["Ctrl+K", "Apri ricerca (chat non lette, account e azioni)"],
        ["Ctrl+P", "Apri Impostazioni"],
        ["Ctrl+1 … Ctrl+9", "Vai all'account 1, 2, 3… (fino a 9)"],
        ["Ctrl+N", "Nuova chat in WhatsApp Web"],
        ["Ctrl+M", "Chat per numero di telefono"],
        ["Ctrl+U", "Nuovo account"],
        ["Ctrl+Shift+A", "Apri o chiudi Adesso (top 3 urgenti)"],
        ["Ctrl+Shift+Z", "Attiva o disattiva modalità Zen"],
        ["Escape", "Chiudi Adesso, esci da Zen o chiudi palette"],
        ["Ctrl+W", "Nascondi finestra"],
        ["Ctrl+Q", "Esci dall'applicazione"],
        ["F5", "Ricarica WhatsApp Web"],
        ["F11", "Schermo intero"],
      ],
    },
    note: "Puoi vedere un elenco rapido in Aiuto → Scorciatoie da tastiera e il manuale completo in Aiuto → Manuale utente.",
  },
  {
    id: "problemas",
    title: "Suggerimenti e problemi comuni",
    bullets: [
      "WhatsApp non carica o resta nero: Chat → Ricarica (F5). Se persiste, in Impostazioni → Prestazioni prova ad attivare o disattivare «Boost GPU» e riavvia.",
      "Il codice QR non compare: controlla internet e ricarica con F5.",
      "Non arrivano notifiche: controlla Impostazioni → Notifiche e che il sistema consenta avvisi per Catrip Connect.",
      "Adesso è vuoto ma so che ci sono messaggi: attendi qualche secondo o apri ✉ Azioni in sospeso; WhatsApp Web deve rilevare i non letti prima.",
      "Un avatar appare spento («in riposo»): normale se non usi quell'account da un po'. Clicca per riattivarlo; puoi anche disattivare la sospensione in Impostazioni → Prestazioni.",
      "Nessun avviso da un account in riposo: mentre dorme non controlla nuovi messaggi. Aprilo o riduci il tempo di sospensione se ti servono avvisi più frequenti.",
      "Non vedo il pulsante ⚡: attiva «Mostra barra laterale» in Impostazioni ed esci dalla modalità Zen.",
      "Non si vedono le icone della tray: su alcune distribuzioni Linux serve installare il supporto icone tray (AppIndicator).",
      "Il link wa.me non apre l'app: registra Catrip Connect in Impostazioni → Generale e chiudi il browser prima di riprovare.",
      "Più account vanno lenti: attiva «Sospendi account inattivi», riduci il limite processi o usa meno account attivi insieme.",
    ],
    note: "Tenere l'app aggiornata risolve spesso problemi di compatibilità con WhatsApp Web.",
  },
  {
    id: "ayuda",
    title: "Ulteriore aiuto",
    paragraphs: [
      "Dal menu Aiuto puoi aprire questo manuale utente, l'elenco delle scorciatoie da tastiera e la finestra «Informazioni» con la versione installata.",
      "Catrip Connect usa WhatsApp Web ufficiale nell'app: tutto ciò che funziona su web.whatsapp.com (chat, file, stati dove supportati) funziona allo stesso modo qui.",
    ],
    bullets: [
      "Manuale utente: guida completa con indice (questa finestra).",
      "Scorciatoie da tastiera: riferimento rapido.",
      "Informazioni: numero di versione installata.",
    ],
  },
];

export const manualZh = [
  {
    id: "bienvenida",
    title: "什么是 Catrip Connect？",
    paragraphs: [
      "Catrip Connect 是一款桌面程序，可让您同时使用一个或多个 WhatsApp 账户访问 WhatsApp Web。每个账户相互独立：一个账户的消息、联系人和文件不会与另一个混在一起。",
      "主界面显示您熟悉的浏览器版 WhatsApp，并附带额外工具：一键切换账户、暂停不用的账户以节省内存、快速查看最紧急事项（此刻）、查看全部未读消息、用 Ctrl+K 搜索聊天、接收桌面通知等。",
    ],
  },
  {
    id: "primeros-pasos",
    title: "入门步骤",
    steps: [
      "从系统应用菜单打开 Catrip Connect（搜索「Catrip Connect」）。",
      "首次使用时，点击按钮创建第一个账户。起一个容易识别的名称，例如「个人」或「工作」。",
      "将显示 WhatsApp Web 二维码。在手机上打开 WhatsApp → 已关联的设备 → 关联设备并扫描二维码。",
      "连接成功后，您会在窗口的大片区域看到聊天列表。",
      "要添加其他账户，请使用侧边栏 rail 上的「新账户」按钮或账户菜单。",
    ],
    note: "若二维码过期，请按 F5 或通过聊天 → 重新加载刷新视图。",
  },
  {
    id: "ventana",
    title: "窗口布局",
    paragraphs: [
      "窗口分为两个主要区域。左侧是侧边栏 rail（有时称为 rail）：显示账户图标和快捷操作。右侧大片区域是当前所选账户的 WhatsApp Web。",
      "若已在设置中启用，顶部有菜单栏（文件、查看、聊天、账户、帮助）。几乎所有本手册说明的功能都可从这里访问。",
    ],
    bullets: [
      "rail 上部：账户头像（点击切换，拖动排序）。",
      "rail 下部：操作按钮 — 新账户、按号码聊天、新聊天、⚡ 此刻、✉ 待处理、▤ 活动、设置和 Zen 模式。",
      "中央区域：WhatsApp Web 的聊天、通话和文件。",
      "顶部菜单：分类快捷入口（含查看 → 此刻）。",
    ],
  },
  {
    id: "cuentas",
    title: "使用多个账户",
    paragraphs: [
      "您可以在同一应用中登录多个 WhatsApp 账户。每个账户在侧边栏 rail 上有不同颜色的图标。",
    ],
    bullets: [
      "点击图标切换到该账户。",
      "上下拖动图标可调整列表顺序。",
      "图标上的绿点或数字表示该账户的未读消息。",
      "若账户一段时间未使用，可能进入「休眠」：头像变淡，工具提示会说明。会话仍保存在本地；单击即可立即恢复。",
      "将鼠标悬停在图标上可查看是否已连接、休眠、等待二维码或离线。",
      "快捷方式：Ctrl+1 打开第一个账户，Ctrl+2 第二个，直至 Ctrl+9。",
    ],
    note: "在设置 → 账户中可重命名、更改图标颜色或删除账户。在设置 → 性能中可配置非活跃账户何时进入休眠。",
  },
  {
    id: "reposo-cuentas",
    title: "休眠账户（节省内存）",
    paragraphs: [
      "多个账户同时打开时，每个账户在保持 WhatsApp Web 加载的同时都会占用内存和 CPU。Catrip Connect 可让不用的账户「休眠」：关闭内部 WhatsApp 视图，但将会话（Cookie 和登录）保存在磁盘上。",
      "这样在三、四个或更多账户时应用更轻量，无需退出登录或每次重新扫描二维码。",
    ],
    steps: [
      "正常使用某个账户；切换到其他账户后，前一个账户开始计时不活跃时间。",
      "超过设定阈值（默认 15 分钟）后，账户进入休眠：rail 上的头像变淡。",
      "要恢复，请点击其头像，从 ✉ 待处理或 Ctrl+K 选择聊天，或打开指向该账户的 wa.me 链接。",
      "WhatsApp Web 会在几秒内以同一会话重新加载；无需再次扫描二维码。",
    ],
    bullets: [
      "默认在设置 → 性能 →「暂停非活跃账户」中启用。",
      "可选择等待时间：5、10、15、30 或 60 分钟。",
      "当前活跃账户永远不会被暂停。",
      "若某账户正在进行视频通话，挂断前不会被暂停。",
      "关闭该选项会立即恢复所有处于休眠的账户。",
    ],
    note: "账户休眠期间，该账户的通知和计数可能直到您打开才会更新。活跃账户和常用账户仍会正常接收通知。",
  },
  {
    id: "zen",
    title: "Zen 模式（仅聊天）",
    paragraphs: ["Zen 模式隐藏侧边栏 rail，让 WhatsApp 占满整个窗口。适合专注于某次对话时使用。"],
    bullets: [
      "通过查看 → Zen 模式、Ctrl+Shift+Z 或在命令面板（Ctrl+K）中搜索「Zen」开启。",
      "要恢复正常视图，按 Escape 或再次使用同一快捷键。",
      "进入设置时 Zen 模式会自动关闭。",
    ],
    note: "Zen 模式下看不到 rail 上的 ⚡ 按钮；请退出 Zen 或使用 Ctrl+Shift+A 打开此刻。",
  },
  {
    id: "ahora-mismo",
    title: "此刻 — 一眼看清紧急事项",
    paragraphs: [
      "此刻是侧边栏 rail 旁的小面板。显示最多三条有未读消息的对话，即所有账户中最紧急的。与较大的视图（活动中心或待处理操作）不同，它不会挡住 WhatsApp：您可以边看摘要边在旁边继续聊天。",
    ],
    steps: [
      "点击侧边栏 rail 的 ⚡ 按钮、使用 Ctrl+Shift+A 或查看 → 此刻。",
      "查看列表：联系人姓名、账户（个人、工作…）、未读数量和最后一条消息摘要。",
      "点击某行可在正确账户中打开该聊天。面板会自动关闭。",
      "要查看更多对话，请点击面板底部的「查看全部待处理」。",
      "不打开任何内容就关闭：按 Escape、面板上的 X 或点击外部。",
    ],
    bullets: [
      "⚡ 按钮上的绿点表示有紧急待处理聊天。",
      "若无未读消息，面板会提示（您已全部处理完毕）。",
      "也可在 Ctrl+K 面板中输入「此刻」。",
    ],
    note: "面板使用与 WhatsApp Web 相同的未读信息。若您刚在手机上读完某聊天，可能需几秒才会从列表中消失。",
  },
  {
    id: "actividad",
    title: "活动中心与待处理操作",
    paragraphs: ["除此刻外，还有两个更宽的视图，供您从容查看全部内容。"],
    table: {
      headers: ["工具", "何时使用", "如何打开"],
      rows: [
        ["⚡ 此刻", "快速浏览：不遮挡屏幕的前 3 条紧急项", "⚡ 按钮、Ctrl+Shift+A、查看 → 此刻"],
        ["▤ 活动中心", "按账户汇总：谁发来消息及预览", "▤ 按钮或 Ctrl+K →「活动」"],
        ["✉ 待处理操作", "全部未读聊天的完整列表", "✉ 按钮或 Ctrl+K →「待处理」"],
        ["Ctrl+K → 聊天", "按姓名或文字查找联系人", "Ctrl+K 后输入姓名"],
      ],
    },
    bullets: [
      "活动中心（▤）：每个账户一张卡片，含未读总数和最后消息。",
      "待处理操作（✉）：按紧急程度排序的扁平列表，涵盖所有账户。",
      "从此刻可一键跳转到完整收件箱。",
    ],
  },
  {
    id: "paleta",
    title: "命令面板（快速搜索）",
    paragraphs: [
      "随时按 Ctrl+K 打开搜索框。输入内容后列表会即时筛选。",
      "除账户和操作外，还可搜索有未读消息的对话：输入联系人姓名、最后消息片段或账户名（例如「Ana」或「工作 预算」）。选择聊天后会在正确账户中打开。",
    ],
    bullets: [
      "用上下箭头选择选项。",
      "按 Enter 执行（打开聊天、切换账户 — 若休眠则唤醒 —、打开此刻、进入设置等）。",
      "按 Escape 关闭且不执行任何操作。",
      "匹配的聊天会显示在「聊天」区顶部。",
      "常用命令：「此刻」「待处理操作」「活动中心」「新账户」「Zen 模式」。",
    ],
    note: "聊天搜索使用各账户 WhatsApp Web 中显示的未读对话。若无待处理消息，可能直到有新活动才会出现。",
  },
  {
    id: "chat-numero",
    title: "按号码发消息",
    steps: [
      "按 Ctrl+M 或在面板（Ctrl+K）中搜索「电话」。",
      "输入带国际区号的号码，例如 +8613812345678。",
      "按确定。将在当前活跃账户中打开对话。",
    ],
    note: "号码须包含国家/地区代码（+ 及相应数字）。",
  },
  {
    id: "enlaces",
    title: "从网络打开 WhatsApp 链接",
    paragraphs: [
      "若有人发送 wa.me 链接，或您从其他应用打开 whatsapp:// 链接，Catrip Connect 可直接打开对应聊天。",
    ],
    bullets: [
      "安装后，可在设置 → 常规中将 Catrip Connect 注册为 WhatsApp 链接的默认应用。",
      "在「传入的 WhatsApp 链接」中选择账户：多个时询问、始终使用当前账户或固定某一账户。",
      "若链接带有预填消息，会在聊天中显示为可发送状态。",
      "群组邀请（chat.whatsapp.com）也可在应用中打开。",
    ],
    note: "若浏览器提示没有可用应用，请在设置 → 常规中使用「注册为默认应用」，关闭浏览器后再试。",
  },
  {
    id: "ajustes-general",
    title: "设置 — 常规",
    paragraphs: ["用 Ctrl+P 或文件菜单打开设置。常规部分控制应用的日常使用行为。"],
    bullets: [
      "最小化启动：应用启动时进入托盘且不显示窗口。",
      "显示侧边栏 rail：隐藏或显示账户列（⚡、✉、▤ 需要）。",
      "显示菜单栏：顶部的文件/查看/聊天条。",
      "关闭时最小化到托盘：点 X 后应用仍在后台运行（推荐）。",
      "随系统自动启动：开机时打开 Catrip Connect。",
      "下载文件夹：WhatsApp 接收文件的保存位置。",
      "界面缩放：放大或缩小文字和图标（100% 至 200%）。",
      "启动时检查更新：有新版本时通知。",
    ],
  },
  {
    id: "ajustes-cuentas",
    title: "设置 — 账户",
    bullets: [
      "重命名：更改账户显示名称（仅在 Catrip Connect 中，不影响 WhatsApp）。",
      "重新生成图标或选择颜色变体：自定义侧边栏 rail 头像。",
      "按账户通知：为某个账户开启或静音提醒。",
      "删除账户：从应用中移除会话（不会删除手机上的 WhatsApp）。",
    ],
    note: "在 Catrip Connect 中删除账户不会退出手机上的 WhatsApp；只是不再在程序中显示。",
  },
  {
    id: "ajustes-notificaciones",
    title: "设置 — 通知",
    bullets: [
      "系统通知：收到消息时的桌面提醒。",
      "显示账户名称：提醒中会显示「工作」「个人」等。",
      "显示预览：提醒中显示一行消息内容。",
      "勿扰：无弹出提醒（托盘计数仍有效）。",
      "系统声音：收到提醒时播放提示音。",
    ],
    note: "点击通知会打开窗口并选中收到消息的账户。之后可用 ⚡ 查看还有哪些待处理项。",
  },
  {
    id: "ajustes-red",
    title: "设置 — 网络",
    paragraphs: [
      "仅当连接经过代理（公司网络、特殊 VPN 等）时需要此部分。启用「网络代理」并输入管理员提供的规则。",
    ],
  },
  {
    id: "ajustes-rendimiento",
    title: "设置 — 性能",
    paragraphs: ["此部分帮助在同时使用多个账户时平衡流畅度、内存占用和稳定性。"],
    bullets: [
      "暂停非活跃账户：关闭一段时间未选中的账户的 WhatsApp 视图以释放内存。会话仍保存在磁盘。",
      "暂停前等待（分钟）：账户进入休眠前的未使用时间（5 至 60 分钟）。",
      "GPU 增强：在部分 Linux 设备上改善视频流畅度。需重启应用。",
      "渲染进程上限：账户多且内存紧张时有用。需重启。",
      "视频通话期间防止休眠：WhatsApp Web 中有活跃通话时系统不会进入睡眠。",
      "清除缓存：若 WhatsApp 变慢或文件异常，可尝试清除缓存（不会退出登录）。",
    ],
    note: "账户暂停与进程上限从不同角度解决同一问题（内存）：前者关闭不用的视图；后者限制 Chromium 进程总数。",
  },
  {
    id: "bandeja",
    title: "系统托盘图标",
    paragraphs: ["桌面时钟旁（Linux）会显示 Catrip Connect 图标。可从中恢复窗口或完全退出。"],
    bullets: [
      "点击图标：显示或隐藏主窗口。",
      "上下文菜单：列出账户及状态和未读数；也可退出。",
      "图标角标：显示未读消息总数（若在设置中启用）。",
      "从托盘恢复时，窗口会回到之前的大小和位置。",
    ],
  },
  {
    id: "actualizaciones",
    title: "更新应用",
    paragraphs: ["启用「启动时检查更新」后，Catrip Connect 会在线检查新版本。"],
    bullets: [
      "若安装了 .deb 包：应用会显示更新说明，可将安装程序下载到您选择的文件夹，或在浏览器中打开链接。安装时间由您决定。",
      "若使用 AppImage：下载可能自动进行；准备好后点击「立即重启」。",
      "更新面板可滚动，无需放大窗口即可阅读全部更新说明。",
    ],
  },
  {
    id: "atajos",
    title: "键盘快捷键",
    table: {
      headers: ["快捷键", "作用"],
      rows: [
        ["Ctrl+K", "打开搜索（未读聊天、账户和操作）"],
        ["Ctrl+P", "打开设置"],
        ["Ctrl+1 … Ctrl+9", "切换到账户 1、2、3…（最多 9 个）"],
        ["Ctrl+N", "在 WhatsApp Web 中新建聊天"],
        ["Ctrl+M", "按电话号码聊天"],
        ["Ctrl+U", "新账户"],
        ["Ctrl+Shift+A", "打开或关闭此刻（前 3 条紧急项）"],
        ["Ctrl+Shift+Z", "切换 Zen 模式"],
        ["Escape", "关闭此刻、退出 Zen 模式或关闭面板"],
        ["Ctrl+W", "隐藏窗口"],
        ["Ctrl+Q", "退出应用"],
        ["F5", "重新加载 WhatsApp Web"],
        ["F11", "全屏"],
      ],
    },
    note: "还可在帮助 → 键盘快捷键查看简要列表，在帮助 → 用户手册查看完整手册。",
  },
  {
    id: "problemas",
    title: "提示与常见问题",
    bullets: [
      "WhatsApp 无法加载或黑屏：聊天 → 重新加载（F5）。若仍如此，在设置 → 性能中尝试开关「GPU 增强」并重启。",
      "二维码不显示：检查网络并用 F5 重新加载。",
      "收不到通知：检查设置 → 通知，并确认系统允许 Catrip Connect 的通知。",
      "此刻为空但确定有消息：等待几秒或打开 ✉ 待处理操作；需先由 WhatsApp Web 检测到未读。",
      "头像变淡（「休眠」）：一段时间不用属正常。点击唤醒；也可在设置 → 性能中关闭暂停。",
      "休眠账户无提醒：休眠期间不会检查新消息。若需更频繁提醒请打开该账户或缩短暂停时间。",
      "看不到 ⚡ 按钮：在设置中启用「显示侧边栏 rail」并退出 Zen 模式。",
      "看不到托盘图标：部分 Linux 发行版需安装托盘图标支持（AppIndicator）。",
      "wa.me 链接打不开应用：在设置 → 常规中注册 Catrip Connect，关闭浏览器后再试。",
      "多个账户变慢：启用「暂停非活跃账户」、降低进程上限或减少同时活跃的账户数。",
    ],
    note: "保持应用为最新版本通常可解决与 WhatsApp Web 的兼容问题。",
  },
  {
    id: "ayuda",
    title: "更多帮助",
    paragraphs: [
      "通过帮助菜单可打开本用户手册、键盘快捷键列表以及显示已安装版本的「关于」窗口。",
      "Catrip Connect 在应用内使用官方 WhatsApp Web：在 web.whatsapp.com 上可用的功能（聊天、文件、受支持的状态等）在此同样可用。",
    ],
    bullets: [
      "用户手册：带目录的完整指南（本窗口）。",
      "键盘快捷键：快速参考。",
      "关于：已安装版本号。",
    ],
  },
];
