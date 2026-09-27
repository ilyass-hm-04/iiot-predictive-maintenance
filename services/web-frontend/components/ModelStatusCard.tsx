"use client"

import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, BrainCircuit, Zap } from "lucide-react"
import { apiUrl } from '@/lib/api-config'

type ModelsStatus = {
  anomaly_detection_model: {
    available: boolean
    path: string
    type: string
    purpose: string
  }
  predictive_model: {
    available: boolean
    path: string
    type: string
    purpose: string
  }
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ModelStatusCard() {
  const { data, error } = useSWR<ModelsStatus>(apiUrl('/models/status'), fetcher, { refreshInterval: 15000 })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-normal tracking-[-0.02em]">
          <span className="flex size-10 items-center justify-center rounded-full bg-signal text-neutral-950"><BrainCircuit className="w-[18px] h-[18px]" /></span>
          Model Status
        </CardTitle>
        <CardDescription className="sm:pl-[52px]">Availability of anomaly and predictive models</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">API Unreachable</Badge>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2 rounded-[10px] bg-coal p-4 ring-1 ring-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-white flex items-center gap-2 text-[15px]">
                <Activity className="w-4 h-4 text-slate-400" />
                Anomaly Detection
              </span>
              <Badge variant={data?.anomaly_detection_model.available ? "default" : "outline"}>
                {data?.anomaly_detection_model.available ? "Available" : "Missing"}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-500 truncate">{data?.anomaly_detection_model.type}</p>
            <p className="text-xs font-mono text-slate-500 truncate">{data?.anomaly_detection_model.path}</p>
          </div>

          <div className="space-y-2 rounded-[10px] bg-coal p-4 ring-1 ring-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-white flex items-center gap-2 text-[15px]">
                <Zap className="w-4 h-4 text-slate-400" />
                Predictive (MTTF)
              </span>
              <Badge variant={data?.predictive_model.available ? "default" : "outline"}>
                {data?.predictive_model.available ? "Available" : "Missing"}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-500 truncate">{data?.predictive_model.type}</p>
            <p className="text-xs font-mono text-slate-500 truncate">{data?.predictive_model.path}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
