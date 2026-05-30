"use client";

import React from "react";
import { ChevronDown, Calendar, RefreshCw, Eye, ShieldAlert } from "lucide-react";

import { usePathname } from "next/navigation";
import { useIndustryContext } from "@/context/IndustryContext";

interface DashboardHeaderProps {
  onRefresh?: () => void;
}

export default function DashboardHeader({
  onRefresh,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const { viewState, setViewState } = useIndustryContext();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getTitle = () => {
    switch (pathname) {
      case "/":
        return "Executive Overview";
      case "/ingestion":
        return "Operations Data Ingestion";
      case "/kpis":
        return "Performance KPI Dashboards";
      case "/marketing":
        return "AI-Powered Marketing Engine";
      case "/affiliates":
        return "Referral & Affiliate Network";
      case "/settings":
        return "System Settings";
      default:
        return "Dashboard";
    }
  };

  const getSubtitle = () => {
    switch (pathname) {
      case "/":
        return "Real-time cross-channel operational metrics and financial yields.";
      case "/ingestion":
        return "Upload and validate raw Excel spreadsheets to update active indexes.";
      case "/kpis":
        return "Detailed modular performance grids and diagnostic tracking dashboards.";
      case "/marketing":
        return "Automated segment target generation and dynamic ad campaign recommendations.";
      case "/affiliates":
        return "Manage external partnerships, inbound PRO funnels, and commission distributions.";
      case "/settings":
        return "Manage data connectors, access control levels, and API tokens.";
      default:
        return "Operations overview.";
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 border-b border-zinc-900 px-6 sm:px-8">
      {/* Title & Metadata */}
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-white">
          {getTitle()}
        </h2>
        <p className="font-sans text-xs text-zinc-400 mt-1 max-w-xl">
          {getSubtitle()}
        </p>
      </div>

      {/* Controller Actions */}
      <div className="flex items-center gap-3 self-end sm:self-center">
        {/* Timestamp */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 font-sans text-xs text-zinc-400">
          <Calendar size={13} className="text-zinc-500" />
          <span>May 2026, Q2 Cycle</span>
        </div>

        {/* View Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 transition-all font-sans text-sm shadow-md cursor-pointer select-none"
          >
            <Eye size={15} className={viewState === "healthcare" ? "text-emerald-400" : "text-blue-400"} />
            <span className="font-medium">
              {viewState === "healthcare" ? "Healthcare / Hospital View" : "General Business / F&B View"}
            </span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {dropdownOpen && (
            <>
              {/* Invisible Backdrop */}
              <div 
                onClick={() => setDropdownOpen(false)} 
                className="fixed inset-0 z-40 bg-transparent" 
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2.5 w-64 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
                <div className="px-3 py-1.5 text-[10px] font-heading font-semibold uppercase tracking-wider text-zinc-500">
                  Select Visual Scope
                </div>
                
                {/* Healthcare Option */}
                <button
                  onClick={() => {
                    setViewState("healthcare");
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg text-left transition-all ${
                    viewState === "healthcare"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <span className="font-sans text-sm font-semibold">Healthcare / Hospital View</span>
                  <span className="text-[10px] text-zinc-500">OPD volumes, medical referrals, pharmacy yield</span>
                </button>

                {/* General Option */}
                <button
                  onClick={() => {
                    setViewState("general");
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg text-left transition-all mt-1 ${
                    viewState === "general"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <span className="font-sans text-sm font-semibold">General Business / F&B View</span>
                  <span className="text-[10px] text-zinc-500">Total orders, menu performance, retail sales</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Refresh trigger */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh active index data"
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>
    </header>
  );
}
