"use client"

import useSWR from 'swr'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AddEquipmentDialog from '@/components/AddEquipmentDialog'
import { apiUrl } from '@/lib/api-config'
import { PageHeader } from '@/components/design'

type Equipment = {
  id: string
  name: string
  type: string
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
  location?: string
}

const sampleEquipment: Equipment[] = [
  { id: 'MACHINE_002', name: 'Conveyor Belt', type: 'Conveyor', status: 'ONLINE', location: 'Line A' },
  { id: 'MACHINE_003', name: 'Industrial Motor', type: 'Motor', status: 'ONLINE', location: 'Line B' },
]

function StatusBadge({ status }: { status: Equipment['status'] }) {
  const map = {
    ONLINE: 'success',
    OFFLINE: 'destructive',
    MAINTENANCE: 'warning',
  } as const
  const label = status === 'ONLINE' ? 'Online' : status === 'OFFLINE' ? 'Offline' : 'Maintenance'
  const dot = status === 'ONLINE' ? 'bg-green-400' : status === 'OFFLINE' ? 'bg-red-400' : 'bg-signal'
  return (
    <Badge variant="outline" data-tone={map[status]} className="gap-1.5 text-slate-300">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </Badge>
  )
}

export default function EquipmentPage() {
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const { data, error } = useSWR<Equipment[]>(
    apiUrl('/api/equipment'),
    fetcher,
    { refreshInterval: 15000 }
  )
  const equipment = data && Array.isArray(data) ? data : sampleEquipment

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Equipment"
        title="Equipment"
        description="Registered assets and current status"
        actions={<AddEquipmentDialog onSuccess={() => {}} />}
      />

      <Card className="py-2">
        <CardContent className="px-2 sm:px-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-3 py-4 text-left font-normal">ID</th>
                  <th className="px-3 py-4 text-left font-normal">Name</th>
                  <th className="px-3 py-4 text-left font-normal">Type</th>
                  <th className="px-3 py-4 text-left font-normal">Location</th>
                  <th className="px-3 py-4 text-left font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map(eq => (
                  <tr key={eq.id} className="group border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-white/[0.03]">
                    <td className="px-3 py-4 font-medium text-white">
                      <a href={`/dashboard/equipment/${encodeURIComponent(eq.id)}`} className="inline-flex items-center gap-1.5 font-mono text-[13px] underline-offset-4 hover:text-signal hover:underline">
                        {eq.id}
                        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </td>
                    <td className="px-3 py-4 text-slate-200">{eq.name}</td>
                    <td className="px-3 py-4 text-slate-400">{eq.type}</td>
                    <td className="px-3 py-4 text-slate-400">{eq.location || '-'}</td>
                    <td className="px-3 py-4"><StatusBadge status={eq.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && (
              <p className="mt-2 px-3 pb-3 text-xs text-slate-500">Showing sample data (API unavailable).</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
