"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home 🏠", path: "/" },
  { name: "About 👨‍💻", path: "/about" },
  { name: "Projects 🚀", path: "/projects" },
  { name: "Certificates 📜", path: "/certifications" },
  { name: "Skills ⚡", path: "/skills" },
  { name: "Contact 📬", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu automatically when a route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; }
  }, [isOpen]);

  return (
    <>
      {/* FROSTED GLASS HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="font-syne text-2xl font-extrabold text-slate-900 tracking-tighter z-50 relative">
            ARPAN<span className="text-blue-600">.</span>
          </Link>

          {/* DESKTOP NAVIGATION (Hidden on Mobile & Tablet) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 border border-slate-200/50 p-1.5 rounded-full shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative px-5 py-2 rounded-full text-sm font-bold transition-colors z-10 ${
                    isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {/* Sliding Pill Animation for Active Link */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 bg-blue-100/80 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* MOBILE/TABLET MENU TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-50 relative"
            aria-label="Toggle Menu"
          >
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </motion.div>
          </button>
        </div>
      </header>

      {/* MOBILE / TABLET FULLSCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-slate-50/95 backdrop-blur-3xl flex flex-col items-center justify-center lg:hidden"
          >
            <div className="flex flex-col items-center gap-4 w-full px-6">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} // Staggered entrance
                    className="w-full max-w-sm"
                  >
                    <Link
                      href={link.path}
                      className={`block w-full text-center py-4 rounded-2xl text-xl font-bold transition-all shadow-sm ${
                        isActive
                          ? "bg-blue-600 text-white shadow-blue-500/25 border border-blue-600"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 active:scale-95"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Ambient Footer Text */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }}
              className="absolute bottom-12 text-slate-400 font-syne text-sm font-bold tracking-widest uppercase"
            >
              Arpan Singh • Portfolio
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
