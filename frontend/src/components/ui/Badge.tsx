import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500",
        {
          "bg-indigo-500/10 border-indigo-500/30 text-indigo-400": variant === "default",
          "bg-emerald-500/10 border-emerald-500/30 text-emerald-400": variant === "success",
          "bg-amber-500/10 border-amber-500/30 text-amber-400": variant === "warning",
          "bg-rose-500/10 border-rose-500/30 text-rose-400": variant === "destructive",
          "bg-cyan-500/10 border-cyan-500/30 text-cyan-400": variant === "info",
          "border-darkBorder bg-transparent text-zinc-400": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
