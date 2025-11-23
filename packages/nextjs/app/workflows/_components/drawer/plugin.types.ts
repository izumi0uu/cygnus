import type { ReactNode } from "react";
import type { NodeConfiguration, NodeInfo } from "~~/constants/node";

/**
 * Configuration plugin for drawer components
 * Each plugin defines a reusable configuration component that can be enabled/disabled
 */
export interface DrawerConfigPlugin {
  /** Unique identifier for the plugin */
  key: string;
  /** Display label for the plugin section */
  label: string;
  /** Whether this plugin is enabled for the current node */
  enabled: (node: NodeInfo, config: NodeConfiguration) => boolean;
  /** Render function for the plugin component */
  render: (props: DrawerConfigPluginProps) => ReactNode;
  /** Optional validation function */
  validate?: (value: any, config: NodeConfiguration) => string | null;
  /** Optional default value */
  defaultValue?: any;
  /** Optional API integration function */
  onSave?: (value: any, node: NodeInfo, config: NodeConfiguration) => Promise<void> | void;
}

export interface DrawerConfigPluginProps {
  /** Current configuration value for this plugin */
  value: any;
  /** Current full configuration */
  config: NodeConfiguration;
  /** Update function for this plugin's value */
  onChange: (value: any) => void;
  /** Current node info */
  node: NodeInfo;
  /** Whether the form is disabled */
  disabled?: boolean;
  /** Validation error message */
  error?: string;
}

/**
 * Plugin registry type
 */
export type DrawerPluginRegistry = Map<string, DrawerConfigPlugin>;
