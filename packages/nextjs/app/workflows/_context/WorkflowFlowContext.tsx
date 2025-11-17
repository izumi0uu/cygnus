"use client";

import React from "react";

export type WorkflowFlowContextType = {
  handleReset: () => void;
};

export const WorkflowFlowContext = React.createContext<WorkflowFlowContextType | null>(null);

export const useWorkflowFlow = () => {
  const context = React.useContext(WorkflowFlowContext);

  if (!context) throw new Error("useWorkflowFlow must be used within WorkflowFlow");

  return context;
};
