"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import { useData } from "@/context/DataContext";

// We need to import Recharts here now for the Custom Builder!
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import {
  Users, Bed, IndianRupee, Trophy, Settings, Activity, Building, Stethoscope, 
  LineChart, UserPlus, BarChart4, Play, UserMinus, Clock, RotateCw, CheckCircle, 
  Pill, Microscope, Target
} from "lucide-react";

export default function KPIDashboard() {
  const { parsedMetrics } = useData();
  const [activeTab, setActiveTab] = useState("opd");

  // Custom KPI Builder State
  const [queryMetric, setQueryMetric] = useState("Sum");
  const [queryTarget, setQueryTarget] = useState("Billing_Amount_INR");
  const [queryGroup, setQueryGroup] = useState("Acquisition_Channel");
  
  // NEW: State to hold the generated chart data
  const [customChartData, setCustomChartData] = useState<any[] | null>(null);

  const handleRefresh = () => {
    alert("Reloading KPI Data...");
  };

  // --- THE MATH ENGINE FOR CUSTOM BUILDER ---
  const handleGenerateCustomKPI = () => {
    if (!parsedMetrics?.sheetData || parsedMetrics.sheetData.length === 0) {
      alert("No data available! Please upload an Excel sheet in the Ingestion tab first.");
      return;
    }

    const data = parsedMetrics.sheetData;
    const groupMap: Record<string, { total: number, count: number, max: number }> = {};

    // 1. Parse and Group the Data
    data.forEach((row: any) => {
      const groupVal = row[queryGroup] || "Unknown";
      let targetVal = 0;

      // Handle strings (like counting patients) vs numbers (like summing revenue)
      if (queryMetric === "Count" || queryTarget === "Patient_ID" || queryTarget === "Consultation_Date") {
        targetVal = 1; 
      } else {
        targetVal = Number(row[queryTarget]) || 0;
      }

      if (!groupMap[groupVal]) {
        groupMap[groupVal] = { total: 0, count: 0, max: -Infinity };
      }

      groupMap[groupVal].total += targetVal;
      groupMap[groupVal].count += 1;
      if (targetVal > groupMap[groupVal].max) {
        groupMap[groupVal].max = targetVal;
      }
    });

    // 2. Apply the chosen Math operation
    const formattedData = Object.keys(groupMap).map(key => {
      let finalValue = 0;
      
      if (queryMetric === "Count") {
        finalValue = groupMap[key].count;
      } else if (queryMetric === "Sum") {
        finalValue = groupMap[key].total;
      } else if (queryMetric === "Average") {
        finalValue = groupMap[key].total / groupMap[key].count;
      } else if (queryMetric === "Max") {
        finalValue = groupMap[key].max === -Infinity ? 0 : groupMap[key].max;
      }

      return {
        name: key,
        value: Number(finalValue.toFixed(2)) // Keep decimals clean
      };
    });

    // 3. Sort highest to lowest and save to state
    formattedData.sort((a, b) => b.value - a.value);
    setCustomChartData(formattedData);
  };

  const tabs = [
    { id: "opd", label: "OPD & Funnel", icon: Users },
    { id: "ipd", label: "IPD Operations", icon: Bed },
    { id: "financial", label: "Financial Margins", icon: IndianRupee },
    { id: "staff", label: "Network & Staff", icon: Trophy },
    { id: "custom", label: "Custom Builder", icon: Settings },
  ];

  return (
    <div className="flex flex-1 min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <DashboardHeader onRefresh={handleRefresh} />

        <div className="flex-1 pb-12">
          <div className="p-6 sm:p-8 space-y-8">
            
            <div className="mb-2">
              <h2 className="text-2xl font-heading font-bold text-white tracking-tight">Performance KPIs</h2>
              <p className="text-sm text-zinc-400 mt-1">Granular operational metrics and bottleneck analysis.</p>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-zinc-800/80 pb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            {/* 1. OPD & FUNNEL TAB */}
            {activeTab === "opd" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Daily OPD Walk-ins"
                    value="164"
                    subtext="Average consultations per day"
                    trend={{ value: "+5.4%", isPositive: true }}
                    icon={Users}
                    themeColor="blue"
                    sparklineData={[140, 145, 150, 160, 164]}
                    tooltip="Total number of unique out-patient registrations recorded for the current operational day."
                  />
                  <MetricCard
                    title="OPD to IPD Conversion"
                    value="12.8%"
                    subtext="Consultations turning to admissions"
                    trend={{ value: "+1.2%", isPositive: true }}
                    icon={Activity}
                    themeColor="emerald"
                    sparklineData={[10.5, 11.2, 12.0, 12.5, 12.8]}
                    tooltip="Percentage of OPD patients who are subsequently admitted as IPD patients within a 48-hour window."
                  />
                  <MetricCard
                    title="Highest Footfall Dept"
                    value="Orthopedics"
                    subtext="34% of total daily volume"
                    trend={{ value: "Leading", isPositive: true }}
                    icon={Building}
                    themeColor="purple"
                    sparklineData={[30, 31, 32, 33, 34]}
                    tooltip="The specific clinical department recording the highest volume of out-patient visits."
                  />
                  <MetricCard
                    title="Queue Drop-off Rate"
                    value="2.4%"
                    subtext="Patients leaving before consult"
                    trend={{ value: "-0.5%", isPositive: true }}
                    icon={UserMinus}
                    themeColor="amber"
                    sparklineData={[3.5, 3.2, 3.0, 2.8, 2.4]}
                    tooltip="Percentage of registered patients who cancel or leave the premises before seeing the consultant."
                  />
                </div>
              </div>
            )}

            {/* 2. IPD OPERATIONS TAB */}
            {activeTab === "ipd" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Bed Occupancy Rate (BOR)"
                    value="82.4%"
                    subtext="Total available IPD beds filled"
                    trend={{ value: "+4.1%", isPositive: true }}
                    icon={Bed}
                    themeColor="emerald"
                    sparklineData={[75, 78, 80, 81, 82.4]}
                    tooltip="The real-time ratio of occupied patient beds against the total available beds across all active hospital wards."
                  />
                  <MetricCard
                    title="Average Length of Stay"
                    value="3.2 Days"
                    subtext="Time from admission to discharge"
                    trend={{ value: "-0.4", isPositive: true }}
                    icon={Clock}
                    themeColor="blue"
                    sparklineData={[4.0, 3.8, 3.6, 3.4, 3.2]}
                    tooltip="The average number of calendar days an IPD patient occupies a bed from admission to formal discharge."
                  />
                  <MetricCard
                    title="Discharge Turnaround"
                    value="2.5 Hrs"
                    subtext="Time to clean and flip a room"
                    trend={{ value: "+0.5", isPositive: false }}
                    icon={RotateCw}
                    themeColor="amber"
                    sparklineData={[1.5, 1.8, 2.0, 2.2, 2.5]}
                    tooltip="Average hours elapsed between a patient signing discharge papers and the room being sanitized for the next patient."
                  />
                  <MetricCard
                    title="Surgery Success Rate"
                    value="99.2%"
                    subtext="Zero complication procedures"
                    trend={{ value: "Stable", isPositive: true }}
                    icon={CheckCircle}
                    themeColor="emerald"
                    sparklineData={[99.0, 99.1, 99.2, 99.1, 99.2]}
                    tooltip="Percentage of major surgical procedures completed without any recorded post-operative complications within 30 days."
                  />
                </div>
              </div>
            )}

            {/* 3. FINANCIAL MARGINS TAB */}
            {activeTab === "financial" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Pharmacy Attachment"
                    value="68.5%"
                    subtext="OPD scripts filled in-house"
                    trend={{ value: "+12%", isPositive: true }}
                    icon={Pill}
                    themeColor="purple"
                    sparklineData={[50, 55, 60, 65, 68.5]}
                    tooltip="Percentage of out-patients who fulfill their medical prescriptions at the internal hospital pharmacy."
                  />
                  <MetricCard
                    title="Diagnostic Conversion"
                    value="74.2%"
                    subtext="Lab tests done in-house"
                    trend={{ value: "+8%", isPositive: true }}
                    icon={Microscope}
                    themeColor="blue"
                    sparklineData={[60, 65, 70, 72, 74.2]}
                    tooltip="Percentage of prescribed pathology or radiology tests actually conducted at the internal hospital laboratory."
                  />
                  <MetricCard
                    title="Top Revenue Dept"
                    value="Cardiology"
                    subtext="₹12.4M Generated MTD"
                    trend={{ value: "Leading", isPositive: true }}
                    icon={IndianRupee}
                    themeColor="emerald"
                    sparklineData={[10, 11, 11.5, 12, 12.4]}
                    tooltip="The specific clinical department generating the highest total gross billing for the current month."
                  />
                  <MetricCard
                    title="Cost of Acquisition (CAC)"
                    value="₹1,240"
                    subtext="Marketing spend per IPD patient"
                    trend={{ value: "-₹120", isPositive: true }}
                    icon={Target}
                    themeColor="amber"
                    sparklineData={[1500, 1450, 1380, 1300, 1240]}
                    tooltip="Total marketing and promotional expenditure divided by the number of successfully admitted IPD patients."
                  />
                </div>
              </div>
            )}

            {/* 4. STAFF & NETWORK TAB */}
            {activeTab === "staff" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Top Partner Network"
                    value="AarogyaOne"
                    subtext="Highest IPD referral volume"
                    trend={{ value: "+22%", isPositive: true }}
                    icon={Trophy}
                    themeColor="blue"
                    sparklineData={[10, 15, 20, 25, 30]}
                    tooltip="The external aggregator, B2B partner, or insurance network generating the highest volume of patient referrals."
                  />
                  <MetricCard
                    title="Active PROs"
                    value="14"
                    subtext="On-field patient coordinators"
                    trend={{ value: "+2", isPositive: true }}
                    icon={UserPlus}
                    themeColor="emerald"
                    sparklineData={[10, 12, 12, 13, 14]}
                    tooltip="Total number of Patient Relation Officers (PROs) actively logging referrals in the current billing cycle."
                  />
                  <MetricCard
                    title="Top Doctor (Volume)"
                    value="Dr. Sharma"
                    subtext="452 Consultations MTD"
                    trend={{ value: "Leading", isPositive: true }}
                    icon={Stethoscope}
                    themeColor="purple"
                    sparklineData={[300, 350, 400, 420, 452]}
                    tooltip="The attending physician who has successfully completed the highest number of patient consultations this month."
                  />
                  <MetricCard
                    title="Top Doctor (Revenue)"
                    value="Dr. Mehta"
                    subtext="₹4.2M Billed MTD"
                    trend={{ value: "Leading", isPositive: true }}
                    icon={IndianRupee}
                    themeColor="emerald"
                    sparklineData={[3.0, 3.5, 3.8, 4.0, 4.2]}
                    tooltip="The attending physician whose combined treatments and surgeries have generated the highest gross billing this month."
                  />
                </div>
              </div>
            )}

            {/* 5. CUSTOM KPI BUILDER */}
            {activeTab === "custom" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-panel p-8 rounded-2xl glow-emerald border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                        <Settings className="text-emerald-400" />
                        Custom Data Query Builder
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">Generate dynamic KPIs from your raw Excel ingestion on the fly.</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800/80 mb-8 flex flex-wrap items-center gap-3 text-lg font-medium">
                    <span className="text-zinc-400">Show me the</span>
                    
                    <select 
                      value={queryMetric}
                      onChange={(e) => setQueryMetric(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-emerald-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Sum">Sum</option>
                      <option value="Average">Average</option>
                      <option value="Count">Count</option>
                      <option value="Max">Maximum</option>
                    </select>

                    <span className="text-zinc-400">of</span>

                    <select 
                      value={queryTarget}
                      onChange={(e) => setQueryTarget(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-blue-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Billing_Amount_INR">Billing Revenue (₹)</option>
                      <option value="Patient_ID">Total Patients</option>
                      <option value="Consultation_Date">Visits</option>
                    </select>

                    <span className="text-zinc-400">grouped by</span>

                    <select 
                      value={queryGroup}
                      onChange={(e) => setQueryGroup(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-purple-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="Acquisition_Channel">Acquisition Channel</option>
                      <option value="Department">Clinical Department</option>
                      <option value="Treatment_Type">Treatment Type (IPD/OPD)</option>
                      <option value="Follow_Up_Required">Follow-Up Status</option>
                    </select>

                    <button 
                      onClick={handleGenerateCustomKPI}
                      className="ml-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <Play fill="currentColor" size={16} />
                      Generate Metric
                    </button>
                  </div>

                  {/* DYNAMIC RESULT AREA */}
                  {customChartData ? (
                    <div className="h-[300px] bg-zinc-950/30 p-6 border border-zinc-800/80 rounded-xl animate-in fade-in duration-500">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={customChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.15)" vertical={false} />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(val) => queryTarget === "Billing_Amount_INR" && queryMetric !== "Count" ? `₹${(val/1000).toFixed(0)}k` : val}
                          />
                          <Tooltip
  cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
  contentStyle={{
    backgroundColor: "#09090b",
    border: "1px solid rgba(63, 63, 70, 0.5)",
    borderRadius: "12px",
    fontSize: "12px",
    fontFamily: "var(--font-inter)",
  }}
  formatter={(value: any) => {
    if (queryTarget === "Billing_Amount_INR" && queryMetric !== "Count") {
      return [`₹${Number(value).toLocaleString("en-IN")}`, queryMetric];
    }
    return [value, queryMetric];
  }}
/>
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {customChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : "#a855f7"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[250px] border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/30">
                      <BarChart4 size={48} className="mb-4 opacity-50 text-zinc-600" />
                      <p className="font-sans text-sm">Select your parameters and click Generate to build a custom graph.</p>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}