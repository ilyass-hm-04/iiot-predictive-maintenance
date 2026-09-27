"use client"

import { useState } from 'react'
import useSWR from 'swr'
import PredictionPanel from '@/components/PredictionPanel'
import RULPrediction from '@/components/RULPrediction'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiUrl } from '@/lib/api-config'
import { PageHeader } from '@/components/design'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PredictionPage() {
  const [machineId, setMachineId] = useState<string>('MACHINE_002')
  const { data: machines } = useSWR<any[]>(apiUrl('/api/machines'), fetcher, { refreshInterval: 10000 })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Prediction"
        title="Future Prediction"
        description="Forecast equipment health and remaining useful life"
        actions={
          /* Machine Selector */
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <label className="whitespace-nowrap text-[13px] text-slate-400">Machine:</label>
            <Select value={machineId} onValueChange={setMachineId}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select Machine" />
              </SelectTrigger>
              <SelectContent>
                {(machines || [
                  { machine_id: 'MACHINE_002', name: 'Conveyor Belt' },
                  { machine_id: 'MACHINE_003', name: 'Industrial Motor' }
                ]).map((machine) => (
                  <SelectItem key={machine.machine_id} value={machine.machine_id}>
                    {machine.machine_id} - {machine.machine_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* RUL Prediction for Selected Machine */}
      <RULPrediction machineId={machineId} />

      {/* AI Prediction Panel */}
      <PredictionPanel equipmentId={machineId} />
    </div>
  )
}
