import { ScheduleSelect } from "../components/ScheduleSelect";
import type { DrawerConfigPlugin } from "../plugin.types";

export const scheduleSelectPlugin: DrawerConfigPlugin = {
  key: "schedule",
  label: "Schedule",
  enabled: node => node.type === "trigger", // Only enabled for trigger nodes
  render: ({ value, onChange, disabled }) => (
    <ScheduleSelect value={value as string} onChange={onChange} disabled={disabled} />
  ),
  defaultValue: "daily",
};
