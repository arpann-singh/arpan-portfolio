"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight, Code2, Database, LayoutTemplate, User,
  Briefcase, Award, Send, FileText, MapPin, Terminal,
  Disc, Star
} from "lucide-react";
import ApertureWidget from "@/components/ApertureWidget";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

// --- 3D TILT CARD COMPONENT ---
const TiltCard = ({ children, className, ...rest }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...rest.style }}
      className={`relative ${className}`}
      {...rest}
    >
      <div style={{ transform: "translateZ(20px)", width: "100%", height: "100%" }} className="relative h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

const roles = [
  { text: "an IT Student", emoji: "🎓" },
  { text: "a Developer", emoji: "🐍" },
  { text: "a UI/UX Designer", emoji: "🎨" },
  { text: "a GDG Member", emoji: "💻" },
];

const SectionDivider = () => (
  <div className="w-full max-w-5xl mx-auto py-8 sm:py-14 flex items-center justify-center pointer-events-none px-6">
    <div className="w-1/3 h-[2px] bg-gradient-to-r from-transparent to-slate-300/80 rounded-full"></div>
    <div className="mx-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] ring-4 ring-blue-500/20"></div>
    <div className="w-1/3 h-[2px] bg-gradient-to-l from-transparent to-slate-300/80 rounded-full"></div>
  </div>
);

export default function Home() {
  const [currentRole, setCurrentRole] = useState(0);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);

  const [spotifyData, setSpotifyData] = useState({
    isPlaying: false,
    song: "Loading...",
    artist: "Spotify",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop"
  });

  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [featuredCerts, setFeaturedCerts] = useState<any[]>([]);

  useEffect(() => {
    const unsubProjects = onSnapshot(query(collection(db, "custom_projects"), where("featured", "==", true)), (snap) => {
      setFeaturedProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, 2));
    });
    const unsubCerts = onSnapshot(query(collection(db, "certifications"), where("featured", "==", true)), (snap) => {
      setFeaturedCerts(snap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, 2));
    });
    return () => { unsubProjects(); unsubCerts(); };
  }, []);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentRole((prev) => (prev + 1) % roles.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch('/api/spotify');
        if (!res.ok) return;
        const data = await res.json();
        if (data.isPlaying) {
          setSpotifyData({ isPlaying: true, song: data.title, artist: data.artist, coverUrl: data.albumImageUrl });
        } else {
          setSpotifyData({ isPlaying: false, song: "Not Playing", artist: "Spotify", coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop" });
        }
      } catch (error) { }
    };
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 10000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time ? time.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "Syncing...";
  let statusText = "Available for freelance";
  let statusIcon = "🟢";

  if (time) {
    const hour = parseInt(time.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: false, hour: "numeric" }));
    if (hour >= 0 && hour < 6) { statusText = "Late night coding"; statusIcon = "☕"; }
    else if (hour >= 6 && hour < 12) { statusText = "Building & brewing coffee"; statusIcon = "🌅"; }
    else if (hour >= 12 && hour < 18) { statusText = "Deep in architecture"; statusIcon = "💻"; }
  }

  const sectionReveal = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-20px" },
    transition: { duration: 0.7, ease: "easeOut" as const }
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full max-w-[100vw] overflow-x-hidden overflow-y-auto bg-slate-100 pb-20 sm:pb-32">

      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <motion.div animate={{ x: [0, 20, -10, 0], y: [0, -30, 10, 0], scale: [1, 1.1, 0.9, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="fixed top-[0%] left-[-10%] sm:left-[5%] w-[80vw] max-w-[500px] aspect-square bg-blue-400/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0" />
      <motion.div animate={{ x: [0, -20, 10, 0], y: [0, 20, -10, 0], scale: [1, 1.05, 0.95, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="fixed bottom-[10%] right-[-10%] sm:right-[10%] w-[70vw] max-w-[400px] aspect-square bg-purple-400/20 rounded-full blur-[70px] sm:blur-[100px] pointer-events-none z-0" />
      <motion.div animate={{ x: [0, 10, -20, 0], y: [0, -10, 20, 0], scale: [1, 0.95, 1.05, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="fixed top-[40%] left-[20%] sm:left-[40%] w-[60vw] max-w-[300px] aspect-square bg-cyan-400/20 rounded-full blur-[60px] sm:blur-[90px] pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col justify-center min-h-screen px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 container mx-auto pt-32 sm:pt-36 pb-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 auto-rows-fr max-w-7xl mx-auto w-full min-w-0">

          {/* MAIN WELCOME CARD */}
          <TiltCard
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-3xl rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-white/80 flex flex-col justify-center relative group cursor-default overflow-hidden h-full min-w-0"
          >
            <motion.p className="text-blue-600 font-bold tracking-widest uppercase mb-4 text-[10px] sm:text-xs flex items-center gap-2 sm:gap-3 relative z-10">
              <span className="h-[3px] w-6 sm:w-8 bg-blue-600 inline-block rounded-full"></span> Welcome to my digital space 🚀
            </motion.p>

            <h1 ref={heroTextRef} className="font-syne text-[2rem] leading-[1.1] sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold tracking-tighter mb-4 relative z-10 text-slate-900 pointer-events-none break-words whitespace-normal">
              <span className="block mb-1 sm:mb-2 text-slate-800">I'm</span>
              <div className="min-h-[2.5em] sm:min-h-[1.3em] flex items-center mt-1 w-full max-w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRole}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                    className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 max-w-full"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 pb-1 pr-2 break-words whitespace-normal">
                      {roles[currentRole].text}
                    </span>
                    <span className="text-3xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl inline-block drop-shadow-sm pb-1 shrink-0">
                      {roles[currentRole].emoji}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </h1>

            <div className="relative z-10 mt-2 sm:mt-3 pointer-events-none max-w-full">
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed break-words whitespace-normal">
                Merging <span className="text-blue-600 font-bold">complex logic</span> with <span className="text-blue-600 font-bold">elegant design</span>.
              </p>
            </div>
          </TiltCard>

          {/* PHOTO CARD */}
          <TiltCard
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white overflow-hidden relative min-h-[300px] sm:min-h-[350px] lg:min-h-0 h-full w-full group min-w-0"
          >
            <div className="absolute inset-0 w-full h-full min-w-0">
              <Image src="/hero-photo.jpg" alt="Arpan Singh" fill priority sizes="(max-width: 768px) 100vw, 25vw" className="absolute inset-0 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 text-white z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <MapPin size={14} className="text-cyan-400" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cyan-400">Bhilai, CG</span>
                </div>
                <p className="font-syne font-bold text-base sm:text-lg leading-tight">Engineering logic. <br />Designing experiences.</p>
              </div>
            </div>
          </TiltCard>

          {/* APERTURE WIDGET */}
          <TiltCard
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 md:col-span-1 lg:col-span-1 relative min-h-[200px] sm:min-h-[220px] lg:min-h-0 h-full w-full min-w-0"
          >
            <div className="w-full h-full overflow-hidden flex items-center justify-center min-w-0">
              <ApertureWidget />
            </div>
          </TiltCard>

          {/* SPOTIFY BENTO */}
          <TiltCard
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="col-span-1 md:col-span-1 lg:col-span-1 bg-white/60 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-white/80 flex flex-col justify-between relative overflow-hidden group cursor-default h-full w-full min-w-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-green-400/30 transition-colors duration-500"></div>
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3"><span className="text-lg sm:text-xl">{statusIcon}</span><span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Live Status</span></div>
              <h3 className="font-syne text-2xl sm:text-3xl font-bold text-slate-900 mb-1 tracking-tight truncate">{timeString}</h3>
              <p className="text-slate-600 font-sans text-xs sm:text-sm font-bold truncate">{statusText}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-3 relative z-10 pointer-events-none">
              <div className="relative w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                <div className={`absolute inset-0 ${spotifyData.isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}><Image src={spotifyData.coverUrl} fill alt="Album Art" className="object-cover" /></div>
                <div className="absolute w-2.5 h-2.5 bg-white rounded-full z-10 border border-slate-200 shadow-sm"></div>
              </div>
              <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {spotifyData.isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3">
                      {[1, 2, 3].map((i) => (<motion.span key={i} className="w-[3px] bg-[#1DB954] rounded-full" animate={{ height: ["4px", "12px", "4px"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }} />))}
                    </div>
                  ) : (<Disc size={10} className="text-slate-400 shrink-0" />)}
                  <span className={`text-[9px] font-bold uppercase tracking-wider truncate ${spotifyData.isPlaying ? 'text-[#1DB954]' : 'text-slate-400'}`}>{spotifyData.isPlaying ? 'Now Playing' : 'Spotify Offline'}</span>
                </div>
                <p className="text-slate-900 font-bold text-xs sm:text-sm truncate leading-tight w-full">{spotifyData.song}</p>
                <p className="text-slate-500 text-[10px] sm:text-xs truncate w-full">{spotifyData.artist}</p>
              </div>
            </div>
          </TiltCard>

          {/* ACTION BUTTONS */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-4 sm:gap-5 h-full w-full min-w-0">
            <TiltCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] p-5 sm:p-6 text-white flex flex-col justify-between group shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-transform relative overflow-hidden min-h-[120px] sm:min-h-0 h-full w-full block min-w-0">
              <Link href="/projects" className="absolute inset-0 w-full h-full z-20"></Link>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-0"></div>
              <div className="flex justify-between items-start relative z-10 w-full pointer-events-none">
                <h3 className="font-syne text-lg sm:text-xl font-bold leading-tight break-words whitespace-normal">Deployments &<br />Case Studies</h3>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors shrink-0"><ArrowRight size={18} /></div>
              </div>
            </TiltCard>

            <TiltCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="h-[60px] sm:h-[72px] shrink-0 bg-white/80 backdrop-blur-3xl rounded-[2rem] p-4 sm:p-5 border-2 border-white/80 text-slate-800 font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-sm w-full block relative min-w-0">
              <a href="/resume.pdf" download className="absolute inset-0 w-full h-full z-20"></a>
              <div className="flex items-center justify-center gap-2 pointer-events-none text-sm sm:text-base"><FileText size={18} className="text-slate-500 shrink-0" /> <span className="truncate">Download CV</span></div>
            </TiltCard>
          </div>

        </div>
      </section>

      <SectionDivider />

      {/* SKILLS */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-w-0">
            {[
              { title: "Backend Magic 🔮", icon: <Database className="text-cyan-500 w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 shrink-0" />, desc: "Python, Firebase, Node.js" },
              { title: "Pixel Perfect UI ✨", icon: <LayoutTemplate className="text-indigo-500 w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 shrink-0" />, desc: "Next.js, TypeScript, Figma" },
              { title: "AI Innovation 🤖", icon: <Code2 className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 shrink-0" />, desc: "Generative AI, Prompt Engineering" }
            ].map((skill, i) => (
              <TiltCard key={i} {...sectionReveal} transition={{ delay: i * 0.1, duration: 0.5 }} className="p-6 sm:p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group cursor-default min-w-0">
                {skill.icon}
                <h3 className="font-syne text-lg sm:text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors pointer-events-none truncate">{skill.title}</h3>
                <p className="text-slate-600 text-sm sm:text-md font-sans pointer-events-none break-words whitespace-normal">{skill.desc}</p>
              </TiltCard>
            ))}
          </div>
          <motion.div {...sectionReveal} className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
            <Link href="/skills" className="px-6 py-3 bg-white/60 backdrop-blur-xl border-2 border-white/80 rounded-2xl flex items-center gap-2 text-slate-900 font-bold hover:bg-white transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto justify-center hover:scale-[1.02]">
              Explore Full Tech Stack <ArrowRight size={18} className="shrink-0" />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ABOUT */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl min-w-0">
          <TiltCard {...sectionReveal} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 lg:p-16 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden min-w-0">
            <div className="absolute -left-32 -top-32 w-96 h-96 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center relative z-10 min-w-0">
              <div className="flex flex-col justify-center text-left items-start min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-[10px] sm:text-xs mb-4 sm:mb-6 shadow-sm">
                  <User size={14} className="shrink-0" /> WHO I AM
                </div>
                <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight break-words whitespace-normal w-full">
                  Engineering student by day, creative developer by night.
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-sans mb-6 sm:mb-8 leading-relaxed break-words whitespace-normal w-full">
                  Currently pursuing my B.Tech in IT at Shri Shankaracharya Technical Campus (SSTC) and rigorously preparing for GATE 2027. I bridge the gap between heavy backend logic and beautiful, user-centric design.
                </p>
                <Link href="/about" className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto justify-center relative z-20 shrink-0">
                  Read Full Story
                </Link>
              </div>

              <div className="relative min-h-[300px] md:min-h-[350px] lg:min-h-[400px] w-full rounded-[2rem] flex flex-col overflow-hidden group bg-white shadow-xl border border-slate-200 pointer-events-none min-w-0">
                <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-cyan-400/10 rounded-full blur-[40px] md:blur-[60px] pointer-events-none transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-purple-400/10 rounded-full blur-[40px] md:blur-[60px] pointer-events-none transition-colors duration-700"></div>

                <div className="flex-1 w-full h-full bg-transparent flex flex-col overflow-hidden relative z-10 min-w-0">
                  <div className="h-10 md:h-12 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 md:px-6 gap-1.5 sm:gap-2 shrink-0 w-full">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56] shrink-0"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e] shrink-0"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27c93f] shrink-0"></div>
                    <span className="mx-auto text-[10px] sm:text-xs md:text-sm text-slate-500 font-mono flex items-center gap-2 truncate">
                      <Terminal size={14} className="text-slate-400 hidden sm:block shrink-0" /> developer.py
                    </span>
                  </div>

                  <div className="p-4 sm:p-6 md:p-8 font-mono text-[10px] sm:text-xs md:text-sm lg:text-base leading-loose overflow-x-auto text-slate-700 relative z-10 flex flex-col justify-center h-full w-full min-w-0">
                    <div className="flex gap-2 whitespace-nowrap min-w-max">
                      <span className="text-blue-600 font-bold">class</span><span className="text-amber-600">Developer</span><span className="text-slate-500">() :</span>
                    </div>
                    <div className="pl-4 md:pl-8 flex flex-col mt-2 min-w-max">
                      <div className="flex gap-2 whitespace-nowrap"><span className="text-blue-600">def</span> <span className="text-indigo-600">__init__</span><span className="text-slate-500">(self):</span></div>

                      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 1 }, visible: { transition: { staggerChildren: 0.15 } } }} className="pl-4 md:pl-8 flex flex-col mt-1 sm:mt-2 gap-1 sm:gap-1.5">
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap"><span className="text-blue-500">self</span>.name = <span className="text-emerald-600">"Arpan Singh"</span></motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap"><span className="text-blue-500">self</span>.role = <span className="text-emerald-600">"Backend & UI/UX"</span></motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap"><span className="text-blue-500">self</span>.location = <span className="text-emerald-600">"Bhilai, CG"</span></motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap"><span className="text-blue-500">self</span>.target = <span className="text-emerald-600">"GATE 2027"</span></motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap"><span className="text-blue-500">self</span>.orgs = [<span className="text-emerald-600">"Swaang"</span>, <span className="text-emerald-600">"GDSC"</span>]</motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="flex items-center gap-1 whitespace-nowrap"><span className="text-blue-500">self</span>.status = <span className="text-emerald-600">"Building"</span><span className="w-1.5 h-3 md:w-2.5 md:h-5 bg-slate-800 animate-pulse inline-block ml-1"></span></motion.span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </TiltCard>
        </div>
      </section>

      <SectionDivider />

      {/* --- ENHANCED TOP PROJECTS --- */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl min-w-0">
          <motion.div {...sectionReveal} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 gap-4 sm:gap-6 min-w-0">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-[10px] sm:text-sm mb-3 sm:mb-4 shadow-sm">
                <Star size={14} className="fill-blue-700 shrink-0" /> FEATURED WORK
              </div>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold text-slate-900 truncate">Top Projects.</h2>
            </div>
            <Link href="/projects" className="px-6 py-3 bg-white/60 backdrop-blur-xl border-2 border-white/80 text-slate-900 font-bold rounded-2xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] w-full md:w-auto text-sm sm:text-base shrink-0">
              View All Repos <ArrowRight size={18} className="shrink-0" />
            </Link>
          </motion.div>

          {featuredProjects.length === 0 ? (
            <div className="w-full p-8 sm:p-12 text-center bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-300 font-bold text-slate-400 text-sm sm:text-base">
              Add starred projects in the Admin Panel to display them here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 min-w-0">
              {featuredProjects.map((project, i) => (
                <TiltCard key={project.id} {...sectionReveal} transition={{ delay: i * 0.1 }} className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer min-w-0">

                  {/* Dynamic Mac Header */}
                  <div className="h-8 sm:h-10 bg-slate-100/80 backdrop-blur-md flex items-center px-4 sm:px-6 gap-1.5 sm:gap-2 border-b border-slate-200 relative w-full z-20">
                    <div className="flex gap-1.5 sm:gap-2 absolute left-4 sm:left-6">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="mx-auto text-[10px] sm:text-xs font-mono text-slate-500 truncate flex items-center gap-1.5">
                      <Code2 size={12} className="hidden sm:block" /> {project.title.toLowerCase().replace(/\s+/g, '-')}.ts
                    </div>
                  </div>

                  {/* Full Vibrancy Image Banner */}
                  <div className="h-48 sm:h-56 lg:h-64 bg-slate-100 relative overflow-hidden w-full border-b border-slate-100">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:14px_24px] z-10 pointer-events-none"></div>
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} fill className="absolute inset-0 object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out z-0" />
                    ) : (
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 rounded-full pointer-events-none blur-[40px] sm:blur-[50px] ${i % 2 === 0 ? 'bg-cyan-400/20' : 'bg-purple-400/20'}`}></div>
                    )}
                  </div>

                  {/* Clean Content Area */}
                  <div className="p-6 sm:p-8 bg-white flex-1 flex flex-col min-w-0 z-20 pointer-events-none">
                    <div className="flex justify-between items-start mb-3 sm:mb-4 gap-4">
                      <h3 className="font-syne text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {project.title}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all text-slate-400">
                        <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>

                    <p className="text-slate-600 mb-6 line-clamp-2 text-sm sm:text-base leading-relaxed break-words whitespace-normal">
                      {project.description}
                    </p>

                    <div className="flex gap-2 flex-wrap mt-auto">
                      {(project.tags || []).slice(0, 4).map((t: string) => (
                        <span key={t} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] sm:text-xs font-bold border border-slate-200/60 truncate max-w-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* CERTS */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl min-w-0">
          <TiltCard {...sectionReveal} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 lg:p-14 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-w-0">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-10 gap-4 sm:gap-6 w-full">
              <div className="text-center md:text-left pointer-events-none min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-700 font-bold text-[10px] sm:text-sm mb-3 sm:mb-4">
                  <Star size={14} className="fill-orange-700 shrink-0" /> FEATURED CERTIFICATES
                </div>
                <h2 className="font-syne text-3xl md:text-4xl font-bold text-slate-900 truncate w-full">Continuous Learning.</h2>
              </div>
              <Link href="/certifications" className="relative z-20 px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg text-sm sm:text-base w-full md:w-auto text-center shrink-0">
                View Full Vault
              </Link>
            </div>

            {featuredCerts.length === 0 ? (
              <div className="w-full py-8 text-center bg-white/50 rounded-2xl border border-dashed border-slate-300 font-bold text-slate-400 text-sm sm:text-base">
                Star certifications in the Admin Panel to display them here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pointer-events-none min-w-0">
                {featuredCerts.map((cert) => (
                  <div key={cert.id} className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 sm:gap-5 transition-all min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                      <Award size={24} className="sm:w-8 sm:h-8" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate w-full">{cert.title}</h3>
                      <p className="text-slate-500 text-xs sm:text-sm font-medium truncate w-full">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TiltCard>
        </div>
      </section>

      <SectionDivider />

      <section className="relative z-20 py-8 mb-6 sm:mb-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl min-w-0">
          <motion.div {...sectionReveal} className="bg-slate-900 text-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 md:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden min-w-0">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto min-w-0">
              <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight break-words whitespace-normal w-full">Ready to collaborate?</h2>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 px-4 sm:px-0 break-words whitespace-normal w-full">
                Whether it is a scalable backend architecture, a sleek UI/UX design, or deploying the next big idea. I'm ready to build.
              </p>
              <Link href="/contact" className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all text-sm sm:text-base lg:text-lg inline-flex items-center justify-center gap-3 shadow-xl w-full sm:w-auto shrink-0">
                <Send size={18} className="sm:w-5 sm:h-5 shrink-0" /> Say Hello
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
