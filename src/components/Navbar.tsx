"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
      {/* 
        --- DESKTOP NAV: THE COMPACT DOCK ---
        Notice the container is no longer w-[95%]. It tightly hugs the content.
      */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 inset-x-0 z-50 hidden md:flex justify-center pointer-events-none"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full p-1.5 flex items-center gap-1 pointer-events-auto">

          {leftLinks.map((link) => (
            <Link key={link.name} href={link.path} className="relative px-5 py-2.5 rounded-full group transition-colors">
              <span className={`relative z-10 font-sans font-bold text-xs uppercase tracking-widest transition-colors duration-300 ${isActive(link.path) ? "text-blue-700" : "text-slate-500 group-hover:text-slate-900"}`}>
                {link.name}
              </span>
              {isActive(link.path) && (
                <motion.div layoutId="desktop-nav-pill" className="absolute inset-0 bg-blue-50/80 border border-blue-100 rounded-full z-0 shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </Link>
          ))}

          {/* Center Logo Divider */}
          <Link href="/" className="px-4 flex items-center group">
            <span className="font-syne font-black text-xl tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
              ARPAN<span className="text-blue-600">.</span>
            </span>
          </Link>

          {rightLinks.map((link) => (
            <Link key={link.name} href={link.path} className="relative px-5 py-2.5 rounded-full group transition-colors">
              <span className={`relative z-10 font-sans font-bold text-xs uppercase tracking-widest transition-colors duration-300 ${isActive(link.path) ? "text-blue-700" : "text-slate-500 group-hover:text-slate-900"}`}>
                {link.name}
              </span>
              {isActive(link.path) && (
                <motion.div layoutId="desktop-nav-pill" className="absolute inset-0 bg-blue-50/80 border border-blue-100 rounded-full z-0 shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </Link>
          ))}

          <Link href="/contact" className="ml-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-md hover:bg-blue-600 transition-all hover:scale-105 active:scale-95">
            Contact
          </Link>
        </div>
      </motion.nav>

      {/* --- MOBILE NAV --- */}
      <nav className="fixed top-4 inset-x-4 z-50 md:hidden bg-white/80 backdrop-blur-2xl border border-white/80 shadow-lg rounded-full px-5 py-3 flex items-center justify-between">
        <Link href="/" className="font-syne font-black text-2xl tracking-tighter text-slate-900">
          ARPAN<span className="text-blue-600">.</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all active:scale-95"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* MOBILE MENU FULL SCREEN MODAL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col pointer-events-auto p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-12 pt-4 px-2">
              <span className="font-syne font-black text-3xl tracking-tighter text-slate-900">
                ARPAN<span className="text-blue-600">.</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 text-slate-900 active:scale-95 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 px-2">
              {allLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1, ease: "easeOut" }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-4 font-syne font-extrabold text-4xl tracking-tight transition-colors border-b border-slate-100 ${isActive(link.path) ? "text-blue-600" : "text-slate-800 hover:text-blue-500"
                      }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: allLinks.length * 0.1 + 0.2 }}
              className="mt-auto pb-8 px-2"
            >
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white flex items-center justify-center gap-3 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all"
              >
                Start a Project <Send size={18} />
              </Link>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}