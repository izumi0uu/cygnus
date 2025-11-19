import React, { memo } from "react";
import WorkflowNode from "./Node";
import { type NodeProps, Position } from "@xyflow/react";
import { Clock } from "lucide-react";
import { TIME_TRIGGER_DEFAULTS } from "~~/constants/node";

type TimeTriggerNodeProps = NodeProps;

const TimeTriggerNode = ({ data, selected, dragging }: TimeTriggerNodeProps) => {
  const stateClass = dragging ? "ring-2 ring-primary/60 shadow-xl scale-[1.02]" : selected ? "ring-2 ring-primary" : "";
  const nodeData = data as any;
  return (
    <WorkflowNode
      className={stateClass}
      title={nodeData.label || TIME_TRIGGER_DEFAULTS.title}
      subtitle={TIME_TRIGGER_DEFAULTS.subtitle}
      description={TIME_TRIGGER_DEFAULTS.description}
      icon={<Clock className="h-4 w-4" />}
      status={nodeData.status ?? "default"}
      handles={[
        {
          type: "source",
          position: Position.Right,
          className: "bg-primary",
        },
      ]}
      footer={
        <span className="font-semibold text-base-content/80">
          {nodeData.time ?? TIME_TRIGGER_DEFAULTS.time} {nodeData.schedule ?? TIME_TRIGGER_DEFAULTS.schedule}
        </span>
      }
    >
      <div className="text-xs text-base-content/70">{TIME_TRIGGER_DEFAULTS.placeholder}</div>
    </WorkflowNode>
  );
};

export default memo(TimeTriggerNode);
