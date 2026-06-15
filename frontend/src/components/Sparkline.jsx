import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Sparkline({ data, color = "#4C6A92", height = 32, width = 80 }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((o) => (o + 1) % data.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [data.length]);

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const shifted = [...data.slice(offset), ...data.slice(0, offset)];

  const points = shifted.map((val, i) => {
    const x = padding + (i / (shifted.length - 1)) * (width - padding * 2);
    const y = padding + ((max - val) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M${points.join(" L")}`;
  const areaD = `${pathD} L${width - padding},${height} L${padding},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-grad-${color.replace("#", "")}-${offset}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        key={`area-${offset}`}
        d={areaD}
        fill={`url(#spark-grad-${color.replace("#", "")}-${offset})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        key={`line-${offset}`}
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        key={`dot-${offset}`}
        cx={width - padding}
        cy={padding + ((max - shifted[shifted.length - 1]) / range) * (height - padding * 2)}
        r="2.5"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ duration: 0.5 }}
      />
      <motion.circle
        key={`glow-${offset}`}
        cx={width - padding}
        cy={padding + ((max - shifted[shifted.length - 1]) / range) * (height - padding * 2)}
        r="5"
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </svg>
  );
}
