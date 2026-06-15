import { motion } from "framer-motion";

const colorMap = {
  blue: {
    iconBg: "rgba(76, 106, 146, 0.1)",
    iconBorder: "rgba(76, 106, 146, 0.2)",
    iconText: "#4C6A92",
    accent: "#4C6A92",
  },
  green: {
    iconBg: "rgba(111, 143, 114, 0.1)",
    iconBorder: "rgba(111, 143, 114, 0.2)",
    iconText: "#6F8F72",
    accent: "#6F8F72",
  },
  amber: {
    iconBg: "rgba(201, 166, 107, 0.1)",
    iconBorder: "rgba(201, 166, 107, 0.2)",
    iconText: "#C9A66B",
    accent: "#C9A66B",
  },
  red: {
    iconBg: "rgba(184, 107, 94, 0.1)",
    iconBorder: "rgba(184, 107, 94, 0.2)",
    iconText: "#B86B5E",
    accent: "#B86B5E",
  },
};

function KpiCard({ label, value, unit, icon, delay = 0, color = "blue" }) {
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group"
    >
      <div
        className="relative min-h-[140px] rounded-lg p-6 transition-all duration-300"
        style={{
          backgroundColor: "#F8F6F1",
          border: "1px solid rgba(214, 211, 205, 0.5)",
          boxShadow: "0 8px 32px rgba(31, 41, 55, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t overflow-hidden">
          <div className="h-full w-full" style={{ backgroundColor: c.accent, opacity: 0.8 }} />
        </div>

        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6B7280" }}>
            {label}
          </span>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: c.iconBg,
              border: `1px solid ${c.iconBorder}`,
              color: c.iconText,
            }}
          >
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold tracking-tight" style={{ color: "#1F2937" }}>
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold" style={{ color: "#6B7280" }}>{unit}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default KpiCard;
