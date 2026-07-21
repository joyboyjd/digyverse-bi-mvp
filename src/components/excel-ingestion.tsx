"use client";

import React, { useRef, useState } from "react";
import { 
  Upload, 
  FileSpreadsheet, 
  Trash2, 
  CheckCircle, 
  RefreshCw, 
  File, 
  AlertCircle,
  Database,
  ArrowRight,
  Sparkles,
  Clock
} from "lucide-react";
import { useIndustryContext } from "@/context/IndustryContext";
import { useData } from "@/context/DataContext";
import * as XLSX from 'xlsx';
import { normalizeSheetData, type SheetRow } from "@/lib/data-utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "ready" | "parsing" | "synced" | "error";
  rowsCount?: number;
  rawFile?: File;
}

interface ExcelIngestionProps {
  onSyncComplete?: (data: { importedRows: number; sourceFile: string }) => void;
}

export default function ExcelIngestion({ onSyncComplete }: ExcelIngestionProps) {
  const { viewState } = useIndustryContext();
  const data = useData() as any;
  const files: UploadedFile[] = data.activeFiles;
  const setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>> = data.setActiveFiles;
  const updateMetrics = data.updateMetrics;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [syncToast, setSyncToast] = useState<{ show: boolean; text: string } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".csv");
      
      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        progress: 0,
        status: isExcel ? "uploading" : "error",
        rawFile: file, // <-- THIS IS THE NEW LINE
      };

      setFiles((prev) => [newFile, ...prev]);

      if (!isExcel) return;

      // Simulate a premium upload progress animation
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id
              ? {
                  ...f,
                  progress: currentProgress,
                  status: currentProgress === 100 ? "ready" : "uploading",
                  rowsCount: currentProgress === 100 ? Math.floor(Math.random() * 800) + 150 : undefined,
                }
              : f
          )
        );
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 150);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleParseAndSync = async () => {
    const readyFiles = files.filter((f) => f.status === "ready");
    if (readyFiles.length === 0) return;

    setIsParsing(true);
    
    // Set files status to parsing
    setFiles((prev) =>
      prev.map((f) => (f.status === "ready" ? { ...f, status: "parsing" } : f))
    );

    try {
      let totalRows = 0;
      let primaryFileName = "";
      let parsedData: SheetRow[] = [];

      // We will process the first ready file in the queue
      const fileToProcess = readyFiles[0];
      
      if (fileToProcess.rawFile) {
        primaryFileName = fileToProcess.name;
        
        // 1. Read the physical file into browser memory
        const buffer = await fileToProcess.rawFile.arrayBuffer();
        
        // 2. Parse the Excel workbook
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        // 3. Grab the first sheet in the file
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 4. Convert the Excel sheet to raw JSON data.
        //    `defval: null` keeps blank cells as null instead of dropping the
        //    key, so downstream code never sees `undefined` for empty cells.
        const rawData = XLSX.utils.sheet_to_json<SheetRow>(worksheet, {
          defval: null,
        });

        // 5. Mapping phase: strictly coerce numeric columns to Number | null
        //    (Revenue, TAT, Stay Days, Wait Times) so charts receive clean
        //    numbers and blanks stay null rather than "nan".
        parsedData = normalizeSheetData(rawData);
        totalRows = parsedData.length;
      }

      // Update the file list to show it's successfully synced with the REAL row count
      setFiles((prev) => {
        return prev.map((f) => {
          if (f.id === fileToProcess.id) {
            return { ...f, status: "synced", rowsCount: totalRows };
          }
          return f;
        });
      });

      // Update the global vault with the real data
      updateMetrics({ 
        importedRows: totalRows, 
        sourceFile: primaryFileName,
        sheetData: parsedData // <--- The actual Excel data is now in the vault!
      });

      setIsParsing(false);
      
      if (onSyncComplete) {
        onSyncComplete({ importedRows: totalRows, sourceFile: primaryFileName });
      }

      // High-end Toast notification with real row count
      setSyncToast({
        show: true,
        text: `Successfully extracted ${totalRows} real rows from ${primaryFileName}!`,
      });

      setTimeout(() => {
        setSyncToast(null);
      }, 5000);

    } catch (error) {
      console.error("Failed to parse Excel file:", error);
      setIsParsing(false);
      setSyncToast({
        show: true,
        text: `Error parsing file. Please check the schema format.`,
      });
      setTimeout(() => setSyncToast(null), 5000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const hasReadyFiles = files.some((f) => f.status === "ready");

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="glass-panel p-4 rounded-xl border-emerald-500/30 bg-emerald-950/90 text-white flex gap-3 shadow-2xl glow-emerald">
            <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-heading text-xs font-bold text-emerald-300 uppercase tracking-wider">Sync Completed</p>
              <p className="font-sans text-xs text-zinc-300 mt-1">{syncToast.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Info Card */}
      <div className="glass-panel rounded-2xl p-6 glow-emerald">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-sans font-semibold text-emerald-400 uppercase tracking-wide">
              Data Pipeline Desk
            </span>
            <h3 className="font-heading text-lg font-bold text-white mt-2">
              Excel / CSV Schema Validation
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-1">
              Connect local Excel workflows to high-performance operational metrics. The ingestion desk validates sheets in real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-sans">
            <Database size={14} className="text-emerald-400" />
            <span>Active target: In-memory MVP index</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="md:col-span-2 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`glass-panel border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive
                ? "border-emerald-400 bg-emerald-500/[0.04] scale-[0.99] glow-emerald"
                : "border-zinc-800 hover:border-zinc-700/80 bg-zinc-900/10"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleChange}
              multiple
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors mb-4">
              <Upload size={22} className="text-emerald-400 animate-bounce" />
            </div>

            <h4 className="font-heading text-sm font-bold text-zinc-200">
              Drag & Drop your operation log here
            </h4>
            <p className="font-sans text-xs text-zinc-500 mt-1 max-w-sm">
              Supports <strong className="text-zinc-400">.xlsx</strong>, <strong className="text-zinc-400">.xls</strong>, or <strong className="text-zinc-400">.csv</strong> format. Standard templates will be auto-mapped.
            </p>
            <button
              type="button"
              className="mt-6 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-sans font-semibold text-zinc-300 transition-colors"
            >
              Browse Local Storage
            </button>
          </div>

          {/* Sync Trigger Action Bar */}
          {hasReadyFiles && (
            <div className="glass-panel p-4 rounded-2xl border-emerald-500/20 bg-zinc-950/40 flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h5 className="font-heading text-xs font-bold text-white">Files verified and ready!</h5>
                  <p className="font-sans text-[10px] text-zinc-400">Deploy compiled records to live widgets.</p>
                </div>
              </div>

              <button
                onClick={handleParseAndSync}
                disabled={isParsing}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-800 text-zinc-950 font-sans text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                {isParsing ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Parsing Records...
                  </>
                ) : (
                  <>
                    Compile & Sync
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Uploaded Files Manager */}
        <div className="glass-panel rounded-2xl p-6 glow-emerald flex flex-col h-[340px]">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-3 mb-4 flex items-center justify-between">
            <span>Operational Index Files</span>
            <span className="font-sans text-[10px] text-zinc-500 normal-case">
              {files.length} active
            </span>
          </h4>

          {files.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-600 gap-2">
              <FileSpreadsheet size={32} className="stroke-[1.2]" />
              <p className="font-sans text-xs font-medium">No spreadsheets active</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2.5 overflow-hidden">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 text-emerald-400">
                        <FileSpreadsheet size={15} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-heading text-xs font-bold text-zinc-200 truncate pr-4">
                          {file.id === "demo-1" && viewState === "general" 
                            ? "Q2_POS_Sales_Ledger.csv" 
                            : file.id === "demo-2" && viewState === "general"
                            ? "Table_Turnover_Log.xlsx"
                            : file.name}
                        </p>
                        <p className="font-sans text-[10px] text-zinc-500 mt-0.5">
                          {file.size} {file.rowsCount ? `• ${file.rowsCount} records` : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1 shrink-0 rounded hover:bg-zinc-800/30"
                      title="Remove file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Status Indicator / Progress Bar */}
                  <div className="mt-3">
                    {file.status === "uploading" && (
                      <div className="space-y-1">
                        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <p className="font-sans text-[9px] text-zinc-500 text-right">Uploading... {file.progress}%</p>
                      </div>
                    )}
                    {file.status === "ready" && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Clock size={9} />
                        Awaiting Ingest
                      </span>
                    )}
                    {file.status === "synced" && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle size={9} />
                        Index Active
                      </span>
                    )}
                    {file.status === "parsing" && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full animate-pulse">
                        <RefreshCw size={9} className="animate-spin" />
                        Compiling schema...
                      </span>
                    )}
                    {file.status === "error" && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                        <AlertCircle size={9} />
                        Invalid format
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
