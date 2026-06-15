import { motion, AnimatePresence } from "framer-motion";

const CIVIC_BLUE = "#4C6A92";

function ResetButton({ visible, onClick }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3 text-white font-bold text-sm rounded-lg transition-colors duration-200"
          style={{
            backgroundColor: CIVIC_BLUE,
            boxShadow: "0 8px 24px rgba(76, 106, 146, 0.35)",
          }}
          aria-label="Restablecer vista del mapa de Colombia"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Restablecer Vista</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default ResetButton;
