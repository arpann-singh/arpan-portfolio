import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import { DevModeProvider } from "@/context/DevModeContext";
import DevModeWrapper from "@/components/DevModeWrapper";
import DevModeToggle from "@/components/DevModeToggle";
import SpotifyWidget from "@/components/SpotifyWidget"; // <-- New Global Import

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arpan.page"),
  title: "Arpan Singh | Portfolio",
  description: "Engineering student by day, creative developer by night. Building the future from Bhilai.",
  openGraph: {
    title: "Arpan Singh | Portfolio",
    description: "Engineering student by day, creative developer by night. Building the future from Bhilai.",
    url: "https://www.arpan.page",
    siteName: "Arpan Singh Portfolio",
    images: [
      {
        url: "/hero-photo.jpg",
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
        <DevModeProvider>
          <DevModeWrapper>
            <CustomCursor />
            <Navbar />
            <main className="flex-grow flex flex-col relative">
              {children}
            </main>
            <Footer />
            <SpotifyWidget /> {/* <-- Lives globally, outside the main flow */}
          </DevModeWrapper>
          
          <DevModeToggle />
        </DevModeProvider>
      </body>
    </html>
  );
}
