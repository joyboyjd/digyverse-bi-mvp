"use client";

import React from "react";
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  BarChart3, 
  Sparkles, 
  Settings, 
  Activity,
  Menu,
  X,
  Network
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useIndustryContext } from "@/context/IndustryContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { viewState } = useIndustryContext();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/" },
    { id: "ingestion", label: "Excel Ingestion", icon: FileSpreadsheet, href: "/ingestion" },
    { id: "kpis", label: "KPI Dashboards", icon: BarChart3, href: "/kpis" },
    { id: "marketing", label: "AI Marketing Engine", icon: Sparkles, href: "/marketing" },
    ...(viewState === "healthcare" ? [{ id: "affiliates", label: "PRO Network", icon: Network, href: "/affiliates" }] : []),
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <>


      {/* Sidebar Container */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 lg:static lg:block lg:translate-x-0 transition-transform duration-300 ease-in-out border-r border-zinc-800/80 bg-zinc-950/65 backdrop-blur-xl flex flex-col">
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl glow-emerald flex items-center justify-center">
              <Activity size={20} className="text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Digyverse BI
              </h1>
              <p className="text-[10px] font-sans font-medium uppercase tracking-widest text-emerald-400">
                Operations MVP
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-zinc-900 to-zinc-900/60 text-white border-l-2 border-emerald-500 shadow-inner"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
                  }`}
                />
                <span className="font-sans">{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 glow-emerald" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info card */}
        <div className="p-4 border-t border-zinc-900">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center font-heading text-sm font-semibold text-zinc-300 border border-zinc-700">
                  JP
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse" />
              </div>
              <div className="overflow-hidden">
                <p className="font-heading text-xs font-semibold text-white truncate">Jaydev Panchal</p>
                <p className="font-sans text-[10px] text-zinc-500 truncate">Demo Account</p>
              </div>
            </div>
          </div>
        </div>
      </aside>


    </>
  );
}
