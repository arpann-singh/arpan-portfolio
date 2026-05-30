"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login routes you to the Command Center
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError("Invalid credentials or access denied.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-200 p-8 md:p-12 relative overflow-hidden">
        {/* Background decorative blur */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="font-syne text-3xl font-bold tracking-tight">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-2 text-center">Enter your credentials to access the Command Center.</p>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Authenticate <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>

      <a href="/" className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        &larr; Back to Portfolio
      </a>
    </div>
  );
}
