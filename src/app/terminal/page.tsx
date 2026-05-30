"use client";
import { useState, useRef, useEffect } from "react";

export default function TerminalPage() {
    const [history, setHistory] = useState<string[]>(["Welcome to Arpan's Terminal v1.0", "Type 'help' for commands."]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.toLowerCase().trim();
        let response = "";
        switch (trimmed) {
            case "help": response = "Available: help, ls, download --resume, clear"; break;
            case "ls": response = "projects/  certifications/  about.txt"; break;
            case "download --resume": window.open("/resume.pdf"); response = "Downloading..."; break;
            case "clear": setHistory([]); return;
            default: response = `Command not found: ${trimmed}`;
        }
        setHistory(prev => [...prev, `> ${cmd}`, response]);
    };

    return (
        <div className="bg-black text-green-500 font-mono p-8 min-h-screen">
            {history.map((line, i) => <p key={i}>{line}</p>)}
            <form onSubmit={(e) => { e.preventDefault(); handleCommand(input); setInput(""); }}>
                <span>➜</span>
                <input
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent border-none outline-none ml-2 text-white"
                />
            </form>
            <div ref={bottomRef} />
        </div>
    );
}