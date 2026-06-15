export function SkeletonCard({ className = "" }) {
  return (
    <div className={`rounded-xl overflow-hidden ${className}`} style={{ backgroundColor: "rgba(214,211,205,0.3)" }}>
      <div className="animate-pulse">
        <div className="h-4 w-3/4 mx-5 mt-5 rounded" style={{ backgroundColor: "rgba(214,211,205,0.5)" }} />
        <div className="h-3 w-1/2 mx-5 mt-2 rounded" style={{ backgroundColor: "rgba(214,211,205,0.4)" }} />
        <div className="grid grid-cols-4 gap-3 mx-5 mt-4 mb-5">
          {[0,1,2,3].map((i) => (
            <div key={i}>
              <div className="h-2 w-full rounded mb-1.5" style={{ backgroundColor: "rgba(214,211,205,0.4)" }} />
              <div className="h-3 w-3/4 rounded" style={{ backgroundColor: "rgba(214,211,205,0.5)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonMap() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(214,211,205,0.2)", minHeight: 500 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(76,106,146,0.2)", borderTopColor: "#4C6A92" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B7280" }}>Cargando mapa…</span>
        </div>
      </div>
    </div>
  );
}

export function SkeletonPanel() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(248,246,241,0.85)", border: "1px solid rgba(214,211,205,0.5)" }}>
      <div className="h-24 animate-pulse" style={{ backgroundColor: "#1F2937" }} />
      <div className="p-6 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
