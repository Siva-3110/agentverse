import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Database, 
  GitBranch, 
  Lightbulb, 
  ShieldAlert, 
  BookOpen, 
  TrendingUp,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

/* ─── Particle Canvas Background ─── */
function ParticleMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const numParticles = 55;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.8 + 0.8
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.09;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = "rgba(139, 92, 246, 0.28)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />;
}

/* ─── Animated connector arrow between steps ─── */
function StepConnector() {
  return (
    <div className="hidden lg:flex items-center justify-center flex-shrink-0 px-1 z-10">
      <div className="relative flex items-center">
        <div className="w-8 h-px bg-gradient-to-r from-indigo-500/40 to-purple-500/40" />
        <ChevronRight className="w-4 h-4 text-indigo-400/60 -ml-1" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("latest_results");
    localStorage.removeItem("active_domain");
    localStorage.removeItem("active_session_id");
  }, []);

  const handleStartAnalysis = () => {
    navigate("/dashboard");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const pipelineSteps = [
    {
      icon: BookOpen,
      color: "text-cyan-400",
      glow: "from-cyan-500/20 to-transparent",
      border: "border-cyan-500/15",
      title: "Research Intelligence",
      desc: "Analyze global research activity and identify emerging scientific trends."
    },
    {
      icon: Database,
      color: "text-purple-400",
      glow: "from-purple-500/20 to-transparent",
      border: "border-purple-500/15",
      title: "Patent Landscape Analysis",
      desc: "Map active filings, commercial ownership, and technology saturation."
    },
    {
      icon: GitBranch,
      color: "text-pink-400",
      glow: "from-pink-500/20 to-transparent",
      border: "border-pink-500/15",
      title: "Technology Gap Detection",
      desc: "Discover high-momentum research fields with no active patent coverage."
    },
    {
      icon: Lightbulb,
      color: "text-emerald-400",
      glow: "from-emerald-500/20 to-transparent",
      border: "border-emerald-500/15",
      title: "Innovation Generation",
      desc: "Synthesize novel product concepts and ready-to-file patent specifications."
    },
    {
      icon: ShieldAlert,
      color: "text-amber-400",
      glow: "from-amber-500/20 to-transparent",
      border: "border-amber-500/15",
      title: "Patentability Assessment",
      desc: "Score novelty, check prior art, and validate filing feasibility."
    }
  ];

  const capabilities = [
    {
      icon: BookOpen,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      hoverBorder: "hover:border-cyan-400/40",
      glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
      title: "Research Intelligence",
      desc: "Analyze global research activity from academic databases and identify emerging scientific trends."
    },
    {
      icon: Database,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      hoverBorder: "hover:border-purple-400/40",
      glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]",
      title: "Patent Landscape Mapping",
      desc: "Understand patent saturation, commercial activity, and ownership concentration."
    },
    {
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-400/40",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
      title: "Innovation Opportunity Discovery",
      desc: "Identify unexplored technology opportunities and generate patent-ready concepts."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070c] text-zinc-300 relative flex flex-col overflow-x-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* Ambient Background Gradients */}
      <div className="fixed top-0 left-1/4 w-[900px] h-[900px] bg-indigo-600/4 rounded-full blur-[250px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-1/5 w-[700px] h-[700px] bg-purple-600/4 rounded-full blur-[220px] pointer-events-none z-0" />
      <div className="fixed bottom-[15%] left-1/3 w-[600px] h-[600px] bg-cyan-600/3 rounded-full blur-[200px] pointer-events-none z-0" />

      {/* ──────────────────────────────── NAVBAR ──────────────────────────────── */}
      <header className="fixed top-0 w-full h-16 z-50 border-b border-white/[0.04] bg-[#05070c]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-6 lg:px-8">
          
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              PatentScout <span className="text-indigo-400">AI</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold text-zinc-400">
            <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors duration-200 cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection("pipeline")} className="hover:text-white transition-colors duration-200 cursor-pointer">
              How It Works
            </button>
          </nav>

          <Button 
            className="h-8 font-bold text-[11px] px-4 bg-white text-black hover:bg-zinc-100 shadow-md shadow-white/5 border border-white/10 rounded-lg"
            onClick={handleStartAnalysis}
          >
            Start Analysis
          </Button>
        </div>
      </header>

      {/* ──────────────────────────────── SECTION 1: HERO ──────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-16 pb-8 overflow-hidden">
        <ParticleMeshBackground />

        {/* Centered glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/6 rounded-full blur-[160px] pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 backdrop-blur-sm text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Autonomous Multi-Agent Intelligence System</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold tracking-tight text-white leading-[1.05] max-w-4xl mx-auto">
            Discover The Next{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Patent Opportunity
            </span>{" "}
            Before Anyone Else
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            PatentScout AI analyzes research activity, patent landscapes, technology gaps, innovation opportunities, and patentability potential through an autonomous multi-agent intelligence system.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              onClick={handleStartAnalysis}
              className="h-12 font-bold text-sm px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity shadow-xl shadow-indigo-500/20 border border-indigo-400/20 rounded-xl group"
            >
              Start Analysis
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection("pipeline")}
              className="h-12 font-bold text-sm px-8 border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl backdrop-blur-sm"
            >
              How It Works
            </Button>
          </div>

          {/* Subtle stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-white/5">
            {[
              { label: "Research Papers Analyzed", value: "100,000+" },
              { label: "Patent Records", value: "1.5M+" },
              { label: "AI Agents", value: "5" }
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────── SECTION 2: HOW IT WORKS ──────────────────────────────── */}
      <section id="pipeline" className="py-24 px-6 lg:px-8 border-t border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <Badge variant="outline" className="border-indigo-500/25 text-indigo-400 uppercase tracking-widest font-bold text-[9px] py-0.5 px-3">
              Pipeline
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto">
              Five autonomous agents working in sequence to deliver complete innovation intelligence.
            </p>
          </div>

          {/* Horizontal flow */}
          <div className="flex flex-col lg:flex-row items-stretch gap-0">
            {pipelineSteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={step.title} className="flex flex-col lg:flex-row items-stretch flex-1 min-w-0">
                  {/* Card */}
                  <div className={`flex-1 p-6 rounded-2xl bg-[#0a0d14]/60 border ${step.border} backdrop-blur-sm hover:bg-[#0d1020]/80 transition-all duration-300 group relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl bg-[#07090f] border ${step.border} flex items-center justify-center ${step.color} transition-transform group-hover:scale-110 duration-300`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 font-mono">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-snug mb-2">{step.title}</h3>
                        <p className="text-zinc-500 text-[11px] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                  {/* Connector (not after last item) */}
                  {idx < pipelineSteps.length - 1 && <StepConnector />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────── SECTION 3: CORE CAPABILITIES ──────────────────────────────── */}
      <section id="features" className="py-24 px-6 lg:px-8 border-t border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <Badge variant="outline" className="border-purple-500/25 text-purple-400 uppercase tracking-widest font-bold text-[9px] py-0.5 px-3">
              Capabilities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Core Capabilities
            </h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto">
              Everything you need to discover, analyze, and act on patent opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {capabilities.map(cap => {
              const IconComp = cap.icon;
              return (
                <Card
                  key={cap.title}
                  className={`relative overflow-hidden p-8 bg-[#0a0d14]/60 border ${cap.border} ${cap.hoverBorder} ${cap.glow} backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 group rounded-2xl`}
                >
                  {/* Large background icon watermark */}
                  <div className="absolute bottom-4 right-4 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500">
                    <IconComp className="w-28 h-28" />
                  </div>
                  
                  <div className="relative z-10 space-y-5">
                    <div className={`w-14 h-14 rounded-2xl ${cap.bg} border ${cap.border} flex items-center justify-center ${cap.color} transition-transform group-hover:scale-110 duration-300`}>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div className="space-y-2.5">
                      <h3 className="font-extrabold text-white text-lg leading-snug tracking-tight">{cap.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{cap.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────── SECTION 4: FINAL CTA ──────────────────────────────── */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden z-10 border-t border-white/[0.04]">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/4 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready To Discover Your Next{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Innovation Breakthrough?
              </span>
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-lg mx-auto">
              Launch PatentScout AI and begin exploring technology opportunities powered by autonomous agents.
            </p>
          </div>

          <Button 
            onClick={handleStartAnalysis}
            className="h-13 font-bold text-sm px-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity shadow-2xl shadow-indigo-500/25 border border-indigo-400/20 rounded-xl group"
          >
            Start Analysis
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-14 border-t border-white/[0.04] flex items-center justify-center text-[10px] text-zinc-600 bg-[#05070c] z-10 font-medium relative">
        &copy; {new Date().getFullYear()} PatentScout AI. All Rights Reserved.
      </footer>
    </div>
  );
}
