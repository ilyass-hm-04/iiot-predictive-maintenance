// Shared visual building blocks for the monochrome industrial design language.
// Purely presentational: no data fetching, no side effects.

import * as React from "react"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export const BRAND_NAME = "Smart Energy Guardien"

/* ---------- Brand ---------- */

export function BrandMark({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] [clip-path:polygon(0_0,70%_0,100%_30%,100%_100%,30%_100%,0_70%)]",
        tone === "light" ? "bg-white text-neutral-950" : "bg-neutral-950 text-white",
        className
      )}
    >
      <Activity className="size-[58%]" strokeWidth={2.6} />
    </span>
  )
}

export function Brand({
  className,
  tone = "light",
  size = "sm",
}: {
  className?: string
  tone?: "light" | "dark"
  size?: "sm" | "lg"
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark tone={tone} className={size === "lg" ? "size-10" : undefined} />
      <span
        className={cn(
          "font-semibold tracking-[-0.02em] whitespace-nowrap",
          size === "lg" ? "text-2xl sm:text-3xl" : "text-[13px] sm:text-sm",
          tone === "light" ? "text-white" : "text-neutral-950"
        )}
      >
        {BRAND_NAME}
      </span>
    </span>
  )
}

/* ---------- Typography ---------- */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("eyebrow text-slate-300", className)}>{children}</span>
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h1 className="display text-[34px] text-white sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-steel">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}

/* ---------- Surfaces ---------- */

/** Yellow "folder tab" card from the reference, with dot-grid texture. */
export function NotchCard({
  children,
  className,
  tab = "left",
  dots = true,
}: {
  children: React.ReactNode
  className?: string
  tab?: "left" | "right" | "quote"
  dots?: boolean
}) {
  return (
    <div
      className={cn(
        "relative bg-signal text-neutral-950",
        tab === "left" && "notch-tab-left",
        tab === "right" && "notch-tab-right",
        tab === "quote" && "notch-quote",
        dots && "dot-grid",
        className
      )}
    >
      {children}
    </div>
  )
}

/** Round icon badge used on dark cards ("Eco-Friendly" pattern). */
export function IconBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 ring-1 ring-white/[0.06] [&_svg]:size-[18px]",
        className
      )}
    >
      {children}
    </span>
  )
}

/** Live indicator pill. */
export function LivePill({ label = "LIVE", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-neutral-950",
        className
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-600 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-600" />
      </span>
      {label}
    </span>
  )
}

/* ---------- Loading ---------- */

/** Logo-reveal loader (reference intro): the wordmark is wiped in by a sliding bar. */
export function BrandLoader({ label, fullscreen = true }: { label?: string; fullscreen?: boolean }) {
  return (
    <div
      className={cn("flex items-center justify-center bg-white", fullscreen ? "min-h-screen" : "h-full w-full")}
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="relative inline-flex overflow-hidden px-1">
          <span className="animate-rise inline-block">
            <Brand tone="dark" size="lg" />
          </span>
          <span aria-hidden="true" className="animate-wipe absolute inset-y-1 left-0 right-0 bg-neutral-400/80" />
        </div>
        {label && <p className="animate-rise mt-5 text-sm text-neutral-500 [animation-delay:.3s]">{label}</p>}
      </div>
    </div>
  )
}
