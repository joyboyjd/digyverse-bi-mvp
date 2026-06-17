"use client";

import React, { useState } from "react";
import { LucideIcon, Info } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  themeColor?: "emerald" | "blue" | "purple" | "amber" | "rose";
  sparklineData?: number[];
  tooltip?: string;
}

export default function MetricCard({
  title,
  value,
  subtext,
  trend,
  icon: Icon,
  themeColor = "emerald",
  sparklineData = [],
  tooltip
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const colors = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]" }
  };

  const theme = colors[themeColor];

  const generatePath = (data: number[]) => {
    if (!data || data.length === 0) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const height = 30;
    const width = 100;
    const step = width / (data.length - 1);
    
    return data.map((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div className={`relative glass-panel p-5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 ${theme.glow} group`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-2">
          {/* FIX: Changed to items-start and adjusted text leading/margins */}
          <div className="flex items-start gap-1.5">
            <h4 className="text-[11px] font-heading font-bold text-zinc-400 uppercase tracking-wider leading-snug">
              {title}
            </h4>
            {tooltip && (
              <div 
                className="relative flex items-center justify-center cursor-help mt-[2px]"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info size={13} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] rounded-lg shadow-xl z-50 normal-case tracking-normal leading-relaxed">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-3xl font-sans font-bold text-white mt-1.5 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.border} border shrink-0`}>
          {Icon ? <Icon size={20} className={theme.text} /> : <div className="w-5 h-5 rounded-full bg-zinc-800" />}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <p className="text-xs text-zinc-500 font-sans truncate">{subtext}</p>
        <div className="flex items-end justify-between h-8">
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-bold ${trend.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
              {trend.isPositive ? "↗" : "↘"} {trend.value}
            </div>
          )}
          {sparklineData.length > 0 && (
            <div className="w-24 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 -5 100 40" className="w-full h-full overflow-visible">
                <path d={generatePath(sparklineData)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme.text} />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}