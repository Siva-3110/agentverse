import * as React from "react";
import { cn } from "../../lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
}

export function Progress({ value, className, ...props }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-darkBorder", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-gradient-to-r from-primary to-indigo-500 transition-all duration-300 ease-out"
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  );
}
