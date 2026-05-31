"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Wrench } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const q = query(collection(db, "skills"), orderBy("level", "desc"));
        const snapshot = await getDocs(q);
        const fetchedSkills = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Skill[];
        setSkills(fetchedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSkills();
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-slate-50 pt-32 pb-20">
      
      {/* BACKGROUND ORBS */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none z-0" />

      <section className="relative z-10 px-6 container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-sm mb-6 shadow-sm">
            <Wrench size={16} /> TECHNICAL ARSENAL
          </div>
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold mb-6 text-slate-900">My Tech Stack.</h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl">
            A live-updated overview of my proficiencies across languages, frameworks, and design tools, directly synced from my portfolio's backend CMS.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-sans font-medium">Loading skill metrics...</p>
          </div>
        ) : Object.keys(groupedSkills).length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl p-12 rounded-[2rem] border-2 border-white text-center max-w-2xl mx-auto shadow-sm">
            <h3 className="font-syne text-2xl font-bold text-slate-900 mb-2">No Skills Found</h3>
            <p className="text-slate-500">The admin hasn't configured any skills in the Command Center yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all"
              >
                <h2 className="font-syne text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200/60">{category}</h2>
                <div className="space-y-6">
                  {categorySkills.map((skill, i) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-800">{skill.name}</span>
                        <span className="font-mono text-sm font-bold text-blue-600">{skill.level}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
