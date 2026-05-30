"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const StatusContext = createContext({ text: "Coding...", isActive: true });

export function StatusProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState({ text: "Coding...", isActive: true });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "settings", "status"), (doc) => {
            if (doc.exists()) setStatus(doc.data() as any);
        });
        return () => unsub();
    }, []);

    return <StatusContext.Provider value={status}>{children}</StatusContext.Provider>;
}

export const useStatus = () => useContext(StatusContext);