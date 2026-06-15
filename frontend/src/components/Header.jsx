import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";

const CIVIC_BLUE = "#4C6A92";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { dark } = useDarkMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Inicio", to: "/" },
    { label: "Veeduría", to: "/veeduria" },
    { label: "Clima", to: "/clima" },
    { label: "FAQ", to: "/faq" },
  ];

  function isActive(to) {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6" style={{ paddingTop: scrolled ? "12px" : "0" }}>
      <header
        className="mx-auto transition-all duration-500"
        style={{
          maxWidth: scrolled ? "720px" : "860px",
          backgroundColor: dark
            ? (scrolled ? "rgba(15,20,30,0.9)" : "rgba(15,20,30,0.7)")
            : (scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.65)"),
          backdropFilter: "blur(24px) saturate(180%)",
          borderRadius: "9999px",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)"
            : "0 2px 20px rgba(0,0,0,0.06)",
          border: dark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center justify-between h-14 px-2">
          <Link to="/" className="flex items-center gap-2.5 pl-4 group shrink-0" aria-label="AtlasCívico - Inicio">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: CIVIC_BLUE }}>
              <img src="/simbolocolombia.svg" alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight hidden sm:block" style={{ color: dark ? "#F8F6F1" : "#1F2937" }}>
              AtlasCívico
            </span>
          </Link>

          <nav className="hidden md:block absolute left-1/2 -translate-x-1/2" aria-label="Navegación principal">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="relative px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-200"
                      style={{
                        color: active
                          ? (dark ? "#F8F6F1" : "#1F2937")
                          : (dark ? "rgba(255,255,255,0.5)" : "#374151"),
                        backgroundColor: active
                          ? (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)")
                          : "transparent",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden md:flex items-center pr-3">
            <Link
              to="/veeduria"
              className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.97]"
              style={{
                backgroundColor: dark ? "#F8F6F1" : "#1F2937",
                color: dark ? "#0F141E" : "white",
              }}
            >
              Explorar datos
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-full transition-colors"
            style={{ color: dark ? "#F8F6F1" : "#1F2937" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {menuOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
            </svg>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mx-auto mt-2 overflow-hidden rounded-3xl"
            style={{
              maxWidth: "720px",
              backgroundColor: dark ? "rgba(15,20,30,0.92)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(24px)",
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
            }}
          >
            <ul className="p-2 space-y-0.5">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block px-5 py-3 text-sm font-medium rounded-2xl transition-all duration-150"
                    style={{
                      color: isActive(item.to)
                        ? (dark ? "#F8F6F1" : "#1F2937")
                        : (dark ? "rgba(255,255,255,0.55)" : "#6B7280"),
                      backgroundColor: isActive(item.to)
                        ? (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)")
                        : "transparent",
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-2 pt-0">
              <Link
                to="/veeduria"
                className="block text-center rounded-2xl px-5 py-3 text-sm font-semibold"
                style={{ backgroundColor: dark ? "#F8F6F1" : "#1F2937", color: dark ? "#0F141E" : "white" }}
                onClick={() => setMenuOpen(false)}
              >
                Explorar datos
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;
