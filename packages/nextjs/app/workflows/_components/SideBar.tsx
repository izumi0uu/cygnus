"use client";

import React from "react";
import { Bell, Clock, Crosshair, Database, MessageSquareText, Webhook, Zap } from "lucide-react";

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
    <aside className="bg-base-200 border-r border-base-300 p-4 flex-shrink-0 space-y-3 w-[280px]">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search nodes..."
        className="input input-sm input-bordered w-full"
      />

      <details open className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
        <summary className="collapse-title text-base font-semibold flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Triggers
            <span className="badge badge-sm">{filteredTriggers.length}</span>
          </div>
        </summary>
        <div className="collapse-content">
          <ul className="menu gap-2 w-full">
            {filteredTriggers.map(item => (
              <li key={item.kind}>
                <button
                  className="w-full text-left rounded-lg border border-base-300 bg-base-100 hover:bg-base-200 transition p-3 flex items-start gap-3"
                  onClick={() => onAdd?.(item.kind)}
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    {item.description && <div className="text-xs text-base-content/70 mt-0.5">{item.description}</div>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
        <summary className="collapse-title text-base font-semibold flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Crosshair className="h-4 w-4" /> Actions
            <span className="badge badge-sm">{filteredActions.length}</span>
          </div>
        </summary>
        <div className="collapse-content">
          <ul className="menu gap-2 w-full">
            {filteredActions.map(item => (
              <li key={item.kind}>
                <button
                  className="w-full text-left rounded-lg border border-base-300 bg-base-100 hover:bg-base-200 transition p-3 flex items-start gap-3"
                  onClick={() => onAdd?.(item.kind)}
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    {item.description && <div className="text-xs text-base-content/70 mt-0.5">{item.description}</div>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </aside>
  );
};
