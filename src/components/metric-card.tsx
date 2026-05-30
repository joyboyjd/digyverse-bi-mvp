"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  themeColor?: "emerald" | "blue" | "purple" | "amber";
  sparklineData?: number[];
}

export default function MetricCard({
  title,
  value,
  subtext,
  trend,
  icon: Icon,
  themeColor = "emerald",
  sparklineData,
}: MetricCardProps) {
  const getThemeStyles = () => {
    switch (themeColor) {
      case "emerald":
        return {
          glow: "glow-emerald",
          iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          trendText: "text-emerald-400",
          sparkColor: "stroke-emerald-500",
          gradient: "from-emerald-500/20 to-transparent",
        };
      case "blue":
        return {
          glow: "glow-blue",
          iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          trendText: "text-blue-400",
          sparkColor: "stroke-blue-500",
          gradient: "from-blue-500/20 to-transparent",
        };
      case "purple":
        return {
          glow: "glow-purple",
          iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          trendText: "text-purple-400",
          sparkColor: "stroke-purple-500",
          gradient: "from-purple-500/20 to-transparent",
        };
      case "amber":
        return {
          glow: "glow-amber",
          iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          trendText: "text-amber-400",
          sparkColor: "stroke-amber-500",
          gradient: "from-amber-500/20 to-transparent",
        };
      default:
        return {
          glow: "glow-emerald",
          iconBg: "bg-zinc-800 text-zinc-300 border-zinc-700/50",
          trendText: "text-zinc-400",
          sparkColor: "stroke-zinc-500",
          gradient: "from-zinc-500/20 to-transparent",
        };
    }
  };

  const styles = getThemeStyles();

  // Basic sparkline SVG path generator
  const getSparklinePath = () => {
    if (!sparklineData || sparklineData.length < 2) return "";
    const width = 80;
    const height = 24;
    const padding = 2;
    const maxVal = Math.max(...sparklineData);
    const minVal = Math.min(...sparklineData);
    const spread = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    return sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - minVal) / spread) * (height - padding * 2) - padding;
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className={`glass-panel glass-panel-hover rounded-2xl p-6 ${styles.glow} flex flex-col justify-between h-full`}>
      <div className="flex items-start justify-between">
        {/* Title and Icon */}
        <div className="space-y-1.5">
          <p className="font-sans text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="font-heading text-2xl font-bold tracking-tight text-white mt-1">
            {value}
          </h3>
        </div>

        {/* Dynamic Icon Badge */}
        <div className={`p-2.5 rounded-xl border ${styles.iconBg} flex items-center justify-center`}>
          <Icon size={18} className="stroke-[2]" />
        </div>
      </div>

      {/* Sparkline & Trend Info */}
      <div className="flex items-end justify-between mt-6 pt-4 border-t border-zinc-900/60">
        <div>
          <span className="font-sans text-[11px] text-zinc-500 block">
            {subtext}
          </span>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              {trend.isPositive ? (
                <ArrowUpRight size={14} className="text-emerald-400 stroke-[2.5]" />
              ) : (
                <ArrowDownRight size={14} className="text-rose-400 stroke-[2.5]" />
              )}
              <span className={`font-sans text-xs font-semibold ${trend.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                {trend.value}
              </span>
              <span className="font-sans text-[10px] text-zinc-500 ml-0.5">vs last month</span>
            </div>
          )}
        </div>

        {/* Small Elegant Sparkline */}
        {sparklineData && sparklineData.length >= 2 && (
          <div className="w-20 h-6">
            <svg width="80" height="24" className="overflow-visible">
              <path
                d={getSparklinePath()}
                fill="none"
                className={`${styles.sparkColor} stroke-[2]`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
