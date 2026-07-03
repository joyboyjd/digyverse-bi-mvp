"use client";

import React, { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import { TrendingUp, BarChart4 } from "lucide-react";

interface AnalyticsChartsProps {
  viewState: "general" | "healthcare";
}

export default function AnalyticsCharts({ viewState }: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);
  const { parsedMetrics } = useData();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Default Fallback Data (Healthcare)
  const healthcareTimelineData = [
    { name: "Jan", OPD: 1850, Referrals: 420 },
    { name: "Feb", OPD: 2100, Referrals: 510 },
    { name: "Mar", OPD: 1980, Referrals: 480 },
    { name: "Apr", OPD: 2400, Referrals: 620 },
    { name: "May", OPD: 2845, Referrals: 780 },
  ];

  const healthcareRoiData = [
    { name: "Meta Ads", roi: 3.8 },
    { name: "Google Search", roi: 5.5 },
    { name: "Referrals", roi: 7.5 },
    { name: "SEO / Organic", roi: 4.0 },
  ];

  // 2. Default Fallback Data (Retail)
  const generalTimelineData = [
    { name: "Jan", Orders: 1100, Direct: 800 },
    { name: "Feb", Orders: 1250, Direct: 920 },
    { name: "Mar", Orders: 1190, Direct: 880 },
    { name: "Apr", Orders: 1350, Direct: 1050 },
    { name: "May", Orders: 1420, Direct: 1120 },
  ];

  const generalRoiData = [
    { name: "Instagram Ads", roi: 3.8 },
    { name: "Google Local", roi: 4.0 },
    { name: "Meta Retargeting", roi: 3.0 },
    { name: "Organic", roi: 4.5 },
  ];

  // 3. --- REAL-TIME GRAPH ENGINE ---
  let activeTimelineData = viewState === "healthcare" ? healthcareTimelineData : generalTimelineData;
  let activeRoiData = viewState === "healthcare" ? healthcareRoiData : generalRoiData;
  let isDynamic = false;

  if (parsedMetrics?.sheetData && parsedMetrics.sheetData.length > 0) {
    isDynamic = true;
    const data = parsedMetrics.sheetData;
    
    // Calculate Dynamic Timeline (Grouped by Month)
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timelineMap: Record<string, any> = {};
    
    data.forEach((row: any) => {
      // Robust Date Parsing
      let dateVal = row.Admission_Date || row.Date || row.Consultation_Date;
      let month = "Unknown";
      
      if (dateVal) {
        let d;
        if (typeof dateVal === 'number') { 
          d = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
        } else {
          d = new Date(dateVal);
        }
        if (!isNaN(d.getTime())) month = d.toLocaleString('en-US', { month: 'short' });
      }

      if (month !== "Unknown") {
        if (!timelineMap[month]) timelineMap[month] = { name: month, TotalVolume: 0, CampaignAcquired: 0 };
        
        timelineMap[month].TotalVolume += 1;
        
        // Count non-organic acquisitions
        const channel = (row.Acquisition_Channel || "").toString().toUpperCase();
        if (channel && !channel.includes("DIRECT") && !channel.includes("ORGANIC")) {
          timelineMap[month].CampaignAcquired += 1;
        }
      }
    });

    // Sort the months chronologically
    const parsedTimeline = Object.values(timelineMap).sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
    if (parsedTimeline.length > 0) activeTimelineData = parsedTimeline as any;

    // Calculate Dynamic Channel Yield (Top 5 Revenue Drivers)
    const channelMap: Record<string, any> = {};
    data.forEach((row: any) => {
      const channel = row.Acquisition_Channel || "Direct Walk-in";
      const rev = Number(row.Billing_Amount_INR) || 0;
      if (!channelMap[channel]) channelMap[channel] = { name: channel, dynamicValue: 0 };
      // THE FIX: We MUST wrap this in Number() to guarantee it's mathematically sound for the Bar height
      channelMap[channel].dynamicValue = Number(channelMap[channel].dynamicValue) + Number(rev); 
    });

    const parsedChannels = Object.values(channelMap)
      .sort((a, b) => b.dynamicValue - a.dynamicValue)
      .slice(0, 5); // Take top 5
    if (parsedChannels.length > 0) activeRoiData = parsedChannels as any;
  }
  // ---------------------------------

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 h-[380px] flex items-center justify-center text-zinc-500">
          Loading Timeline Analytics...
        </div>
        <div className="glass-panel rounded-2xl p-6 h-[380px] flex items-center justify-center text-zinc-500">
          Loading Yield Allocation...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Area Chart: Operational Timelines */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 glow-emerald">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Volume Intake & Source Dynamics
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Comparison of overall footfall vs campaign acquisition pipelines over time.
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full min-w-[200px]">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activeTimelineData as any[]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={viewState === "healthcare" ? "#10b981" : "#3b82f6"} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={viewState === "healthcare" ? "#10b981" : "#3b82f6"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.15)" />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid rgba(63, 63, 70, 0.5)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontFamily: "var(--font-inter)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              
              <Area
                name={isDynamic ? "Total Patient Footfall" : (viewState === "healthcare" ? "Total OPD Intake" : "Total F&B Orders")}
                type="monotone"
                dataKey={isDynamic ? "TotalVolume" : (viewState === "healthcare" ? "OPD" : "Orders")}
                stroke={viewState === "healthcare" ? "#10b981" : "#3b82f6"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#primaryGrad)"
              />
              <Area
                name={isDynamic ? "Campaign Acquisitions" : (viewState === "healthcare" ? "Referral Inflow" : "Direct Walk-Ins")}
                type="monotone"
                dataKey={isDynamic ? "CampaignAcquired" : (viewState === "healthcare" ? "Referrals" : "Direct")}
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#secondaryGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Yield / ROI */}
      <div className="glass-panel rounded-2xl p-6 glow-emerald">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <BarChart4 size={18} className="text-emerald-400" />
              {isDynamic ? "Revenue by Channel Pipeline" : "Acquisition ROI Distribution"}
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              {isDynamic ? "Top 5 total revenue drivers (₹)" : "Breakdown of marketing campaigns and return multipliers."}
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full min-w-[200px]">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activeRoiData as any[]} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.15)" />
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                // THE FIX: Format as numbers safely
                tickFormatter={(value) => isDynamic ? `₹${(Number(value) / 1000).toFixed(0)}k` : value}
              />
              <Tooltip
                // THE FIX: Force Number() to prevent string crashes in the tooltip renderer
                formatter={(value: any) => isDynamic ? [`₹${Number(value).toLocaleString("en-IN")}`, "Yield Generated"] : [value, "ROI Multiple"]}
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid rgba(63, 63, 70, 0.5)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontFamily: "var(--font-inter)",
                }}
              />
              <Bar 
                name={isDynamic ? "Generated Yield (₹)" : "Ad Yield Multiplier"}
                dataKey={isDynamic ? "dynamicValue" : "roi"} 
                radius={[6, 6, 0, 0]}
              >
                {activeRoiData.map((entry, index) => (
                  <Cell
                    key={`rect-${index}`}
                    fill={index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : "#a855f7"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}