import React, { memo } from "react";
import WorkflowNode from "./Node";
import { type NodeProps, Position } from "@xyflow/react";
import { Clock } from "lucide-react";

type TimeTriggerNodeProps = NodeProps;

const TimeTriggerNode = ({ data, selected, dragging }: TimeTriggerNodeProps) => {
  const stateClass = dragging ? "ring-2 ring-primary/60 shadow-xl scale-[1.02]" : selected ? "ring-2 ring-primary" : "";
  return (
    <WorkflowNode
      className={stateClass}
      title={(data as any).label || "Time Trigger"}
      subtitle="Schedule kickoff"
      description="Launches downstream actions on a cadence."
      icon={<Clock className="h-4 w-4" />}
      status={(data as any).status ?? "default"}
      handles={[
        {
          type: "source",
          position: Position.Right,
          className: "bg-primary",
        },
      ]}
      footer={<span className="font-semibold text-base-content/80">{(data as any).time ?? "10:00 AM daily"}</span>}
    >
      <label className="text-xs font-medium text-base-content/70" htmlFor="time">
        Run at
      </label>
      <input
        id="time"
        type="time"
        defaultValue={(data as any).time ?? "10:00"}
        className="input input-sm input-bordered w-full"
      />
    </WorkflowNode>
  );
};

export default memo(TimeTriggerNode);
