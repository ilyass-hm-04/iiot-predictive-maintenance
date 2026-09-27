'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react'
import { apiUrl } from '@/lib/api-config'

interface ParetoData {
  factor: string
  count: number
  percentage: number
  cumulative: number
  cost_estimate?: number
}

interface ParetoChartProps {
  machineId?: string
  type?: 'anomalies' | 'maintenance'
  title?: string
  showCost?: boolean
}

export default function ParetoChart({ 
  machineId, 
  type = 'anomalies',
  title,
  showCost = false 
}: ParetoChartProps) {
  const [data, setData] = useState<ParetoData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<string>('30')
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let url = apiUrl(`/api/pareto/${type}?days=${timeframe}`)
        if (machineId && type === 'anomalies') {
          url += `&machine_id=${machineId}`
        }
        
        const response = await fetch(url)
        if (response.ok) {
          const paretoData = await response.json()
          setData(paretoData)
        }
      } catch (error) {
        console.error('Failed to fetch Pareto data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [machineId, type, timeframe])

  const maxCount = Math.max(...data.map(d => d.count), 1)
  const defaultTitle = type === 'anomalies' 
    ? `Anomaly Cause Analysis${machineId ? ` - ${machineId}` : ''}`
    : 'Maintenance Task Distribution'
  
  const totalCost = data.reduce((sum, d) => sum + (d.cost_estimate || 0), 0)

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl font-normal tracking-[-0.02em] sm:text-2xl">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06]"><BarChart3 className="w-[18px] h-[18px] text-slate-300" /></span>
              <span className="break-words">{title || defaultTitle}</span>
            </CardTitle>
            <CardDescription className="mt-2 text-xs sm:text-sm sm:pl-[52px]">
              Pareto Analysis: 80% of issues come from 20% of causes
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-[13px] text-slate-400">Timeframe:</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger size="sm" className="w-[132px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7" className="text-xs">Last 7 days</SelectItem>
                <SelectItem value="30" className="text-xs">Last 30 days</SelectItem>
                <SelectItem value="90" className="text-xs">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-signal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            No data available for the selected timeframe
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cost Summary for Maintenance */}
            {showCost && totalCost > 0 && (
              <div className="flex items-center gap-3 rounded-[10px] bg-white p-4 text-neutral-950">
                <span className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-white"><DollarSign className="w-[18px] h-[18px]" /></span>
                <div>
                  <p className="text-[13px] text-neutral-500">Total Estimated Cost</p>
                  <p className="text-2xl font-normal tracking-[-0.02em]">${totalCost.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[600px] relative h-80 flex items-end justify-between gap-2 border-b border-l border-r border-white/15 p-4 bg-coal dot-grid-light mx-12">
                {/* 80% Reference Line - Horizontal */}
                <div className="absolute left-0 right-0 border-t border-dashed border-red-400/70 pointer-events-none" 
                     style={{ bottom: 'calc(80% + 1rem)' }}>
                  <span className="absolute -right-2 -top-3 rounded-full bg-red-500 px-1.5 text-[10px] font-medium text-white">80%</span>
                </div>

                {data.map((item, idx) => {
                  const barHeight = (item.count / maxCount) * 100
                  const linePoint = item.cumulative
                  const isVital = item.cumulative <= 80 // Part of the "vital 20%"
                  
                  return (
                    <div key={idx} className="flex-1 relative group">
                      {/* Bar */}
                      <div className="relative h-full flex flex-col justify-end items-center">
                        {/* Percentage label on top */}
                        <div className="absolute -top-8 text-xs font-semibold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.percentage}%
                        </div>
                        
                        {/* Count label */}
                        <div className="absolute -top-14 rounded-full bg-white px-2 text-xs font-medium text-neutral-950 opacity-0 transition-opacity group-hover:opacity-100">
                          {item.count}
                        </div>

                        {/* Bar - Color coded: Red for vital 20%, Blue for trivial 80% */}
                        <div
                          className={`w-full rounded-t-[4px] transition-all duration-300 cursor-pointer ${
                            isVital 
                              ? 'bg-red-500 hover:bg-red-400' 
                              : 'bg-white/20 hover:bg-white/35'
                          }`}
                          style={{ height: `${barHeight}%` }}
                          title={`${item.factor}: ${item.count} occurrences (${item.percentage}%)${item.cost_estimate ? `\nCost: $${item.cost_estimate.toLocaleString()}` : ''}\nCumulative: ${item.cumulative}%`}
                        />
                        
                        {/* Cumulative percentage point */}
                        <div className="absolute -right-1 w-3 h-3 bg-signal rounded-full border-2 border-coal" 
                             style={{ bottom: `${linePoint}%` }}
                             title={`Cumulative: ${item.cumulative}%`} 
                        />
                      </div>
                    </div>
                  )
                })}
                
                {/* Cumulative curve (accent line) */}
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                  <polyline
                    points={data.map((item, idx) => {
                      const x = ((idx + 0.5) / data.length) * 100
                      const y = 100 - item.cumulative
                      return `${x}%,${y}%`
                    }).join(' ')}
                    fill="none"
                    stroke="#f7cf49"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Left Y-axis labels (Bar counts) */}
                <div className="absolute -left-12 inset-y-0 flex flex-col justify-between text-xs text-slate-500 pr-2">
                  <span className="text-right">{maxCount}</span>
                  <span className="text-right">{Math.round(maxCount * 0.75)}</span>
                  <span className="text-right">{Math.round(maxCount * 0.5)}</span>
                  <span className="text-right">{Math.round(maxCount * 0.25)}</span>
                  <span className="text-right">0</span>
                </div>

                {/* Right Y-axis labels (Cumulative %) */}
                <div className="absolute -right-12 inset-y-0 flex flex-col justify-between text-xs text-signal pl-2">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
              </div>
            </div>

            {/* Legend with Color-Coded Categories */}
            <div>
              {data.map((item, idx) => {
                const isVital = item.cumulative <= 80
                return (
                  <div key={idx} className="flex flex-col gap-2 border-b border-white/[0.08] py-3 text-sm last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isVital ? 'bg-red-500' : 'bg-white/30'}`} />
                      <span className="text-white font-medium">{item.factor}</span>
                      {isVital && (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-red-400">
                          VITAL 20%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm pl-5 sm:pl-0">
                      <span className="text-slate-400">{item.count} occurrences</span>
                      <span className="text-slate-400">({item.percentage}%)</span>
                      {item.cost_estimate && (
                        <span className="text-white font-medium">${item.cost_estimate.toLocaleString()}</span>
                      )}
                      <span className="text-signal font-medium flex items-center gap-1">
                        <span className="text-xs text-slate-500">Σ</span>{item.cumulative}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pareto Principle Explanation - Enhanced */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 80/20 Rule Summary */}
              <div className="rounded-[10px] bg-coal p-5 ring-1 ring-red-500/25">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[15px] font-medium text-white mb-1">
                      Pareto Principle (80/20 Rule)
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-red-400">
                        {data.filter(d => d.cumulative <= 80).length} cause{data.filter(d => d.cumulative <= 80).length !== 1 ? 's' : ''}
                      </span>
                      {' '}(~{Math.round((data.filter(d => d.cumulative <= 80).length / data.length) * 100)}% of causes) generate{' '}
                      <span className="font-semibold text-red-400">~80%</span> of all {type === 'anomalies' ? 'anomalies' : 'maintenance issues'}.
                    </p>
                    <p className="text-xs text-slate-500 mt-2 italic">
                      → These are the <strong>"vital few"</strong> that require immediate attention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="rounded-[10px] bg-coal p-5 ring-1 ring-white/[0.08]">
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-5 h-5 text-signal mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[15px] font-medium text-white mb-1">
                      Recommended Action
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Prioritize resources on the <span className="text-red-400 font-semibold">red bars</span> (vital causes) for maximum efficiency.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      <span className="font-semibold">Impact:</span> Solving these {data.filter(d => d.cumulative <= 80).length} root causes will eliminate 80% of problems with minimal effort.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Legend Key */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-slate-400">Vital Few (≤80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/30 rounded-full" />
                <span className="text-slate-400">Trivial Many ({'>'}80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-signal" />
                <span className="text-slate-400">Cumulative %</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 border-t border-dashed border-red-400" />
                <span className="text-slate-400">80% Threshold</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
