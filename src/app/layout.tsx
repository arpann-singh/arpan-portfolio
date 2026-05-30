import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Arpan Singh | Portfolio",
  description: "Engineering student by day, creative developer by night. Building the future from Bhilai.",
  openGraph: {
    title: "Arpan Singh | Portfolio",
    description: "Engineering student by day, creative developer by night. Building the future from Bhilai.",
    url: "https://swaang.tech", // Replace with your actual production domain when ready
    siteName: "Arpan Singh Portfolio",
    images: [
      {
        url: "/hero-photo.jpg", // Uses your existing hero image in the public folder
        width: 1200,
        height: 630,
        alt: "Arpan Singh - Portfolio Preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arpan Singh | Portfolio",
    description: "Engineering student by day, creative developer by night.",
    images: ["/hero-photo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${syne.variable} font-sans bg-slate-100 text-slate-900 antialiased flex flex-col min-h-screen`}>
        <CustomCursor />
        <Navbar />
        <main className="flex-grow flex flex-col relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
