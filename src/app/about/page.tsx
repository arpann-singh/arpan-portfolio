"use client";

import { motion } from "framer-motion";
import { GraduationCap, Mic, Code2, Sparkles, MapPin, Gamepad2, Plane, Music, Play } from "lucide-react";

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-slate-100">
      
      {/* GLOBAL GLOWING ORBS FOR GLASSMORPHISM */}
      <div className="fixed top-[0%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none z-0" />

      <section className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 md:px-12 container mx-auto pt-32 pb-12">
        
        {/* PAGE HEADER */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8 pl-4">
          <h1 className="font-syne text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tighter">
            About Me.
          </h1>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl w-full">

          {/* BOX 1: MAIN BIO (Spans full width) */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="md:col-span-2 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
            <div className="absolute -right-32 -top-32 w-96 h-96 bg-cyan-100/50 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-100/50 transition-colors duration-700"></div>
            
            <div className="relative z-10 max-w-4xl">
              <p className="text-xl md:text-2xl text-slate-700 font-sans leading-relaxed mb-6">
                I am <span className="font-bold text-slate-900">Arpan Singh</span>, an IT Student, Python Developer, and UI/UX Designer driven by a passion for building seamless, high-performance digital experiences. Currently pursuing my B.Tech in Information Technology at Shri Shankaracharya Technical Campus (SSTC), I blend analytical backend logic with highly creative, user-centric design.
              </p>
              <p className="text-xl md:text-2xl text-slate-700 font-sans leading-relaxed">
                Beyond the code editor, I lead as the President and Content Creation Module Lead for the Swaang Drama Club, and actively contribute as a GDSC Member. I am also dedicating intense focus toward the <span className="font-bold text-slate-900 bg-cyan-100/50 px-2 py-1 rounded-lg">GATE 2027 examination</span>, specializing in Computer Science and Data Science to further deepen my architectural knowledge.
              </p>
            </div>
          </motion.div>

          {/* BOX 2: EDUCATION TIMELINE */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <GraduationCap className="text-blue-500 w-6 h-6" />
              </div>
              <h2 className="font-syne text-2xl font-bold text-slate-900">Education & Ambition</h2>
            </div>

            <div className="relative pl-4 border-l-2 border-blue-100 space-y-10">
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm"></div>
                <h3 className="font-bold text-slate-900 text-lg">B.Tech – Information Technology</h3>
                <p className="text-blue-600 font-bold text-sm mb-2">Shri Shankaracharya Technical Campus (SSTC) • Sep 2023 – May 2027</p>
                <p className="text-slate-600 font-sans text-sm leading-relaxed">Focusing on core computer science fundamentals, backend development, and scalable cloud architectures.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-300 shadow-sm"></div>
                <h3 className="font-bold text-slate-900 text-lg">GATE 2027 Aspirant</h3>
                <p className="text-blue-600 font-bold text-sm mb-2">Computer Science & Data Science</p>
                <p className="text-slate-600 font-sans text-sm leading-relaxed">Rigorous preparation for advanced studies, targeting expertise in data engineering, AI, and algorithmic problem-solving.</p>
              </div>
            </div>
          </motion.div>

          {/* BOX 3: LEADERSHIP TIMELINE */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center border border-cyan-100">
                <Mic className="text-cyan-600 w-6 h-6" />
              </div>
              <h2 className="font-syne text-2xl font-bold text-slate-900">Leadership & Clubs</h2>
            </div>

            <div className="relative pl-4 border-l-2 border-cyan-100 space-y-10">
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-4 border-cyan-500 shadow-sm"></div>
                <h3 className="font-bold text-slate-900 text-lg">President & Content Lead</h3>
                <p className="text-cyan-600 font-bold text-sm mb-2">Swaang Drama Club • SSTC</p>
                <p className="text-slate-600 font-sans text-sm leading-relaxed">Facilitating ad script writing, video shooting, and editing. Leading the creative direction and technical deployment (like the Swaang Connect platform) for club initiatives.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-300 shadow-sm"></div>
                <h3 className="font-bold text-slate-900 text-lg">Active Member</h3>
                <p className="text-cyan-600 font-bold text-sm mb-2">Google Developer Student Clubs (GDSC)</p>
                <p className="text-slate-600 font-sans text-sm leading-relaxed">Active participant in generative AI workshops, open-source contributions, and collaborative development projects.</p>
              </div>
            </div>
          </motion.div>

          {/* BOX 4: BEYOND THE CODE (Personal details grid spanning full width) */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="md:col-span-2 bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Play className="text-cyan-400 w-6 h-6 ml-1" />
                </div>
                <h2 className="font-syne text-2xl font-bold">When I'm off the clock</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <Music className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="font-bold mb-1">Musician</h3>
                  <p className="text-sm text-slate-400">Keyboard & Piano enthusiast.</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <Gamepad2 className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-bold mb-1">Sim Driver</h3>
                  <p className="text-sm text-slate-400">Euro Truck Simulator 2 & Rigs of Rods.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <Plane className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="font-bold mb-1">Explorer</h3>
                  <p className="text-sm text-slate-400">Indian railways & planning Vietnam.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <MapPin className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="font-bold mb-1">Local Rider</h3>
                  <p className="text-sm text-slate-400">Scooter rides around Bhilai.</p>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
