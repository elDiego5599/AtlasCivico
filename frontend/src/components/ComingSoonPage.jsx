import { motion } from "framer-motion";
import Header from "./Header";
import AtmosphericBackground from "./AtmosphericBackground";
import Footer from "./Footer";

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function ComingSoonPage({ eyebrow, title, highlight, description, cards }) {
  return (
    <div className="relative min-h-screen font-sans overflow-hidden flex flex-col" style={{ backgroundColor: "#ECE9E1", color: "#1F2937" }}>
      <AtmosphericBackground variant="compact" />
      <Header />
      <main className="relative pt-36 pb-20 max-w-7xl mx-auto px-6 md:px-10 flex-1">
        <motion.section
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg mb-7"
            style={{
              backgroundColor: "rgba(76, 106, 146, 0.1)",
              border: "1px solid rgba(76, 106, 146, 0.2)",
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#4C6A92" }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#4C6A92" }}>
              {eyebrow}
            </span>
          </motion.div>

          <motion.h1
            variants={cardVariants}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-balance"
            style={{ color: "#1F2937" }}
          >
            {title}{" "}
            <span style={{ color: "#4C6A92" }}>
              {highlight}
            </span>
          </motion.h1>

          <motion.p
            variants={cardVariants}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg max-w-2xl mx-auto leading-relaxed text-balance"
            style={{ color: "#6B7280" }}
          >
            {description}
          </motion.p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.25 }}
          className="mt-16 grid gap-4 md:grid-cols-3"
          aria-label="Capacidades planeadas"
        >
          {cards.map((card) => (
            <motion.article
              key={card.title}
              variants={cardVariants}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="rounded-lg p-6 transition-shadow duration-300"
              style={{
                backgroundColor: "rgba(248, 246, 241, 0.72)",
                border: "1px solid rgba(214, 211, 205, 0.5)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(31, 41, 55, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              }}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(76, 106, 146, 0.1)", border: "1px solid rgba(76, 106, 146, 0.2)", color: "#4C6A92" }}>
                {card.icon}
              </div>
              <h2 className="font-display text-lg font-bold" style={{ color: "#1F2937" }}>
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                {card.body}
              </p>
            </motion.article>
          ))}
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}

export default ComingSoonPage;
