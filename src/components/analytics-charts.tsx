"use client";

import React, { useEffect, useState } from "react";
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
import { TrendingUp, BarChart4, PieChart } from "lucide-react";

interface AnalyticsChartsProps {
  viewState: "general" | "healthcare";
}

export default function AnalyticsCharts({ viewState }: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Healthcare Mock Data
  const healthcareTimelineData = [
    { name: "Jan", OPD: 1850, Referrals: 420 },
    { name: "Feb", OPD: 2100, Referrals: 510 },
    { name: "Mar", OPD: 1980, Referrals: 480 },
    { name: "Apr", OPD: 2400, Referrals: 620 },
    { name: "May", OPD: 2845, Referrals: 780 },
  ];

  const healthcareRoiData = [
    { name: "Meta Ads", spend: 4000, revenue: 15200, roi: 3.8 },
    { name: "Google Search", spend: 3200, revenue: 17600, roi: 5.5 },
    { name: "Referrals", spend: 2500, revenue: 18750, roi: 7.5 },
    { name: "SEO / Organic", spend: 1200, revenue: 4800, roi: 4.0 },
  ];

  // General Business/F&B Mock Data
  const generalTimelineData = [
    { name: "Jan", Orders: 1100, Direct: 800 },
    { name: "Feb", Orders: 1250, Direct: 920 },
    { name: "Mar", Orders: 1190, Direct: 880 },
    { name: "Apr", Orders: 1350, Direct: 1050 },
    { name: "May", Orders: 1420, Direct: 1120 },
  ];

  const generalRoiData = [
    { name: "Instagram Ads", spend: 2500, revenue: 9500, roi: 3.8 },
    { name: "Google Local", spend: 1500, revenue: 6000, roi: 4.0 },
    { name: "Meta Retargeting", spend: 1800, revenue: 5400, roi: 3.0 },
    { name: "Organic Search", spend: 800, revenue: 3600, roi: 4.5 },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 h-[380px] flex items-center justify-center text-zinc-500">
          Loading Timeline Analytics...
        </div>
        <div className="glass-panel rounded-2xl p-6 h-[380px] flex items-center justify-center text-zinc-500">
          Loading ROI Allocation...
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
              Comparison of overall footfall vs customer acquisition channels over time.
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full min-w-[200px]">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={(viewState === "healthcare" ? healthcareTimelineData : generalTimelineData) as any[]}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={viewState === "healthcare" ? "#10b981" : "#3b82f6"} 
                    stopOpacity={0.25} 
                  />
                  <stop 
                    offset="95%" 
                    stopColor={viewState === "healthcare" ? "#10b981" : "#3b82f6"} 
                    stopOpacity={0} 
                  />
                </linearGradient>
                <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.15)" />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid rgba(63, 63, 70, 0.5)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontFamily: "var(--font-inter)",
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} 
              />
              {viewState === "healthcare" ? (
                <>
                  <Area
                    name="Total OPD Intake"
                    type="monotone"
                    dataKey="OPD"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#primaryGrad)"
                  />
                  <Area
                    name="Referral Inflow"
                    type="monotone"
                    dataKey="Referrals"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#secondaryGrad)"
                  />
                </>
              ) : (
                <>
                  <Area
                    name="Total F&B Orders"
                    type="monotone"
                    dataKey="Orders"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#primaryGrad)"
                  />
                  <Area
                    name="Direct Walk-Ins"
                    type="monotone"
                    dataKey="Direct"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#secondaryGrad)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Ad Spend ROI */}
      <div className="glass-panel rounded-2xl p-6 glow-emerald">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <BarChart4 size={18} className="text-emerald-400" />
              Acquisition ROI Distribution
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Breakdown of marketing campaigns and yield return multipliers.
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full min-w-[200px]">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={viewState === "healthcare" ? healthcareRoiData : generalRoiData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.15)" />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                label={{ value: "Return Multiple (x)", angle: -90, position: "insideLeft", offset: 10, style: { fill: "#71717a", fontSize: 10 } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid rgba(63, 63, 70, 0.5)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontFamily: "var(--font-inter)",
                }}
              />
              <Bar 
                name="Ad Yield Multiplier"
                dataKey="roi" 
                radius={[6, 6, 0, 0]}
              >
                {(viewState === "healthcare" ? healthcareRoiData : generalRoiData).map((entry, index) => (
                  <Cell
                    key={`rect-${index}`}
                    fill={
                      viewState === "healthcare"
                        ? index === 2
                          ? "#a855f7" // highlight referrals with purple
                          : "#10b981"
                        : index === 3
                        ? "#a855f7"
                        : "#3b82f6"
                    }
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
