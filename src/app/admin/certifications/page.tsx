"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UploadCloud, Link as LinkIcon, Check, X, Edit3, Image as ImageIcon, Award } from "lucide-react";

// In production, this data is fetched from Firebase Firestore
const initialCerts = [
  { id: 1, title: "Google Play Store Listing", issuer: "Google", verifyLink: "https://credential.net/example", hasImage: true },
  { id: 2, title: "Generative AI", issuer: "Google DSC", verifyLink: "", hasImage: false },
  { id: 3, title: "Cybersecurity", issuer: "Coursera", verifyLink: "https://coursera.org/verify", hasImage: true },
];

export default function AdminCertifications() {
  const [certs, setCerts] = useState(initialCerts);
  const [editingCert, setEditingCert] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: In production, upload `uploadFile` to Firebase Storage, get URL, and update Firestore
    setCerts(certs.map(c => c.id === editingCert.id ? { ...editingCert, hasImage: uploadFile ? true : editingCert.hasImage } : c));
    setEditingCert(null);
    setUploadFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-syne font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" /> Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage Certification Documents & Verification Links</p>
          </div>
          <div className="px-4 py-2 bg-blue-100 text-blue-700 font-bold text-sm rounded-xl">
            Firebase Synced
          </div>
        </header>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-6">Certificate Title</th>
                  <th className="p-6">Issuer</th>
                  <th className="p-6 text-center">Verification Link</th>
                  <th className="p-6 text-center">Image Uploaded</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certs.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-900 flex items-center gap-3">
                      <Award size={18} className="text-slate-400" /> {cert.title}
                    </td>
                    <td className="p-6 text-slate-600">{cert.issuer}</td>
                    <td className="p-6 text-center">
                      {cert.verifyLink ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-green-100 text-green-700">
                          <Check size={12} /> Configured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-500">
                          <X size={12} /> Missing
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {cert.hasImage ? (
                        <ImageIcon size={20} className="mx-auto text-blue-500" />
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setEditingCert(cert)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:border-slate-400 shadow-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingCert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-syne font-bold text-slate-900">Edit Asset</h2>
                  <button onClick={() => setEditingCert(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  {/* Verified Link Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Verification URL</label>
                    <div className="relative">
                      <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="url" 
                        value={editingCert.verifyLink}
                        onChange={(e) => setEditingCert({...editingCert, verifyLink: e.target.value})}
                        placeholder="https://coursera.org/verify/..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Image Upload Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Certificate Image</label>
                    <div className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                        onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <UploadCloud size={32} className="text-slate-400 mb-3" />
                      <p className="text-sm font-bold text-slate-700 text-center">
                        {uploadFile ? uploadFile.name : "Click or drag file to upload"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setEditingCert(null)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-2">
                      <UploadCloud size={18} /> Save & Deploy
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
