import { Input } from "~~/components/ui/Input";

export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  helpText?: string;
}

export const TimeInput = ({ value, onChange, disabled, helpText }: TimeInputProps) => {
  return (
    <Input
      type="time"
      value={value}
      onChange={onChange}
      disabled={disabled}
      label="Time"
      helpText={helpText}
      defaultValue="10:00"
    />
  );
};
