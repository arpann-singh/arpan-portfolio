"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import { Upload, Trash2, Loader2, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";

export default function GalleryManager() {
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(10); // Start progress
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      
      setProgress(40);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { 
        method: "POST", 
        body: formData 
      });
      
      setProgress(70);
      const data = await res.json();
      
      if (!data.success) throw new Error("Server rejected image");

      await addDoc(collection(db, "gallery"), {
        url: data.data.url,
        createdAt: new Date()
      });

      setProgress(100);
      setMessage({ text: "Photo uploaded successfully!", type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Upload failed. Please check your API key.", type: 'error' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Aperture Gallery</h2>
        <label className={`bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800 flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
          {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          {isUploading ? "Uploading..." : "Upload Photo"}
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-2 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm">
            <Image src={img.url} alt="Gallery" fill className="object-cover" />
            <button onClick={() => deleteDoc(doc(db, "gallery", img.id))} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <Trash2 className="text-white hover:scale-110 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
