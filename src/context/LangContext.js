import { createContext, useContext, useEffect, useMemo } from "react";
import { LANGS } from "../data/products";

const LangContext = createContext(null);

const t = LANGS.fr;

export function LangProvider({ children }) {
  useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "fr";
  }, []);

  const value = useMemo(() => ({ t }), []);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
