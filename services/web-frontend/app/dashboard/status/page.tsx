"use client"

import useSWR from 'swr'
import ModelStatusCard from '@/components/ModelStatusCard'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LiveData } from '@/types'
import { apiUrl } from '@/lib/api-config'
import { PageHeader } from '@/components/design'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Machine {
  machine_id: string
  name: string
  status: string
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    NORMAL: 'bg-green-500/10 text-green-400 border-green-500/30',
    WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    ANOMALY: 'bg-red-500/10 text-red-400 border-red-500/30',
    UNKNOWN: 'bg-white/5 text-slate-400 border-white/10',
  }
  return <Badge variant="outline" className={variants[status] || variants.UNKNOWN}>{status}</Badge>
}

export default function StatusPage() {
  const { data: machines } = useSWR<Machine[]>(apiUrl('/api/machines'), fetcher, { refreshInterval: 3000 })
  const { data: liveData2 } = useSWR<LiveData>(apiUrl('/api/live?machine_id=MACHINE_002'), fetcher, { refreshInterval: 3000 })
  const { data: liveData3 } = useSWR<LiveData>(apiUrl('/api/live?machine_id=MACHINE_003'), fetcher, { refreshInterval: 3000 })

  const allMachines = [
    { id: 'MACHINE_002', name: 'Conveyor Belt', data: liveData2 },
    { id: 'MACHINE_003', name: 'Industrial Motor', data: liveData3 },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Status"
        title="System Status"
        description="View overall system health and connectivity status"
      />

      <ModelStatusCard />

      {/* Multi-Machine Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allMachines.map((machine) => (
          <Card key={machine.id} className="bg-ink">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl font-normal tracking-[-0.02em]">{machine.name}</CardTitle>
                {machine.data && <StatusBadge status={machine.data.status} />}
              </div>
              <CardDescription className="font-mono text-xs">{machine.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div className="spec-row">
                  <span>Vibration</span>
                  <span>{machine.data?.vibration?.toFixed(1) || '--'}</span>
                </div>
                <div className="spec-row">
                  <span>Temperature</span>
                  <span>{machine.data?.temperature?.toFixed(1) || '--'}°C</span>
                </div>
                <div className="spec-row">
                  <span>AI Score</span>
                  <span>{machine.data?.score?.toFixed(3) || '--'}</span>
                </div>
                <div className="spec-row">
                  <span>Health</span>
                  <span className={`${
                    (machine.data?.health?.score ?? 0) >= 80 ? '!text-green-400' :
                    (machine.data?.health?.score ?? 0) >= 50 ? '!text-amber-400' : '!text-red-400'
                  }`}>
                    {machine.data?.health?.score?.toFixed(0) || '--'}%
                  </span>
                </div>
                <div className="pt-4">
                  <span className="text-xs text-slate-500">
                    {machine.data?.timestamp ? new Date(machine.data.timestamp).toLocaleTimeString() : 'No data'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            <div className="spec-row">
              <span>Total Machines</span>
              <span>{machines?.length || 2}</span>
            </div>
            <div className="spec-row">
              <span>Algorithm</span>
              <span>Isolation Forest + Random Forest</span>
            </div>
            <div className="spec-row sm:border-b-0">
              <span>Refresh Interval</span>
              <span>3 seconds</span>
            </div>
            <div className="spec-row">
              <span>Auto-Maintenance</span>
              <span className="!text-signal">✓ Enabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
