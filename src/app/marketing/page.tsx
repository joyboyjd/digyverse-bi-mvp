"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { useData } from "../../context/DataContext"; 
import { Sparkles, ArrowRight, CheckCircle2, Copy, Image as ImageIcon, RefreshCcw, Plus, Wand2, Lightbulb } from "lucide-react";

export default function AIMarketingEngine() {
  const { parsedMetrics } = useData();
  const [campaignGoal, setCampaignGoal] = useState("");
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  // --- ADVANCED KPI EXTRACTION (Defined only once!) ---
  const data = parsedMetrics?.sheetData || [];
  
  const stats = useMemo(() => {
    let ipdCount = 0, opdCount = 0, opdConverted = 0;
    const deptCount: Record<string, number> = {};

    data.forEach((row: any) => {
      const isIPD = row.Visit_Type === "IPD";
      if (isIPD) ipdCount++; else opdCount++;
      if (row.Converted_To_IPD === "Yes") opdConverted++;
      
      const dept = row.Department || "Cardiology";
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });

    // Find the most popular department dynamically
    const topDept = Object.keys(deptCount).sort((a,b) => deptCount[b] - deptCount[a])[0] || "Cardiology";
    
    // Calculate the actual conversion rate
    const conversionRate = opdCount ? ((opdConverted / opdCount) * 100) : 0;

    return { ipdCount, opdCount, topDept, conversionRate, successRate: "100%" };
  }, [data]);

  // --- DYNAMIC, LOGIC-DRIVEN SUGGESTIONS ---
  const suggestedGoals = useMemo(() => {
    const goals = [];
    
    if (stats.conversionRate > 0 && stats.conversionRate < 25) {
      goals.push(`Target our ${stats.opdCount} OPD walk-ins to improve our low ${stats.conversionRate.toFixed(1)}% IPD conversion rate in ${stats.topDept}.`);
    } else {
      goals.push(`Run an acquisition campaign to bring new OPD consults into the ${stats.topDept} department.`);
    }

    goals.push(`Promote our ${stats.successRate} complication-free surgery record to build absolute brand trust.`);

    if (stats.ipdCount > 30) {
      goals.push(`Capitalize on our high IPD volume by driving premium, insurance-backed (TPA) admissions.`);
    } else {
      goals.push(`Launch a local awareness drive to boost overall IPD admissions across all departments.`);
    }

    return goals;
  }, [stats]);

  // --- STEP 1: GENERATE STRATEGIES (API Call) ---
  const handleGenerateStrategy = async (mode: "new" | "append" = "new") => {
    if (!campaignGoal) return alert("Please enter a campaign goal!");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/marketing/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterContextJSON: { user_request: { goal: campaignGoal }, live_kpis: stats } })
      });
      const resData = await response.json();
      
      if (mode === "append") {
        setStrategies(prev => [...prev, ...resData.strategies]);
      } else {
        setStrategies(resData.strategies);
        setSelectedStrategy(null);
      }
      setStep(2);
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  // --- STEP 2: GENERATE COPY (Mocked Claude Call) ---
  const handleGenerateCopy = () => {
    if (selectedStrategy === null) return alert("Select a strategy first!");
    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedCopy(
        `[PROBLEM]\nLiving with chronic issues doesn't just limit your movement—it drains your energy and keeps you from the moments that matter most.\n\n[AGITATE]\nMany patients delay seeking help because they fear complicated procedures or long recovery times, settling for temporary fixes while the underlying issue worsens.\n\n[SOLUTION]\nIt doesn't have to be this way. At our ${stats.topDept} center of excellence, we maintain a ${stats.successRate} complication-free surgery record. Our advanced IPD facilities ensure you get back on your feet faster, with complete peace of mind.\n\n👉 Stop waiting. Book your priority consultation today and take the first step toward a pain-free life.`
      );
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  // --- STEP 3: HYBRID EDITOR REFINE ---
  const handleRefineCopy = () => {
    setIsRefining(true);
    setTimeout(() => {
      setGeneratedCopy((prev) => prev + "\n\n✨ [AI Polished]: Adjusted tone for maximum professional empathy.");
      setIsRefining(false);
    }, 1500);
  };

  return (
    <div className="flex flex-1 min-h-screen bg-[#09090b] text-[#fafafa] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader onRefresh={() => {}} />
        <div className="flex-1 p-6 sm:p-8">
          
          <div className="mb-8 border-b border-zinc-800 pb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-emerald-400" /> AI Marketing Engine
            </h2>
            <p className="text-zinc-400 mt-1">Data-driven campaign generation powered by Prompt Chaining.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              
              <div className={`glass-panel p-6 rounded-2xl border ${step === 1 ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-950/50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Step 1: Campaign Directive</h3>
                </div>
                
                {step === 1 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1"><Lightbulb size={12}/> AI Suggestions based on your KPIs:</p>
                    <div className="flex flex-col gap-2">
                      {suggestedGoals.map((goal, idx) => (
                        <button key={idx} onClick={() => setCampaignGoal(goal)} className="text-left text-xs bg-zinc-900 border border-zinc-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-zinc-300 px-3 py-2 rounded-lg transition-all">
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[100px]"
                  placeholder="Type your own goal or select a suggestion above..."
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  disabled={step > 1}
                />
                
                {step === 1 && (
                  <button onClick={() => handleGenerateStrategy("new")} disabled={isGenerating} className="mt-4 flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-3 rounded-xl transition-all">
                    {isGenerating ? "Analyzing KPIs via GPT..." : "Generate Strategies"} <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {step >= 2 && (
                <div className={`glass-panel p-6 rounded-2xl border ${step === 2 ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-950/50'} animate-in fade-in`}>
                  <h3 className="text-lg font-bold text-white mb-4">Step 2: Select Strategic Angle</h3>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {strategies.map((strat, idx) => (
                      <div key={idx} onClick={() => step === 2 && setSelectedStrategy(idx)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedStrategy === idx ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-white">{strat.title}</h4>
                          {selectedStrategy === idx && <CheckCircle2 size={18} className="text-emerald-400" />}
                        </div>
                        <p className="text-sm text-zinc-400">{strat.rationale}</p>
                      </div>
                    ))}
                  </div>

                  {step === 2 && (
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleGenerateStrategy("new")} disabled={isGenerating} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all">
                          <RefreshCcw size={16} /> Regenerate All
                        </button>
                        <button onClick={() => handleGenerateStrategy("append")} disabled={isGenerating} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all">
                          <Plus size={16} /> Add More Options
                        </button>
                      </div>
                      <button onClick={handleGenerateCopy} disabled={isGenerating || selectedStrategy === null} className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all">
                        {isGenerating ? "Drafting PAS Copy via Claude..." : "Write Campaign Copy"} <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {step >= 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-zinc-950/80">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-white">Step 3: Refine & Export</h3>
                     <div className="flex gap-2">
                        <button onClick={handleRefineCopy} disabled={isRefining} className="text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all">
                          <Wand2 size={14} /> {isRefining ? "Refining..." : "AI Polish"}
                        </button>
                        <button className="text-zinc-400 hover:text-white p-1.5 bg-zinc-900 rounded-lg"><Copy size={16} /></button>
                     </div>
                  </div>
                  
                  <textarea 
                    className="w-full h-[280px] bg-zinc-900 border border-zinc-700 rounded-xl p-5 text-zinc-300 text-sm leading-relaxed focus:outline-none focus:border-emerald-500 custom-scrollbar resize-none"
                    value={generatedCopy}
                    onChange={(e) => setGeneratedCopy(e.target.value)}
                  />
                  
                  <button className="mt-6 flex items-center justify-center gap-2 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <ImageIcon size={18} /> Proceed to Visuals (Gemini / Canva)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}