"use client";

import React from "react";
import { type AssetType, useNodeDrawerStore } from "../_store/nodeDrawerStore";
import { X } from "lucide-react";
import { type ScheduleType } from "~~/constants/node";

export default function Drawer() {
  const { isOpen, currentNode, configuration, debugInfo, closeDrawer, updateConfiguration, saveConfiguration } =
    useNodeDrawerStore();

  const handleSave = () => {
    saveConfiguration();
    closeDrawer();
  };

  if (!isOpen || !currentNode) return null;

  const handleAssetChange = (asset: AssetType) => {
    updateConfiguration({ asset });
  };

  const handlePriceThresholdChange = (value: string) => {
    updateConfiguration({ priceThreshold: value });
  };

  const handleTimeChange = (time: string) => {
    updateConfiguration({ time });
  };

  const handleScheduleChange = (schedule: ScheduleType) => {
    updateConfiguration({ schedule });
  };

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
          {/* Node Information */}
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

          {/* Configuration */}
          <section>
            <h3 className="text-sm font-semibold text-base-content mb-3">Configuration</h3>
            <div className="space-y-4">
              {/* Asset Select */}
              <div>
                <label className="label">
                  <span className="label-text text-sm font-medium">Asset</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={configuration.asset}
                  onChange={e => handleAssetChange(e.target.value as AssetType)}
                >
                  <option value="eth">ETH</option>
                  <option value="btc">BTC</option>
                  <option value="sol">SOL</option>
                  <option value="avalanche">Avalanche</option>
                </select>
              </div>

              {/* Price Threshold */}
              <div>
                <label className="label">
                  <span className="label-text text-sm font-medium">Price Threshold</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Enter price threshold"
                  value={configuration.priceThreshold}
                  onChange={e => handlePriceThresholdChange(e.target.value)}
                />
              </div>

              {/* TimeTrigger Specific Configuration */}
              {currentNode.type === "trigger" && (
                <>
                  <div>
                    <label className="label">
                      <span className="label-text text-sm font-medium">Time</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered w-full"
                      value={configuration.time || "10:00"}
                      onChange={e => handleTimeChange(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text text-sm font-medium">Schedule</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={configuration.schedule || "daily"}
                      onChange={e => handleScheduleChange(e.target.value as ScheduleType)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Debug Information */}
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
