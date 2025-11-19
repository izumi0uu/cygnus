"use client";

import React, { useCallback, useEffect } from "react";
import { WorkflowFlowContext } from "../_context/WorkflowFlowContext";
import { type NodeConfiguration, useNodeDrawerStore } from "../_store/nodeDrawerStore";
import { WorkflowControls } from "./ControlButtons";
import Drawer from "./Drawer";
import { EmptyTipsCard } from "./EmptyTipsCard";
import { SideBar } from "./SideBar";
import {
  Background,
  type Connection,
  Controls,
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
import "@xyflow/react/dist/style.css";
import { useTopControls } from "~~/components/providers/TopControlsProvider";
import {
  type AssetType,
  DEFAULT_NODE_CONFIGURATION,
  INITIAL_EDGES,
  INITIAL_NODES,
  NODE_DEFAULT_POSITION,
  NODE_LABEL_MAP,
  NODE_TYPES,
  NODE_TYPE_MAP,
  type ScheduleType,
} from "~~/constants/node";

export type WorkflowBuilderProps = {
  mode?: "view" | "create" | "edit";
};

const WorkflowFlow = ({ mode }: WorkflowBuilderProps) => {
  const isCreate = mode === "create";
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const { openDrawer, closeDrawer, setSaveCallback } = useNodeDrawerStore();

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
        const nodeType = NODE_TYPE_MAP[kind];

        setNodes(ns => [
          ...ns,
          {
            id,
            position,
            ...(nodeType ? { type: nodeType } : {}),
            data: { label: NODE_LABEL_MAP[kind] ?? kind },
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
      const nodeType = NODE_TYPE_MAP[kind];

      setNodes(ns => [
        ...ns,
        {
          id,
          position: NODE_DEFAULT_POSITION,
          ...(nodeType ? { type: nodeType } : {}),
          data: { label: NODE_LABEL_MAP[kind] ?? kind },
          ...(nodeType ? { dragHandle: ".rf-drag-handle" } : { draggable: true }),
        },
      ]);
    },
    [isCreate, setNodes],
  );

  const handleReset = useCallback(() => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
  }, [setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Determine node type based on node.type or data
      const nodeType: "trigger" | "action" = node.type === "time" ? "trigger" : "action";

      // Extract configuration from node data
      const nodeData = node.data as any;
      const config = {
        asset: (nodeData.asset as AssetType) || DEFAULT_NODE_CONFIGURATION.asset,
        priceThreshold: nodeData.priceThreshold || DEFAULT_NODE_CONFIGURATION.priceThreshold,
        time: nodeData.time,
        schedule: nodeData.schedule as ScheduleType | undefined,
      };

      // Extract debug info
      const debugInfo = {
        nodeId: node.id,
        position: node.position,
        type: node.type,
        selected: node.selected,
        ...(nodeData.debugInfo || {}),
      };

      openDrawer(
        {
          nodeId: node.id,
          name: nodeData.label || node.id,
          type: nodeType,
        },
        config,
        debugInfo,
      );
    },
    [openDrawer],
  );

  const onPaneClick = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

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

  // Register save callback to update node data when configuration is saved
  useEffect(() => {
    const handleSaveConfiguration = (nodeId: string, config: NodeConfiguration) => {
      setNodes(ns =>
        ns.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...config,
                asset: config.asset,
                priceThreshold: config.priceThreshold,
                time: config.time,
                schedule: config.schedule,
              },
            };
          }
          return node;
        }),
      );
    };

    setSaveCallback(handleSaveConfiguration);
    return () => {
      setSaveCallback(null);
    };
  }, [setNodes, setSaveCallback]);

  return (
    <WorkflowFlowContext.Provider value={{ handleReset }}>
      <div className="flex h-full">
        <SideBar onAdd={handleAddNode} />
        <div className="flex-1">
          <ReactFlow
            nodeTypes={NODE_TYPES}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={isCreate ? onConnect : undefined}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
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
        <Drawer />
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
