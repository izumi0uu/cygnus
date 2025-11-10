"use client";

import React from "react";
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
import "@xyflow/react/dist/style.css";

export type WorkflowBuilderProps = {
  mode?: "view" | "create" | "edit";
};

const initialNodes: Node[] = [
  { id: "start", position: { x: 150, y: 120 }, data: { label: "Start" }, type: "input" },
  { id: "task-1", position: { x: 420, y: 120 }, data: { label: "Task" } },
  { id: "end", position: { x: 700, y: 120 }, data: { label: "End" }, type: "output" },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "start", target: "task-1" },
  { id: "e2", source: "task-1", target: "end" },
];

export default function WorkflowBuilder({ mode = "view" }: WorkflowBuilderProps) {
  const isCreate = mode === "create";
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = React.useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges],
  );

  const handleReset = React.useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[120rem] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="badge badge-outline capitalize">{isCreate ? "create" : mode}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-primary" disabled={!isCreate}>
              Save
            </button>
          </div>
        </div>
        <div className="relative h-[70vh] min-h-[520px] rounded-box border border-base-200 bg-base-100 overflow-hidden">
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
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
