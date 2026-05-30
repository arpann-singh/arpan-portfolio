"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Ticket, Users, Mic, Star } from "lucide-react";

export default function SwaangTicket() {
  const [isFlipped, setIsFlipped] = useState(false);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth out the mouse movement
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Map mouse position to rotation (-15 to 15 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Map mouse position to the holographic glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate percentage from center (-0.5 to 0.5)
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    // Snap back to center when mouse leaves
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="w-full h-full min-h-[300px] flex items-center justify-center perspective-[1200px]"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-full max-w-[320px] h-[200px] cursor-pointer"
      >
        {/* ================= FRONT OF TICKET ================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl flex overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Holographic Glare Layer */}
          <motion.div 
            className="absolute inset-0 z-50 mix-blend-overlay pointer-events-none opacity-40"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
              left: glareX,
              top: glareY,
              transform: "translate(-50%, -50%)",
              width: "200%",
              height: "200%",
            }}
          />

          {/* Left Stub */}
          <div className="w-16 h-full bg-gradient-to-b from-amber-500 to-orange-600 flex flex-col items-center justify-between py-4 border-r-2 border-dashed border-white/40">
            <Ticket className="text-white/80 w-6 h-6 rotate-90" />
            <div className="text-white/80 font-mono text-xs -rotate-90 tracking-widest uppercase font-bold whitespace-nowrap">
              VIP ACCESS
            </div>
            <Star className="text-white/80 w-4 h-4" />
          </div>

          {/* Main Body */}
          <div className="flex-1 bg-slate-900 relative overflow-hidden p-6 flex flex-col justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:16px_16px]"></div>
            
            <div className="relative z-10">
              <div className="inline-block px-2 py-1 bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded mb-2 border border-amber-500/30">
                SSTC Drama Club
              </div>
              <h2 className="font-syne text-3xl font-bold text-white mb-1 uppercase tracking-tight">
                Swaang
              </h2>
              <p className="text-slate-400 font-mono text-xs mb-4">EST. 2026 // SEASON VIP</p>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-300 font-bold">President</span>
              </div>
            </div>
            
            {/* Click to flip hint */}
            <div className="absolute bottom-2 right-4 text-[9px] text-slate-500 uppercase tracking-widest animate-pulse font-mono">
              Click to Flip ⤻
            </div>
          </div>
        </div>

        {/* ================= BACK OF TICKET ================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl bg-slate-800 border-2 border-slate-700 p-6 flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
           {/* Dark Glare for Back */}
           <motion.div 
            className="absolute inset-0 z-50 mix-blend-overlay pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
              left: glareX,
              top: glareY,
              transform: "translate(-50%, -50%)",
              width: "200%",
              height: "200%",
            }}
          />

          <h3 className="font-syne text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
            Leadership & Arts
          </h3>
          
          <ul className="space-y-3 flex-1">
            <li className="flex items-start gap-3">
              <Users className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Leading a team of creatives, managing cast dynamics, and orchestrating club operations.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Mic className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Organizing events, workshops, and large-scale theatrical performances for SSTC.
              </p>
            </li>
          </ul>

          {/* Fake Barcode */}
          <div className="mt-auto h-8 w-full flex gap-1 opacity-50">
             {[...Array(30)].map((_, i) => (
                <div key={i} className="h-full bg-slate-500" style={{ width: Math.random() * 4 + 1 + 'px' }}></div>
             ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
