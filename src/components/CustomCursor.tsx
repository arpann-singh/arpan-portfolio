"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we are hovering over a link, button, or anything with cursor-pointer
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.classList.contains("group")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [isVisible]);

  // Do not render the custom cursor on touch devices (mobile/tablet)
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full hidden md:block"
        animate={{
          x: mousePosition.x - (isHovering ? 24 : 6),
          y: mousePosition.y - (isHovering ? 24 : 6),
          width: isHovering ? 48 : 12,
          height: isHovering ? 48 : 12,
          backgroundColor: isHovering ? "rgba(37, 99, 235, 0.05)" : "rgba(15, 23, 42, 1)", // Blue tint on hover, dark slate default
          border: isHovering ? "1px solid rgba(37, 99, 235, 0.5)" : "0px solid transparent",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 35,
          mass: 0.5,
        }}
      />
      
      {/* Optional: Tiny center dot that stays solid when the main cursor expands */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-blue-600 hidden md:block"
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
          width: 4,
          height: 4,
          opacity: isHovering && isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 40,
        }}
      />
    </>
  );
}
