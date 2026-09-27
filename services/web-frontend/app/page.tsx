import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Hero from '@/components/landing/Hero'
import BentoGrid from '@/components/landing/BentoGrid'
import DeveloperSection from '@/components/landing/DeveloperSection'
import StackMarquee from '@/components/landing/StackMarquee'
import { Brand, Eyebrow } from '@/components/design'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-coal text-white">
      {/* Intro curtain — logo reveal (reference preloader), plays once on load */}
      <div
        aria-hidden="true"
        className="animate-curtain pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-white"
      >
        <div className="relative overflow-hidden px-1">
          <span className="animate-rise inline-block">
            <Brand tone="dark" size="lg" />
          </span>
          <span className="animate-wipe absolute inset-y-1 left-0 right-0 bg-neutral-400/80" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2">
          <div className="flex h-11 min-w-0 items-center rounded-full border border-white/[0.08] bg-ink/80 pl-2 pr-4 backdrop-blur-xl sm:h-12 sm:pl-2.5 sm:pr-5">
            <Brand />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-white px-3.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-neutral-200 sm:h-12 sm:px-5 sm:text-sm"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="group hidden items-center gap-1 sm:inline-flex"
            >
              <span className="inline-flex h-12 items-center rounded-full bg-white px-5 text-sm font-medium text-neutral-950 transition-colors group-hover:bg-neutral-200">
                Enter Console
              </span>
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-neutral-950 transition-all duration-300 group-hover:rotate-45 group-hover:bg-neutral-200">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-signal px-3.5 text-xs font-medium text-neutral-950 sm:hidden"
            >
              Enter Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Hero />
      <BentoGrid />
      <DeveloperSection />
      <StackMarquee />

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ink">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/visuals/machine-bay.svg')] bg-cover bg-center opacity-60"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-ink/20" />
        <div className="relative mx-auto grid max-w-[1400px] items-end gap-10 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16">
          <div>
            <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
              Ready to prevent downtime?
            </h2>
            <p className="mt-5 max-w-lg text-base text-slate-300 sm:text-lg">
              Join hundreds of factories already using Smart Energy Guardien.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-7 text-neutral-950 sm:p-10">
            <Eyebrow className="text-neutral-500">Get started</Eyebrow>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="group flex items-center justify-between gap-1"
              >
                <span className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-neutral-950 px-7 text-sm font-medium text-white transition-colors group-hover:bg-neutral-800">
                  Let&apos;s Get Started
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-neutral-950 text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-neutral-800">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
              <Link
                href="https://github.com/H0ussamCl4p/iiot-predictive-maintenance"
                target="_blank"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-200 px-7 text-sm font-medium text-neutral-950 transition-colors hover:border-neutral-950"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
