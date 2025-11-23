# Drawer Plugin System

这是一个可插拔的 Drawer 配置系统，允许你轻松地为不同的节点类型添加自定义配置组件。

## 架构概览

```
drawer/
├── plugin.types.ts          # 插件类型定义
├── plugins/
│   ├── index.ts            # 插件注册表
│   ├── AssetSelectPlugin.tsx
│   ├── PriceThresholdPlugin.tsx
│   ├── TimeInputPlugin.tsx
│   └── ScheduleSelectPlugin.tsx
├── components/             # 可复用的 UI 组件
│   ├── AssetSelect.tsx
│   ├── PriceThresholdInput.tsx
│   ├── TimeInput.tsx
│   └── ScheduleSelect.tsx
└── README.md
```

## 核心概念

### 1. DrawerConfigPlugin

每个插件定义了一个可复用的配置组件：

```typescript
interface DrawerConfigPlugin {
  key: string; // 唯一标识符
  label: string; // 显示标签
  enabled: (node, config) => boolean; // 是否启用
  render: (props) => ReactNode; // 渲染函数
  validate?: (value, config) => string | null; // 可选验证
  defaultValue?: any; // 默认值
  onSave?: (value, node, config) => Promise<void> | void; // 可选 API 调用
}
```

### 2. 插件注册表

插件通过 `DrawerPluginRegistry` (Map) 进行注册和管理。

## 使用示例

### 创建新插件

#### 步骤 1: 创建 UI 组件

```typescript
// drawer/components/MyCustomInput.tsx
export interface MyCustomInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MyCustomInput({ value, onChange, disabled }: MyCustomInputProps) {
  return (
    <div>
      <label className="label">
        <span className="label-text text-sm font-medium">Custom Field</span>
      </label>
      <input
        type="text"
        className="input input-bordered w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
```

#### 步骤 2: 创建插件定义

```typescript
// drawer/plugins/MyCustomPlugin.tsx
import { MyCustomInput } from "../components/MyCustomInput";
import type { DrawerConfigPlugin } from "../plugin.types";

export const myCustomPlugin: DrawerConfigPlugin = {
  key: "customField",
  label: "Custom Field",
  enabled: (node) => node.type === "action", // 仅对 action 节点启用
  render: ({ value, onChange, disabled }) => (
    <MyCustomInput value={value as string} onChange={onChange} disabled={disabled} />
  ),
  defaultValue: "",
  validate: (value: string) => {
    if (!value) return "This field is required";
    return null;
  },
};
```

#### 步骤 3: 注册插件

```typescript
// drawer/plugins/index.ts
import { myCustomPlugin } from "./MyCustomPlugin";
import { registerPlugin } from "./index";

// 在默认注册表中注册
registerPlugin(defaultPluginRegistry, myCustomPlugin);
```

### 使用自定义插件注册表

```typescript
// 在你的组件中
import { Drawer } from "./Drawer";
import { DrawerPluginRegistry } from "./drawer/plugin.types";
import { myCustomPlugin } from "./drawer/plugins/MyCustomPlugin";

const customRegistry = new Map(defaultPluginRegistry);
registerPlugin(customRegistry, myCustomPlugin);

<Drawer pluginRegistry={customRegistry} />
```

## API 集成

### 方式 1: 在插件中直接调用 API

```typescript
export const apiEnabledPlugin: DrawerConfigPlugin = {
  key: "apiField",
  label: "API Field",
  enabled: () => true,
  render: ({ value, onChange, disabled }) => (
    <ApiInput value={value} onChange={onChange} disabled={disabled} />
  ),
  onSave: async (value, node, config) => {
    // 调用 API
    await fetch("/api/nodes/update", {
      method: "POST",
      body: JSON.stringify({
        nodeId: node.nodeId,
        field: "apiField",
        value,
      }),
    });
  },
};
```

### 方式 2: 在 Drawer 的保存逻辑中统一处理

```typescript
// 在 WorkflowBuilder 中
useEffect(() => {
  const handleSaveConfiguration = async (nodeId: string, config: NodeConfiguration) => {
    // 更新本地状态
    setNodes(ns => /* ... */);

    // 调用 API
    await fetch("/api/workflows/save", {
      method: "POST",
      body: JSON.stringify({ nodeId, config }),
    });
  };

  setSaveCallback(handleSaveConfiguration);
}, []);
```

### 方式 3: 创建 API 插件包装器

```typescript
// drawer/plugins/api/ApiPluginWrapper.tsx
export function createApiPlugin(
  basePlugin: DrawerConfigPlugin,
  apiConfig: {
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    transformRequest?: (value: any, node: NodeInfo) => any;
    transformResponse?: (response: any) => any;
  },
): DrawerConfigPlugin {
  return {
    ...basePlugin,
    onSave: async (value, node, config) => {
      const requestData = apiConfig.transformRequest
        ? apiConfig.transformRequest(value, node)
        : { nodeId: node.nodeId, value };

      const response = await fetch(apiConfig.endpoint, {
        method: apiConfig.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (apiConfig.transformResponse) {
        return apiConfig.transformResponse(await response.json());
      }

      return response.json();
    },
  };
}

// 使用
const apiPlugin = createApiPlugin(myCustomPlugin, {
  endpoint: "/api/nodes/update",
  method: "POST",
});
```

## 最佳实践

1. **组件复用**: 将 UI 组件放在 `components/` 目录，插件定义放在 `plugins/` 目录
2. **条件启用**: 使用 `enabled` 函数根据节点类型或配置动态启用/禁用插件
3. **验证**: 使用 `validate` 函数提供客户端验证
4. **默认值**: 始终提供 `defaultValue` 以确保配置的一致性
5. **API 分离**: 将 API 调用逻辑与 UI 组件分离，便于测试和维护

## 内置插件

- **AssetSelectPlugin**: 资产选择器（所有节点）
- **PriceThresholdPlugin**: 价格阈值输入（所有节点）
- **TimeInputPlugin**: 时间输入（仅 trigger 节点）
- **ScheduleSelectPlugin**: 调度选择器（仅 trigger 节点）
