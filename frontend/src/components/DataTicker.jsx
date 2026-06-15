import { motion } from "framer-motion";

const TICKER_ITEMS = [
  { text: "Bogotá D.C.", type: "dept", value: "$28.0 MM" },
  { text: "•", type: "dot" },
  { text: "Antioquia", type: "dept", value: "$18.3 MM" },
  { text: "•", type: "dot" },
  { text: "Valle del Cauca", type: "dept", value: "$4.1 MM" },
  { text: "•", type: "dot" },
  { text: "Atlántico", type: "dept", value: "$8.1 MM" },
  { text: "•", type: "dot" },
  { text: "Santander", type: "dept", value: "$6.2 MM" },
  { text: "•", type: "dot" },
  { text: "Magdalena", type: "dept", value: "$3.1 MM" },
  { text: "•", type: "dot" },
  { text: "Cesar", type: "dept", value: "$1.9 MM" },
  { text: "•", type: "dot" },
  { text: "Bolívar", type: "dept", value: "$10.6 MM" },
  { text: "•", type: "dot" },
  { text: "Cundinamarca", type: "dept", value: "$28.0 MM" },
  { text: "•", type: "dot" },
  { text: "Alerta incendio: Cesar", type: "alert" },
  { text: "•", type: "dot" },
  { text: "Alerta incendio: Magdalena", type: "alert" },
  { text: "•", type: "dot" },
  { text: "Alerta incendio: Cundinamarca", type: "alert" },
  { text: "•", type: "dot" },
];

export default function DataTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden py-3" style={{ borderTop: "1px solid rgba(214,211,205,0.3)", borderBottom: "1px solid rgba(214,211,205,0.3)" }}>
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => {
          if (item.type === "dot") {
            return <span key={`dot-${i}`} className="text-xs" style={{ color: "#D6D3CD" }}>•</span>;
          }
          if (item.type === "alert") {
            return (
              <span key={`alert-${i}`} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#B86B5E" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#B86B5E" }} />
                {item.text}
              </span>
            );
          }
          return (
            <span key={`dept-${i}-${item.text}`} className="inline-flex items-center gap-2 text-[11px]" style={{ color: "#6B7280" }}>
              <span className="font-semibold" style={{ color: "#1F2937" }}>{item.text}</span>
              <span className="font-bold" style={{ color: "#4C6A92" }}>{item.value}</span>
            </span>
          );
        })}
      </motion.div>
      <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none" style={{ background: "linear-gradient(90deg, #ECE9E1, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none" style={{ background: "linear-gradient(270deg, #ECE9E1, transparent)" }} />
    </div>
  );
}
