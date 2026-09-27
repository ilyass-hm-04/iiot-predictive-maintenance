// Real-time AI score chart using Recharts

'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import { format } from 'date-fns'
import type { HistoricalData } from '@/types'

interface LiveChartProps {
  data: HistoricalData[];
}

export default function LiveChart({ data }: LiveChartProps) {
  // Format data for Recharts
  const chartData = data.map(point => ({
    time: format(new Date(point.timestamp), 'HH:mm:ss'),
    // Convert to an easy-to-understand percentage (0-100)
    score: Math.max(0, Math.min(100, Math.round((point.score || 0) * 100))),
    status: point.status
  }))

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const status = data[payload[0].dataKeyIndex || 0]?.status || ''
      return (
        <div className="rounded-[10px] bg-white px-3 py-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,.8)]">
          <div className="text-[11px] text-neutral-500">{label}</div>
          <div className="text-sm font-medium text-neutral-950">AI Health: {value}%</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 44, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7cf49" stopOpacity={0.35}/>
              <stop offset="100%" stopColor="#f7cf49" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.12)"
            tick={{ fill: '#7a7a7a', fontSize: 11 }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.12)"
            tick={{ fill: '#7a7a7a', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            label={{ value: 'AI Health (%)', angle: -90, position: 'insideLeft', fill: '#7a7a7a', fontSize: 11 }}
          />
          <Tooltip content={renderTooltip} cursor={{ stroke: 'rgba(255,255,255,0.25)', strokeDasharray: '3 3' }} />
          <Legend wrapperStyle={{ color: '#9a9a9a', fontSize: 12 }} />
          {/* Threshold bands */}
          <ReferenceLine y={10} label={{ value: 'Anomaly', position: 'right', fill: '#f87171', fontSize: 11 }} stroke="#ef4444" strokeOpacity={0.7} strokeDasharray="4 4" />
          <ReferenceLine y={30} label={{ value: 'Warning', position: 'right', fill: '#fbbf24', fontSize: 11 }} stroke="#fbbf24" strokeOpacity={0.6} strokeDasharray="4 4" />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#f7cf49" 
            strokeWidth={2}
            isAnimationActive={false}
            fillOpacity={1} 
            fill="url(#scoreGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
