import type { Node } from "@xyflow/react";
import TimeTriggerNode from "~~/app/workflows/_components/nodes/TimeTriggerNode";

// ============================================================================
// Types
// ============================================================================

export type NodeType = "trigger" | "action";

export type AssetType = "sol" | "avalanche" | "eth" | "btc";

export type ScheduleType = "daily" | "weekly" | "monthly";

// ============================================================================
// Interfaces
// ============================================================================

export interface NodeConfiguration {
  asset: AssetType;
  priceThreshold: string;
  // TimeTrigger specific config
  time?: string;
  schedule?: ScheduleType;
}

export interface NodeInfo {
  nodeId: string;
  name: string;
  type: NodeType;
}

// ============================================================================
// Node Type Mappings
// ============================================================================

export const NODE_TYPES = { time: TimeTriggerNode };

export const NODE_TYPE_MAP: Record<string, Node["type"]> = { time: "time" };

export const NODE_LABEL_MAP: Record<string, string> = {
  time: "Time Trigger",
  "webhook-trigger": "Webhook",
  http: "HTTP Request",
  db: "Database",
  notify: "Notification",
  message: "Message",
};

// ============================================================================
// Default Values
// ============================================================================

export const INITIAL_NODES: Node[] = [];

export const INITIAL_EDGES: any[] = [];

export const NODE_DEFAULT_POSITION = { x: 220, y: 180 };

export const DEFAULT_NODE_CONFIGURATION: NodeConfiguration = {
  asset: "eth",
  priceThreshold: "",
};

// ============================================================================
// TimeTrigger Node Defaults
// ============================================================================

export const TIME_TRIGGER_DEFAULTS = {
  title: "Time Trigger",
  subtitle: "Schedule kickoff",
  description: "Launches downstream actions on a cadence.",
  time: "10:00",
  schedule: "daily" as ScheduleType,
  placeholder: "Click to configure schedule",
};
