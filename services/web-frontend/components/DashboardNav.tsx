"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Database,
  AlertTriangle,
  TrendingUp,
  Wrench,
  Calendar,
  Clock,
  FileText,
  Activity,
  MessageSquare,
  ArrowUpRight
} from "lucide-react"

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/chatbot", label: "Chatbot", icon: MessageSquare },
  { href: "/dashboard/data", label: "Data", icon: Database },
  { href: "/dashboard/anomaly", label: "Anomaly", icon: AlertTriangle },
  { href: "/dashboard/prediction", label: "Prediction", icon: TrendingUp },
  { href: "/dashboard/equipment", label: "Equipment", icon: Wrench },
  { href: "/dashboard/maintenance", label: "Maintenance", icon: Calendar },
  { href: "/dashboard/shifts", label: "Shifts", icon: Clock },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/status", label: "Status", icon: Activity },
]

interface DashboardNavProps {
  mobile?: boolean
  onNavigate?: () => void
}

export default function DashboardNav({ mobile = false, onNavigate }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col", mobile && "sm:grid sm:grid-cols-2 sm:gap-x-8")}>
      {items.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            data-active={active}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rail-row group flex items-center gap-3.5 border-b border-white/[0.08] py-3 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-coal",
              active ? "text-white" : "text-slate-500 hover:text-white"
            )}
          >
            {/* Thumbnail tile */}
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-[6px] transition-all duration-300",
                active
                  ? "bg-signal text-neutral-950"
                  : "bg-gradient-to-br from-[#2c2c2c] to-[#141414] text-slate-500 ring-1 ring-white/[0.06] group-hover:text-white"
              )}
            >
              <Icon className="size-4" />
            </span>
            <span className="text-[15px] font-medium tracking-[-0.01em]">{item.label}</span>
            <ArrowUpRight
              className={cn(
                "ml-auto size-4 transition-all duration-300",
                active ? "opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}
