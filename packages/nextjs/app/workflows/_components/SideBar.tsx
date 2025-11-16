"use client";

import React from "react";
import TimeTriggerNode from "./nodes/TimeTriggerNode";
import { Bell, Clock, Database, MessageSquareText, Webhook, Zap } from "lucide-react";

type NodePaletteItem = {
  kind: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
};

export type SideBarProps = {
  onAdd?: (kind: string) => void;
};

const triggerItems: NodePaletteItem[] = [
  { kind: "time", label: "Time Trigger", description: "Run at a specific time", icon: <Clock className="h-4 w-4" /> },
  {
    kind: "webhook-trigger",
    label: "Webhook",
    description: "Start on incoming request",
    icon: <Webhook className="h-4 w-4" />,
  },
];

const actionItems: NodePaletteItem[] = [
  { kind: "http", label: "HTTP Request", description: "Call external API", icon: <Zap className="h-4 w-4" /> },
  { kind: "db", label: "Database", description: "Query / insert data", icon: <Database className="h-4 w-4" /> },
  { kind: "notify", label: "Notification", description: "Send message/alert", icon: <Bell className="h-4 w-4" /> },
  {
    kind: "message",
    label: "Message",
    description: "Compose a message",
    icon: <MessageSquareText className="h-4 w-4" />,
  },
];

export const SideBar = ({ onAdd }: SideBarProps) => {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const filteredTriggers = triggerItems.filter(i => i.label.toLowerCase().includes(q) || i.kind.includes(q));
  const filteredActions = actionItems.filter(i => i.label.toLowerCase().includes(q) || i.kind.includes(q));

  return (
    <aside className="bg-base-200 border-r border-base-300 p-4 flex-shrink-0 space-y-3">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search nodes..."
        className="input input-sm input-bordered w-full"
      />

      <details open className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
        <summary className="collapse-title text-sm font-semibold flex items-center gap-2">
          Triggers
          <span className="badge badge-sm">{filteredTriggers.length}</span>
        </summary>
        <div className="collapse-content">
          <ul className="menu gap-1">
            {filteredTriggers.map(item => (
              <li key={item.kind}>
                <button className="btn btn-ghost btn-sm justify-start" onClick={() => onAdd?.(item.kind)}>
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
                {item.kind === "time" && (
                  <div className="px-2 pb-3">
                    <TimeTriggerNode preview data={{ label: "Time Trigger", status: "default", time: "10:00" }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
        <summary className="collapse-title text-sm font-semibold flex items-center gap-2">
          Actions
          <span className="badge badge-sm">{filteredActions.length}</span>
        </summary>
        <div className="collapse-content">
          <ul className="menu gap-1">
            {filteredActions.map(item => (
              <li key={item.kind}>
                <button className="btn btn-ghost btn-sm justify-start" onClick={() => onAdd?.(item.kind)}>
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
                {item.description && <p className="px-3 pb-2 text-xs text-base-content/70">{item.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </aside>
  );
};
