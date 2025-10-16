import * as React from "react";
import { cn } from "./utils";

export function Badge({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700", className)}>
      {children}
    </div>
  );
}
