import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ResearchPage from "./pages/ResearchPage";
import PatentsPage from "./pages/PatentsPage";
import GapsPage from "./pages/GapsPage";
import InnovationPage from "./pages/InnovationPage";
import InnovationDetailPage from "./pages/InnovationDetailPage";
import PatentabilityPage from "./pages/PatentabilityPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function LayoutWrapper() {
  const location = useLocation();
  const path = location.pathname;

  const isLanding = path === "/";

  const getTopbarTitle = (pathname: string) => {
    if (pathname === "/" || pathname.startsWith("/dashboard")) return "Platform Dashboard";
    if (pathname.startsWith("/research")) return "Research Intelligence Ingestion";
    if (pathname.startsWith("/patents")) return "Patent Saturation Landscapes";
    if (pathname.startsWith("/gaps")) return "Technology Opportunity Matrix";
    if (pathname.startsWith("/innovation")) return "Filing Candidates & Specs";
    if (pathname.startsWith("/patentability")) return "Filing Score & Patentability Assessments";
    if (pathname.startsWith("/history")) return "Saved Analysis Sessions";
    if (pathname.startsWith("/settings")) return "System Metrics & Diagnostic Panel";
    return "Platform Console";
  };

  if (isLanding) {
    return (
      <div className="min-h-screen bg-[#05070c] overflow-y-auto text-zinc-300 relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#080B14] overflow-hidden text-zinc-300">
      {/* Sidebar */}
      <Sidebar className="hidden md:flex flex-shrink-0" />

      {/* Main Layout Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={getTopbarTitle(path)} />
        <main className="flex-1 overflow-y-auto px-6 py-6 radial-glow-container relative">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/patents" element={<PatentsPage />} />
            <Route path="/gaps" element={<GapsPage />} />
            <Route path="/innovation" element={<InnovationPage />} />
            <Route path="/innovation/:id" element={<InnovationDetailPage />} />
            <Route path="/patentability" element={<PatentabilityPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}
