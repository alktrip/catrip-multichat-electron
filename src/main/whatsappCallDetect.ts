import { powerSaveBlocker } from "electron";

/** Heurística DOM / WebRTC para llamada activa en WhatsApp Web (cambia con el tiempo). */
export const WHATSAPP_CALL_ACTIVE_JS = `(() => {
  try {
    var selectors = [
      '[data-testid="call-container"]',
      '[data-testid="call-controls"]',
      '[data-testid="call-info"]',
      '[data-testid="ongoing-call"]',
      'button[aria-label*="End call"]',
      'button[aria-label*="Finalizar"]',
      'button[aria-label*="Colgar"]',
      '[aria-label*="en llamada"]',
      '[aria-label*="ongoing call"]'
    ];
    for (var i = 0; i < selectors.length; i++) {
      if (document.querySelector(selectors[i])) return true;
    }
    var videos = document.querySelectorAll("video");
    for (var j = 0; j < videos.length; j++) {
      var v = videos[j];
      if (!v || v.readyState < 2) continue;
      var stream = v.srcObject;
      if (stream && typeof stream.getAudioTracks === "function") {
        var tracks = stream.getAudioTracks();
        if (tracks && tracks.length > 0 && tracks.some(function (t) { return t && t.enabled; })) {
          return true;
        }
      }
    }
    return false;
  } catch (e) {
    return false;
  }
})()`;

let pollTimer: ReturnType<typeof setInterval> | null = null;
let blockerId: number | null = null;

function stopBlocker() {
  if (blockerId == null) return;
  try {
    if (powerSaveBlocker.isStarted(blockerId)) {
      powerSaveBlocker.stop(blockerId);
    }
  } catch {
    // ignore
  }
  blockerId = null;
}

function ensureBlocker() {
  if (blockerId != null && powerSaveBlocker.isStarted(blockerId)) return;
  try {
    blockerId = powerSaveBlocker.start("prevent-app-suspension");
  } catch {
    blockerId = null;
  }
}

export type CallSessionGuardDeps = {
  getEnabled: () => boolean;
  /** true si alguna vista de cuenta tiene llamada activa. */
  evalAnyCallActive: () => Promise<boolean>;
};

export function startCallSessionGuard(deps: CallSessionGuardDeps) {
  stopCallSessionGuard();
  const tick = () => {
    void (async () => {
      if (!deps.getEnabled()) {
        stopBlocker();
        return;
      }
      const active = await deps.evalAnyCallActive();
      if (active) ensureBlocker();
      else stopBlocker();
    })();
  };
  tick();
  pollTimer = setInterval(tick, 5000);
}

export function stopCallSessionGuard() {
  if (pollTimer != null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  stopBlocker();
}
