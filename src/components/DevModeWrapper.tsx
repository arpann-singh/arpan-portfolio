"use client";

import { useDevMode } from "@/context/DevModeContext";
import DevModeView from "./DevModeView";

export default function DevModeWrapper({ children }: { children: React.ReactNode }) {
  const { isDevMode } = useDevMode();

  if (isDevMode) {
    return <DevModeView />;
  }

  return <>{children}</>;
}
