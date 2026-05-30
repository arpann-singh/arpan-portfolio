"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Award, ShieldCheck, Sparkles, Code2, Cpu, ExternalLink, CheckCircle2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper to assign a dynamic gradient based on the certificate index
const gradients = [
  "from-emerald-400 to-green-500 shadow-green-500/20",
  "from-blue-400 to-blue-600 shadow-blue-500/20",
  "from-indigo-400 to-indigo-600 shadow-indigo-500/20",
  "from-pink-400 to-rose-500 shadow-pink-500/20",
  "from-slate-700 to-slate-900 shadow-slate-500/20",
  "from-cyan-400 to-blue-500 shadow-cyan-500/20",
  "from-orange-400 to-red-500 shadow-orange-500/20"
];

// Helper to assign an icon based on keywords
const getIcon = (title: string) => {
  const t = title?.toLowerCase() || "";
  if (t.includes("ai") || t.includes("generative")) return <Sparkles className="text-white w-6 h-6" />;
  if (t.includes("security") || t.includes("ethics")) return <ShieldCheck className="text-white w-6 h-6" />;
  if (t.includes("robotics") || t.includes("hardware")) return <Cpu className="text-white w-6 h-6" />;
  return <Code2 className="text-white w-6 h-6" />;
};

export default function Certifications() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Live Sync with Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "certifications"), (snapshot) => {
      const certs = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        styleStr: gradients[index % gradients.length],
        ...doc.data()
      }));
      setCertifications(certs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // FIX: Explicitly type the variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-slate-100">
      
      {/* GLOBAL GLOWING ORBS */}
      <div className="fixed top-[0%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <section className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 md:px-12 container mx-auto pt-32 pb-12 max-w-7xl">
        
        {/* HEADER SECTION */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-700 font-bold text-sm mb-6 shadow-sm mx-auto">
            <Award size={16} /> CONTINUOUS LEARNING
          </div>
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter mb-6">
            Certifications Vault.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
            A collection of professional certifications validating my expertise across Generative AI, Cloud Development, UI/UX, and Cybersecurity.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Unlocking vault...</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {certifications.map((cert) => {
              const [gradClass, shadowClass] = cert.styleStr.split(" shadow-");
              return (
                <motion.div key={cert.id} variants={itemVariants} className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all flex flex-col h-full relative">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                  <div className="p-8 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradClass} flex items-center justify-center shadow-lg shadow-${shadowClass} group-hover:scale-110 transition-transform duration-500`}>
                        {getIcon(cert.title)}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-100 text-green-700 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                        <CheckCircle2 size={12} /> Verified
                      </div>
                    </div>

                    <h3 className="font-syne text-2xl font-bold text-slate-900 mb-2 leading-tight">
                      {cert.title}
                    </h3>
                    
                    {/* ENHANCED CARD FOOTER */}
                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-5">
                      <div>
                        <p className="text-sm font-bold text-slate-700 mb-1">{cert.issuer}</p>
                        <p className="text-xs text-slate-500 font-medium">{cert.date}</p>
                      </div>
                      
                      <div className="flex gap-2 w-full">
                        {/* Enhanced View Image Button */}
                        {cert.imageUrl && (
                          <button 
                            onClick={() => setSelectedImage(cert.imageUrl)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all shadow-sm font-bold text-xs group/btn"
                          >
                            <ImageIcon size={14} className="group-hover/btn:scale-110 transition-transform" />
                            Document
                          </button>
                        )}
                        
                        {/* Enhanced Verification Link Button */}
                        {cert.verifyLink && (
                          <a 
                            href={cert.verifyLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all shadow-sm font-bold text-xs group/btn"
                          >
                            <ExternalLink size={14} className="group-hover/btn:scale-110 transition-transform" />
                            Verify
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </section>

      {/* LIGHTBOX MODAL OVERLAY */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-[2rem] p-2 shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
              >
                <X size={20} />
              </button>
              
              <div className="w-full h-full overflow-hidden rounded-[1.5rem] bg-slate-100 flex items-center justify-center">
                <img src={selectedImage} alt="Certificate Document" className="w-full h-auto max-h-[85vh] object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
