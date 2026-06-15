import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import Sparkline from "./Sparkline";

function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView || !inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, startOnView]);

  return { count, ref };
}

export function AnimatedCounter({ value, prefix = "", suffix = "", duration = 2000, className = "" }) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
  const { count, ref } = useCountUp(numericValue, duration);

  let display;
  if (prefix === "$" && count >= 1e9) {
    display = `$${(count / 1e9).toFixed(1)} MM`;
  } else if (prefix === "$" && count >= 1e6) {
    display = `$${(count / 1e6).toFixed(0)}M`;
  } else {
    display = `${prefix}${count.toLocaleString("es-CO")}${suffix}`;
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

export function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function StatCard({ stat }) {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className="relative rounded-xl p-5 text-center overflow-hidden group"
      style={{
        backgroundColor: "rgba(248,246,241,0.7)",
        border: "1px solid rgba(214,211,205,0.45)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(31,41,55,0.04)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 80%, ${stat.color}08, transparent 70%)` }}
      />
      <div className="relative">
        <div className="w-8 h-8 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${stat.color}10`, border: `1px solid ${stat.color}20` }}>
          <span style={{ color: stat.color }}>{stat.icon}</span>
        </div>
        <p className="font-display text-xl sm:text-2xl font-black tracking-tight" style={{ color: stat.color }}>
          <AnimatedCounter value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />
        </p>
        {stat.sparkline && (
          <div className="flex justify-center mt-2">
            <Sparkline data={stat.sparkline} color={stat.color} height={28} width={72} />
          </div>
        )}
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mt-1.5" style={{ color: "#6B7280" }}>
          {stat.label}
        </p>
      </div>
    </div>
  );
}
