import type { HTMLAttributes } from "react";
import { cn } from "@/src/shared/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-panel border bg-panel shadow-card", className)} {...props} />;
}
