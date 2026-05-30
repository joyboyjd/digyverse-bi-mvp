"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import ReferralTracker from "@/components/referral-tracker";

export default function AffiliatesPage() {
  const handleRefresh = () => {
    // mock refresh
  };

  return (
    <div className="flex flex-1 min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden font-sans">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main dashboard content panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <DashboardHeader onRefresh={handleRefresh} />

        <div className="flex-1 pb-12">
          <div className="p-6 sm:p-8 space-y-6">

            
            <div className="animate-in fade-in duration-500">
              <ReferralTracker />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
