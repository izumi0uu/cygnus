"use client";

import React from "react";
import { Lightbulb, MousePointer2, Rocket } from "lucide-react";

export const EmptyTipsCard = () => {
  return (
    <div className="flex justify-center mt-12">
      <div className="pointer-events-none max-w-xl w-[90%] bg-base-100 border border-base-200 shadow-xl rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Rocket className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold">Start building</h3>
        <p className="mt-1 text-sm text-base-content/70">
          Choose a trigger from the left panel to kick off your workflow.
        </p>
        <ul className="mt-5 text-left space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <MousePointer2 className="mt-0.5 h-4 w-4 text-base-content/60" />
            <span>Drag nodes into the canvas and connect them to define execution order.</span>
          </li>
          <li className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 h-4 w-4 text-base-content/60" />
            <span>Use the top-right controls to test and save when you are ready.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
