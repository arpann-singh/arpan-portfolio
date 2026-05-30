"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Code2, Database, LayoutTemplate, User, Briefcase, Award, Send, FileText, MapPin, Clock, GraduationCap, Terminal } from "lucide-react";

const roles = [
  "IT Student 🎓",
  "Python Developer 🐍",
  "UI/UX Designer 🎨",
  "GDSC Member 💡",
];

const SectionDivider = () => (
  <div className="w-full max-w-5xl mx-auto py-6 flex items-center justify-center opacity-30 pointer-events-none">
    <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent to-slate-400"></div>
    <div className="mx-4 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
    <div className="w-1/3 h-[1px] bg-gradient-to-l from-transparent to-slate-400"></div>
  </div>
);

export default function Home() {
  const [currentRole, setCurrentRole] = useState(0);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentRole((prev) => (prev + 1) % roles.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current.children, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time
    ? time.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "Syncing...";

  let statusText = "Available for freelance";
  let statusIcon = "🟢";
  
  if (time) {
    const hour = parseInt(time.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: false, hour: "numeric" }));
    if (hour >= 0 && hour < 6) {
      statusText = "Late night coding";
      statusIcon = "☕";
    } else if (hour >= 6 && hour < 12) {
      statusText = "Building & brewing coffee";
      statusIcon = "🌅";
    } else if (hour >= 12 && hour < 18) {
      statusText = "Deep in architecture";
      statusIcon = "💻";
    } else {
      statusText = "Available for freelance";
      statusIcon = "🟢";
    }
  }

  const sectionReveal = { 
    initial: { opacity: 0, y: 40 }, 
    whileInView: { opacity: 1, y: 0 }, 
    viewport: { once: true, margin: "-100px" }, 
    transition: { duration: 0.7, ease: "easeOut" as const } 
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-slate-100">
      
      <div className="fixed top-[0%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* 1. FLAT BENTO BOX HERO SECTION */}
      <section className="relative z-10 flex flex-col justify-center min-h-screen px-4 sm:px-6 md:px-12 container mx-auto pt-28 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto max-w-7xl mx-auto w-full">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="md:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-3xl rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-white/80 flex flex-col justify-center relative group">
            <motion.p className="text-accent font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-3 relative z-10">
              <span className="h-[3px] w-8 bg-blue-600 inline-block rounded-full"></span> Welcome to my digital space 🚀
            </motion.p>
            <h1 ref={heroTextRef} className="font-syne text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-6 relative z-10 text-slate-900">
              <span className="inline-block">I'm</span>{" "}
              <span className="inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600">Arpan</span></span> <br />
              <span className="inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500">Singh.</span></span>
            </h1>
            <div className="h-10 sm:h-12 lg:h-16 mb-4 relative z-10">
              <motion.p key={currentRole} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4, type: "spring" }} className="text-xl sm:text-2xl lg:text-4xl font-sans text-slate-700 font-medium">
                Building the future as a <span className="text-blue-600 font-bold">{roles[currentRole]}</span>
              </motion.p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="md:col-span-1 lg:col-span-1 md:row-span-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white overflow-hidden relative min-h-[400px] md:min-h-full group">
            {/* NEXT.JS IMAGE OPTIMIZATION APPLIED HERE */}
            <Image 
              src="/hero-photo.jpg" 
              alt="Arpan Singh" 
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute inset-0 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white z-10 pointer-events-none">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <MapPin size={16} className="text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Bhilai, CG</span>
              </div>
              <p className="font-syne font-bold text-lg leading-tight">Engineering logic. <br/>Designing experiences.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="md:col-span-1 lg:col-span-1 bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl border border-slate-800 flex flex-col justify-center hover:bg-slate-800 transition-colors">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-cyan-400"><Code2 size={24} /></div>
            <h3 className="font-syne text-2xl font-bold mb-2">Current Focus</h3>
            <p className="text-slate-400 font-sans text-sm">B.Tech IT at SSTC. Prepping for GATE 2027 while shipping architectures.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="md:col-span-1 lg:col-span-1 bg-white/60 backdrop-blur-3xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-white/80 flex flex-col justify-center relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-green-400/30 transition-colors duration-500"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{statusIcon}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Status</span>
            </div>
            <h3 className="font-syne text-3xl font-bold text-slate-900 mb-1 tracking-tight">{timeString}</h3>
            <p className="text-slate-600 font-sans text-sm font-bold">{statusText}</p>
            <div className="mt-auto pt-4 flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Local Time (IST)</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="md:col-span-1 lg:col-span-1 flex flex-col gap-4">
            <Link href="/projects" className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] p-6 text-white flex flex-col justify-between group shadow-lg shadow-blue-500/20 border border-blue-400/30 hover:scale-[1.02] transition-transform relative overflow-hidden">
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-0"></div>
              <div className="flex justify-between items-start relative z-10">
                <h3 className="font-syne text-xl font-bold">Deployments &<br/>Case Studies</h3>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors"><ArrowRight size={20} /></div>
              </div>
            </Link>
            <a href="/resume.pdf" download className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-5 border-2 border-white/80 text-slate-800 font-bold flex items-center justify-center gap-3 hover:bg-white transition-colors shadow-sm hover:scale-[1.02]">
              <FileText size={20} className="text-slate-500" /> Download CV
            </a>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* 2. SKILLS BENTO SECTION */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: "Backend Magic 🔮", icon: <Database className="text-cyan-500 w-10 h-10 mb-4" />, desc: "Python, Firebase, Node.js" },
              { title: "Pixel Perfect UI ✨", icon: <LayoutTemplate className="text-indigo-500 w-10 h-10 mb-4" />, desc: "Next.js, TypeScript, Figma" },
              { title: "AI Innovation 🤖", icon: <Code2 className="text-blue-500 w-10 h-10 mb-4" />, desc: "Generative AI, Prompt Engineering" },
            ].map((skill, i) => (
              <motion.div key={i} {...sectionReveal} transition={{ delay: i * 0.1, duration: 0.5 }} className="p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all group">
                {skill.icon}
                <h3 className="font-syne text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">{skill.title}</h3>
                <p className="text-slate-600 text-md font-sans">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...sectionReveal} className="mt-8 flex justify-end">
             <Link href="/skills" className="px-6 py-3 bg-white/60 backdrop-blur-xl border-2 border-white/80 rounded-2xl flex items-center gap-2 text-slate-900 font-bold hover:bg-white transition-colors shadow-sm">
               Explore Full Tech Stack <ArrowRight size={18} />
             </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* 3. ENHANCED ABOUT ME BENTO SECTION (Optimized for all screens) */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          <motion.div {...sectionReveal} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 md:p-12 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-8 lg:gap-12 items-center relative overflow-hidden">
            
            <div className="absolute -left-32 -top-32 w-96 h-96 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-xs sm:text-sm mb-6 shadow-sm">
                <User size={16} /> WHO I AM
              </div>
              <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                Engineering student by day,<br className="hidden sm:block"/> creative developer by night.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-sans mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Currently pursuing my B.Tech in IT at Shri Shankaracharya Technical Campus (SSTC) and rigorously preparing for GATE 2027. I bridge the gap between heavy backend logic and beautiful, user-centric design.
              </p>
              <Link href="/about" className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base">
                Read Full Story
              </Link>
            </div>

            <div className="w-full lg:w-1/2 relative min-h-[320px] sm:min-h-[400px] rounded-[1.5rem] sm:rounded-[2rem] flex flex-col overflow-hidden group bg-white shadow-xl border border-slate-200">
               
               <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-cyan-400/10 rounded-full blur-[40px] sm:blur-[60px] pointer-events-none group-hover:bg-cyan-400/20 transition-colors duration-700"></div>
               <div className="absolute bottom-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-purple-400/10 rounded-full blur-[40px] sm:blur-[60px] pointer-events-none group-hover:bg-purple-400/20 transition-colors duration-700"></div>

               <div className="flex-1 w-full h-full bg-transparent flex flex-col overflow-hidden relative z-10">
                   <div className="h-10 sm:h-12 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 sm:px-6 gap-1.5 sm:gap-2 shrink-0">
                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
                     <span className="mx-auto text-xs sm:text-sm text-slate-500 font-mono flex items-center gap-2"><Terminal size={14} className="text-slate-400 hidden sm:block"/> developer.py</span>
                   </div>
                   
                   <div className="p-4 sm:p-6 lg:p-8 font-mono text-[10px] sm:text-xs md:text-sm lg:text-base leading-loose overflow-x-auto text-slate-700 relative z-10 flex flex-col justify-center h-full">
                      <div className="flex gap-2 whitespace-nowrap">
                        <span className="text-blue-600 font-bold">class</span>
                        <span className="text-amber-600">Developer</span><span className="text-slate-500">() :</span>
                      </div>
                      <div className="pl-4 sm:pl-8 flex flex-col mt-1 sm:mt-2">
                        <div className="flex gap-2 whitespace-nowrap"><span className="text-blue-600">def</span> <span className="text-indigo-600">__init__</span><span className="text-slate-500">(self):</span></div>
                        <div className="pl-4 sm:pl-8 flex flex-col mt-1 sm:mt-2 gap-1 sm:gap-1.5">
                           <span className="whitespace-nowrap"><span className="text-blue-500">self</span>.name = <span className="text-emerald-600">"Arpan Singh"</span></span>
                           <span className="whitespace-nowrap"><span className="text-blue-500">self</span>.role = <span className="text-emerald-600">"Backend & UI/UX"</span></span>
                           <span className="whitespace-nowrap"><span className="text-blue-500">self</span>.location = <span className="text-emerald-600">"Bhilai, CG"</span></span>
                           <span className="whitespace-nowrap"><span className="text-blue-500">self</span>.target = <span className="text-emerald-600">"GATE 2027"</span></span>
                           <span className="whitespace-nowrap"><span className="text-blue-500">self</span>.orgs = [<span className="text-emerald-600">"Swaang"</span>, <span className="text-emerald-600">"GDSC"</span>]</span>
                           <span className="flex items-center gap-1 whitespace-nowrap"><span className="text-blue-500">self</span>.status = <span className="text-emerald-600">"Building"</span><span className="w-1.5 sm:w-2.5 h-3 sm:h-5 bg-slate-800 animate-pulse inline-block ml-1"></span></span>
                        </div>
                      </div>
                   </div>
               </div>

            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* 4. LIGHT MODE "MACOS" PROJECTS SECTION */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          <motion.div {...sectionReveal} className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-sm mb-4 shadow-sm">
                <Briefcase size={16} /> PORTFOLIO
              </div>
              <h2 className="font-syne text-4xl font-bold text-slate-900">Featured Work.</h2>
            </div>
            <Link href="/projects" className="px-6 py-3 bg-white/60 backdrop-blur-xl border-2 border-white/80 text-slate-900 font-bold rounded-2xl hover:bg-white transition-colors flex items-center gap-2 shadow-sm hover:-translate-y-1">
              View All Repos <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            <motion.div {...sectionReveal} className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all flex flex-col">
              <div className="h-10 bg-slate-100/80 backdrop-blur-md flex items-center px-6 gap-2 border-b border-slate-200 relative">
                <div className="flex gap-2 absolute left-6">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-xs font-mono text-slate-500">swaang-connect.js</div>
              </div>
              <div className="h-48 bg-slate-50 p-8 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-400/20 blur-[50px] rounded-full pointer-events-none"></div>
                <h3 className="font-syne text-3xl font-bold text-slate-900 relative z-10">Swaang Connect</h3>
                <LayoutTemplate size={80} className="absolute top-8 right-8 text-cyan-600/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8 bg-transparent flex-1 flex flex-col border-t border-slate-100">
                <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">Complete digital platform and application built for the SSTC drama club to manage events, scripts, and member operations.</p>
                <div className="flex gap-2 flex-wrap mt-auto">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 shadow-sm">JavaScript</span>
                  <span className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold border border-cyan-100 shadow-sm">Firebase</span>
                </div>
              </div>
            </motion.div>

            <motion.div {...sectionReveal} className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all flex flex-col">
              <div className="h-10 bg-slate-100/80 backdrop-blur-md flex items-center px-6 gap-2 border-b border-slate-200 relative">
                <div className="flex gap-2 absolute left-6">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto text-xs font-mono text-slate-500">neatdesk_gui.py</div>
              </div>
              <div className="h-48 bg-slate-50 p-8 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-400/20 blur-[50px] rounded-full pointer-events-none"></div>
                <h3 className="font-syne text-3xl font-bold text-slate-900 relative z-10">NeatDesk</h3>
                <Code2 size={80} className="absolute top-8 right-8 text-purple-600/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8 bg-transparent flex-1 flex flex-col border-t border-slate-100">
                <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">A smart, GUI-based desktop application built to automatically organize files and optimize desktop environments seamlessly.</p>
                <div className="flex gap-2 flex-wrap mt-auto">
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100 shadow-sm">Python</span>
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 shadow-sm">GUI Architecture</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 5. CERTIFICATIONS BENTO SECTION */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          <motion.div {...sectionReveal} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-12 text-center border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-700 font-bold text-sm mb-6 mx-auto">
              <Award size={16} /> CONTINUOUS LEARNING
            </div>
            <h2 className="font-syne text-4xl font-bold text-slate-900 mb-6">12+ Professional Certifications</h2>
            <p className="text-lg text-slate-600 font-sans mb-10 max-w-2xl mx-auto">
              Validated expertise from industry leaders including Google, Microsoft, LinkedIn, and Coursera in fields spanning Generative AI, UX Design, and Cybersecurity.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-10 opacity-60">
              <span className="font-bold text-slate-500 text-xl">Google</span>
              <span className="font-bold text-slate-500 text-xl">•</span>
              <span className="font-bold text-slate-500 text-xl">Microsoft</span>
              <span className="font-bold text-slate-500 text-xl">•</span>
              <span className="font-bold text-slate-500 text-xl">Coursera</span>
            </div>
            <Link href="/certifications" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
              View Certificates Vault
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* 6. CALL TO ACTION BENTO SECTION */}
      <section className="relative z-20 py-8 mb-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          <motion.div {...sectionReveal} className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-syne text-5xl md:text-6xl font-bold mb-6 leading-tight">Ready to collaborate?</h2>
              <p className="text-slate-400 text-lg mb-10">
                Whether it is a scalable backend architecture, a sleek UI/UX design, or deploying the next big idea. I'm ready to build.
              </p>
              <Link href="/contact" className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all text-lg inline-flex items-center justify-center gap-3 shadow-xl">
                <Send size={20} /> Say Hello
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
