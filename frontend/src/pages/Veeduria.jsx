import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import ColombiaMap from "../components/ColombiaMap";
import DetailPanel from "../components/DetailPanel";
import ResetButton from "../components/ResetButton";
import AtmosphericBackground from "../components/AtmosphericBackground";
import DepartmentSearch from "../components/DepartmentSearch";
import EmptyState from "../components/EmptyState";
import Footer from "../components/Footer";
import { MOCK_CONTRACTS } from "../data/mockData";
import { DEPARTMENTS } from "../data/departments";
import { useDarkMode } from "../context/DarkModeContext";

const STATUSES = ["Todos", "En ejecucion", "Celebrado"];
const VALUE_RANGES = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "< $1.000M", min: 0, max: 1e9 },
  { label: "$1.000M - $5.000M", min: 1e9, max: 5e9 },
  { label: "> $5.000M", min: 5e9, max: Infinity },
];

function exportCSV(deptName, contracts) {
  if (!contracts.length) return;
  const headers = ["ID", "Entidad", "Contratista", "Objeto", "Valor", "Estado", "Fecha Firma"];
  const rows = contracts.map((c) => [
    c.id, c.entidad, c.contratista, `"${c.objetoSimplificado.replace(/"/g, '""')}"`,
    c.valor, c.estado, c.fechaFirma || "",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `contratos-${deptName.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function shareDept(deptId) {
  const url = `${window.location.origin}/veeduria?dept=${deptId}`;
  navigator.clipboard.writeText(url).catch(() => {});
}

export default function Veeduria() {
  const [selectedDeptInfo, setSelectedDeptInfo] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterValue, setFilterValue] = useState(VALUE_RANGES[0]);
  const [filterEntity, setFilterEntity] = useState("");
  const { dark } = useDarkMode();

  const handleSelect = useCallback((deptInfo) => {
    setSelectedDeptInfo(deptInfo);
    setShowDetail(false);
    setTimeout(() => setShowDetail(Boolean(deptInfo)), 800);
  }, []);

  const handleReset = useCallback(() => {
    setShowDetail(false);
    setTimeout(() => { setSelectedDeptInfo(null); setMapKey((k) => k + 1); }, 300);
  }, []);

  const handleSearchSelect = useCallback((id) => {
    const info = DEPARTMENTS.find((d) => d.id === id);
    if (info) { setSelectedDeptInfo(info); setShowDetail(true); }
  }, []);

  const contracts = useMemo(() => selectedDeptInfo ? MOCK_CONTRACTS[selectedDeptInfo.id] || [] : [], [selectedDeptInfo]);

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      if (filterStatus !== "Todos" && c.estado !== filterStatus) return false;
      if (c.valor < filterValue.min || c.valor > filterValue.max) return false;
      if (filterEntity && !c.entidad.toLowerCase().includes(filterEntity.toLowerCase())) return false;
      return true;
    });
  }, [contracts, filterStatus, filterValue, filterEntity]);

  const allEntities = useMemo(() => [...new Set(contracts.map((c) => c.entidad))], [contracts]);
  const hasSelection = selectedDeptInfo !== null;

  const bgMain = dark ? "#0F141E" : "#ECE9E1";
  const textMain = dark ? "#F8F6F1" : "#1F2937";
  const muted = dark ? "rgba(255,255,255,0.5)" : "#6B7280";

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden flex flex-col" style={{ backgroundColor: bgMain, color: textMain }}>
      <AtmosphericBackground />
      <Header />

      <main className="relative pt-20 pb-20 flex-1">
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 mb-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: "#4C6A92" }}>
              Veeduría Ciudadana
            </p>
            <h1 className="font-display text-3xl font-black sm:text-4xl tracking-tight" style={{ color: textMain }}>
              Contratación Pública
            </h1>
            <p className="mt-2 text-sm max-w-2xl" style={{ color: muted }}>
              Seleccione un departamento para revisar contratos del SECOP II, estados de ejecución y valores contratados.
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <DepartmentSearch onSelect={handleSearchSelect} selectedId={selectedDeptInfo?.id} accentColor="#4C6A92" />
            {hasSelection && contracts.length > 0 && (
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-2">
                <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(214,211,205,0.5)" }}>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className="px-3 py-1.5 text-[11px] font-semibold transition-all duration-200"
                      style={{
                        backgroundColor: filterStatus === s ? "#4C6A92" : "rgba(248,246,241,0.8)",
                        color: filterStatus === s ? "white" : muted,
                      }}
                    >
                      {s === "En ejecucion" ? "Ejecución" : s}
                    </button>
                  ))}
                </div>
                <select
                  value={VALUE_RANGES.indexOf(filterValue)}
                  onChange={(e) => setFilterValue(VALUE_RANGES[Number(e.target.value)])}
                  className="px-3 py-1.5 text-[11px] font-semibold rounded-lg border appearance-none cursor-pointer"
                  style={{ backgroundColor: "#F8F6F1", borderColor: "rgba(214,211,205,0.5)", color: textMain }}
                >
                  {VALUE_RANGES.map((v, i) => <option key={i} value={i}>{v.label}</option>)}
                </select>
                {allEntities.length > 1 && (
                  <input
                    type="text"
                    value={filterEntity}
                    onChange={(e) => setFilterEntity(e.target.value)}
                    placeholder="Entidad..."
                    className="px-3 py-1.5 text-[11px] rounded-lg border outline-none"
                    style={{ backgroundColor: "#F8F6F1", borderColor: "rgba(214,211,205,0.5)", color: textMain, width: 160 }}
                  />
                )}
                <button
                  onClick={() => exportCSV(selectedDeptInfo.name, filteredContracts)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{ backgroundColor: "rgba(111,143,114,0.1)", color: "#5A7A5D", border: "1px solid rgba(111,143,114,0.2)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  CSV
                </button>
                <button
                  onClick={() => shareDept(selectedDeptInfo.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{ backgroundColor: "rgba(76,106,146,0.08)", color: "#4C6A92", border: "1px solid rgba(76,106,146,0.15)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Compartir
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <section className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className={`relative grid gap-10 transition-all duration-700 ease-in-out ${hasSelection ? "lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.78fr)]" : "lg:grid-cols-1"}`}>
            <ColombiaMap key={mapKey} onSelect={handleSelect} onReset={handleReset} />

            <AnimatePresence mode="wait">
              {showDetail && selectedDeptInfo && (
                <motion.div
                  key={selectedDeptInfo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full lg:sticky lg:top-28"
                >
                  <DetailPanel
                    department={selectedDeptInfo}
                    onClose={handleReset}
                    filteredContracts={filteredContracts}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {hasSelection && contracts.length > 0 && filteredContracts.length === 0 && (
            <div className="mt-8">
              <EmptyState variant="contracts" action={
                <button onClick={() => { setFilterStatus("Todos"); setFilterValue(VALUE_RANGES[0]); setFilterEntity(""); }}
                  className="px-4 py-2 text-sm font-bold rounded-lg" style={{ backgroundColor: "#4C6A92", color: "white" }}>
                  Limpiar filtros
                </button>
              } />
            </div>
          )}
        </section>
      </main>

      <ResetButton visible={hasSelection} onClick={handleReset} />
      <Footer />
    </div>
  );
}
