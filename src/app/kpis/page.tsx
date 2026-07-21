"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import { useData } from "@/context/DataContext";
import { toNumber, type SheetRow, type CustomKpiDatum, type RechartsFormatterValue } from "@/lib/data-utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Users, Bed, IndianRupee, Trophy, Settings, Activity, Building, Stethoscope, 
  LineChart, UserPlus, BarChart4, Play, UserMinus, Clock, RotateCw, CheckCircle, 
  Pill, Microscope, Target, Wallet, CreditCard
} from "lucide-react";

export default function KPIDashboard() {
  const { parsedMetrics } = useData();
  const [activeTab, setActiveTab] = useState("opd");

  // Custom KPI Builder State
  const [queryMetric, setQueryMetric] = useState("Sum");
  const [queryTarget, setQueryTarget] = useState("Billing_Amount_INR");
  const [queryGroup, setQueryGroup] = useState("Acquisition_Channel");
  const [customChartData, setCustomChartData] = useState<CustomKpiDatum[] | null>(null);

  const handleRefresh = () => alert("Reloading KPI Data...");

  const data: SheetRow[] = parsedMetrics?.sheetData || [];

  // --- DYNAMIC DATA AGGREGATION ENGINE ---
  const stats = useMemo(() => {
    let opdCount = 0;
    let ipdCount = 0;
    let totalWaitTime = 0;
    let opdConvertedToIpd = 0;
    
    let totalLos = 0;
    let totalDischargeTat = 0;
    let surgerySuccessCount = 0;
    let procedureCount = 0;

    let pharmacyRevenue = 0;
    let labRevenue = 0;
    let totalRevenue = 0;
    let cashRevenue = 0;
    let creditRevenue = 0;
    
    let pharmacyFilled = 0;
    let labOrdered = 0;
    
    const deptCount: Record<string, number> = {};
    const docRevenue: Record<string, number> = {};
    const docConsults: Record<string, number> = {};
    const channelCount: Record<string, number> = {};
    const uniquePROs = new Set();

    data.forEach((row: SheetRow) => {
      const isIPD = row.Visit_Type === "IPD";
      const dept = (row.Department as string) || "Unknown";
      const doc = (row.Doctor_ID as string) || "Unknown";
      const channel = (row.Acquisition_Channel as string) || "Unknown";
      const pro = row.PRO_ID;

      const pRev = toNumber(row.Pharmacy_Revenue);
      const lRev = toNumber(row.Lab_Revenue);
      const procRev = toNumber(row.Procedure_Revenue);
      const consultRev = toNumber(row.Revenue_Consultation);
      const rowTotal = pRev + lRev + procRev + consultRev;

      // Classify Revenue
      totalRevenue += rowTotal;
      if (row.Payment_Type === "Cash") cashRevenue += rowTotal;
      else creditRevenue += rowTotal;

      pharmacyRevenue += pRev;
      labRevenue += lRev;

      // Leakage Tracking
      if (row.Pharmacy_Prescription_Filled === "Yes" || pRev > 0) pharmacyFilled++;
      if (row.Diagnostic_Ordered === "Yes" || lRev > 0) labOrdered++;

      // Department & Doctor Tracking
      deptCount[dept] = (deptCount[dept] || 0) + 1;
      docRevenue[doc] = (docRevenue[doc] || 0) + rowTotal;
      docConsults[doc] = (docConsults[doc] || 0) + 1;
      channelCount[channel] = (channelCount[channel] || 0) + 1;
      if (pro) uniquePROs.add(pro);

      if (isIPD) {
        ipdCount++;
        totalLos += toNumber(row.Length_Of_Stay_Days);
        totalDischargeTat += toNumber(row.Discharge_TAT_Mins);
        procedureCount++;
        if (row.Surgery_Success !== "No") surgerySuccessCount++;
      } else {
        opdCount++;
        totalWaitTime += toNumber(row.OPD_Wait_Time_Mins);
        if (row.Converted_To_IPD === "Yes") opdConvertedToIpd++;
      }
    });

    // Formatting outputs
    const topDept = Object.keys(deptCount).sort((a, b) => deptCount[b] - deptCount[a])[0] || "N/A";
    const topDocRev = Object.keys(docRevenue).sort((a, b) => docRevenue[b] - docRevenue[a])[0] || "N/A";
    const topDocVol = Object.keys(docConsults).sort((a, b) => docConsults[b] - docConsults[a])[0] || "N/A";
    const topChannel = Object.keys(channelCount).sort((a, b) => channelCount[b] - channelCount[a])[0] || "N/A";

    return {
      opdWalkIns: opdCount,
      avgWaitTime: opdCount ? Math.round(totalWaitTime / opdCount) : 0,
      opdConversion: opdCount ? ((opdConvertedToIpd / opdCount) * 100).toFixed(1) : 0,
      topDept,
      
      alos: ipdCount ? (totalLos / ipdCount).toFixed(1) : 0,
      avgDischargeTat: ipdCount ? Math.round(totalDischargeTat / ipdCount) : 0,
      surgerySuccess: procedureCount ? ((surgerySuccessCount / procedureCount) * 100).toFixed(1) : 0,
      bor: ipdCount ? ((ipdCount / 150) * 100).toFixed(1) : 0,
      
      pharmacyAttachment: data.length ? ((pharmacyFilled / data.length) * 100).toFixed(1) : 0,
      labAttachment: data.length ? ((labOrdered / data.length) * 100).toFixed(1) : 0,
      cashVsCredit: { cash: cashRevenue, credit: creditRevenue },
      
      topDocRev: { name: topDocRev, val: docRevenue[topDocRev] || 0 },
      topDocVol: { name: topDocVol, val: docConsults[topDocVol] || 0 },
      topChannel,
      proCount: uniquePROs.size
    };
  }, [data]);

  // --- THE MATH ENGINE FOR CUSTOM BUILDER ---
  const handleGenerateCustomKPI = () => {
    if (!data.length) {
      alert("No data available! Please upload an Excel sheet first.");
      return;
    }
    const groupMap: Record<string, { total: number, count: number, max: number }> = {};
    data.forEach((row: SheetRow) => {
      const groupVal = (row[queryGroup] as string) || "Unknown";
      const targetVal = (queryMetric === "Count" || queryTarget === "Patient_ID") ? 1 : toNumber(row[queryTarget]);
      if (!groupMap[groupVal]) groupMap[groupVal] = { total: 0, count: 0, max: -Infinity };
      groupMap[groupVal].total += targetVal;
      groupMap[groupVal].count += 1;
      if (targetVal > groupMap[groupVal].max) groupMap[groupVal].max = targetVal;
    });

    const formattedData: CustomKpiDatum[] = Object.keys(groupMap).map(key => {
      const finalValue = queryMetric === "Count" ? groupMap[key].count
                     : queryMetric === "Sum" ? groupMap[key].total
                     : queryMetric === "Average" ? groupMap[key].total / groupMap[key].count
                     : groupMap[key].max === -Infinity ? 0 : groupMap[key].max;
      return { name: key, value: Number(finalValue.toFixed(2)) };
    }).sort((a, b) => b.value - a.value);
    
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
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
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
                    title="Total OPD Walk-ins"
                    value={data.length ? stats.opdWalkIns : "--"}
                    subtext="Consultations processed"
                    icon={Users}
                    themeColor="blue"
                    tooltip="Total out-patient registrations recorded in the uploaded dataset."
                  />
                  <MetricCard
                    title="Average Wait Time"
                    value={data.length ? `${stats.avgWaitTime} Mins` : "--"}
                    subtext="Arrival to doctor consultation"
                    icon={Clock}
                    themeColor="amber"
                    tooltip="Average minutes patients wait before being seen by the physician."
                  />
                  <MetricCard
                    title="OPD to IPD Conversion"
                    value={data.length ? `${stats.opdConversion}%` : "--"}
                    subtext="Walk-ins turning to admissions"
                    icon={Activity}
                    themeColor="emerald"
                    tooltip="Percentage of OPD patients directly routed to inpatient admissions."
                  />
                  <MetricCard
                    title="Highest Footfall Dept"
                    value={data.length ? stats.topDept : "--"}
                    subtext="Leading clinical department"
                    icon={Building}
                    themeColor="purple"
                    tooltip="Department registering the maximum patient volume."
                  />
                </div>
              </div>
            )}

            {/* 2. IPD OPERATIONS TAB */}
            {activeTab === "ipd" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Average Length of Stay"
                    value={data.length ? `${stats.alos} Days` : "--"}
                    subtext="Time from admission to discharge"
                    icon={Bed}
                    themeColor="blue"
                    tooltip="The average number of days an IPD patient occupies a bed."
                  />
                  <MetricCard
                    title="Discharge Turnaround"
                    value={data.length ? `${stats.avgDischargeTat} Mins` : "--"}
                    subtext="Order written to room cleared"
                    icon={RotateCw}
                    themeColor="amber"
                    tooltip="Average operational delay in flipping a room for the next patient."
                  />
                  <MetricCard
                    title="Surgery Success Rate"
                    value={data.length ? `${stats.surgerySuccess}%` : "--"}
                    subtext="Complication-free procedures"
                    icon={CheckCircle}
                    themeColor="emerald"
                    tooltip="Percentage of recorded procedures executed successfully."
                  />
                  <MetricCard
                    title="Est. Bed Occupancy (BOR)"
                    value={data.length ? `${stats.bor}%` : "--"}
                    subtext="Based on 150 bed capacity"
                    icon={Building}
                    themeColor="purple"
                    tooltip="Real-time occupancy percentage calculated against total available hospital beds."
                  />
                </div>
              </div>
            )}

            {/* 3. FINANCIAL MARGINS TAB */}
            {activeTab === "financial" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Cash Transactions"
                    value={data.length ? `₹${(stats.cashVsCredit.cash / 1000).toFixed(1)}k` : "--"}
                    subtext="Direct out-of-pocket payments"
                    icon={Wallet}
                    themeColor="emerald"
                    tooltip="Total gross billing classified strictly under immediate Cash Payment Type."
                  />
                  <MetricCard
                    title="Udhari / TPA Credit"
                    value={data.length ? `₹${(stats.cashVsCredit.credit / 1000).toFixed(1)}k` : "--"}
                    subtext="Pending insurance & credit"
                    icon={CreditCard}
                    themeColor="amber"
                    tooltip="Total billing stuck in working capital loops (Insurance TPA or direct credit line)."
                  />
                  <MetricCard
                    title="Pharmacy Attachment"
                    value={data.length ? `${stats.pharmacyAttachment}%` : "--"}
                    subtext="Internal prescription fills"
                    icon={Pill}
                    themeColor="purple"
                    tooltip="Percentage of patients converting into pharmacy revenue. Reverses leakage."
                  />
                  <MetricCard
                    title="Diagnostic Conversion"
                    value={data.length ? `${stats.labAttachment}%` : "--"}
                    subtext="In-house lab tests"
                    icon={Microscope}
                    themeColor="blue"
                    tooltip="Percentage of patients utilizing internal pathology or radiology."
                  />
                </div>
              </div>
            )}

            {/* 4. STAFF & NETWORK TAB */}
            {activeTab === "staff" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <MetricCard
                    title="Top Doctor (Revenue)"
                    value={data.length ? stats.topDocRev.name : "--"}
                    subtext={data.length ? `₹${(stats.topDocRev.val / 1000).toFixed(1)}k Generated` : "Highest grossing physician"}
                    icon={IndianRupee}
                    themeColor="emerald"
                    tooltip="The attending physician holding the highest cumulative billing."
                  />
                  <MetricCard
                    title="Top Doctor (Volume)"
                    value={data.length ? stats.topDocVol.name : "--"}
                    subtext={data.length ? `${stats.topDocVol.val} Consults Processed` : "Highest footfall physician"}
                    icon={Stethoscope}
                    themeColor="purple"
                    tooltip="Physician handling the largest bulk of patient consultations."
                  />
                  <MetricCard
                    title="Top Acquisition Channel"
                    value={data.length ? stats.topChannel : "--"}
                    subtext="Dominant marketing source"
                    icon={Target}
                    themeColor="blue"
                    tooltip="The leading pipeline responsible for maximum patient walk-ins."
                  />
                  <MetricCard
                    title="Active PRO Network"
                    value={data.length ? stats.proCount : "--"}
                    subtext="On-field referral coordinators"
                    icon={UserPlus}
                    themeColor="amber"
                    tooltip="Total unique Patient Relation Officers logging active cases."
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
                    
                    <select value={queryMetric} onChange={(e) => setQueryMetric(e.target.value)} className="bg-zinc-900 border border-zinc-700 text-emerald-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer">
                      <option value="Sum">Sum</option>
                      <option value="Average">Average</option>
                      <option value="Count">Count</option>
                      <option value="Max">Maximum</option>
                    </select>
                    <span className="text-zinc-400">of</span>
                    <select value={queryTarget} onChange={(e) => setQueryTarget(e.target.value)} className="bg-zinc-900 border border-zinc-700 text-blue-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer">
                      <option value="Procedure_Revenue">Procedure Revenue (₹)</option>
                      <option value="Pharmacy_Revenue">Pharmacy Revenue (₹)</option>
                      <option value="Patient_ID">Total Patients</option>
                      <option value="Length_Of_Stay_Days">Length of Stay (Days)</option>
                    </select>
                    <span className="text-zinc-400">grouped by</span>
                    <select value={queryGroup} onChange={(e) => setQueryGroup(e.target.value)} className="bg-zinc-900 border border-zinc-700 text-purple-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer">
                      <option value="Acquisition_Channel">Acquisition Channel</option>
                      <option value="Department">Clinical Department</option>
                      <option value="Doctor_ID">Attending Doctor</option>
                      <option value="Payment_Type">Payment Mode (Cash/TPA)</option>
                    </select>

                    <button onClick={handleGenerateCustomKPI} className="ml-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Play fill="currentColor" size={16} />
                      Generate Metric
                    </button>
                  </div>

                  {customChartData ? (
                    <div className="h-[300px] bg-zinc-950/30 p-6 border border-zinc-800/80 rounded-xl animate-in fade-in duration-500">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={customChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.15)" vertical={false} />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val: number | string) => queryMetric !== "Count" ? `₹${(Number(val)/1000).toFixed(0)}k` : String(val)} />
                          <Tooltip cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(63, 63, 70, 0.5)", borderRadius: "12px", fontSize: "12px", fontFamily: "var(--font-inter)" }} formatter={(value: RechartsFormatterValue) => { if (queryMetric !== "Count") { return [`₹${Number(value).toLocaleString("en-IN")}`, queryMetric]; } return [value, queryMetric]; }} />
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