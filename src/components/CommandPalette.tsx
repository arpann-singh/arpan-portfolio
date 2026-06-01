"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderGit2, Wrench, User, Mail, FileText } from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const links = [
    { name: "Projects & Case Studies", path: "/projects", icon: <FolderGit2 size={18} /> },
    { name: "Tech Stack & Skills", path: "/skills", icon: <Wrench size={18} /> },
    { name: "About Me", path: "/about", icon: <User size={18} /> },
    { name: "Contact & Inbox", path: "/contact", icon: <Mail size={18} /> },
    { name: "Download Resume", path: "/resume.pdf", icon: <FileText size={18} /> },
  ];

  const filteredLinks = links.filter((link) =>
    link.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    if (path.includes(".pdf")) {
      window.open(path, "_blank");
    } else {
      router.push(path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border-2 border-white z-[101] overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-slate-100">
              <Search className="text-slate-400 mr-3" size={20} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full py-4 bg-transparent focus:outline-none text-slate-800 font-medium placeholder:text-slate-400"
              />
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">ESC</span>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigate(link.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl transition-colors text-left font-medium"
                  >
                    {link.icon} {link.name}
                  </button>
                ))
              ) : (
                <p className="p-4 text-slate-500 text-sm text-center">No results found.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
