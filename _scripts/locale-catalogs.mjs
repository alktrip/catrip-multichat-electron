/**
 * Full UI catalog translations (pt, fr, de, ko, ja, it, zh).
 * Each assign* mutates a deep copy of the English catalog (same structure as deepAssignEn).
 */

/** @param {Record<string, unknown>} en */
function assignPt(en) {
  Object.assign(en.common, {
    cancel: "Cancelar",
    save: "Salvar",
    accept: "Aceitar",
    close: "Fechar",
    back: "Voltar",
    exit: "Sair",
    loading: "Carregando…",
    deleting: "Excluindo…",
    cleaning: "Limpando…",
    checking: "Verificando…",
    rename: "Renomear",
    delete: "Excluir",
    deletePermanently: "Excluir permanentemente",
    noResults: "Sem resultados",
    dash: "—",
    now: "Agora",
    minutesAgo: "Há {{count}} min",
    hoursAgo: "Há {{count}} h",
    daysAgo: "Há {{count}} d",
    unread: "{{count}} não lidas",
    unreadOne: "1 não lida",
    unreadLabel: "não lidas",
    messagesUnread: "{{count}} mensagens não lidas",
    accountDefault: "Conta {{n}}",
    thisAccount: "esta conta",
    theAccount: "a conta",
    variant: "Variante {{n}}",
    version: "Versão",
    automatic: "Automático",
    noAccounts: "(sem contas)",
  });
  Object.assign(en.sessionStatus, {
    loading: "Carregando…",
    qr: "Aguardando QR",
    connected: "Conectada",
    offline: "Sem rede",
  });
  Object.assign(en.commandGroups, {
    chats: "Conversas",
    accounts: "Contas",
    actions: "Ações",
    navigation: "Navegação",
    appearance: "Aparência",
  });
  Object.assign(en.commands, {
    activeAccount: "Conta ativa",
    switchAccount: "Mudar para esta conta",
    newAccount: "Nova conta",
    newChat: "Nova conversa (WhatsApp Web)",
    phoneChat: "Conversa por número de telefone…",
    urgentNow: "Agora mesmo",
    urgentNowDesc: "Top 3 conversas urgentes sem abrir um painel grande",
    activityCenter: "Centro de atividade",
    activityCenterDesc: "Visão geral de todas as contas e mensagens não lidas",
    pendingInbox: "Ações pendentes",
    pendingInboxDesc: "Conversas não lidas ordenadas por urgência em todas as contas",
    zenOn: "Ativar modo Zen",
    zenOff: "Sair do modo Zen",
    openSettings: "Abrir Configurações → {{page}}",
    hideSidebar: "Ocultar barra lateral (rail)",
    showSidebar: "Mostrar barra lateral (rail)",
    disableNotifications: "Desativar notificações do sistema",
    enableNotifications: "Ativar notificações do sistema",
    uiScale: "Escala da interface: {{scale}}",
    unreadSuffix: " · {{count}} não lidas",
  });
  Object.assign(en.settings.pages, {
    general: "Geral",
    accounts: "Contas",
    notifications: "Notificações",
    performance: "Desempenho (experimental)",
    network: "Rede",
  });
  Object.assign(en.settings, {
    title: "CONFIGURAÇÕES",
    tools: "FERRAMENTAS",
  });
  Object.assign(en.settings.language, {
    label: "Idioma da interface",
    hint: "Por padrão usa o idioma do sistema; se não estiver disponível, usa inglês. Afeta menus, notificações e textos do Catrip Connect. O WhatsApp Web usa seu próprio idioma.",
    system: "Idioma do sistema",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "O WhatsApp Web usa um idioma independente",
    metaRestriction:
      "A Meta não permite que aplicativos de terceiros (como o Catrip Connect) alterem o idioma do WhatsApp Web pela plataforma. Devido às restrições de uso e privacidade do WhatsApp, você deve configurar o idioma do chat manualmente no WhatsApp Web.",
    intro:
      "O idioma do Catrip Connect (menus, notificações e textos do app) já foi atualizado para o que você escolheu.",
    stepsTitle: "Para mudar o idioma do WhatsApp Web:",
    step1: "Abra o WhatsApp Web na janela principal (conta ativa).",
    step2: "Clique no menu ⋮ (três pontos), no canto superior esquerdo, e abra Configurações.",
    step3: "Vá em Idioma e selecione o idioma desejado para o WhatsApp.",
  });
  Object.assign(en.settings.scale, {
    title: "Escala",
    hint: "Afeta a interface e o WhatsApp Web. Aplicado na hora.",
  });
  Object.assign(en.settings.general, {
    startMinimized: "Iniciar minimizado",
    showSidebar: "Mostrar barra lateral",
    showMenuBar: "Mostrar barra de menu",
    closeToTray: "Ao fechar, minimizar para a bandeja",
    autoStart: "Iniciar automaticamente com o sistema",
    incomingLinks: "Links WhatsApp recebidos",
    incomingLinksHint: "Ao abrir whatsapp:// ou wa.me pelo sistema.",
    incomingLinkAuto: "Perguntar se houver várias contas",
    incomingLinkActive: "Sempre a conta ativa",
    incomingLinkFixed: "Conta fixa",
    registerProtocol: "Registrar como app padrão (whatsapp://)",
    registerProtocolHint:
      "whatsapp:// — Após registrar, o sistema pode abrir links compatíveis diretamente no Catrip.",
    checkUpdates: "Buscar atualizações ao iniciar (GitHub Releases)",
    updateChannel: "Canal de atualização",
    updateChannelStable: "Estável (releases)",
    updateChannelBeta: "Beta (pré-lançamentos)",
    updateChannelHint:
      "AppImage: baixa e instala ao reiniciar. Instalação .deb: você pode baixar o pacote para uma pasta ou abrir só o link do GitHub; o changelog e o SHA-512 do .deb aparecem no diálogo.",
    openDownloads: "Abrir arquivos baixados com o app padrão",
    askSaveAs: "Sempre perguntar “Salvar como…”",
    downloadsSection: "Downloads",
    downloadsFolder: "Pasta de downloads",
    downloadsPlaceholder: "(usar pasta do sistema)",
    chooseDownloadsFolder: "Escolher pasta…",
    clearDownloadsFolder: "Usar pasta do sistema",
    resetDownloads: "Redefinir",
    downloadsFilenameHint:
      "O WhatsApp Web controla o nome do arquivo. Se já existir, será gerado um nome alternativo.",
    waylandBrowserTitle: "https://wa.me no navegador",
    waylandBrowserIntro:
      "No Wayland/Linux, o navegador não repassa links HTTPS para apps arbitrários. Opções práticas:",
    waylandOption1: "Usar links que redirecionem para whatsapp:// (ex.: de outro app ou favorito).",
    waylandOption2:
      "No navegador: menu do link → Abrir com… → Catrip Connect (se aparecer após registrar).",
    waylandOption3: "Extensão do navegador que envie wa.me ao protocolo (não incluída no Catrip).",
    waylandOption4:
      "No app: Ctrl+M (chat por número) ou colar o link se o sistema entregar ao Catrip.",
    waylandTerminal: "Também pode executar no terminal: npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "Nova conta",
    hint: "Renomeie e escolha um ícone por conta. O rail usa os mesmos dados.",
    accountName: "Nome da conta",
    internalId: "Identificador interno",
    notifications: "Notificações desta conta",
    chooseIcon: "Escolher ícone",
    regenerateIcon: "Variante",
    regenerateIconTitle: "Voltar ao ícone gerado (variante)",
    deleteTitle: "Excluir esta conta e todos os dados",
    renamed: "Conta «{{from}}» renomeada para «{{to}}».",
    deleteConfirm: "Excluir a conta «{{name}}»?",
    deleteWarning:
      "Toda a sessão do WhatsApp Web será excluída permanentemente (cookies, armazenamento local, IndexedDB, Service Workers e cache HTTP). Não pode ser desfeito.",
    deleteHint: "Para só parar notificações, desative-as no cartão sem perder a sessão.",
    deleted: "Conta «{{name}}» excluída.",
    deleteFailed: "Não foi possível excluir «{{name}}».",
    deleteError: "Erro ao excluir «{{name}}». Veja o console.",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "Badge da bandeja pelo WhatsApp Web (não lidas)",
    dockBadge: "Badge no dock / lançador (Linux)",
    enabled: "Notificações do sistema",
    showAccountName: "Mostrar nome da conta",
    showPreview: "Mostrar prévia",
    doNotDisturb: "Não perturbe (sem alertas nativos)",
    playSound: "Som do sistema nas notificações",
    badgeSumHint: "Soma de não lidas de todas as contas. Requer suporte do ambiente (GNOME/KDE).",
    manualBadgeLabel: "Badge manual (teste; vazio = automático)",
    riseHint:
      "Aviso quando aumentam as não lidas em qualquer conta (limite por conta). Ao clicar, foca a janela e ativa essa conta.",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "Reforço de GPU ao iniciar (experimental)",
    gpuInfo:
      "O Catrip Connect usa a GPU do Chromium para a janela, o rail e cada conta do WhatsApp Web. No Linux a janela é opaca por padrão (melhor composição). Desative a GPU só se a tela ficar preta: CATRIP_DISABLE_GPU=1.",
    gpuBoostHint:
      "Ativa rasterização reforçada, zero-copy e VA-API ampliado no Linux. Reinicie o app após mudar isto ou o limite de processos.",
    suspendInactive: "Suspender contas inativas",
    suspendAfter: "Suspender após (minutos)",
    suspendAfterLabel: "Suspender após (minutos sem usar a conta)",
    suspendHint:
      "Libera RAM fechando a vista do WhatsApp das contas não usadas; a sessão (cookies) permanece. Ao voltar, recarrega na hora. Em repouso, avisos dessa conta podem não atualizar.",
    inhibitSleep: "Evitar suspensão durante videochamada",
    inhibitSleepHint:
      "Usa o bloqueio de energia do Electron (semelhante a portal/systemd-inhibit no Linux) enquanto o WhatsApp Web detecta chamada ativa.",
    clearCache: "Limpar cache HTTP (todas as contas)",
    checkCodecs: "Verificar codecs agora",
    cacheCleared: "Cache HTTP limpo.",
    cacheFailed: "Não foi possível limpar o cache.",
    rendererLimit: "Limite de processos do renderer",
    rendererLimitHint: "0 = padrão do Chromium. Requer reiniciar o app.",
    rendererDefault: "Padrão",
    minutesOption: "{{count}} minutos",
    storageSection: "Armazenamento",
    storageHint:
      "Limpa o cache HTTP de todas as contas (economiza espaço; em geral mantém a sessão).",
    mediaDiagSection: "Diagnóstico multimídia (WhatsApp Web)",
    mediaDiagHint:
      "Verifica se o Chromium reproduz codecs típicos de vídeo/áudio na sessão da conta ativa (mesma janela do WhatsApp Web). Funciona mesmo nesta tela de configurações.",
    mediaDiagFootnote:
      "Se decodingInfo_mp4_h264_aac.supported for false ou o MediaSource rejeitar MIME de MP4, áudio/vídeo no WhatsApp podem falhar.",
  });
  Object.assign(en.settings.network, {
    proxy: "Proxy de rede",
    proxyRules: "Regras de proxy",
    proxyRulesLabel: "Regras de proxy",
    proxyHint: "Ex.: http=host:8080;https=host:8080",
    proxyPlaceholder: "Ex.: http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "Aplicado ao salvar (ainda não há botão Aplicar).",
  });
  Object.assign(en.app.onboarding, {
    aria: "Boas-vindas",
    title: "Bem-vindo ao Catrip Connect",
    subtitle:
      "Cliente multiconta do WhatsApp Web. Adicione sua primeira conta para conversar no desktop.",
    addFirst: "Adicionar sua primeira conta",
    hint: "Também pode clicar no botão + do rail (barra esquerda, piscando em verde).",
  });
  Object.assign(en.app.rail, {
    createFirst: "Criar sua primeira conta",
    newAccount: "Nova conta",
    phoneChat: "Nova conversa por número",
    newChat: "Nova conversa (WhatsApp Web)",
    urgentNow: "Agora mesmo — conversas mais urgentes (Ctrl+Shift+A)",
    pending: "Ações pendentes",
    activity: "Centro de atividade",
    settings: "Configurações",
    zen: "Modo Zen (Esc para sair)",
    suspended: " · Em repouso (economiza memória)",
    tooltip:
      "{{label}} · {{status}}{{unread}}{{suspended}} · Arraste para reordenar · Clique direito: variante",
  });
  Object.assign(en.app.palette, {
    title: "Paleta de comandos",
    placeholder: "Buscar conversas, contas ou ações…",
    hint: "↑ ↓ para navegar • Enter para executar • Esc para fechar",
  });
  Object.assign(en.app.shortcuts, {
    title: "Atalhos de teclado",
    hint: "Referência rápida; também no menu superior.",
    footer: "Esc fecha este diálogo. Clicar fora também fecha.",
    file: "Arquivo",
    view: "Exibir",
    chat: "Conversa",
    accounts: "Contas",
    settings: "Configurações",
    hideWindow: "Ocultar janela",
    quit: "Sair",
    quickSwitch: "Troca rápida de conta",
    urgentNow: "Agora mesmo (top 3 urgentes)",
    fullscreen: "Tela cheia",
    zenMode: "Modo Zen",
    exitZen: "Sair do modo Zen",
    reload: "Recarregar WhatsApp Web",
    newChat: "Nova conversa (WhatsApp Web)",
    phoneChat: "Conversa por número",
    newAccount: "Nova conta",
    switchAccount: "Trocar de conta (posição na lista)",
  });
  Object.assign(en.app.about, {
    title: "Sobre o Catrip Connect",
    description: "Cliente de desktop para WhatsApp Web com várias contas isoladas.",
    developerHeading: "Desenvolvimento",
    author: "Autor",
    authorLink: "alktrip no GitHub",
    copyright: "© 2025–2026 Catrip · Licença MIT",
    projectLink: "Repositório desta aplicação",
    electronNote: "Electron + Chromium embutido para áudio e vídeo confiáveis.",
    inspired:
      "Inspirado em ideias do projeto ZapZap (PyQt6 + WebEngine). Implementação independente em Electron.",
  });
  Object.assign(en.app.incomingLink, {
    title: "Abrir link do WhatsApp",
    destination: "Destino:",
    preloaded: "Inclui mensagem pré-carregada.",
    chooseAccount: "Escolha a conta:",
  });
  Object.assign(en.app.phone, {
    title: "Enviar mensagem para…",
    hint: "Digite o número com código do país (ex.: +5511999999999):",
    footer: "Enter para abrir a conversa • Esc para fechar",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "Notas da versão",
    openRelease: "Ver release completa no GitHub",
  });
  Object.assign(en.app, {
    saveFile: "Salvar arquivo",
    chooseDownloads: "Escolher pasta de downloads",
  });
  Object.assign(en.activity, {
    title: "Centro de atividade",
    subtitle: "Resumo de mensagens não lidas em todas as suas contas.",
    totalUnread: "{{count}} não lidas no total",
    noUnread: "Sem mensagens não lidas",
    lastMessage: "Última mensagem",
    openAccount: "Abrir conta",
    empty: "Adicione uma conta para ver atividade aqui.",
    active: "Ativa",
    previewUnread: "Você tem mensagens não lidas",
    noRecentActivity: "Sem atividade recente",
  });
  Object.assign(en.pending, {
    title: "Ações pendentes",
    subtitle:
      "Conversas não lidas de todas as contas, por urgência. Clique para abrir no WhatsApp Web.",
    empty: "Sem conversas não lidas. Você está em dia!",
  });
  Object.assign(en.urgent, {
    aria: "Urgente agora",
    title: "Agora mesmo",
    subtitle: "O mais urgente em todas as suas contas",
    subtitleEmpty: "Sem conversas pendentes",
    empty: "Você está em dia. Sem conversas não lidas.",
    viewAll: "Ver todas as pendentes",
  });
  Object.assign(en.main.menus, {
    file: "Arquivo",
    view: "Exibir",
    chat: "Conversa",
    accounts: "Contas",
    help: "Ajuda",
    settings: "Configurações",
    hide: "Ocultar",
    quit: "Sair",
    quickSwitch: "Troca rápida de conta…",
    fullscreen: "Tela cheia",
    zenMode: "Modo Zen",
    urgentNow: "Agora mesmo",
    reload: "Recarregar",
    newChat: "Nova conversa",
    phoneChat: "Por número",
    newAccount: "Nova conta",
    userManual: "Manual do usuário",
    shortcuts: "Atalhos de teclado",
    about: "Sobre",
  });
  Object.assign(en.main.tray, {
    show: "Mostrar",
    hide: "Ocultar",
    settings: "Configurações",
    closeToTray: "Fechar para a bandeja (alternar)",
    accounts: "Contas",
    quit: "Sair",
    unreadSummary: "{{count}} mensagens não lidas",
    unreadSummaryOne: "1 mensagem não lida",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "Você tem 1 conversa não lida.",
    manyUnread: "Você tem {{count}} conversas não lidas.",
    generic: "Você tem conversas não lidas.",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "Salvar arquivo",
    chooseDownloads: "Escolher pasta de downloads",
    groupInvite: "Convite para grupo",
  });
  Object.assign(en.main.accountMenu, {
    active: " (ativa)",
    unread: " · {{count}} não lidas",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "Atualização disponível",
    availableMessage: "Catrip Connect {{version}} está pronto para instalar.",
    newVersion: "Nova versão disponível",
    newVersionMessage: "Há uma atualização: Catrip Connect {{version}}",
    verifyFailed: "Verificação do download",
    verifyTitle: "Não foi possível verificar o pacote .deb",
    integrityOk: "Integridade verificada (SHA-512).",
    integrityFail: "A soma SHA-512 do arquivo baixado não coincide com a publicada no GitHub.",
    downloadComplete: "Download concluído",
    downloadCompleteMessage: "Pacote .deb salvo",
    downloadFailed: "Erro no download",
    downloadFailedMessage: "Não foi possível salvar o .deb",
    manualDownload: "Download manual",
    chooseDebFolder: "Escolher pasta para salvar o .deb",
    restartNow: "Reiniciar agora",
    installLater: "Mais tarde",
    later: "Mais tarde",
    understood: "Entendido",
    download: "Baixar…",
    downloadLinkOnly: "Somente link de download",
    openFolder: "Abrir pasta",
    openBrowser: "Abrir link no navegador",
    debPromptHint:
      "Baixar o pacote .deb para uma pasta à sua escolha?\n(Se preferir não baixar pelo app, você pode abrir o link do GitHub.)",
    debManualFooterHint:
      "Baixe o instalador .deb em:\n{{debUrl}}\n\nDepois instale com apt ou seu gerenciador de pacotes.",
    debInstallHint: "Instale com:\nsudo apt install ./{{filename}}",
    restartFooterHint: "O app será reiniciado para aplicar a atualização.{{integrityLine}}",
    previewFooterHint:
      "Prévia do diálogo de atualização (desenvolvimento). Role para ler todas as notas.",
    downloadHttpError: "Não foi possível baixar ({{status}} {{statusText}})",
    openRelease: "Ver release completa no GitHub",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "Início automático desativado.",
    autostartOn: "Início automático ativado ({{path}}).",
    exeNotFound: "Executável do Catrip Connect não encontrado.",
    linuxOnly: "Disponível apenas no Linux.",
    protocolRegistered:
      "whatsapp:// registrado e ações do lançador atualizadas. Links https://wa.me no navegador não vão automaticamente ao Catrip: use whatsapp://, Abrir com… do navegador ou uma extensão.",
    protocolFailed: "Falha no registro.",
    protocolRegisteredShort: "Protocolo registrado.",
    noReleaseNotes: "Sem notas desta versão.",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "Nenhuma conta ativa.",
    viewUnavailable: "A vista web embutida não está disponível.",
    whatsappNotLoaded:
      "A conta ativa ainda não mostra web.whatsapp.com. Abra o WhatsApp Web no navegador integrado e tente de novo.",
    genericError: "Ocorreu um erro.",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "Mensagens",
    comment: "Cliente multiconta do WhatsApp Web",
    actionOpen: "Abrir Catrip Connect",
    actionFocus: "Focar janela",
    actionNewAccount: "Nova conta",
  });
  Object.assign(en.toasts, {
    close: "Fechar",
    closeNotification: "Fechar notificação",
  });
}

/** @param {Record<string, unknown>} en */
function assignFr(en) {
  Object.assign(en.common, {
    cancel: "Annuler",
    save: "Enregistrer",
    accept: "Accepter",
    close: "Fermer",
    back: "Retour",
    exit: "Quitter",
    loading: "Chargement…",
    deleting: "Suppression…",
    cleaning: "Nettoyage…",
    checking: "Vérification…",
    rename: "Renommer",
    delete: "Supprimer",
    deletePermanently: "Supprimer définitivement",
    noResults: "Aucun résultat",
    dash: "—",
    now: "Maintenant",
    minutesAgo: "Il y a {{count}} min",
    hoursAgo: "Il y a {{count}} h",
    daysAgo: "Il y a {{count}} j",
    unread: "{{count}} non lus",
    unreadOne: "1 non lu",
    unreadLabel: "non lus",
    messagesUnread: "{{count}} messages non lus",
    accountDefault: "Compte {{n}}",
    thisAccount: "ce compte",
    theAccount: "le compte",
    variant: "Variante {{n}}",
    version: "Version",
    automatic: "Automatique",
    noAccounts: "(aucun compte)",
  });
  Object.assign(en.sessionStatus, {
    loading: "Chargement…",
    qr: "En attente du QR",
    connected: "Connectée",
    offline: "Hors ligne",
  });
  Object.assign(en.commandGroups, {
    chats: "Discussions",
    accounts: "Comptes",
    actions: "Actions",
    navigation: "Navigation",
    appearance: "Apparence",
  });
  Object.assign(en.commands, {
    activeAccount: "Compte actif",
    switchAccount: "Basculer vers ce compte",
    newAccount: "Nouveau compte",
    newChat: "Nouvelle discussion (WhatsApp Web)",
    phoneChat: "Discussion par numéro…",
    urgentNow: "Tout de suite",
    urgentNowDesc: "Top 3 discussions urgentes sans grand panneau",
    activityCenter: "Centre d'activité",
    activityCenterDesc: "Aperçu de tous les comptes et non-lus",
    pendingInbox: "Actions en attente",
    pendingInboxDesc: "Discussions non lues triées par urgence",
    zenOn: "Activer le mode Zen",
    zenOff: "Quitter le mode Zen",
    openSettings: "Ouvrir Paramètres → {{page}}",
    hideSidebar: "Masquer la barre latérale (rail)",
    showSidebar: "Afficher la barre latérale (rail)",
    disableNotifications: "Désactiver notifications système",
    enableNotifications: "Activer les notifications système",
    uiScale: "Échelle interface : {{scale}}",
    unreadSuffix: " · {{count}} non lus",
  });
  Object.assign(en.settings.pages, {
    general: "Général",
    accounts: "Comptes",
    notifications: "Notifications",
    performance: "Performances (expérimental)",
    network: "Réseau",
  });
  Object.assign(en.settings, {
    title: "PARAMÈTRES",
    tools: "OUTILS",
  });
  Object.assign(en.settings.language, {
    label: "Langue de l'interface",
    hint: "Par défaut, suit la langue du système ; si indisponible, l'anglais est utilisé. Affecte menus, notifications et textes Catrip Connect. WhatsApp Web utilise sa propre langue.",
    system: "Langue du système",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "WhatsApp Web utilise une langue distincte",
    metaRestriction:
      "Meta n'autorise pas les applications tierces (comme Catrip Connect) à modifier la langue de WhatsApp Web via sa plateforme. En raison des restrictions d'utilisation et de confidentialité de WhatsApp, vous devez configurer la langue du chat manuellement dans WhatsApp Web.",
    intro:
      "La langue de Catrip Connect (menus, notifications et textes de l'application) a été mise à jour selon votre choix.",
    stepsTitle: "Pour changer la langue de WhatsApp Web :",
    step1: "Ouvrez WhatsApp Web dans la fenêtre principale (compte actif).",
    step2: "Cliquez sur le menu ⋮ (trois points) en haut à gauche, puis ouvrez Paramètres.",
    step3: "Allez dans Langue et choisissez la langue souhaitée pour WhatsApp.",
  });
  Object.assign(en.settings.scale, {
    title: "Échelle",
    hint: "Affecte l'interface et WhatsApp Web. Appliqué instantanément.",
  });
  Object.assign(en.settings.general, {
    startMinimized: "Démarrer minimisé",
    showSidebar: "Afficher la barre latérale",
    showMenuBar: "Afficher la barre de menu",
    closeToTray: "À la fermeture, réduire dans la barre système",
    autoStart: "Démarrer automatiquement avec le système",
    incomingLinks: "Liens WhatsApp entrants",
    incomingLinksHint: "Lors de l'ouverture de whatsapp:// ou wa.me depuis le système.",
    incomingLinkAuto: "Demander s'il y a plusieurs comptes",
    incomingLinkActive: "Toujours le compte actif",
    incomingLinkFixed: "Compte fixe",
    registerProtocol: "Enregistrer comme app par défaut (whatsapp://)",
    registerProtocolHint:
      "whatsapp:// — Après enregistrement, le système peut ouvrir les liens compatibles dans Catrip.",
    checkUpdates: "Rechercher des mises à jour au démarrage (GitHub Releases)",
    updateChannel: "Canal de mise à jour",
    updateChannelStable: "Stable (versions)",
    updateChannelBeta: "Bêta (préversions)",
    updateChannelHint:
      "AppImage : télécharge et installe au redémarrage. .deb : téléchargez le paquet dans un dossier ou ouvrez le lien GitHub ; changelog et SHA-512 du .deb dans la boîte de dialogue.",
    openDownloads: "Ouvrir les fichiers téléchargés avec l'app par défaut",
    askSaveAs: "Toujours demander « Enregistrer sous… »",
    downloadsSection: "Téléchargements",
    downloadsFolder: "Dossier de téléchargements",
    downloadsPlaceholder: "(dossier système)",
    chooseDownloadsFolder: "Choisir un dossier…",
    clearDownloadsFolder: "Utiliser le dossier système",
    resetDownloads: "Réinitialiser",
    downloadsFilenameHint: "WhatsApp Web contrôle le nom du fichier. Nom alternatif si existant.",
    waylandBrowserTitle: "https://wa.me dans le navigateur",
    waylandBrowserIntro:
      "Sous Wayland/Linux, le navigateur ne transmet pas les liens HTTPS. Options :",
    waylandOption1: "Utiliser des liens vers whatsapp:// (app ou favori).",
    waylandOption2: "Dans le navigateur : Ouvrir avec… → Catrip Connect.",
    waylandOption3: "Extension navigateur envoyant wa.me au protocole (non fournie).",
    waylandOption4: "Dans l'app : Ctrl+M ou coller le lien si le système le transmet.",
    waylandTerminal: "Vous pouvez aussi exécuter : npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "Nouveau compte",
    hint: "Renommez et choisissez une icône par compte. Le rail utilise les mêmes données.",
    accountName: "Nom du compte",
    internalId: "Identifiant interne",
    notifications: "Notifications pour ce compte",
    chooseIcon: "Choisir une icône",
    regenerateIcon: "Variante",
    regenerateIconTitle: "Restaurer l'icône générée (variante)",
    deleteTitle: "Supprimer ce compte et toutes ses données",
    renamed: "Compte «{{from}}» renommé en «{{to}}».",
    deleteConfirm: "Supprimer le compte «{{name}}» ?",
    deleteWarning:
      "Toute la session WhatsApp Web sera supprimée (cookies, stockage, IndexedDB, Service Workers, cache HTTP). Irréversible.",
    deleteHint: "Pour arrêter les notifications, désactivez sur la carte sans perdre la session.",
    deleted: "Compte «{{name}}» supprimé.",
    deleteFailed: "Impossible de supprimer «{{name}}».",
    deleteError: "Erreur suppression «{{name}}». Voir console.",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "Badge barre système via WhatsApp Web (non lus)",
    dockBadge: "Badge dock / lanceur (Linux)",
    enabled: "Notifications système",
    showAccountName: "Afficher le nom du compte",
    showPreview: "Afficher l'aperçu",
    doNotDisturb: "Ne pas déranger (pas d'alertes natives)",
    playSound: "Son système pour les notifications",
    badgeSumHint: "Somme des non-lus (GNOME/KDE requis).",
    manualBadgeLabel: "Badge manuel (test ; vide = auto)",
    riseHint:
      "Alerte quand les non-lus augmentent (limite par compte). Un clic focalise la fenêtre et active le compte.",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "Boost GPU au démarrage (expérimental)",
    gpuInfo:
      "Catrip Connect utilise le GPU Chromium. Sous Linux fenêtre opaque par défaut. Désactivez seulement si écran noir : CATRIP_DISABLE_GPU=1.",
    gpuBoostHint:
      "Active rasterisation renforcée, zero-copy et VA-API étendu sous Linux. Redémarrez après modification ou limite de processus.",
    suspendInactive: "Suspendre les comptes inactifs",
    suspendAfter: "Suspendre après (minutes)",
    suspendAfterLabel: "Suspendre après (minutes sans utiliser)",
    suspendHint:
      "Libère la RAM en fermant WhatsApp des comptes inutilisés ; session conservée. Retour instantané. En veille, notifications peuvent ne pas se mettre à jour.",
    inhibitSleep: "Éviter veille pendant appel vidéo",
    inhibitSleepHint: "Utilise le blocage d'énergie Electron pendant un appel.",
    clearCache: "Vider le cache HTTP (tous les comptes)",
    checkCodecs: "Vérifier les codecs",
    cacheCleared: "Cache HTTP vidé.",
    cacheFailed: "Impossible de vider le cache.",
    rendererLimit: "Limite de processus du renderer",
    rendererLimitHint: "0 = valeur par défaut Chromium. Redémarrage requis.",
    rendererDefault: "Par défaut",
    minutesOption: "{{count}} minutes",
    storageSection: "Stockage",
    storageHint: "Vide le cache HTTP (économise l'espace ; garde la session).",
    mediaDiagSection: "Diagnostic multimédia (WhatsApp Web)",
    mediaDiagHint: "Vérifie si Chromium lit les codecs dans la session active.",
    mediaDiagFootnote:
      "Si decodingInfo_mp4_h264_aac.supported est false ou MediaSource rejette MP4, audio/vidéo peut échouer.",
  });
  Object.assign(en.settings.network, {
    proxy: "Proxy réseau",
    proxyRules: "Règles de proxy",
    proxyRulesLabel: "Règles de proxy",
    proxyHint: "Ex. http=hôte:8080;https=hôte:8080",
    proxyPlaceholder: "Ex. http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "Appliqué à l'enregistrement (pas encore de bouton Appliquer).",
  });
  Object.assign(en.app.onboarding, {
    aria: "Bienvenue",
    title: "Bienvenue dans Catrip Connect",
    subtitle: "Client WhatsApp Web multi-comptes. Ajoutez votre premier compte.",
    addFirst: "Ajouter votre premier compte",
    hint: "Vous pouvez aussi cliquer sur + du rail (barre gauche, vert clignotant).",
  });
  Object.assign(en.app.rail, {
    createFirst: "Créer votre premier compte",
    newAccount: "Nouveau compte",
    phoneChat: "Nouvelle discussion par numéro",
    newChat: "Nouvelle discussion (WhatsApp Web)",
    urgentNow: "Tout de suite — discussions les plus urgentes (Ctrl+Shift+A)",
    pending: "Actions en attente",
    activity: "Centre d'activité",
    settings: "Paramètres",
    zen: "Mode Zen (Échap pour quitter)",
    suspended: " · En veille (économise la mémoire)",
    tooltip:
      "{{label}} · {{status}}{{unread}}{{suspended}} · Glisser pour réordonner · Clic droit : variante",
  });
  Object.assign(en.app.palette, {
    title: "Palette de commandes",
    placeholder: "Rechercher discussions, comptes ou actions…",
    hint: "↑ ↓ pour naviguer • Entrée pour exécuter • Échap pour fermer",
  });
  Object.assign(en.app.shortcuts, {
    title: "Raccourcis clavier",
    hint: "Référence rapide ; aussi dans le menu.",
    footer: "Échap ferme. Clic extérieur aussi.",
    file: "Fichier",
    view: "Afficher",
    chat: "Discussion",
    accounts: "Comptes",
    settings: "Paramètres",
    hideWindow: "Masquer la fenêtre",
    quit: "Quitter",
    quickSwitch: "Changement rapide de compte",
    urgentNow: "Tout de suite (top 3 urgent)",
    fullscreen: "Plein écran",
    zenMode: "Mode Zen",
    exitZen: "Quitter le mode Zen",
    reload: "Recharger WhatsApp Web",
    newChat: "Nouvelle discussion (WhatsApp Web)",
    phoneChat: "Discussion par numéro",
    newAccount: "Nouveau compte",
    switchAccount: "Changer de compte (position dans la liste)",
  });
  Object.assign(en.app.about, {
    title: "À propos de Catrip Connect",
    description: "Client de bureau WhatsApp Web avec comptes isolés.",
    developerHeading: "Développement",
    author: "Auteur",
    authorLink: "alktrip sur GitHub",
    copyright: "© 2025–2026 Catrip · Licence MIT",
    projectLink: "Dépôt de cette application",
    electronNote: "Electron + Chromium intégré pour audio/vidéo fiables.",
    inspired: "Inspiré de ZapZap (PyQt6 + WebEngine). Implémentation Electron indépendante.",
  });
  Object.assign(en.app.incomingLink, {
    title: "Ouvrir le lien WhatsApp",
    destination: "Destination :",
    preloaded: "Inclut un message préchargé.",
    chooseAccount: "Choisissez le compte :",
  });
  Object.assign(en.app.phone, {
    title: "Envoyer un message à…",
    hint: "Saisissez le numéro avec indicatif (ex. +5511999999999) :",
    footer: "Entrée ouvre • Échap ferme",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "Notes de version",
    openRelease: "Voir la release complète sur GitHub",
  });
  Object.assign(en.app, {
    saveFile: "Enregistrer le fichier",
    chooseDownloads: "Choisir dossier de téléchargements",
  });
  Object.assign(en.activity, {
    title: "Centre d'activité",
    subtitle: "Résumé des non-lus sur tous vos comptes.",
    totalUnread: "{{count}} non lus au total",
    noUnread: "Aucun message non lu",
    lastMessage: "Dernier message",
    openAccount: "Ouvrir le compte",
    empty: "Ajoutez un compte pour voir l'activité ici.",
    active: "Active",
    previewUnread: "Vous avez des messages non lus",
    noRecentActivity: "Aucune activité récente",
  });
  Object.assign(en.pending, {
    title: "Actions en attente",
    subtitle:
      "Discussions non lues de tous les comptes, par urgence. Cliquez pour ouvrir dans WhatsApp Web.",
    empty: "Aucune discussion non lue. Vous êtes à jour !",
  });
  Object.assign(en.urgent, {
    aria: "Urgent maintenant",
    title: "Tout de suite",
    subtitle: "Le plus urgent sur tous vos comptes",
    subtitleEmpty: "Aucune conversation en attente",
    empty: "Vous êtes à jour. Aucune discussion non lue.",
    viewAll: "Voir toutes les en attente",
  });
  Object.assign(en.main.menus, {
    file: "Fichier",
    view: "Afficher",
    chat: "Discussion",
    accounts: "Comptes",
    help: "Aide",
    settings: "Paramètres",
    hide: "Masquer",
    quit: "Quitter",
    quickSwitch: "Changement rapide de compte…",
    fullscreen: "Plein écran",
    zenMode: "Mode Zen",
    urgentNow: "Tout de suite",
    reload: "Recharger",
    newChat: "Nouvelle discussion",
    phoneChat: "Par numéro",
    newAccount: "Nouveau compte",
    userManual: "Manuel utilisateur",
    shortcuts: "Raccourcis clavier",
    about: "À propos",
  });
  Object.assign(en.main.tray, {
    show: "Afficher",
    hide: "Masquer",
    settings: "Paramètres",
    closeToTray: "Fermer dans la barre système (basculer)",
    accounts: "Comptes",
    quit: "Quitter",
    unreadSummary: "{{count}} messages non lus",
    unreadSummaryOne: "1 message non lu",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "Vous avez 1 discussion non lue.",
    manyUnread: "Vous avez {{count}} discussions non lues.",
    generic: "Vous avez des discussions non lues.",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "Enregistrer le fichier",
    chooseDownloads: "Choisir dossier de téléchargements",
    groupInvite: "Invitation de groupe",
  });
  Object.assign(en.main.accountMenu, {
    active: " (active)",
    unread: " · {{count}} non lus",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "Mise à jour disponible",
    availableMessage: "Catrip Connect {{version}} est prêt à installer.",
    newVersion: "Nouvelle version disponible",
    newVersionMessage: "Mise à jour : Catrip Connect {{version}}",
    verifyFailed: "Vérification du téléchargement",
    verifyTitle: "Impossible de vérifier le .deb",
    integrityOk: "Intégrité vérifiée (SHA-512).",
    integrityFail:
      "La somme SHA-512 du fichier téléchargé ne correspond pas à celle publiée sur GitHub.",
    downloadComplete: "Téléchargement terminé",
    downloadCompleteMessage: "Paquet .deb enregistré",
    downloadFailed: "Erreur de téléchargement",
    downloadFailedMessage: "Impossible d'enregistrer le .deb",
    manualDownload: "Téléchargement manuel",
    chooseDebFolder: "Choisir dossier pour le .deb",
    restartNow: "Redémarrer maintenant",
    installLater: "Plus tard",
    later: "Plus tard",
    understood: "Compris",
    download: "Télécharger…",
    downloadLinkOnly: "Lien de téléchargement uniquement",
    openFolder: "Ouvrir le dossier",
    openBrowser: "Ouvrir le lien dans le navigateur",
    debPromptHint:
      "Télécharger le paquet .deb dans un dossier de votre choix ?\n(Sinon, vous pourrez ouvrir le lien GitHub.)",
    debManualFooterHint:
      "Téléchargez l'installateur .deb depuis :\n{{debUrl}}\n\nPuis installez-le avec apt ou votre gestionnaire de paquets.",
    debInstallHint: "Installez avec :\nsudo apt install ./{{filename}}",
    restartFooterHint: "L'application redémarrera pour appliquer la mise à jour.{{integrityLine}}",
    previewFooterHint:
      "Aperçu du dialogue de mise à jour (développement). Faites défiler pour lire toutes les notes.",
    downloadHttpError: "Impossible de télécharger ({{status}} {{statusText}})",
    openRelease: "Voir la release complète sur GitHub",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "Démarrage auto désactivé.",
    autostartOn: "Démarrage auto activé ({{path}}).",
    exeNotFound: "Exécutable Catrip Connect introuvable.",
    linuxOnly: "Disponible uniquement sous Linux.",
    protocolRegistered:
      "whatsapp:// enregistré. Les liens https://wa.me ne passent pas automatiquement : utilisez whatsapp://, Ouvrir avec… ou une extension.",
    protocolFailed: "Échec de l'enregistrement.",
    protocolRegisteredShort: "Protocole enregistré.",
    noReleaseNotes: "Aucune note pour cette version.",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "Aucun compte actif.",
    viewUnavailable: "La vue web intégrée n'est pas disponible.",
    whatsappNotLoaded:
      "Le compte actif n'affiche pas encore web.whatsapp.com. Ouvrez WhatsApp Web dans le navigateur intégré et réessayez.",
    genericError: "Une erreur s'est produite.",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "Messages",
    comment: "Client WhatsApp Web multi-comptes",
    actionOpen: "Ouvrir Catrip Connect",
    actionFocus: "Focaliser la fenêtre",
    actionNewAccount: "Nouveau compte",
  });
  Object.assign(en.toasts, {
    close: "Fermer",
    closeNotification: "Fermer la notification",
  });
}

/** @param {Record<string, unknown>} en */
function assignDe(en) {
  Object.assign(en.common, {
    cancel: "Abbrechen",
    save: "Speichern",
    accept: "OK",
    close: "Schließen",
    back: "Zurück",
    exit: "Beenden",
    loading: "Wird geladen…",
    deleting: "Wird gelöscht…",
    cleaning: "Wird geleert…",
    checking: "Wird geprüft…",
    rename: "Umbenennen",
    delete: "Löschen",
    deletePermanently: "Endgültig löschen",
    noResults: "Keine Ergebnisse",
    dash: "—",
    now: "Jetzt",
    minutesAgo: "Vor {{count}} Min",
    hoursAgo: "Vor {{count}} Std",
    daysAgo: "Vor {{count}} T",
    unread: "{{count}} ungelesen",
    unreadOne: "1 ungelesen",
    unreadLabel: "ungelesen",
    messagesUnread: "{{count}} ungelesene Nachrichten",
    accountDefault: "Konto {{n}}",
    thisAccount: "dieses Konto",
    theAccount: "das Konto",
    variant: "Variante {{n}}",
    version: "Version",
    automatic: "Automatisch",
    noAccounts: "(keine Konten)",
  });
  Object.assign(en.sessionStatus, {
    loading: "Wird geladen…",
    qr: "Warte auf QR",
    connected: "Verbunden",
    offline: "Offline",
  });
  Object.assign(en.commandGroups, {
    chats: "Chats",
    accounts: "Konten",
    actions: "Aktionen",
    navigation: "Navigation",
    appearance: "Erscheinungsbild",
  });
  Object.assign(en.commands, {
    activeAccount: "Aktives Konto",
    switchAccount: "Zu diesem Konto wechseln",
    newAccount: "Neues Konto",
    newChat: "Neuer Chat (WhatsApp Web)",
    phoneChat: "Chat per Telefonnummer…",
    urgentNow: "Gerade jetzt",
    urgentNowDesc: "Top 3 dringende Chats ohne großes Panel",
    activityCenter: "Aktivitätszentrum",
    activityCenterDesc: "Überblick aller Konten und Ungelesenen",
    pendingInbox: "Ausstehende Aktionen",
    pendingInboxDesc: "Ungelesene Chats nach Dringlichkeit",
    zenOn: "Zen-Modus aktivieren",
    zenOff: "Zen-Modus beenden",
    openSettings: "Einstellungen öffnen → {{page}}",
    hideSidebar: "Seitenleiste ausblenden (Rail)",
    showSidebar: "Seitenleiste anzeigen (Rail)",
    disableNotifications: "Systembenachrichtigungen deaktivieren",
    enableNotifications: "Systembenachrichtigungen aktivieren",
    uiScale: "UI-Skalierung: {{scale}}",
    unreadSuffix: " · {{count}} ungelesen",
  });
  Object.assign(en.settings.pages, {
    general: "Allgemein",
    accounts: "Konten",
    notifications: "Benachrichtigungen",
    performance: "Leistung (experimentell)",
    network: "Netzwerk",
  });
  Object.assign(en.settings, {
    title: "EINSTELLUNGEN",
    tools: "WERKZEUGE",
  });
  Object.assign(en.settings.language, {
    label: "Oberflächensprache",
    hint: "Standardmäßig Systemsprache; falls nicht verfügbar, Englisch. Beeinflusst Menüs, Benachrichtigungen und Catrip-Connect-Texte. WhatsApp Web nutzt seine eigene Sprache.",
    system: "Systemsprache",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "WhatsApp Web nutzt eine eigene Sprache",
    metaRestriction:
      "Meta erlaubt es Drittanbieter-Apps (wie Catrip Connect) nicht, die Sprache von WhatsApp Web über die Plattform zu ändern. Aufgrund der WhatsApp-Nutzungsbeschränkungen und Datenschutzregeln müssen Sie die Chatsprache manuell in WhatsApp Web einstellen.",
    intro:
      "Die Sprache von Catrip Connect (Menüs, Benachrichtigungen und App-Texte) wurde auf Ihre Auswahl aktualisiert.",
    stepsTitle: "So ändern Sie die Sprache von WhatsApp Web:",
    step1: "Öffnen Sie WhatsApp Web im Hauptfenster (aktives Konto).",
    step2: "Klicken Sie oben links auf das ⋮-Menü (drei Punkte) und öffnen Sie Einstellungen.",
    step3: "Gehen Sie zu Sprache und wählen Sie Ihre bevorzugte WhatsApp-Sprache.",
  });
  Object.assign(en.settings.scale, {
    title: "Skalierung",
    hint: "Beeinflusst UI und WhatsApp Web. Sofort angewendet.",
  });
  Object.assign(en.settings.general, {
    startMinimized: "Minimiert starten",
    showSidebar: "Seitenleiste anzeigen",
    showMenuBar: "Menüleiste anzeigen",
    closeToTray: "Beim Schließen in Tray minimieren",
    autoStart: "Automatisch mit System starten",
    incomingLinks: "Eingehende WhatsApp-Links",
    incomingLinksHint: "Beim Öffnen von whatsapp:// oder wa.me vom System.",
    incomingLinkAuto: "Fragen bei mehreren Konten",
    incomingLinkActive: "Immer das aktive Konto",
    incomingLinkFixed: "Festes Konto",
    registerProtocol: "Als Standard-App registrieren (whatsapp://)",
    registerProtocolHint:
      "whatsapp:// — Nach Registrierung kann das System kompatible Links in Catrip öffnen.",
    checkUpdates: "Beim Start nach Updates suchen (GitHub Releases)",
    updateChannel: "Update-Kanal",
    updateChannelStable: "Stabil (Releases)",
    updateChannelBeta: "Beta (Vorabversionen)",
    updateChannelHint:
      "AppImage: lädt beim Neustart herunter und installiert. .deb: Paket in Ordner laden oder nur GitHub-Link; Changelog und SHA-512 im Dialog.",
    openDownloads: "Heruntergeladene Dateien mit Standard-App öffnen",
    askSaveAs: "Immer „Speichern unter…“ fragen",
    downloadsSection: "Downloads",
    downloadsFolder: "Downloadordner",
    downloadsPlaceholder: "(Systemordner)",
    chooseDownloadsFolder: "Ordner wählen…",
    clearDownloadsFolder: "Systemordner verwenden",
    resetDownloads: "Zurücksetzen",
    downloadsFilenameHint: "WhatsApp Web steuert Dateinamen. Alternativer Name bei Konflikt.",
    waylandBrowserTitle: "https://wa.me im Browser",
    waylandBrowserIntro: "Unter Wayland/Linux keine HTTPS-Weitergabe. Optionen:",
    waylandOption1: "Links zu whatsapp:// nutzen (App/Lesezeichen).",
    waylandOption2: "Im Browser: Öffnen mit… → Catrip Connect.",
    waylandOption3: "Browser-Erweiterung für wa.me zum Protokoll (nicht enthalten).",
    waylandOption4: "In der App: Strg+M oder Link einfügen.",
    waylandTerminal: "Oder im Terminal: npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "Neues Konto",
    hint: "Umbenennen und Symbol pro Konto. Der Rail nutzt dieselben Daten.",
    accountName: "Kontoname",
    internalId: "Interne Kennung",
    notifications: "Benachrichtigungen für dieses Konto",
    chooseIcon: "Symbol wählen",
    regenerateIcon: "Variante",
    regenerateIconTitle: "Generiertes Symbol wiederherstellen (Variante)",
    deleteTitle: "Dieses Konto und alle Daten löschen",
    renamed: "Konto «{{from}}» in «{{to}}» umbenannt.",
    deleteConfirm: "Konto «{{name}}» löschen?",
    deleteWarning:
      "Gesamte WhatsApp-Web-Sitzung wird gelöscht (Cookies, Speicher, IndexedDB, Service Workers, HTTP-Cache). Unwiderruflich.",
    deleteHint: "Benachrichtigungen auf der Karte deaktivieren ohne Sitzung zu verlieren.",
    deleted: "Konto «{{name}}» gelöscht.",
    deleteFailed: "«{{name}}» konnte nicht gelöscht werden.",
    deleteError: "Fehler beim Löschen «{{name}}». Konsole prüfen.",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "Tray-Badge über WhatsApp Web (ungelesen)",
    dockBadge: "Badge Dock/Starter (Linux)",
    enabled: "Systembenachrichtigungen",
    showAccountName: "Kontoname anzeigen",
    showPreview: "Vorschau anzeigen",
    doNotDisturb: "Nicht stören (keine nativen Hinweise)",
    playSound: "Systemton bei Benachrichtigungen",
    badgeSumHint: "Summe ungelesen (GNOME/KDE).",
    manualBadgeLabel: "Manuelles Badge (Test; leer = auto)",
    riseHint:
      "Hinweis bei steigenden Ungelesenen (Limit pro Konto). Klick fokussiert Fenster und aktiviert Konto.",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "GPU-Boost beim Start (experimentell)",
    gpuInfo:
      "Catrip Connect nutzt Chromium-GPU. Unter Linux opakes Fenster. Nur bei schwarzem Bildschirm deaktivieren: CATRIP_DISABLE_GPU=1.",
    gpuBoostHint:
      "Aktiviert verstärkte Rasterisierung, Zero-Copy und erweitertes VA-API unter Linux. Nach Änderung neu starten.",
    suspendInactive: "Inaktive Konten suspendieren",
    suspendAfter: "Suspendieren nach (Minuten)",
    suspendAfterLabel: "Suspendieren nach (Minuten ohne Nutzung)",
    suspendHint:
      "Spart RAM durch Schließen ungenutzter WhatsApp-Ansichten; Sitzung bleibt. Sofortiges Neuladen. Im Ruhezustand ggf. keine Benachrichtigungen.",
    inhibitSleep: "Schlaf bei Videoanruf verhindern",
    inhibitSleepHint: "Nutzt Electron-Energiesperre während Anruf.",
    clearCache: "HTTP-Cache leeren (alle Konten)",
    checkCodecs: "Codecs jetzt prüfen",
    cacheCleared: "HTTP-Cache geleert.",
    cacheFailed: "Cache konnte nicht geleert werden.",
    rendererLimit: "Renderer-Prozesslimit",
    rendererLimitHint: "0 = Chromium-Standard. Neustart erforderlich.",
    rendererDefault: "Standard",
    minutesOption: "{{count}} Minuten",
    storageSection: "Speicher",
    storageHint: "Leert HTTP-Cache aller Konten (spart Platz; Sitzung meist erhalten).",
    mediaDiagSection: "Multimedia-Diagnose (WhatsApp Web)",
    mediaDiagHint: "Prüft Codec-Wiedergabe in aktiver Sitzung.",
    mediaDiagFootnote:
      "Wenn decodingInfo_mp4_h264_aac.supported false ist oder MP4 abgelehnt wird, kann Audio/Video fehlschlagen.",
  });
  Object.assign(en.settings.network, {
    proxy: "Netzwerkproxy",
    proxyRules: "Proxy-Regeln",
    proxyRulesLabel: "Proxy-Regeln",
    proxyHint: "z. B. http=host:8080;https=host:8080",
    proxyPlaceholder: "z. B. http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "Wird beim Speichern angewendet (noch kein Übernehmen).",
  });
  Object.assign(en.app.onboarding, {
    aria: "Willkommen",
    title: "Willkommen bei Catrip Connect",
    subtitle: "Multi-Konto-WhatsApp-Web-Client. Fügen Sie Ihr erstes Konto hinzu.",
    addFirst: "Erstes Konto hinzufügen",
    hint: "Oder + im Rail klicken (links, grün blinkend).",
  });
  Object.assign(en.app.rail, {
    createFirst: "Erstes Konto erstellen",
    newAccount: "Neues Konto",
    phoneChat: "Neuer Chat per Nummer",
    newChat: "Neuer Chat (WhatsApp Web)",
    urgentNow: "Gerade jetzt — dringendste Chats (Strg+Umschalt+A)",
    pending: "Ausstehende Aktionen",
    activity: "Aktivitätszentrum",
    settings: "Einstellungen",
    zen: "Zen-Modus (Esc zum Beenden)",
    suspended: " · Ruhend (spart Speicher)",
    tooltip:
      "{{label}} · {{status}}{{unread}}{{suspended}} · Ziehen zum Sortieren · Rechtsklick: Variante",
  });
  Object.assign(en.app.palette, {
    title: "Befehlspalette",
    placeholder: "Chats, Konten oder Aktionen suchen…",
    hint: "↑ ↓ navigieren • Eingabe ausführen • Esc schließen",
  });
  Object.assign(en.app.shortcuts, {
    title: "Tastenkürzel",
    hint: "Kurzreferenz; auch im Menü.",
    footer: "Esc schließt. Klick außen auch.",
    file: "Datei",
    view: "Anzeigen",
    chat: "Chat",
    accounts: "Konten",
    settings: "Einstellungen",
    hideWindow: "Fenster ausblenden",
    quit: "Beenden",
    quickSwitch: "Schneller Kontowechsel",
    urgentNow: "Gerade jetzt (Top 3 dringend)",
    fullscreen: "Vollbild",
    zenMode: "Zen-Modus",
    exitZen: "Zen-Modus beenden",
    reload: "WhatsApp Web neu laden",
    newChat: "Neuer Chat (WhatsApp Web)",
    phoneChat: "Chat per Nummer",
    newAccount: "Neues Konto",
    switchAccount: "Konto wechseln (Listenposition)",
  });
  Object.assign(en.app.about, {
    title: "Über Catrip Connect",
    description: "Desktop-Client für WhatsApp Web mit isolierten Konten.",
    developerHeading: "Entwicklung",
    author: "Autor",
    authorLink: "alktrip auf GitHub",
    copyright: "© 2025–2026 Catrip · MIT-Lizenz",
    projectLink: "Repository dieser Anwendung",
    electronNote: "Electron + eingebettetes Chromium für zuverlässige Wiedergabe.",
    inspired: "Inspiriert von ZapZap (PyQt6 + WebEngine). Unabhängige Electron-Implementierung.",
  });
  Object.assign(en.app.incomingLink, {
    title: "WhatsApp-Link öffnen",
    destination: "Ziel:",
    preloaded: "Enthält vorgeladene Nachricht.",
    chooseAccount: "Konto wählen:",
  });
  Object.assign(en.app.phone, {
    title: "Nachricht senden an…",
    hint: "Nummer mit Ländervorwahl (z. B. +5511999999999):",
    footer: "Eingabe öffnet • Esc schließt",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "Versionshinweise",
    openRelease: "Vollständiges Release auf GitHub",
  });
  Object.assign(en.app, {
    saveFile: "Datei speichern",
    chooseDownloads: "Downloadordner wählen",
  });
  Object.assign(en.activity, {
    title: "Aktivitätszentrum",
    subtitle: "Ungelesene Zusammenfassung aller Konten.",
    totalUnread: "{{count}} ungelesen insgesamt",
    noUnread: "Keine ungelesenen Nachrichten",
    lastMessage: "Letzte Nachricht",
    openAccount: "Konto öffnen",
    empty: "Fügen Sie ein Konto hinzu, um hier Aktivität zu sehen.",
    active: "Aktiv",
    previewUnread: "Sie haben ungelesene Nachrichten",
    noRecentActivity: "Keine kürzliche Aktivität",
  });
  Object.assign(en.pending, {
    title: "Ausstehende Aktionen",
    subtitle: "Ungelesene Chats aller Konten nach Dringlichkeit. Klick öffnet in WhatsApp Web.",
    empty: "Keine ungelesenen Chats. Alles erledigt!",
  });
  Object.assign(en.urgent, {
    aria: "Jetzt dringend",
    title: "Gerade jetzt",
    subtitle: "Am dringendsten auf allen Konten",
    subtitleEmpty: "Keine ausstehenden Gespräche",
    empty: "Alles erledigt. Keine ungelesenen Chats.",
    viewAll: "Alle ausstehenden anzeigen",
  });
  Object.assign(en.main.menus, {
    file: "Datei",
    view: "Anzeigen",
    chat: "Chat",
    accounts: "Konten",
    help: "Hilfe",
    settings: "Einstellungen",
    hide: "Ausblenden",
    quit: "Beenden",
    quickSwitch: "Schneller Kontowechsel…",
    fullscreen: "Vollbild",
    zenMode: "Zen-Modus",
    urgentNow: "Gerade jetzt",
    reload: "Neu laden",
    newChat: "Neuer Chat",
    phoneChat: "Per Nummer",
    newAccount: "Neues Konto",
    userManual: "Benutzerhandbuch",
    shortcuts: "Tastenkürzel",
    about: "Über",
  });
  Object.assign(en.main.tray, {
    show: "Anzeigen",
    hide: "Ausblenden",
    settings: "Einstellungen",
    closeToTray: "In Tray schließen (umschalten)",
    accounts: "Konten",
    quit: "Beenden",
    unreadSummary: "{{count}} ungelesene Nachrichten",
    unreadSummaryOne: "1 ungelesene Nachricht",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "Sie haben 1 ungelesenen Chat.",
    manyUnread: "Sie haben {{count}} ungelesene Chats.",
    generic: "Sie haben ungelesene Chats.",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "Datei speichern",
    chooseDownloads: "Downloadordner wählen",
    groupInvite: "Gruppeneinladung",
  });
  Object.assign(en.main.accountMenu, {
    active: " (aktiv)",
    unread: " · {{count}} ungelesen",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "Update verfügbar",
    availableMessage: "Catrip Connect {{version}} ist installierungsbereit.",
    newVersion: "Neue Version verfügbar",
    newVersionMessage: "Update: Catrip Connect {{version}}",
    verifyFailed: "Download-Überprüfung",
    verifyTitle: ".deb konnte nicht verifiziert werden",
    integrityOk: "Integrität verifiziert (SHA-512).",
    integrityFail:
      "Die SHA-512-Prüfsumme der heruntergeladenen Datei stimmt nicht mit GitHub überein.",
    downloadComplete: "Download abgeschlossen",
    downloadCompleteMessage: ".deb-Paket gespeichert",
    downloadFailed: "Downloadfehler",
    downloadFailedMessage: ".deb konnte nicht gespeichert werden",
    manualDownload: "Manueller Download",
    chooseDebFolder: "Ordner für .deb wählen",
    restartNow: "Jetzt neu starten",
    installLater: "Später",
    later: "Später",
    understood: "Verstanden",
    download: "Herunterladen…",
    downloadLinkOnly: "Nur Download-Link",
    openFolder: "Ordner öffnen",
    openBrowser: "Link im Browser öffnen",
    debPromptHint:
      ".deb-Paket in einen Ordner Ihrer Wahl herunterladen?\n(Alternativ können Sie den GitHub-Link öffnen.)",
    debManualFooterHint:
      "Laden Sie das .deb-Installationspaket von herunter:\n{{debUrl}}\n\nInstallieren Sie es dann mit apt oder Ihrem Paketmanager.",
    debInstallHint: "Installieren mit:\nsudo apt install ./{{filename}}",
    restartFooterHint: "Die App wird neu gestartet, um das Update anzuwenden.{{integrityLine}}",
    previewFooterHint:
      "Vorschau des Update-Dialogs (Entwicklung). Scrollen Sie, um alle Hinweise zu lesen.",
    downloadHttpError: "Download fehlgeschlagen ({{status}} {{statusText}})",
    openRelease: "Vollständiges Release auf GitHub",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "Autostart deaktiviert.",
    autostartOn: "Autostart aktiviert ({{path}}).",
    exeNotFound: "Catrip-Connect-Ausführbare nicht gefunden.",
    linuxOnly: "Nur unter Linux verfügbar.",
    protocolRegistered:
      "whatsapp:// registriert. https://wa.me im Browser geht nicht automatisch: whatsapp://, Öffnen mit… oder Erweiterung.",
    protocolFailed: "Registrierung fehlgeschlagen.",
    protocolRegisteredShort: "Protokoll registriert.",
    noReleaseNotes: "Keine Versionshinweise.",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "Kein aktives Konto.",
    viewUnavailable: "Die eingebettete Webansicht ist nicht verfügbar.",
    whatsappNotLoaded:
      "Das aktive Konto zeigt web.whatsapp.com noch nicht. Öffnen Sie WhatsApp Web im eingebetteten Browser und versuchen Sie es erneut.",
    genericError: "Ein Fehler ist aufgetreten.",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "Nachrichten",
    comment: "Multi-Konto-WhatsApp-Web-Client",
    actionOpen: "Catrip Connect öffnen",
    actionFocus: "Fenster fokussieren",
    actionNewAccount: "Neues Konto",
  });
  Object.assign(en.toasts, {
    close: "Schließen",
    closeNotification: "Benachrichtigung schließen",
  });
}

/** @param {Record<string, unknown>} en */
function assignKo(en) {
  Object.assign(en.common, {
    cancel: "취소",
    save: "저장",
    accept: "확인",
    close: "닫기",
    back: "뒤로",
    exit: "종료",
    loading: "로딩 중…",
    deleting: "삭제 중…",
    cleaning: "지우는 중…",
    checking: "확인 중…",
    rename: "이름 변경",
    delete: "삭제",
    deletePermanently: "영구 삭제",
    noResults: "결과 없음",
    dash: "—",
    now: "지금",
    minutesAgo: "{{count}}분 전",
    hoursAgo: "{{count}}시간 전",
    daysAgo: "{{count}}일 전",
    unread: "{{count}}개 읽지 않음",
    unreadOne: "1개 읽지 않음",
    unreadLabel: "읽지 않음",
    messagesUnread: "읽지 않은 메시지 {{count}}개",
    accountDefault: "계정 {{n}}",
    thisAccount: "이 계정",
    theAccount: "계정",
    variant: "변형 {{n}}",
    version: "버전",
    automatic: "자동",
    noAccounts: "(계정 없음)",
  });
  Object.assign(en.sessionStatus, {
    loading: "로딩 중…",
    qr: "QR 대기 중",
    connected: "연결됨",
    offline: "오프라인",
  });
  Object.assign(en.commandGroups, {
    chats: "채팅",
    accounts: "계정",
    actions: "작업",
    navigation: "탐색",
    appearance: "모양",
  });
  Object.assign(en.commands, {
    activeAccount: "활성 계정",
    switchAccount: "이 계정으로 전환",
    newAccount: "새 계정",
    newChat: "새 대화(WhatsApp Web)",
    phoneChat: "전화번호로 채팅…",
    urgentNow: "지금 바로",
    urgentNowDesc: "큰 패널 없이 긴급 상위 3개 대화",
    activityCenter: "활동 센터",
    activityCenterDesc: "모든 계정 및 읽지 않은 메시지 개요",
    pendingInbox: "보류 작업",
    pendingInboxDesc: "모든 계정의 읽지 않은 대화(긴급순)",
    zenOn: "젠 모드 켜기",
    zenOff: "젠 모드 종료",
    openSettings: "설정 열기 → {{page}}",
    hideSidebar: "사이드바 숨기기(rail)",
    showSidebar: "사이드바 표시(rail)",
    disableNotifications: "시스템 알림 끄기",
    enableNotifications: "시스템 알림 켜기",
    uiScale: "인터페이스 배율: {{scale}}",
    unreadSuffix: " · {{count}}개 읽지 않음",
  });
  Object.assign(en.settings.pages, {
    general: "일반",
    accounts: "계정",
    notifications: "알림",
    performance: "성능(실험적)",
    network: "네트워크",
  });
  Object.assign(en.settings, {
    title: "설정",
    tools: "도구",
  });
  Object.assign(en.settings.language, {
    label: "인터페이스 언어",
    hint: "기본값은 시스템 언어이며, 지원되지 않으면 영어로 표시됩니다. 메뉴, 알림 및 Catrip Connect 텍스트에 영향을 줍니다. WhatsApp Web은 자체 언어를 사용합니다.",
    system: "시스템 언어",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "WhatsApp Web은 별도의 언어를 사용합니다",
    metaRestriction:
      "Meta는 Catrip Connect 같은 서드파티 앱이 플랫폼을 통해 WhatsApp Web의 언어를 변경하는 것을 허용하지 않습니다. WhatsApp 사용 제한 및 개인정보 보호 정책 때문에 채팅 언어는 WhatsApp Web 내에서 직접 설정해야 합니다.",
    intro: "Catrip Connect 언어(메뉴, 알림 및 앱 텍스트)는 방금 선택한 언어로 업데이트되었습니다.",
    stepsTitle: "WhatsApp Web 언어 변경 방법:",
    step1: "메인 창에서 WhatsApp Web을 엽니다(활성 계정).",
    step2: "왼쪽 상단 ⋮(점 세 개) 메뉴를 클릭하고 설정을 엽니다.",
    step3: "언어로 이동해 WhatsApp에 사용할 언어를 선택합니다.",
  });
  Object.assign(en.settings.scale, {
    title: "배율",
    hint: "UI 및 WhatsApp Web에 영향을 줍니다. 즉시 적용됩니다.",
  });
  Object.assign(en.settings.general, {
    startMinimized: "최소화 상태로 시작",
    showSidebar: "사이드바 표시",
    showMenuBar: "메뉴 막대 표시",
    closeToTray: "닫을 때 트레이로 최소화",
    autoStart: "시스템 시작 시 자동 실행",
    incomingLinks: "수신 WhatsApp 링크",
    incomingLinksHint: "시스템에서 whatsapp:// 또는 wa.me를 열 때.",
    incomingLinkAuto: "여러 계정이 있으면 묻기",
    incomingLinkActive: "항상 활성 계정",
    incomingLinkFixed: "고정 계정",
    registerProtocol: "기본 앱으로 등록(whatsapp://)",
    registerProtocolHint: "whatsapp:// — 등록 후 시스템이 Catrip에서 호환 링크를 열 수 있습니다.",
    checkUpdates: "시작 시 업데이트 확인(GitHub Releases)",
    updateChannel: "업데이트 채널",
    updateChannelStable: "안정(릴리스)",
    updateChannelBeta: "베타(프리릴리스)",
    updateChannelHint:
      "AppImage: 재시작 시 설치. .deb: 폴더에 받거나 GitHub 링크만 열기; 대화상자에 changelog와 SHA-512 표시.",
    openDownloads: "다운로드한 파일을 기본 앱으로 열기",
    askSaveAs: "항상 “다른 이름으로 저장…” 묻기",
    downloadsSection: "다운로드",
    downloadsFolder: "다운로드 폴더",
    downloadsPlaceholder: "(시스템 폴더)",
    chooseDownloadsFolder: "폴더 선택…",
    clearDownloadsFolder: "시스템 폴더 사용",
    resetDownloads: "재설정",
    downloadsFilenameHint: "WhatsApp Web이 파일명을 제어합니다. 존재하면 대체 이름 생성.",
    waylandBrowserTitle: "브라우저의 https://wa.me",
    waylandBrowserIntro: "Wayland/Linux에서 HTTPS 링크 미전달. 옵션:",
    waylandOption1: "whatsapp://로 리디렉션되는 링크 사용.",
    waylandOption2: "브라우저: 열기… → Catrip Connect.",
    waylandOption3: "wa.me를 프로토콜로 보내는 브라우저 확장(미포함).",
    waylandOption4: "앱에서 Ctrl+M 또는 시스템이 전달하면 붙여넣기.",
    waylandTerminal: "터미널에서 실행: npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "새 계정",
    hint: "이름 변경 및 계정별 아이콘 선택. 레일이 동일 데이터 사용.",
    accountName: "계정 이름",
    internalId: "내부 식별자",
    notifications: "이 계정 알림",
    chooseIcon: "아이콘 선택",
    regenerateIcon: "변형",
    regenerateIconTitle: "생성된 아이콘으로 복원(변형)",
    deleteTitle: "이 계정 및 모든 데이터 삭제",
    renamed: "계정 «{{from}}» → «{{to}}»(으)로 변경.",
    deleteConfirm: "계정 «{{name}}»을(를) 삭제할까요?",
    deleteWarning:
      "WhatsApp Web 세션이 영구 삭제됩니다(쿠키, 로컬 저장소, IndexedDB, Service Worker, HTTP 캐시). 되돌릴 수 없습니다.",
    deleteHint: "알림만 끄려면 카드에서 비활성화하세요.",
    deleted: "계정 «{{name}}» 삭제됨.",
    deleteFailed: "«{{name}}»을(를) 삭제할 수 없습니다.",
    deleteError: "«{{name}}» 삭제 오류. 콘솔 확인.",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "WhatsApp Web 트레이 배지(읽지 않음)",
    dockBadge: "독/실행기 배지(Linux)",
    enabled: "시스템 알림",
    showAccountName: "계정 이름 표시",
    showPreview: "미리보기 표시",
    doNotDisturb: "방해 금지(네이티브 알림 없음)",
    playSound: "알림 시스템 소리",
    badgeSumHint: "모든 계정 읽지 않음 합계(GNOME/KDE 필요).",
    manualBadgeLabel: "수동 배지(테스트; 비우면 자동)",
    riseHint: "읽지 않음이 증가하면 알림(계정별 제한). 클릭 시 창 포커스 및 해당 계정 활성화.",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "시작 시 GPU 부스트(실험적)",
    gpuInfo:
      "Catrip Connect는 Chromium GPU 사용. Linux에서 기본 불투명. 검은 화면만 GPU 끄기: CATRIP_DISABLE_GPU=1.",
    gpuBoostHint: "Linux에서 강화 래스터화, zero-copy, 확장 VA-API 활성화. 변경 후 재시작.",
    suspendInactive: "비활성 계정 일시 중지",
    suspendAfter: "다음 시간 후 일시 중지(분)",
    suspendAfterLabel: "사용하지 않은 지(분) 후 일시 중지",
    suspendHint:
      "사용하지 않는 계정의 WhatsApp 뷰를 닫아 RAM 절약; 세션 유지. 복귀 시 즉시 로드. 휴면 중 알림 미갱신 가능.",
    inhibitSleep: "영상 통화 중 절전 방지",
    inhibitSleepHint: "WhatsApp Web이 통화 중일 때 Electron 전원 차단 사용.",
    clearCache: "HTTP 캐시 지우기(모든 계정)",
    checkCodecs: "코덱 지금 확인",
    cacheCleared: "HTTP 캐시를 비웠습니다.",
    cacheFailed: "캐시를 지울 수 없습니다.",
    rendererLimit: "렌더러 프로세스 제한",
    rendererLimitHint: "0 = Chromium 기본값. 앱 재시작 필요.",
    rendererDefault: "기본값",
    minutesOption: "{{count}}분",
    storageSection: "저장소",
    storageHint: "모든 계정 HTTP 캐시 삭제(공간 절약, 일반적으로 세션 유지).",
    mediaDiagSection: "멀티미디어 진단(WhatsApp Web)",
    mediaDiagHint: "활성 계정 세션에서 Chromium 코덱 재생 확인.",
    mediaDiagFootnote:
      "decodingInfo_mp4_h264_aac.supported가 false이거나 MP4 MIME이 거부되면 오디오/비디오가 실패할 수 있습니다.",
  });
  Object.assign(en.settings.network, {
    proxy: "네트워크 프록시",
    proxyRules: "프록시 규칙",
    proxyRulesLabel: "프록시 규칙",
    proxyHint: "예: http=host:8080;https=host:8080",
    proxyPlaceholder: "예: http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "저장 시 적용됨(적용 버튼 없음).",
  });
  Object.assign(en.app.onboarding, {
    aria: "환영",
    title: "Catrip Connect에 오신 것을 환영합니다",
    subtitle: "멀티 계정 WhatsApp Web. 첫 계정을 추가하세요.",
    addFirst: "첫 계정 추가",
    hint: "레일의 + 버튼(왼쪽, 녹색 깜빡임)을 클릭할 수도 있습니다.",
  });
  Object.assign(en.app.rail, {
    createFirst: "첫 계정 만들기",
    newAccount: "새 계정",
    phoneChat: "번호로 새 대화",
    newChat: "새 대화(WhatsApp Web)",
    urgentNow: "지금 바로 — 가장 긴급한 대화(Ctrl+Shift+A)",
    pending: "보류 작업",
    activity: "활동 센터",
    settings: "설정",
    zen: "젠 모드(Esc로 종료)",
    suspended: " · 일시 중지됨(메모리 절약)",
    tooltip: "{{label}} · {{status}}{{unread}}{{suspended}} · 드래그하여 순서 변경 · 우클릭: 변형",
  });
  Object.assign(en.app.palette, {
    title: "명령 팔레트",
    placeholder: "대화, 계정 또는 작업 검색…",
    hint: "↑ ↓ 탐색 • Enter 실행 • Esc 닫기",
  });
  Object.assign(en.app.shortcuts, {
    title: "키보드 단축키",
    hint: "빠른 참조; 상단 메뉴에도 있음.",
    footer: "Esc로 닫기. 바깥 클릭도 닫힘.",
    file: "파일",
    view: "표시",
    chat: "채팅",
    accounts: "계정",
    settings: "설정",
    hideWindow: "창 숨기기",
    quit: "종료",
    quickSwitch: "빠른 계정 전환",
    urgentNow: "지금 바로(긴급 상위 3)",
    fullscreen: "전체 화면",
    zenMode: "젠 모드",
    exitZen: "젠 모드 종료",
    reload: "WhatsApp Web 새로고침",
    newChat: "새 대화(WhatsApp Web)",
    phoneChat: "번호로 채팅",
    newAccount: "새 계정",
    switchAccount: "계정 전환(목록 위치)",
  });
  Object.assign(en.app.about, {
    title: "Catrip Connect 정보",
    description: "여러 격리 계정의 WhatsApp Web 데스크톱 클라이언트.",
    developerHeading: "개발",
    author: "제작자",
    authorLink: "GitHub의 alktrip",
    copyright: "© 2025–2026 Catrip · MIT 라이선스",
    projectLink: "이 앱 저장소",
    electronNote: "안정적인 오디오/비디오를 위한 Electron + Chromium.",
    inspired: "ZapZap(PyQt6+WebEngine)에서 영감. 독립 Electron 구현.",
  });
  Object.assign(en.app.incomingLink, {
    title: "WhatsApp 링크 열기",
    destination: "대상:",
    preloaded: "미리 로드된 메시지 포함.",
    chooseAccount: "계정 선택:",
  });
  Object.assign(en.app.phone, {
    title: "메시지 보내기…",
    hint: "국가 코드 포함 번호 입력(예: +5511999999999):",
    footer: "Enter 열기 • Esc 닫기",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "릴리스 노트",
    openRelease: "GitHub에서 전체 릴리스 보기",
  });
  Object.assign(en.app, {
    saveFile: "파일 저장",
    chooseDownloads: "다운로드 폴더 선택",
  });
  Object.assign(en.activity, {
    title: "활동 센터",
    subtitle: "모든 계정의 읽지 않은 메시지 요약.",
    totalUnread: "총 {{count}}개 읽지 않음",
    noUnread: "읽지 않은 메시지 없음",
    lastMessage: "마지막 메시지",
    openAccount: "계정 열기",
    empty: "여기에서 활동을 보려면 계정을 추가하세요.",
    active: "활성",
    previewUnread: "읽지 않은 메시지가 있습니다",
    noRecentActivity: "최근 활동 없음",
  });
  Object.assign(en.pending, {
    title: "보류 작업",
    subtitle: "모든 계정의 읽지 않은 대화(긴급순). 클릭하면 WhatsApp Web에서 엽니다.",
    empty: "읽지 않은 대화 없음. 모두 확인했습니다!",
  });
  Object.assign(en.urgent, {
    aria: "지금 긴급",
    title: "지금 바로",
    subtitle: "모든 계정에서 가장 긴급",
    subtitleEmpty: "대기 중인 대화 없음",
    empty: "모두 확인했습니다. 읽지 않은 대화 없음.",
    viewAll: "모든 보류 항목 보기",
  });
  Object.assign(en.main.menus, {
    file: "파일",
    view: "표시",
    chat: "채팅",
    accounts: "계정",
    help: "도움말",
    settings: "설정",
    hide: "숨기기",
    quit: "종료",
    quickSwitch: "빠른 계정 전환…",
    fullscreen: "전체 화면",
    zenMode: "젠 모드",
    urgentNow: "지금 바로",
    reload: "새로고침",
    newChat: "새 대화",
    phoneChat: "번호로",
    newAccount: "새 계정",
    userManual: "사용자 매뉴얼",
    shortcuts: "키보드 단축키",
    about: "정보",
  });
  Object.assign(en.main.tray, {
    show: "표시",
    hide: "숨기기",
    settings: "설정",
    closeToTray: "트레이로 닫기(전환)",
    accounts: "계정",
    quit: "종료",
    unreadSummary: "읽지 않은 메시지 {{count}}개",
    unreadSummaryOne: "읽지 않은 메시지 1개",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "읽지 않은 대화 1개.",
    manyUnread: "읽지 않은 대화 {{count}}개.",
    generic: "읽지 않은 대화가 있습니다.",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "파일 저장",
    chooseDownloads: "다운로드 폴더 선택",
    groupInvite: "그룹 초대",
  });
  Object.assign(en.main.accountMenu, {
    active: " (활성)",
    unread: " · {{count}}개 읽지 않음",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "업데이트 사용 가능",
    availableMessage: "Catrip Connect {{version}} 설치 준비 완료.",
    newVersion: "새 버전 사용 가능",
    newVersionMessage: "업데이트: Catrip Connect {{version}}",
    verifyFailed: "다운로드 확인",
    verifyTitle: ".deb 패키지를 확인할 수 없습니다",
    integrityOk: "무결성 확인됨(SHA-512).",
    integrityFail: "다운로드한 파일의 SHA-512 체크섬이 GitHub에 게시된 값과 일치하지 않습니다.",
    downloadComplete: "다운로드 완료",
    downloadCompleteMessage: ".deb 패키지 저장됨",
    downloadFailed: "다운로드 오류",
    downloadFailedMessage: ".deb를 저장할 수 없습니다",
    manualDownload: "수동 다운로드",
    chooseDebFolder: ".deb 저장 폴더 선택",
    restartNow: "지금 재시작",
    installLater: "나중에",
    later: "나중에",
    understood: "확인",
    download: "다운로드…",
    downloadLinkOnly: "다운로드 링크만",
    openFolder: "폴더 열기",
    openBrowser: "브라우저에서 링크 열기",
    debPromptHint:
      "선택한 폴더에 .deb 패키지를 다운로드할까요?\n(앱에서 다운로드하지 않으려면 GitHub 링크를 열 수 있습니다.)",
    debManualFooterHint:
      "다음에서 .deb 설치 파일을 다운로드하세요:\n{{debUrl}}\n\n그런 다음 apt 또는 패키지 관리자로 설치하세요.",
    debInstallHint: "설치:\nsudo apt install ./{{filename}}",
    restartFooterHint: "업데이트를 적용하려면 앱이 다시 시작됩니다.{{integrityLine}}",
    previewFooterHint:
      "업데이트 대화 상자 미리보기(개발). 모든 릴리스 노트를 읽으려면 스크롤하세요.",
    downloadHttpError: "다운로드할 수 없음 ({{status}} {{statusText}})",
    openRelease: "GitHub에서 전체 릴리스 보기",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "자동 시작 비활성화.",
    autostartOn: "자동 시작 활성화 ({{path}}).",
    exeNotFound: "Catrip Connect 실행 파일을 찾을 수 없습니다.",
    linuxOnly: "Linux에서만 사용 가능.",
    protocolRegistered:
      "whatsapp:// 등록됨. 브라우저 wa.me는 자동 전달 안 됨: whatsapp://, 열기… 또는 확장 사용.",
    protocolFailed: "등록 실패.",
    protocolRegisteredShort: "프로토콜 등록됨.",
    noReleaseNotes: "이 버전의 릴리스 노트 없음.",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "활성 계정 없음.",
    viewUnavailable: "내장 웹 보기를 사용할 수 없습니다.",
    whatsappNotLoaded:
      "활성 계정에 아직 web.whatsapp.com이 표시되지 않습니다. 내장 브라우저에서 WhatsApp Web을 연 뒤 다시 시도하세요.",
    genericError: "오류가 발생했습니다.",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "메시지",
    comment: "멀티 계정 WhatsApp Web 클라이언트",
    actionOpen: "Catrip Connect 열기",
    actionFocus: "창 포커스",
    actionNewAccount: "새 계정",
  });
  Object.assign(en.toasts, {
    close: "닫기",
    closeNotification: "알림 닫기",
  });
}

/** @param {Record<string, unknown>} en */
function assignJa(en) {
  Object.assign(en.common, {
    cancel: "キャンセル",
    save: "保存",
    accept: "OK",
    close: "閉じる",
    back: "戻る",
    exit: "終了",
    loading: "読み込み中…",
    deleting: "削除中…",
    cleaning: "消去中…",
    checking: "確認中…",
    rename: "名前を変更",
    delete: "削除",
    deletePermanently: "完全に削除",
    noResults: "結果なし",
    dash: "—",
    now: "今",
    minutesAgo: "{{count}} 分前",
    hoursAgo: "{{count}} 時間前",
    daysAgo: "{{count}} 日前",
    unread: "{{count}} 件未読",
    unreadOne: "1 件未読",
    unreadLabel: "未読",
    messagesUnread: "未読メッセージ {{count}} 件",
    accountDefault: "アカウント {{n}}",
    thisAccount: "このアカウント",
    theAccount: "アカウント",
    variant: "バリアント {{n}}",
    version: "バージョン",
    automatic: "自動",
    noAccounts: "(アカウントなし)",
  });
  Object.assign(en.sessionStatus, {
    loading: "読み込み中…",
    qr: "QR 待機中",
    connected: "接続済み",
    offline: "オフライン",
  });
  Object.assign(en.commandGroups, {
    chats: "チャット",
    accounts: "アカウント",
    actions: "アクション",
    navigation: "ナビゲーション",
    appearance: "外観",
  });
  Object.assign(en.commands, {
    activeAccount: "アクティブなアカウント",
    switchAccount: "このアカウントに切替",
    newAccount: "新しいアカウント",
    newChat: "新しいチャット (WhatsApp Web)",
    phoneChat: "電話番号でチャット…",
    urgentNow: "今すぐ",
    urgentNowDesc: "大きなパネルなしで緊急トップ3",
    activityCenter: "アクティビティセンター",
    activityCenterDesc: "全アカウントと未読の概要",
    pendingInbox: "保留中のアクション",
    pendingInboxDesc: "全アカウントの未読（緊急度順）",
    zenOn: "Zen モードを有効化",
    zenOff: "Zen モードを終了",
    openSettings: "設定を開く → {{page}}",
    hideSidebar: "サイドバーを非表示 (rail)",
    showSidebar: "サイドバーを表示 (rail)",
    disableNotifications: "システム通知を無効化",
    enableNotifications: "システム通知を有効化",
    uiScale: "UI スケール: {{scale}}",
    unreadSuffix: " · {{count}} 件未読",
  });
  Object.assign(en.settings.pages, {
    general: "一般",
    accounts: "アカウント",
    notifications: "通知",
    performance: "パフォーマンス（実験的）",
    network: "ネットワーク",
  });
  Object.assign(en.settings, {
    title: "設定",
    tools: "ツール",
  });
  Object.assign(en.settings.language, {
    label: "インターフェース言語",
    hint: "既定はシステム言語。未対応の場合は英語表示。メニュー、通知、Catrip Connect の文言に影響します。WhatsApp Web は独自の言語です。",
    system: "システム言語",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "WhatsApp Web は別の言語を使用します",
    metaRestriction:
      "Meta は Catrip Connect などのサードパーティアプリがプラットフォーム経由で WhatsApp Web の言語を変更することを許可していません。WhatsApp の利用制限とプライバシー規則により、チャットの言語は WhatsApp Web 内で手動設定する必要があります。",
    intro:
      "Catrip Connect の言語（メニュー、通知、アプリの文言）は、選択した言語に更新されました。",
    stepsTitle: "WhatsApp Web の言語を変更するには:",
    step1: "メインウィンドウで WhatsApp Web を開きます（アクティブなアカウント）。",
    step2: "左上の ⋮（三点）メニューをクリックし、設定を開きます。",
    step3: "言語に進み、WhatsApp で使う言語を選びます。",
  });
  Object.assign(en.settings.scale, {
    title: "スケール",
    hint: "UI と WhatsApp Web に影響します。すぐに適用されます。",
  });
  Object.assign(en.settings.general, {
    startMinimized: "最小化で起動",
    showSidebar: "サイドバーを表示",
    showMenuBar: "メニューバーを表示",
    closeToTray: "閉じるときトレイに最小化",
    autoStart: "システム起動時に自動起動",
    incomingLinks: "受信 WhatsApp リンク",
    incomingLinksHint: "システムから whatsapp:// または wa.me を開くとき。",
    incomingLinkAuto: "複数アカウントがある場合は確認",
    incomingLinkActive: "常にアクティブなアカウント",
    incomingLinkFixed: "固定アカウント",
    registerProtocol: "デフォルトアプリに登録 (whatsapp://)",
    registerProtocolHint: "whatsapp:// — 登録後、互換リンクを Catrip で開けます。",
    checkUpdates: "起動時に更新を確認 (GitHub Releases)",
    updateChannel: "更新チャネル",
    updateChannelStable: "安定版",
    updateChannelBeta: "ベータ（プレリリース）",
    updateChannelHint:
      "AppImage: 再起動でインストール。.deb: フォルダ保存または GitHub のみ; ダイアログに changelog と SHA-512。",
    openDownloads: "ダウンロードしたファイルを既定アプリで開く",
    askSaveAs: "常に「名前を付けて保存…」を確認",
    downloadsSection: "ダウンロード",
    downloadsFolder: "ダウンロードフォルダ",
    downloadsPlaceholder: "(システムフォルダ)",
    chooseDownloadsFolder: "フォルダを選択…",
    clearDownloadsFolder: "システムフォルダを使用",
    resetDownloads: "リセット",
    downloadsFilenameHint: "WhatsApp Web がファイル名を制御。存在すれば別名。",
    waylandBrowserTitle: "ブラウザの https://wa.me",
    waylandBrowserIntro: "Wayland/Linux では HTTPS を渡しません。選択肢:",
    waylandOption1: "whatsapp:// へリダイレクトするリンクを使用。",
    waylandOption2: "ブラウザ: リンクのメニュー → プログラムから開く。",
    waylandOption3: "wa.me をプロトコルに送る拡張（同梱なし）。",
    waylandOption4: "アプリ内: Ctrl+M または OS が渡せば貼り付け。",
    waylandTerminal: "ターミナルで: npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "新しいアカウント",
    hint: "名前変更とアイコン選択。レールは同じデータを使用。",
    accountName: "アカウント名",
    internalId: "内部 ID",
    notifications: "このアカウントの通知",
    chooseIcon: "アイコンを選択",
    regenerateIcon: "バリアント",
    regenerateIconTitle: "生成アイコンに戻す（バリアント）",
    deleteTitle: "このアカウントとすべてのデータを削除",
    renamed: "アカウント «{{from}}» を «{{to}}» に変更。",
    deleteConfirm: "アカウント «{{name}}» を削除しますか？",
    deleteWarning: "WhatsApp Web セッション全体が削除されます（元に戻せません）。",
    deleteHint: "通知のみ停止する場合はカードで無効化。",
    deleted: "アカウント «{{name}}» を削除しました。",
    deleteFailed: "«{{name}}» を削除できませんでした。",
    deleteError: "«{{name}}» 削除エラー。コンソール確認。",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "WhatsApp Web のトレイバッジ（未読）",
    dockBadge: "ドック/ランチャーバッジ (Linux)",
    enabled: "システム通知",
    showAccountName: "アカウント名を表示",
    showPreview: "プレビューを表示",
    doNotDisturb: "応答不可（ネイティブ通知なし）",
    playSound: "通知のシステム音",
    badgeSumHint: "全アカウント未読合計（GNOME/KDE）。",
    manualBadgeLabel: "手動バッジ（テスト、空=自動）",
    riseHint: "未読増加時に通知（アカウントごと制限）。クリックでフォーカスとアカウント切替。",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "起動時 GPU ブースト（実験的）",
    gpuInfo: "Chromium GPU を使用。Linux は既定で不透明。黒画面時のみ無効化: CATRIP_DISABLE_GPU=1.",
    gpuBoostHint: "Linux で強化ラスタライズ等を有効化。変更後は再起動。",
    suspendInactive: "非アクティブアカウントを休止",
    suspendAfter: "（分）後に休止",
    suspendAfterLabel: "未使用から（分）後に休止",
    suspendHint:
      "未使用アカウントの WhatsApp ビューを閉じて RAM 節約。セッション維持。復帰は即時。休止中は通知更新されない場合あり。",
    inhibitSleep: "ビデオ通話中のスリープ防止",
    inhibitSleepHint: "通話中は Electron のスリープ防止を使用。",
    clearCache: "HTTP キャッシュを消去（全アカウント）",
    checkCodecs: "コーデックを確認",
    cacheCleared: "HTTP キャッシュを消去しました。",
    cacheFailed: "キャッシュを消去できませんでした。",
    rendererLimit: "レンダラープロセス上限",
    rendererLimitHint: "0 = Chromium 既定。再起動が必要です。",
    rendererDefault: "既定",
    minutesOption: "{{count}} 分",
    storageSection: "ストレージ",
    storageHint: "全アカウントの HTTP キャッシュを消去（容量節約、通常セッション維持）。",
    mediaDiagSection: "マルチメディア診断 (WhatsApp Web)",
    mediaDiagHint: "アクティブセッションでコーデックを確認。",
    mediaDiagFootnote:
      "decodingInfo_mp4_h264_aac.supported が false または MP4 が拒否されると失敗する場合があります。",
  });
  Object.assign(en.settings.network, {
    proxy: "ネットワークプロキシ",
    proxyRules: "プロキシ規則",
    proxyRulesLabel: "プロキシ規則",
    proxyHint: "例: http=host:8080;https=host:8080",
    proxyPlaceholder: "例: http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "保存時に適用（適用ボタンは未実装）。",
  });
  Object.assign(en.app.onboarding, {
    aria: "ようこそ",
    title: "Catrip Connect へようこそ",
    subtitle: "マルチアカウント WhatsApp Web。最初のアカウントを追加。",
    addFirst: "最初のアカウントを追加",
    hint: "レールの +（左、緑点滅）も使えます。",
  });
  Object.assign(en.app.rail, {
    createFirst: "最初のアカウントを作成",
    newAccount: "新しいアカウント",
    phoneChat: "番号で新しいチャット",
    newChat: "新しいチャット (WhatsApp Web)",
    urgentNow: "今すぐ — 最も緊急のチャット (Ctrl+Shift+A)",
    pending: "保留中のアクション",
    activity: "アクティビティセンター",
    settings: "設定",
    zen: "Zen モード (Esc で終了)",
    suspended: " · 休止中（メモリ節約）",
    tooltip:
      "{{label}} · {{status}}{{unread}}{{suspended}} · ドラッグで並べ替え · 右クリック: バリアント",
  });
  Object.assign(en.app.palette, {
    title: "コマンドパレット",
    placeholder: "チャット、アカウント、アクションを検索…",
    hint: "↑ ↓ で移動 • Enter で実行 • Esc で閉じる",
  });
  Object.assign(en.app.shortcuts, {
    title: "キーボードショートカット",
    hint: "クイックリファレンス。上部メニューにも。",
    footer: "Esc で閉じる。外側クリックも。",
    file: "ファイル",
    view: "表示",
    chat: "チャット",
    accounts: "アカウント",
    settings: "設定",
    hideWindow: "ウィンドウを非表示",
    quit: "終了",
    quickSwitch: "クイックアカウント切替",
    urgentNow: "今すぐ（緊急トップ3）",
    fullscreen: "全画面",
    zenMode: "Zen モード",
    exitZen: "Zen モードを終了",
    reload: "WhatsApp Web を再読み込み",
    newChat: "新しいチャット (WhatsApp Web)",
    phoneChat: "番号でチャット",
    newAccount: "新しいアカウント",
    switchAccount: "アカウント切替（リスト位置）",
  });
  Object.assign(en.app.about, {
    title: "Catrip Connect について",
    description: "複数の独立アカウント向け WhatsApp Web デスクトップクライアント。",
    developerHeading: "開発",
    author: "作者",
    authorLink: "GitHub の alktrip",
    copyright: "© 2025–2026 Catrip · MIT ライセンス",
    projectLink: "このアプリのリポジトリ",
    electronNote: "信頼性の高い再生のための Electron + Chromium。",
    inspired: "ZapZap 由来。独立した Electron 実装。",
  });
  Object.assign(en.app.incomingLink, {
    title: "WhatsApp リンクを開く",
    destination: "宛先:",
    preloaded: "プリロードメッセージを含む。",
    chooseAccount: "アカウントを選択:",
  });
  Object.assign(en.app.phone, {
    title: "メッセージを送信…",
    hint: "国番号付き番号を入力（例: +5511999999999）:",
    footer: "Enter で開く • Esc で閉じる",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "リリースノート",
    openRelease: "GitHub で完全なリリースを表示",
  });
  Object.assign(en.app, {
    saveFile: "ファイルを保存",
    chooseDownloads: "ダウンロードフォルダを選択",
  });
  Object.assign(en.activity, {
    title: "アクティビティセンター",
    subtitle: "全アカウントの未読サマリー。",
    totalUnread: "合計 {{count}} 件未読",
    noUnread: "未読メッセージなし",
    lastMessage: "最後のメッセージ",
    openAccount: "アカウントを開く",
    empty: "アカウントを追加すると、ここにアクティビティが表示されます。",
    active: "アクティブ",
    previewUnread: "未読メッセージがあります",
    noRecentActivity: "最近のアクティビティなし",
  });
  Object.assign(en.pending, {
    title: "保留中のアクション",
    subtitle: "全アカウントの未読チャット（緊急度順）。クリックで WhatsApp Web を開く。",
    empty: "未読チャットなし。すべて確認済み！",
  });
  Object.assign(en.urgent, {
    aria: "今すぐ緊急",
    title: "今すぐ",
    subtitle: "全アカウントで最も緊急",
    subtitleEmpty: "保留中の会話なし",
    empty: "すべて確認済み。未読なし。",
    viewAll: "保留中をすべて表示",
  });
  Object.assign(en.main.menus, {
    file: "ファイル",
    view: "表示",
    chat: "チャット",
    accounts: "アカウント",
    help: "ヘルプ",
    settings: "設定",
    hide: "非表示",
    quit: "終了",
    quickSwitch: "クイックアカウント切替…",
    fullscreen: "全画面",
    zenMode: "Zen モード",
    urgentNow: "今すぐ",
    reload: "再読み込み",
    newChat: "新しいチャット",
    phoneChat: "番号で",
    newAccount: "新しいアカウント",
    userManual: "ユーザーマニュアル",
    shortcuts: "キーボードショートカット",
    about: "情報",
  });
  Object.assign(en.main.tray, {
    show: "表示",
    hide: "非表示",
    settings: "設定",
    closeToTray: "トレイに閉じる（切替）",
    accounts: "アカウント",
    quit: "終了",
    unreadSummary: "未読メッセージ {{count}} 件",
    unreadSummaryOne: "未読メッセージ 1 件",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "未読チャット 1 件。",
    manyUnread: "未読チャット {{count}} 件。",
    generic: "未読チャットがあります。",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "ファイルを保存",
    chooseDownloads: "ダウンロードフォルダを選択",
    groupInvite: "グループ招待",
  });
  Object.assign(en.main.accountMenu, {
    active: " (アクティブ)",
    unread: " · {{count}} 件未読",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "更新があります",
    availableMessage: "Catrip Connect {{version}} のインストール準備完了。",
    newVersion: "新しいバージョンがあります",
    newVersionMessage: "更新: Catrip Connect {{version}}",
    verifyFailed: "ダウンロードの検証",
    verifyTitle: ".deb パッケージを検証できませんでした",
    integrityOk: "整合性を確認 (SHA-512)。",
    integrityFail: "ダウンロードしたファイルの SHA-512 が GitHub の公開値と一致しません。",
    downloadComplete: "ダウンロード完了",
    downloadCompleteMessage: ".deb パッケージを保存",
    downloadFailed: "ダウンロードエラー",
    downloadFailedMessage: ".deb を保存できませんでした",
    manualDownload: "手動ダウンロード",
    chooseDebFolder: ".deb 保存フォルダを選択",
    restartNow: "今すぐ再起動",
    installLater: "後で",
    later: "後で",
    understood: "了解",
    download: "ダウンロード…",
    downloadLinkOnly: "ダウンロードリンクのみ",
    openFolder: "フォルダを開く",
    openBrowser: "ブラウザでリンクを開く",
    debPromptHint:
      "選択したフォルダに .deb パッケージをダウンロードしますか？\n（アプリからダウンロードしない場合は GitHub リンクを開けます。）",
    debManualFooterHint:
      "次から .deb インストーラーをダウンロード:\n{{debUrl}}\n\napt またはパッケージマネージャーでインストールしてください。",
    debInstallHint: "インストール:\nsudo apt install ./{{filename}}",
    restartFooterHint: "更新を適用するためアプリを再起動します。{{integrityLine}}",
    previewFooterHint:
      "更新ダイアログのプレビュー（開発）。すべてのリリースノートを読むにはスクロールしてください。",
    downloadHttpError: "ダウンロードできませんでした ({{status}} {{statusText}})",
    openRelease: "GitHub で完全なリリースを表示",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "自動起動を無効。",
    autostartOn: "自動起動を有効 ({{path}})。",
    exeNotFound: "Catrip Connect の実行ファイルが見つかりません。",
    linuxOnly: "Linux のみ。",
    protocolRegistered: "whatsapp:// を登録。ブラウザの wa.me は自動で渡りません。",
    protocolFailed: "登録に失敗しました。",
    protocolRegisteredShort: "プロトコルを登録しました。",
    noReleaseNotes: "このバージョンのリリースノートなし。",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "アクティブなアカウントがありません。",
    viewUnavailable: "埋め込み Web ビューは利用できません。",
    whatsappNotLoaded:
      "アクティブなアカウントはまだ web.whatsapp.com を表示していません。内蔵ブラウザで WhatsApp Web を開いて再試行してください。",
    genericError: "エラーが発生しました。",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "メッセージ",
    comment: "マルチアカウント WhatsApp Web クライアント",
    actionOpen: "Catrip Connect を開く",
    actionFocus: "ウィンドウをフォーカス",
    actionNewAccount: "新しいアカウント",
  });
  Object.assign(en.toasts, {
    close: "閉じる",
    closeNotification: "通知を閉じる",
  });
}

/** @param {Record<string, unknown>} en */
function assignIt(en) {
  Object.assign(en.common, {
    cancel: "Annulla",
    save: "Salva",
    accept: "Accetta",
    close: "Chiudi",
    back: "Indietro",
    exit: "Esci",
    loading: "Caricamento…",
    deleting: "Eliminazione…",
    cleaning: "Pulizia…",
    checking: "Verifica…",
    rename: "Rinomina",
    delete: "Elimina",
    deletePermanently: "Elimina definitivamente",
    noResults: "Nessun risultato",
    dash: "—",
    now: "Ora",
    minutesAgo: "{{count}} min fa",
    hoursAgo: "{{count}} h fa",
    daysAgo: "{{count}} g fa",
    unread: "{{count}} non lette",
    unreadOne: "1 non letto",
    unreadLabel: "non lette",
    messagesUnread: "{{count}} messaggi non letti",
    accountDefault: "Account {{n}}",
    thisAccount: "questo account",
    theAccount: "l'account",
    variant: "Variante {{n}}",
    version: "Versione",
    automatic: "Automatico",
    noAccounts: "(nessun account)",
  });
  Object.assign(en.sessionStatus, {
    loading: "Caricamento…",
    qr: "In attesa del QR",
    connected: "Connessa",
    offline: "Offline",
  });
  Object.assign(en.commandGroups, {
    chats: "Chat",
    accounts: "Account",
    actions: "Azioni",
    navigation: "Navigazione",
    appearance: "Aspetto",
  });
  Object.assign(en.commands, {
    activeAccount: "Account attivo",
    switchAccount: "Passa a questo account",
    newAccount: "Nuovo account",
    newChat: "Nuova chat (WhatsApp Web)",
    phoneChat: "Chat per numero…",
    urgentNow: "Proprio ora",
    urgentNowDesc: "Top 3 chat urgenti senza pannello grande",
    activityCenter: "Centro attività",
    activityCenterDesc: "Panoramica account e non letti",
    pendingInbox: "Azioni in sospeso",
    pendingInboxDesc: "Chat non letti ordinati per urgenza",
    zenOn: "Attiva modalità Zen",
    zenOff: "Esci dalla modalità Zen",
    openSettings: "Apri Impostazioni → {{page}}",
    hideSidebar: "Nascondi barra laterale (rail)",
    showSidebar: "Mostra barra laterale (rail)",
    disableNotifications: "Disattiva notifiche di sistema",
    enableNotifications: "Attiva notifiche di sistema",
    uiScale: "Scala interfaccia: {{scale}}",
    unreadSuffix: " · {{count}} non lette",
  });
  Object.assign(en.settings.pages, {
    general: "Generale",
    accounts: "Account",
    notifications: "Notifiche",
    performance: "Prestazioni (sperimentale)",
    network: "Rete",
  });
  Object.assign(en.settings, {
    title: "IMPOSTAZIONI",
    tools: "STRUMENTI",
  });
  Object.assign(en.settings.language, {
    label: "Lingua interfaccia",
    hint: "Predefinito: lingua di sistema; se non disponibile, inglese. Influisce su menu, notifiche e testi Catrip Connect. WhatsApp Web usa la propria lingua.",
    system: "Lingua di sistema",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "WhatsApp Web usa una lingua separata",
    metaRestriction:
      "Meta non consente alle app di terze parti (come Catrip Connect) di cambiare la lingua di WhatsApp Web tramite la sua piattaforma. A causa delle restrizioni d'uso e della privacy di WhatsApp, devi impostare manualmente la lingua della chat in WhatsApp Web.",
    intro:
      "La lingua di Catrip Connect (menu, notifiche e testi dell'app) è stata aggiornata alla tua scelta.",
    stepsTitle: "Per cambiare la lingua di WhatsApp Web:",
    step1: "Apri WhatsApp Web nella finestra principale (account attivo).",
    step2: "Clicca il menu ⋮ (tre puntini) in alto a sinistra e apri Impostazioni.",
    step3: "Vai su Lingua e seleziona la lingua preferita per WhatsApp.",
  });
  Object.assign(en.settings.scale, {
    title: "Scala",
    hint: "Influisce su interfaccia e WhatsApp Web. Applicato subito.",
  });
  Object.assign(en.settings.general, {
    startMinimized: "Avvia minimizzato",
    showSidebar: "Mostra barra laterale",
    showMenuBar: "Mostra barra menu",
    closeToTray: "Alla chiusura, riduci a tray",
    autoStart: "Avvio automatico con il sistema",
    incomingLinks: "Link WhatsApp in entrata",
    incomingLinksHint: "All'apertura di whatsapp:// o wa.me dal sistema.",
    incomingLinkAuto: "Chiedi se ci sono più account",
    incomingLinkActive: "Sempre l'account attivo",
    incomingLinkFixed: "Account fisso",
    registerProtocol: "Registra come app predefinita (whatsapp://)",
    registerProtocolHint:
      "whatsapp:// — Dopo la registrazione il sistema può aprire link compatibili in Catrip.",
    checkUpdates: "Cerca aggiornamenti all'avvio (GitHub Releases)",
    updateChannel: "Canale aggiornamenti",
    updateChannelStable: "Stabile (release)",
    updateChannelBeta: "Beta (pre-release)",
    updateChannelHint:
      "AppImage: installa al riavvio. .deb: scarica in cartella o solo link GitHub; changelog e SHA-512 nel dialogo.",
    openDownloads: "Apri file scaricati con app predefinita",
    askSaveAs: "Chiedi sempre « Salva con nome… »",
    downloadsSection: "Download",
    downloadsFolder: "Cartella download",
    downloadsPlaceholder: "(cartella di sistema)",
    chooseDownloadsFolder: "Scegli cartella…",
    clearDownloadsFolder: "Usa cartella di sistema",
    resetDownloads: "Reimposta",
    downloadsFilenameHint: "WhatsApp Web controlla il nome file. Nome alternativo se esiste.",
    waylandBrowserTitle: "https://wa.me nel browser",
    waylandBrowserIntro: "Su Wayland/Linux niente passaggio HTTPS. Opzioni:",
    waylandOption1: "Usa link che reindirizzano a whatsapp://.",
    waylandOption2: "Nel browser: Apri con… → Catrip Connect.",
    waylandOption3: "Estensione browser per wa.me al protocollo (non inclusa).",
    waylandOption4: "Nell'app: Ctrl+M o incolla link se il sistema lo consegna.",
    waylandTerminal: "Puoi eseguire: npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "Nuovo account",
    hint: "Rinomina e scegli icona per account. Il rail usa gli stessi dati.",
    accountName: "Nome account",
    internalId: "Identificatore interno",
    notifications: "Notifiche per questo account",
    chooseIcon: "Scegli icona",
    regenerateIcon: "Variante",
    regenerateIconTitle: "Ripristina icona generata (variante)",
    deleteTitle: "Elimina questo account e tutti i dati",
    renamed: "Account «{{from}}» rinominato in «{{to}}».",
    deleteConfirm: "Eliminare l'account «{{name}}»?",
    deleteWarning: "L'intera sessione WhatsApp Web verrà eliminata. Irreversibile.",
    deleteHint: "Per fermare solo le notifiche, disattiva sulla scheda.",
    deleted: "Account «{{name}}» eliminato.",
    deleteFailed: "Impossibile eliminare «{{name}}».",
    deleteError: "Errore eliminazione «{{name}}». Vedi console.",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "Badge tray da WhatsApp Web (non letti)",
    dockBadge: "Badge dock/launcher (Linux)",
    enabled: "Notifiche di sistema",
    showAccountName: "Mostra nome account",
    showPreview: "Mostra anteprima",
    doNotDisturb: "Non disturbare (nessun avviso nativo)",
    playSound: "Suono di sistema per notifiche",
    badgeSumHint: "Somma non letti (richiede GNOME/KDE).",
    manualBadgeLabel: "Badge manuale (test; vuoto = auto)",
    riseHint:
      "Avviso quando aumentano i non letti (limite per account). Clic focalizza e attiva account.",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "Boost GPU all'avvio (sperimentale)",
    gpuInfo:
      "Usa GPU Chromium. Su Linux finestra opaca. Disattiva solo con schermo nero: CATRIP_DISABLE_GPU=1.",
    gpuBoostHint:
      "Abilita rasterizzazione rinforzata, zero-copy e VA-API esteso su Linux. Riavvia dopo le modifiche.",
    suspendInactive: "Sospendi account inattivi",
    suspendAfter: "Sospendi dopo (minuti)",
    suspendAfterLabel: "Sospendi dopo (minuti senza uso)",
    suspendHint:
      "Libera RAM chiudendo WhatsApp inutilizzati; sessione conservata. Ritorno istantaneo. In sospensione notifiche possono non aggiornarsi.",
    inhibitSleep: "Evita sospensione durante videochiamata",
    inhibitSleepHint: "Usa blocco energia Electron durante chiamata.",
    clearCache: "Svuota cache HTTP (tutti gli account)",
    checkCodecs: "Verifica codec ora",
    cacheCleared: "Cache HTTP svuotata.",
    cacheFailed: "Impossibile svuotare la cache.",
    rendererLimit: "Limite processi renderer",
    rendererLimitHint: "0 = predefinito Chromium. Riavvio richiesto.",
    rendererDefault: "Predefinito",
    minutesOption: "{{count}} minuti",
    storageSection: "Archiviazione",
    storageHint: "Svuota cache HTTP di tutti gli account (risparmia spazio; mantiene sessione).",
    mediaDiagSection: "Diagnostica multimediale (WhatsApp Web)",
    mediaDiagHint: "Verifica codec nella sessione attiva.",
    mediaDiagFootnote:
      "Se decodingInfo_mp4_h264_aac.supported è false o MP4 viene rifiutato, audio/video può fallire.",
  });
  Object.assign(en.settings.network, {
    proxy: "Proxy di rete",
    proxyRules: "Regole proxy",
    proxyRulesLabel: "Regole proxy",
    proxyHint: "Es. http=host:8080;https=host:8080",
    proxyPlaceholder: "Es. http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "Applicato al salvataggio (pulsante Applica assente).",
  });
  Object.assign(en.app.onboarding, {
    aria: "Benvenuto",
    title: "Benvenuto in Catrip Connect",
    subtitle: "Client multi-account. Aggiungi il primo account.",
    addFirst: "Aggiungi il primo account",
    hint: "Puoi anche cliccare + sul rail (sinistra, verde lampeggiante).",
  });
  Object.assign(en.app.rail, {
    createFirst: "Crea il primo account",
    newAccount: "Nuovo account",
    phoneChat: "Nuova chat per numero",
    newChat: "Nuova chat (WhatsApp Web)",
    urgentNow: "Proprio ora — chat più urgenti (Ctrl+Maiusc+A)",
    pending: "Azioni in sospeso",
    activity: "Centro attività",
    settings: "Impostazioni",
    zen: "Modalità Zen (Esc per uscire)",
    suspended: " · Sospesa (risparmia memoria)",
    tooltip:
      "{{label}} · {{status}}{{unread}}{{suspended}} · Trascina per riordinare · Tasto destro: variante",
  });
  Object.assign(en.app.palette, {
    title: "Palette comandi",
    placeholder: "Cerca chat, account o azioni…",
    hint: "↑ ↓ per navigare • Invio per eseguire • Esc per chiudere",
  });
  Object.assign(en.app.shortcuts, {
    title: "Scorciatoie da tastiera",
    hint: "Riferimento rapido; anche nel menu.",
    footer: "Esc chiude. Anche clic fuori.",
    file: "File",
    view: "Mostra",
    chat: "Chat",
    accounts: "Account",
    settings: "Impostazioni",
    hideWindow: "Nascondi finestra",
    quit: "Esci",
    quickSwitch: "Cambio rapido account",
    urgentNow: "Proprio ora (top 3 urgenti)",
    fullscreen: "Schermo intero",
    zenMode: "Modalità Zen",
    exitZen: "Esci dalla modalità Zen",
    reload: "Ricarica WhatsApp Web",
    newChat: "Nuova chat (WhatsApp Web)",
    phoneChat: "Chat per numero",
    newAccount: "Nuovo account",
    switchAccount: "Cambia account (posizione elenco)",
  });
  Object.assign(en.app.about, {
    title: "Informazioni su Catrip Connect",
    description: "Client desktop WhatsApp Web con account isolati.",
    developerHeading: "Sviluppo",
    author: "Autore",
    authorLink: "alktrip su GitHub",
    copyright: "© 2025–2026 Catrip · Licenza MIT",
    projectLink: "Repository di questa applicazione",
    electronNote: "Electron + Chromium integrato per audio/video affidabili.",
    inspired: "Ispirato a ZapZap. Implementazione Electron indipendente.",
  });
  Object.assign(en.app.incomingLink, {
    title: "Apri link WhatsApp",
    destination: "Destinazione:",
    preloaded: "Include messaggio precaricato.",
    chooseAccount: "Scegli account:",
  });
  Object.assign(en.app.phone, {
    title: "Invia messaggio a…",
    hint: "Inserisci numero con prefisso (es. +5511999999999):",
    footer: "Invio apre • Esc chiude",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "Note di versione",
    openRelease: "Vedi release completa su GitHub",
  });
  Object.assign(en.app, {
    saveFile: "Salva file",
    chooseDownloads: "Scegli cartella download",
  });
  Object.assign(en.activity, {
    title: "Centro attività",
    subtitle: "Riepilogo non letti su tutti gli account.",
    totalUnread: "{{count}} non lette in totale",
    noUnread: "Nessun messaggio non letto",
    lastMessage: "Ultimo messaggio",
    openAccount: "Apri account",
    empty: "Aggiungi un account per vedere l'attività qui.",
    active: "Attiva",
    previewUnread: "Hai messaggi non letti",
    noRecentActivity: "Nessuna attività recente",
  });
  Object.assign(en.pending, {
    title: "Azioni in sospeso",
    subtitle: "Chat non letti di tutti gli account per urgenza. Clic per aprire in WhatsApp Web.",
    empty: "Nessuna chat non letta. Sei in pari!",
  });
  Object.assign(en.urgent, {
    aria: "Urgente ora",
    title: "Proprio ora",
    subtitle: "Il più urgente su tutti gli account",
    subtitleEmpty: "Nessuna conversazione in sospeso",
    empty: "Sei in pari. Nessuna chat non letta.",
    viewAll: "Vedi tutte le in sospeso",
  });
  Object.assign(en.main.menus, {
    file: "File",
    view: "Mostra",
    chat: "Chat",
    accounts: "Account",
    help: "Aiuto",
    settings: "Impostazioni",
    hide: "Nascondi",
    quit: "Esci",
    quickSwitch: "Cambio rapido account…",
    fullscreen: "Schermo intero",
    zenMode: "Modalità Zen",
    urgentNow: "Proprio ora",
    reload: "Ricarica",
    newChat: "Nuova chat",
    phoneChat: "Per numero",
    newAccount: "Nuovo account",
    userManual: "Manuale utente",
    shortcuts: "Scorciatoie da tastiera",
    about: "Informazioni",
  });
  Object.assign(en.main.tray, {
    show: "Mostra",
    hide: "Nascondi",
    settings: "Impostazioni",
    closeToTray: "Chiudi nel tray (attiva/disattiva)",
    accounts: "Account",
    quit: "Esci",
    unreadSummary: "{{count}} messaggi non letti",
    unreadSummaryOne: "1 messaggio non letto",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "Hai 1 chat non letta.",
    manyUnread: "Hai {{count}} chat non lette.",
    generic: "Hai chat non lette.",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "Salva file",
    chooseDownloads: "Scegli cartella download",
    groupInvite: "Invito di gruppo",
  });
  Object.assign(en.main.accountMenu, {
    active: " (attiva)",
    unread: " · {{count}} non lette",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "Aggiornamento disponibile",
    availableMessage: "Catrip Connect {{version}} è pronto per l'installazione.",
    newVersion: "Nuova versione disponibile",
    newVersionMessage: "Aggiornamento: Catrip Connect {{version}}",
    verifyFailed: "Verifica download",
    verifyTitle: "Impossibile verificare il .deb",
    integrityOk: "Integrità verificata (SHA-512).",
    integrityFail:
      "Il checksum SHA-512 del file scaricato non coincide con quello pubblicato su GitHub.",
    downloadComplete: "Download completato",
    downloadCompleteMessage: "Pacchetto .deb salvato",
    downloadFailed: "Errore download",
    downloadFailedMessage: "Impossibile salvare il .deb",
    manualDownload: "Download manuale",
    chooseDebFolder: "Scegli cartella per .deb",
    restartNow: "Riavvia ora",
    installLater: "Più tardi",
    later: "Più tardi",
    understood: "Capito",
    download: "Scarica…",
    downloadLinkOnly: "Solo link di download",
    openFolder: "Apri cartella",
    openBrowser: "Apri link nel browser",
    debPromptHint:
      "Scaricare il pacchetto .deb in una cartella a tua scelta?\n(Se preferisci non scaricare dall'app, puoi aprire il link GitHub.)",
    debManualFooterHint:
      "Scarica l'installer .deb da:\n{{debUrl}}\n\nPoi installalo con apt o il tuo gestore pacchetti.",
    debInstallHint: "Installa con:\nsudo apt install ./{{filename}}",
    restartFooterHint: "L'app verrà riavviata per applicare l'aggiornamento.{{integrityLine}}",
    previewFooterHint:
      "Anteprima della finestra di aggiornamento (sviluppo). Scorri per leggere tutte le note.",
    downloadHttpError: "Impossibile scaricare ({{status}} {{statusText}})",
    openRelease: "Vedi release completa su GitHub",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "Avvio automatico disattivato.",
    autostartOn: "Avvio automatico attivo ({{path}}).",
    exeNotFound: "Eseguibile Catrip Connect non trovato.",
    linuxOnly: "Disponibile solo su Linux.",
    protocolRegistered: "whatsapp:// registrato. wa.me nel browser non passa automaticamente.",
    protocolFailed: "Registrazione non riuscita.",
    protocolRegisteredShort: "Protocollo registrato.",
    noReleaseNotes: "Nessuna nota per questa versione.",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "Nessun account attivo.",
    viewUnavailable: "La vista web incorporata non è disponibile.",
    whatsappNotLoaded:
      "L'account attivo non mostra ancora web.whatsapp.com. Apri WhatsApp Web nel browser integrato e riprova.",
    genericError: "Si è verificato un errore.",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "Messaggi",
    comment: "Client WhatsApp Web multi-account",
    actionOpen: "Apri Catrip Connect",
    actionFocus: "Metti a fuoco finestra",
    actionNewAccount: "Nuovo account",
  });
  Object.assign(en.toasts, {
    close: "Chiudi",
    closeNotification: "Chiudi notifica",
  });
}

/** @param {Record<string, unknown>} en */
function assignZh(en) {
  Object.assign(en.common, {
    cancel: "取消",
    save: "保存",
    accept: "确定",
    close: "关闭",
    back: "返回",
    exit: "退出",
    loading: "加载中…",
    deleting: "正在删除…",
    cleaning: "正在清除…",
    checking: "正在检查…",
    rename: "重命名",
    delete: "删除",
    deletePermanently: "永久删除",
    noResults: "无结果",
    dash: "—",
    now: "现在",
    minutesAgo: "{{count}} 分钟前",
    hoursAgo: "{{count}} 小时前",
    daysAgo: "{{count}} 天前",
    unread: "{{count}} 条未读",
    unreadOne: "1 条未读",
    unreadLabel: "未读",
    messagesUnread: "{{count}} 条未读消息",
    accountDefault: "账户 {{n}}",
    thisAccount: "此账户",
    theAccount: "该账户",
    variant: "变体 {{n}}",
    version: "版本",
    automatic: "自动",
    noAccounts: "（无账户）",
  });
  Object.assign(en.sessionStatus, {
    loading: "加载中…",
    qr: "等待 QR",
    connected: "已连接",
    offline: "离线",
  });
  Object.assign(en.commandGroups, {
    chats: "聊天",
    accounts: "账户",
    actions: "操作",
    navigation: "导航",
    appearance: "外观",
  });
  Object.assign(en.commands, {
    activeAccount: "活动账户",
    switchAccount: "切换到此账户",
    newAccount: "新账户",
    newChat: "新聊天 (WhatsApp Web)",
    phoneChat: "按电话号码聊天…",
    urgentNow: "马上",
    urgentNowDesc: "无需大面板即可查看前 3 条紧急聊天",
    activityCenter: "活动中心",
    activityCenterDesc: "所有账户和未读消息概览",
    pendingInbox: "待处理操作",
    pendingInboxDesc: "所有账户未读聊天（按紧急程度排序）",
    zenOn: "启用 Zen 模式",
    zenOff: "退出 Zen 模式",
    openSettings: "打开设置 → {{page}}",
    hideSidebar: "隐藏侧边栏 (rail)",
    showSidebar: "显示侧边栏 (rail)",
    disableNotifications: "禁用系统通知",
    enableNotifications: "启用系统通知",
    uiScale: "界面缩放：{{scale}}",
    unreadSuffix: " · {{count}} 条未读",
  });
  Object.assign(en.settings.pages, {
    general: "常规",
    accounts: "账户",
    notifications: "通知",
    performance: "性能（实验性）",
    network: "网络",
  });
  Object.assign(en.settings, {
    title: "设置",
    tools: "工具",
  });
  Object.assign(en.settings.language, {
    label: "界面语言",
    hint: "默认跟随系统语言；若不可用则显示英语。影响菜单、通知和 Catrip Connect 文本。WhatsApp Web 使用自己的语言。",
    system: "系统语言",
  });
  en.settings.language.whatsappNotice ??= {};
  Object.assign(en.settings.language.whatsappNotice, {
    title: "WhatsApp Web 使用独立的语言",
    metaRestriction:
      "Meta 不允许第三方应用（如 Catrip Connect）通过其平台更改 WhatsApp Web 的语言。由于 WhatsApp 的使用限制和隐私规则，您必须在 WhatsApp Web 内手动设置聊天语言。",
    intro: "Catrip Connect 的语言（菜单、通知和应用文本）已更新为您所选的语言。",
    stepsTitle: "更改 WhatsApp Web 语言：",
    step1: "在主窗口中打开 WhatsApp Web（当前账户）。",
    step2: "点击左上角的 ⋮（三点）菜单，打开设置。",
    step3: "进入语言，选择您希望用于 WhatsApp 的语言。",
  });
  Object.assign(en.settings.scale, {
    title: "缩放",
    hint: "影响界面和 WhatsApp Web。立即生效。",
  });
  Object.assign(en.settings.general, {
    startMinimized: "启动时最小化",
    showSidebar: "显示侧边栏",
    showMenuBar: "显示菜单栏",
    closeToTray: "关闭时最小化到托盘",
    autoStart: "随系统启动",
    incomingLinks: "收到的 WhatsApp 链接",
    incomingLinksHint: "从系统打开 whatsapp:// 或 wa.me 时。",
    incomingLinkAuto: "有多个账户时询问",
    incomingLinkActive: "始终使用活动账户",
    incomingLinkFixed: "固定账户",
    registerProtocol: "注册为默认应用 (whatsapp://)",
    registerProtocolHint: "whatsapp:// — 注册后系统可在 Catrip 中打开兼容链接。",
    checkUpdates: "启动时检查更新 (GitHub Releases)",
    updateChannel: "更新渠道",
    updateChannelStable: "稳定版（正式版）",
    updateChannelBeta: "测试版（预发布）",
    updateChannelHint:
      "AppImage：重启时安装。.deb：可下载到文件夹或仅打开 GitHub 链接；对话框显示 changelog 和 SHA-512。",
    openDownloads: "用默认应用打开下载的文件",
    askSaveAs: "始终询问“另存为…”",
    downloadsSection: "下载",
    downloadsFolder: "下载文件夹",
    downloadsPlaceholder: "（使用系统文件夹）",
    chooseDownloadsFolder: "选择文件夹…",
    clearDownloadsFolder: "使用系统文件夹",
    resetDownloads: "重置",
    downloadsFilenameHint: "WhatsApp Web 控制文件名。若已存在则生成备用名。",
    waylandBrowserTitle: "浏览器中的 https://wa.me",
    waylandBrowserIntro: "Wayland/Linux 下浏览器不会传递 HTTPS 链接。可选方案：",
    waylandOption1: "使用重定向到 whatsapp:// 的链接。",
    waylandOption2: "浏览器：打开方式… → Catrip Connect。",
    waylandOption3: "将 wa.me 发给协议的浏览器扩展（未捆绑）。",
    waylandOption4: "在应用中：Ctrl+M 或系统传递时粘贴链接。",
    waylandTerminal: "也可在终端运行：npm run register:whatsapp",
  });
  Object.assign(en.settings.accounts, {
    newAccount: "新账户",
    hint: "重命名并为每个账户选择图标。侧栏使用相同数据。",
    accountName: "账户名称",
    internalId: "内部标识符",
    notifications: "此账户的通知",
    chooseIcon: "选择图标",
    regenerateIcon: "变体",
    regenerateIconTitle: "恢复生成的图标（变体）",
    deleteTitle: "删除此账户及所有数据",
    renamed: "账户 «{{from}}» 已重命名为 «{{to}}»。",
    deleteConfirm: "删除账户 «{{name}}»？",
    deleteWarning: "整个 WhatsApp Web 会话将被永久删除。无法撤销。",
    deleteHint: "若仅停止通知，请在卡片上禁用而不丢失会话。",
    deleted: "账户 «{{name}}» 已删除。",
    deleteFailed: "无法删除 «{{name}}»。",
    deleteError: "删除 «{{name}}» 出错。请查看控制台。",
  });
  Object.assign(en.settings.notifications, {
    trayBadge: "WhatsApp Web 托盘徽章（未读）",
    dockBadge: "程序坞/启动器徽章 (Linux)",
    enabled: "系统通知",
    showAccountName: "显示账户名称",
    showPreview: "显示预览",
    doNotDisturb: "勿扰（无原生提醒）",
    playSound: "通知系统声音",
    badgeSumHint: "所有账户未读总和（需 GNOME/KDE）。",
    manualBadgeLabel: "手动徽章（测试；留空=自动）",
    riseHint: "未读增加时通知（每账户有限制）。点击可聚焦窗口并切换账户。",
  });
  Object.assign(en.settings.performance, {
    gpuBoost: "启动时 GPU 加速（实验性）",
    gpuInfo: "使用 Chromium GPU。Linux 默认不透明。仅黑屏时禁用 GPU：CATRIP_DISABLE_GPU=1。",
    gpuBoostHint: "在 Linux 上启用强化光栅化等。更改后请重启。",
    suspendInactive: "暂停非活动账户",
    suspendAfter: "暂停于（分钟）",
    suspendAfterLabel: "未使用（分钟）后暂停",
    suspendHint:
      "关闭未使用账户的 WhatsApp 视图以节省 RAM；会话保留。返回时即时加载。休眠时通知可能不更新。",
    inhibitSleep: "视频通话期间防止休眠",
    inhibitSleepHint: "通话期间使用 Electron 电源阻止。",
    clearCache: "清除 HTTP 缓存（所有账户）",
    checkCodecs: "立即检查编解码器",
    cacheCleared: "HTTP 缓存已清除。",
    cacheFailed: "无法清除缓存。",
    rendererLimit: "渲染进程限制",
    rendererLimitHint: "0 = Chromium 默认。需要重启应用。",
    rendererDefault: "默认",
    minutesOption: "{{count}} 分钟",
    storageSection: "存储",
    storageHint: "清除所有账户 HTTP 缓存（节省空间，通常会话保留）。",
    mediaDiagSection: "多媒体诊断（WhatsApp Web）",
    mediaDiagHint: "检查活动账户会话中的编解码器。",
    mediaDiagFootnote:
      "若 decodingInfo_mp4_h264_aac.supported 为 false 或拒绝 MP4，音视频可能失败。",
  });
  Object.assign(en.settings.network, {
    proxy: "网络代理",
    proxyRules: "代理规则",
    proxyRulesLabel: "代理规则",
    proxyHint: "例如 http=host:8080;https=host:8080",
    proxyPlaceholder: "例如 http=127.0.0.1:8080;https=127.0.0.1:8080",
    applyOnSaveHint: "保存时应用（尚无应用按钮）。",
  });
  Object.assign(en.app.onboarding, {
    aria: "欢迎",
    title: "欢迎使用 Catrip Connect",
    subtitle: "多账户 WhatsApp Web 客户端。请添加第一个账户。",
    addFirst: "添加您的第一个账户",
    hint: "也可点击侧栏 + 按钮（左侧，绿色闪烁）。",
  });
  Object.assign(en.app.rail, {
    createFirst: "创建您的第一个账户",
    newAccount: "新账户",
    phoneChat: "按号码新建聊天",
    newChat: "新聊天 (WhatsApp Web)",
    urgentNow: "马上 — 最紧急的聊天 (Ctrl+Shift+A)",
    pending: "待处理操作",
    activity: "活动中心",
    settings: "设置",
    zen: "Zen 模式（Esc 退出）",
    suspended: " · 已休眠（节省内存）",
    tooltip: "{{label}} · {{status}}{{unread}}{{suspended}} · 拖动排序 · 右键：变体",
  });
  Object.assign(en.app.palette, {
    title: "命令面板",
    placeholder: "搜索聊天、账户或操作…",
    hint: "↑ ↓ 导航 • Enter 执行 • Esc 关闭",
  });
  Object.assign(en.app.shortcuts, {
    title: "键盘快捷键",
    hint: "快速参考；也在顶部菜单中。",
    footer: "Esc 关闭。点击外部也可关闭。",
    file: "文件",
    view: "查看",
    chat: "聊天",
    accounts: "账户",
    settings: "设置",
    hideWindow: "隐藏窗口",
    quit: "退出",
    quickSwitch: "快速切换账户",
    urgentNow: "马上（前 3 条紧急）",
    fullscreen: "全屏",
    zenMode: "Zen 模式",
    exitZen: "退出 Zen 模式",
    reload: "重新加载 WhatsApp Web",
    newChat: "新聊天 (WhatsApp Web)",
    phoneChat: "按号码聊天",
    newAccount: "新账户",
    switchAccount: "切换账户（列表位置）",
  });
  Object.assign(en.app.about, {
    title: "关于 Catrip Connect",
    description: "多账户隔离的 WhatsApp Web 桌面客户端。",
    developerHeading: "开发",
    author: "作者",
    authorLink: "GitHub：alktrip",
    copyright: "© 2025–2026 Catrip · MIT 许可证",
    projectLink: "本应用仓库",
    electronNote: "Electron + 内嵌 Chromium，可靠播放音视频。",
    inspired: "灵感来自 ZapZap。独立 Electron 实现。",
  });
  Object.assign(en.app.incomingLink, {
    title: "打开 WhatsApp 链接",
    destination: "目标：",
    preloaded: "包含预加载消息。",
    chooseAccount: "选择账户：",
  });
  Object.assign(en.app.phone, {
    title: "发送消息给…",
    hint: "输入带国家/地区代码的号码（例如 +5511999999999）：",
    footer: "Enter 打开 • Esc 关闭",
  });
  en.app.updateDialog ??= {};
  Object.assign(en.app.updateDialog, {
    releaseNotesAria: "版本说明",
    openRelease: "在 GitHub 查看完整发布",
  });
  Object.assign(en.app, {
    saveFile: "保存文件",
    chooseDownloads: "选择下载文件夹",
  });
  Object.assign(en.activity, {
    title: "活动中心",
    subtitle: "所有账户未读消息摘要。",
    totalUnread: "共 {{count}} 条未读",
    noUnread: "无未读消息",
    lastMessage: "最后一条消息",
    openAccount: "打开账户",
    empty: "添加账户后可在此查看活动。",
    active: "活动",
    previewUnread: "您有未读消息",
    noRecentActivity: "无最近活动",
  });
  Object.assign(en.pending, {
    title: "待处理操作",
    subtitle: "所有账户未读聊天（按紧急程度）。点击在 WhatsApp Web 中打开。",
    empty: "没有未读聊天。已全部处理！",
  });
  Object.assign(en.urgent, {
    aria: "紧急",
    title: "马上",
    subtitle: "所有账户中最紧急的",
    subtitleEmpty: "无待处理对话",
    empty: "已全部处理。没有未读聊天。",
    viewAll: "查看所有待处理项",
  });
  Object.assign(en.main.menus, {
    file: "文件",
    view: "查看",
    chat: "聊天",
    accounts: "账户",
    help: "帮助",
    settings: "设置",
    hide: "隐藏",
    quit: "退出",
    quickSwitch: "快速切换账户…",
    fullscreen: "全屏",
    zenMode: "Zen 模式",
    urgentNow: "马上",
    reload: "重新加载",
    newChat: "新聊天",
    phoneChat: "按号码",
    newAccount: "新账户",
    userManual: "用户手册",
    shortcuts: "键盘快捷键",
    about: "关于",
  });
  Object.assign(en.main.tray, {
    show: "显示",
    hide: "隐藏",
    settings: "设置",
    closeToTray: "关闭到托盘（切换）",
    accounts: "账户",
    quit: "退出",
    unreadSummary: "{{count}} 条未读消息",
    unreadSummaryOne: "1 条未读消息",
  });
  Object.assign(en.main.notifications, {
    oneUnread: "您有 1 个未读聊天。",
    manyUnread: "您有 {{count}} 个未读聊天。",
    generic: "您有未读聊天。",
  });
  Object.assign(en.main.dialogs, {
    saveFile: "保存文件",
    chooseDownloads: "选择下载文件夹",
    groupInvite: "群组邀请",
  });
  Object.assign(en.main.accountMenu, {
    active: "（活动）",
    unread: " · {{count}} 条未读",
  });
  en.main.updates ??= {};
  Object.assign(en.main.updates, {
    available: "有可用更新",
    availableMessage: "Catrip Connect {{version}} 已可安装。",
    newVersion: "有新版本",
    newVersionMessage: "有更新：Catrip Connect {{version}}",
    verifyFailed: "下载验证",
    verifyTitle: "无法验证 .deb 包",
    integrityOk: "完整性已验证 (SHA-512)。",
    integrityFail: "下载文件的 SHA-512 校验和与 GitHub 发布的不一致。",
    downloadComplete: "下载完成",
    downloadCompleteMessage: "已保存 .deb 包",
    downloadFailed: "下载错误",
    downloadFailedMessage: "无法保存 .deb",
    manualDownload: "手动下载",
    chooseDebFolder: "选择保存 .deb 的文件夹",
    restartNow: "立即重启",
    installLater: "稍后",
    later: "稍后",
    understood: "知道了",
    download: "下载…",
    downloadLinkOnly: "仅下载链接",
    openFolder: "打开文件夹",
    openBrowser: "在浏览器中打开链接",
    debPromptHint: "将 .deb 包下载到您选择的文件夹？\n（若不想在应用内下载，可打开 GitHub 链接。）",
    debManualFooterHint: "从此处下载 .deb 安装包：\n{{debUrl}}\n\n然后使用 apt 或包管理器安装。",
    debInstallHint: "安装命令：\nsudo apt install ./{{filename}}",
    restartFooterHint: "应用将重启以应用更新。{{integrityLine}}",
    previewFooterHint: "更新对话框预览（开发）。滚动可阅读全部发布说明。",
    downloadHttpError: "无法下载 ({{status}} {{statusText}})",
    openRelease: "在 GitHub 查看完整发布",
  });
  en.main.integrations ??= {};
  Object.assign(en.main.integrations, {
    autostartOff: "已禁用开机自启。",
    autostartOn: "已启用开机自启 ({{path}})。",
    exeNotFound: "未找到 Catrip Connect 可执行文件。",
    linuxOnly: "仅适用于 Linux。",
    protocolRegistered: "已注册 whatsapp://。浏览器 wa.me 不会自动打开 Catrip。",
    protocolFailed: "注册失败。",
    protocolRegisteredShort: "协议已注册。",
    noReleaseNotes: "此版本无发行说明。",
  });
  en.main.diagnostics ??= {};
  Object.assign(en.main.diagnostics, {
    noActiveAccount: "没有活动账户。",
    viewUnavailable: "嵌入式网页视图不可用。",
    whatsappNotLoaded:
      "活动账户尚未显示 web.whatsapp.com。请在内置浏览器中打开 WhatsApp Web 后重试。",
    genericError: "发生错误。",
  });
  en.main.desktop ??= {};
  Object.assign(en.main.desktop, {
    genericName: "消息",
    comment: "多账户 WhatsApp Web 客户端",
    actionOpen: "打开 Catrip Connect",
    actionFocus: "聚焦窗口",
    actionNewAccount: "新账户",
  });
  Object.assign(en.toasts, {
    close: "关闭",
    closeNotification: "关闭通知",
  });
}

export { assignPt, assignFr, assignDe, assignKo, assignJa, assignIt, assignZh };
