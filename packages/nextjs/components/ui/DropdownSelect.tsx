import React, { useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

export interface DropdownSelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface DropdownSelectProps<T = string> {
  value: T;
  options: DropdownSelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  helpText?: string;
  label?: string;
  className?: string;
}

export const DropdownSelect = <T extends string | number = string>({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select an option",
  error,
  helpText,
  label,
  className = "",
}: DropdownSelectProps<T>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const closeDropdown = () => {
    labelRef.current?.blur();
  };

  useOutsideClick(dropdownRef, closeDropdown);

  const handleOptionClick = (option: DropdownSelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    closeDropdown();
  };

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text text-sm font-medium">{label}</span>
        </label>
      )}
      <div ref={dropdownRef} className="dropdown w-full">
        <label
          ref={labelRef}
          tabIndex={disabled ? -1 : 0}
          className={`btn btn-outline w-full flex items-center justify-between normal-case font-normal h-12 min-h-12 ${
            error ? "btn-error" : "bg-base-100 hover:bg-base-200 border-base-300"
          } ${disabled ? "btn-disabled cursor-not-allowed opacity-50" : ""}`}
        >
          <span className={`flex-1 text-left ${!selectedOption ? "text-base-content/50" : ""}`}>{displayValue}</span>
          <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" aria-hidden="true" />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-1 mt-1 shadow-lg bg-base-100 rounded-box border border-base-300 w-full max-h-60 overflow-y-auto z-[100]"
        >
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <li key={String(option.value)} className={option.disabled ? "disabled opacity-50" : ""}>
                <button
                  type="button"
                  className={`w-full text-left py-2 px-3 rounded ${
                    isSelected ? "bg-primary/10 font-medium" : "hover:bg-base-200"
                  }`}
                  onClick={() => handleOptionClick(option)}
                  disabled={option.disabled}
                >
                  {option.label}
                  {isSelected && <span className="float-right text-primary">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {(helpText || error) && (
        <label className="label">
          <span className={`label-text-alt ${error ? "text-error" : "text-base-content/60"}`}>{error || helpText}</span>
        </label>
      )}
    </div>
  );
};
