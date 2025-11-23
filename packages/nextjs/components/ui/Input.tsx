import React from "react";

export type InputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week";

export interface InputProps {
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  defaultValue?: string;
  autoComplete?: string;
}

export const Input = ({
  type = "text",
  value,
  onChange,
  disabled,
  helpText,
  error,
  label,
  placeholder,
  min,
  max,
  step,
  required,
  className = "",
  inputClassName = "",
  defaultValue,
  autoComplete,
}: InputProps) => {
  const inputValue = value !== undefined && value !== null ? value : defaultValue || "";

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text text-sm font-medium">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <input
        type={type}
        className={`input input-bordered w-full ${error ? "input-error" : ""} ${inputClassName}`}
        placeholder={placeholder}
        value={inputValue}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        required={required}
        autoComplete={autoComplete}
      />
      {(helpText || error) && (
        <label className="label">
          <span className={`label-text-alt ${error ? "text-error" : "text-base-content/60"}`}>{error || helpText}</span>
        </label>
      )}
    </div>
  );
};
