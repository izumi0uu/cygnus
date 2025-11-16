"use client";

import React from "react";
import { Check, Play, RotateCcw } from "lucide-react";

export type WorkflowControlsProps = {
  isCreate?: boolean;
  onTest?: () => void;
  onReset?: () => void;
  onSave?: () => void;
};

export const WorkflowControls = ({ isCreate, onTest, onReset, onSave }: WorkflowControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button className="btn" onClick={onTest} disabled={!isCreate}>
        <Play className="h-4 w-4" /> Test
      </button>
      <button className="btn" onClick={onReset}>
        <RotateCcw className="h-4 w-4" /> Reset
      </button>
      <button className="btn btn-primary" onClick={onSave} disabled={!isCreate}>
        <Check className="h-4 w-4" /> Save
      </button>
    </div>
  );
};
