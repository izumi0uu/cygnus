import { PriceThresholdInput } from "../components/PriceThresholdInput";
import type { DrawerConfigPlugin } from "../plugin.types";

export const priceThresholdPlugin: DrawerConfigPlugin = {
  key: "priceThreshold",
  label: "Price Threshold",
  enabled: () => true, // Always enabled for all nodes
  render: ({ value, onChange, disabled, error }) => (
    <PriceThresholdInput value={value as string} onChange={onChange} disabled={disabled} error={error} />
  ),
  defaultValue: "",
  validate: (value: string) => {
    if (!value) return null; // Optional field
    const num = parseFloat(value);
    if (isNaN(num)) return "Price threshold must be a valid number";
    if (num < 0) return "Price threshold must be positive";
    return null;
  },
};
