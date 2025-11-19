"use client";

import React, { useCallback, useEffect } from "react";
import { WorkflowFlowContext } from "../_context/WorkflowFlowContext";
import { WorkflowControls } from "./ControlButtons";
import { EmptyTipsCard } from "./EmptyTipsCard";
import { SideBar } from "./SideBar";
import TimeTriggerNode from "./nodes/TimeTriggerNode";
import {
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import type { NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTopControls } from "~~/components/providers/TopControlsProvider";

export type WorkflowBuilderProps = {
  mode?: "view" | "create" | "edit";
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = { time: TimeTriggerNode };

const WorkflowFlow = ({ mode }: WorkflowBuilderProps) => {
  const isCreate = mode === "create";
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, fitView } = useReactFlow();

  useEffect(() => {
    if (nodes.length === 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.2, maxZoom: 1 });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onConnect = useCallback((connection: Connection) => setEdges(eds => addEdge(connection, eds)), [setEdges]);
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      try {
        const raw = e.dataTransfer.getData("application/reactflow");
        if (!raw) return;
        const payload = JSON.parse(raw) as { kind?: string };
        const kind = payload?.kind;
        if (!kind) return;
        const id = `${kind}-${Date.now()}`;
        // project screen coords to flow coords (handles zoom/pan automatically)
        const position = screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        });
        const base: Partial<Node> = {};
        const labelMap: Record<string, string> = {
          time: "Time Trigger",
          "webhook-trigger": "Webhook",
          http: "HTTP Request",
          db: "Database",
          notify: "Notification",
          message: "Message",
        };
        const typeMap: Record<string, Node["type"]> = { time: "time" };
        const nodeType = typeMap[kind];

        setNodes(ns => [
          ...ns,
          {
            id,
            position,
            ...(nodeType ? { type: nodeType } : {}),
            data: { label: labelMap[kind] ?? kind },
            ...(nodeType ? { dragHandle: ".rf-drag-handle" } : { draggable: true }),
            ...base,
          },
        ]);
      } catch {
        // ignore
      }
    },
    [setNodes, screenToFlowPosition],
  );

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

      const typeMap: Record<string, Node["type"]> = { time: "time" };
      const nodeType = typeMap[kind];

      setNodes(ns => [
        ...ns,
        {
          id,
          position: base,
          ...(nodeType ? { type: nodeType } : {}),
          data: { label: labelMap[kind] ?? kind },
          ...(nodeType ? { dragHandle: ".rf-drag-handle" } : { draggable: true }),
        },
      ]);
    },
    [isCreate, setNodes],
  );

  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const { setControls, clearControls } = useTopControls();

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

  return (
    <WorkflowFlowContext.Provider value={{ handleReset }}>
      <div className="flex h-full">
        <SideBar onAdd={handleAddNode} />
        <div className="flex-1">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={isCreate ? onConnect : undefined}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodesDraggable={isCreate}
          >
            <MiniMap />
            <Controls />
            <Background gap={16} size={1} />
            {nodes.length === 0 && edges.length === 0 && (
              <Panel className="w-full pointer-events-none">
                <EmptyTipsCard />
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>
    </WorkflowFlowContext.Provider>
  );
};

const WorkflowBuilder = ({ mode = "view" }: WorkflowBuilderProps) => {
  return (
    <div className="h-screen">
      <div className="w-full max-w-[120rem] mx-auto h-full">
        <div className="relative rounded-box border border-base-200 bg-base-100 overflow-hidden h-full">
          <ReactFlowProvider>
            <WorkflowFlow mode={mode} />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
