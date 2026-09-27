'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Database, Cpu, Server, Terminal, Zap } from 'lucide-react'
import { Eyebrow } from '@/components/design'

const pythonCode = `from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self, contamination=0.1):
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100
        )

    def train(self, X: np.ndarray):
        """Train the anomaly detection model"""
        self.model.fit(X)
        return self

    def predict(self, X: np.ndarray):
        """Predict anomalies (-1) or normal (1)"""
        predictions = self.model.predict(X)
        scores = self.model.score_samples(X)

        return {
            'anomalies': predictions == -1,
            'scores': scores,
            'confidence': np.abs(scores)
        }

# Real-time inference
detector = AnomalyDetector(contamination=0.05)
result = detector.predict(sensor_data)
`

const stack = [
  { label: 'FastAPI', desc: 'Async REST API with OpenAPI docs', icon: Zap },
  { label: 'scikit-learn', desc: 'Production-ready ML models', icon: Cpu },
  { label: 'PostgreSQL', desc: 'Time-series optimized storage', icon: Database },
  { label: 'Redis', desc: 'Real-time caching layer', icon: Server },
]

export default function DeveloperSection() {
  return (
    <section className="relative bg-coal">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Code Terminal (image panel) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative order-2 overflow-hidden bg-ink lg:order-1"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[url('/visuals/sensor-board.svg')] bg-cover bg-center opacity-25" />
          <div className="relative flex h-full flex-col">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3 sm:px-8 sm:py-4">
              <div className="flex gap-1.5 sm:gap-2">
                <div className="size-2.5 rounded-full bg-white/25 sm:size-3" />
                <div className="size-2.5 rounded-full bg-white/25 sm:size-3" />
                <div className="size-2.5 rounded-full bg-signal sm:size-3" />
              </div>
              <div className="ml-2 flex flex-1 items-center gap-2 sm:ml-4">
                <Terminal className="size-3 text-slate-500 sm:size-4" />
                <span className="truncate font-mono text-[10px] text-slate-500 sm:text-xs">anomaly_detector.py</span>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-x-auto p-4 sm:p-8">
              <pre className="font-mono text-xs leading-relaxed sm:text-[13px]">
                <code>
                  {pythonCode.split('\n').map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                      className="-mx-2 rounded px-2 hover:bg-white/[0.04]"
                    >
                      <span className="inline-block w-8 select-none text-slate-600">{i + 1}</span>
                      <span
                        className={
                          line.includes('def ') || line.includes('class ') || line.includes('return')
                            ? 'text-white'
                            : line.includes('import ') || line.includes('from ')
                            ? 'text-slate-400'
                            : line.includes("'") || line.includes('"')
                            ? 'text-signal'
                            : line.includes('#')
                            ? 'text-slate-600'
                            : 'text-slate-300'
                        }
                      >
                        {line || ' '}
                      </span>
                    </motion.div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Terminal Footer */}
            <div className="flex items-center gap-4 border-t border-white/[0.08] px-4 py-2.5 font-mono text-xs text-slate-500 sm:px-8">
              <div className="flex items-center gap-2">
                <div className="size-2 animate-pulse rounded-full bg-signal" />
                <span>Python 3.10</span>
              </div>
              <div>UTF-8</div>
              <div>Ln 24, Col 8</div>
            </div>
          </div>
        </motion.div>

        {/* Right: Marketing Copy */}
        <div className="order-1 px-4 py-20 sm:px-8 sm:py-28 lg:order-2 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Eyebrow className="text-slate-300">
              Developer First
            </Eyebrow>

            <h2 className="display mt-6 text-4xl sm:text-5xl md:text-[56px]">
              <span className="text-slate-500">Built with</span>
              <br />
              <span className="text-white">Modern Python.</span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
              FastAPI backend with async Python. Powered by scikit-learn for ML inference.
              Deploy anywhere with Docker.
            </p>
          </motion.div>

          <div className="mt-12">
            {stack.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="rail-row group flex items-center gap-4 border-b border-white/[0.08] py-4 text-slate-500 transition-colors duration-300 hover:text-white"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br from-[#2e2e2e] to-[#121212] ring-1 ring-white/[0.06] transition-colors group-hover:text-signal">
                    <Icon className="size-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[17px] font-medium text-slate-300 transition-colors group-hover:text-white">{item.label}</div>
                    <div className="text-sm text-slate-500">{item.desc}</div>
                  </div>
                  <ArrowUpRight className="ml-auto size-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <a
              href="https://github.com/H0ussamCl4p/iiot-predictive-maintenance"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1"
            >
              <span className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-neutral-950 transition-colors group-hover:bg-neutral-200">
                <Terminal className="size-4" />
                View Documentation
              </span>
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-neutral-950 transition-all duration-300 group-hover:rotate-45 group-hover:bg-neutral-200">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
