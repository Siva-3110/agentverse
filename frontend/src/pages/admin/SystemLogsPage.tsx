import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Topbar from "../../components/Topbar";

export default function SystemLogsPage() {
  const [logsList, setLogsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLogs = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/admin/logs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogsList(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching system logs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Admin Operations" }, { label: "System Logs" }]}
        title="System Telemetry & Audit Logs"
        subtitle="Real-time system event logging for API calls, scheduler triggers, LLM prompts, and authentication events"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                Live System Audit Stream ({logsList.length})
              </h3>
              <p className="text-[12px] font-medium text-slate-500">
                Low-level event logs captured directly from PostgreSQL / SQLite system_logs table.
              </p>
            </div>
            <button
              onClick={fetchLogs}
              className="flex items-center gap-2 px-3.5 py-1 rounded-full text-[12px] font-bold bg-slate-900 text-emerald-400 font-mono cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              STATUS: STREAM ACTIVE
            </button>
          </div>

          <div className="p-5 rounded-[16px] bg-slate-950 text-emerald-400 font-mono text-[12.5px] leading-relaxed space-y-2 border border-slate-800 shadow-inner overflow-y-auto max-h-[500px]">
            {loading ? (
              <div className="text-slate-400">Fetching live system logs...</div>
            ) : logsList.length === 0 ? (
              <div className="text-slate-500">No system logs recorded yet in database stream. System operational.</div>
            ) : (
              logsList.map((log) => (
                <div key={log.id}>
                  <span className="text-slate-500">[{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Live'}]</span>{" "}
                  <span className={log.level === 'ERROR' ? 'text-red-400 font-bold' : 'text-blue-400'}>[{log.level || 'INFO'}]</span>{" "}
                  <span className="text-purple-400">[{log.category || 'SYSTEM'}]</span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
