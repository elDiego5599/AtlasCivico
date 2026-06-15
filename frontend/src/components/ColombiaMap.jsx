import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as topojson from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import { findDepartment } from "../utils/departmentLookup";
import { DEPARTMENTS } from "../data/departments";

const TOPOJSON_URL = "/Colombia_departamentos_municipios_poblacion-topov2.json";
const MAP_WIDTH = 800;
const MAP_HEIGHT = 1000;
const DEFAULT_VIEWBOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;
const CACHE_KEY = "atlas-topo-v2";
const OCEAN = "#243447";
const LAND = "#F4F2ED";
const LAND_HOVER = "#FFFFFF";
const LAND_SELECTED = "#3D5A80";
const BORDER = "#C8C5BD";
const BORDER_HOVER = "#00D4FF";
const BORDER_SELECTED = "#4C6A92";
const BLOCK_LAYERS = 12;

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
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function ColombiaMap({ onSelect, onReset }) {
  const [topoData, setTopoData] = useState(() => readCache());
  const [loadError, setLoadError] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [fetchAttempt, setFetchAttempt] = useState(0);
  const [sanAndresBBox, setSanAndresBBox] = useState(null);
  const sanAndresPathRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (topoData) return () => { cancelled = true; };
    fetch(TOPOJSON_URL)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => { if (!cancelled) { writeCache(data); setTopoData(data); } })
      .catch((err) => { if (!cancelled) { console.error("Error cargando mapa:", err); setLoadError("No se pudo cargar el mapa de Colombia."); } });
    return () => { cancelled = true; };
  }, [fetchAttempt]);

  const departments = useMemo(() => {
    if (!topoData) return [];
    try {
      const geojson = topojson.feature(topoData, topoData.objects.MGN_ANM_DPTOS);
      const projection = geoMercator().fitSize([MAP_WIDTH, MAP_HEIGHT], geojson);
      const pathGenerator = geoPath().projection(projection);
      return geojson.features.map((feature) => ({
        ...feature,
        path: pathGenerator(feature),
        centroid: pathGenerator.centroid(feature),
      }));
    } catch (error) { console.error("Error procesando TopoJSON:", error); return []; }
  }, [topoData]);

  useEffect(() => {
    if (departments.length === 0) return;
    const timer = setTimeout(() => {
      if (sanAndresPathRef.current) {
        try {
          const bbox = sanAndresPathRef.current.getBBox();
          if (bbox.width > 0 && bbox.height > 0) {
            setSanAndresBBox(bbox);
          }
        } catch {}
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [departments]);

  const handleResetSelection = useCallback(() => {
    setSelectedDept(null);
    setHoveredDept(null);
    onReset?.();
  }, [onReset]);

  const handleSelectDepartment = useCallback(
    (dept) => {
      const name = dept.properties.DPTO_CNMBR;
      if (selectedDept?.properties?.DPTO_CNMBR === name) { handleResetSelection(); return; }
      setSelectedDept(dept);
      setHoveredDept(null);
      onSelect?.(findDepartment(name));
    },
    [selectedDept, onSelect, handleResetSelection]
  );

  const handleKeySelect = useCallback(
    (dept, e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelectDepartment(dept); } },
    [handleSelectDepartment]
  );

  const handleDropdownSelect = useCallback(
    (e) => {
      const id = e.target.value;
      if (!id) return;
      const info = DEPARTMENTS.find((d) => d.id === id);
      if (!info) return;
      const feature = departments.find((d) => findDepartment(d.properties.DPTO_CNMBR)?.id === id);
      if (feature) { setSelectedDept(feature); setHoveredDept(null); onSelect?.(info); }
      e.target.value = "";
    },
    [departments, onSelect]
  );

  const handleRetry = useCallback(() => { setLoadError(null); setTopoData(null); setFetchAttempt((n) => n + 1); }, []);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-[#D6D3CD] bg-[#F8F6F1] text-[#6B7280] text-sm gap-4">
        <p>{loadError}</p>
        <button type="button" onClick={handleRetry} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-lg transition-colors" style={{ backgroundColor: "#4C6A92" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#5E81AC"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4C6A92"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
          Reintentar
        </button>
      </div>
    );
  }

  if (!topoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-[#D6D3CD] bg-[#F8F6F1] gap-3">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(76,106,146,0.2)", borderTopColor: "#4C6A92" }} />
        <p className="text-sm text-[#6B7280]">Cargando mapa…</p>
      </div>
    );
  }

  const isSelectedMode = selectedDept !== null;
  const sanAndres = departments.find((d) => d.properties.DPTO_CNMBR.includes("SAN ANDRÉS"));
  const sanAndresCentroid = sanAndres?.centroid;

  return (
    <div className="relative w-full">
      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          backgroundColor: OCEAN,
          boxShadow: "0 25px 60px rgba(31,41,55,0.3), 0 8px 24px rgba(31,41,55,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
          perspective: "1200px",
        }}
      >
        <div
          className="relative flex justify-center items-center min-h-[450px] sm:min-h-[650px] px-4 py-6 sm:px-8 sm:py-10"
          style={{
            transform: "rotateX(0deg) rotateY(0deg)",
            transformOrigin: "center center",
          }}
        >
          <motion.svg
            viewBox={DEFAULT_VIEWBOX}
            className="w-full h-auto max-h-[800px]"
            style={{ overflow: "visible" }}
            role="img"
            aria-label="Mapa interactivo de Colombia con departamentos seleccionables"
          >
            <defs>
              <filter id="glow-hover" x="-15%" y="-15%" width="130%" height="130%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood floodColor="#00D4FF" floodOpacity="0.7" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-selected" x="-15%" y="-15%" width="130%" height="130%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood floodColor="#4C6A92" floodOpacity="0.6" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <g aria-hidden="true">
              {Array.from({ length: BLOCK_LAYERS }, (_, i) => {
                const t = i / (BLOCK_LAYERS - 1);
                const r = Math.round(180 - t * 50);
                const g = Math.round(176 - t * 48);
                const b = Math.round(168 - t * 44);
                const color = `rgb(${r},${g},${b})`;
                return (
                  <g key={`block-${i}`} transform={`translate(0, ${i * 0.8 + 1})`}>
                    {departments.map((dept) => (
                      <path
                        key={`edge-${dept.properties.DPTO_CNMBR}-${i}`}
                        d={dept.path}
                        fill={color}
                        stroke={color}
                        strokeWidth="0.15"
                      />
                    ))}
                  </g>
                );
              })}
            </g>

            <g>
              {departments.map((dept) => {
                const name = dept.properties.DPTO_CNMBR;
                const isSelected = selectedDept?.properties?.DPTO_CNMBR === name;
                const isHovered = hoveredDept === name;
                return (
                  <motion.path
                    key={name}
                    d={dept.path}
                    initial={false}
                    animate={{ fill: isSelected ? LAND_SELECTED : isHovered ? LAND_HOVER : LAND }}
                    transition={{ duration: 0.15 }}
                    stroke={isSelected ? BORDER_SELECTED : isHovered ? BORDER_HOVER : BORDER}
                    strokeWidth={isSelected ? 1.8 : isHovered ? 1.4 : 0.4}
                    strokeLinejoin="round"
                    style={{
                      cursor: "pointer",
                      filter: isSelected ? "url(#glow-selected)" : isHovered ? "url(#glow-hover)" : "none",
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Departamento de ${name}`}
                    aria-pressed={isSelected}
                    onMouseEnter={() => setHoveredDept(name)}
                    onMouseLeave={() => setHoveredDept(null)}
                    onClick={() => handleSelectDepartment(dept)}
                    onKeyDown={(e) => handleKeySelect(dept, e)}
                  />
                );
              })}
            </g>

            {sanAndresCentroid && sanAndresCentroid[0] && (
              <g aria-hidden="true">
                <circle cx={sanAndresCentroid[0]} cy={sanAndresCentroid[1]} r="8" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={sanAndresCentroid[0]} cy={sanAndresCentroid[1]} r="3" fill="#00D4FF" stroke="#fff" strokeWidth="1" />
              </g>
            )}

            {sanAndres && (
              <path ref={sanAndresPathRef} d={sanAndres.path} fill="none" stroke="none" aria-hidden="true" />
            )}
          </motion.svg>

          <AnimatePresence>
            {hoveredDept && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-2 rounded-lg shadow-xl z-10"
                style={{ backgroundColor: "rgba(31,41,55,0.92)", backdropFilter: "blur(8px)" }}
              >
                <span className="text-white font-semibold text-xs tracking-widest uppercase">{hoveredDept}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {sanAndresBBox && sanAndres && (
            <div
              className="absolute top-3 right-3 sm:top-5 sm:right-5 rounded-lg overflow-hidden z-10"
              style={{
                width: 110,
                height: 140,
                border: "1.5px solid rgba(255,255,255,0.2)",
                backgroundColor: OCEAN,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <svg
                viewBox={`${sanAndresBBox.x - 5} ${sanAndresBBox.y - 8} ${sanAndresBBox.w + 10} ${sanAndresBBox.h + 16}`}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <rect x={sanAndresBBox.x - 10} y={sanAndresBBox.y - 12} width={sanAndresBBox.w + 20} height={sanAndresBBox.h + 24} fill={OCEAN} />
                <path d={sanAndres.path} fill={LAND} stroke={BORDER} strokeWidth="0.3" strokeLinejoin="round" />
              </svg>
              <div
                className="absolute bottom-0 left-0 right-0 text-center py-0.5 text-[8px] font-bold uppercase tracking-widest"
                style={{ backgroundColor: "rgba(31,41,55,0.85)", color: "rgba(255,255,255,0.6)" }}
              >
                San Andrés
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="dept-selector" className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6B7280" }}>
          Seleccionar departamento:
        </label>
        <select
          id="dept-selector"
          onChange={handleDropdownSelect}
          className="flex-1 max-w-xs px-4 py-2.5 text-sm font-medium rounded-lg border appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{ backgroundColor: "#F8F6F1", borderColor: "#D6D3CD", color: "#1F2937" }}
        >
          <option value="">— Todos los departamentos —</option>
          {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {isSelectedMode && (
          <button type="button" onClick={handleResetSelection} className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white rounded-lg transition-colors" style={{ backgroundColor: "#4C6A92" }}>
            Ver todos
          </button>
        )}
      </div>
    </div>
  );
}

export default ColombiaMap;
