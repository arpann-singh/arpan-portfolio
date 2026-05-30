"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType>({
  isDevMode: false,
  toggleDevMode: () => {},
});

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("devMode");
    if (savedMode === "true") {
      setIsDevMode(true);
    }
  }, []);

  const toggleDevMode = () => {
    setIsDevMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("devMode", String(newValue));
      return newValue;
    });
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
}

export const useDevMode = () => useContext(DevModeContext);
