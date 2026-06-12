"use client";

import React, { useState } from "react";
import { useIndustryContext } from "@/context/IndustryContext";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import { useData } from "../context/DataContext";

// Lucide Icons
import {
  Users,
  Stethoscope,
  IndianRupee,
  LineChart,
  ShoppingBag,
  Utensils,
  Zap,
  TrendingUp,
  FileCheck,
  Bed,
  Network,
  Trophy,
  CalendarCheck
} from "lucide-react";

import dynamic from "next/dynamic";
const AnalyticsCharts = dynamic(() => import("@/components/analytics-charts"), { ssr: false });

export default function Home() {

  const { viewState } = useIndustryContext();
  const { parsedMetrics } = useData();

  // --- REAL-TIME MATH ENGINE ---
  // 1. Default fallback metrics
  let ipdCount = 1245;
  let opdCount = 4892;
  let ipdARPP = 45500;
  let opdARPP = 850;
  let totalRevenue = 52400000;
  let activeChannels = 4;
  let topChannelName = "Direct Walk-in";
  let topChannelRev = 18500000;
  let followUpCount = 856;

  // 2. Dynamic Calculation
  if (parsedMetrics?.sheetData && parsedMetrics.sheetData.length > 0) {
    const data = parsedMetrics.sheetData;

    // IPD Logic
    const ipdRows = data.filter((row: any) => 
      row.Treatment_Type?.toString().toUpperCase().includes('IPD') || 
      row.Treatment_Type?.toString().toUpperCase().includes('IN-PATIENT')
    );
    ipdCount = ipdRows.length > 0 ? ipdRows.length : data.length; 
    const ipdRevenue = ipdRows.reduce((sum: number, row: any) => sum + (Number(row.Billing_Amount_INR) || 0), 0);
    if (ipdCount > 0) ipdARPP = Math.round(ipdRevenue / ipdCount);

    // OPD Logic
    const opdRows = data.filter((row: any) => 
      row.Treatment_Type?.toString().toUpperCase().includes('OPD') || 
      row.Treatment_Type?.toString().toUpperCase().includes('OUT-PATIENT')
    );
    if (opdRows.length > 0) {
      opdCount = opdRows.length;
      const opdRevenue = opdRows.reduce((sum: number, row: any) => sum + (Number(row.Billing_Amount_INR) || 0), 0);
      opdARPP = Math.round(opdRevenue / opdCount);
    }

    // Total Revenue & Channels
    totalRevenue = data.reduce((sum: number, row: any) => sum + (Number(row.Billing_Amount_INR) || 0), 0);
    
    // Count unique acquisition channels
    const uniqueChannels = new Set(data.map((row: any) => row.Acquisition_Channel).filter(Boolean));
    if (uniqueChannels.size > 0) activeChannels = uniqueChannels.size;

    // Identify Top Performing Channel
    const channelRevMap: Record<string, number> = {};
    data.forEach((row: any) => {
      const channel = row.Acquisition_Channel || "Unknown";
      const rev = Number(row.Billing_Amount_INR) || 0;
      channelRevMap[channel] = (channelRevMap[channel] || 0) + rev;
    });
    
    let maxRev = 0;
    let topChan = "N/A";
    for (const [chan, rev] of Object.entries(channelRevMap)) {
      if (rev > maxRev && chan !== "Unknown" && chan !== "") {
        maxRev = rev;
        topChan = chan;
      }
    }
    if (maxRev > 0) {
      topChannelName = topChan;
      topChannelRev = maxRev;
    }

    // Follow-up Pipeline
    const fRows = data.filter((row:any) => 
      row.Follow_Up_Required?.toString().toUpperCase() === 'YES' || 
      row.Follow_Up_Required === true
    );
    if (fRows.length > 0) followUpCount = fRows.length;
  }
  // -----------------------------
  
  const [syncMetricBonus] = useState(0);

  const handleRefresh = () => {
    alert("Clearing caches and hot-reloading dashboard analytics... Done!");
  };

  return (
    <div className="flex flex-1 min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <DashboardHeader onRefresh={handleRefresh} />

        <div className="flex-1 pb-12">
          <div className="p-6 sm:p-8 space-y-8">
              
              {syncMetricBonus > 0 && (
                <div className="glass-panel p-4 rounded-2xl border-emerald-500/30 bg-emerald-950/20 text-white flex items-center justify-between animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">Dashboard Synced</h4>
                      <p className="font-sans text-xs text-zinc-300 mt-0.5">
                        Injected real-time data from Operations Log.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-400 text-zinc-950 font-mono text-[9px] font-extrabold uppercase">
                    Cache Warm
                  </span>
                </div>
              )}

              {/* View Rendering */}
              {viewState === "healthcare" ? (
                <>
                  {/* ROW 1: Operations Health */}
                  <div>
                    <h3 className="text-sm font-heading font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
                      Core Operations Health
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      <MetricCard
                        title="IPD Admissions"
                        value={ipdCount.toLocaleString("en-IN")}
                        subtext="Hospitalized care capacity utilized"
                        trend={{ value: "+12.5%", isPositive: true }}
                        icon={Bed}
                        themeColor="emerald"
                        sparklineData={[1100, 1150, 1200, 1220, ipdCount]}
                      />
                      <MetricCard
                        title="OPD Consultations"
                        value={opdCount.toLocaleString("en-IN")}
                        subtext="Daily walk-ins and direct booking"
                        trend={{ value: "+3.2%", isPositive: true }}
                        icon={Users}
                        themeColor="blue"
                        sparklineData={[4500, 4600, 4750, 4800, opdCount]}
                      />
                      <MetricCard
                        title="Average Revenue (IPD)"
                        value={`₹${ipdARPP.toLocaleString("en-IN")}`}
                        subtext="Yield per admitted patient"
                        trend={{ value: "+4.1%", isPositive: true }}
                        icon={Stethoscope}
                        themeColor="emerald"
                        sparklineData={[42000, 43500, 44000, 45000, ipdARPP]}
                      />
                      <MetricCard
                        title="Average Revenue (OPD)"
                        value={`₹${opdARPP.toLocaleString("en-IN")}`}
                        subtext="Yield per walk-in visit"
                        trend={{ value: "-1.2%", isPositive: false }}
                        icon={LineChart}
                        themeColor="amber"
                        sparklineData={[900, 880, 890, 860, opdARPP]}
                      />
                    </div>
                  </div>

                  {/* ROW 2: Marketing & Pipeline */}
                  <div>
                    <h3 className="text-sm font-heading font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
                      Marketing & Acquisition Pipeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      <MetricCard
                        title="Total Revenue"
                        value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                        subtext="Combined IPD & OPD billing"
                        trend={{ value: "+8.2%", isPositive: true }}
                        icon={IndianRupee}
                        themeColor="emerald"
                        sparklineData={[48000000, 49500000, 51000000, 52000000, totalRevenue]}
                      />
                      <MetricCard
                        title="Acquisition Channels"
                        value={activeChannels.toString()}
                        subtext="Unique incoming patient pipelines"
                        trend={{ value: "Active", isPositive: true }}
                        icon={Network}
                        themeColor="purple"
                        sparklineData={[2, 3, 3, 4, activeChannels]}
                      />
                      <MetricCard
                        title="Top Channel"
                        value={topChannelName}
                        subtext={`₹${topChannelRev.toLocaleString("en-IN")} generated`}
                        trend={{ value: "Leading", isPositive: true }}
                        icon={Trophy}
                        themeColor="blue"
                        sparklineData={[12000000, 14000000, 16000000, 17500000, topChannelRev]}
                      />
                      <MetricCard
                        title="Pending Follow-ups"
                        value={followUpCount.toLocaleString("en-IN")}
                        subtext="Scheduled retention pipeline"
                        trend={{ value: "+18%", isPositive: true }}
                        icon={CalendarCheck}
                        themeColor="amber"
                        sparklineData={[700, 750, 800, 820, followUpCount]}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Retail / General Fallback UI */
                <div>
                   <h3 className="text-sm font-heading font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
                      Business Operations
                    </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <MetricCard
                      title="Total Weekly Orders"
                      value={parsedMetrics?.totalOrders ? parsedMetrics.totalOrders.toLocaleString("en-IN") : "3,842"}
                      subtext="In-house and delivery dispatches"
                      trend={{ value: "+15.2%", isPositive: true }}
                      icon={ShoppingBag}
                      themeColor="blue"
                      sparklineData={[3200, 3400, 3600, 3750, parsedMetrics?.totalOrders || 3842]}
                    />
                    <MetricCard
                      title="Dine-in Covers"
                      value={parsedMetrics?.dineinCovers ? parsedMetrics.dineinCovers.toLocaleString("en-IN") : "1,520"}
                      subtext="Physical table seating capacity used"
                      trend={{ value: "+5.1%", isPositive: true }}
                      icon={Utensils}
                      themeColor="emerald"
                      sparklineData={[1400, 1450, 1480, 1500, parsedMetrics?.dineinCovers || 1520]}
                    />
                    <MetricCard
                      title="Marketing Yield"
                      value={parsedMetrics?.marketingYield ? `₹${(parsedMetrics.marketingYield + (syncMetricBonus * 12)).toLocaleString("en-IN")}` : "₹1,84,500"}
                      subtext="Direct Meta campaign returns"
                      trend={{ value: "+3.4%", isPositive: true }}
                      icon={IndianRupee}
                      themeColor="blue"
                      sparklineData={[15000, 16500, 16100, 17800, parsedMetrics?.marketingYield || (18450 + (syncMetricBonus * 12))]}
                    />
                    <MetricCard
                      title="Cost Per Acquisition"
                      value={parsedMetrics?.costPerAcquisition ? `₹${parsedMetrics.costPerAcquisition.toFixed(2)}` : "₹145.50"}
                      subtext="Meta campaigns and local outreach"
                      trend={{ value: "-2.1%", isPositive: false }}
                      icon={LineChart}
                      themeColor="amber"
                      sparklineData={[3.8, 3.7, 3.8, 3.6, parsedMetrics?.costPerAcquisition || 3.6]}
                    />
                  </div>
                </div>
              )}

            {/* Dynamic Recharts Integration */}
            <AnalyticsCharts viewState={viewState} />

          </div>
        </div>
      </main>
    </div>
  );
}