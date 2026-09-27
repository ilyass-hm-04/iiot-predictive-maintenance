'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Github, Star } from 'lucide-react'
import { NotchCard, Eyebrow } from '@/components/design'

const ease = [0.2, 0.7, 0.1, 1] as const

function RiseLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[linear-gradient(100deg,#0b0b0b_0%,#262626_38%,#5e5e5e_68%,#8f8f8f_100%)] md:items-center">
        {/* Machine illustration */}
        <motion.img
          src="/visuals/hero-spindle.svg"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease }}
          className="pointer-events-none absolute left-[-30%] top-0 h-[78%] w-auto max-w-none select-none [mask-image:linear-gradient(to_right,black_55%,transparent_98%)] sm:left-[-12%] md:left-[-14%] md:h-full lg:left-[-8%] xl:left-0"
        />
        {/* Architectural hairlines */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line x1="44%" y1="0" x2="44%" y2="100%" stroke="white" strokeOpacity=".12" />
          <line x1="0" y1="62%" x2="100%" y2="62%" stroke="white" strokeOpacity=".10" />
          <line x1="66%" y1="0" x2="100%" y2="38%" stroke="white" strokeOpacity=".22" />
          <line x1="8%" y1="70%" x2="30%" y2="100%" stroke="white" strokeOpacity=".14" />
        </svg>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/10" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-14 pt-32 sm:px-8 md:pb-0 md:pt-24">
          <div className="md:ml-auto md:w-[50%] lg:w-[46%]">
            {/* Headline */}
            <h1 className="display text-[44px] text-white sm:text-6xl lg:text-[64px] xl:text-[76px]">
              <RiseLine delay={1.6}>Predictive Maintenance</RiseLine>
              <RiseLine delay={1.72}>for the Modern Factory.</RiseLine>
            </h1>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.8, ease }}
              className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            >
              <Link href="/dashboard" className="group inline-flex items-center gap-1">
                <span className="inline-flex h-12 items-center rounded-full bg-signal px-7 text-[15px] font-medium text-neutral-950 transition-colors group-hover:bg-signal-strong">
                  Enter Console
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-signal text-neutral-950 transition-all duration-300 group-hover:rotate-45 group-hover:bg-signal-strong">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
              <Link
                href="https://github.com/H0ussamCl4p/iiot-predictive-maintenance"
                target="_blank"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/25 bg-black/20 pl-5 pr-2 text-[15px] font-medium text-white backdrop-blur-md transition-colors hover:border-white/60"
              >
                <Github className="size-4" />
                View on GitHub
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs text-neutral-950">
                  <Star className="size-3 fill-signal text-signal" />
                  <span>42</span>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro + dashboard snapshot */}
      <section className="bg-white text-neutral-950">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow className="text-neutral-800">Open Source • MIT License</Eyebrow>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="text-2xl font-normal leading-snug tracking-[-0.015em] text-neutral-900 sm:text-[28px]"
            >
              Stop downtime before it happens. The open-source standard for IIoT anomaly detection.
            </motion.p>
          </div>

          <p className="mt-16 font-mono text-[11px] tracking-wide text-neutral-400">https://smart-energy-guardien.io/dashboard</p>

          {/* Stat cards */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <NotchCard tab="left" className="flex h-[320px] flex-col justify-between rounded-[6px] p-7 sm:h-[360px]">
                <div className="text-5xl font-normal tracking-[-0.03em] sm:text-6xl">99.9%</div>
                <div>
                  <div className="text-lg font-medium">Uptime</div>
                  <div className="mt-1 text-sm text-neutral-800/80">System availability across the fleet</div>
                </div>
              </NotchCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease }}
              className="group relative h-[300px] overflow-hidden rounded-[6px] bg-neutral-900 sm:h-[320px]"
            >
              <img
                src="/visuals/turbine-core.svg"
                alt=""
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 w-[120%] max-w-none -translate-x-1/2 -translate-y-[58%] opacity-80 transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <div className="text-5xl font-normal tracking-[-0.03em]">847</div>
                <div className="mt-2 text-lg font-medium">Devices</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease }}
            >
              <NotchCard tab="right" className="flex h-[300px] flex-col justify-between rounded-[6px] p-7 pt-14 sm:h-[330px]">
                <div className="flex h-32 items-end justify-center gap-2.5">
                  {[40, 60, 55, 75, 65, 85, 70, 90].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease }}
                      className="w-4 origin-bottom rounded-t-[3px] border-[2.5px] border-b-0 border-neutral-950 sm:w-5"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium">Alerts</div>
                  <div className="text-4xl font-normal tracking-[-0.03em]">3</div>
                </div>
              </NotchCard>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
