import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full bg-slate-100 pt-20 pb-8 border-t border-slate-200 overflow-hidden mt-auto">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">

          <div className="text-center md:text-left">
            <Link href="/" className="font-syne text-3xl font-extrabold text-slate-900 tracking-tighter">
              ARPAN<span className="text-blue-600">.</span>
            </Link>
            <p className="text-slate-500 font-sans mt-2 max-w-sm">
              Engineering student by day, creative developer by night. Building the future from Bhilai.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            {/* GitHub - Native SVG */}
            <a href="https://github.com/arpan-singh" target="_blank" rel="noreferrer" aria-label="GitHub" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-110 hover:shadow-lg transition-all border border-slate-200 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.5 5.5 0 0 0-.1 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>

            {/* Discord - Native SVG */}
            <a href="https://discord.com/users/1380303557395480586" target="_blank" rel="noreferrer" aria-label="Discord" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-[#5865F2] hover:scale-110 hover:shadow-lg transition-all border border-slate-200 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>

            {/* LinkedIn - Native SVG */}
            <a href="https://linkedin.com/in/arpan-singh" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 hover:shadow-lg transition-all border border-slate-200 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>

            {/* Email - Using Lucide since it's universally stable */}
            <a href="mailto:arpans7@outlook.in" aria-label="Email" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 hover:shadow-lg transition-all border border-slate-200 z-10">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200/80 text-slate-500 text-sm font-medium">
          <p>© {currentYear} Arpan Singh. All rights reserved.</p>
          <div className="flex gap-6 z-10">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link href="/projects" className="hover:text-blue-600 transition-colors">Projects</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
