import { AssetSelect } from "../components/AssetSelect";
import type { DrawerConfigPlugin } from "../plugin.types";
import type { AssetType } from "~~/constants/node";

export const assetSelectPlugin: DrawerConfigPlugin = {
  key: "asset",
  label: "Asset",
  enabled: () => true, // Always enabled for all nodes
  render: ({ value, onChange, disabled }) => (
    <AssetSelect value={value as AssetType} onChange={onChange} disabled={disabled} />
  ),
  defaultValue: "eth",
};
