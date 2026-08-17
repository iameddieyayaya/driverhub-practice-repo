import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/src/shared/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "quiet"; size?: "sm" | "md" };

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:pointer-events-none disabled:opacity-50", size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-5 text-sm", variant === "primary" && "bg-road text-white hover:bg-road-dark", variant === "secondary" && "border bg-white text-ink hover:border-ink", variant === "danger" && "bg-red-700 text-white hover:bg-red-800", variant === "quiet" && "text-ink hover:bg-ink/5", className)} {...props} />;
}
