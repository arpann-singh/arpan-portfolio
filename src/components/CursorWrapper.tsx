"use client";

import dynamic from "next/dynamic";

// Dynamically import the cursor with SSR disabled inside a Client Component
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

export default function CursorWrapper() {
  return <CustomCursor />;
}
