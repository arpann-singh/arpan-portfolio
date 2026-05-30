"use client";

import { Code2 } from "lucide-react";
import { useDevMode } from "@/context/DevModeContext";
import { motion } from "framer-motion";

export default function DevModeToggle() {
  const { isDevMode, toggleDevMode } = useDevMode();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDevMode}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors border-2 ${
        isDevMode 
          ? "bg-[#252526] border-[#27c93f] text-[#27c93f]" 
          : "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
      }`}
      title={isDevMode ? "Exit Developer Mode" : "Enter Developer Mode"}
    >
      <Code2 size={24} />
    </motion.button>
  );
}
