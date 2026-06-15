import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const links = {
  plataforma: [
    { label: "Inicio", to: "/" },
    { label: "Veeduría", to: "/veeduria" },
    { label: "Clima", to: "/clima" },
    { label: "Preguntas Frecuentes", to: "/faq" },
  ],
  datos: [
    { label: "SECOP II", href: "https://www.colombiacompra.gov.co/secopII/" },
    { label: "IDEAM", href: "https://www.ideam.gov.co/" },
    { label: "DANE", href: "https://www.dane.gov.co/" },
  ],
  legal: [
    { label: "Política de Privacidad", to: "/faq" },
    { label: "Términos de Uso", to: "/faq" },
  ],
};

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="relative" style={{ backgroundColor: "#0F141E" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(76,106,146,0.3), transparent)" }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: "#4C6A92" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="15.5" />
                  <polyline points="22 8.5 12 15.5 2 8.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight" style={{ color: "#F8F6F1" }}>ATLAS</h3>
                <p className="text-[9px] uppercase tracking-[0.18em]" style={{ color: "#6F8F72" }}>Cívico</p>
              </div>
            </Link>
            <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: "#6B7280" }}>
              Plataforma ciudadana de transparencia para contratos públicos y monitoreo climático en Colombia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#4C6A92" }}>Plataforma</h4>
            <ul className="space-y-2.5">
              {links.plataforma.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F6F1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#4C6A92" }}>Fuentes de Datos</h4>
            <ul className="space-y-2.5">
              {links.datos.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F6F1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                  >
                    {l.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#4C6A92" }}>Legal</h4>
            <ul className="space-y-2.5">
              {links.legal.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F6F1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="h-px w-full" style={{ backgroundColor: "rgba(156,163,175,0.1)" }} />
        <div className="flex flex-col sm:flex-row items-center justify-between py-5 gap-3">
          <p className="text-[11px]" style={{ color: "#6B7280" }}>
            © 2026 AtlasCívico. Proyecto de código abierto.
          </p>
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#6B7280" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#34D399" }} />
            Junio 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
