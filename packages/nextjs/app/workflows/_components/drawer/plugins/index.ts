/**
 * Central registry for all drawer configuration plugins
 * This allows for easy registration and discovery of plugins
 */
import type { DrawerConfigPlugin, DrawerPluginRegistry } from "../plugin.types";
import { assetSelectPlugin } from "./AssetSelectPlugin";
import { priceThresholdPlugin } from "./PriceThresholdPlugin";
import { scheduleSelectPlugin } from "./ScheduleSelectPlugin";
import { timeInputPlugin } from "./TimeInputPlugin";

/**
 * Default plugin registry with all built-in plugins
 */
export const defaultPluginRegistry: DrawerPluginRegistry = new Map([
  [assetSelectPlugin.key, assetSelectPlugin],
  [priceThresholdPlugin.key, priceThresholdPlugin],
  [timeInputPlugin.key, timeInputPlugin],
  [scheduleSelectPlugin.key, scheduleSelectPlugin],
]);

/**
 * Register a new plugin
 */
export function registerPlugin(registry: DrawerPluginRegistry, plugin: DrawerConfigPlugin): void {
  registry.set(plugin.key, plugin);
}

/**
 * Get a plugin by key
 */
export function getPlugin(registry: DrawerPluginRegistry, key: string): DrawerConfigPlugin | undefined {
  return registry.get(key);
}

/**
 * Get all enabled plugins for a node
 */
export function getEnabledPlugins(
  registry: DrawerPluginRegistry,
  node: { nodeId: string; name: string; type: "trigger" | "action" },
  config: Record<string, any>,
): DrawerConfigPlugin[] {
  const plugins: DrawerConfigPlugin[] = [];
  for (const plugin of registry.values()) {
    if (plugin.enabled(node, config as any)) {
      plugins.push(plugin);
    }
  }
  return plugins;
}
