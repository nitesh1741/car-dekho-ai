import React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string | null;
  children: React.ReactNode;
}

export default function FormField({
  id,
  label,
  description,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--border-strong)]">
      <div className="flex justify-between items-start gap-3">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-[var(--text-primary)]"
        >
          {label}
        </label>
        {error && (
          <span
            id={`${id}-error`}
            className="text-xs text-[var(--error)] font-medium whitespace-nowrap"
          >
            {error}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
}
