import type { InputHTMLAttributes } from "react";
import { cn } from "@/src/shared/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function Input({ label, error, className, id, ...props }: Props) {
  const inputId = id ?? props.name;
  return <label className="grid gap-1.5 text-sm font-semibold text-ink-soft" htmlFor={inputId}>
    {label}
    <input id={inputId} className={cn("h-11 rounded-xl border bg-white px-3 font-normal text-ink shadow-sm transition placeholder:text-muted/70 hover:border-muted focus:border-road focus:outline-none", error && "border-red-600", className)} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />
    {error ? <span id={`${inputId}-error`} role="alert" className="text-xs font-medium text-red-700">{error}</span> : null}
  </label>;
}
