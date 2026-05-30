"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Inbox, LayoutGrid, ShieldCheck, Loader2, Trash2, CheckCircle, FileText, PieChart, Wrench, Image as ImageIcon, Plus, Layout, Edit3, X, UploadCloud, Award } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");

  // --- DATA STATES ---
  const [messages, setMessages] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  
  // --- HERO CMS STATE ---
  const [isUpdatingHero, setIsUpdatingHero] = useState(false);
  const [heroData, setHeroData] = useState({
    card1: { text: "💻 Deep Work Session", url: "" },
    card2: { text: "🎭 Swaang", url: "" },
    card3: { text: "🚀 GDSC", url: "" }
  });
  const [heroFiles, setHeroFiles] = useState({ card1: null as File|null, card2: null as File|null, card3: null as File|null });

  // --- MODAL & EDIT STATES ---
  const [editProject, setEditProject] = useState<any>(null);
  const [editCert, setEditCert] = useState<any>(null);
  const [editSkill, setEditSkill] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // --- RESUME STATE ---
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentResumeUrl, setCurrentResumeUrl] = useState("");
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin");
      else {
        setIsLoading(false);
        fetchSettings();
        
        // Listeners for Data
        const unsubMsg = onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "desc")), snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        const unsubSkills = onSnapshot(query(collection(db, "skills"), orderBy("category")), snap => setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        const unsubProjects = onSnapshot(query(collection(db, "custom_projects"), orderBy("createdAt", "desc")), snap => setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        const unsubCerts = onSnapshot(collection(db, "certifications"), snap => setCerts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

        return () => { unsubMsg(); unsubSkills(); unsubProjects(); unsubCerts(); };
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchSettings = async () => {
    const resumeSnap = await getDoc(doc(db, "settings", "resume"));
    if (resumeSnap.exists()) setCurrentResumeUrl(resumeSnap.data().url);
    const heroSnap = await getDoc(doc(db, "settings", "hero"));
    if (heroSnap.exists()) setHeroData(heroSnap.data() as any);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  // --- UNIVERSAL HELPERS ---
  const deleteDocConfirm = async (collectionName: string, id: string) => {
    if (confirm("Are you sure you want to delete this?")) await deleteDoc(doc(db, collectionName, id));
  };

  const uploadToImgBB = async (file: File) => {
    const formData = new FormData(); formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: formData });
    const data = await res.json();
    return data.data.url;
  };

  // --- SPECIFIC SAVES ---
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingHero(true);
    try {
      const updatedHeroData = { ...heroData };
      if (heroFiles.card1) updatedHeroData.card1.url = await uploadToImgBB(heroFiles.card1);
      if (heroFiles.card2) updatedHeroData.card2.url = await uploadToImgBB(heroFiles.card2);
      if (heroFiles.card3) updatedHeroData.card3.url = await uploadToImgBB(heroFiles.card3);
      await setDoc(doc(db, "settings", "hero"), updatedHeroData);
      setHeroData(updatedHeroData);
      setHeroFiles({ card1: null, card2: null, card3: null });
      alert("Hero section updated!");
    } catch (err) { alert("Failed to update."); } 
    setIsUpdatingHero(false);
  };

  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...editProject, tags: Array.isArray(editProject.tags) ? editProject.tags : editProject.tags.split(",").map((t:string)=>t.trim()) };
    if (uploadFile) data.imageUrl = await uploadToImgBB(uploadFile);
    
    if (data.id) {
      await updateDoc(doc(db, "custom_projects", data.id), data);
    } else {
      await addDoc(collection(db, "custom_projects"), { ...data, createdAt: serverTimestamp() });
    }
    setEditProject(null); setUploadFile(null);
  };

  const handleCertSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...editCert };
    if (uploadFile) data.imageUrl = await uploadToImgBB(uploadFile);
    
    if (data.id) {
      await updateDoc(doc(db, "certifications", data.id), data);
    } else {
      await addDoc(collection(db, "certifications"), data);
    }
    setEditCert(null); setUploadFile(null);
  };

  const handleSkillSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editSkill.id) await updateDoc(doc(db, "skills", editSkill.id), editSkill);
    else await addDoc(collection(db, "skills"), editSkill);
    setEditSkill(null);
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;
    setIsUploadingResume(true);
    const storageRef = ref(storage, `documents/resume_${Date.now()}.pdf`);
    const uploadTask = uploadBytesResumable(storageRef, resumeFile);
    uploadTask.on("state_changed", null, null, async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      await setDoc(doc(db, "settings", "resume"), { url: downloadURL, updatedAt: new Date() });
      setCurrentResumeUrl(downloadURL);
      setResumeFile(null); setIsUploadingResume(false);
    });
  };

  const tabs = [
    { id: "inbox", label: "Inbox", icon: <Inbox size={18} />, badge: messages.filter(m => !m.read).length },
    { id: "hero", label: "Hero CMS", icon: <Layout size={18} /> },
    { id: "projects", label: "Projects", icon: <LayoutGrid size={18} /> },
    { id: "certs", label: "Certifications", icon: <Award size={18} /> },
    { id: "skills", label: "Skills", icon: <Wrench size={18} /> },
    { id: "resume", label: "Resume", icon: <FileText size={18} /> },
  ];

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-20">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><ShieldCheck size={20} /></div>
          <h1 className="font-syne text-xl font-bold tracking-tight">Command Center</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold text-sm bg-slate-50 px-4 py-2 rounded-lg transition-colors"><LogOut size={16} /> Disconnect</button>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        
        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative ${activeTab === tab.id ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
              {tab.icon} <span>{tab.label}</span>
              {!!tab.badge && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold absolute -top-1.5 -right-1.5 shadow-sm">{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* --- INBOX TAB --- */}
        {activeTab === "inbox" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-4xl">
            <h2 className="font-syne text-3xl font-bold mb-6">Live Inbox</h2>
            {messages.map(msg => (
              <div key={msg.id} className={`p-6 rounded-[2rem] border ${msg.read ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-200 shadow-md'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-lg">{msg.name}</p>
                    <p className="text-slate-500 text-sm">{msg.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateDoc(doc(db, "messages", msg.id), { read: !msg.read })} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><CheckCircle size={18} /></button>
                    <button onClick={() => deleteDocConfirm("messages", msg.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- HERO CMS TAB --- */}
        {activeTab === "hero" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-4xl">
            <h2 className="font-syne text-3xl font-bold mb-2">Hero Parallax CMS</h2>
            <p className="text-slate-500 mb-8">Manage the 3 floating glass cards on your home page.</p>
            <form onSubmit={handleHeroSubmit} className="space-y-6">
              {[1, 2, 3].map((num) => {
                const cardKey = `card${num}` as keyof typeof heroData;
                return (
                  <div key={num} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Card {num} Text</label>
                      <input type="text" value={heroData[cardKey].text} onChange={(e) => setHeroData({ ...heroData, [cardKey]: { ...heroData[cardKey], text: e.target.value } })} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4" />
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Replace Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setHeroFiles({ ...heroFiles, [cardKey]: e.target.files ? e.target.files[0] : null })} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 cursor-pointer" />
                    </div>
                    <div className="w-32 h-32 shrink-0 bg-white rounded-2xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                      {heroData[cardKey].url ? <img src={heroData[cardKey].url} alt={`Card ${num}`} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400 font-bold">No Image</span>}
                    </div>
                  </div>
                );
              })}
              <button type="submit" disabled={isUpdatingHero} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors flex justify-center items-center gap-2">
                {isUpdatingHero ? <Loader2 className="animate-spin" /> : "Publish Live"}
              </button>
            </form>
          </motion.div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-syne text-3xl font-bold">Project CMS</h2>
              <button onClick={() => setEditProject({ title: "", description: "", category: "Web", tags: "", githubUrl: "", liveUrl: "" })} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-md hover:bg-blue-700"><Plus size={18}/> New Project</button>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                  <tr><th className="p-6">Title</th><th className="p-6">Category</th><th className="p-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{p.title}</td>
                      <td className="p-6"><span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">{p.category}</span></td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => setEditProject(p)} className="p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"><Edit3 size={18}/></button>
                        <button onClick={() => deleteDocConfirm("custom_projects", p.id)} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* --- CERTIFICATIONS TAB --- */}
        {activeTab === "certs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-syne text-3xl font-bold">Certifications Vault</h2>
              <button onClick={() => setEditCert({ title: "", issuer: "", date: "", verifyLink: "", gradient: "from-blue-400 to-blue-600" })} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-md hover:bg-blue-700"><Plus size={18}/> New Cert</button>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                  <tr><th className="p-6">Title</th><th className="p-6">Issuer</th><th className="p-6 text-center">Image</th><th className="p-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certs.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{c.title}</td>
                      <td className="p-6 text-slate-600">{c.issuer}</td>
                      <td className="p-6 text-center">{c.imageUrl ? <ImageIcon size={18} className="mx-auto text-blue-500" /> : <span className="text-xs text-slate-400">None</span>}</td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => setEditCert(c)} className="p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"><Edit3 size={18}/></button>
                        <button onClick={() => deleteDocConfirm("certifications", c.id)} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* --- SKILLS TAB --- */}
        {activeTab === "skills" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-syne text-3xl font-bold">Skills Engine</h2>
              <button onClick={() => setEditSkill({ name: "", category: "Languages", level: 80 })} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-md hover:bg-blue-700"><Plus size={18}/> New Skill</button>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                  <tr><th className="p-6">Skill</th><th className="p-6">Category</th><th className="p-6">Proficiency</th><th className="p-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {skills.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{s.name}</td>
                      <td className="p-6"><span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">{s.category}</span></td>
                      <td className="p-6">
                        <div className="flex items-center gap-3"><div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]"><div className="bg-blue-500 h-2 rounded-full" style={{width:`${s.level}%`}}></div></div><span className="text-xs font-bold text-slate-500">{s.level}%</span></div>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => setEditSkill(s)} className="p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"><Edit3 size={18}/></button>
                        <button onClick={() => deleteDocConfirm("skills", s.id)} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* --- RESUME TAB --- */}
        {activeTab === "resume" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="font-syne text-3xl font-bold mb-6">Resume Vault</h2>
            <form onSubmit={handleResumeUpload} className="space-y-6">
              {currentResumeUrl && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  <div><p className="text-sm font-bold text-green-800">Resume is active</p><a href={currentResumeUrl} target="_blank" className="text-xs text-green-600 underline">View current PDF</a></div>
                </div>
              )}
              <div className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 cursor-pointer relative">
                <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud size={32} className="text-slate-400 mb-3" />
                <p className="text-sm font-bold text-slate-700">{resumeFile ? resumeFile.name : "Select new PDF"}</p>
              </div>
              <button type="submit" disabled={!resumeFile || isUploadingResume} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl disabled:opacity-50 flex justify-center">
                {isUploadingResume ? <Loader2 className="animate-spin" /> : "Upload & Replace"}
              </button>
            </form>
          </motion.div>
        )}

      </main>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {/* EDIT PROJECT MODAL */}
        {editProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-syne font-bold">{editProject.id ? "Edit Project" : "New Project"}</h2>
                <button onClick={() => {setEditProject(null); setUploadFile(null);}} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Title</label><input required type="text" value={editProject.title} onChange={e=>setEditProject({...editProject, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Description</label><textarea required rows={3} value={editProject.description} onChange={e=>setEditProject({...editProject, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Category</label><input required type="text" value={editProject.category} onChange={e=>setEditProject({...editProject, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Tags (comma separated)</label><input required type="text" value={Array.isArray(editProject.tags) ? editProject.tags.join(", ") : editProject.tags} onChange={e=>setEditProject({...editProject, tags: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">GitHub URL</label><input type="text" value={editProject.githubUrl} onChange={e=>setEditProject({...editProject, githubUrl: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Live URL</label><input type="text" value={editProject.liveUrl} onChange={e=>setEditProject({...editProject, liveUrl: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Thumbnail Image (ImgBB)</label><input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700" /></div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => {setEditProject(null); setUploadFile(null);}} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button onClick={handleProjectSave} className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">Save Project</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* EDIT CERT MODAL */}
        {editCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-syne font-bold">{editCert.id ? "Edit Certification" : "New Certification"}</h2>
                <button onClick={() => {setEditCert(null); setUploadFile(null);}} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Title</label><input required type="text" value={editCert.title} onChange={e=>setEditCert({...editCert, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Issuer (e.g. Coursera)</label><input required type="text" value={editCert.issuer} onChange={e=>setEditCert({...editCert, issuer: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Date</label><input required type="text" value={editCert.date} onChange={e=>setEditCert({...editCert, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Verification URL</label><input type="url" value={editCert.verifyLink} onChange={e=>setEditCert({...editCert, verifyLink: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Upload Certificate Image</label><input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700" /></div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => {setEditCert(null); setUploadFile(null);}} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button onClick={handleCertSave} className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">Save Cert</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* EDIT SKILL MODAL */}
        {editSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-syne font-bold">{editSkill.id ? "Edit Skill" : "New Skill"}</h2>
                <button onClick={() => setEditSkill(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Skill Name</label><input required type="text" value={editSkill.name} onChange={e=>setEditSkill({...editSkill, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Category</label><input required type="text" value={editSkill.category} onChange={e=>setEditSkill({...editSkill, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" /></div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Proficiency Level ({editSkill.level}%)</label>
                  <input type="range" min="10" max="100" step="5" value={editSkill.level} onChange={e=>setEditSkill({...editSkill, level: parseInt(e.target.value)})} className="w-full accent-blue-600" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setEditSkill(null)} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button onClick={handleSkillSave} className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">Save Skill</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
