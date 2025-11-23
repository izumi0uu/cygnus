import { TimeInput } from "../components/TimeInput";
import type { DrawerConfigPlugin } from "../plugin.types";

export const timeInputPlugin: DrawerConfigPlugin = {
  key: "time",
  label: "Time",
  enabled: node => node.type === "trigger", // Only enabled for trigger nodes
  render: ({ value, onChange, disabled }) => (
    <TimeInput value={value as string} onChange={onChange} disabled={disabled} />
  ),
  defaultValue: "10:00",
};
