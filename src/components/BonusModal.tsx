"use client";

import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function BonusModal({
  open,
  onClose,
  address,
}: { open: boolean; onClose: () => void; address?: string }) {
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update(); window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <Confetti width={dims.w} height={dims.h} numberOfPieces={220} recycle={false} />
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-6"
            initial={{ opacity: 0, scale: .95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="gm-card w-full max-w-md p-6 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full ring-2 ring-purple-400/40 grid place-items-center bg-white/5">
                {/* optional logo spot */}
                <span className="text-xl" style={{ color: "var(--gm-purple)" }}>GM</span>
              </div>
              <h2 className="text-2xl font-extrabold">
                Bonus <span style={{ color: "var(--gm-purple)" }}>Unlocked</span> 🎉
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--gm-muted)" }}>
                Welcome to GoMining. Your wallet has been verified.
              </p>
              {address && (
                <p className="mt-3 text-xs text-white/60">
                  {address.slice(0, 6)}…{address.slice(-4)}
                </p>
              )}
              <div className="mt-6 flex justify-center">
                <button className="gm-btn" onClick={onClose}>Continue</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}