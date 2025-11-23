"use client";

import React, { useMemo, useState } from "react";
import { useNodeDrawerStore } from "../_store/nodeDrawerStore";
import type { DrawerPluginRegistry } from "./drawer/plugin.types";
import { defaultPluginRegistry, getEnabledPlugins } from "./drawer/plugins";
import { X } from "lucide-react";

export interface DrawerProps {
  /** Custom plugin registry. If not provided, uses default registry */
  pluginRegistry?: DrawerPluginRegistry;
}

export default function Drawer({ pluginRegistry = defaultPluginRegistry }: DrawerProps) {
  const { isOpen, currentNode, configuration, debugInfo, closeDrawer, updateConfiguration, saveConfiguration } =
    useNodeDrawerStore();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Get enabled plugins for current node
  const enabledPlugins = useMemo(() => {
    if (!currentNode) return [];
    return getEnabledPlugins(pluginRegistry, currentNode, configuration);
  }, [currentNode, configuration, pluginRegistry]);

  const handleSave = async () => {
    // Validate all plugins before saving
    if (currentNode) {
      const errors: Record<string, string> = {};
      enabledPlugins.forEach(plugin => {
        if (plugin.validate) {
          const pluginValue = (configuration as Record<string, any>)[plugin.key] ?? plugin.defaultValue;
          const error = plugin.validate(pluginValue, configuration);
          if (error) {
            errors[plugin.key] = error;
          }
        }
      });

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setValidationErrors({});

      // Call onSave for each enabled plugin that has it
      const savePromises = enabledPlugins
        .filter(plugin => plugin.onSave)
        .map(plugin => {
          const pluginValue = (configuration as Record<string, any>)[plugin.key] ?? plugin.defaultValue;
          return plugin.onSave!(pluginValue, currentNode, configuration);
        });

      try {
        await Promise.all(savePromises);
      } catch (error) {
        console.error("Error saving plugin configurations:", error);
        // Continue with normal save even if plugin saves fail
      }
    }

    // Save configuration to store (which will trigger the callback)
    saveConfiguration();
    closeDrawer();
  };

  if (!isOpen || !currentNode) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-base-content">{currentNode.name}</h2>
            <p className="text-sm text-base-content/70 capitalize">{currentNode.type}</p>
          </div>
          <button onClick={closeDrawer} className="btn btn-ghost btn-sm btn-circle">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Node Information - Always shown for all nodes */}
          <section>
            <h3 className="text-sm font-semibold text-base-content mb-3">Node Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Node ID:</span>
                <span className="text-sm font-mono text-base-content">{currentNode.nodeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Name:</span>
                <span className="text-sm text-base-content">{currentNode.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Type:</span>
                <span className="text-sm text-base-content capitalize">{currentNode.type}</span>
              </div>
            </div>
          </section>

          {/* Configuration - Dynamically rendered based on enabled plugins */}
          {enabledPlugins.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-base-content mb-3">Configuration</h3>
              <div className="space-y-4">
                {enabledPlugins.map(plugin => {
                  const pluginValue = (configuration as Record<string, any>)[plugin.key] ?? plugin.defaultValue;
                  const handlePluginChange = (value: any) => {
                    updateConfiguration({ [plugin.key]: value } as any);
                    // Clear validation error when user changes value
                    if (validationErrors[plugin.key]) {
                      setValidationErrors(prev => {
                        const next = { ...prev };
                        delete next[plugin.key];
                        return next;
                      });
                    }
                  };

                  return (
                    <div key={plugin.key}>
                      {plugin.render({
                        value: pluginValue,
                        config: configuration,
                        onChange: handlePluginChange,
                        node: currentNode,
                        disabled: false,
                        error: validationErrors[plugin.key],
                      })}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Debug Information - Always shown for all nodes */}
          <section>
            <h3 className="text-sm font-semibold text-base-content mb-3">Debug Information</h3>
            <div className="bg-base-200 rounded-lg p-4">
              {Object.keys(debugInfo).length === 0 ? (
                <p className="text-sm text-base-content/50 italic">No debug information available</p>
              ) : (
                <pre className="text-xs font-mono text-base-content/80 overflow-x-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-base-300 px-6 py-4">
          <button onClick={handleSave} className="btn btn-primary w-full">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
