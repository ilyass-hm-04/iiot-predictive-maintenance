"use client"

import { useEffect, useState } from "react"
import { LogOut, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import Link from "next/link"
import { Brand, BrandLoader, Eyebrow } from "@/components/design"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? window.localStorage.getItem('user') : null
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUserName(parsed.name || parsed.email || null)
      } catch {
        setUserName(null)
      }
    }
  }, [])

  if (!mounted) {
    return <BrandLoader label="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-coal text-white">
      {/* Header — floating capsule + round actions */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          {/* Logo capsule */}
          <Link
            href="/dashboard"
            className="group flex h-12 min-w-0 items-center gap-4 rounded-full border border-white/[0.08] bg-ink/85 pl-2.5 pr-5 backdrop-blur-xl transition-colors hover:border-white/20"
          >
            <Brand />
            <span className="hidden h-4 w-px bg-white/15 md:block" />
            <span className="hidden text-xs text-slate-400 md:block">Real-time Industrial Monitoring</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* User Info - Desktop */}
            <div className="hidden h-12 items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 text-neutral-950 lg:flex">
              <div className="flex size-9 items-center justify-center rounded-full bg-neutral-950 text-sm font-medium text-white">
                {(userName || 'U')[0].toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="text-[11px] text-neutral-500">Logged in as</p>
                <p className="text-sm font-medium">{userName || 'User'}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.localStorage.removeItem('token')
                  window.localStorage.removeItem('user')
                }
                window.location.href = '/'
              }}
              className="flex size-12 items-center justify-center rounded-full bg-white text-neutral-950 transition-all duration-300 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="size-[18px]" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-12 items-center justify-center rounded-full bg-white text-neutral-950 transition-all duration-300 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.2, 0.7, 0.1, 1] }}
              className="mx-auto mt-2 max-w-[1400px] overflow-hidden rounded-2xl border border-white/[0.08] bg-graphite/95 backdrop-blur-xl lg:hidden"
            >
              <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
                <DashboardNav mobile onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28">
              <Eyebrow className="mb-5 text-slate-400">Console</Eyebrow>
              <DashboardNav />
            </div>
          </aside>

          {/* Content Area */}
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
