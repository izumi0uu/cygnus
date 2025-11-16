"use client";

import React, { memo } from "react";
import { Handle, type HandleType, Position } from "@xyflow/react";

/*
 * Generic workflow node shell used across React Flow diagrams.
 */

type NodeStatus = "default" | "success" | "warning" | "danger";

export type WorkflowNodeHandle = {
  type: HandleType;
  position: Position;
  id?: string;
  className?: string;
  isConnectable?: boolean;
};

export type WorkflowNodeProps = {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  status?: NodeStatus;
  handles?: WorkflowNodeHandle[];
  className?: string;
};

const statusStyles: Record<NodeStatus, string> = {
  default: "bg-base-200 text-base-content/70",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
};

const statusLabel: Record<NodeStatus, string> = {
  default: "Ready",
  success: "Active",
  warning: "Attention",
  danger: "Error",
};

const WorkflowNode = ({
  title,
  subtitle,
  description,
  icon,
  footer,
  children,
  status = "default",
  handles,
  className = "",
}: WorkflowNodeProps) => {
  return (
    <div
      className={`pointer-events-auto w-64 rounded-2xl border border-base-300/70 bg-base-100 shadow-sm transition hover:shadow-lg ${className}`}
    >
      <div className="flex items-start gap-3 border-b border-base-200 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-200 bg-base-200/60 text-lg">
          {icon ?? "⚙️"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-base-content">{title}</p>
            <span className={`badge badge-sm border-0 ${statusStyles[status]}`}>{statusLabel[status]}</span>
          </div>
          {subtitle && <p className="text-xs text-base-content/70">{subtitle}</p>}
        </div>
      </div>

      <div className="space-y-3 px-4 py-3">
        {description && <p className="text-xs text-base-content/80">{description}</p>}
        {children}
      </div>

      {footer && <div className="border-t border-base-200 bg-base-200/40 px-4 py-2 text-xs">{footer}</div>}

      {handles?.map(handle => (
        <Handle
          key={`${handle.type}-${handle.id ?? handle.position}`}
          type={handle.type}
          id={handle.id}
          position={handle.position}
          className={handle.className}
          isConnectable={handle.isConnectable}
        />
      ))}
    </div>
  );
};

export default memo(WorkflowNode);
