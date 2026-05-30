"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";

export default function ApertureWidget() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ["5%", "-5%"]);
  const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ["5%", "-5%"]);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(d => d.data().url));
    });
  }, []);

  useEffect(() => {
    if (!isHovered || images.length === 0) return;
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  return (
    <motion.div
      className="relative w-full h-full bg-[#0a0f1c] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-crosshair shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] border border-slate-800/50 flex items-center justify-center min-h-[250px] sm:min-h-[300px] p-4 sm:p-6 z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
    >
      <div className="relative w-full max-w-[280px] aspect-square rounded-full border-4 border-slate-900 bg-black flex items-center justify-center overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
        
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
              <Image src={images[currentIndex]} alt="Portfolio" fill className="object-cover" />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center z-0">
              <Camera className="text-slate-700 w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          )}
        </AnimatePresence>

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
                className="absolute border-t-[2px] border-slate-500/50 shadow-[0_-10px_20px_rgba(0,0,0,0.9)]"
                style={{
                  width: '200%', height: '200%', left: '-50%', top: '50%',
                  background: "linear-gradient(180deg, #1e293b 0%, #020617 100%)",
                }}
                variants={{ closed: { y: '-2%' }, open: { y: '50%' } }}
                transition={{ duration: 0.7, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={{ opacity: isHovered ? 0 : 1 }}
          className="relative z-30 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-700/50 shadow-2xl pointer-events-none"
        >
          <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
        </motion.div>
        
        <div className="absolute inset-0 border-[10px] sm:border-[15px] border-black rounded-full pointer-events-none z-40"></div>
      </div>
    </motion.div>
  );
}
