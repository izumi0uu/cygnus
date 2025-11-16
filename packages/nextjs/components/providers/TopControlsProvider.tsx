"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type TopControlsContextValue = {
  controls: React.ReactNode | null;
  setControls: (node: React.ReactNode | null) => void;
  clearControls: () => void;
};

const TopControlsContext = createContext<TopControlsContextValue | undefined>(undefined);

export const TopControlsProvider = ({ children }: { children: React.ReactNode }) => {
  const [controls, setControlsState] = useState<React.ReactNode | null>(null);
  const setControls = useCallback((node: React.ReactNode | null) => setControlsState(node), []);
  const clearControls = useCallback(() => setControlsState(null), []);

  const value = useMemo(() => ({ controls, setControls, clearControls }), [controls, setControls, clearControls]);

  return <TopControlsContext.Provider value={value}>{children}</TopControlsContext.Provider>;
};

export const useTopControls = () => {
  const ctx = useContext(TopControlsContext);
  if (!ctx) {
    throw new Error("useTopControls must be used within TopControlsProvider");
  }
  return ctx;
};
