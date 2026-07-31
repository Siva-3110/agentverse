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
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
        isActive
          ? "border-indigo-300 bg-indigo-50/80 shadow-sm"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center">{getIcon()}</div>
        <div>
          <h4 className="text-sm font-bold text-[#0F172A]">{name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="text-xs font-bold uppercase tracking-wider">
        {status === "completed" && <span className="text-emerald-700">DONE</span>}
        {status === "running" && <span className="text-indigo-600 animate-pulse">RUNNING</span>}
        {status === "error" && <span className="text-rose-600">FAILED</span>}
        {status === "pending" && <span className="text-slate-400">PENDING</span>}
      </div>
    </div>
  );
}

interface AgentExecutionPanelProps {
  activeAgent?: "idle" | "research" | "patent" | "gap_analysis" | "innovation" | "patentability" | "completed";
  progress?: number;
}

export default function AgentExecutionPanel({ activeAgent = "completed", progress = 100 }: AgentExecutionPanelProps) {

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
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#0F172A]">Pipeline Agent Orchestration</h3>
          <p className="text-xs text-slate-500 mt-0.5">Live visualization of multi-agent tasks</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-[#0F172A]">{progress}%</span>
          <p className="text-xs text-slate-500 mt-0.5">Overall progress</p>
        </div>
      </div>

      <Progress value={progress} className="h-2 bg-slate-100" />

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
