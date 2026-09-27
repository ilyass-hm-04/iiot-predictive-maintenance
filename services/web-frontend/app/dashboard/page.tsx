'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  Database,
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap,
  Shield,
} from 'lucide-react'
import { NotchCard, PageHeader, IconBadge } from '@/components/design'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.2, 0.7, 0.1, 1] as const,
    },
  },
}

const quickActions = [
  {
    href: '/dashboard/data',
    title: 'View Data',
    description: 'Monitor real-time sensor telemetry and historical trends',
    icon: Database,
    visual: '/visuals/sensor-board.svg',
  },
  {
    href: '/dashboard/anomaly',
    title: 'Anomaly Detection',
    description: 'AI-powered detection of equipment abnormalities',
    icon: AlertTriangle,
    visual: '/visuals/turbine-core.svg',
  },
  {
    href: '/dashboard/prediction',
    title: 'Future Prediction',
    description: 'Forecast equipment health and remaining useful life',
    icon: TrendingUp,
    visual: '/visuals/hero-spindle.svg',
  },
  {
    href: '/dashboard/status',
    title: 'System Status',
    description: 'View overall system health and connectivity status',
    icon: Activity,
    visual: '/visuals/machine-bay.svg',
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token')
      if (!token) {
        router.push('/login')
      }
    }
  }, [mounted, router])

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 size-10 rounded-full border-2 border-signal border-t-transparent"
          />
          <p className="text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          eyebrow="Overview"
          title="Welcome Back"
          description="Monitor your industrial fleet in real-time"
        />
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:items-end"
      >
        <motion.div variants={itemVariants}>
          <NotchCard tab="left" className="flex h-64 flex-col justify-between rounded-[6px] p-6 sm:h-72">
            <div className="flex items-start justify-between">
              <div className="text-5xl font-normal tracking-[-0.03em] sm:text-6xl">99.9%</div>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-lg font-medium">System Uptime</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-neutral-800/80">
                  <Activity className="size-3.5" /> Live
                </div>
              </div>
            </div>
          </NotchCard>
        </motion.div>

        <motion.div variants={itemVariants} className="group relative h-60 overflow-hidden rounded-[6px] bg-graphite sm:h-64">
          <img
            src="/visuals/turbine-core.svg"
            alt=""
            aria-hidden="true"
            className="absolute -right-16 -top-16 w-[85%] max-w-none opacity-70 transition-transform duration-[1.4s] ease-out group-hover:rotate-12 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
            <div>
              <div className="text-5xl font-normal tracking-[-0.03em] text-white">847</div>
              <div className="mt-2 text-lg font-medium text-white">Connected Devices</div>
            </div>
            <span className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-slate-300">
              <Zap className="size-3.5" /> Active
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="sm:col-span-2 md:col-span-1">
          <NotchCard tab="right" className="flex h-60 flex-col items-center justify-between rounded-[6px] p-6 pt-12 text-center sm:h-[16.5rem]">
            <img src="/visuals/cube-wire.svg" alt="" aria-hidden="true" className="h-20 w-auto sm:h-24" />
            <div>
              <div className="text-5xl font-normal tracking-[-0.03em]">3</div>
              <div className="mt-1 flex items-center justify-center gap-2 text-lg font-medium">
                Active Alerts
                <span className="flex items-center gap-1 text-xs font-normal uppercase tracking-[0.08em] text-neutral-800/80">
                  <Shield className="size-3.5" /> Secure
                </span>
              </div>
            </div>
          </NotchCard>
        </motion.div>
      </motion.div>

      {/* Quick Actions — split panel, visual follows hovered row */}
      <motion.div variants={itemVariants}>
        <div className="grid overflow-hidden rounded-[10px] bg-graphite lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden min-h-[380px] overflow-hidden bg-ink lg:block">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={quickActions[hovered].visual}
                src={quickActions[hovered].visual}
                alt=""
                aria-hidden="true"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.2, 0.7, 0.1, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-graphite/40" />
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="display text-3xl text-white sm:text-4xl">Quick Actions</h2>
            <div className="mt-8">
              {quickActions.map((action, i) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    data-active={hovered === i}
                    className={`rail-row group flex items-center gap-4 border-b border-white/[0.08] py-4 transition-colors duration-300 focus-visible:outline-none ${hovered === i ? 'text-white' : 'text-slate-500'}`}
                  >
                    <IconBadge className={`rounded-[6px] transition-colors duration-300 ${hovered === i ? 'bg-signal text-neutral-950 ring-0' : ''}`}>
                      <Icon />
                    </IconBadge>
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-medium tracking-[-0.01em]">{action.title}</h3>
                      <p className="mt-0.5 truncate text-sm text-slate-500 sm:whitespace-normal">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className={`ml-auto size-4 shrink-0 transition-all duration-300 ${hovered === i ? 'opacity-100' : 'opacity-0'}`} />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  )
}
