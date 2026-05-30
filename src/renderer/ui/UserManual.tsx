import React from "react";
import { MANUAL_INTRO, MANUAL_SECTIONS, MANUAL_TOC } from "./userManualContent";

function ManualTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="catrip-manual-table-wrap">
      <table className="catrip-manual-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ManualSectionBlock({ section }: { section: (typeof MANUAL_SECTIONS)[number] }) {
  const Illus = section.illustration;
  return (
    <section id={`manual-${section.id}`} className="catrip-manual-section">
      <h2 className="catrip-manual-h2">{section.title}</h2>
      {Illus ? (
        <div className="catrip-manual-illus-wrap">
          <Illus />
        </div>
      ) : null}
      {section.paragraphs?.map((p, i) => (
        <p key={i} className="catrip-manual-p">
          {p}
        </p>
      ))}
      {section.steps ? (
        <ol className="catrip-manual-ol">
          {section.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      ) : null}
      {section.bullets ? (
        <ul className="catrip-manual-ul">
          {section.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
      {section.table ? <ManualTable headers={section.table.headers} rows={section.table.rows} /> : null}
      {section.note ? <p className="catrip-manual-note">{section.note}</p> : null}
    </section>
  );
}

export default function UserManual({ onClose }: { onClose: () => void }) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = React.useState(MANUAL_SECTIONS[0]?.id ?? "bienvenida");

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [onClose]);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(`manual-${id}`);
    const body = bodyRef.current;
    if (el && body) {
      const top = el.offsetTop - body.offsetTop - 8;
      body.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="catrip-manual-title"
      className="catrip-overlay-veil catrip-manual-veil"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="catrip-overlay-panel catrip-manual-panel" onMouseDown={(e) => e.stopPropagation()}>
        <header className="catrip-manual-header">
          <div>
            <h1 id="catrip-manual-title" className="catrip-manual-title">
              {MANUAL_INTRO.title}
            </h1>
            <p className="catrip-manual-subtitle">{MANUAL_INTRO.subtitle}</p>
            <p className="catrip-manual-version">{MANUAL_INTRO.versionNote}</p>
          </div>
          <button type="button" className="catrip-btn" onClick={onClose} aria-label="Cerrar manual">
            Cerrar
          </button>
        </header>

        <div className="catrip-manual-body">
          <nav className="catrip-manual-toc" aria-label="Índice del manual">
            <div className="catrip-manual-toc-title">Índice</div>
            <ul>
              {MANUAL_TOC.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`catrip-manual-toc-btn${activeId === item.id ? " is-active" : ""}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div ref={bodyRef} className="catrip-manual-content">
            {MANUAL_SECTIONS.map((section) => (
              <ManualSectionBlock key={section.id} section={section} />
            ))}
          </div>
        </div>

        <footer className="catrip-manual-footer">
          <span className="catrip-text-hint">Esc para cerrar · Clic fuera del panel también cierra</span>
        </footer>
      </div>
    </div>
  );
}
