"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { useData } from "../../context/DataContext"; 
import { Sparkles, ArrowRight, CheckCircle2, Image as ImageIcon, RefreshCcw, Plus, Wand2, Lightbulb, Edit2, Save, LayoutGrid, Check, Download, Rocket } from "lucide-react";

interface AssetGroup {
  id: string;
  name: string;
  prompt: string;
  aspectRatio: "1:1" | "4:5" | "16:9";
  images: string[];
  selectedImages: number[]; // <-- Upgraded to an array for multi-select
  isGenerating: boolean;
}

export default function AIMarketingEngine() {
  const { parsedMetrics } = useData();
  const [campaignGoal, setCampaignGoal] = useState("");
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editRationale, setEditRationale] = useState("");

  // --- STEP 4 STATES ---
  const [isAnalyzingAssets, setIsAnalyzingAssets] = useState(false);
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);

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

    const topDept = Object.keys(deptCount).sort((a,b) => deptCount[b] - deptCount[a])[0] || "Cardiology";
    const conversionRate = opdCount ? ((opdConverted / opdCount) * 100) : 0;
    return { ipdCount, opdCount, topDept, conversionRate, successRate: "100%" };
  }, [data]);

  const suggestedGoals = useMemo(() => {
    const goals = [];
    if (stats.conversionRate > 0 && stats.conversionRate < 25) {
      goals.push(`Target our ${stats.opdCount} OPD walk-ins to improve our low ${stats.conversionRate.toFixed(1)}% IPD conversion rate in ${stats.topDept}.`);
    } else {
      goals.push(`Run an acquisition campaign to bring new OPD consults into the ${stats.topDept} department.`);
    }
    goals.push(`Promote our ${stats.successRate} complication-free surgery record to build absolute brand trust.`);
    return goals;
  }, [stats]);

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
      setStrategies([{ title: "Local Fallback Strategy", rationale: "Ensure your API route is returning dynamic data based on the goal." }]);
      setStep(2);
    }
    setIsGenerating(false);
  };

  const handleGenerateCopy = () => {
    if (selectedStrategy === null) return alert("Select a strategy first!");
    setIsGenerating(true);
    const selected = strategies[selectedStrategy];

    setTimeout(() => {
      setGeneratedCopy(
        `[CAMPAIGN OBJECTIVE]\n${campaignGoal}\n\n[STRATEGIC ANGLE]\n${selected.title}\n\n[PROBLEM]\nWhen seasonal health threats escalate, communities need fast, reliable answers. ${selected.rationale}\n\n[SOLUTION]\nAt our ${stats.topDept} center, we provide immediate care without agonizing wait times.\n\n👉 Walk in for your priority consultation today.`
      );
      setIsGenerating(false);
      setStep(3);
    }, 1500);
  };

  const handleRefineCopy = () => {
    setIsRefining(true);
    setTimeout(() => {
      setGeneratedCopy((prev) => prev + "\n\n✨ [AI Polished]: Adjusted tone for maximum professional empathy.");
      setIsRefining(false);
    }, 1500);
  };

  const saveEditing = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStrategies = [...strategies];
    newStrategies[idx] = { ...newStrategies[idx], title: editTitle, rationale: editRationale };
    setStrategies(newStrategies);
    setEditingIndex(null);
  };

  const handleProceedToVisuals = () => {
    setStep(4);
    setIsAnalyzingAssets(true);
    
    setTimeout(() => {
      setAssetGroups([
        {
          id: "asset-1",
          name: "Asset Group 1: Hero Character",
          prompt: "A hyper-realistic photography style portrait of a compassionate doctor in a white coat. Clean professional aesthetic.",
          aspectRatio: "1:1",
          images: [],
          selectedImages: [], // Starts empty
          isGenerating: false
        },
        {
          id: "asset-2",
          name: "Asset Group 2: Background Graphic",
          prompt: "Sleek, blurred hospital lobby background with cool blue and clean teal architectural accent highlights.",
          aspectRatio: "1:1",
          images: [],
          selectedImages: [], // Starts empty
          isGenerating: false
        }
      ]);
      setIsAnalyzingAssets(false);
    }, 2000);
  };

  const handleGenerateGroupImages = (groupId: string) => {
    setAssetGroups(prev => prev.map(group => group.id === groupId ? { ...group, isGenerating: true } : group));

    setTimeout(() => {
      setAssetGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            isGenerating: false,
            images: [
              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400",
              "https://images.unsplash.com/photo-1551076805-e18690c5e531?q=80&w=400",
              "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=400",
              "https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=400"
            ]
          };
        }
        return group;
      }));
    }, 2000);
  };

  // --- MULTI-SELECT TOGGLE LOGIC WITH A MAX LIMIT ---
  const handleSelectImage = (groupId: string, imageIndex: number) => {
    setAssetGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const isAlreadySelected = group.selectedImages.includes(imageIndex);
        
        if (isAlreadySelected) {
          // Deselect the image
          return { ...group, selectedImages: group.selectedImages.filter(idx => idx !== imageIndex) };
        } else {
          // Check the limit before adding
          if (group.selectedImages.length >= 2) {
            alert("You can select a maximum of 2 variations per asset group for A/B testing.");
            return group;
          }
          // Add the image to the selection array
          return { ...group, selectedImages: [...group.selectedImages, imageIndex] };
        }
      }
      return group;
    }));
  };

  const handlePromptChange = (groupId: string, newPrompt: string) => {
    setAssetGroups(prev => prev.map(group => group.id === groupId ? { ...group, prompt: newPrompt } : group));
  };

  const handleRatioChange = (groupId: string, ratio: "1:1" | "4:5" | "16:9") => {
    setAssetGroups(prev => prev.map(group => group.id === groupId ? { ...group, aspectRatio: ratio } : group));
  };

  // Unlocks if EVERY group has AT LEAST 1 image selected
  const isAllAssetsSelected = useMemo(() => {
    if (assetGroups.length === 0) return false;
    return assetGroups.every(group => group.selectedImages.length > 0);
  }, [assetGroups]);

  return (
    <div className="flex flex-1 min-h-screen bg-[#09090b] text-[#fafafa] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader onRefresh={() => {}} />
        <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          
          <div className="mb-8 border-b border-zinc-800 pb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-emerald-400" /> AI Marketing Engine
            </h2>
            <p className="text-zinc-400 mt-1">Data-driven campaign generation powered by Multi-LLM Prompt Chaining.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Steps 1 & 2 */}
            <div className="space-y-6">
              
              {/* STEP 1 */}
              <div className={`glass-panel p-6 rounded-2xl border ${step === 1 ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-950/50'}`}>
                <h3 className="text-lg font-bold text-white mb-4">Step 1: Campaign Directive</h3>
                {step === 1 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1"><Lightbulb size={12}/> AI Suggestions:</p>
                    <div className="flex flex-col gap-2">
                      {suggestedGoals.map((goal, idx) => (
                        <button key={idx} onClick={() => setCampaignGoal(goal)} className="text-left text-xs bg-zinc-900 border border-zinc-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-zinc-300 px-3 py-2 rounded-lg transition-all">{goal}</button>
                      ))}
                    </div>
                  </div>
                )}
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white min-h-[100px] focus:outline-none focus:border-emerald-500"
                  placeholder="Type your own goal..."
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  disabled={step > 1}
                />
                {step === 1 && (
                  <button onClick={() => handleGenerateStrategy("new")} className="mt-4 flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-3 rounded-xl transition-all">Generate Strategies <ArrowRight size={18} /></button>
                )}
              </div>

              {/* STEP 2 */}
              {step >= 2 && (
                <div className={`glass-panel p-6 rounded-2xl border ${step === 2 ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-950/50'} animate-in fade-in`}>
                  <h3 className="text-lg font-bold text-white mb-4">Step 2: Select Strategic Angle</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {strategies.map((strat, idx) => (
                      <div key={idx} onClick={() => { if (step === 2 && editingIndex !== idx) setSelectedStrategy(idx); }} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedStrategy === idx ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'}`}>
                        {editingIndex === idx ? (
                          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg p-2 text-white" />
                            <textarea value={editRationale} onChange={(e) => setEditRationale(e.target.value)} className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg p-2 text-zinc-300 h-20 resize-none" />
                            <div className="flex justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setEditingIndex(null); }} className="text-xs text-zinc-400">Cancel</button>
                              <button onClick={(e) => saveEditing(idx, e)} className="bg-emerald-500 text-zinc-950 text-xs px-2 py-1 rounded">Save</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-white">{strat.title}</h4>
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setEditingIndex(idx); setEditTitle(strat.title); setEditRationale(strat.rationale); }} className="text-zinc-500 hover:text-emerald-400"><Edit2 size={14} /></button>
                                {selectedStrategy === idx && <CheckCircle2 size={16} className="text-emerald-400" />}
                              </div>
                            </div>
                            <p className="text-xs text-zinc-400">{strat.rationale}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  {step === 2 && (
  <div className="mt-5 space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <button onClick={() => handleGenerateStrategy("new")} disabled={isGenerating} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all">
        <RefreshCcw size={16} /> Regenerate All
      </button>
      <button onClick={() => handleGenerateStrategy("append")} disabled={isGenerating} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all">
        <Plus size={16} /> Add More Options
      </button>
    </div>
    <button onClick={handleGenerateCopy} disabled={selectedStrategy === null} className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
      Write Campaign Copy <ArrowRight size={18} />
    </button>
  </div>
)}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Steps 3 & 4 */}
            <div className="space-y-6">
              
              {/* STEP 3 */}
              {step >= 3 && (
                <div className={`glass-panel p-6 rounded-2xl border ${step === 3 ? 'border-blue-500/50 bg-blue-950/10' : 'border-zinc-800 bg-zinc-950/50'} animate-in fade-in`}>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-white">Step 3: Refine Copy</h3>
                     {step === 3 && (
                       <button onClick={handleRefineCopy} disabled={isRefining} className="text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all">
                         <Wand2 size={14} /> {isRefining ? "Polishing..." : "AI Polish"}
                       </button>
                     )}
                  </div>
                  
                  <textarea 
                    className="w-full h-[180px] bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
                    value={generatedCopy}
                    onChange={(e) => setGeneratedCopy(e.target.value)}
                    disabled={step > 3}
                  />
                  
                  {step === 3 && (
                    <button onClick={handleProceedToVisuals} className="mt-4 flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all">
                      <ImageIcon size={18} /> Proceed to Visual Generation
                    </button>
                  )}
                </div>
              )}

              {/* STEP 4: STACKED ASSET GROUPS WITH RATIO SELECTORS & MULTI-SELECT */}
              {step >= 4 && (
                <div className="glass-panel p-6 rounded-2xl border border-purple-500/50 bg-purple-950/10 animate-in fade-in space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                    <h3 className="text-lg font-bold text-white">Step 4: Campaign Assets (Gemini)</h3>
                  </div>

                  {isAnalyzingAssets ? (
                    <div className="flex items-center justify-center py-8 text-purple-400">
                      <Wand2 size={20} className="animate-pulse mr-2" />
                      <span className="animate-pulse text-sm font-medium">Analyzing copy to isolate asset groups...</span>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                      {assetGroups.map((group) => (
                        <div key={group.id} className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-4">
                          
                          {/* Title and Ratio Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-2">
                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex justify-between w-full sm:w-auto">
                              {group.name} 
                              <span className="text-zinc-500 lowercase ml-2 font-normal">({group.selectedImages.length}/2 selected)</span>
                            </label>
                            
                            <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                              {(["1:1", "4:5", "16:9"] as const).map((ratio) => (
                                <button
                                  key={ratio}
                                  onClick={() => handleRatioChange(group.id, ratio)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${group.aspectRatio === ratio ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                  {ratio}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Prompt Block */}
                          <textarea 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300 text-xs focus:outline-none focus:border-purple-500 min-h-[50px] resize-none custom-scrollbar"
                            value={group.prompt}
                            onChange={(e) => handlePromptChange(group.id, e.target.value)}
                          />

                          {/* Image Grid Actions */}
                          {group.images.length === 0 ? (
                            <button 
                              onClick={() => handleGenerateGroupImages(group.id)} 
                              disabled={group.isGenerating} 
                              className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 rounded-lg transition-all"
                            >
                              {group.isGenerating ? "Rendering Variants..." : `Generate (${group.aspectRatio}) Variations`} <LayoutGrid size={14} />
                            </button>
                          ) : (
                            <div className="grid grid-cols-4 gap-2">
                              {group.images.map((imgUrl, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => handleSelectImage(group.id, idx)}
                                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${group.selectedImages.includes(idx) ? 'border-emerald-500 scale-[0.96]' : 'border-transparent hover:border-purple-500/40'}`}
                                >
                                  <img src={imgUrl} alt="Variant" className="w-full h-14 object-cover" />
                                  {group.selectedImages.includes(idx) && (
                                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                      <div className="bg-emerald-500 text-zinc-950 p-0.5 rounded-full shadow-lg">
                                        <Check size={10} className="stroke-[3]" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}

                  {/* STEP 4 FOOTER PIPELINE HANDOFF (LOCK ON CONDITIONS) */}
                  {step === 4 && assetGroups.length > 0 && (
                    <div className={`mt-4 pt-4 border-t border-purple-500/20 transition-all ${isAllAssetsSelected ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => alert("Packaging chosen assets into local download package...")}
                          className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-bold py-3 rounded-xl transition-all"
                        >
                          <Download size={14} /> Download All Assets
                        </button>
                        <button 
                          onClick={() => alert("Handoff to Step 5: Injecting context payload into ChatGPT assembly matrix...")}
                          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        >
                          <Rocket size={14} /> Assemble Final Post (Step 5)
                        </button>
                      </div>
                      {!isAllAssetsSelected && (
                        <p className="text-[10px] text-zinc-500 text-center mt-2 font-medium">Please select at least 1 variation from each asset group to unlock execution triggers.</p>
                      )}
                    </div>
                  )}

                </div>
              )}
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}