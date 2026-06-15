function AtmosphericBackground({ variant = "default" }) {
  const isCompact = variant === "compact";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: "#ECE9E1" }} />

      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(76,106,146,0.05), transparent 50%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(176,137,104,0.04), transparent 40%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(137,169,141,0.04), transparent 60%)" }} />

      <div
        className={`${isCompact ? "top-[-22rem]" : "top-[-18rem]"} absolute left-[5%] h-[36rem] w-[36rem] rounded-full blur-[160px] animate-float-slow`}
        style={{ backgroundColor: "rgba(76, 106, 146, 0.04)" }}
      />
      <div
        className="absolute right-[-8rem] top-[12%] h-[28rem] w-[28rem] rounded-full blur-[140px] animate-float-medium"
        style={{ backgroundColor: "rgba(137, 169, 141, 0.035)" }}
      />
      <div
        className="absolute left-[40%] top-[60%] h-[20rem] w-[20rem] rounded-full blur-[120px] animate-float-slow"
        style={{ backgroundColor: "rgba(176, 137, 104, 0.03)", animationDelay: "-7s" }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" aria-hidden="true">
        <defs>
          <pattern id="topo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4C6A92" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo-grid)" />
      </svg>

      <div className="absolute inset-0 cinematic-noise opacity-[0.12]" />

      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(236,233,225,0.6) 100%)"
      }} />
    </div>
  );
}

export default AtmosphericBackground;
