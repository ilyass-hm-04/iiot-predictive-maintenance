'use client'

import { motion } from 'framer-motion'
import { Eyebrow } from '@/components/design'

const technologies = [
  { name: 'Next.js' },
  { name: 'FastAPI' },
  { name: 'Docker' },
  { name: 'PostgreSQL' },
  { name: 'InfluxDB' },
  { name: 'MQTT' },
  { name: 'Tailwind CSS' },
  { name: 'TypeScript' },
  { name: 'Python' },
  { name: 'scikit-learn' },
  { name: 'Redis' },
  { name: 'Grafana' },
]

export default function StackMarquee() {
  return (
    <section className="relative overflow-hidden bg-white py-20 text-neutral-950 sm:py-28">
      <div className="mb-10 text-center sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Eyebrow className="text-neutral-700">Powered by Industry-Leading Technologies</Eyebrow>
        </motion.div>
      </div>

      {/* Scrolling Container */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-40" />
        <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-40" />

        {/* Marquee */}
        <div className="flex">
          <div className="flex animate-scroll gap-14 whitespace-nowrap pr-14 hover:[animation-play-state:paused] sm:gap-20 sm:pr-20">
            {/* First set + duplicate set for seamless loop */}
            {[...technologies, ...technologies].map((tech, i) => (
              <span
                key={`${tech.name}-${i}`}
                aria-hidden={i >= technologies.length ? true : undefined}
                className="bg-gradient-to-b from-neutral-500 via-neutral-700 to-neutral-300 bg-clip-text text-6xl font-normal tracking-[-0.04em] text-transparent sm:text-8xl md:text-[120px]"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Below Marquee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mx-auto mt-16 grid max-w-[1400px] grid-cols-2 px-4 sm:mt-20 sm:px-8 md:grid-cols-4"
      >
        {[
          { label: 'GitHub Stars', value: '1.2k+' },
          { label: 'Production Deployments', value: '847' },
          { label: 'Community Members', value: '3.5k+' },
          { label: 'Countries', value: '42' },
        ].map((stat, i) => (
          <div key={i} className="border-t border-neutral-200 py-6 pr-4 md:border-l md:border-t-0 md:py-2 md:pl-6 md:first:border-l-0 md:first:pl-0">
            <div className="text-4xl font-normal tracking-[-0.03em] text-neutral-950 sm:text-5xl">{stat.value}</div>
            <div className="mt-2 text-sm text-neutral-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
