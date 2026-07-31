import React from "react";
import Topbar from "../../components/Topbar";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Admin Operations" }, { label: "Settings" }]}
        title="Platform Operational Settings"
        subtitle="Global platform configuration, database connection parameters, and API integration keys"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
              System Integration & API Parameters
            </h3>
            <p className="text-[12px] font-medium text-slate-500">
              Configure multi-agent swarm keys, vector database endpoints, and email dispatch servers.
            </p>
          </div>

          <div className="space-y-4 max-w-xl text-[13px] font-bold">
            <div>
              <label className="block text-slate-700 mb-1">Groq LLM Swarm API Key</label>
              <input type="password" value="gsk_production_key_patentscout_994827" readOnly className="w-full px-4 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-slate-800 font-mono" />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">PostgreSQL Storage Database URI</label>
              <input type="text" value="postgresql://patentscout:***@localhost:5432/patentscout_db (SQLite Active Fallback)" readOnly className="w-full px-4 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-slate-800 font-mono" />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">ChromaDB Vector Store Path</label>
              <input type="text" value="D:\Patent Scout Ai\backend\chroma_db" readOnly className="w-full px-4 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-slate-800 font-mono" />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">APScheduler Scan Interval</label>
              <input type="text" value="60 Seconds (Background Worker Thread Active)" readOnly className="w-full px-4 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-slate-800 font-mono" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
