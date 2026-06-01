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
  { text: "a Python Developer", emoji: "🐍" },
  { text: "a UI/UX Designer", emoji: "🎨" },
  { text: "a GDSC Member", emoji: "💡" },
];

const SectionDivider = () => (
  <div className="w-full max-w-5xl mx-auto py-10 sm:py-14 flex items-center justify-center pointer-events-none px-6">
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

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch('/api/spotify');
        if (!res.ok) return;
        const data = await res.json();
        if (data.isPlaying) {
          setSpotifyData({ 
            isPlaying: true, 
            song: data.title, 
            artist: data.artist, 
            coverUrl: data.albumImageUrl 
          });
        } else {
          setSpotifyData({ 
            isPlaying: false, 
            song: "Not Playing", 
            artist: "Spotify", 
            coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop" 
          });
        }
      } catch (error) {
        console.error("Spotify fetch error", error);
      }
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
    if (hour >= 0 && hour < 6) { 
      statusText = "Late night coding"; 
      statusIcon = "☕"; 
    } else if (hour >= 6 && hour < 12) { 
      statusText = "Building & brewing coffee"; 
      statusIcon = "🌅"; 
    } else if (hour >= 12 && hour < 18) { 
      statusText = "Deep in architecture"; 
      statusIcon = "💻"; 
    }
  }

  const sectionReveal = { 
    initial: { opacity: 0, y: 40 }, 
    whileInView: { opacity: 1, y: 0 }, 
    viewport: { once: true, margin: "-50px" }, 
    transition: { duration: 0.7, ease: "easeOut" as const } 
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-slate-100 pb-32">
      
      {/* --- LEVEL 2 ENHANCEMENTS: NOISE TEXTURE OVERLAY --- */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* --- LEVEL 2 ENHANCEMENTS: BREATHING ORBS --- */}
      <motion.div 
        animate={{ x: [0, 40, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.2, 0.9, 1] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} 
        className="fixed top-[0%] left-[-10%] sm:left-[5%] w-[80vw] max-w-[500px] aspect-square bg-blue-400/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0], scale: [1, 1.1, 0.95, 1] }} 
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} 
        className="fixed bottom-[10%] right-[-10%] sm:right-[10%] w-[70vw] max-w-[400px] aspect-square bg-purple-400/20 rounded-full blur-[70px] sm:blur-[100px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ x: [0, 20, -40, 0], y: [0, -20, 30, 0], scale: [1, 0.9, 1.1, 1] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} 
        className="fixed top-[40%] left-[20%] sm:left-[40%] w-[60vw] max-w-[300px] aspect-square bg-cyan-400/20 rounded-full blur-[60px] sm:blur-[90px] pointer-events-none z-0" 
      />

      {/* HERO SECTION - PERFECTLY ALIGNED BENTO GRID */}
      <section className="relative z-10 flex flex-col justify-center min-h-screen px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 container mx-auto pt-24 sm:pt-28 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 auto-rows-fr max-w-7xl mx-auto w-full">

          {/* MAIN WELCOME CARD */}
          <TiltCard 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-3xl rounded-[2rem] p-6 sm:p-8 lg:p-8 xl:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-white/80 flex flex-col justify-center relative group cursor-default overflow-hidden h-full"
          >
            <motion.p className="text-blue-600 font-bold tracking-widest uppercase mb-4 sm:mb-5 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 relative z-10">
              <span className="h-[3px] w-8 bg-blue-600 inline-block rounded-full"></span> Welcome to my digital space 🚀
            </motion.p>
            
            {/* Reduced text sizes on lg to prevent overflowing the emoji */}
            <h1 ref={heroTextRef} className="font-syne text-4xl sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold tracking-tighter leading-none mb-4 relative z-10 text-slate-900 pointer-events-none">
              <span className="block mb-1 text-slate-800">I'm</span>
              <div className="h-[1.2em] sm:h-[1.3em] flex items-center mt-1">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentRole} 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -15 }} 
                    transition={{ duration: 0.3 }} 
                    className="flex items-center gap-3 sm:gap-4 whitespace-nowrap"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 pb-1.5 pr-2">
                      {roles[currentRole].text}
                    </span>
                    <span className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl inline-block drop-shadow-sm pb-1.5">
                      {roles[currentRole].emoji}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </h1>

            <div className="relative z-10 mt-2 sm:mt-3 pointer-events-none">
              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium max-w-2xl leading-relaxed">
                Merging <span className="text-blue-600 font-bold">complex logic</span> with <span className="text-blue-600 font-bold">elegant design</span>.
              </p>
            </div>
          </TiltCard>

          {/* PHOTO CARD - Forced to match the height of the left columns */}
          <TiltCard 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white overflow-hidden relative min-h-[350px] lg:min-h-0 h-full w-full group"
          >
            <div className="absolute inset-0 w-full h-full">
              <Image 
                src="/hero-photo.jpg" 
                alt="Arpan Singh" 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 25vw" 
                className="absolute inset-0 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <MapPin size={16} className="text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Bhilai, CG</span>
                </div>
                <p className="font-syne font-bold text-lg leading-tight">Engineering logic. <br />Designing experiences.</p>
              </div>
            </div>
          </TiltCard>

          {/* APERTURE WIDGET */}
          <TiltCard 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            className="col-span-1 md:col-span-1 lg:col-span-1 relative min-h-[220px] lg:min-h-0 h-full w-full"
          >
            <div className="w-full h-full">
              <ApertureWidget />
            </div>
          </TiltCard>

          {/* LIGHT MODE STATUS & SPOTIFY BENTO */}
          <TiltCard 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }} 
            className="col-span-1 md:col-span-1 lg:col-span-1 bg-white/60 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-white/80 flex flex-col justify-between relative overflow-hidden group cursor-default h-full w-full"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-green-400/30 transition-colors duration-500"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{statusIcon}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Status</span>
              </div>
              <h3 className="font-syne text-3xl font-bold text-slate-900 mb-1 tracking-tight">{timeString}</h3>
              <p className="text-slate-600 font-sans text-sm font-bold">{statusText}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-3 relative z-10 pointer-events-none">
              <div className="relative w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                <div className={`absolute inset-0 ${spotifyData.isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                  <Image src={spotifyData.coverUrl} fill alt="Album Art" className="object-cover" />
                </div>
                <div className="absolute w-2.5 h-2.5 bg-white rounded-full z-10 border border-slate-200 shadow-sm"></div>
              </div>
              
              <div className="flex flex-col overflow-hidden flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {spotifyData.isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3">
                      {[1, 2, 3].map((i) => (
                        <motion.span
                          key={i}
                          className="w-[3px] bg-[#1DB954] rounded-full"
                          animate={{ height: ["4px", "12px", "4px"] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Disc size={10} className="text-slate-400" />
                  )}
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${spotifyData.isPlaying ? 'text-[#1DB954]' : 'text-slate-400'}`}>
                    {spotifyData.isPlaying ? 'Now Playing' : 'Spotify Offline'}
                  </span>
                </div>
                <p className="text-slate-900 font-bold text-sm truncate leading-tight">{spotifyData.song}</p>
                <p className="text-slate-500 text-xs truncate">{spotifyData.artist}</p>
              </div>
            </div>
          </TiltCard>

          {/* ACTION BUTTONS (Split into 2 independent flex items to fill height correctly) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-4 sm:gap-5 h-full w-full">
            <TiltCard 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.5 }} 
              className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] p-6 text-white flex flex-col justify-between group shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-transform relative overflow-hidden h-full w-full block"
            >
              <Link href="/projects" className="absolute inset-0 w-full h-full z-20"></Link>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-0"></div>
              <div className="flex justify-between items-start relative z-10 w-full pointer-events-none">
                <h3 className="font-syne text-xl font-bold leading-tight">Deployments &<br />Case Studies</h3>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors shrink-0">
                  <ArrowRight size={20} />
                </div>
              </div>
            </TiltCard>
            
            <TiltCard 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.6 }} 
              className="h-[72px] shrink-0 bg-white/80 backdrop-blur-3xl rounded-[2rem] p-5 border-2 border-white/80 text-slate-800 font-bold flex items-center justify-center gap-3 hover:bg-white transition-colors shadow-sm w-full block relative"
            >
              <a href="/resume.pdf" download className="absolute inset-0 w-full h-full z-20"></a>
              <div className="flex items-center justify-center gap-3 pointer-events-none">
                <FileText size={20} className="text-slate-500" /> Download CV
              </div>
            </TiltCard>
          </div>

        </div>
      </section>

      <SectionDivider />

      {/* SKILLS */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-6 sm:px-10 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-8">
            {[ 
              { title: "Backend Magic 🔮", icon: <Database className="text-cyan-500 w-10 h-10 mb-4" />, desc: "Python, Firebase, Node.js" }, 
              { title: "Pixel Perfect UI ✨", icon: <LayoutTemplate className="text-indigo-500 w-10 h-10 mb-4" />, desc: "Next.js, TypeScript, Figma" }, 
              { title: "AI Innovation 🤖", icon: <Code2 className="text-blue-500 w-10 h-10 mb-4" />, desc: "Generative AI, Prompt Engineering" } 
            ].map((skill, i) => (
              <TiltCard 
                key={i} 
                {...sectionReveal} 
                transition={{ delay: i * 0.1, duration: 0.5 }} 
                className="p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group cursor-default"
              >
                {skill.icon}
                <h3 className="font-syne text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors pointer-events-none">
                  {skill.title}
                </h3>
                <p className="text-slate-600 text-md font-sans pointer-events-none">
                  {skill.desc}
                </p>
              </TiltCard>
            ))}
          </div>
          <motion.div {...sectionReveal} className="mt-8 flex justify-center sm:justify-end">
            <Link 
              href="/skills" 
              className="px-6 py-3 bg-white/60 backdrop-blur-xl border-2 border-white/80 rounded-2xl flex items-center gap-2 text-slate-900 font-bold hover:bg-white transition-colors shadow-sm text-base w-full sm:w-auto justify-center hover:scale-[1.02]"
            >
              Explore Full Tech Stack <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ABOUT (FIXED GRID LAYOUT FOR TERMINAL) */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-6 sm:px-10 md:px-12 lg:px-16 max-w-7xl">
          <TiltCard 
            {...sectionReveal} 
            className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
          >
            <div className="absolute -left-32 -top-32 w-96 h-96 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center relative z-10">
              
              {/* Left Side: Text Paragraph */}
              <div className="flex flex-col justify-center text-left items-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-xs sm:text-sm mb-6 shadow-sm">
                  <User size={16} /> WHO I AM
                </div>
                <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                  Engineering student by day,<br className="hidden sm:block" /> creative developer by night.
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-sans mb-8 leading-relaxed max-w-2xl">
                  Currently pursuing my B.Tech in IT at Shri Shankaracharya Technical Campus (SSTC) and rigorously preparing for GATE 2027. I bridge the gap between heavy backend logic and beautiful, user-centric design.
                </p>
                <Link 
                  href="/about" 
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto justify-center relative z-20"
                >
                  Read Full Story
                </Link>
              </div>
              
              {/* Right Side: Animated Terminal Box */}
              <div className="relative min-h-[320px] md:min-h-[400px] w-full rounded-[2rem] flex flex-col overflow-hidden group bg-white shadow-xl border border-slate-200 pointer-events-none">
                <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-cyan-400/10 rounded-full blur-[40px] md:blur-[60px] pointer-events-none group-hover:bg-cyan-400/20 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-purple-400/10 rounded-full blur-[40px] md:blur-[60px] pointer-events-none group-hover:bg-purple-400/20 transition-colors duration-700"></div>
                
                <div className="flex-1 w-full h-full bg-transparent flex flex-col overflow-hidden relative z-10">
                  <div className="h-10 md:h-12 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 md:px-6 gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27c93f]"></div>
                    <span className="mx-auto text-xs md:text-sm text-slate-500 font-mono flex items-center gap-2">
                      <Terminal size={14} className="text-slate-400 hidden sm:block" /> developer.py
                    </span>
                  </div>
                  
                  <div className="p-5 sm:p-6 md:p-8 font-mono text-xs md:text-sm lg:text-base leading-loose overflow-x-auto text-slate-700 relative z-10 flex flex-col justify-center h-full w-full">
                    <div className="flex gap-2 whitespace-nowrap min-w-max">
                      <span className="text-blue-600 font-bold">class</span>
                      <span className="text-amber-600">Developer</span>
                      <span className="text-slate-500">() :</span>
                    </div>
                    <div className="pl-4 md:pl-8 flex flex-col mt-2 min-w-max">
                      <div className="flex gap-2 whitespace-nowrap">
                        <span className="text-blue-600">def</span> 
                        <span className="text-indigo-600">__init__</span>
                        <span className="text-slate-500">(self):</span>
                      </div>
                      
                      {/* Animated Typing Stagger */}
                      <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                          hidden: { opacity: 1 },
                          visible: { transition: { staggerChildren: 0.15 } }
                        }}
                        className="pl-4 md:pl-8 flex flex-col mt-2 gap-1.5"
                      >
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap">
                          <span className="text-blue-500">self</span>.name = <span className="text-emerald-600">"Arpan Singh"</span>
                        </motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap">
                          <span className="text-blue-500">self</span>.role = <span className="text-emerald-600">"Backend & UI/UX"</span>
                        </motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap">
                          <span className="text-blue-500">self</span>.location = <span className="text-emerald-600">"Bhilai, CG"</span>
                        </motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap">
                          <span className="text-blue-500">self</span>.target = <span className="text-emerald-600">"GATE 2027"</span>
                        </motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="whitespace-nowrap">
                          <span className="text-blue-500">self</span>.orgs = [<span className="text-emerald-600">"Swaang"</span>, <span className="text-emerald-600">"GDSC"</span>]
                        </motion.span>
                        <motion.span variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-blue-500">self</span>.status = <span className="text-emerald-600">"Building"</span>
                          <span className="w-1.5 h-3 md:w-2.5 md:h-5 bg-slate-800 animate-pulse inline-block ml-1"></span>
                        </motion.span>
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

      {/* PROJECTS */}
      <section className="relative z-20 py-8">
        <div className="container mx-auto px-6 sm:px-10 md:px-12 lg:px-16 max-w-7xl">
          <motion.div {...sectionReveal} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-sm mb-4 shadow-sm">
                <Star size={16} className="fill-blue-700" /> FEATURED WORK
              </div>
              <h2 className="font-syne text-4xl font-bold text-slate-900">Top Projects.</h2>
            </div>
            <Link 
              href="/projects" 
              className="px-6 py-3 bg-white/60 backdrop-blur-xl border-2 border-white/80 text-slate-900 font-bold rounded-2xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] w-full md:w-auto text-base"
            >
              View All Repos <ArrowRight size={18} />
            </Link>
          </motion.div>
          
          {featuredProjects.length === 0 ? (
            <div className="w-full p-12 text-center bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-300 font-bold text-slate-400">
              Add starred projects in the Admin Panel to display them here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
              {featuredProjects.map((project, i) => (
                <TiltCard 
                  key={project.id} 
                  {...sectionReveal} 
                  transition={{ delay: i * 0.1 }} 
                  className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col cursor-pointer"
                >
                  <div className="h-10 bg-slate-100/80 backdrop-blur-md flex items-center px-6 gap-2 border-b border-slate-200 relative">
                    <div className="flex gap-2 absolute left-6">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="mx-auto text-xs font-mono text-slate-500">project.ts</div>
                  </div>
                  
                  <div className="h-48 sm:h-56 bg-slate-50 p-8 flex items-end relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none blur-[50px] ${i % 2 === 0 ? 'bg-cyan-400/20' : 'bg-purple-400/20'}`}></div>
                    {project.imageUrl && (
                      <Image 
                        src={project.imageUrl} 
                        alt={project.title} 
                        fill 
                        className="absolute inset-0 object-cover opacity-20 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                      />
                    )}
                    <h3 className="font-syne text-3xl font-bold text-slate-900 relative z-10 truncate w-full pointer-events-none">
                      {project.title}
                    </h3>
                  </div>
                  
                  <div className="p-8 bg-transparent flex-1 flex flex-col border-t border-slate-100 pointer-events-none">
                    <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex gap-2 flex-wrap mt-auto">
                      {(project.tags || []).slice(0, 3).map((t: string) => (
                        <span key={t} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
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
        <div className="container mx-auto px-6 sm:px-10 md:px-12 lg:px-16 max-w-7xl">
          <TiltCard 
            {...sectionReveal} 
            className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 lg:p-14 border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div className="text-center md:text-left pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-700 font-bold text-sm mb-4">
                  <Star size={16} className="fill-orange-700" /> FEATURED CERTIFICATES
                </div>
                <h2 className="font-syne text-3xl md:text-4xl font-bold text-slate-900">Continuous Learning.</h2>
              </div>
              <Link 
                href="/certifications" 
                className="relative z-20 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg text-base"
              >
                View Full Vault
              </Link>
            </div>
            
            {featuredCerts.length === 0 ? (
              <div className="w-full py-8 text-center bg-white/50 rounded-2xl border border-dashed border-slate-300 font-bold text-slate-400">
                Star certifications in the Admin Panel to display them here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-none">
                {featuredCerts.map((cert) => (
                  <div key={cert.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 transition-all">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                      <Award size={32} />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-lg text-slate-900 truncate">{cert.title}</h3>
                      <p className="text-slate-500 text-sm font-medium">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TiltCard>
        </div>
      </section>

      <SectionDivider />

      <section className="relative z-20 py-8 mb-12">
        <div className="container mx-auto px-6 sm:px-10 md:px-12 lg:px-16 max-w-7xl">
          <motion.div {...sectionReveal} className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Ready to collaborate?</h2>
              <p className="text-slate-400 text-base md:text-lg mb-10">
                Whether it is a scalable backend architecture, a sleek UI/UX design, or deploying the next big idea. I'm ready to build.
              </p>
              <Link 
                href="/contact" 
                className="px-8 lg:px-10 py-4 lg:py-5 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all text-base lg:text-lg inline-flex items-center justify-center gap-3 shadow-xl w-full sm:w-auto"
              >
                <Send size={20} /> Say Hello
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
