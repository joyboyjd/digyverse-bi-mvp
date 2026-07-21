"use client";

import React, { useMemo } from "react";
import { useData } from "@/context/DataContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const cleanNumber = (val: any): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Universal Revenue Scraper (Prevents double-counting and works on any dataset)
const getGenericTotal = (row: any) => {
  let breakdownSum = 0;
  let explicitTotal = 0;
  
  for (const k of Object.keys(row)) {
    const lower = String(k).toLowerCase();
    if (lower.includes("discount") || lower.includes("id")) continue;

    const val = cleanNumber(row[k]);
    if (val <= 0) continue;

    if (lower === "total_revenue" || lower === "total_bill" || lower === "billing_amount" || lower === "total_amount") {
      explicitTotal += val;
    } else if (lower.includes("revenue") || lower.includes("amount") || lower.includes("bill")) {
      breakdownSum += val;
    }
  }
  return explicitTotal > 0 ? explicitTotal : breakdownSum;
};

// Bomb-proof Date Extractor
const extractMonth = (row: any): string => {
  if (!row) return "Jan";
  
  // 1. Find the date key safely (bypasses \uFEFF invisible characters in CSV headers)
  const dateKey = Object.keys(row).find(k => {
    const lower = String(k).toLowerCase();
    // THE FIX: Using .includes() to ignore hidden characters, while actively blocking "wait_time" columns
    if (lower.includes("date") || lower.includes("created") || lower.includes("visit") || lower.includes("timestamp")) {
      if (!lower.includes("wait") && !lower.includes("stay") && !lower.includes("tat") && !lower.includes("days") && !lower.includes("mins")) {
        return true;
      }
    }
    return false;
  });
  
  if (!dateKey || !row[dateKey]) return "Jan";

  const str = String(row[dateKey]).trim();
  
  // 2. Handle Excel Serial Numbers just in case (e.g., 45348)
  if (!isNaN(Number(str)) && Number(str) > 10000) {
    const excelDate = new Date((Number(str) - 25569) * 86400 * 1000);
    if (!isNaN(excelDate.getTime())) return excelDate.toLocaleString("default", { month: "short" });
  }

  // 3. Try standard JS parsing
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toLocaleString("default", { month: "short" });

  // 4. Fallback for strict DD-MM-YYYY or MM-DD-YYYY parsing
  const parts = str.split(/[\/\-\.]/);
  if (parts.length >= 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    
    let monthIdx = 0;
    if (p0 > 1000) {
      monthIdx = p1 - 1; // YYYY-MM-DD
    } else if (p2 > 1000) {
      monthIdx = p1 > 12 ? p0 - 1 : p1 - 1; // DD-MM-YYYY vs MM-DD-YYYY
    } else {
      monthIdx = p0 - 1; 
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (monthIdx >= 0 && monthIdx <= 11) return months[monthIdx];
  }

  return "Jan";
};

export default function AnalyticsCharts({ viewState }: { viewState?: string }) {
  const { parsedMetrics } = useData();
  const rawData = parsedMetrics?.sheetData || [];
  const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const volumeData = useMemo(() => {
    if (!rawData.length) return [];

    const monthMap: Record<string, { month: string; acquisitions: number; footfall: number }> = {
      "Jan": { month: "Jan", acquisitions: 0, footfall: 0 },
      "Feb": { month: "Feb", acquisitions: 0, footfall: 0 },
      "Mar": { month: "Mar", acquisitions: 0, footfall: 0 },
      "Apr": { month: "Apr", acquisitions: 0, footfall: 0 },
      "May": { month: "May", acquisitions: 0, footfall: 0 },
    };

    rawData.forEach((row: any) => {
      const monthLabel = extractMonth(row);
      if (!monthMap[monthLabel]) monthMap[monthLabel] = { month: monthLabel, acquisitions: 0, footfall: 0 };
      
      monthMap[monthLabel].footfall += 1;

      const channelKey = Object.keys(row).find(k => String(k).toLowerCase().includes("channel") || String(k).toLowerCase().includes("source"));
      const channel = channelKey ? String(row[channelKey]).trim().toLowerCase() : "";
      
      if (channel && channel !== "direct" && !channel.includes("walk-in") && channel !== "unknown" && channel !== "cash") {
        monthMap[monthLabel].acquisitions += 1;
      }
    });

    return Object.values(monthMap)
      .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month))
      .filter(item => item.footfall > 0 || ["Jan", "Feb", "Mar", "Apr", "May"].includes(item.month))
      .map(item => ({
        month: item.month,
        "Campaign Acquisitions": item.acquisitions,
        "Total Patient Footfall": item.footfall,
      }));
  }, [rawData]);

  const channelRevenueData = useMemo(() => {
    if (!rawData.length) return [];

    const channelMap: Record<string, number> = {};

    rawData.forEach((row: any) => {
      const channelKey = Object.keys(row).find(k => String(k).toLowerCase().includes("channel") || String(k).toLowerCase().includes("source"));
      let channel = channelKey ? String(row[channelKey]).trim() : "Direct Walk-in";
      if (!channel || channel.toLowerCase() === "undefined") channel = "Direct Walk-in";

      channelMap[channel] = (channelMap[channel] || 0) + getGenericTotal(row);
    });

    return Object.entries(channelMap)
      .map(([channel, revenue]) => ({
        channel: channel.length > 14 ? channel.slice(0, 12) + ".." : channel,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [rawData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Volume Intake & Source Dynamics</h3>
          <p className="text-xs text-zinc-400">Comparison of overall footfall vs campaign acquisition pipelines over time.</p>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient>
                <linearGradient id="colorFootfall" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.6} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "8px" }} />
              <Legend verticalAlign="bottom" height={36} />
              
              <Area type="monotone" dataKey="Total Patient Footfall" stroke="#10b981" fill="url(#colorFootfall)" strokeWidth={4} fillOpacity={0.5} />
              <Area type="monotone" dataKey="Campaign Acquisitions" stroke="#a855f7" strokeDasharray="6 6" fill="url(#colorAcq)" strokeWidth={3} fillOpacity={0.8} />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Revenue by Channel Pipeline</h3>
          <p className="text-xs text-zinc-400">Top 5 total revenue drivers (₹)</p>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="channel" stroke="#71717a" fontSize={10} interval={0} angle={-20} textAnchor="end" />
              <YAxis stroke="#71717a" fontSize={11} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "8px" }} formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}