import { createContext, useContext, useState, useEffect, useCallback } from "react";

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("atlas-dark-mode") === "true"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem("atlas-dark-mode", String(dark)); } catch {}
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  return ctx || { dark: false, toggle: () => {} };
}
