import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as topojson from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import Header from "../components/Header";
import AtmosphericBackground from "../components/AtmosphericBackground";
import DepartmentSearch from "../components/DepartmentSearch";
import Footer from "../components/Footer";
import { MOCK_CLIMATE } from "../data/mockData";
import { findDepartment } from "../utils/departmentLookup";
import { useDarkMode } from "../context/DarkModeContext";

const TOPOJSON_URL = "/Colombia_departamentos_municipios_poblacion-topov2.json";
const CACHE_KEY = "atlas-topo-v2";
const MAP_WIDTH = 800;
const MAP_HEIGHT = 1000;
const DEFAULT_VIEWBOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;
const OCEAN = "#243447";

const MOCK_WEEKLY_TEMP = {
  atlantico: [33.1, 33.8, 34.5, 34.2, 33.9, 34.8, 34.2],
  bolivar: [32.5, 33.2, 34.0, 33.8, 33.1, 34.2, 33.8],
  antioquia: [27.8, 28.2, 29.1, 28.5, 27.9, 28.8, 28.5],
  cundinamarca: [18.5, 19.0, 19.8, 19.2, 18.7, 19.5, 19.2],
  magdalena: [34.2, 35.0, 35.8, 35.1, 34.5, 35.5, 35.1],
  cesar: [35.0, 36.2, 37.0, 36.5, 35.8, 36.8, 36.5],
  santander: [29.5, 30.0, 30.8, 30.2, 29.8, 30.5, 30.2],
  valle: [30.2, 30.8, 31.5, 31.0, 30.5, 31.2, 31.0],
};

const MOCK_DROUGHT_INDEX = {
  atlantico: { actual: 0.35, promedio: 0.42 },
  bolivar: { actual: 0.38, promedio: 0.45 },
  antioquia: { actual: 0.22, promedio: 0.30 },
  cundinamarca: { actual: 0.18, promedio: 0.28 },
  magdalena: { actual: 0.55, promedio: 0.40 },
  cesar: { actual: 0.62, promedio: 0.38 },
  santander: { actual: 0.28, promedio: 0.32 },
  valle: { actual: 0.25, promedio: 0.33 },
};

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data && Date.now() - parsed.ts < 3600000) return parsed.data;
    sessionStorage.removeItem(CACHE_KEY);
  } catch { sessionStorage.removeItem(CACHE_KEY); }
  return null;
}

function writeCache(data) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch (e) { void e; }
}

function getHeatColor(temp) {
  if (temp === null || temp === undefined) return "#4a5568";
  if (temp < 18) return "#3B82F6";
  if (temp < 22) return "#22D3EE";
  if (temp < 26) return "#34D399";
  if (temp < 30) return "#FBBF24";
  if (temp < 34) return "#F97316";
  return "#EF4444";
}

function getHeatLabel(temp) {
  if (temp === null || temp === undefined) return "Sin datos";
  if (temp < 18) return "Frío";
  if (temp < 22) return "Templado";
  if (temp < 26) return "Clima agradable";
  if (temp < 30) return "Cálido";
  if (temp < 34) return "Muy cálido";
  return "Extremo";
}

function BarChart({ data, maxVal, color, label, unit }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>{label}</p>
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] w-20 truncate text-right" style={{ color: "#6B7280" }}>{item.label}</span>
          <div className="flex-1 h-5 rounded overflow-hidden" style={{ backgroundColor: "rgba(107,114,128,0.08)" }}>
            <motion.div
              className="h-full rounded flex items-center justify-end pr-1.5"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((item.value / maxVal) * 100, 100)}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[9px] font-bold text-white">{item.value}{unit}</span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TemperatureTrend({ deptId }) {
  const temps = MOCK_WEEKLY_TEMP[deptId] || [];
  if (temps.length === 0) return null;
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const range = maxT - minT || 1;
  const w = 280;
  const h = 80;
  const pts = temps.map((t, i) => {
    const x = (i / (temps.length - 1)) * w;
    const y = h - ((t - minT) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const areaPts = `0,${h} ${pts} ${w},${h}`;

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(107,114,128,0.04)", border: "1px solid rgba(214,211,205,0.35)" }}>
      <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: "#6B7280" }}>Tendencia 7 días</span>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 80 }}>
        <defs>
          <linearGradient id={`trend-${deptId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPts} fill={`url(#trend-${deptId})`} />
        <polyline points={pts} fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {temps.map((t, i) => {
          const x = (i / (temps.length - 1)) * w;
          const y = h - ((t - minT) / range) * h;
          return <circle key={i} cx={x} cy={y} r="3" fill="#F97316" />;
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {days.map((d, i) => (
          <span key={i} className="text-[8px]" style={{ color: "#6B7280" }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function DroughtComparison({ deptId }) {
  const d = MOCK_DROUGHT_INDEX[deptId];
  if (!d) return null;
  const natAvg = 0.35;
  const deptPct = Math.round(d.actual * 100);
  const avgPct = Math.round(d.promedio * 100);
  const natPct = Math.round(natAvg * 100);
  const diff = deptPct - avgPct;

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(107,114,128,0.04)", border: "1px solid rgba(214,211,205,0.35)" }}>
      <span className="text-[10px] uppercase tracking-wider block mb-3" style={{ color: "#6B7280" }}>Sequía vs Promedio</span>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "#1F2937" }}>Departamento</span>
          <span className="text-xs font-bold" style={{ color: deptPct > 50 ? "#B86B5E" : "#6F8F72" }}>{deptPct}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(107,114,128,0.1)" }}>
          <div className="h-full rounded-full" style={{ width: `${deptPct}%`, backgroundColor: deptPct > 50 ? "#B86B5E" : "#6F8F72" }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "#1F2937" }}>Promedio regional</span>
          <span className="text-xs font-bold" style={{ color: "#6B7280" }}>{avgPct}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "#1F2937" }}>Promedio nacional</span>
          <span className="text-xs font-bold" style={{ color: "#6B7280" }}>{natPct}%</span>
        </div>
      </div>
      <div className="mt-3 pt-2" style={{ borderTop: "1px solid rgba(214,211,205,0.3)" }}>
        <span className="text-[10px] font-bold" style={{ color: diff > 0 ? "#B86B5E" : "#6F8F72" }}>
          {diff > 0 ? `+${diff}%` : `${diff}%`} vs promedio regional
        </span>
      </div>
    </div>
  );
}

function exportCSV(deptName, climate) {
  if (!climate) return;
  const headers = ["Departamento", "Temperatura (°C)", "Humedad (%)", "Índice Calor (°C)", "Nivel Río (m)", "Alerta Incendio", "Estación"];
  const row = [deptName, climate.temperatura, climate.humedadRelativa, climate.indiceCalor, climate.nivelRio, climate.alertaIncendio ? "Sí" : "No", climate.estacion];
  const csv = [headers.join(","), row.join(",")].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `clima-${deptName.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function shareDept(deptId) {
  const url = `${window.location.origin}/clima?dept=${deptId}`;
  navigator.clipboard.writeText(url).catch(() => {});
}

export default function Clima() {
  const [topoData, setTopoData] = useState(() => readCache());
  const [loadError, setLoadError] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [compareDept, setCompareDept] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [fetchAttempt, setFetchAttempt] = useState(0);
  const { dark } = useDarkMode();

  useEffect(() => {
    let cancelled = false;
    if (topoData) return () => { cancelled = true; };
    fetch(TOPOJSON_URL)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => { if (!cancelled) { writeCache(data); setTopoData(data); } })
      .catch((err) => { if (!cancelled) { console.error("Error cargando mapa:", err); setLoadError("No se pudo cargar el mapa."); } });
    return () => { cancelled = true; };
  }, [fetchAttempt]);

  const departments = useMemo(() => {
    if (!topoData) return [];
    try {
      const geojson = topojson.feature(topoData, topoData.objects.MGN_ANM_DPTOS);
      const projection = geoMercator().fitSize([MAP_WIDTH, MAP_HEIGHT], geojson);
      const pathGenerator = geoPath().projection(projection);
      return geojson.features.map((feature) => {
        const deptInfo = findDepartment(feature.properties.DPTO_CNMBR);
        const climate = deptInfo ? MOCK_CLIMATE[deptInfo.id] : null;
        return { ...feature, path: pathGenerator(feature), centroid: pathGenerator.centroid(feature), climate, deptInfo };
      });
    } catch (error) { console.error("Error procesando TopoJSON:", error); return []; }
  }, [topoData]);

  const hoveredData = useMemo(() => {
    if (!hoveredDept) return null;
    return departments.find((d) => d.properties.DPTO_CNMBR === hoveredDept) || null;
  }, [hoveredDept, departments]);

  const handleSearchSelect = useCallback((id) => {
    const dept = departments.find((d) => findDepartment(d.properties.DPTO_CNMBR)?.id === id);
    if (dept) setSelectedDept(dept.properties.DPTO_CNMBR);
  }, [departments]);

  const handleCompareSelect = useCallback((id) => {
    const dept = departments.find((d) => findDepartment(d.properties.DPTO_CNMBR)?.id === id);
    if (dept) setCompareDept(dept.properties.DPTO_CNMBR);
  }, [departments]);

  const selectedData = selectedDept ? departments.find((d) => d.properties.DPTO_CNMBR === selectedDept) : null;
  const compareData = compareDept ? departments.find((d) => d.properties.DPTO_CNMBR === compareDept) : null;

  const chartData = useMemo(() => {
    const withClimate = departments.filter((d) => d.climate);
    return {
      temp: withClimate.map((d) => ({ label: d.deptInfo?.name || d.properties.DPTO_CNMBR, value: d.climate.temperatura })).sort((a, b) => b.value - a.value).slice(0, 8),
      hum: withClimate.map((d) => ({ label: d.deptInfo?.name || d.properties.DPTO_CNMBR, value: d.climate.humedadRelativa })).sort((a, b) => b.value - a.value).slice(0, 8),
      fire: withClimate.filter((d) => d.climate.alertaIncendio).map((d) => d.deptInfo?.name || d.properties.DPTO_CNMBR),
    };
  }, [departments]);

  const bgMain = dark ? "#0F141E" : "#ECE9E1";
  const textMain = dark ? "#F8F6F1" : "#1F2937";
  const muted = dark ? "rgba(255,255,255,0.5)" : "#6B7280";

  if (loadError) {
    return (
      <div className="relative min-h-screen font-sans" style={{ backgroundColor: bgMain }}>
        <AtmosphericBackground /><Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-sm gap-4" style={{ color: muted }}>
          <p>{loadError}</p>
          <button onClick={() => { setLoadError(null); setTopoData(null); setFetchAttempt((n) => n + 1); }}
            className="px-4 py-2 text-white rounded-lg text-sm font-bold" style={{ backgroundColor: "#4C6A92" }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!topoData) {
    return (
      <div className="relative min-h-screen font-sans" style={{ backgroundColor: bgMain }}>
        <AtmosphericBackground /><Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(76,106,146,0.2)", borderTopColor: "#4C6A92" }} />
          <p className="text-sm" style={{ color: muted }}>Cargando mapa…</p>
        </div>
      </div>
    );
  }

  const hasSelection = selectedDept !== null;
  const hasCompare = compareMode && compareDept !== null;

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden flex flex-col" style={{ backgroundColor: bgMain, color: textMain }}>
      <AtmosphericBackground />
      <Header />

      <main className="relative pt-20 pb-20 flex-1">
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 mb-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: "#6F8F72" }}>
              Alertas Climáticas
            </p>
            <h1 className="font-display text-3xl font-black sm:text-4xl tracking-tight" style={{ color: textMain }}>
              Mapa de Calor
            </h1>
            <p className="mt-2 text-sm max-w-2xl" style={{ color: muted }}>
              Temperatura superficial por departamento. Colores de azul (frío) a rojo (extremo). Haga click para ver detalles.
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <DepartmentSearch onSelect={handleSearchSelect} selectedId={selectedData?.deptInfo?.id} accentColor="#6F8F72" />
            {hasSelection && (
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => { setCompareMode(!compareMode); if (compareMode) setCompareDept(null); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: compareMode ? "rgba(111,143,114,0.15)" : "rgba(107,114,128,0.06)",
                    color: compareMode ? "#5A7A5D" : "#6B7280",
                    border: `1px solid ${compareMode ? "rgba(111,143,114,0.3)" : "rgba(214,211,205,0.3)"}`,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  {compareMode ? "Modo Comparación Activo" : "Comparar"}
                </button>
                {selectedData?.climate && (
                  <>
                    <button
                      onClick={() => exportCSV(selectedData.deptInfo?.name || selectedDept, selectedData.climate)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200 hover:scale-[1.02]"
                      style={{ backgroundColor: "rgba(111,143,114,0.1)", color: "#5A7A5D", border: "1px solid rgba(111,143,114,0.2)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      CSV
                    </button>
                    <button
                      onClick={() => shareDept(selectedData.deptInfo?.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200 hover:scale-[1.02]"
                      style={{ backgroundColor: "rgba(76,106,146,0.08)", color: "#4C6A92", border: "1px solid rgba(76,106,146,0.15)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      Compartir
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <section className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className={`relative grid gap-10 transition-all duration-700 ease-in-out ${hasSelection ? (hasCompare ? "lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.5fr)_minmax(320px,0.5fr)]" : "lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.6fr)]") : "lg:grid-cols-1"}`}>
            <div className="relative w-full rounded-xl overflow-hidden" style={{ backgroundColor: OCEAN, boxShadow: "0 25px 60px rgba(31,41,55,0.3), 0 8px 24px rgba(31,41,55,0.2), inset 0 1px 0 rgba(255,255,255,0.05)", perspective: "1200px" }}>
              <div className="relative flex justify-center items-center min-h-[450px] sm:min-h-[650px] px-4 py-6 sm:px-8 sm:py-10" style={{ transform: "rotateX(0deg) rotateY(0deg)", transformOrigin: "center center" }}>
                <svg viewBox={DEFAULT_VIEWBOX} className="w-full h-auto max-h-[800px]" style={{ overflow: "visible" }} role="img" aria-label="Mapa de calor de Colombia">
                  <g aria-hidden="true">
                    {Array.from({ length: 12 }, (_, i) => {
                      const t = i / 11;
                      const r = Math.round(180 - t * 50);
                      const g = Math.round(176 - t * 48);
                      const b = Math.round(168 - t * 44);
                      return (
                        <g key={`block-${i}`} transform={`translate(0, ${i * 0.8 + 1})`}>
                          {departments.map((d) => (
                            <path key={`edge-${d.properties.DPTO_CNMBR}-${i}`} d={d.path} fill={`rgb(${r},${g},${b})`} stroke={`rgb(${r},${g},${b})`} strokeWidth="0.15" />
                          ))}
                        </g>
                      );
                    })}
                  </g>
                  <g>
                    {departments.map((dept) => {
                      const name = dept.properties.DPTO_CNMBR;
                      const temp = dept.climate?.temperatura;
                      const isHovered = hoveredDept === name;
                      const isSelected = selectedDept === name;
                      const isCompare = compareDept === name;
                      return (
                        <path key={name} d={dept.path} fill={getHeatColor(temp)}
                          fillOpacity={isSelected ? 1 : isHovered ? 0.9 : isCompare ? 0.85 : 0.75}
                          stroke={isSelected ? "#FFFFFF" : isCompare ? "#C9A66B" : isHovered ? "#00D4FF" : "rgba(255,255,255,0.15)"}
                          strokeWidth={isSelected ? 2 : isCompare ? 1.8 : isHovered ? 1.5 : 0.4}
                          strokeLinejoin="round"
                          style={{ cursor: "pointer", transition: "fill-opacity 0.15s, stroke 0.15s, stroke-width 0.15s" }}
                          onMouseEnter={() => setHoveredDept(name)}
                          onMouseLeave={() => setHoveredDept(null)}
                          onClick={() => setSelectedDept(isSelected ? null : name)}
                        />
                      );
                    })}
                  </g>
                </svg>

                <AnimatePresence>
                  {hoveredDept && hoveredData && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none px-5 py-3 rounded-xl shadow-xl z-10"
                      style={{ backgroundColor: "rgba(31,41,55,0.92)", backdropFilter: "blur(8px)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getHeatColor(hoveredData.climate?.temperatura) }} />
                        <div>
                          <span className="text-white font-semibold text-xs tracking-widest uppercase block">{hoveredData.deptInfo?.name || hoveredDept}</span>
                          {hoveredData.climate && (
                            <span className="text-[10px] mt-0.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>
                              {hoveredData.climate.temperatura}°C — {getHeatLabel(hoveredData.climate.temperatura)}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 rounded-lg p-3 z-10" style={{ backgroundColor: "rgba(31,41,55,0.85)", backdropFilter: "blur(8px)" }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Temperatura</p>
                <div className="flex flex-col gap-1">
                  {[{ color: "#EF4444", label: "> 34°C Extremo" }, { color: "#F97316", label: "30-34°C Muy cálido" }, { color: "#FBBF24", label: "26-30°C Cálido" },
                    { color: "#34D399", label: "22-26°C Agradable" }, { color: "#22D3EE", label: "18-22°C Templado" }, { color: "#3B82F6", label: "< 18°C Frío" }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {chartData.fire.length > 0 && (
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-lg px-3 py-2 z-10 flex items-center gap-2" style={{ backgroundColor: "rgba(184,107,94,0.9)", backdropFilter: "blur(8px)" }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "white" }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "white" }} />
                  </span>
                  <span className="text-[10px] font-bold text-white">{chartData.fire.length} ALERTA{chartData.fire.length > 1 ? "S" : ""} INCENDIO</span>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {hasSelection && selectedData && (
                <motion.div key={selectedDept} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }} className="lg:sticky lg:top-28">
                  <ClimatePanel data={selectedData} onClose={() => { setSelectedDept(null); setCompareDept(null); setCompareMode(false); }} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {hasCompare && compareData && (
                <motion.div key={compareDept} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:sticky lg:top-28">
                  <div className="mb-3">
                    <DepartmentSearch onSelect={handleCompareSelect} selectedId={compareData?.deptInfo?.id} accentColor="#B86B5E" />
                  </div>
                  <ClimatePanel data={compareData} onClose={() => setCompareDept(null)} accentColor="#B86B5E" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!hasSelection && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 rounded-xl p-6 sm:p-8" style={{ backgroundColor: "rgba(248,246,241,0.85)", border: "1px solid rgba(214,211,205,0.5)", backdropFilter: "blur(20px)" }}>
              <h3 className="font-display text-lg font-bold mb-6" style={{ color: textMain }}>Resumen Nacional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BarChart data={chartData.temp} maxVal={40} color="#F97316" label="Top Temperaturas" unit="°C" />
                <BarChart data={chartData.hum} maxVal={100} color="#5E81AC" label="Top Humedad" unit="%" />
              </div>
              {chartData.fire.length > 0 && (
                <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(214,211,205,0.3)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#B86B5E" }}>Alertas de Incendio Activas</p>
                  <div className="flex flex-wrap gap-2">
                    {chartData.fire.map((name) => (
                      <span key={name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: "rgba(184,107,94,0.08)", color: "#B86B5E", border: "1px solid rgba(184,107,94,0.2)" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#B86B5E" }} />
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ClimatePanel({ data, onClose }) {
  if (!data?.climate) return null;
  const c = data.climate;
  const deptId = data.deptInfo?.id;
  const isDark = document.documentElement.classList.contains("dark");

  const riskAlerts = [];
  if (c.alertaIncendio) riskAlerts.push({ label: "Incendio forestal", color: "#B86B5E" });
  if (c.indiceCalor > 40) riskAlerts.push({ label: "Calor extremo", color: "#F97316" });
  if (c.nivelRio > 4) riskAlerts.push({ label: "Nivel del río alto", color: "#5E81AC" });

  return (
    <div className="rounded-xl overflow-hidden" style={{
      backgroundColor: isDark ? "rgba(15,20,30,0.85)" : "rgba(248,246,241,0.85)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(214,211,205,0.5)"}`,
      backdropFilter: "blur(20px)",
      boxShadow: "0 16px 48px rgba(31,41,55,0.1)",
    }}>
      <div className="relative overflow-hidden px-8 py-6" style={{ backgroundColor: "#1F2937" }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 20%, ${getHeatColor(c.temperatura)}33, transparent 60%)` }} />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">{data.deptInfo?.name || data.properties?.DPTO_CNMBR}</h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Capital: {data.deptInfo?.capital}</p>
          </div>
          <button onClick={onClose} className="ml-4 p-2.5 rounded-lg text-white transition-all duration-200 hover:scale-110" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Temperatura", value: `${c.temperatura}°C`, color: getHeatColor(c.temperatura) },
            { label: "Humedad", value: `${c.humedadRelativa}%`, color: "#5E81AC" },
            { label: "Calor", value: `${c.indiceCalor}°C`, color: c.indiceCalor > 40 ? "#B86B5E" : "#C9A66B" },
            { label: "Río", value: `${c.nivelRio}m`, color: "#5E81AC" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-4" style={{ backgroundColor: "rgba(107,114,128,0.04)", border: "1px solid rgba(214,211,205,0.35)" }}>
              <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: "#6B7280" }}>{item.label}</span>
              <span className="font-display text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

        {deptId && <TemperatureTrend deptId={deptId} />}
        {deptId && <div className="mt-3"><DroughtComparison deptId={deptId} /></div>}

        {riskAlerts.length > 0 && (
          <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: "rgba(184,107,94,0.04)", border: "1px solid rgba(184,107,94,0.15)" }}>
            <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: "#B86B5E" }}>Alertas de Riesgo</span>
            <div className="flex flex-wrap gap-2">
              {riskAlerts.map((alert, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ backgroundColor: `${alert.color}11`, color: alert.color, border: `1px solid ${alert.color}33` }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: alert.color }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: alert.color }} />
                  </span>
                  {alert.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] mt-4 text-center" style={{ color: "#6B7280" }}>Estación: {c.estacion}</p>
      </div>
    </div>
  );
}
