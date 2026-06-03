"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await addDoc(collection(db, "messages"), {
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: serverTimestamp(),
        read: false,
      });

      setIsSuccess(true);
      reset();

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-slate-50 pt-32 pb-20">

      {/* BACKGROUND ORBS */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none z-0" />

      <section className="relative z-10 px-6 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Side: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-sm mb-6 shadow-sm">
              <Send size={16} /> GET IN TOUCH
            </div>
            <h1 className="font-syne text-5xl md:text-7xl font-extrabold mb-6 text-slate-900">Let's Talk.</h1>
            <p className="text-lg text-slate-600 font-medium mb-12 max-w-md">
              Whether you have a project in mind, want to discuss generative AI, or just want to say hi, my inbox is always open.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border-2 border-white flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 tracking-widest uppercase">Email</p>
                  <a href="mailto:arpans7@outlook.in" className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">arpans7@outlook.in</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border-2 border-white flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 tracking-widest uppercase">Phone</p>
                  <a href="" className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">Contact Me thorugh Email</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border-2 border-white flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 tracking-widest uppercase">Location</p>
                  <p className="text-xl font-bold text-slate-900">Bhilai, Chhattisgarh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/60 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden"
          >
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 z-20"
              >
                <div className="w-20 h-20 bg-green-100 border-2 border-green-200 text-green-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                  <Send size={40} />
                </div>
                <h3 className="font-syne text-3xl font-bold text-slate-900 mb-2">Message Delivered!</h3>
                <p className="text-slate-600 font-medium">It has been securely routed to my admin dashboard. I'll get back to you shortly.</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
                  {errorMessage}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={`w-full px-5 py-4 bg-white/80 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all shadow-sm ${errors.name ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm font-bold mt-2 ml-2">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`w-full px-5 py-4 bg-white/80 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all shadow-sm ${errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm font-bold mt-2 ml-2">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className={`w-full px-5 py-4 bg-white/80 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all resize-none shadow-sm ${errors.message ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  placeholder="How can I help you?"
                />
                {errors.message && <p className="text-red-500 text-sm font-bold mt-2 ml-2">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none shadow-md text-lg"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Send Secure Message"}
                {!isSubmitting && <Send size={20} />}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
