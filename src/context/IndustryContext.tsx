"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ViewState = "general" | "healthcare";

interface IndustryContextType {
  viewState: ViewState;
  setViewState: (state: ViewState) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export function IndustryProvider({ children }: { children: ReactNode }) {
  const [viewState, setViewState] = useState<ViewState>("healthcare");

  return (
    <IndustryContext.Provider value={{ viewState, setViewState }}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustryContext() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error("useIndustryContext must be used within an IndustryProvider");
  }
  return context;
}
