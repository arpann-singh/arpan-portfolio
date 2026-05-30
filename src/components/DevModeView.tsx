"use client";

import { motion } from "framer-motion";
// 1. Remove Github and Linkedin from here
import { Terminal, Download, Mail } from "lucide-react";
// 2. Import them from the FontAwesome (fa) pack in react-icons
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function DevModeView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      /* The style prop here forces the default cursor to return! */
      style={{ cursor: 'default' }}
      className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] font-mono p-4 sm:p-6 md:p-12 flex flex-col justify-center items-center z-40 relative selection:bg-[#264f78]"
    >
      <div className="w-full max-w-5xl bg-[#252526] rounded-xl shadow-2xl overflow-hidden border border-[#333333] flex flex-col h-[85vh]">

        {/* VS Code Window Header */}
        <div className="flex items-center px-4 py-3 bg-[#323233] border-b border-[#1e1e1e] shrink-0">
          <div className="flex gap-2 w-20">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <p className="flex-grow text-center text-xs font-bold tracking-wider text-[#858585]">arpan_profile.json — Visual Studio Code</p>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Two-Pane Layout */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">

          {/* Left Pane: Explorer Sidebar (Hidden on mobile) */}
          <div className="hidden md:flex flex-col w-64 bg-[#252526] border-r border-[#333333] shrink-0 py-4">
            <p className="px-6 text-[11px] font-bold tracking-widest text-[#858585] mb-2 uppercase">Explorer</p>
            <div className="flex items-center px-6 py-1 bg-[#37373d] text-white cursor-pointer border-l-2 border-[#007acc]">
              <span className="mr-2 text-[#cbcb41]">{ }</span> arpan_profile.json
            </div>
            <div className="flex items-center px-6 py-1 text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer mt-1">
              <span className="mr-2 text-[#519aba]">ts</span> globals.ts
            </div>

            <p className="px-6 text-[11px] font-bold tracking-widest text-[#858585] mt-6 mb-2 uppercase">Quick Actions</p>
            <a href="/resume.pdf" download className="flex items-center px-6 py-2 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] cursor-pointer transition-colors group">
              <Download size={14} className="mr-3 text-[#4ec9b0] group-hover:scale-110 transition-transform" /> Download_Resume.pdf
            </a>
            <a href="mailto:arpan.singh@outlook.in" className="flex items-center px-6 py-2 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] cursor-pointer transition-colors group">
              <Mail size={14} className="mr-3 text-[#ce9178] group-hover:scale-110 transition-transform" /> Contact_Me.py
            </a>
          </div>

          {/* Right Pane: Code Editor */}
          <div className="flex-grow flex flex-col overflow-hidden relative bg-[#1e1e1e]">

            {/* Code Content Area */}
            <div className="flex-grow p-6 overflow-y-auto text-sm md:text-[15px] leading-relaxed whitespace-pre font-mono" style={{ cursor: 'text' }}>
              <span className="text-[#ce9178]">{`{`}</span>
              <span className="text-[#9cdcfe]">  "engineer"</span>: {`{`}
              <span className="text-[#9cdcfe]">    "name"</span>: <span className="text-[#ce9178]">"Arpan Singh"</span>,
              <span className="text-[#9cdcfe]">    "role"</span>: <span className="text-[#ce9178]">"Backend Developer & UI/UX Designer"</span>,
              <span className="text-[#9cdcfe]">    "location"</span>: <span className="text-[#ce9178]">"Bhilai, Chhattisgarh, India"</span>,
              <span className="text-[#9cdcfe]">    "education"</span>: <span className="text-[#ce9178]">"B.Tech Information Technology @ SSTC (3rd Year)"</span>
              {`}`},
              <span className="text-[#9cdcfe]">  "tech_stack"</span>: {`{`}
              <span className="text-[#9cdcfe]">    "backend"</span>: [<span className="text-[#ce9178]">"Python"</span>, <span className="text-[#ce9178]">"Firebase"</span>, <span className="text-[#ce9178]">"Node.js"</span>],
              <span className="text-[#9cdcfe]">    "frontend"</span>: [<span className="text-[#ce9178]">"Next.js"</span>, <span className="text-[#ce9178]">"Tailwind CSS"</span>],
              <span className="text-[#9cdcfe]">    "mobile"</span>: [<span className="text-[#ce9178]">"Flutter"</span>, <span className="text-[#ce9178]">"Dart"</span>]
              {`}`},
              <span className="text-[#9cdcfe]">  "current_focus"</span>: {`{`}
              <span className="text-[#9cdcfe]">    "academics"</span>: <span className="text-[#ce9178]">"GATE 2027 Preparation (CS & Data Science)"</span>,
              <span className="text-[#9cdcfe]">    "leadership"</span>: <span className="text-[#ce9178]">"President @ Swaang Drama Club"</span>
              {`}`},
              <span className="text-[#9cdcfe]">  "social_links"</span>: {`{`}
              <span className="text-[#9cdcfe]">    "github"</span>: <a href="https://github.com/arpann-singh" target="_blank" className="text-[#4ec9b0] hover:underline cursor-pointer">"github.com/arpann-singh"</a>,
              <span className="text-[#9cdcfe]">    "linkedin"</span>: <a href="https://linkedin.com/in/arpann-singh" target="_blank" className="text-[#4ec9b0] hover:underline cursor-pointer">"linkedin.com/in/arpann-singh"</a>
              {`}`}
              <span className="text-[#ce9178]">{`}`}</span>
            </div>

            {/* Simulated Terminal at bottom */}
            <div className="h-48 border-t border-[#333333] bg-[#1e1e1e] flex flex-col shrink-0">
              <div className="flex gap-6 px-6 pt-2 pb-1 border-b border-[#333333] text-xs font-medium text-[#858585]">
                <span className="cursor-pointer hover:text-[#cccccc]">PROBLEMS</span>
                <span className="cursor-pointer hover:text-[#cccccc]">OUTPUT</span>
                <span className="cursor-pointer hover:text-[#cccccc]">DEBUG CONSOLE</span>
                <span className="text-white border-b border-white pb-1 flex items-center gap-2"><Terminal size={12} /> TERMINAL</span>
              </div>
              <div className="p-4 text-xs font-mono text-[#cccccc] overflow-y-auto space-y-2">
                <p><span className="text-[#27c93f]">arpan@portfolio</span><span className="text-[#4ec9b0]">~/swaang.tech</span>$ npm run build</p>
                <p className="text-[#858585]">&gt; next build</p>
                <p className="text-[#4ec9b0]">✓ Compiled successfully in 12.8s</p>
                <p className="text-[#4ec9b0]">✓ Type checking passed.</p>
                <p className="text-white">Route (app)                              Size     First Load JS</p>
                <p className="text-white">┌ ○ /                                    6.4 kB         88.2 kB</p>
                <p className="text-white">├ ○ /about                               4.2 kB         85.1 kB</p>
                <p className="text-[#27c93f]">Ready for recruiter inspection. Server listening on port 3000.</p>
                <p className="text-white animate-pulse">_</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
