import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, BookOpen, ShieldCheck, Target, Lightbulb, Scale, TrendingUp, DollarSign } from "lucide-react";
import { useAgentExecution } from "../../hooks/useAgentExecution";

const AGENTS = [
  { id: 1, label: "Research", icon: BookOpen, shortLabel: "01", path: "/research", color: "#3B82F6" },
  { id: 2, label: "Patents", icon: ShieldCheck, shortLabel: "02", path: "/patents", color: "#8B5CF6" },
  { id: 3, label: "Gap Analysis", icon: Target, shortLabel: "03", path: "/gaps", color: "#F59E0B" },
  { id: 4, label: "Innovation", icon: Lightbulb, shortLabel: "04", path: "/innovation", color: "#EC4899" },
  { id: 5, label: "Patentability", icon: Scale, shortLabel: "05", path: "/patentability", color: "#EF4444" },
  { id: 6, label: "Market Intel", icon: TrendingUp, shortLabel: "06", path: "/market", color: "#10B981" },
  { id: 7, label: "Funding", icon: DollarSign, shortLabel: "07", path: "/funding", color: "#F97316" }
];

export default function AgentPipelineStepper() {
  const { completedAgentIds, currentAgentId, isExecuting } = useAgentExecution();

  const getState = (agentId: number): "completed" | "running" | "idle" => {
    if (completedAgentIds.includes(agentId)) return "completed";
    if (isExecuting && currentAgentId === agentId) return "running";
    return "idle";
  };

  return (
    <div className="premium-card px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-slate-900">Agent Pipeline</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Sequential 7-agent swarm execution</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-slate-50 border border-slate-200">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isExecuting ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
          <span className="text-[12px] font-semibold text-slate-600">
            {isExecuting ? `Agent ${currentAgentId} Running` : `${completedAgentIds.length}/7 Complete`}
          </span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-5">
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(completedAgentIds.length / 7) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-slate-400 font-medium">0%</span>
          <span className="text-[11px] text-emerald-700 font-bold">
            {Math.round((completedAgentIds.length / 7) * 100)}%
          </span>
        </div>
      </div>

      {/* Stepper Nodes */}
      <div className="grid grid-cols-7 gap-2">
        {AGENTS.map((agent) => {
          const state = getState(agent.id);
          const Icon = agent.icon;
          const isCompleted = state === "completed";
          const isRunning = state === "running";

          return (
            <Link
              key={agent.id}
              to={isCompleted || isRunning ? agent.path : "#"}
              className={`group flex flex-col items-center gap-2 ${!isCompleted && !isRunning ? "pointer-events-none" : ""}`}
            >
              <motion.div
                whileHover={isCompleted ? { scale: 1.08 } : {}}
                whileTap={isCompleted ? { scale: 0.95 } : {}}
                className={`
                  relative w-10 h-10 rounded-[12px] flex items-center justify-center transition-all
                  ${isCompleted
                    ? "bg-gradient-to-br from-[#0B4F37] to-[#065F46] shadow-lg shadow-emerald-900/20"
                    : isRunning
                      ? "bg-amber-50 border-2 border-amber-300 shadow-md"
                      : "bg-slate-50 border border-slate-200"
                  }
                `}
              >
                {isRunning && (
                  <motion.div
                    className="absolute inset-0 rounded-[12px] border-2 border-amber-400"
                    animate={{ scale: [1, 1.15, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : isRunning ? (
                  <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-400" />
                )}
              </motion.div>
              <div className="text-center">
                <div className={`text-[10px] font-bold leading-tight ${isCompleted ? "text-emerald-700" : isRunning ? "text-amber-700" : "text-slate-400"}`}>
                  {agent.shortLabel}
                </div>
                <div className={`text-[9.5px] font-semibold leading-tight mt-0.5 hidden lg:block ${isCompleted ? "text-slate-700" : isRunning ? "text-amber-600" : "text-slate-400"}`}>
                  {agent.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
