"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar } from 'lucide-react'
import useSWR from 'swr'
import { apiUrl } from '@/lib/api-config'
import { NotchCard, PageHeader } from '@/components/design'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Report = {
  id: string
  title: string
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
  date: string
  size: string
  status: 'READY' | 'GENERATING' | 'FAILED'
}

function StatusBadge({ status }: { status: Report['status'] }) {
  const variants = {
    READY: 'bg-green-500/10 text-green-400 border-green-500/30',
    GENERATING: 'bg-signal/10 text-signal border-signal/30',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/30',
  }
  return <Badge variant="outline" className={variants[status]}>{status}</Badge>
}

export default function ReportsPage() {
  const { data: reports = [], isLoading: reportsLoading } = useSWR<Report[]>(apiUrl('/api/reports'), fetcher, {
    refreshInterval: 30000,
  })
  const { data: compliance } = useSWR<any>(apiUrl('/api/compliance'), fetcher, {
    refreshInterval: 30000,
  })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reports"
        title="Reports & Analytics"
        description="Download compliance and production reports"
        actions={
          <Button variant="cta" className="w-full justify-between sm:w-auto">
            Generate Report
          </Button>
        }
      />

      <Card className="py-2">
        <CardContent className="px-2 sm:px-4">
          {reportsLoading ? (
            <div className="py-8 text-center text-slate-400">Loading reports...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.08em] text-slate-500">
                    <th className="px-3 py-4 text-left font-normal">Report</th>
                    <th className="px-3 py-4 text-left font-normal">Type</th>
                    <th className="px-3 py-4 text-left font-normal">Date</th>
                    <th className="px-3 py-4 text-left font-normal">Size</th>
                    <th className="px-3 py-4 text-left font-normal">Status</th>
                    <th className="px-3 py-4 text-left font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report: Report) => (
                    <tr key={report.id} className="border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-white/[0.03]">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br from-[#2c2c2c] to-[#141414] ring-1 ring-white/[0.06]">
                            <FileText className="size-3.5 text-slate-400" />
                          </span>
                          <span className="font-medium text-white">{report.title}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-slate-400">{report.type}</td>
                      <td className="px-3 py-4 tabular-nums text-slate-400">{report.date}</td>
                      <td className="px-3 py-4 tabular-nums text-slate-400">{report.size}</td>
                      <td className="px-3 py-4"><StatusBadge status={report.status} /></td>
                      <td className="px-3 py-4">
                        {report.status === 'READY' ? (
                          <Button variant="light" size="sm" className="flex items-center gap-1.5">
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
        <NotchCard tab="left" className="rounded-[6px] p-6 sm:p-7">
          <div className="text-[17px] font-medium">Compliance</div>
          <div className="text-sm text-neutral-800/80">ISO 9001 & Industry 4.0</div>
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-black/10 py-3 text-sm">
              <span className="text-neutral-800/80">Last Audit</span>
              <span className="font-medium">{compliance?.lastAudit || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/10 py-3 text-sm">
              <span className="text-neutral-800/80">Next Review</span>
              <span className="font-medium">{compliance?.nextReview || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between pt-3 text-sm">
              <span className="text-neutral-800/80">Compliance Score</span>
              <span className="text-2xl font-normal tracking-[-0.02em]">{compliance?.complianceScore || 0}%</span>
            </div>
          </div>
        </NotchCard>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Upcoming Reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex items-center gap-4 border-b border-white/[0.08] pb-4 text-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                  <Calendar className="size-4 text-slate-400" />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] text-white">Daily Report</p>
                  <p className="text-xs text-slate-500">Generates at 23:59 daily</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 text-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                  <Calendar className="size-4 text-slate-400" />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] text-white">Weekly Summary</p>
                  <p className="text-xs text-slate-500">Every Sunday at 23:59</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
