import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEPARTMENTS } from "../data/departments";

export default function DepartmentSearch({ onSelect, selectedId, accentColor = "#4C6A92" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return DEPARTMENTS;
    const q = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return DEPARTMENTS.filter(
      (d) => d.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q)
        || d.capital.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200"
        style={{
          backgroundColor: "#F8F6F1",
          borderColor: open ? accentColor : "#D6D3CD",
          boxShadow: open ? `0 0 0 3px ${accentColor}15` : "none",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar departamento..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "#1F2937" }}
          aria-label="Buscar departamento"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="p-0.5 rounded" style={{ color: "#6B7280" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg shadow-xl"
            style={{ backgroundColor: "#F8F6F1", border: "1px solid #D6D3CD" }}
          >
            {filtered.map((dept) => (
              <li key={dept.id}>
                <button
                  onClick={() => { onSelect(dept.id); setQuery(""); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between"
                  style={{
                    backgroundColor: selectedId === dept.id ? `${accentColor}12` : "transparent",
                    color: selectedId === dept.id ? accentColor : "#1F2937",
                    borderLeft: selectedId === dept.id ? `2px solid ${accentColor}` : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (selectedId !== dept.id) e.currentTarget.style.backgroundColor = "rgba(107,114,128,0.05)"; }}
                  onMouseLeave={(e) => { if (selectedId !== dept.id) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{dept.capital}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
