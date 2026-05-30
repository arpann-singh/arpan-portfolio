"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Code2, Tag } from "lucide-react";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.35 6.5-1.5 6.5-7.17A5.2 5.2 0 0 0 19 4.8 5.2 5.2 0 0 0 18.9 1c-.8-.2-3.1 1.3-3.1 1.3a10.8 10.8 10.8 0 0 0-7.6 0s-2.3-1.5-3.1-1.3A5.2 5.2 0 0 0 3 4.8a5.2 5.2 0 0 0 1.1 3A6.9 6.9 0 0 0 3 14.83c0 5.67 3.3 6.82 6.5 7.17A4.8 4.8 0 0 0 8 25v-4"/>
  </svg>
);

// Mock dataset mapping slugs to project info
const projectData: Record<string, any> = {
  "swaang": {
    title: "Swaang Connect Web",
    description: "The complete digital infrastructure built for the SSTC drama club Swaang. This platform streamlines script coordination, schedules video shootings, manages workshop workflows, and aggregates multimedia public relations modules.",
    longDescription: "Swaang Connect was conceptualized to eliminate fragmented chat-group dependencies within the collegiate drama society. Built using modular JavaScript workflows, it allows facilitators to publish real-time scheduling charts, organize script versions securely, and archive media resources seamlessly. It forms a production-ready nexus optimizing all operational branches of the club.",
    tech: ["JavaScript", "HTML5", "Tailwind CSS", "Node.js"],
    date: "March 2026",
    role: "Lead Architecture & Deployment",
    github: "https://github.com/arpann-singh/swaang"
  },
  "swaang-app": {
    title: "Swaang Mobile Application",
    description: "A highly responsive, mobile-first companion application dedicated entirely to the operational team and performers of the Swaang Drama Club.",
    longDescription: "Designed with deep attention to mobile UX ratios and accessibility parameters, the companion application gives actors lightning-fast offline access to cross-referenced scripts, cue tracking systems, and immediate notifications regarding staging changes or script modifications directly on their local storage pipelines.",
    tech: ["JavaScript", "CSS3", "Mobile Frameworks", "Local Cache API"],
    date: "April 2026",
    role: "UI/UX Designer & Frontend Dev",
    github: "https://github.com/arpann-singh/swaang-app"
  },
  "neatdesk": {
    title: "NeatDesk Engine",
    description: "A smart, GUI-based desktop application built using Python that automatically maps directories and organizes loose files on desktop targets flawlessly.",
    longDescription: "NeatDesk parses raw system paths using strict sorting regular expressions to classify cluster items into categorized folders. It features a clean native graphical interface that abstracts terminal paths, offering users single-click structural cleanup with low execution footprints.",
    tech: ["Python", "Tkinter / CustomTkinter", "OS System Library"],
    date: "April 2026",
    role: "Standalone System Developer",
    github: "https://github.com/arpann-singh"
  }
};

export default function ProjectDetail() {
  const params = useParams();
  const slug = (params?.slug as string)?.toLowerCase();
  
  // Find project details or default to placeholder fallback mapping
  const project = projectData[slug] || {
    title: slug ? slug.toUpperCase() : "Project Showcase",
    description: "An advanced codebase branch within my 17+ active GitHub repositories.",
    longDescription: "This repository represents structured logic and active version control updates mapping my engineering trajectory in Information Technology at SSTC.",
    tech: ["TypeScript", "Next.js", "Tailwind CSS"],
    date: "Ongoing Development",
    role: "Core Contributor",
    github: "https://github.com/arpann-singh"
  };

  return (
    <div className="container mx-auto px-6 md:px-12 py-24 min-h-screen relative z-10 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Navigation Button */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent font-bold mb-12 group transition-colors">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back To Projects
        </Link>

        {/* Header */}
        <h1 className="font-syne text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-none">
          {project.title}
        </h1>
        <p className="text-xl text-slate-600 font-sans mb-10 leading-relaxed">
          {project.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 my-8 border-y border-slate-200">
          <div>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
              <Calendar size={14} /> Date
            </span>
            <span className="text-base font-bold text-slate-800">{project.date}</span>
          </div>
          <div>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
              <Code2 size={14} /> Role
            </span>
            <span className="text-base font-bold text-slate-800">{project.role}</span>
          </div>
          <div>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
              <Tag size={14} /> Category
            </span>
            <span className="text-base font-bold text-slate-800">Software Architecture</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase mb-2">Links</span>
            <div className="flex gap-4">
              <Link href={project.github} target="_blank" className="text-slate-600 hover:text-accent transition-colors">
                <GithubIcon size={22} />
              </Link>
              <Link href={project.github} target="_blank" className="text-slate-600 hover:text-accent transition-colors">
                <ExternalLink size={22} />
              </Link>
            </div>
          </div>
        </div>

        {/* Extended Case Study */}
        <div className="mt-12 space-y-8 font-sans">
          <h2 className="font-syne text-2xl font-bold text-slate-900">Project Overview & Architecture</h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            {project.longDescription}
          </p>
          
          <h3 className="font-syne text-xl font-bold text-slate-900 mt-8">Technologies Deployed</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t: string) => (
              <span key={t} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
