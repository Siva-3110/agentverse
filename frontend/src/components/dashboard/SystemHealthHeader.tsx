import React from "react";
import { Cpu, Database, Search, ShieldCheck, CheckCircle2, Globe } from "lucide-react";

const SYSTEM_SERVICES = [
  { label: "Groq Llama 3.3", icon: Cpu, status: "Online", color: "text-violet-600", bg: "bg-violet-50" },
  { label: "ChromaDB RAG", icon: Database, status: "Active", color: "text-sky-600", bg: "bg-sky-50" },
  { label: "OpenAlex", icon: Search, status: "Connected", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Google Patents", icon: ShieldCheck, status: "Synced", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Tavily / Firecrawl", icon: Globe, status: "Ready", color: "text-rose-600", bg: "bg-rose-50" }
];

export const SystemHealthHeader: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-4">
      {SYSTEM_SERVICES.map((service) => {
        const Icon = service.icon;
        return (
          <div
            key={service.label}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-[12px] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-6 h-6 rounded-[7px] ${service.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-3 h-3 ${service.color}`} />
            </div>
            <span className="text-[12px] font-semibold text-slate-700 whitespace-nowrap">{service.label}</span>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[11px] text-emerald-600 font-bold hidden sm:block">{service.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
