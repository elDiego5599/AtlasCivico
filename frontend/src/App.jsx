import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DarkModeProvider } from "./context/DarkModeContext";

const Dashboard = lazy(() => import("./Dashboard"));
const Veeduria = lazy(() => import("./pages/Veeduria"));
const Clima = lazy(() => import("./pages/Clima"));
const Faq = lazy(() => import("./pages/Faq"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ECE9E1" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(76,106,146,0.15)", borderTopColor: "#4C6A92" }} />
      </div>
    </div>
  );
}

function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <DarkModeProvider>
      <Suspense fallback={<PageLoader />}>
        <FadeIn key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/veeduria" element={<Veeduria />} />
            <Route path="/clima" element={<Clima />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </FadeIn>
      </Suspense>
    </DarkModeProvider>
  );
}

export default App;
