"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FolderGit2, ExternalLink, GitBranch, Code2, LayoutTemplate, Smartphone, Database, Loader2 } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const categories = ["All", "Web", "Python", "App", "UI/UX Design", "Other"];

// Helper to assign a relevant icon based on category
const getCategoryIcon = (category: string) => {
  switch(category?.toLowerCase()) {
    case "web": return <LayoutTemplate size={80} className="text-blue-600/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />;
    case "python": return <Code2 size={80} className="text-purple-600/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />;
    case "app": return <Smartphone size={80} className="text-cyan-600/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />;
    default: return <Database size={80} className="text-emerald-600/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />;
  }
};

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Live Sync with Firebase Firestore
  useEffect(() => {
    const q = query(collection(db, "custom_projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjectsData(projects);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = projectsData.filter((project) => 
    activeCategory === "All" ? true : project.category === activeCategory
  );

  // FIX: Explicitly type the variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-slate-100">
      
      {/* GLOBAL GLOWING ORBS */}
      <div className="fixed top-[0%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none z-0" />

      <section className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 md:px-12 container mx-auto pt-32 pb-12 max-w-7xl">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 text-center md:text-left">
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter mb-4">
            Featured Projects.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-sans max-w-2xl">
            A hybrid showcase combining live-synced GitHub repositories with deep-dive custom case studies.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-10 sticky top-24 z-30">
          <div className="inline-flex flex-wrap gap-2 p-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Syncing live projects...</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div 
                  key={project.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all flex flex-col h-[400px]"
                >
                  <div className="h-10 bg-slate-100/80 backdrop-blur-md flex items-center px-4 gap-2 border-b border-slate-200 relative shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="mx-auto flex items-center gap-2 text-xs font-mono text-slate-500 pr-8">
                      <FolderGit2 size={14} /> {(project.title || "project").toLowerCase().replace(/\s+/g, '-')}
                    </div>
                  </div>

                  <div className="h-32 bg-slate-50 p-6 flex items-end relative overflow-hidden shrink-0 border-b border-slate-100">
                    {/* If there's an image uploaded from admin, show it as background */}
                    {project.imageUrl ? (
                       <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-blue-400/20 transition-colors duration-500"></div>
                      </>
                    )}
                    
                    {/* Add a gradient overlay so text is readable over images */}
                    {project.imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>}

                    <h3 className={`font-syne text-2xl font-bold relative z-10 truncate ${project.imageUrl ? 'text-white' : 'text-slate-900'}`}>
                      {project.title}
                    </h3>
                    
                    {!project.imageUrl && (
                      <div className="absolute top-4 right-4">
                        {getCategoryIcon(project.category)}
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-transparent flex-1 flex flex-col relative z-10">
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto flex flex-col gap-4">
                      <div className="flex gap-2 flex-wrap">
                        {/* Display up to 2 tags */}
                        {Array.isArray(project.tags) && project.tags.slice(0, 2).map((tag: string, i: number) => (
                           <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] uppercase tracking-wider font-bold border border-slate-200 shadow-sm">
                             {tag}
                           </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{project.category}</span>
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:shadow-sm transition-all" title="View Repository">
                              <GitBranch size={14} />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:shadow-sm transition-all" title="View Live Project">
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full py-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl rounded-[2rem] border-2 border-white/80 mt-6">
            <FolderGit2 size={48} className="text-slate-300 mb-4" />
            <h3 className="font-syne text-2xl font-bold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-500">Try selecting a different category filter.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
