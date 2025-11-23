/**
 * Utility functions for creating API-enabled plugins
 * This provides a reusable pattern for integrating API calls with drawer plugins
 */
import React from "react";
import type { DrawerConfigPlugin, DrawerConfigPluginProps } from "../../plugin.types";
import type { NodeInfo } from "~~/constants/node";

export interface ApiPluginConfig {
  /** API endpoint URL */
  endpoint: string;
  /** HTTP method */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** Transform request data before sending */
  transformRequest?: (value: any, node: NodeInfo, fullConfig: Record<string, any>) => any;
  /** Transform response data after receiving */
  transformResponse?: (response: any) => any;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Error handler */
  onError?: (error: Error, value: any, node: NodeInfo) => void;
}

/**
 * Creates an API-enabled plugin wrapper
 * This wraps a base plugin and adds API integration capabilities
 */
export function createApiPlugin(basePlugin: DrawerConfigPlugin, apiConfig: ApiPluginConfig): DrawerConfigPlugin {
  return {
    ...basePlugin,
    onSave: async (value, node, config) => {
      try {
        const requestData = apiConfig.transformRequest
          ? apiConfig.transformRequest(value, node, config as Record<string, any>)
          : {
              nodeId: node.nodeId,
              field: basePlugin.key,
              value,
            };

        const response = await fetch(apiConfig.endpoint, {
          method: apiConfig.method || "POST",
          headers: {
            "Content-Type": "application/json",
            ...apiConfig.headers,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (apiConfig.transformResponse) {
          return apiConfig.transformResponse(responseData);
        }

        return responseData;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (apiConfig.onError) {
          apiConfig.onError(err, value, node);
        } else {
          console.error(`Error saving ${basePlugin.key} for node ${node.nodeId}:`, err);
        }
        throw err;
      }
    },
  };
}

/**
 * Async Data Loader Component
 * A wrapper component that handles async data loading for plugins
 */
function AsyncDataLoader({
  basePlugin,
  loadData,
  props,
}: {
  basePlugin: DrawerConfigPlugin;
  loadData: (node: NodeInfo) => Promise<any>;
  props: DrawerConfigPluginProps;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { value, node, onChange } = props;

  React.useEffect(() => {
    if (!value && basePlugin.defaultValue === undefined) {
      setIsLoading(true);
      loadData(node)
        .then(data => {
          onChange(data);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
          console.error(`Error loading data for ${basePlugin.key}:`, err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [node.nodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-sm font-medium">{basePlugin.label}</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="loading loading-spinner loading-sm" />
          <span className="text-sm text-base-content/70">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-sm font-medium">{basePlugin.label}</span>
        </label>
        <div className="alert alert-error">
          <span className="text-sm">Error: {error}</span>
        </div>
      </div>
    );
  }

  return <>{basePlugin.render(props)}</>;
}

/**
 * Creates a plugin with async data loading
 * Useful for plugins that need to fetch initial data from an API
 */
export function createAsyncDataPlugin(
  basePlugin: DrawerConfigPlugin,
  loadData: (node: NodeInfo) => Promise<any>,
): DrawerConfigPlugin {
  return {
    ...basePlugin,
    render: (props: DrawerConfigPluginProps) => (
      <AsyncDataLoader basePlugin={basePlugin} loadData={loadData} props={props} />
    ),
  };
}
