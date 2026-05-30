"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { Award } from "lucide-react";
import { useIndustryContext } from "@/context/IndustryContext";

export default function KPIsPage() {
  const { viewState } = useIndustryContext();

  const handleRefresh = () => {
    // mock refresh
  };

  return (
    <div className="flex flex-1 min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden font-sans">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main dashboard content panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <DashboardHeader onRefresh={handleRefresh} />

        <div className="flex-1 pb-12">
          <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
            <div className="glass-panel rounded-2xl p-6 glow-emerald">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-zinc-950">
                  <Award size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Advanced Performance Analytics</h3>
                  <p className="font-sans text-xs text-zinc-400 mt-0.5">
                    Modular diagnostics dashboard showing clinical referral metrics and restaurant kitchen utilization indexes.
                  </p>
                </div>
              </div>
            </div>

            {/* KPI Performance Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-2xl p-6 glow-emerald space-y-4">
                <h4 className="font-heading text-sm font-bold text-zinc-200">
                  {viewState === "healthcare" ? "Patient Conversion Efficiency" : "Customer Flow & Seating Efficiency"}
                </h4>
                <p className="font-sans text-xs text-zinc-500">
                  {viewState === "healthcare" 
                    ? "Funnel progress mapping out-patient consultations into surgical operations."
                    : "Funnel progress mapping walk-in customers into completed dining experiences."}
                </p>
                <div className="space-y-3">
                  {(viewState === "healthcare" ? [
                    { stage: "Consultation booked", count: 850, rate: "100%" },
                    { stage: "Initial clinical diagnosis", count: 620, rate: "72.9%" },
                    { stage: "Referral scheduled", count: 320, rate: "37.6%" },
                    { stage: "Surgical conversion", count: 95, rate: "11.1%" },
                  ] : [
                    { stage: "Walk-in & Reservations", count: 920, rate: "100%" },
                    { stage: "Table Seated", count: 815, rate: "88.5%" },
                    { stage: "Order Placed", count: 790, rate: "85.8%" },
                    { stage: "Checkout Completed", count: 785, rate: "85.3%" },
                  ]).map((step, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-850">
                      <span className="font-sans text-xs text-zinc-300">{step.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs font-bold text-zinc-200">{step.count} {viewState === "healthcare" ? "cases" : "parties"}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-sans text-[10px] font-bold">
                          {step.rate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 glow-emerald space-y-4">
                <h4 className="font-heading text-sm font-bold text-zinc-200">Operational Yield Matrix</h4>
                <p className="font-sans text-xs text-zinc-500">Resource yield indicators across the main department structures.</p>
                <div className="space-y-3">
                  {(viewState === "healthcare" ? [
                    { name: "Out-Patient Department (OPD)", efficiency: "94.2%", speed: "18 mins avg wait", status: "optimal" },
                    { name: "Emergency Trauma Unit (ER)", efficiency: "88.6%", speed: "8 mins avg triage", status: "warning" },
                    { name: "In-Patient Operations (IPD)", efficiency: "98.1%", speed: "4.2 days stay", status: "optimal" },
                    { name: "High-Speed Pharmacy Desk", efficiency: "96.4%", speed: "3 mins avg dispatch", status: "optimal" },
                  ] : [
                    { name: "Front of House (FOH)", efficiency: "92.5%", speed: "12 mins table turn", status: "optimal" },
                    { name: "Kitchen Line (BOH)", efficiency: "85.2%", speed: "18 mins ticket time", status: "warning" },
                    { name: "Takeaway/Delivery Dispatch", efficiency: "97.1%", speed: "5 mins pack time", status: "optimal" },
                    { name: "Bar & Beverage Station", efficiency: "95.8%", speed: "4 mins prep time", status: "optimal" },
                  ]).map((row, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-850">
                      <div>
                        <span className="font-sans text-xs text-zinc-300 block">{row.name}</span>
                        <span className="font-sans text-[9px] text-zinc-500">{row.speed}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs font-bold text-white">Cap: {row.efficiency}</span>
                        <span className={`w-2 h-2 rounded-full ${row.status === "optimal" ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
