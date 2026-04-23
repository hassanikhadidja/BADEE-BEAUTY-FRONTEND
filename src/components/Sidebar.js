import { useState } from "react";
import { SIDEBAR_FILTER_OPTIONS, isSidebarOptionActive } from "../utils/productFilters";
import { useLang } from "../context/LangContext";

export default function Sidebar({ searchParams, setSearchParams }) {
  const [co, setCo] = useState(true);
  const { t } = useLang();

  const applyOption = (opt) => {
    const p = opt.params || {};
    if (!p.view && !p.category) {
      setSearchParams({}, { replace: true });
      return;
    }
    const next = {};
    if (p.view) next.view = p.view;
    if (p.category) next.category = p.category;
    setSearchParams(next, { replace: true });
  };

  return (
    <div style={{ minWidth: 210, maxWidth: 220 }} className="sb-col">
      <div className="sb-section">
        <div className="sb-title" onClick={() => setCo(!co)}>
          {t.cats}
          <span>{co ? "▾" : "▸"}</span>
        </div>
        {co &&
          SIDEBAR_FILTER_OPTIONS.map((opt) => {
            const active = isSidebarOptionActive(opt, searchParams);
            return (
              <div
                key={opt.label}
                className="sb-item"
                onClick={() => applyOption(opt)}
                style={{ color: active ? "#D6247F" : "#666", fontWeight: active ? 700 : 400 }}
              >
                <input type="checkbox" checked={active} onChange={() => applyOption(opt)} readOnly />
                {opt.label}
              </div>
            );
          })}
      </div>
    </div>
  );
}
