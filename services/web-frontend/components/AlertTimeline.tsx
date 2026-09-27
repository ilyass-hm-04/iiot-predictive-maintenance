// Alert history timeline component

'use client'

import { formatDistanceToNow } from 'date-fns'
import { AlertCircle, AlertTriangle, Activity } from 'lucide-react'
import type { Alert } from '@/types'

interface AlertTimelineProps {
  alerts: Alert[];
}

export default function AlertTimeline({ alerts }: AlertTimelineProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="py-10 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-white/[0.05] ring-1 ring-white/[0.06]">
          <Activity className="size-6 text-slate-500" />
        </span>
        <p className="text-slate-300">No alerts in the last 24 hours</p>
        <p className="mt-1 text-sm text-slate-500">System operating normally</p>
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto pr-2">
      {alerts.map((alert, index) => {
        const isAnomaly = alert.severity === 'ANOMALY'
        const dotColor = isAnomaly ? 'bg-red-500 text-white' : 'bg-signal text-neutral-950'
        const textColor = isAnomaly ? 'text-red-400' : 'text-signal'
        const Icon = isAnomaly ? AlertCircle : AlertTriangle

        return (
          <div
            key={`${alert.timestamp}-${index}`}
            className="group flex items-start gap-4 border-b border-white/[0.08] py-4 transition-colors first:pt-1 last:border-b-0 hover:bg-white/[0.02]"
          >
            <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${dotColor}`}>
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className={`text-[11px] font-medium uppercase tracking-[0.1em] ${textColor}`}>
                  {alert.severity}
                </span>
                <span className="shrink-0 text-xs text-slate-500">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="mb-2 text-[15px] text-white">{alert.message}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums text-slate-500">
                <span>Vibration: {alert.vibration}</span>
                <span>Temp: {alert.temperature}°C</span>
                <span>Score: {alert.score}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
