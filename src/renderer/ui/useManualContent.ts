import React from "react";
import { useTranslation } from "react-i18next";
import {
  MANUAL_ILLUSTRATIONS,
  type ManualIllustrationKey,
} from "./manualIllustrations";

export type ManualTable = { headers: string[]; rows: string[][] };

export type ManualSection = {
  id: string;
  title: string;
  illustration?: React.ComponentType;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  note?: string;
  table?: ManualTable;
};

export type ManualIntro = {
  title: string;
  subtitle: string;
  versionNote: string;
  tocTitle: string;
  closeAria: string;
  footer: string;
};

type RawManualSection = {
  id: string;
  title: string;
  illustration?: ManualIllustrationKey | null;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  note?: string;
  table?: ManualTable;
};

type RawManual = {
  intro: Omit<ManualIntro, never>;
  sections: RawManualSection[];
};

function normalizeSection(raw: RawManualSection): ManualSection {
  const illustration =
    raw.illustration && raw.illustration in MANUAL_ILLUSTRATIONS
      ? MANUAL_ILLUSTRATIONS[raw.illustration]
      : undefined;
  return {
    id: raw.id,
    title: raw.title,
    illustration,
    paragraphs: raw.paragraphs?.length ? raw.paragraphs : undefined,
    bullets: raw.bullets?.length ? raw.bullets : undefined,
    steps: raw.steps?.length ? raw.steps : undefined,
    note: raw.note || undefined,
    table: raw.table,
  };
}

export function useManualContent(): {
  intro: ManualIntro;
  sections: ManualSection[];
  toc: Array<{ id: string; title: string }>;
} {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return React.useMemo(() => {
    const raw = t("manual", { returnObjects: true }) as RawManual | string;
    if (!raw || typeof raw === "string" || !Array.isArray(raw.sections)) {
      return { intro: fallbackIntro(t), sections: [], toc: [] };
    }
    const sections = raw.sections.map(normalizeSection);
    return {
      intro: raw.intro,
      sections,
      toc: sections.map((s) => ({ id: s.id, title: s.title })),
    };
  }, [t, lang]);
}

function fallbackIntro(t: (key: string) => string): ManualIntro {
  return {
    title: t("main.menus.userManual"),
    subtitle: "",
    versionNote: "",
    tocTitle: t("manual.fallback.tocTitle", { defaultValue: "Contents" }),
    closeAria: t("manual.fallback.closeAria", { defaultValue: t("common.close") }),
    footer: t("app.shortcuts.footer"),
  };
}
