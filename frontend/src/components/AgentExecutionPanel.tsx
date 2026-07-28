import { CheckCircle2, Loader2, AlertTriangle, Circle } from "lucide-react";
import { Progress } from "./ui/Progress";

interface AgentStatusProps {
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  isActive: boolean;
}

function AgentItem({ name, description, status, isActive }: AgentStatusProps) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />;
      default:
        return <Circle className="w-5 h-5 text-zinc-600" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
        isActive
          ? "border-indigo-500/30 bg-indigo-500/5 shadow-sm shadow-indigo-500/5"
          : "border-darkBorder bg-[#12121A]/30"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center">{getIcon()}</div>
        <div>
          <h4 className="text-sm font-semibold text-white">{name}</h4>
          <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider">
        {status === "completed" && <span className="text-emerald-400">Done</span>}
        {status === "running" && <span className="text-indigo-400 animate-pulse">Running</span>}
        {status === "error" && <span className="text-rose-400">Failed</span>}
        {status === "pending" && <span className="text-zinc-600">Pending</span>}
      </div>
    </div>
  );
}

interface AgentExecutionPanelProps {
  activeAgent: "idle" | "research" | "patent" | "gap_analysis" | "innovation" | "patentability" | "completed";
  progress: number;
}

export default function AgentExecutionPanel({ activeAgent, progress }: AgentExecutionPanelProps) {
  const getAgentStatus = (agentName: "research" | "patent" | "gap_analysis" | "innovation" | "patentability") => {
    if (activeAgent === "completed") return "completed";
    if (activeAgent === "idle") return "pending";

    const agentOrder = ["research", "patent", "gap_analysis", "innovation", "patentability"];
    const activeIdx = agentOrder.indexOf(activeAgent);
    const targetIdx = agentOrder.indexOf(agentName);

    if (activeIdx > targetIdx) return "completed";
    if (activeIdx === targetIdx) return "running";
    return "pending";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-darkBorder/30 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Pipeline Agent Orchestration</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Live visualization of multi-agent tasks</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-white">{progress}%</span>
          <p className="text-xs text-zinc-500 mt-0.5">Overall progress</p>
        </div>
      </div>

      <Progress value={progress} className="h-1.5" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <AgentItem
          name="Research Agent"
          description="Crawling academic databases & building RAG indices"
          status={getAgentStatus("research")}
          isActive={activeAgent === "research"}
        />
        <AgentItem
          name="Patent Agent"
          description="Clustering patents from the local dataset"
          status={getAgentStatus("patent")}
          isActive={activeAgent === "patent"}
        />
        <AgentItem
          name="Gap Analysis Agent"
          description="Evaluating high research activity with low patent density"
          status={getAgentStatus("gap_analysis")}
          isActive={activeAgent === "gap_analysis"}
        />
        <AgentItem
          name="Innovation Agent"
          description="Generating startup product concepts from gaps"
          status={getAgentStatus("innovation")}
          isActive={activeAgent === "innovation"}
        />
        <AgentItem
          name="Patentability Agent"
          description="Evaluating novelty claims and prior-art risk profiles"
          status={getAgentStatus("patentability")}
          isActive={activeAgent === "patentability"}
        />
      </div>
    </div>
  );
}
