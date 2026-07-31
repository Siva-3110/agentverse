import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Topbar from "../../components/Topbar";

export default function TopicMonitoringPage() {
  const [topicsList, setTopicsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTopics = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/admin/topics")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTopicsList(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching topics:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Admin Operations" }, { label: "Topic Monitoring" }]}
        title="Topic Monitoring Radar"
        subtitle="Global Auto Patent Watch background scanner monitoring across all researcher accounts"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                Global Active Topic Radar ({topicsList.length})
              </h3>
              <p className="text-[12px] font-medium text-slate-500">
                Track all user-followed technology topics monitored by the Agent 09 background scanning loop.
              </p>
            </div>
            <button
              onClick={fetchTopics}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Topics
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-slate-400 font-semibold text-[13px]">
                Loading followed topics...
              </div>
            ) : topicsList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-semibold text-[13px]">
                No active watch topics followed yet. Users can follow topics from Mission Control.
              </div>
            ) : (
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Topic Name</th>
                    <th className="py-3 px-4">Followed By User</th>
                    <th className="py-3 px-4">Scan Frequency</th>
                    <th className="py-3 px-4">Scanner Status</th>
                    <th className="py-3 px-4">Last Automated Scan</th>
                    <th className="py-3 px-4">Next Scan Schedule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {topicsList.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{t.topic}</td>
                      <td className="py-3.5 px-4 text-slate-600">{t.user_email || t.user_name}</td>
                      <td className="py-3.5 px-4"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">{t.frequency || "Daily"}</span></td>
                      <td className="py-3.5 px-4"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">{t.status || "Active"}</span></td>
                      <td className="py-3.5 px-4 text-slate-500">{t.last_checked ? new Date(t.last_checked).toLocaleString() : 'Recent'}</td>
                      <td className="py-3.5 px-4 text-slate-500">{t.next_check ? new Date(t.next_check).toLocaleString() : 'Scheduled'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
