import { motion } from "framer-motion";

const variants = {
  contracts: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#4C6A92" }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Sin contratos disponibles",
    description: "No se encontraron contratos de SECOP II para este departamento.",
    color: "#4C6A92",
  },
  climate: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6F8F72" }}>
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      </svg>
    ),
    title: "Sin datos climáticos",
    description: "No hay estaciones meteorológicas activas para este departamento.",
    color: "#6F8F72",
  },
  search: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6B7280" }}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: "Sin resultados",
    description: "No se encontraron departamentos que coincidan con su búsqueda.",
    color: "#6B7280",
  },
};

export default function EmptyState({ variant = "contracts", action }) {
  const v = variants[variant] || variants.contracts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-xl"
      style={{ backgroundColor: "rgba(107,114,128,0.03)", border: "1px solid rgba(214,211,205,0.35)" }}
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `${v.color}08`, border: `1px solid ${v.color}15` }}
      >
        {v.icon}
      </div>
      <h3 className="font-display text-lg font-bold mb-2" style={{ color: "#1F2937" }}>
        {v.title}
      </h3>
      <p className="text-sm max-w-xs mb-6" style={{ color: "#6B7280" }}>
        {v.description}
      </p>
      {action && action}
    </motion.div>
  );
}
