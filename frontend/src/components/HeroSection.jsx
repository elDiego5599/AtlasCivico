import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CIVIC_BLUE = "#4C6A92";
const GRAPHITE = "#1F2937";
const SLATE = "#6B7280";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedNumber({ value, duration = 1.5, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const numVal = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
    function tick(now) {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(numVal * eased * 10) / 10);
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <>{prefix}{typeof value === "number" && value % 1 !== 0 ? display.toFixed(1) : Math.round(display)}{suffix}</>;
}

function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-16" aria-label="Seccion principal" style={{ backgroundColor: "#ECE9E1" }}>
      <div className="relative" style={{ backgroundColor: GRAPHITE }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(31,41,55,0.98), rgba(31,41,55,0.85))" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(76,106,146,0.3), transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(176,137,104,0.15), transparent 40%)" }} />
        <div className="absolute inset-0 cinematic-noise opacity-[0.08]" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="mx-auto max-w-4xl text-center mb-10 sm:mb-14"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
              style={{ backgroundColor: "rgba(76, 106, 146, 0.15)", border: "1px solid rgba(76, 106, 146, 0.25)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(255,255,255,0.6)" }} aria-hidden="true">
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.55)" }}>
                Transparencia y datos abiertos
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-white uppercase leading-[0.88] tracking-tight mb-8"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              <span className="block" style={{ fontWeight: 200, letterSpacing: "0.06em" }}>Atlas</span>
              <span className="block gradient-text" style={{ fontWeight: 900 }}>Cívico</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Monitoreo ciudadano de contratación pública y alertas ambientales
              para <span className="font-bold" style={{ color: "white" }}>Colombia.</span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center items-center gap-6 sm:gap-0"
          >
            <div className="text-center px-6 sm:px-10">
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: "white" }}>
                $<AnimatedNumber value={80.3} duration={1.8} /> MM
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Total Contratado
              </div>
            </div>
            <div className="hidden sm:block w-px h-12" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
            <div className="text-center px-6 sm:px-10">
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: "white" }}>
                <AnimatedNumber value={14} duration={1.4} />
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Contratos Activos
              </div>
            </div>
            <div className="hidden sm:block w-px h-12" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
            <div className="text-center px-6 sm:px-10">
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: "white" }}>
                <AnimatedNumber value={37.2} duration={1.6} />{"\u00B0"}
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Calor Promedio
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 max-w-3xl"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: CIVIC_BLUE }}>
            Mapa nacional
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl tracking-tight" style={{ color: GRAPHITE }}>
            Consulta por departamento
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: SLATE }}>
            Seleccione una región para revisar contratación pública, condiciones climáticas y señales de seguimiento ciudadano.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
