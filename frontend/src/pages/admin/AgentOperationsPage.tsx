import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw } from "lucide-react";
import Topbar from "../../components/Topbar";

export default function AgentOperationsPage() {
  const [agentMetrics, setAgentMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAgentMetrics = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/admin/agents")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAgentMetrics(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching agent metrics:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgentMetrics();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Admin Operations" }, { label: "9-Agent Operations Center" }]}
        title="9-Agent Swarm Operations Center"
        subtitle="Real-time telemetry and health monitoring for all 9 autonomous agents"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[20px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                  9-Agent Swarm Telemetry & Operations
                </h3>
                <p className="text-[12.5px] font-medium text-slate-500">
                  Real-time health, response latency, execution frequency, and success rates.
                </p>
              </div>
            </div>
            <button
              onClick={fetchAgentMetrics}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              All 9 Agents Operational
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 font-semibold text-[13px]">
              Fetching real-time agent swarm telemetry...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {agentMetrics.map((agent) => (
                <div key={agent.id || agent.agent_name} className="p-5 rounded-[20px] bg-slate-50 border border-slate-200/80 space-y-3 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                      {agent.status}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{agent.last_run}</span>
                  </div>

                  <h4 className="text-[15px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                    {agent.agent_name || agent.name}
                  </h4>

                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[12px] font-semibold">
                    <div>
                      <span className="text-slate-400 block text-[10.5px]">Avg Response</span>
                      <span className="text-slate-800 font-bold">{agent.avg_response_time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10.5px]">Success Rate</span>
                      <span className="text-emerald-700 font-bold">{agent.success_rate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
