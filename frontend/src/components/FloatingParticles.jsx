import { useMemo } from "react";
import { motion } from "framer-motion";

const PARTICLE_SEED = [
  { x: 12, y: 8, size: 3, dur: 18, del: 1, op: 0.06, dy: -55, dx: 12, sc: 1.4 },
  { x: 34, y: 22, size: 5, dur: 22, del: 3, op: 0.05, dy: -70, dx: -8, sc: 1.2 },
  { x: 56, y: 15, size: 2, dur: 28, del: 0, op: 0.07, dy: -45, dx: 18, sc: 1.5 },
  { x: 78, y: 30, size: 4, dur: 20, del: 5, op: 0.04, dy: -60, dx: -15, sc: 1.3 },
  { x: 91, y: 12, size: 3, dur: 25, del: 2, op: 0.06, dy: -50, dx: 10, sc: 1.1 },
  { x: 20, y: 45, size: 6, dur: 19, del: 7, op: 0.05, dy: -65, dx: -20, sc: 1.6 },
  { x: 45, y: 55, size: 2, dur: 30, del: 4, op: 0.08, dy: -40, dx: 5, sc: 1.2 },
  { x: 67, y: 40, size: 4, dur: 16, del: 6, op: 0.04, dy: -75, dx: -12, sc: 1.4 },
  { x: 85, y: 60, size: 3, dur: 24, del: 1.5, op: 0.06, dy: -55, dx: 15, sc: 1.3 },
  { x: 8, y: 70, size: 5, dur: 21, del: 8, op: 0.05, dy: -60, dx: -8, sc: 1.5 },
  { x: 28, y: 80, size: 2, dur: 27, del: 3.5, op: 0.07, dy: -48, dx: 20, sc: 1.1 },
  { x: 50, y: 75, size: 4, dur: 17, del: 9, op: 0.04, dy: -70, dx: -18, sc: 1.6 },
  { x: 72, y: 85, size: 3, dur: 23, del: 0.5, op: 0.06, dy: -52, dx: 10, sc: 1.2 },
  { x: 95, y: 50, size: 5, dur: 26, del: 5.5, op: 0.05, dy: -62, dx: -14, sc: 1.4 },
  { x: 15, y: 35, size: 2, dur: 29, del: 2.5, op: 0.08, dy: -42, dx: 8, sc: 1.3 },
  { x: 40, y: 90, size: 4, dur: 15, del: 7.5, op: 0.04, dy: -78, dx: -10, sc: 1.5 },
  { x: 60, y: 5, size: 3, dur: 20, del: 4.5, op: 0.06, dy: -58, dx: 16, sc: 1.1 },
  { x: 82, y: 70, size: 6, dur: 22, del: 6.5, op: 0.05, dy: -68, dx: -6, sc: 1.7 },
];

export default function FloatingParticles({ count = 18, color = "#4C6A92" }) {
  const particles = useMemo(() => PARTICLE_SEED.slice(0, count), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.op,
          }}
          animate={{
            y: [0, p.dy, 0],
            x: [0, p.dx, 0],
            scale: [1, p.sc, 1],
            opacity: [p.op, p.op * 1.8, p.op],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.del,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
