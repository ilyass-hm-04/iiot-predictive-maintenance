'use client'

import { motion } from 'framer-motion'
import { Activity, Lock, Wifi, Shield, Zap, TrendingUp } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Eyebrow, IconBadge } from '@/components/design'

const chartData = [
  { value: 400 },
  { value: 300 },
  { value: 600 },
  { value: 800 },
  { value: 500 },
  { value: 900 },
  { value: 700 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.2, 0.7, 0.1, 1] as const,
    },
  },
}

export default function BentoGrid() {
  return (
    <section className="relative overflow-hidden bg-coal px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Eyebrow className="text-slate-300">Platform</Eyebrow>
          <h2 className="display mt-5 text-4xl text-white sm:text-5xl md:text-6xl">
            Built for Scale.
            <br />
            <span className="text-slate-500">Designed for Speed.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
            Enterprise-grade features that just work. No configuration hell.
          </p>
        </motion.div>

        {/* Core illustration */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.2, 0.7, 0.1, 1] }}
          className="relative mx-auto mt-12 w-[min(560px,90vw)]"
        >
          <img src="/visuals/turbine-core.svg" alt="" className="w-full select-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-coal" />
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative -mt-40 grid grid-cols-1 gap-3 sm:-mt-56 md:grid-cols-3 md:gap-4"
        >
          {/* Large Card - AI Detection */}
          <motion.div
            variants={itemVariants}
            className="group flex flex-col rounded-[10px] bg-graphite/95 p-6 backdrop-blur-sm transition-colors duration-500 hover:bg-[#202020] sm:p-8 md:col-span-2 md:row-span-2"
          >
            <div className="flex items-center gap-4">
              <IconBadge>
                <Activity />
              </IconBadge>
              <div>
                <h3 className="text-2xl font-normal tracking-[-0.02em] text-white sm:text-[28px]">AI-Powered Detection</h3>
                <p className="text-sm text-slate-400">Isolation Forest Algorithm</p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-300">
              Automatically detect anomalies in real-time sensor data with machine learning.
              No manual thresholding required.
            </p>

            {/* Animated Chart */}
            <div className="dot-grid-light relative mt-8 h-64 overflow-hidden rounded-[8px] border border-white/[0.06] bg-coal p-6 md:h-auto md:min-h-64 md:flex-1">
              <div className="absolute left-6 top-4 z-10">
                <span className="eyebrow text-[11px] tracking-[0.08em] text-slate-500">VIBRATION ANALYSIS</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f7cf49"
                    strokeWidth={2.5}
                    dot={false}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* Anomaly Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
                className="absolute right-20 top-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/25 blur-xl" />
                  <div className="relative rounded-full bg-red-500 px-3 py-1 text-[11px] font-medium tracking-wide text-white">
                    ANOMALY
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Row */}
            <div className="mt-6 grid grid-cols-3 divide-x divide-white/[0.08] border-t border-white/[0.08] pt-6">
              <div className="pr-4">
                <div className="text-3xl font-normal tracking-[-0.03em] text-white">99.2%</div>
                <div className="mt-1 text-xs text-slate-500">Accuracy</div>
              </div>
              <div className="px-4">
                <div className="text-3xl font-normal tracking-[-0.03em] text-white">&lt;50ms</div>
                <div className="mt-1 text-xs text-slate-500">Latency</div>
              </div>
              <div className="pl-4">
                <div className="text-3xl font-normal tracking-[-0.03em] text-white">10k+</div>
                <div className="mt-1 text-xs text-slate-500">Predictions/sec</div>
              </div>
            </div>
          </motion.div>

          {/* Real-Time MQTT Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-[10px] bg-graphite/95 p-7 text-center backdrop-blur-sm transition-colors duration-500 hover:bg-[#202020] sm:p-8"
          >
            <IconBadge>
              <Wifi />
            </IconBadge>
            <h3 className="mt-5 text-2xl font-normal tracking-[-0.02em] text-white">Real-Time MQTT</h3>
            <p className="mt-3 text-sm text-slate-400">
              Stream data from thousands of devices with sub-second latency.
            </p>

            {/* Live Indicator */}
            <div className="mt-6 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-neutral-950">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="size-2 rounded-full bg-green-600"
              />
              <span className="text-xs font-medium tracking-wide">LIVE</span>
              <span className="ml-auto text-xs text-neutral-500">847 devices</span>
            </div>

            {/* Message Stream */}
            <div className="mt-4 space-y-0 text-left">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.3, repeat: Infinity, repeatDelay: 2 }}
                  className="border-b border-white/[0.06] py-2.5 font-mono text-xs text-slate-400 last:border-b-0"
                >
                  sensors/temp/{i} → 72.{i}°C
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Secure & Scalable Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-[10px] bg-graphite/95 p-7 text-center backdrop-blur-sm transition-colors duration-500 hover:bg-[#202020] sm:p-8"
          >
            <IconBadge>
              <Shield />
            </IconBadge>
            <h3 className="mt-5 text-2xl font-normal tracking-[-0.02em] text-white">Secure & Scalable</h3>
            <p className="mt-3 text-sm text-slate-400">
              Enterprise-grade security with JWT auth and role-based access control.
            </p>

            {/* Security Features */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-3 border-b border-white/[0.06] py-2.5 text-sm text-slate-300">
                <Lock className="size-4 text-slate-500" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-3 border-b border-white/[0.06] py-2.5 text-sm text-slate-300">
                <Zap className="size-4 text-signal" />
                <span>Auto-scaling</span>
              </div>
              <div className="flex items-center gap-3 py-2.5 text-sm text-slate-300">
                <TrendingUp className="size-4 text-slate-500" />
                <span>99.99% SLA</span>
              </div>
            </div>

            {/* Rotating shield emblem */}
            <div className="relative mt-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20"
              />
              <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-coal ring-1 ring-white/10">
                <Shield className="size-9 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
