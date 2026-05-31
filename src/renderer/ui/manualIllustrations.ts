import type React from "react";
import {
  IllustrationAccounts,
  IllustrationAppLayout,
  IllustrationCommandPalette,
  IllustrationNotification,
  IllustrationQr,
  IllustrationTray,
  IllustrationUrgentNow,
  IllustrationZen,
} from "./ManualIllustrations";

export type ManualIllustrationKey =
  | "qr"
  | "layout"
  | "accounts"
  | "zen"
  | "urgent"
  | "palette"
  | "notification"
  | "tray";

export const MANUAL_ILLUSTRATIONS: Record<ManualIllustrationKey, React.ComponentType> = {
  qr: IllustrationQr,
  layout: IllustrationAppLayout,
  accounts: IllustrationAccounts,
  zen: IllustrationZen,
  urgent: IllustrationUrgentNow,
  palette: IllustrationCommandPalette,
  notification: IllustrationNotification,
  tray: IllustrationTray,
};
