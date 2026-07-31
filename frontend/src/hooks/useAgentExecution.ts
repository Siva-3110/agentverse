import { useContext } from "react";
import { AgentStateContext, type AgentStateContextType } from "../context/AgentStateContext";

const DEFAULT_FALLBACK_CONTEXT: AgentStateContextType = {
  currentAgentId: 1,
  isExecuting: false,
  completedAgentIds: [],
  logs: [],
  selectedDomain: "Electric Vehicles",
  setSelectedDomain: () => {},
  selectedIdeaIndex: 0,
  setSelectedIdeaIndex: () => {},
  analysisResults: {},
  dailyResearchPaperCount: 312,
  dailyPatentCount: 1295,
  runPipeline: async () => {},
  resetPipeline: () => {}
};

export const useAgentExecution = (): AgentStateContextType => {
  const context = useContext(AgentStateContext);
  if (!context) {
    return DEFAULT_FALLBACK_CONTEXT;
  }
  return context;
};
