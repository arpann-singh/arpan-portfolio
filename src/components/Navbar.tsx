"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const leftLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
  ];

  const rightLinks = [
    { name: "Certs", path: "/certifications" },
    { name: "Skills", path: "/skills" },
  ];

  const allLinks = [...leftLinks, ...rightLinks];
  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-white/60 backdrop-blur-2xl border-2 border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
        
        {/* DESKTOP: Left Side Links */}
        <div className="hidden md:flex items-center justify-end flex-1 gap-1 pr-6 lg:pr-10">
          {leftLinks.map((link) => (
            <Link key={link.name} href={link.path} className="relative px-4 py-2 rounded-full group">
              <span className={`relative z-10 font-sans font-bold text-xs uppercase tracking-widest transition-colors duration-300 ${isActive(link.path) ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`}>
                {link.name}
              </span>
              {isActive(link.path) && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-100 z-0" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </Link>
          ))}
        </div>

        {/* CENTER: ARPAN. Branding */}
        <Link href="/" className="flex-shrink-0 flex items-center justify-center relative group px-4">
          <span className="font-syne text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 uppercase">
            ARPAN
            <span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* DESKTOP: Right Side Links & Contact Button */}
        <div className="hidden md:flex items-center justify-start flex-1 gap-1 pl-6 lg:pl-10">
          {rightLinks.map((link) => (
            <Link key={link.name} href={link.path} className="relative px-4 py-2 rounded-full group">
              <span className={`relative z-10 font-sans font-bold text-xs uppercase tracking-widest transition-colors duration-300 ${isActive(link.path) ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`}>
                {link.name}
              </span>
              {isActive(link.path) && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-100 z-0" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </Link>
          ))}
          <Link href="/contact" className="ml-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-md hover:bg-blue-600 hover:shadow-lg transition-all hover:-translate-y-0.5">
            Contact
          </Link>
        </div>

        {/* MOBILE: Hamburger Toggle */}
        <div className="flex md:hidden w-full justify-between items-center">
          <div className="w-8"></div>
          <Link href="/" className="font-syne font-black text-2xl tracking-tighter text-slate-900">
             ARPAN<span className="text-blue-600">.</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2.5 text-slate-700 bg-white rounded-full border border-slate-200 shadow-sm active:scale-95 transition-transform"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col pointer-events-auto p-6"
          >
            <div className="flex justify-between items-center mb-16 pt-2">
              <span className="font-syne font-black text-2xl tracking-tighter text-slate-900">ARPAN.</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 bg-slate-100 rounded-full border border-slate-200 text-slate-900 active:scale-95 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 text-center">
              {allLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-syne font-extrabold text-4xl tracking-tight transition-colors ${isActive(link.path) ? "text-blue-600" : "text-slate-800 hover:text-blue-500"}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
