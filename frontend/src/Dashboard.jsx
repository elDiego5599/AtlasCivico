import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import AtmosphericBackground from "./components/AtmosphericBackground";
import Footer from "./components/Footer";
import FloatingParticles from "./components/FloatingParticles";
import TopographicTexture from "./components/TopographicTexture";
import { StatsRow } from "./components/AnimatedStats";
import DataTicker from "./components/DataTicker";
import ScrollReveal from "./components/ScrollReveal";

const CIVIC_BLUE = "#4C6A92";
const ATLANTIC_BLUE = "#5E81AC";
const GRAPHITE = "#1F2937";
const SLATE = "#6B7280";
const SAGE = "#6F8F72";

const heroStats = [
  { value: 80280000000, prefix: "$", suffix: "", label: "Total Contratado", color: CIVIC_BLUE, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, sparkline: [42, 48, 45, 52, 58, 55, 62, 68, 65, 72, 78, 80] },
  { value: 14, prefix: "", suffix: "", label: "Contratos Activos", color: SAGE, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>, sparkline: [8, 9, 10, 11, 10, 12, 11, 13, 12, 14, 13, 14] },
  { value: 37.2, prefix: "", suffix: "°C", label: "Calor Promedio", color: "#B86B5E", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>, sparkline: [31, 32, 33, 34, 35, 34, 35, 36, 35, 36, 37, 37.2] },
  { value: 33, prefix: "", suffix: " deptos", label: "Cobertura Nacional", color: ATLANTIC_BLUE, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /></svg>, sparkline: [20, 22, 24, 26, 28, 27, 29, 30, 31, 32, 32, 33] },
];

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    wireframe: (
      <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="absolute bottom-2 right-2 w-24 h-16" style={{ opacity: 0.1 }}>
        <circle cx="60" cy="40" r="30" /><circle cx="60" cy="40" r="20" /><circle cx="60" cy="40" r="10" />
        <line x1="60" y1="5" x2="60" y2="75" /><line x1="25" y1="40" x2="95" y2="40" />
        <line x1="35" y1="15" x2="85" y2="65" /><line x1="85" y1="15" x2="35" y2="65" />
        <path d="M40 30 Q60 20 80 30" /><path d="M35 50 Q60 60 85 50" />
      </svg>
    ),
    title: "Mapa Interactivo",
    description: "Explore los 33 departamentos de Colombia. Haga click para ver contratación pública y condiciones climáticas en tiempo real.",
    to: "/veeduria",
    color: CIVIC_BLUE,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    wireframe: (
      <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="absolute bottom-2 right-2 w-24 h-16" style={{ opacity: 0.1 }}>
        <rect x="20" y="10" width="80" height="60" rx="3" />
        <line x1="30" y1="25" x2="90" y2="25" /><line x1="30" y1="35" x2="75" y2="35" />
        <line x1="30" y1="45" x2="85" y2="45" /><line x1="30" y1="55" x2="60" y2="55" />
        <circle cx="85" cy="58" r="8" /><path d="M82 58 L85 55 L88 58" />
        <line x1="30" y1="18" x2="55" y2="18" strokeWidth="0.8" />
      </svg>
    ),
    title: "Veeduría Ciudadana",
    description: "Monitoree contratos públicos del SECOP II. Filtre por estado, valor y entidad. Transparencia de datos abiertos.",
    to: "/veeduria",
    color: ATLANTIC_BLUE,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      </svg>
    ),
    wireframe: (
      <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="absolute bottom-2 right-2 w-24 h-16" style={{ opacity: 0.1 }}>
        <rect x="50" y="8" width="12" height="50" rx="6" />
        <circle cx="56" cy="52" r="10" />
        <path d="M56 42 L56 18" strokeWidth="1" />
        <path d="M30 20 Q40 15 50 25" /><path d="M62 25 Q72 15 82 20" />
        <path d="M25 40 Q38 35 50 42" /><path d="M62 42 Q75 35 88 40" />
        <line x1="20" y1="65" x2="100" y2="65" strokeDasharray="2 2" />
      </svg>
    ),
    title: "Alertas Climáticas",
    description: "Visualice temperaturas, niveles de río e índice de calor por departamento. Mapa de calor interactivo con alertas de incendio.",
    to: "/clima",
    color: SAGE,
  },
];

const howItWorks = [
  { step: "01", title: "Selecciona", desc: "Haz click en un departamento del mapa interactivo.", color: CIVIC_BLUE },
  { step: "02", title: "Explora", desc: "Revisa contratos públicos, valores y estados de ejecución.", color: ATLANTIC_BLUE },
  { step: "03", title: "Compara", desc: "Contrasta datos climáticos entre dos departamentos.", color: SAGE },
  { step: "04", title: "Comparte", desc: "Exporta CSV o comparte enlaces directos con ciudadanos.", color: "#B86B5E" },
];

export default function Dashboard() {
  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden flex flex-col" style={{ backgroundColor: "#ECE9E1", color: GRAPHITE }}>
      <AtmosphericBackground />
      <Header />

      <main className="relative flex-1">
        <img
          src="/pajaroizquierdo.svg"
          alt=""
          aria-hidden="true"
          className="absolute left-0 w-[220px] sm:w-[300px] md:w-[380px] lg:w-[460px] pointer-events-none select-none z-20"
          style={{ bottom: "5%", transform: "translateX(-10%)" }}
        />
        <img
          src="/colibriderecho.svg"
          alt=""
          aria-hidden="true"
          className="absolute right-0 w-[180px] sm:w-[250px] md:w-[320px] lg:w-[400px] pointer-events-none select-none z-20"
          style={{ top: "45%", transform: "translateX(12%)" }}
        />

        <section className="relative overflow-hidden" aria-label="Landing">
          <div className="relative" style={{ backgroundColor: GRAPHITE }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(31,41,55,0.98), rgba(31,41,55,0.85))" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(76,106,146,0.3), transparent 50%)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(176,137,104,0.15), transparent 40%)" }} />
            <div className="absolute inset-0 cinematic-noise opacity-[0.08]" />
            <TopographicTexture />
            <FloatingParticles count={20} color="#4C6A92" />

            <div className="relative max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-16 sm:pt-28 sm:pb-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-4xl text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8"
                  style={{ backgroundColor: "rgba(76, 106, 146, 0.15)", border: "1px solid rgba(76, 106, 146, 0.25)" }}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: "#6F8F72" }} />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: "#6F8F72" }} />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.55)" }}>
                    Monitoreo en tiempo real
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="font-display text-white uppercase leading-[0.88] tracking-tight mb-8"
                  style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                >
                  <span className="block" style={{ fontWeight: 200, letterSpacing: "0.06em" }}>Atlas</span>
                  <span className="block gradient-tide" style={{ fontWeight: 900 }}>Cívico</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35 }}
                  className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-10"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Monitoreo ciudadano de contratación pública y alertas ambientales
                  para <span className="font-bold" style={{ color: "white" }}>Colombia.</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Link
                    to="/veeduria"
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                    style={{ backgroundColor: CIVIC_BLUE }}
                  >
                    Explorar mapa
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </Link>
                  <Link
                    to="/clima"
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    Mapa de calor
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <DataTicker />

        <section className="relative max-w-5xl mx-auto px-6 md:px-10 py-16">
          <ScrollReveal>
            <StatsRow stats={heroStats} />
          </ScrollReveal>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 md:px-10 py-12">
          <ScrollReveal className="text-center mb-14 relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: CIVIC_BLUE }}>
              Funcionalidades
            </p>
            <h2 className="font-display text-3xl font-black sm:text-4xl tracking-tight" style={{ color: GRAPHITE }}>
              Datos que importan
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 relative z-30">
            {features.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 0.1}>
                <Link
                  to={feat.to}
                  className="block rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(248,246,241,0.72)",
                    border: "1px solid rgba(214,211,205,0.5)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {feat.wireframe}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 relative z-10"
                    style={{ backgroundColor: `${feat.color}12`, border: `1px solid ${feat.color}25`, color: feat.color }}
                  >
                    {feat.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2 tracking-tight relative z-10" style={{ color: GRAPHITE }}>
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed relative z-10" style={{ color: SLATE }}>
                    {feat.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 group-hover:gap-2.5 relative z-10" style={{ color: feat.color }}>
                    Explorar
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 md:px-10 py-16">
          <ScrollReveal className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: SAGE }}>
              Cómo funciona
            </p>
            <h2 className="font-display text-3xl font-black sm:text-4xl tracking-tight" style={{ color: GRAPHITE }}>
              Simple y transparente
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="relative rounded-xl p-6 text-center group" style={{ backgroundColor: "rgba(248,246,241,0.6)", border: "1px solid rgba(214,211,205,0.35)" }}>
                  <div
                    className="font-display text-4xl font-black mb-3 transition-colors duration-300 gradient-tide"
                    style={{ color: `${item.color}20` }}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-display text-base font-bold mb-1.5" style={{ color: GRAPHITE }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: SLATE }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
