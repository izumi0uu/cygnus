"use client";

import React, { useCallback, useEffect } from "react";
import { WorkflowControls } from "./ControlButtons";
import { EmptyTipsCard } from "./EmptyTipsCard";
import { SideBar } from "./SideBar";
import {
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTopControls } from "~~/components/providers/TopControlsProvider";

export type WorkflowBuilderProps = {
  mode?: "view" | "create" | "edit";
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

export default function WorkflowBuilder({ mode = "view" }: WorkflowBuilderProps) {
  const isCreate = mode === "create";
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setControls, clearControls } = useTopControls();

  const onConnect = useCallback((connection: Connection) => setEdges(eds => addEdge(connection, eds)), [setEdges]);

  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const handleTest = useCallback(() => {
    // placeholder for future simulator integration
  }, []);

  const handleSave = useCallback(() => {
    // placeholder for future persistence integration
  }, []);

  useEffect(() => {
    setControls(<WorkflowControls isCreate={isCreate} onTest={handleTest} onReset={handleReset} onSave={handleSave} />);
    return () => {
      clearControls();
    };
  }, [setControls, clearControls, isCreate, handleTest, handleReset, handleSave]);

  const handleAddNode = useCallback(
    (kind: string) => {
      if (!isCreate) return;
      const id = `${kind}-${Date.now()}`;
      const base = { x: 220, y: 180 };
      const labelMap: Record<string, string> = {
        time: "Time Trigger",
        "webhook-trigger": "Webhook",
        http: "HTTP Request",
        db: "Database",
        notify: "Notification",
        message: "Message",
      };
      setNodes(ns => [
        ...ns,
        {
          id,
          position: base,
          data: { label: labelMap[kind] ?? kind },
        },
      ]);
    },
    [isCreate, setNodes],
  );

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[120rem] mx-auto">
        <div className="relative h-[70vh] min-h-[520px] rounded-box border border-base-200 bg-base-100 overflow-hidden">
          <div className="flex h-full">
            <SideBar onAdd={handleAddNode} />
            <div className="flex-1">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={isCreate ? onConnect : undefined}
                fitView
              >
                <MiniMap />
                <Controls />
                <Background gap={16} size={1} />
                {nodes.length === 0 && edges.length === 0 && (
                  <Panel position="top-left" className="w-full pointer-events-none">
                    <EmptyTipsCard />
                  </Panel>
                )}
              </ReactFlow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
