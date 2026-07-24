"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Sparkles, Image as ImageIcon, Layout, Download } from "lucide-react";

export default function Step5FinalPost() {
  // 1. The Image Pool (Simulating images passed down from Step 4)
  const [imagePool, setImagePool] = useState<string[]>([
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1614729939124-03290b5609ce?q=80&w=300&auto=format&fit=crop"
  ]);
  
  // 2. The Master Prompt (Simulating the output from the Gemini Vision pass)
  const [masterPrompt, setMasterPrompt] = useState(
    "A highly detailed, professional social media poster for the healthcare campaign. Center a compassionate doctor in a clean clinical setting. The background should feature soft, trustworthy blues and clean white architectural accents to build community trust. 8k resolution, photorealistic, optimized for high patient engagement."
  );

  // 3. Configuration & Generation State
  const [postSize, setPostSize] = useState("1080x1080"); // Default to Instagram Square
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleRemoveImage = (indexToRemove: number) => {
    setImagePool(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you'd upload this to an S3 bucket or convert to base64
      const newImageUrl = URL.createObjectURL(files[0]);
      setImagePool(prev => [...prev, newImageUrl]);
    }
  };

  const handleGenerateFinalPost = () => {
    setIsGenerating(true);
    // Simulate API call to OpenAI DALL-E 3
    setTimeout(() => {
      // Mock generated image
      setFinalImage("https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1080");
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-purple-500" size={24} />
          Step 5: Final Render & Compositing
        </h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Review your selected assets, tweak the master prompt, and generate your final campaign post.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Asset Pool & Configurations */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Asset Pool */}
          <div className="glass-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/50">
            <h3 className="text-sm font-semibold text-white mb-3">Asset Pool (Step 4 & Custom)</h3>
            <div className="grid grid-cols-2 gap-3">
              {imagePool.map((img, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-800 aspect-square">
                  <img src={img} alt={`Asset ${idx}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 text-white p-1 rounded-md backdrop-blur-sm transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border-2 border-dashed border-zinc-700 hover:border-purple-500 hover:bg-purple-500/10 flex flex-col items-center justify-center cursor-pointer aspect-square transition-all"
              >
                <Upload className="text-zinc-500 mb-2" size={20} />
                <span className="text-xs text-zinc-400 text-center px-2">Add Custom</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="glass-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-950/50">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Layout size={16} className="text-zinc-400" />
              Format & Size
            </h3>
            <div className="space-y-2">
              {["1080x1080", "1080x1350", "1200x628"].map(size => (
                <button
                  key={size}
                  onClick={() => setPostSize(size)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm border transition-all ${
                    postSize === size 
                    ? "border-purple-500 bg-purple-500/10 text-white" 
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  {size === "1080x1080" && "Instagram Square (1:1)"}
                  {size === "1080x1350" && "Instagram Portrait (4:5)"}
                  {size === "1200x628" && "LinkedIn / Twitter (1.91:1)"}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: The Prompt & Output */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Master Prompt Editor */}
          <div className="glass-panel p-1 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950/50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-1">Master Rendering Prompt</h3>
              <p className="text-xs text-zinc-400 mb-3">
                Generated from your campaign context. Edit this text before rendering the final image.
              </p>
              <textarea
                value={masterPrompt}
                onChange={(e) => setMasterPrompt(e.target.value)}
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleGenerateFinalPost}
                  disabled={isGenerating || imagePool.length === 0}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Rendering...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Final Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Final Output Display */}
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center min-h-[400px]">
            {finalImage ? (
              <div className="w-full space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/30">
                  <img src={finalImage} alt="Final Generated Post" className="w-full h-auto object-contain" />
                </div>
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg transition-colors">
                    <Download size={16} />
                    Download Asset
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 opacity-50">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center mx-auto">
                  <ImageIcon className="text-zinc-500" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">No Render Yet</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[250px] mx-auto">
                    Your final generated graphic will appear here once DALL-E 3 finishes processing.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}