/**
 * Parches del manual: llamadas y videollamadas en WhatsApp Web (opción BETA).
 * Inserta la sección `videollamadas` tras `chat-numero`.
 */

/** @type {Record<string, object>} */
const VIDEO_CALLS_SECTIONS = {
  es: {
    id: "videollamadas",
    title: "Llamadas y videollamadas en WhatsApp Web",
    paragraphs: [
      "Las llamadas de voz y vídeo en WhatsApp Web se activan de forma gradual. Catrip Connect ya permite micrófono y cámara cuando WhatsApp lo solicite; no hace falta configurar nada extra en la aplicación.",
      "Si aún no ves los iconos de teléfono y cámara en un chat individual, probablemente debes unirte al programa beta de WhatsApp Web desde la propia interfaz de WhatsApp.",
    ],
    steps: [
      "Asegúrate de tener la cuenta conectada (no en espera de QR) y seleccionada como activa en Catrip Connect.",
      "En WhatsApp Web, mira la esquina inferior izquierda de la barra lateral, encima de tu foto de perfil.",
      "Pulsa la opción BETA que aparece ahí y sigue las instrucciones de WhatsApp para activar las llamadas en la versión web.",
      "Abre un chat con una sola persona (de momento las llamadas en Web suelen limitarse a chats individuales).",
      "Comprueba los iconos de teléfono (voz) y cámara (vídeo) en la parte superior derecha del chat.",
      "Si no aparecen, recarga la vista con F5 (menú Chat → Recargar) o cierra y vuelve a abrir la sesión en WhatsApp Web.",
    ],
    bullets: [
      "En Ajustes → Rendimiento encontrarás «Evitar suspensión durante videollamada»: evita que el equipo se duerma mientras haya una llamada activa.",
      "La disponibilidad depende de WhatsApp: no todas las cuentas reciben la beta al mismo tiempo.",
    ],
    note: "WhatsApp Web usa su propio idioma; la etiqueta BETA puede verse en otro idioma según la configuración de tu móvil o de web.whatsapp.com.",
  },
  en: {
    id: "videollamadas",
    title: "Voice and video calls on WhatsApp Web",
    paragraphs: [
      "Voice and video calls on WhatsApp Web roll out gradually. Catrip Connect already allows microphone and camera access when WhatsApp requests it; you do not need extra setup in the app.",
      "If you still do not see phone and camera icons in an individual chat, you likely need to join the WhatsApp Web beta from WhatsApp itself.",
    ],
    steps: [
      "Make sure the account is connected (not waiting for QR) and selected as active in Catrip Connect.",
      "In WhatsApp Web, look at the bottom-left corner of the sidebar, above your profile photo.",
      "Tap the BETA option there and follow WhatsApp's instructions to enable calls on the web version.",
      "Open a one-to-one chat (web calls are usually limited to individual chats for now).",
      "Check for phone (voice) and camera (video) icons at the top right of the chat.",
      "If they are missing, reload with F5 (Chat → Reload) or sign out and back into WhatsApp Web.",
    ],
    bullets: [
      "Settings → Performance includes Prevent sleep during video call: keeps the system awake while a call is active.",
      "Availability depends on WhatsApp: not every account gets the beta at the same time.",
    ],
    note: "WhatsApp Web uses its own language; the BETA label may appear in another language depending on your phone or web.whatsapp.com settings.",
  },
  pt: {
    id: "videollamadas",
    title: "Chamadas e videochamadas no WhatsApp Web",
    paragraphs: [
      "Chamadas de voz e vídeo no WhatsApp Web são ativadas gradualmente. O Catrip Connect já permite microfone e câmara quando o WhatsApp pede; não precisa de configuração extra na aplicação.",
      "Se ainda não vê os ícones de telefone e câmara num chat individual, provavelmente precisa de aderir ao beta do WhatsApp Web na própria interface do WhatsApp.",
    ],
    steps: [
      "Certifique-se de que a conta está ligada (não à espera de QR) e selecionada como ativa no Catrip Connect.",
      "No WhatsApp Web, olhe para o canto inferior esquerdo da barra lateral, acima da foto de perfil.",
      "Toque na opção BETA que aparece aí e siga as instruções do WhatsApp para ativar chamadas na versão web.",
      "Abra um chat individual (por agora as chamadas na Web costumam limitar-se a conversas a dois).",
      "Verifique os ícones de telefone (voz) e câmara (vídeo) no canto superior direito do chat.",
      "Se não aparecerem, recarregue com F5 (Chat → Recarregar) ou termine e volte a iniciar sessão no WhatsApp Web.",
    ],
    bullets: [
      "Em Definições → Desempenho encontra «Evitar suspensão durante videochamada»: impede que o equipamento adormeça durante uma chamada ativa.",
      "A disponibilidade depende do WhatsApp: nem todas as contas recebem o beta ao mesmo tempo.",
    ],
    note: "O WhatsApp Web usa o seu próprio idioma; a etiqueta BETA pode aparecer noutro idioma consoante o telemóvel ou web.whatsapp.com.",
  },
  fr: {
    id: "videollamadas",
    title: "Appels et visioconférences sur WhatsApp Web",
    paragraphs: [
      "Les appels voix et vidéo sur WhatsApp Web se déploient progressivement. Catrip Connect autorise déjà le micro et la caméra lorsque WhatsApp le demande ; aucun réglage supplémentaire n'est nécessaire dans l'application.",
      "Si vous ne voyez pas encore les icônes téléphone et caméra dans une discussion individuelle, il faut probablement rejoindre la bêta WhatsApp Web depuis l'interface WhatsApp.",
    ],
    steps: [
      "Vérifiez que le compte est connecté (pas en attente de QR) et actif dans Catrip Connect.",
      "Dans WhatsApp Web, regardez le coin inférieur gauche de la barre latérale, au-dessus de votre photo de profil.",
      "Appuyez sur l'option BETA qui s'y affiche et suivez les instructions de WhatsApp pour activer les appels sur la version web.",
      "Ouvrez une discussion à deux (pour l'instant les appels web sont surtout limités aux chats individuels).",
      "Vérifiez les icônes téléphone (voix) et caméra (vidéo) en haut à droite de la discussion.",
      "Si elles manquent, rechargez avec F5 (Discussion → Recharger) ou reconnectez-vous à WhatsApp Web.",
    ],
    bullets: [
      "Paramètres → Performances : « Éviter la mise en veille pendant un appel vidéo » empêche le système de dormir pendant un appel actif.",
      "La disponibilité dépend de WhatsApp : toutes les comptes n'obtiennent pas la bêta en même temps.",
    ],
    note: "WhatsApp Web a sa propre langue ; l'étiquette BETA peut apparaître dans une autre langue selon votre téléphone ou web.whatsapp.com.",
  },
  de: {
    id: "videollamadas",
    title: "Sprach- und Videoanrufe in WhatsApp Web",
    paragraphs: [
      "Sprach- und Videoanrufe in WhatsApp Web werden schrittweise ausgerollt. Catrip Connect erlaubt Mikrofon und Kamera bereits, wenn WhatsApp danach fragt; in der App ist keine Extra-Konfiguration nötig.",
      "Wenn Sie in einem Einzelchat noch keine Telefon- und Kamera-Symbole sehen, müssen Sie vermutlich der WhatsApp-Web-Beta über die WhatsApp-Oberfläche beitreten.",
    ],
    steps: [
      "Stellen Sie sicher, dass das Konto verbunden ist (nicht auf QR warten) und in Catrip Connect aktiv ausgewählt ist.",
      "Schauen Sie in WhatsApp Web unten links in der Seitenleiste, über Ihrem Profilbild.",
      "Tippen Sie auf die dort angezeigte Option BETA und folgen Sie den Anweisungen von WhatsApp, um Anrufe in der Web-Version zu aktivieren.",
      "Öffnen Sie einen Einzelchat (Web-Anrufe sind derzeit meist auf Einzelchats beschränkt).",
      "Prüfen Sie die Symbole für Telefon (Sprache) und Kamera (Video) oben rechts im Chat.",
      "Fehlen sie, laden Sie mit F5 neu (Chat → Neu laden) oder melden Sie sich in WhatsApp Web erneut an.",
    ],
    bullets: [
      "Einstellungen → Leistung: «Ruhezustand während Videoanruf verhindern» hält das System während eines aktiven Anrufs wach.",
      "Die Verfügbarkeit hängt von WhatsApp ab: nicht jedes Konto erhält die Beta gleichzeitig.",
    ],
    note: "WhatsApp Web nutzt eine eigene Sprache; das BETA-Label kann je nach Handy oder web.whatsapp.com in einer anderen Sprache erscheinen.",
  },
  ko: {
    id: "videollamadas",
    title: "WhatsApp Web에서 음성·영상 통화",
    paragraphs: [
      "WhatsApp Web의 음성·영상 통화는 점진적으로 제공됩니다. Catrip Connect는 WhatsApp이 요청할 때 마이크와 카메라를 이미 허용하므로 앱에서 별도 설정이 필요 없습니다.",
      "개인 채팅에서 전화·카메라 아이콘이 아직 보이지 않으면 WhatsApp Web 베타에 WhatsApp 화면에서 직접 가입해야 할 수 있습니다.",
    ],
    steps: [
      "계정이 연결되어 있고(QR 대기 아님) Catrip Connect에서 활성 계정으로 선택되어 있는지 확인하세요.",
      "WhatsApp Web 왼쪽 사이드바 하단, 프로필 사진 위를 확인하세요.",
      "표시되는 BETA 옵션을 누르고 WhatsApp 안내에 따라 웹 버전에서 통화를 활성화하세요.",
      "1:1 채팅을 엽니다(현재 웹 통화는 주로 개인 채팅에서만 제공됩니다).",
      "채팅 오른쪽 위의 전화(음성) 및 카메라(영상) 아이콘을 확인하세요.",
      "보이지 않으면 F5로 새로고침(채팅 → 새로고침)하거나 WhatsApp Web 세션을 다시 연결하세요.",
    ],
    bullets: [
      "설정 → 성능의 «영상 통화 중 절전 방지»는 통화 중 시스템이 잠들지 않게 합니다.",
      "이용 가능 여부는 WhatsApp에 따라 다릅니다. 모든 계정이 동시에 베타를 받지는 않습니다.",
    ],
    note: "WhatsApp Web은 자체 언어를 사용합니다. BETA 표시는 휴대폰이나 web.whatsapp.com 설정에 따라 다른 언어로 보일 수 있습니다.",
  },
  ja: {
    id: "videollamadas",
    title: "WhatsApp Web の音声・ビデオ通話",
    paragraphs: [
      "WhatsApp Web の音声・ビデオ通話は段階的に提供されています。Catrip Connect は WhatsApp が要求した際にマイクとカメラをすでに許可するため、アプリ側の追加設定は不要です。",
      "個人チャットに電話・カメラのアイコンがまだ表示されない場合は、WhatsApp Web のベータに WhatsApp 画面から参加する必要があるかもしれません。",
    ],
    steps: [
      "アカウントが接続済み（QR 待ちでない）で、Catrip Connect でアクティブに選択されていることを確認します。",
      "WhatsApp Web のサイドバー左下、プロフィール写真の上を確認します。",
      "表示される BETA オプションをタップし、WhatsApp の指示に従って Web 版で通話を有効にします。",
      "1 対 1 のチャットを開きます（現時点では Web 通話は主に個人チャットに限られます）。",
      "チャット右上の電話（音声）とカメラ（ビデオ）アイコンを確認します。",
      "表示されない場合は F5 で再読み込み（チャット → 再読み込み）するか、WhatsApp Web に再度ログインします。",
    ],
    bullets: [
      "設定 → パフォーマンスの「ビデオ通話中のスリープ防止」は、通話中にシステムがスリープしないようにします。",
      "利用可否は WhatsApp 次第です。すべてのアカウントが同時にベータを受け取るわけではありません。",
    ],
    note: "WhatsApp Web は独自の言語設定です。BETA ラベルは端末や web.whatsapp.com の設定により別の言語で表示されることがあります。",
  },
  it: {
    id: "videollamadas",
    title: "Chiamate vocali e video su WhatsApp Web",
    paragraphs: [
      "Le chiamate vocali e video su WhatsApp Web vengono attivate gradualmente. Catrip Connect consente già microfono e fotocamera quando WhatsApp lo richiede; non serve configurazione extra nell'app.",
      "Se non vedi ancora le icone telefono e fotocamera in una chat individuale, probabilmente devi unirti alla beta di WhatsApp Web dall'interfaccia di WhatsApp.",
    ],
    steps: [
      "Assicurati che l'account sia connesso (non in attesa del QR) e selezionato come attivo in Catrip Connect.",
      "In WhatsApp Web, guarda l'angolo in basso a sinistra della barra laterale, sopra la foto profilo.",
      "Tocca l'opzione BETA che compare lì e segui le istruzioni di WhatsApp per attivare le chiamate nella versione web.",
      "Apri una chat individuale (per ora le chiamate web sono di solito limitate ai chat uno a uno).",
      "Controlla le icone telefono (voce) e fotocamera (video) in alto a destra nella chat.",
      "Se mancano, ricarica con F5 (Chat → Ricarica) o esci e rientra in WhatsApp Web.",
    ],
    bullets: [
      "Impostazioni → Prestazioni: «Evita sospensione durante videochiamata» impedisce al sistema di andare in standby con una chiamata attiva.",
      "La disponibilità dipende da WhatsApp: non tutti gli account ricevono la beta contemporaneamente.",
    ],
    note: "WhatsApp Web usa una lingua propria; l'etichetta BETA può apparire in un'altra lingua in base al telefono o a web.whatsapp.com.",
  },
  zh: {
    id: "videollamadas",
    title: "WhatsApp Web 语音和视频通话",
    paragraphs: [
      "WhatsApp Web 的语音和视频通话正在逐步推出。Catrip Connect 在 WhatsApp 请求时已允许麦克风和摄像头，无需在应用中额外配置。",
      "若个人聊天中仍看不到电话和摄像头图标，可能需要在 WhatsApp 界面中加入 WhatsApp Web Beta 计划。",
    ],
    steps: [
      "确保账户已连接（非等待 QR）且在 Catrip Connect 中为活动账户。",
      "在 WhatsApp Web 左侧边栏左下角、头像上方查看。",
      "点击显示的 BETA 选项，并按 WhatsApp 说明在 Web 版中启用通话。",
      "打开一对一聊天（目前 Web 通话通常仅限个人聊天）。",
      "检查聊天右上角的电话（语音）和摄像头（视频）图标。",
      "若没有，请按 F5 刷新（聊天 → 重新加载）或重新登录 WhatsApp Web。",
    ],
    bullets: [
      "设置 → 性能中的「视频通话期间防止休眠」可在通话进行时避免系统进入睡眠。",
      "是否可用取决于 WhatsApp：并非所有账户会同时获得 Beta。",
    ],
    note: "WhatsApp Web 使用独立语言；BETA 标签可能因手机或 web.whatsapp.com 设置而显示为其他语言。",
  },
};

/** @type {Record<string, string>} */
const PROBLEMA_BULLETS = {
  es: "No veo iconos de llamada en un chat: únete a la beta de WhatsApp Web (sección «Llamadas y videollamadas» de este manual), pulsa BETA encima de tu foto de perfil y recarga con F5.",
  en: "Call icons missing in a chat: join the WhatsApp Web beta (Voice and video calls section in this manual), tap BETA above your profile photo, and reload with F5.",
  pt: "Não vejo ícones de chamada num chat: adira ao beta do WhatsApp Web (secção Chamadas e videochamadas deste manual), toque em BETA acima da foto de perfil e recarregue com F5.",
  fr: "Pas d'icônes d'appel dans un chat : rejoignez la bêta WhatsApp Web (section Appels et visioconférences de ce manuel), appuyez sur BETA au-dessus de votre photo de profil et rechargez avec F5.",
  de: "Keine Anruf-Symbole im Chat: WhatsApp-Web-Beta beitreten (Abschnitt Sprach- und Videoanrufe in diesem Handbuch), BETA über dem Profilbild tippen und mit F5 neu laden.",
  ko: "채팅에 통화 아이콘이 없음: WhatsApp Web 베타 가입(이 매뉴얼의 음성·영상 통화 절), 프로필 사진 위 BETA를 누르고 F5로 새로고침.",
  ja: "チャットに通話アイコンがない：WhatsApp Web ベータに参加（本マニュアルの音声・ビデオ通話）、プロフィール写真上の BETA をタップし F5 で再読み込み。",
  it: "Mancano le icone chiamata in una chat: unisciti alla beta WhatsApp Web (sezione Chiamate vocali e video in questo manuale), tocca BETA sopra la foto profilo e ricarica con F5.",
  zh: "聊天中看不到通话图标：加入 WhatsApp Web Beta（本手册「WhatsApp Web 语音和视频通话」），点击头像上方的 BETA，然后按 F5 刷新。",
};

/**
 * @param {object[]} sections
 * @param {string} locale
 * @returns {object[]}
 */
export function applyManualVideollamadasPatch(sections, locale) {
  const section = VIDEO_CALLS_SECTIONS[locale] ?? VIDEO_CALLS_SECTIONS.en;
  const problemaBullet = PROBLEMA_BULLETS[locale] ?? PROBLEMA_BULLETS.en;

  const out = sections.map((s) => {
    if (s.id !== "problemas" || !s.bullets) return s;
    const hasCallHelp = s.bullets.some((b) =>
      /beta|llamada|call|chamada|appel|anruf|통화|通話|chiamat|通话/i.test(b),
    );
    return hasCallHelp ? s : { ...s, bullets: [...s.bullets, problemaBullet] };
  });

  if (out.some((s) => s.id === "videollamadas")) return out;

  const idx = out.findIndex((s) => s.id === "chat-numero");
  if (idx >= 0) {
    out.splice(idx + 1, 0, section);
  } else {
    out.push(section);
  }

  return out;
}
