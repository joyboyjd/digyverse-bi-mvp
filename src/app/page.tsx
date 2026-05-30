"use client";

import React, { useState } from "react";
import { useIndustryContext } from "@/context/IndustryContext";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";




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
  FileCheck
} from "lucide-react";

import dynamic from "next/dynamic";
const AnalyticsCharts = dynamic(() => import("@/components/analytics-charts"), { ssr: false });

export default function Home() {
  const { viewState } = useIndustryContext();
  
  // Interactive sync states
  // Sync metric bonus state kept for chart compilation but no longer mutable via Excel Ingestion directly
  const [syncMetricBonus] = useState(0);

  const handleRefresh = () => {
    alert("Clearing caches and hot-reloading dashboard analytics... Done!");
  };

  // Dynamic values based on View & Ingest status
  const getOPDCount = () => {
    const base = 2845;
    return (base + syncMetricBonus).toLocaleString("en-IN");
  };

  const getOrdersCount = () => {
    const base = 1420;
    return (base + syncMetricBonus).toLocaleString("en-IN");
  };

  const getReferralRevenue = () => {
    const base = 45210;
    const bonus = syncMetricBonus * 35;
    return `₹${(base + bonus).toLocaleString("en-IN")}`;
  };

  const getGeneralRevenue = () => {
    const base = 18450;
    const bonus = syncMetricBonus * 12;
    return `₹${(base + bonus).toLocaleString("en-IN")}`;
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

        {/* Dashboard Content */}
        <div className="flex-1 pb-12">
          <div className="p-6 sm:p-8 space-y-6">
              
              {/* Interactive Ingest Info Alert */}
              {syncMetricBonus > 0 && (
                <div className="glass-panel p-4 rounded-2xl border-emerald-500/30 bg-emerald-950/20 text-white flex items-center justify-between animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">Dashboard Synced</h4>
                      <p className="font-sans text-xs text-zinc-300 mt-0.5">
                        Injected {importedRowsTotal.toLocaleString("en-IN")} total clinical metrics. Calculated metric offsets: +{syncMetricBonus} OPD footfalls.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-400 text-zinc-950 font-mono text-[9px] font-extrabold uppercase">
                    Cache Warm
                  </span>
                </div>
              )}

              {/* Metric Summary Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {viewState === "healthcare" ? (
                  <>
                  <MetricCard
                    title="In-Patient Admissions"
                    value="1,245"
                    subtext="Hospitalized care capacity utilized"
                    trend={{ value: "+12.5%", isPositive: true }}
                    icon={Stethoscope}
                    themeColor="emerald"
                    sparklineData={[1100, 1150, 1120, 1200, 1245]}
                  />
                  <MetricCard
                    title="Out-Patient Consultations"
                    value="4,892"
                    subtext="Daily walk-ins and direct booking volume"
                    trend={{ value: "+3.2%", isPositive: true }}
                    icon={Users}
                    themeColor="blue"
                    sparklineData={[4500, 4600, 4750, 4800, 4892]}
                  />
                  <MetricCard
                    title="Referral Revenue"
                    value="₹4,52,100"
                    subtext="Yield from external PRO pipelines"
                    trend={{ value: "+8.2%", isPositive: true }}
                    icon={IndianRupee}
                    themeColor="emerald"
                    sparklineData={[35000, 38000, 37200, 41000, 45210 + (syncMetricBonus * 35)]}
                  />
                  <MetricCard
                    title="Pharmacy & Diagnostics"
                    value="₹1,24,500"
                    subtext="Ancillary services profit margins"
                    trend={{ value: "-1.4%", isPositive: false }}
                    icon={LineChart}
                    themeColor="amber"
                    sparklineData={[28000, 29000, 27500, 27800, 28150 + (syncMetricBonus * 10)]}
                  />
                </>
              ) : (
                <>
                  <MetricCard
                    title="Total Weekly Orders"
                    value="3,842"
                    subtext="In-house and delivery dispatches"
                    trend={{ value: "+15.2%", isPositive: true }}
                    icon={ShoppingBag}
                    themeColor="blue"
                    sparklineData={[3200, 3400, 3600, 3750, 3842]}
                  />
                  <MetricCard
                    title="Dine-in Covers"
                    value="1,520"
                    subtext="Physical table seating capacity used"
                    trend={{ value: "+5.1%", isPositive: true }}
                    icon={Utensils}
                    themeColor="emerald"
                    sparklineData={[1400, 1450, 1480, 1500, 1520]}
                  />
                  <MetricCard
                    title="Marketing Yield"
                    value="₹1,84,500"
                    subtext="Direct Meta campaign returns"
                    trend={{ value: "+3.4%", isPositive: true }}
                    icon={IndianRupee}
                    themeColor="blue"
                    sparklineData={[15000, 16500, 16100, 17800, 18450 + (syncMetricBonus * 12)]}
                  />
                  <MetricCard
                    title="Cost Per Acquisition"
                    value="₹145.50"
                    subtext="Meta campaigns and local outreach"
                    trend={{ value: "-2.1%", isPositive: false }}
                    icon={LineChart}
                    themeColor="amber"
                    sparklineData={[3.8, 3.7, 3.8, 3.6, 3.6]}
                  />
                </>
              )}
            </div>

            {/* Dynamic Recharts Integration */}
            <AnalyticsCharts viewState={viewState} />

          </div>
        </div>
      </main>
    </div>
  );
}
