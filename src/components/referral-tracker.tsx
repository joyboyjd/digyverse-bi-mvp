"use client";

import React from "react";
import { Award, ArrowUpRight, IndianRupee, CheckCircle2, AlertCircle, Clock, UserCheck } from "lucide-react";

interface ClinicLeaderboardItem {
  rank: number;
  name: string;
  referrals: number;
  revenue: string;
  share: number; // percentage width for progress bar
}

interface PendingCommissionItem {
  id: string;
  patientName: string;
  referringDoctor: string;
  clinic: string;
  commission: string;
  date: string;
  status: "pending" | "approved";
}

export default function ReferralTracker() {
  const [commissions, setCommissions] = React.useState<PendingCommissionItem[]>([
    {
      id: "COM-001",
      patientName: "Sarah Jenkins",
      referringDoctor: "Dr. Allison Vance",
      clinic: "Metro Family Practice",
      commission: "₹150.00",
      date: "May 26, 2026",
      status: "pending",
    },
    {
      id: "COM-002",
      patientName: "David Miller",
      referringDoctor: "Dr. Marcus Thorne",
      clinic: "Apex Cardiology",
      commission: "₹320.00",
      date: "May 25, 2026",
      status: "pending",
    },
    {
      id: "COM-003",
      patientName: "Elena Rostova",
      referringDoctor: "Dr. Allison Vance",
      clinic: "Metro Family Practice",
      commission: "₹180.00",
      date: "May 24, 2026",
      status: "approved",
    },
    {
      id: "COM-004",
      patientName: "Robert Chen",
      referringDoctor: "Dr. Clara Winters",
      clinic: "Hillside Pediatrics",
      commission: "₹95.00",
      date: "May 23, 2026",
      status: "pending",
    },
  ]);

  const leaderboardData: ClinicLeaderboardItem[] = [
    { rank: 1, name: "Apex Cardiology", referrals: 148, revenue: "₹24,500", share: 100 },
    { rank: 2, name: "Metro Family Practice", referrals: 112, revenue: "₹18,400", share: 78 },
    { rank: 3, name: "Hillside Pediatrics", referrals: 89, revenue: "₹12,850", share: 62 },
    { rank: 4, name: "Northside Orthopedics", referrals: 54, revenue: "₹9,200", share: 38 },
  ];

  const handleApprove = (id: string) => {
    setCommissions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "approved" as const } : item
      )
    );
  };

  const pendingCount = commissions.filter(c => c.status === "pending").length;
  const approvedTotal = commissions
    .filter(c => c.status === "approved")
    .reduce((acc, c) => acc + parseFloat(c.commission.replace("₹", "")), 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
      {/* Referring Clinics Leaderboard */}
      <div className="glass-panel rounded-2xl p-6 glow-emerald">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-emerald-400" />
              Referring Clinics Leaderboard
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Performance rankings of external outpatient pipelines.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-sans font-semibold text-emerald-400 flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live Updates
          </span>
        </div>

        <div className="space-y-5">
          {leaderboardData.map((clinic) => (
            <div key={clinic.rank} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-heading text-xs font-bold ${
                    clinic.rank === 1 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                      : clinic.rank === 2
                      ? "bg-slate-300/10 text-slate-300 border border-slate-300/20"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700/30"
                  }`}>
                    {clinic.rank}
                  </span>
                  <span className="font-sans text-sm font-semibold text-zinc-200">{clinic.name}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-sans text-xs font-bold text-white">{clinic.referrals}</span>
                    <span className="font-sans text-[10px] text-zinc-500 ml-1">OPD cases</span>
                  </div>
                  <span className="font-sans text-xs font-bold text-emerald-400">{clinic.revenue}</span>
                </div>
              </div>
              
              {/* Custom Progress Bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                    clinic.rank === 1 
                      ? "from-amber-500 to-yellow-400" 
                      : clinic.rank === 2
                      ? "from-emerald-500 to-teal-400"
                      : "from-blue-500 to-indigo-400"
                  }`} 
                  style={{ width: `${clinic.share}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Virtual PRO Commission Tracker */}
      <div className="glass-panel rounded-2xl p-6 glow-emerald">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-400" />
              PRO Referral Commission Desk
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Verify external referrals and process clinical revenue shares.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-sans font-semibold text-zinc-400">
              {pendingCount} Pending
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-sans font-semibold text-emerald-400">
              ₹{approvedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Paid
            </span>
          </div>
        </div>

        {/* Commission Queue List */}
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {commissions.map((item) => (
            <div 
              key={item.id} 
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                item.status === "approved" 
                  ? "bg-emerald-500/[0.02] border-emerald-500/10" 
                  : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-sm font-bold text-white">{item.patientName}</h4>
                    <span className="font-mono text-[9px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-zinc-400 mt-1">
                    {item.clinic} • <span className="text-zinc-500">{item.referringDoctor}</span>
                  </p>
                  <p className="font-sans text-[10px] text-zinc-500 mt-0.5">
                    Triggered: {item.date}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-sans text-sm font-bold text-emerald-400 flex items-center">
                    <IndianRupee size={13} className="text-emerald-500" />
                    {item.commission.replace("₹", "")}
                  </span>
                  
                  {item.status === "approved" ? (
                    <span className="flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={10} />
                      Disbursed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center gap-1 text-[10px] font-sans font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-950/20"
                    >
                      <Clock size={10} className="stroke-[2.5]" />
                      Release Pay
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
