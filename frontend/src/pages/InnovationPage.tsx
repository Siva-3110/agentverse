import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, ChevronRight, Inbox, ArrowRight } from "lucide-react";
import type { AnalysisState } from "../services/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { InnovationRadarChart } from "../components/Visualizations";

export default function InnovationPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalysisState | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("latest_results");
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#0D1117] border border-darkBorder flex items-center justify-center text-zinc-600">
          <Inbox className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">No Innovation Candidates</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            Run an analysis on the dashboard to trigger the Innovation Agent to synthesize ready-to-file candidates.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="gap-2">
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-darkBorder/30 pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Innovation Candidates</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{data.domain} Opportunities</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          Candidates Synthesized: {data.innovation_ideas.length}
        </Badge>
      </div>

      {/* Radar Chart & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 lg:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Feasibility & Novelty Profile</h4>
            <p className="text-[9px] text-zinc-500">Multiphysics neural network feasibility variables</p>
          </div>
          <InnovationRadarChart domain={data?.domain} />
        </Card>

        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Concept Synthesis</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our Innovation Agent evaluates the top opportunity gaps. It drafts structural product descriptions, outlines technical requirements, and calculates target market fits.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Candidates are engineered with defensibility profiles to guarantee maximum patent novelty scores.
            </p>
          </div>
          <div className="p-4.5 rounded-xl bg-[#080B14] border border-darkBorder/60 space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Average Novelty</span>
            <span className="text-2xl font-extrabold text-cyan-400">92%</span>
          </div>
        </Card>
      </div>

      {/* Grid of Innovation Ideas */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4.5 h-4.5 text-cyan-400" />
          Filing Candidates
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.innovation_ideas.map((idea, index) => (
            <Card key={idea.name} className="flex flex-col justify-between bg-[#0D1117]/50 border border-darkBorder/40 hover:border-darkBorder/80 transition-colors p-5 min-h-[220px]">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{idea.name}</h4>
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mt-1 block">{idea.type}</span>
                  </div>
                  {idea.novelty_score && (
                    <Badge variant="success" className="text-[9px]">{idea.novelty_score}% Novel</Badge>
                  )}
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">{idea.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-darkBorder/25 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Based On Gap:</span>
                  <span className="text-zinc-300 font-medium truncate max-w-[160px]">{idea.based_on_gap}</span>
                </div>
                {idea.market_potential && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Market Potential:</span>
                    <Badge variant={idea.market_potential === "High" ? "success" : "warning"} className="text-[9px] py-0">
                      {idea.market_potential}
                    </Badge>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-1.5 text-xs mt-1"
                  onClick={() => navigate(`/innovation/${index}`)}
                >
                  <span>View Details & Specifications</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
