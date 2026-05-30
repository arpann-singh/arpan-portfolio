"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";
import { FastAverageColor } from "fast-average-color";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export default function SpotifyWidget() {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false });
  const [loading, setLoading] = useState(true);
  const [rgb, setRgb] = useState<string>("29, 185, 84"); 

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const res = await fetch(`/api/spotify?t=${Date.now()}`, {
          cache: "no-store"
        });
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch Spotify data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.isPlaying && data.albumImageUrl) {
      const fac = new FastAverageColor();
      fac.getColorAsync(data.albumImageUrl, { crossOrigin: "anonymous" })
        .then((color) => {
          setRgb(`${color.value[0]}, ${color.value[1]}, ${color.value[2]}`);
        })
        .catch((e) => console.error("Color extraction failed", e));
    }
  }, [data.isPlaying, data.albumImageUrl]);

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      // Increased bottom spacing and md:left spacing to keep it away from borders
      className="fixed bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-50 group"
    >
      {/* 1. THE AMBILIGHT AURA */}
      {data.isPlaying && (
        <div 
          className="absolute inset-0 rounded-full blur-[20px] sm:blur-[25px] transition-colors duration-1000 -z-10"
          style={{ backgroundColor: `rgba(${rgb}, 0.5)`, transform: "scale(1.15)" }}
        />
      )}

      {/* 2. EXPANDED HOVER CARD */}
      {data.isPlaying && data.albumImageUrl && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 md:left-0 md:-translate-x-0 mb-4 w-[calc(100vw-3rem)] max-w-[320px] sm:w-[320px] p-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out origin-bottom z-0">
          <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg mb-4">
            <Image src={data.albumImageUrl} alt="Album Art" fill className="object-cover" />
          </div>
          <h3 className="font-bold text-white text-sm sm:text-base truncate">{data.title}</h3>
          <p className="text-xs sm:text-sm text-slate-400 truncate mb-4">{data.artist}</p>
          <a href={data.songUrl} target="_blank" rel="noreferrer" className="w-full py-2.5 sm:py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors">
            Open in Spotify <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* 3. THE FLOATING PILL */}
      <motion.a 
        href={data.isPlaying ? data.songUrl : undefined} 
        target={data.isPlaying ? "_blank" : undefined}
        rel="noreferrer"
        animate={
          data.isPlaying
            ? {
                boxShadow: [
                  `0px 0px 0px 0px rgba(${rgb}, 0)`,
                  `0px 0px 15px 3px rgba(${rgb}, 0.5)`,
                  `0px 0px 0px 0px rgba(${rgb}, 0)`,
                ],
                borderColor: [
                  "rgba(255, 255, 255, 0.1)",
                  `rgba(${rgb}, 0.8)`,
                  "rgba(255, 255, 255, 0.1)",
                ],
              }
            : {
                boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }
        }
        transition={{
          repeat: Infinity,
          duration: 0.85,
          ease: "easeInOut",
        }}
        // The w-[calc(100vw-3rem)] ensures it never touches the edge on mobile
        className={`relative flex items-center h-14 sm:h-16 rounded-full shadow-2xl border backdrop-blur-2xl overflow-hidden transition-[width,background-color] duration-300 z-10 ${
          data.isPlaying ? "w-[calc(100vw-3rem)] max-w-[320px] bg-slate-900/90 cursor-pointer" : "w-14 sm:w-16 bg-slate-900/60 hover:w-[160px] cursor-default"
        }`}
      >
        {/* Background Ambient Blur Inside the Pill */}
        {data.isPlaying && data.albumImageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <Image src={data.albumImageUrl} alt="bg" fill className="object-cover opacity-30 blur-xl scale-150" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90" />
          </div>
        )}

        <div className="relative z-10 flex items-center w-full px-1.5 md:px-2 gap-3 h-full">
          {/* Vinyl / Icon Area */}
          <div className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden flex items-center justify-center relative">
            {data.isPlaying && data.albumImageUrl ? (
              <div className="absolute inset-0 animate-[spin_8s_linear_infinite] border border-slate-700 rounded-full overflow-hidden shadow-inner">
                <Image src={data.albumImageUrl} alt="Vinyl" fill className="object-cover" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rounded-full border border-slate-700/50 shadow-inner" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
                <Music className="w-5 h-5 text-slate-500" />
              </div>
            )}
          </div>

          {/* Text Area */}
          <div className="flex flex-col justify-center min-w-0 flex-1 whitespace-nowrap opacity-100 transition-opacity">
            <h3 className={`font-bold text-sm md:text-base leading-tight truncate transition-colors ${data.isPlaying ? "text-white group-hover:text-[#1DB954]" : "text-slate-300"}`}>
              {data.isPlaying ? data.title : "Offline"}
            </h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate">
              {data.isPlaying ? data.artist : "Silence is golden"}
            </p>
          </div>

          {/* Equalizer */}
          {data.isPlaying && (
            <div className="shrink-0 flex items-end gap-[3px] h-4 pr-3 md:pr-4">
              <motion.div animate={{ height: ["3px", "10px", "3px"] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="w-[3px] bg-[#1DB954] rounded-full" />
              <motion.div animate={{ height: ["8px", "3px", "8px"] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-[3px] bg-[#1DB954] rounded-full" />
              <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-[3px] bg-[#1DB954] rounded-full" />
            </div>
          )}
        </div>
      </motion.a>
    </motion.div>
  );
}
