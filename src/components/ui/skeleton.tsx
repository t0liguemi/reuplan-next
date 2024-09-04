import { cn } from "~/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted border-2 border-border/20 dark:border-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
