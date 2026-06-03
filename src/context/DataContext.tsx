"use client";
import React, { createContext, useContext, useState } from 'react';

type DataContextType = {
  parsedMetrics: any;
  setParsedMetrics: React.Dispatch<React.SetStateAction<any>>;
  updateMetrics: (data: any) => void;
  activeFiles: any[];
  setActiveFiles: React.Dispatch<React.SetStateAction<any[]>>;
};

const DataContext = createContext<DataContextType>({
  parsedMetrics: null,
  setParsedMetrics: () => {},
  updateMetrics: () => {},
  activeFiles: [],
  setActiveFiles: () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [parsedMetrics, setParsedMetrics] = useState<any>(null);
  
  // Initialized with the exact demo files from your UI!
  const [activeFiles, setActiveFiles] = useState<any[]>([
    {
      id: "demo-1",
      name: "Q2_Healthcare_Referrals_Active.xlsx",
      size: "2.4 MB",
      progress: 100,
      status: "ready",
      rowsCount: 482,
    },
    {
      id: "demo-2",
      name: "OPD_Footfall_Index_May.csv",
      size: "820 KB",
      progress: 100,
      status: "synced",
      rowsCount: 1250,
    }
  ]);

  const updateMetrics = (data: any) => {
    setParsedMetrics((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <DataContext.Provider value={{ 
      parsedMetrics, setParsedMetrics, updateMetrics, 
      activeFiles, setActiveFiles 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);