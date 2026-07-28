import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  FlaskConical, 
  Scroll, 
  AlertCircle, 
  Lightbulb, 
  ChevronRight, 
  Trophy, 
  Building2, 
  TrendingUp, 
  Inbox,
  ArrowLeft
} from "lucide-react";
import type { AnalysisState } from "../services/api";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { 
  ResearchActivityChart, 
  PatentSaturationChart, 
  TechnologyGapChart, 
  InnovationRadarChart 
} from "../components/Visualizations";

export default function AnalysisResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "gaps"; // Default to gaps as it is the most important
  const [data, setData] = useState<AnalysisState | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("latest_results");
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch (err) {
        console.error("Failed to parse cached results");
      }
    }
  }, []);

  const handleTabChange = (val: string) => {
    setSearchParams({ tab: val });
  };

  // If no data is analyzed yet, display a beautiful empty state
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-darkBorder flex items-center justify-center text-zinc-600">
          <Inbox className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">No Analysis Records Yet</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            You must input a technology domain in the dashboard first to let our multi-agent pipeline crawl and compile reports.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="gap-2">
          Go to Dashboard <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-darkBorder/30 pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Analysis Results</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{data.domain}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>New Query</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="gaps">Technology Gaps</TabsTrigger>
          <TabsTrigger value="ideas">Innovation Ideas</TabsTrigger>
          <TabsTrigger value="research">Research Topics</TabsTrigger>
          <TabsTrigger value="patents">Patent Clusters</TabsTrigger>
        </TabsList>

        {/* --- TECHNOLOGY GAPS TAB --- */}
        <TabsContent value="gaps" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
                Ranked Technology Gaps
              </h3>
              
              {data.gap_matrix.map((gap, index) => {
                const isTop = index === 0;
                return (
                  <Card 
                    key={gap.area} 
                    className={`p-6 transition-all duration-300 ${
                      isTop 
                        ? "border-indigo-500/50 bg-[#121220]/65 shadow-md shadow-indigo-500/10 timeline-glow" 
                        : "hover:border-darkBorder/80 bg-[#12121A]/45"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2.5">
                          {isTop && (
                            <Badge variant="success" className="gap-1.5 py-0.5">
                              <Trophy className="w-3.5 h-3.5" />
                              <span>Top Opportunity</span>
                            </Badge>
                          )}
                          <h4 className="text-md font-bold text-white">{gap.area}</h4>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed">{gap.rationale}</p>
                        <div className="flex items-center gap-4 pt-2.5 text-xs">
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <span>Research Activity:</span>
                            <Badge variant={gap.research_activity === "High" ? "success" : gap.research_activity === "Medium" ? "warning" : "destructive"}>
                              {gap.research_activity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <span>Patent Saturation:</span>
                            <Badge variant={gap.patent_activity === "High" ? "destructive" : gap.patent_activity === "Medium" ? "warning" : "success"}>
                              {gap.patent_activity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-zinc-900 border border-darkBorder flex flex-col justify-center min-w-[70px]">
                        <span className="text-xl font-bold text-indigo-400">{gap.opportunity_score}</span>
                        <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wide mt-0.5">Score</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Gap Analysis Chart Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Gap Score Distribution</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Relative comparison of innovation opportunities</p>
                </div>
                <TechnologyGapChart gaps={data.gap_matrix} />
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- INNOVATION IDEAS TAB --- */}
        <TabsContent value="ideas" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 animate-pulse-slow" />
                Generated Innovation Opportunities
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.innovation_ideas.map((idea, index) => (
                  <Card key={idea.name} className="flex flex-col justify-between hover:border-darkBorder/80 bg-[#12121A]/55">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{idea.name}</h4>
                        {idea.novelty_score && (
                          <Badge variant="default">{idea.novelty_score}% Novel</Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider block mt-1">{idea.type}</span>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                      <p className="text-zinc-400 text-xs leading-relaxed">{idea.description}</p>
                      
                      <div className="space-y-2 pt-2 border-t border-darkBorder/40">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Based On Gap:</span>
                          <span className="text-white font-medium truncate max-w-[150px]">{idea.based_on_gap}</span>
                        </div>
                        {idea.market_potential && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Market Potential:</span>
                            <Badge variant={idea.market_potential === "High" ? "success" : "warning"}>{idea.market_potential}</Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-1.5"
                        onClick={() => navigate(`/innovation/${index}`)}
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* Innovation Radar Chart */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Innovation Capabilities</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Feasibility and novelty analysis variables</p>
                </div>
                <InnovationRadarChart domain={data?.domain} />
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- RESEARCH TOPICS TAB --- */}
        <TabsContent value="research" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-emerald-400" />
                Active Academic Research Topics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.research_topics.map(topic => (
                  <Card key={topic.topic} className="p-5 space-y-3 bg-[#12121A]/45 hover:border-darkBorder/80">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white leading-snug">{topic.topic}</h4>
                      <Badge variant={topic.research_activity === "High" ? "success" : topic.research_activity === "Medium" ? "warning" : "destructive"}>
                        {topic.research_activity}
                      </Badge>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">{topic.description}</p>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-darkBorder/30 text-xs text-zinc-500">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>Relative Citation Strength:</span>
                      <span className="text-white font-semibold">{topic.citation_strength}/100</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Research Chart Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Research Citation Strength</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Scholarly search indexing weights</p>
                </div>
                <ResearchActivityChart researchTopics={data.research_topics} />
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- PATENT CLUSTERS TAB --- */}
        <TabsContent value="patents" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scroll className="w-5 h-5 text-purple-400" />
                Patent Saturation Clusters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.patent_clusters.map(cluster => (
                  <Card key={cluster.category} className="p-5 space-y-3 bg-[#12121A]/45 hover:border-darkBorder/80">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white leading-snug">{cluster.category}</h4>
                      <Badge variant={cluster.saturation === "High" ? "destructive" : cluster.saturation === "Medium" ? "warning" : "success"}>
                        {cluster.saturation} Saturation
                      </Badge>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">{cluster.description}</p>
                    <div className="pt-2 border-t border-darkBorder/30 space-y-1">
                      <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        Major Assignees
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cluster.major_assignees.map(a => (
                          <span key={a} className="text-[10px] bg-zinc-900 border border-darkBorder text-zinc-300 px-2 py-0.5 rounded">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Patent Chart Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Patent Saturation Ratios</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Clustering distribution by saturation</p>
                </div>
                <PatentSaturationChart patentClusters={data.patent_clusters} />
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
