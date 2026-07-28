import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { healthCheck } from "../services/api";

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title = "Workspace Console" }: TopbarProps) {
  const [dbStatus, setDbStatus] = useState("checking");
  const [apiStatus, setApiStatus] = useState("online");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await healthCheck();
        if (res.database.includes("connected")) {
          setDbStatus("online");
        } else {
          setDbStatus("simulated");
        }
      } catch (err) {
        setDbStatus("offline");
        setApiStatus("offline");
      }
    };
    checkBackend();
  }, []);

  return (
    <header className="h-16 border-b border-white/5 bg-[#030408]/90 backdrop-blur-md flex items-center justify-between px-6 z-30 sticky top-0">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse-slow" />
        <h1 className="text-xs font-semibold text-white tracking-tight uppercase tracking-widest">{title}</h1>
      </div>

      {/* Action Indicators & Health Widget */}
      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative w-60 hidden md:block">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search documents, patents..."
            className="w-full h-8.5 rounded-lg bg-[#0D1117]/60 border border-white/5 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/25 transition-all"
          />
        </div>

        {/* Dynamic Health Status Widget */}
        <div className="flex items-center gap-3.5 border-l border-white/10 pl-6 text-[10px] font-semibold text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-dot-success" />
            <span>Gemini</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === "offline" ? "bg-rose-500 glow-dot-error" : "bg-emerald-500 glow-dot-success"}`} />
            <span>ChromaDB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === "offline" ? "bg-rose-500 glow-dot-error" : "bg-emerald-500 glow-dot-success"}`} />
            <span>Research APIs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-dot-success" />
            <span>Backend</span>
          </div>
        </div>
      </div>
    </header>
  );
}
