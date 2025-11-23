import { DropdownSelect } from "~~/components/ui/DropdownSelect";
import type { DropdownSelectOption } from "~~/components/ui/DropdownSelect";
import type { ScheduleType } from "~~/constants/node";

const SCHEDULE_OPTIONS: DropdownSelectOption<ScheduleType>[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export interface ScheduleSelectProps {
  value: string;
  onChange: (value: ScheduleType) => void;
  disabled?: boolean;
  helpText?: string;
  error?: string;
}

export const ScheduleSelect = ({ value, onChange, disabled, helpText, error }: ScheduleSelectProps) => {
  return (
    <DropdownSelect
      value={(value || "daily") as ScheduleType}
      options={SCHEDULE_OPTIONS}
      onChange={onChange}
      disabled={disabled}
      label="Schedule"
      placeholder="Select a schedule"
      error={error}
      helpText={helpText}
    />
  );
};
