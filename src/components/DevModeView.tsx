"use client";

import { motion } from "framer-motion";
import { Terminal, Download, Code, Briefcase } from "lucide-react";
import { useState } from "react";

export default function DevModeView() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-[120px] right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl shadow-2xl flex flex-col gap-2"
        >
          <a href="https://github.com/arpann-singh" target="_blank" rel="noreferrer" className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-3">
            <Code size={18} /> <span className="text-sm font-medium pr-2">GitHub</span>
          </a>
          <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noreferrer" className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-3">
            <Briefcase size={18} /> <span className="text-sm font-medium pr-2">LinkedIn</span>
          </a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-3">
            <Download size={18} /> <span className="text-sm font-medium pr-2">Resume</span>
          </a>
        </motion.div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all border border-slate-700/50 backdrop-blur-md"
      >
        <Terminal size={22} />
      </button>
    </div>
  );
}
