"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Camera, Target, BookOpen, Repeat, ArrowRight } from "lucide-react";

export default function ApertureWidget() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // --- 3D Parallax Setup for Lens ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ["5%", "-5%"]);
  const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ["5%", "-5%"]);

  // --- Live Firebase Data ---
  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(d => d.data().url));
    });
  }, []);

  // --- Slideshow Timer ---
  useEffect(() => {
    if (!isHovered || images.length === 0 || !isFlipped) return;
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [isHovered, images.length, isFlipped]);

  return (
    <div className="relative w-full h-full min-h-[250px] sm:min-h-[300px] z-10" style={{ perspective: "1200px" }}>
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* =======================================
            FRONT OF CARD: CURRENT GOALS
            ======================================= */}
        <div
          className="absolute inset-0 w-full h-full bg-white/60 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border-2 border-white/80 p-6 sm:p-8 flex flex-col justify-between group"
          style={{ backfaceVisibility: "hidden" }}
          onClick={() => setIsFlipped(true)}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-blue-400/30 transition-colors duration-500"></div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-[10px] uppercase tracking-widest mb-4 shadow-sm">
              <Target size={14} /> Current Focus
            </div>
            <h3 className="font-syne text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">GATE 2027</h3>
            <p className="text-slate-600 font-sans text-sm font-medium">Computer Science & Data Science</p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <BookOpen size={12} /> University
              </span>
              <span className="text-slate-700 font-bold text-sm">B.Tech @ SSTC</span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:scale-110">
              <Repeat size={16} />
            </div>
          </div>
        </div>

        {/* =======================================
            BACK OF CARD: SILVER APERTURE LENS
            ======================================= */}
        <div
          className="absolute inset-0 w-full h-full bg-white/60 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-crosshair shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border-2 border-white/80 flex flex-col items-center justify-center p-4 sm:p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            x.set((e.clientX - rect.left) / rect.width - 0.5);
            y.set((e.clientY - rect.top) / rect.height - 0.5);
          }}
          onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
        >
          {/* Flip Back Button (Top Left) */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
            className="absolute top-4 left-4 z-50 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-110"
          >
            <Repeat size={14} />
          </button>

          <div className="relative w-full max-w-[280px] aspect-square rounded-full border-8 border-white bg-slate-900 flex items-center justify-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.1)]">
            
            {/* Slideshow */}
            <AnimatePresence mode="wait">
              {images.length > 0 ? (
                <motion.div 
                  key={currentIndex} 
                  initial={{ opacity: 0, scale: 1.2, filter: "blur(15px)" }} 
                  animate={{ opacity: 1, scale: 1.1, filter: "blur(0px)" }} 
                  exit={{ opacity: 0, filter: "blur(10px)" }} 
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                  style={{ x: imageX, y: imageY }} 
                  className="absolute inset-0 z-0"
                >
                  <Image src={images[currentIndex]} alt="Portfolio Gallery" fill className="object-cover opacity-90" />
                </motion.div>
              ) : (
                <div className="flex h-full w-full items-center justify-center z-0">
                  <Camera className="text-slate-600 w-10 h-10" />
                </div>
              )}
            </AnimatePresence>

            {/* Metallic Blades */}
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              variants={{ closed: { rotate: 0 }, open: { rotate: 90 } }}
              initial="closed"
              animate={isHovered ? "open" : "closed"}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="absolute inset-0 origin-center" style={{ transform: `rotate(${i * 60}deg)` }}>
                  <motion.div
                    className="absolute border-t border-white shadow-[0_-5px_15px_rgba(0,0,0,0.25)]"
                    style={{
                      width: '200%', height: '200%', left: '-50%', top: '50%',
                      background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)",
                    }}
                    variants={{ closed: { y: '-2%' }, open: { y: '50%' } }}
                    transition={{ duration: 0.7, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ))}
            </motion.div>

            {/* Center Icon */}
            <motion.div
              animate={{ opacity: isHovered ? 0 : 1 }}
              className="relative z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-200 shadow-xl pointer-events-none"
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
            </motion.div>
            
            {/* Inner Glass Bevel */}
            <div className="absolute inset-0 border-[10px] sm:border-[15px] border-white/20 rounded-full pointer-events-none z-40 mix-blend-overlay"></div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
