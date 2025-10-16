import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger(
  props: React.ComponentProps<typeof SelectPrimitive.Trigger>
) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={cn(
        "inline-flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm",
        props.className
      )}
    >
      <SelectPrimitive.Value />
      <ChevronDown className="h-4 w-4 opacity-60" />
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent(
  props: React.ComponentProps<typeof SelectPrimitive.Content>
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        {...props}
        className={cn(
          "z-50 rounded-xl border bg-white p-1 shadow-soft",
          props.className
        )}
      >
        <SelectPrimitive.Viewport />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export const SelectItem = (
  props: React.ComponentProps<typeof SelectPrimitive.Item>
) => (
  <SelectPrimitive.Item
    {...props}
    className={cn(
      "select-none rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-neutral-100",
      props.className
    )}
  />
);
