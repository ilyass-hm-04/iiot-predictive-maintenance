"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70 focus-visible:ring-offset-2 focus-visible:ring-offset-coal disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"

const buttonVariants = {
  default: `${base} bg-signal px-5 text-neutral-950 hover:bg-signal-strong`,
  destructive: `${base} bg-red-500 px-5 text-white hover:bg-red-600`,
  outline: `${base} border border-white/15 bg-transparent px-5 text-white hover:border-white/40 hover:bg-white/[0.06]`,
  ghost: `${base} px-4 text-slate-300 hover:bg-white/[0.06] hover:text-white`,
  light: `${base} bg-white px-5 text-neutral-950 hover:bg-neutral-200`,
  dark: `${base} bg-ink px-5 text-white hover:bg-neutral-800`,
  // Pill + attached arrow circle (reference "Add to cart ↗" pattern)
  cta: "group/cta inline-flex items-center gap-1 rounded-full text-sm font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70 focus-visible:ring-offset-2 focus-visible:ring-offset-coal disabled:pointer-events-none disabled:opacity-50",
  "cta-dark": "group/cta inline-flex items-center gap-1 rounded-full text-sm font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  "cta-light": "group/cta inline-flex items-center gap-1 rounded-full text-sm font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-coal disabled:pointer-events-none disabled:opacity-50",
} as const

const ctaTone = {
  cta: "bg-signal text-neutral-950 group-hover/cta:bg-signal-strong",
  "cta-dark": "bg-ink text-white group-hover/cta:bg-neutral-800",
  "cta-light": "bg-white text-neutral-950 group-hover/cta:bg-neutral-200",
} as const

const buttonSizes = {
  default: "h-10",
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-7 text-[15px]",
  icon: "h-10 w-10 px-0",
} as const

const ctaSizes = {
  default: { pill: "h-10 px-5", dot: "size-10" },
  sm: { pill: "h-9 px-4", dot: "size-9" },
  lg: { pill: "h-12 px-7", dot: "size-12" },
  icon: { pill: "h-10 px-4", dot: "size-10" },
} as const

type ButtonProps = {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  asChild?: boolean
  /** Icon shown in the attached circle of `cta` variants. */
  ctaIcon?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ctaIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    if (variant === "cta" || variant === "cta-dark" || variant === "cta-light") {
      const tone = ctaTone[variant]
      const s = ctaSizes[size]
      return (
        <Comp className={cn(buttonVariants[variant], className)} ref={ref} {...props}>
          <span className={cn("inline-flex items-center justify-center gap-2 rounded-full transition-colors duration-300", tone, s.pill)}>
            {children}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover/cta:rotate-45",
              tone,
              s.dot
            )}
          >
            {ctaIcon ?? <ArrowUpRight className="size-4" />}
          </span>
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants[variant], buttonSizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
