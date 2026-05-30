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
      // Push the data directly to Firebase Firestore
      await addDoc(collection(db, "messages"), {
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: serverTimestamp(),
        read: false,
      });

      setIsSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 md:px-12 py-24 min-h-screen relative z-10 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold mb-6 text-slate-900">Let's Talk.</h1>
          <p className="text-lg text-slate-600 font-sans mb-12 max-w-md">
            Whether you have a project in mind, want to discuss generative AI, or just want to say hi, my inbox is always open.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">Email</p>
                <a href="mailto:arpans7@outlook.in" className="text-xl font-bold text-slate-900 hover:text-accent transition-colors">arpans7@outlook.in</a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                <Phone size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">Phone</p>
                <a href="tel:+917987755520" className="text-xl font-bold text-slate-900 hover:text-accent transition-colors">+91 7987755520</a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">Location</p>
                <p className="text-xl font-bold text-slate-900">Bhilai, Chhattisgarh, India</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Contact Form (Zod Validated & Firebase Connected) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden"
        >
          {isSuccess && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }} 
               className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-8 z-20"
             >
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                 <Send size={40} />
               </div>
               <h3 className="font-syne text-3xl font-bold text-slate-900 mb-2">Message Delivered!</h3>
               <p className="text-slate-600 font-sans">It has been securely routed to my admin dashboard. I'll get back to you shortly.</p>
             </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            {errorMessage && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-accent focus:ring-accent/20"
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
                className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-accent focus:ring-accent/20"
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
                className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.message ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-accent focus:ring-accent/20"
                }`}
                placeholder="How can I help you?"
              />
              {errors.message && <p className="text-red-500 text-sm font-bold mt-2 ml-2">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Send Secure Message"}
              {!isSubmitting && <Send size={20} />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
