"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoggingIn(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/admin/dashboard");
    } catch (error: any) {
      setAuthError("Invalid admin credentials. Access denied.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Aesthetics */}
      <div className="absolute w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-xl relative z-10"
      >
        <div className="w-16 h-16 bg-slate-50 text-accent rounded-2xl flex items-center justify-center mb-6 mx-auto border border-slate-100 shadow-sm">
          <Lock size={32} />
        </div>
        
        <h1 className="font-syne text-3xl font-extrabold text-slate-900 text-center mb-2">Command Center</h1>
        <p className="text-slate-500 text-center mb-8 font-sans">Restricted access. Authorized personnel only.</p>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                {...register("email")}
                placeholder="Admin Email"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-accent focus:ring-accent/20"}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <KeyRound size={20} />
              </div>
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-accent focus:ring-accent/20"}`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-70"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : "Authenticate"}
            {!isLoggingIn && <ArrowRight size={20} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
