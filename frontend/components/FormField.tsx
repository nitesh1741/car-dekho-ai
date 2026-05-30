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
    <div className="flex flex-col gap-2 bg-slate-900/30 border border-slate-800/40 p-4 rounded-xl backdrop-blur-sm transition-all hover:border-slate-800">
      <div className="flex justify-between items-start">
        <label
          htmlFor={id}
          className="text-sm font-bold text-slate-200 tracking-wide"
        >
          {label}
        </label>
        {error && (
          <span
            id={`${id}-error`}
            className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium animate-pulse"
          >
            {error}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-slate-400 leading-normal max-w-xl">
          {description}
        </p>
      )}
      <div className="mt-1">{children}</div>
    </div>
  );
}
