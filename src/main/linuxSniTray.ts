import { nativeImage } from "electron";
import * as dbus from "dbus-next";

type Bus = any;
type Variant = any;

function v(sig: string, val: any): Variant {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return new (dbus as any).Variant(sig, val);
}

function nativeImageToIconPixmap(img: Electron.NativeImage): Array<[number, number, Uint8Array]> {
  // `IconPixmap` usa a(iiay) donde `ay` es ARGB32 por pixel.
  // Importante: ARGB32 en D-Bus se interpreta como uint32 nativo.
  // En máquinas little-endian (Linux x86_64) el orden en memoria es **BGRA**.
  // Electron `toBitmap()` ya devuelve **BGRA**, así que NO convertimos.
  const size = img.getSize();
  const w = Math.max(1, size.width | 0);
  const h = Math.max(1, size.height | 0);
  const bgra = img.toBitmap();
  return [[w, h, new Uint8Array(bgra)]];
}

function fallbackSolidPixmap(size = 24): Array<[number, number, Uint8Array]> {
  const w = size;
  const h = size;
  const out = new Uint8Array(w * h * 4);
  for (let i = 0; i < out.length; i += 4) {
    out[i + 0] = 0x30; // B
    out[i + 1] = 0xa5; // G
    out[i + 2] = 0x34; // R
    out[i + 3] = 0xff; // A
  }
  return [[w, h, out]];
}

function safeRaster24(
  img: Electron.NativeImage,
  log?: (...args: any[]) => void,
): Electron.NativeImage {
  try {
    const png = img.toPNG();
    log?.("linux-sni icon:toPNG", {
      isEmpty: img.isEmpty(),
      size: img.getSize?.(),
      png: png?.length || 0,
    });
    if (png && png.length > 0) {
      const base = nativeImage.createFromBuffer(png);
      const r = base.resize({ width: 24, height: 24 });
      return r.isEmpty() ? base : r;
    }
  } catch {
    // ignore
  }
  return img.resize({ width: 24, height: 24 });
}

export type LinuxSniTrayHandle = {
  update(): Promise<void>;
  dispose(): Promise<void>;
};

export async function createLinuxSniTray(opts: {
  id: string;
  title: string;
  getIcon: () => Electron.NativeImage;
  onActivate: () => void;
  onContextMenu?: (x: number, y: number) => void;
  onShow?: () => void;
  onHide?: () => void;
  onSettings?: () => void;
  onQuit?: () => void;
  log?: (...args: any[]) => void;
}): Promise<LinuxSniTrayHandle> {
  const bus: Bus = (dbus as any).sessionBus();
  const objPath = "/StatusNotifierItem";
  const menuPath = "/MenuBar";

  const Interface = (dbus as any).interface.Interface;

  // DBusMenu mínimo (com.canonical.dbusmenu). GNOME lo usa para menú contextual.
  class DbusMenu extends Interface {
    constructor() {
      super("com.canonical.dbusmenu");
    }

    // Estructura de layout: (u a{sv} av)
    GetLayout(_parentId: number, _recursionDepth: number, _propertyNames: string[]) {
      opts.log?.("linux-sni menu:GetLayout", { parentId: _parentId, depth: _recursionDepth });
      // ids: 0 root, 1 show, 2 hide, 3 settings, 4 quit
      const itemProps = (label: string) => ({
        label: v("s", label),
        enabled: v("b", true),
        visible: v("b", true),
      });
      // Cada hijo debe ser Variant("(ia{sv}av)", ...) para cumplir con la firma av del D-Bus menu.
      const leaf = (id: number, props: any) => v("(ia{sv}av)", [id, props, []]);
      const root = [
        0,
        { "children-display": v("s", "submenu") },
        [
          leaf(1, itemProps("Mostrar")),
          leaf(2, itemProps("Ocultar")),
          leaf(3, itemProps("Ajustes")),
          leaf(4, itemProps("Salir")),
        ],
      ];
      return [0, root] as any;
    }

    GetGroupProperties(_ids: number[], _propertyNames: string[]) {
      return [] as any;
    }

    GetProperty(_id: number, _name: string) {
      return v("v", null) as any;
    }

    Event(id: number, eventId: string, _data: Variant, _timestamp: number) {
      opts.log?.("linux-sni menu:Event", { id, eventId });
      // Activación por click en item.
      if (eventId !== "clicked") return;
      // Diferir la acción para que este método D-Bus retorne antes de que
      // la acción (ej. app.quit) desconecte el bus.
      switch (id) {
        case 1:
          setTimeout(() => opts.onShow?.(), 0);
          break;
        case 2:
          setTimeout(() => opts.onHide?.(), 0);
          break;
        case 3:
          setTimeout(() => opts.onSettings?.(), 0);
          break;
        case 4:
          setTimeout(() => opts.onQuit?.(), 0);
          break;
      }
    }

    AboutToShow(_id: number) {
      return false;
    }

    AboutToShowGroup(_ids: number[]) {
      return [] as any;
    }

    EventGroup(_events: any[]) {}
  }

  (DbusMenu as any).configureMembers({
    methods: {
      GetLayout: { inSignature: "iias", outSignature: "u(ia{sv}av)" },
      GetGroupProperties: { inSignature: "aias", outSignature: "a(ia{sv})" },
      GetProperty: { inSignature: "is", outSignature: "v" },
      Event: { inSignature: "isvu", outSignature: "" },
      AboutToShow: { inSignature: "i", outSignature: "b" },
      AboutToShowGroup: { inSignature: "ai", outSignature: "ai" },
      EventGroup: { inSignature: "a(isvu)", outSignature: "" },
    },
    signals: {
      LayoutUpdated: { signature: "ui" },
      ItemsPropertiesUpdated: { signature: "a(ia{sv})a(ias)" },
    },
  });

  class SniItem extends Interface {
    constructor() {
      super("org.kde.StatusNotifierItem");
    }

    get Category() {
      return "ApplicationStatus";
    }
    get Id() {
      return opts.id;
    }
    get Title() {
      return opts.title;
    }
    get Status() {
      return "Active";
    }
    get WindowId() {
      return 0;
    }
    get IconThemePath() {
      return "";
    }
    get IconName() {
      return "";
    }
    get IconAccessibleDesc() {
      return opts.title;
    }

    get AttentionIconName() {
      return "";
    }
    get AttentionIconPixmap() {
      return [];
    }
    get AttentionAccessibleDesc() {
      return "";
    }

    get OverlayIconName() {
      return "";
    }
    get OverlayIconPixmap() {
      return [];
    }

    get ItemIsMenu() {
      // En GNOME/Zorin, true hace que el host abra el menú D-Bus al hacer clic (izq o der).
      // Sin esto, left-click solo llama Activate y el usuario no ve el menú.
      return true;
    }
    get Menu() {
      return menuPath;
    }
    get IconPixmap() {
      const img = safeRaster24(opts.getIcon(), opts.log);
      let pix = nativeImageToIconPixmap(img);
      try {
        const [w, h, bytes] = pix[0]!;
        opts.log?.("linux-sni IconPixmap", { w, h, bytes: bytes.length });
        if (bytes.length === 0) {
          pix = fallbackSolidPixmap(24);
          const [fw, fh, fbytes] = pix[0]!;
          opts.log?.("linux-sni IconPixmap fallback", { w: fw, h: fh, bytes: fbytes.length });
        }
      } catch {
        // ignore
      }
      return pix;
    }
    get ToolTip() {
      const img = safeRaster24(opts.getIcon(), opts.log);
      return ["", nativeImageToIconPixmap(img), opts.title, ""] as any;
    }

    Activate(_x: number, _y: number) {
      opts.log?.("linux-sni Activate", { x: _x, y: _y });
      // En GNOME/hosts que no invocan ContextMenu para el click, usamos Activate como fallback
      // para abrir el menú contextual (si está configurado).
      try {
        opts.onContextMenu?.(_x, _y);
      } catch {
        // ignore
      }
      opts.onActivate();
    }
    SecondaryActivate(_x: number, _y: number) {
      opts.log?.("linux-sni SecondaryActivate", { x: _x, y: _y });
      opts.onActivate();
    }
    Scroll(_delta: number) {
      opts.log?.("linux-sni Scroll", { delta: _delta });
    }
    ContextMenu(_x: number, _y: number) {
      opts.log?.("linux-sni ContextMenu", { x: _x, y: _y });
      try {
        opts.onContextMenu?.(_x, _y);
      } catch {
        // ignore
      }
    }
  }

  (SniItem as any).configureMembers({
    properties: {
      Category: { signature: "s" },
      Id: { signature: "s" },
      Title: { signature: "s" },
      Status: { signature: "s" },
      WindowId: { signature: "u" },
      IconThemePath: { signature: "s" },
      IconName: { signature: "s" },
      IconAccessibleDesc: { signature: "s" },
      IconPixmap: { signature: "a(iiay)" },
      OverlayIconName: { signature: "s" },
      OverlayIconPixmap: { signature: "a(iiay)" },
      AttentionIconName: { signature: "s" },
      AttentionIconPixmap: { signature: "a(iiay)" },
      AttentionAccessibleDesc: { signature: "s" },
      ItemIsMenu: { signature: "b" },
      Menu: { signature: "o" },
      ToolTip: { signature: "(sa(iiay)ss)" },
    },
    methods: {
      Activate: { inSignature: "ii", outSignature: "" },
      SecondaryActivate: { inSignature: "ii", outSignature: "" },
      Scroll: { inSignature: "i", outSignature: "" },
      ContextMenu: { inSignature: "ii", outSignature: "" },
    },
    signals: {
      PropertiesChanged: { signature: "sa{sv}as" },
    },
  });

  const ifaceName = "org.kde.StatusNotifierItem";
  const sni = new SniItem();
  const menu = new DbusMenu();

  // Usar SIEMPRE el nombre único asignado por el bus (":1.xxx") para registrarnos en el watcher.
  // En dev, pedir un well-known name es frágil (puede quedar huérfano) y algunos hosts esperan el unique name.
  const uniqueName: string = await new Promise((resolve) => {
    if (bus.name) return resolve(String(bus.name));
    bus.once?.("connect", () => resolve(String(bus.name)));
    // fallback: por si ya conectó y no disparó evento
    setTimeout(() => resolve(String(bus.name || "")), 500);
  });
  opts.log?.("linux-sni connect", { uniqueName });

  bus.export(objPath, sni);
  bus.export(menuPath, menu);

  // Algunos hosts esperan un primer LayoutUpdated.
  try {
    (menu as any).$emitter?.emit?.("signal", { name: "LayoutUpdated", signature: "ui" }, [0, 0]);
  } catch {
    // ignore
  }

  async function register() {
    const watcher = await bus.getProxyObject(
      "org.kde.StatusNotifierWatcher",
      "/StatusNotifierWatcher",
    );
    const w = watcher.getInterface("org.kde.StatusNotifierWatcher");
    // La spec define `RegisterStatusNotifierItem(s service)`.
    await (w as any).RegisterStatusNotifierItem(uniqueName);
    opts.log?.("linux-sni registered", { uniqueName, objPath });
  }

  await register().catch((e) => {
    opts.log?.("linux-sni register failed", {
      message: e instanceof Error ? e.message : String(e),
    });
  });

  let closed = false;

  function isDbusClosedError(e: unknown): boolean {
    const msg = e instanceof Error ? e.message : String(e);
    return /stream is closed|Cannot send message/i.test(msg);
  }

  async function update() {
    if (closed) return;
    try {
      (dbus as any).interface.Interface.emitPropertiesChanged(
        sni,
        {
          IconPixmap: sni.IconPixmap,
          ToolTip: sni.ToolTip,
        },
        [],
      );
    } catch (e) {
      if (isDbusClosedError(e)) closed = true;
    }
  }

  async function dispose() {
    if (closed) return;
    closed = true;
    try {
      bus.unexport(objPath);
    } catch {
      // ignore
    }
    try {
      bus.unexport(menuPath);
    } catch {
      // ignore
    }
    try {
      bus.disconnect();
    } catch {
      // ignore
    }
  }

  return { update, dispose };
}
