// Charts for raw telemetry: vibration and temperature


'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import type { HistoricalData } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface TelemetryChartsProps {
  data: HistoricalData[]
}

export default function TelemetryCharts({ data }: TelemetryChartsProps) {
  const chartData = data.map(p => ({
    time: format(new Date(p.timestamp), 'HH:mm:ss'),
    vibration: p.vibration,
    temperature: p.temperature,
    humidity: (p as any).humidity ?? null
  }))
  return (
    <Tabs defaultValue="vibration" className="w-full">
      <TabsList className="mb-4 max-w-full overflow-x-auto">
        <TabsTrigger value="vibration">Vibration</TabsTrigger>
        <TabsTrigger value="temperature">Temperature</TabsTrigger>
        <TabsTrigger value="humidity">Humidity</TabsTrigger>
      </TabsList>

      <TabsContent value="vibration">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-normal tracking-[-0.02em]">Vibration Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f7cf49" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#f7cf49" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.12)" tick={{ fill: '#7a7a7a', fontSize: 11 }} tickLine={false} minTickGap={24} />
                <YAxis stroke="rgba(255,255,255,0.12)" tick={{ fill: '#7a7a7a', fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: 'Vibration', angle: -90, position: 'insideLeft', fill: '#7a7a7a', fontSize: 11 }} />
                <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.25)', strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '10px', color: '#111111', boxShadow: '0 20px 50px -20px rgba(0,0,0,.8)' }} labelStyle={{ color: '#7a7a7a' }} itemStyle={{ color: '#111111' }} />
                <Area type="monotone" dataKey="vibration" stroke="#f7cf49" strokeWidth={2} isAnimationActive={false} fillOpacity={1} fill="url(#vibGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="temperature">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-normal tracking-[-0.02em]">Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25}/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.12)" tick={{ fill: '#7a7a7a', fontSize: 11 }} tickLine={false} minTickGap={24} />
                <YAxis stroke="rgba(255,255,255,0.12)" tick={{ fill: '#7a7a7a', fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#7a7a7a', fontSize: 11 }} />
                <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.25)', strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '10px', color: '#111111', boxShadow: '0 20px 50px -20px rgba(0,0,0,.8)' }} labelStyle={{ color: '#7a7a7a' }} itemStyle={{ color: '#111111' }} />
                <Area type="monotone" dataKey="temperature" stroke="#ffffff" strokeWidth={2} isAnimationActive={false} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="humidity">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-normal tracking-[-0.02em]">Humidity Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9a9a9a" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#9a9a9a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.12)" tick={{ fill: '#7a7a7a', fontSize: 11 }} tickLine={false} minTickGap={24} />
                <YAxis stroke="rgba(255,255,255,0.12)" tick={{ fill: '#7a7a7a', fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft', fill: '#7a7a7a', fontSize: 11 }} />
                <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.25)', strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '10px', color: '#111111', boxShadow: '0 20px 50px -20px rgba(0,0,0,.8)' }} labelStyle={{ color: '#7a7a7a' }} itemStyle={{ color: '#111111' }} />
                <Area type="monotone" dataKey="humidity" stroke="#cfcfcf" strokeWidth={2} isAnimationActive={false} fillOpacity={1} fill="url(#humGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
