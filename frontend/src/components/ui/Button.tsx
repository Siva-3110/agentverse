import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-primary to-indigo-500 text-white hover:opacity-95 shadow-sm shadow-indigo-500/20 active:scale-[0.98]": variant === "primary",
            "bg-gradient-to-r from-secondary to-purple-500 text-white hover:opacity-95 shadow-sm shadow-purple-500/20 active:scale-[0.98]": variant === "secondary",
            "border border-darkBorder bg-transparent hover:bg-darkBorder text-zinc-300 hover:text-white": variant === "outline",
            "hover:bg-darkBorder/60 hover:text-zinc-200 text-zinc-400": variant === "ghost",
            "text-indigo-400 underline-offset-4 hover:underline bg-transparent": variant === "link",
          },
          {
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 py-2 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
