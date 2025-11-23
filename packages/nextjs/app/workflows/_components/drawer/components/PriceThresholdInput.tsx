import { Input } from "~~/components/ui/Input";

export interface PriceThresholdInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  helpText?: string;
  error?: string;
}

export const PriceThresholdInput = ({ value, onChange, disabled, helpText, error }: PriceThresholdInputProps) => {
  return (
    <Input
      type="number"
      value={value}
      onChange={onChange}
      disabled={disabled}
      label="Price Threshold"
      placeholder="Enter price threshold"
      error={error}
      helpText={helpText}
    />
  );
};
