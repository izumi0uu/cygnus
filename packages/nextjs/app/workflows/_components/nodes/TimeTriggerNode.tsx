import React, { memo } from "react";
import WorkflowNode, { type WorkflowNodeProps } from "./Node";
import { Position } from "@xyflow/react";
import { Clock } from "lucide-react";

type TimeTriggerNodeProps = {
  data: {
    label: string;
    status?: WorkflowNodeProps["status"];
    time?: string;
  };
  preview?: boolean;
};

const TimeTriggerNode = ({ data, preview = false }: TimeTriggerNodeProps) => {
  return (
    <WorkflowNode
      title={data.label || "Time Trigger"}
      subtitle="Schedule kickoff"
      description="Launches downstream actions on a cadence."
      icon={<Clock className="h-4 w-4" />}
      status={data.status ?? "default"}
      handles={
        preview
          ? undefined
          : [
              {
                type: "source",
                position: Position.Right,
                className: "bg-primary",
              },
            ]
      }
      footer={<span className="font-semibold text-base-content/80">{data.time ?? "10:00 AM daily"}</span>}
    >
      <label className="text-xs font-medium text-base-content/70" htmlFor="time">
        Run at
      </label>
      <input
        id="time"
        type="time"
        defaultValue={data.time ?? "10:00"}
        className="input input-sm input-bordered w-full"
      />
    </WorkflowNode>
  );
};

export default memo(TimeTriggerNode);
