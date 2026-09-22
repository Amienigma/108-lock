import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:not-disabled:scale-[0.96] [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:opacity-90",
        ghost:
          "bg-transparent text-fg hover:bg-bg-subtle border border-transparent",
        outline:
          "border border-border bg-transparent text-fg hover:bg-bg-subtle",
        subtle: "bg-bg-subtle text-fg hover:bg-bg-elevated border border-border",
        selected: "bg-fg text-bg hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 rounded-lg text-sm",
        sm: "h-8 px-3 rounded-md text-xs",
        lg: "h-11 px-5 rounded-xl text-sm",
        icon: "size-10 rounded-lg",
        pill: "h-9 px-3.5 rounded-full text-xs tracking-wide",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
