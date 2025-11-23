import { DropdownSelect } from "~~/components/ui/DropdownSelect";
import type { DropdownSelectOption } from "~~/components/ui/DropdownSelect";
import type { AssetType } from "~~/constants/node";

const ASSET_OPTIONS: DropdownSelectOption<AssetType>[] = [
  { value: "eth", label: "ETH" },
  { value: "btc", label: "BTC" },
  { value: "sol", label: "SOL" },
  { value: "avalanche", label: "Avalanche" },
];

export interface AssetSelectProps {
  value: AssetType;
  onChange: (value: AssetType) => void;
  disabled?: boolean;
  helpText?: string;
  error?: string;
}

export const AssetSelect = ({ value, onChange, disabled, helpText, error }: AssetSelectProps) => {
  return (
    <DropdownSelect
      value={value}
      options={ASSET_OPTIONS}
      onChange={onChange}
      disabled={disabled}
      label="Asset"
      placeholder="Select an asset"
      error={error}
      helpText={helpText}
    />
  );
};
