"use client";

import React, { useState } from "react";
import { Sparkles, Megaphone, Target, ArrowRight, RefreshCw, Send, Check } from "lucide-react";
import { useIndustryContext } from "@/context/IndustryContext";

export default function AiMarketingEngine() {
  const { viewState } = useIndustryContext();
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [promptInput, setPromptInput] = useState("");

  const campaignIdeas = viewState === "healthcare" ? [
    {
      id: 1,
      title: "OPD Cardiology Patient Pipeline",
      channel: "Google Search (Local)",
      cost: "₹12.50 / lead",
      target: "Adults 45-70 within 15 miles radius of Metro Hospital",
      impact: "Expected +18% OPD footfall next month",
    },
    {
      id: 2,
      title: "Weekend Gourmet Truffle Brunch Promo",
      channel: "Instagram Geo-Targeted Ads",
      cost: "₹3.80 / reservation",
      target: "Food lovers 22-45 in downtown metro area",
      impact: "Expected +35% weekend table utilization",
    },
    {
      id: 3,
      title: "Local Clinic Referral Expansion Program",
      channel: "Direct Outreach / Virtual PRO",
      cost: "₹0.00 direct cost",
      target: "Independent primary care physicians & practitioners",
      impact: "Expected +10% clinic referral pipelines",
    }
  ] : [
    {
      id: 1,
      title: "Corporate Lunch Catering Expansion",
      channel: "LinkedIn Targeted Ads",
      cost: "₹45.50 / B2B lead",
      target: "Office Managers & HR leads within 5 miles",
      impact: "Expected +22% high-ticket corporate orders",
    },
    {
      id: 2,
      title: "Weekend Gourmet Truffle Brunch Promo",
      channel: "Instagram Geo-Targeted Ads",
      cost: "₹3.80 / reservation",
      target: "Food lovers 22-45 in downtown metro area",
      impact: "Expected +35% weekend table utilization",
    },
    {
      id: 3,
      title: "Swiggy/Zomato Geo-Targeting Optimization",
      channel: "In-App Platform Ads",
      cost: "₹1.50 / impression",
      target: "Users searching for 'Cafe' within 3 miles",
      impact: "Expected +15% delivery volume during off-peak hours",
    }
  ];

  const handleGenerate = (campaignId?: number) => {
    setIsGenerating(true);
    setGeneratedResult(null);

    setTimeout(() => {
      setIsGenerating(false);
      if (viewState === "healthcare" && (campaignId === 1 || (!campaignId && promptInput.toLowerCase().includes("cardio")))) {
        setGeneratedResult({
          title: "OPD Cardiology Patient Pipeline Campaign",
          audience: "Age: 45-70 | Interest: Cardiology, Hypertension, Wellness | Radius: 15 miles",
          adCopy: "Feeling skipped beats or due for an executive heart check? Schedule a consultative visit with Metro's leading board-certified cardiologists this week. Fast-track OPD booking available.",
          budget: "₹1,500/month suggested",
          expectedCTR: "4.8% (Top 10% in healthcare category)",
        });
      } else if (viewState === "general" && (campaignId === 1 || (!campaignId && promptInput.toLowerCase().includes("corporate")))) {
        setGeneratedResult({
          title: "Corporate Lunch Catering Expansion",
          audience: "Job Titles: Office Manager, HR Coordinator, Event Planner | Radius: 5 miles",
          adCopy: "Elevate your next team meeting. Premium boxed lunches and hot gourmet buffets delivered directly to your boardroom. Book a free tasting for your office today.",
          budget: "₹2,500/month suggested",
          expectedCTR: "2.1% (High B2B conversion rate)",
        });
      } else {
        setGeneratedResult({
          title: "Brunch Gourmet Engagement Campaign",
          audience: "Age: 22-45 | Interest: Brunch, Fine Dining, Truffles | Radius: 5 miles",
          adCopy: "Brunch reimagined. Savor our signature Truffle Wagyu burger paired with bottomless artisanal mimosas this Saturday. Spots are limited, reserve your table online now!",
          budget: "₹800/month suggested",
          expectedCTR: "6.2% (Excellent localized index)",
        });
      }
    }, 1500);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 glow-emerald">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl glow-emerald flex items-center justify-center text-zinc-950">
            <Sparkles size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">AI-Driven Marketing Strategy</h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Instantly draft target segments, budget models, and high-converting ad copies mapped directly from your live operational indices.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Idea Generator */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-6 glow-emerald">
            <h4 className="font-heading text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Target size={16} className="text-emerald-400" />
              Custom Operational Prompts
            </h4>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={viewState === "healthcare" ? "e.g. Generate high-yield Meta Ads audience for Orthopedic surgeries..." : "e.g. Create a holiday promotion campaign for our best-selling coffee..."}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500/50 outline-none text-sm font-sans text-white transition-colors"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl text-zinc-950 font-sans text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {isGenerating ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Send size={12} className="stroke-[2.5]" />
                )}
                Prompt AI
              </button>
            </div>

            <div className="mt-6">
              <h5 className="font-heading text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Smart Suggestions Mapped from Dashboard
              </h5>

              <div className="space-y-3">
                {campaignIdeas.map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => {
                      setSelectedCampaign(campaign.id);
                      handleGenerate(campaign.id);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      selectedCampaign === campaign.id
                        ? "bg-emerald-500/[0.03] border-emerald-500/30"
                        : "bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700/60 hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h6 className="font-heading text-sm font-bold text-zinc-100">
                          {campaign.title}
                        </h6>
                        <p className="font-sans text-xs text-zinc-400 mt-1">
                          Channel: <span className="text-zinc-300">{campaign.channel}</span> | Suggested cost: <span className="text-emerald-400 font-semibold">{campaign.cost}</span>
                        </p>
                        <p className="font-sans text-[11px] text-zinc-500 mt-1">
                          Audience: {campaign.target}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[10px] font-sans font-bold text-emerald-400 shrink-0">
                        <span>Deploy AI</span>
                        <ArrowRight size={10} className="stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Output Result Card */}
        <div className="glass-panel rounded-2xl p-6 glow-emerald flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-3 mb-4 flex items-center justify-between">
              <span>Automated Creative Outputs</span>
              <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <Megaphone size={12} />
              </span>
            </h4>

            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-3">
                <RefreshCw size={24} className="text-emerald-400 animate-spin" />
                <p className="font-sans text-xs text-zinc-400">Compiling demographical data and drafting copy variants...</p>
              </div>
            ) : generatedResult ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h5 className="font-heading text-xs font-bold text-zinc-400">CAMPAIGN</h5>
                  <p className="font-sans text-sm font-semibold text-white mt-1">{generatedResult.title}</p>
                </div>
                <div>
                  <h5 className="font-heading text-xs font-bold text-zinc-400">AUDIENCE GEOMETRY</h5>
                  <p className="font-sans text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 mt-1 leading-relaxed">
                    {generatedResult.audience}
                  </p>
                </div>
                <div>
                  <h5 className="font-heading text-xs font-bold text-zinc-400">DRAFT AD COPY</h5>
                  <p className="font-sans text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 mt-1 leading-relaxed">
                    "{generatedResult.adCopy}"
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs font-sans">
                  <div>
                    <span className="text-zinc-500">Suggested Budget:</span>
                    <span className="text-white font-bold block mt-0.5">{generatedResult.budget}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500">Expected Click-Thru:</span>
                    <span className="text-emerald-400 font-bold block mt-0.5">{generatedResult.expectedCTR}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-zinc-600 gap-2">
                <Sparkles size={32} className="stroke-[1.2]" />
                <p className="font-sans text-xs font-medium">Select a campaign suggestion or prompt the AI above to display creative outputs.</p>
              </div>
            )}
          </div>

          {generatedResult && !isGenerating && (
            <button
              onClick={() => {
                alert("Campaign integration synced successfully with your active Ad Account!");
              }}
              className="mt-6 w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={12} className="text-emerald-400 stroke-[2.5]" />
              Push directly to Ad Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
