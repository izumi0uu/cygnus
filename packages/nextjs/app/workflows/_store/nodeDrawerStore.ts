import { create } from "zustand";
import {
  type AssetType,
  DEFAULT_NODE_CONFIGURATION,
  type NodeConfiguration,
  type NodeInfo,
  type NodeType,
} from "~~/constants/node";

export type { AssetType, NodeConfiguration, NodeInfo, NodeType };

export type SaveConfigurationCallback = (nodeId: string, config: NodeConfiguration) => void;

export interface NodeDrawerState {
  isOpen: boolean;
  currentNode: NodeInfo | null;
  configuration: NodeConfiguration;
  debugInfo: Record<string, any>;
  saveCallback: SaveConfigurationCallback | null;
  // Actions
  openDrawer: (node: NodeInfo, config?: Partial<NodeConfiguration>, debugInfo?: Record<string, any>) => void;
  closeDrawer: () => void;
  updateConfiguration: (config: Partial<NodeConfiguration>) => void;
  updateDebugInfo: (info: Record<string, any>) => void;
  setSaveCallback: (callback: SaveConfigurationCallback | null) => void;
  saveConfiguration: () => void;
}

export const useNodeDrawerStore = create<NodeDrawerState>((set, get) => ({
  isOpen: false,
  currentNode: null,
  configuration: DEFAULT_NODE_CONFIGURATION,
  debugInfo: {},
  saveCallback: null,

  openDrawer: (node, config, debugInfo) =>
    set({
      isOpen: true,
      currentNode: node,
      configuration: { ...DEFAULT_NODE_CONFIGURATION, ...config },
      debugInfo: debugInfo || {},
    }),

  closeDrawer: () =>
    set({
      isOpen: false,
      currentNode: null,
      configuration: DEFAULT_NODE_CONFIGURATION,
      debugInfo: {},
    }),

  updateConfiguration: config =>
    set(state => ({
      configuration: { ...state.configuration, ...config },
    })),

  updateDebugInfo: info =>
    set(state => ({
      debugInfo: { ...state.debugInfo, ...info },
    })),

  setSaveCallback: callback =>
    set({
      saveCallback: callback,
    }),

  saveConfiguration: () => {
    const state = get();
    if (state.currentNode && state.saveCallback) {
      state.saveCallback(state.currentNode.nodeId, state.configuration);
    }
  },
}));
