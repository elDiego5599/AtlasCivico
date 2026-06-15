import { motion } from "framer-motion";
import { MOCK_CONTRACTS, MOCK_CLIMATE, formatCurrency } from "../data/mockData";

const CIVIC_BLUE = "#4C6A92";
const ATLANTIC_BLUE = "#5E81AC";
const SAGE = "#6F8F72";
const CLAY_RED = "#B86B5E";

function MiniBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: "rgba(107,114,128,0.1)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function DetailPanel({ department, onClose, filteredContracts }) {
  if (!department) return null;

  const contracts = filteredContracts || MOCK_CONTRACTS[department.id] || [];
  const climate = MOCK_CLIMATE[department.id] || null;

  function getEstadoBadge(estado) {
    if (estado === "En ejecucion") {
      return {
        style: { backgroundColor: "rgba(111, 143, 114, 0.1)", border: "1px solid rgba(111, 143, 114, 0.25)" },
        color: "#5A7A5D",
        dot: "#6F8F72",
      };
    }
    if (estado === "Celebrado") {
      return {
        style: { backgroundColor: "rgba(201, 166, 107, 0.1)", border: "1px solid rgba(201, 166, 107, 0.25)" },
        color: "#8B7355",
        dot: "#C9A66B",
      };
    }
    return {
      style: { backgroundColor: "rgba(107, 114, 128, 0.06)", border: "1px solid rgba(107, 114, 128, 0.15)" },
      color: "#6B7280",
      dot: "#9CA3AF",
    };
  }

  return (
    <motion.section
      key={department.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden rounded-xl"
      style={{
        backgroundColor: "rgba(248, 246, 241, 0.85)",
        border: "1px solid rgba(214, 211, 205, 0.5)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 16px 48px rgba(31, 41, 55, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
      }}
      aria-label={`Datos detallados del departamento de ${department.name}`}
    >
      <div className="relative overflow-hidden px-8 py-6" style={{ backgroundColor: "#1F2937" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(135deg, rgba(76,106,146,0.3), rgba(176,137,104,0.15), rgba(76,106,146,0.3))",
            backgroundSize: "200% 200%",
          }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(76,106,146,0.2), transparent 60%)" }} />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              {department.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              Capital: {department.capital}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative p-2 rounded-lg text-white transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"}
            aria-label="Cerrar panel de datos"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(76, 106, 146, 0.08)", border: "1px solid rgba(76, 106, 146, 0.15)", color: CIVIC_BLUE }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: "#1F2937" }}>
                Contratación Pública
              </h3>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Fuente: SECOP II - datos.gov.co
              </p>
            </div>
          </div>

          {contracts.length > 0 ? (
            <div className="space-y-4">
              {contracts.map((contract, idx) => {
                const badge = getEstadoBadge(contract.estado);
                return (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="rounded-xl p-5 transition-all duration-300 hover:shadow-md group"
                    style={{
                      backgroundColor: "#F8F6F1",
                      border: "1px solid rgba(214, 211, 205, 0.5)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold mb-1 leading-relaxed" style={{ color: "#1F2937" }}>
                          {contract.objetoSimplificado}
                        </p>
                        <p className="text-xs" style={{ color: "#6B7280" }}>
                          {contract.id}
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                        style={badge.style}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />
                        <span style={{ color: badge.color }}>{contract.estado}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: "#6B7280" }}>Entidad</span>
                        <span className="font-medium text-xs" style={{ color: "#1F2937" }}>{contract.entidad}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: "#6B7280" }}>Contratista</span>
                        <span className="font-medium text-xs" style={{ color: "#1F2937" }}>{contract.contratista}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: "#6B7280" }}>Valor</span>
                        <span className="font-bold text-sm" style={{ color: CIVIC_BLUE }}>{formatCurrency(contract.valor)}</span>
                      </div>
                      {contract.fechaFirma && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider block mb-0.5" style={{ color: "#6B7280" }}>Firma</span>
                          <span className="font-medium text-xs" style={{ color: "#1F2937" }}>
                            {new Date(contract.fechaFirma + "T12:00:00").toLocaleDateString("es-CO")}
                          </span>
                        </div>
                      )}
                    </div>
                    {contract.urlSecop && (
                      <div className="mt-3">
                        <a
                          href={contract.urlSecop}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 hover:gap-2.5"
                          style={{ color: ATLANTIC_BLUE }}
                        >
                          Ver en SECOP II
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M7 17 17 7" /><path d="M7 7h10v10" />
                          </svg>
                        </a>
                      </div>
                    )}
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(214, 211, 205, 0.3)" }}>
                      <details className="group">
                        <summary className="text-xs cursor-pointer transition-colors font-bold hover:underline" style={{ color: ATLANTIC_BLUE }}>
                          Ver descripción original del contrato
                        </summary>
                        <p className="mt-2 text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                          {contract.objetoOriginal}
                        </p>
                      </details>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 rounded-xl" style={{ color: "#6B7280", backgroundColor: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(214, 211, 205, 0.35)" }}>
              <p className="text-sm">No hay datos de contratación disponibles para este departamento.</p>
            </div>
          )}
        </div>

        {climate && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(111, 143, 114, 0.08)", border: "1px solid rgba(111, 143, 114, 0.15)", color: SAGE }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: "#1F2937" }}>
                  Condiciones Climáticas
                </h3>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Estación: {climate.estacion}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(214, 211, 205, 0.35)" }}>
                <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "#6B7280" }}>Temperatura</span>
                <span className="font-display text-xl font-bold" style={{ color: "#1F2937" }}>
                  {climate.temperatura}<span className="text-xs font-normal" style={{ color: "#6B7280" }}>{"\u00B0"}C</span>
                </span>
                <MiniBar value={climate.temperatura} max={45} color={climate.temperatura > 35 ? CLAY_RED : CIVIC_BLUE} />
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(214, 211, 205, 0.35)" }}>
                <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "#6B7280" }}>Humedad</span>
                <span className="font-display text-xl font-bold" style={{ color: "#1F2937" }}>
                  {climate.humedadRelativa}<span className="text-xs font-normal" style={{ color: "#6B7280" }}>%</span>
                </span>
                <MiniBar value={climate.humedadRelativa} max={100} color={ATLANTIC_BLUE} />
              </div>

              <div className="rounded-xl p-4" style={{
                backgroundColor: climate.indiceCalor > 40 ? "rgba(184, 107, 94, 0.06)" : "rgba(107, 114, 128, 0.04)",
                border: `1px solid ${climate.indiceCalor > 40 ? "rgba(184, 107, 94, 0.2)" : "rgba(214, 211, 205, 0.35)"}`
              }}>
                <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "#6B7280" }}>Calor</span>
                <span className="font-display text-xl font-bold" style={{ color: climate.indiceCalor > 40 ? CLAY_RED : "#1F2937" }}>
                  {climate.indiceCalor}<span className="text-xs font-normal" style={{ color: "#6B7280" }}>{"\u00B0"}C</span>
                </span>
                <MiniBar value={climate.indiceCalor} max={50} color={climate.indiceCalor > 40 ? CLAY_RED : "#C9A66B"} />
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(214, 211, 205, 0.35)" }}>
                <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "#6B7280" }}>Río</span>
                <span className="font-display text-xl font-bold" style={{ color: "#1F2937" }}>
                  {climate.nivelRio}<span className="text-xs font-normal" style={{ color: "#6B7280" }}>m</span>
                </span>
                <MiniBar value={climate.nivelRio} max={10} color={ATLANTIC_BLUE} />
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl p-4 flex flex-col items-center justify-center text-center" style={{
                backgroundColor: climate.alertaIncendio ? "rgba(184, 107, 94, 0.06)" : "rgba(111, 143, 114, 0.06)",
                border: `1px solid ${climate.alertaIncendio ? "rgba(184, 107, 94, 0.2)" : "rgba(111, 143, 114, 0.2)"}`
              }}>
                <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "#6B7280" }}>Incendio</span>
                <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold" style={{ color: climate.alertaIncendio ? CLAY_RED : SAGE }}>
                  {climate.alertaIncendio && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: CLAY_RED }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: CLAY_RED }} />
                    </span>
                  )}
                  {climate.alertaIncendio ? "ACTIVA" : "Inactiva"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default DetailPanel;
