"use client";

import React, { useState } from "react";
import { Settings, Shield, Link, Database, Check, RefreshCw } from "lucide-react";
import { useIndustryContext } from "@/context/IndustryContext";

export default function SettingsPanel() {
  const { viewState } = useIndustryContext();
  const [isSaving, setIsSaving] = useState(false);
  const [connectors, setConnectors] = useState([
    { id: "primary", name: viewState === "healthcare" ? "Hospital HMS Connector" : "Cloud POS System Connector", type: viewState === "healthcare" ? "Clinical DB" : "Retail DB", status: "online", lastSync: "2 mins ago" },
    { id: "gads", name: "Google Ad Manager API", type: "Marketing Network", status: "online", lastSync: "10 mins ago" },
    { id: "meta", name: "Meta Conversions API", type: "Social Network", status: "offline", lastSync: "Never" },
  ]);
  const [apiKey, setApiKey] = useState("agy_live_948f29d81ba0488cd7230aa1");
  const [systemAlerts, setSystemAlerts] = useState(true);

  const toggleConnector = (id: string) => {
    setConnectors(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === "online" ? "offline" : "online" }
          : c
      )
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("System configuration settings deployed successfully!");
    }, 1000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form Settings */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 glow-emerald space-y-5">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Shield size={16} className="text-emerald-400" />
              General System Configurations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-sans text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                  Organization Scope Name
                </label>
                <input
                  type="text"
                  defaultValue={viewState === "healthcare" ? "Metro Healthcare Group & Retail" : "Gourmet Cafe Group"}
                  key={viewState} // Forces re-render of default value when state changes
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500/50 outline-none text-xs font-sans text-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-sans text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                  Default Target Workspace
                </label>
                <input
                  type="text"
                  defaultValue={viewState === "healthcare" ? "Boston Operations / Metro Division" : "Downtown Kitchens / Metro Division"}
                  key={viewState + "-workspace"}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500/50 outline-none text-xs font-sans text-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                Secret Antigravity API Access Token
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500/50 outline-none text-xs font-mono text-white transition-colors"
              />
              <span className="text-[10px] text-zinc-500 block font-sans mt-0.5">
                Utilized to authenticate autonomous AI marketing campaigns and model prompts.
              </span>
            </div>

            {/* Alert toggle */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/30 border border-zinc-850 rounded-xl">
              <div>
                <h5 className="font-heading text-xs font-bold text-white">Dynamic Discord/Slack Alarms</h5>
                <p className="font-sans text-[10px] text-zinc-400 mt-0.5">Alert administrative staffs if external referrals trigger payouts exceeding threshold.</p>
              </div>

              <button
                type="button"
                onClick={() => setSystemAlerts(!systemAlerts)}
                className={`w-10 h-6 rounded-full p-1 transition-colors outline-none cursor-pointer ${
                  systemAlerts ? "bg-emerald-400" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                    systemAlerts ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl text-zinc-950 font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Check size={12} className="stroke-[2.5]" />
                  Save System Configurations
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Active Connectors */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 glow-emerald">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
              <Link size={16} className="text-emerald-400" />
              API Connectors (HMS/Ads)
            </h3>

            <div className="space-y-4">
              {connectors.map((conn) => (
                <div key={conn.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/80">
                  <div>
                    <h5 className="font-heading text-xs font-bold text-zinc-200">
                      {conn.id === "primary" ? (viewState === "healthcare" ? "Hospital HMS Connector" : "Cloud POS System Connector") : conn.name}
                    </h5>
                    <p className="font-sans text-[10px] text-zinc-500 mt-0.5">
                      Type: {conn.id === "primary" ? (viewState === "healthcare" ? "Clinical DB" : "Retail DB") : conn.type} | Last Sync: {conn.lastSync}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleConnector(conn.id)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-sans font-bold cursor-pointer transition-all ${
                      conn.status === "online"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                    }`}
                  >
                    {conn.status === "online" ? "Active" : "Offline"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 glow-emerald text-center">
            <Database className="text-zinc-500 mx-auto mb-3 stroke-[1.2]" size={28} />
            <h4 className="font-heading text-xs font-bold text-white">Ingestion Node Version</h4>
            <p className="font-mono text-[9px] text-zinc-500 mt-1">v0.9.4-release.agy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
