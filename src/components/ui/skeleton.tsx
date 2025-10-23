import { cn } from "@/components/ui/utils"

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "card" | "text" | "circle" | "rounded"
}) {
  const variants = {
    default: "rounded-md",
    card: "rounded-xl",
    text: "rounded-sm",
    circle: "rounded-full",
    rounded: "rounded-lg"
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-r from-yellow-100 via-orange-50 to-yellow-100",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        "after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:via-transparent after:to-yellow-50/30",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }