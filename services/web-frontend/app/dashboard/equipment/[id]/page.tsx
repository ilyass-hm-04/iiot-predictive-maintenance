"use client"

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import TelemetryCharts from '@/components/TelemetryCharts'
import TelemetryTable from '@/components/TelemetryTable'
import PredictionPanel from '@/components/PredictionPanel'
import HealthScoreCard from '@/components/HealthScoreCard'
import { apiUrl } from '@/lib/api-config'
import { PageHeader } from '@/components/design'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>()
  const equipmentId = params?.id as string

  const { data: historyData } = useSWR(
    apiUrl(`/api/history?limit=50&equipmentId=${encodeURIComponent(equipmentId)}`),
    fetcher,
    { refreshInterval: 10000 }
  )
  const { data: liveData } = useSWR(
    apiUrl(`/api/live?equipmentId=${encodeURIComponent(equipmentId)}`),
    fetcher,
    { refreshInterval: 1000 }
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Equipment"
        title={<>Equipment: <span className="font-mono text-[0.7em] tracking-normal text-slate-400">{equipmentId}</span></>}
        description="Per-equipment telemetry and predictions"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-1">
          {liveData?.health ? (
            <HealthScoreCard
              score={liveData.health.score}
              status={liveData.health.status}
              daysUntilMaintenance={liveData.health.days_until_maintenance}
              maintenanceUrgency={liveData.health.maintenance_urgency}
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center rounded-[10px] bg-graphite p-8">
              <p className="text-slate-500">Loading health...</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-3">
          {historyData && historyData.length > 0 ? (
            <TelemetryCharts data={historyData} />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-[10px] bg-graphite">
              <p className="text-slate-500">Waiting for telemetry...</p>
            </div>
          )}
        </div>
      </div>

      <PredictionPanel equipmentId={equipmentId as any} />

      <TelemetryTable data={historyData || []} />
    </div>
  )
}
