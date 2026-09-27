"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import useSWR from 'swr'
import { apiUrl } from '@/lib/api-config'
import { NotchCard, PageHeader } from '@/components/design'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Shift = {
  id: string
  name: string
  startTime: string
  endTime: string
  operator: string
  status: 'ACTIVE' | 'COMPLETED' | 'SCHEDULED'
  productionCount: number
  downtime: number
  efficiency: number
}

function StatusIcon({ status }: { status: Shift['status'] }) {
  if (status === 'ACTIVE') return <CheckCircle className="w-4 h-4 text-green-400" />
  if (status === 'COMPLETED') return <XCircle className="w-4 h-4 text-slate-500" />
  return <Clock className="w-4 h-4 text-signal" />
}

export default function ShiftManagementPage() {
  const { data: shifts = [], isLoading } = useSWR<Shift[]>(apiUrl('/api/shifts'), fetcher, {
    refreshInterval: 10000,
  })
  const { data: oeeData } = useSWR<any>(apiUrl('/api/production/oee'), fetcher, {
    refreshInterval: 10000,
  })

  // Get current shift metrics
  const activeShift = shifts.find(s => s.status === 'ACTIVE')
  const productionCount = activeShift?.productionCount || 0
  const downtime = activeShift?.downtime || 0
  const efficiency = oeeData?.oee || (activeShift?.efficiency || 0)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Shifts"
        title="Shift Management"
        description="Current and scheduled shifts with operator assignments"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
        <NotchCard tab="left" className="flex h-52 flex-col justify-between rounded-[6px] p-6">
          <div className="text-[15px] font-medium">Production Count</div>
          <div>
            <div className="text-5xl font-normal tracking-[-0.03em]">{productionCount.toLocaleString()}</div>
            <p className="mt-1 text-sm text-neutral-800/80">units this shift</p>
          </div>
        </NotchCard>

        <Card className="h-44 justify-between">
          <CardHeader>
            <CardTitle className="text-[15px] text-slate-400">Downtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-normal tracking-[-0.03em] text-white">{downtime} <span className="text-2xl text-slate-500">min</span></div>
            <p className="mt-1 text-sm text-slate-500">total this shift</p>
          </CardContent>
        </Card>

        <Card className="h-44 justify-between">
          <CardHeader>
            <CardTitle className="text-[15px] text-slate-400">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-normal tracking-[-0.03em] text-white">{efficiency.toFixed(1)}<span className="text-2xl text-slate-500">%</span></div>
            <p className="mt-1 text-sm text-slate-500">OEE score</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-slate-400">Loading shifts...</div>
          ) : (
            <div>
              {shifts.map(shift => (
                <div key={shift.id} className="flex flex-col justify-between gap-4 border-b border-white/[0.08] py-5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-5">
                    <div className="flex w-16 shrink-0 flex-col items-center text-center">
                      <span className="text-lg font-normal tabular-nums text-white">{shift.startTime}</span>
                      <span className="text-xs tabular-nums text-slate-500">{shift.endTime}</span>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-[17px] font-medium text-white">
                        <StatusIcon status={shift.status} />
                        {shift.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-500">Operator</p>
                      <p className="text-sm text-white">{shift.operator}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={shift.status === 'ACTIVE' ? 'border-transparent bg-white text-neutral-950' : 'text-slate-300'}
                    >
                      {shift.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
