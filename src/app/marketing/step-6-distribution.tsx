"use client";

import React, { useState } from "react";
// System icons stay with Lucide
import { Share2, Calendar, RefreshCw, CheckCircle, Image as ImageIcon } from "lucide-react";
// Brand icons come from React Icons
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Step6Distribution() {
  // Simulating the image passed from Step 5 or returned from Canva
  const [finalAsset, setFinalAsset] = useState(
    "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1080"
  );
  
  const [isSyncingCanva, setIsSyncingCanva] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Platform selections and captions
  const [activePlatform, setActivePlatform] = useState("linkedin");
  const [captions, setCaptions] = useState({
    linkedin: "Proud to announce our new community health initiative! Our top-performing general medicine department is committed to accessible healthcare. 🏥✨ #Healthcare #CommunityTrust #MedicalExcellence",
    instagram: "Accessible, world-class healthcare right in your community. 🩺💙 Swipe to learn more about our general medicine outreach! #HealthFirst #CommunityCare",
    facebook: "Your health is our priority. We are expanding our General Medicine department to ensure everyone gets the care they deserve. Book your appointment today!"
  });

  const [scheduleDate, setScheduleDate] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const handleCanvaEdit = () => {
    setIsSyncingCanva(true);
    // Simulate Canva API opening, editing, and returning a new image
    setTimeout(() => {
      // We simulate pulling a newly edited image back from Canva
      setFinalAsset("https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1080");
      setIsSyncingCanva(false);
      handleRegenerateCaptions(); // Auto-trigger caption regeneration based on new image
    }, 3000);
  };

  const handleRegenerateCaptions = () => {
    setIsRegenerating(true);
    // Simulate Gemini API analyzing the new Canva image and rewriting text
    setTimeout(() => {
      setCaptions({
        linkedin: "[UPDATED] Our dedicated medical team is ready to serve! Ensuring top-tier general medicine access for the whole community. 👨‍⚕️📈 #HealthcareInnovation",
        instagram: "[UPDATED] Meet the heroes in white coats! 🩺✨ Delivering excellence in general medicine. #MedicalHeroes",
        facebook: "[UPDATED] We believe in proactive health. Visit our updated general medicine wing today!"
      });
      setIsRegenerating(false);
    }, 2000);
  };

  const handleSchedule = () => {
    setIsScheduled(true);
    setTimeout(() => setIsScheduled(false), 2000); // Reset for demo purposes
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Share2 className="text-emerald-500" size={24} />
          Step 6: Distribution & Canva Polish
        </h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Refine your asset in Canva, generate platform-specific captions, and schedule your posts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Asset & Canva Integration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/50">
            <h3 className="text-sm font-semibold text-white mb-3">Final Asset</h3>
            
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-square mb-4">
              <img src={finalAsset} alt="Final Campaign Asset" className="w-full h-full object-cover" />
              {isSyncingCanva && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                  <span className="text-xs font-bold text-center px-4">Waiting for Canva<br/>Magic Layers...</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleCanvaEdit}
              disabled={isSyncingCanva}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              <ImageIcon size={16} /> Edit in Canva
            </button>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              Pushes asset to Canva. Re-syncs automatically on save to regenerate context.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Captions & Scheduling */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel p-1 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950/50">
            <div className="p-4">
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">AI Caption Generator</h3>
                <button 
                  onClick={handleRegenerateCaptions}
                  disabled={isRegenerating || isSyncingCanva}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isRegenerating ? "animate-spin" : ""} />
                  Regenerate from Asset
                </button>
              </div>

              {/* Platform Tabs */}
              <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-2">
                {[
                  { id: "linkedin", icon: FaLinkedin, label: "LinkedIn" },
                  { id: "instagram", icon: FaInstagram, label: "Instagram" },
                  { id: "facebook", icon: FaFacebook, label: "Facebook" }
                ].map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => setActivePlatform(platform.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      activePlatform === platform.id 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <platform.icon size={14} />
                    {platform.label}
                  </button>
                ))}
              </div>

              {/* Caption Editor */}
              <textarea
                value={captions[activePlatform as keyof typeof captions]}
                onChange={(e) => setCaptions({...captions, [activePlatform]: e.target.value})}
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
              />

              {/* Scheduling Footer */}
              <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Calendar size={16} className="text-zinc-400" />
                  <input 
                    type="datetime-local" 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-full"
                  />
                </div>
                
                <button 
                  onClick={handleSchedule}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white font-medium py-2 px-6 rounded-lg transition-all ${
                    isScheduled ? "bg-emerald-600" : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                  }`}
                >
                  {isScheduled ? (
                    <><CheckCircle size={16} /> Queued Successfully</>
                  ) : (
                    <><Share2 size={16} /> Schedule Post</>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}