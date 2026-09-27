"use client"

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import LiveChart from '@/components/LiveChart'
import HealthScoreCard from '@/components/HealthScoreCard'
import AlertTimeline from '@/components/AlertTimeline'
import ParetoChart from '@/components/ParetoChart'
import { Activity, AlertTriangle, Wrench } from 'lucide-react'
import type { LiveData, HistoricalData, Alert } from '@/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiUrl } from '@/lib/api-config'
import { PageHeader, LivePill } from '@/components/design'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AnomalyPage() {
  const [machineId, setMachineId] = useState<string>('MACHINE_002')
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [isCreating, setIsCreating] = useState(false)
  
  const { data: machines } = useSWR<any[]>(apiUrl('/api/machines'), fetcher, { refreshInterval: 10000 })
  const { data: liveData } = useSWR<LiveData>(
    apiUrl(`/api/live?machine_id=${machineId}`),
    fetcher,
    { refreshInterval: 1000 }
  )
  const { data: historyData } = useSWR<HistoricalData[]>(
    apiUrl(`/api/history?limit=50&machine_id=${machineId}`),
    fetcher,
    { refreshInterval: 5000 }
  )
  const { data: alertsData } = useSWR<Alert[]>(
    apiUrl('/api/alerts?limit=50'),
    fetcher,
    { refreshInterval: 15000 }
  )

  const handleTakeAction = () => {
    if (liveData && liveData.status === 'ANOMALY') {
      const anomalyId = `A-${new Date().toISOString().split('T')[0]}-001`
      const equipId = machineId
      
      // Pre-fill task form based on anomaly data
      setTaskTitle(`Investigate ${liveData.status} on ${equipId}`)
      setTaskDescription(`AI detected anomaly:\n- Vibration: ${liveData.vibration}\n- Temperature: ${liveData.temperature}\n- Health Score: ${liveData.health?.score}\n\nImmediate investigation required.`)
      setTaskDueDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // 3 days from now
      setTaskPriority(liveData.health?.score < 40 ? 'HIGH' : 'MEDIUM')
      setIsCreateTaskOpen(true)
    }
  }

  const handleCreateTask = async () => {
    setIsCreating(true)
    try {
      const anomalyId = `A-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      const equipId = machineId
      
      const aiCause = liveData ? 
        `Vibration: ${liveData.vibration}, Temperature: ${liveData.temperature}, Health Score: ${liveData.health?.score}. Status: ${liveData.status}` :
        'Anomaly detected by AI system'
      
      const response = await fetch(apiUrl('/api/maintenance/tasks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: equipId,
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          priority: taskPriority,
          anomalyId: anomalyId,
          aiDetectedCause: aiCause,
        }),
      })
      
      if (response.ok) {
        await mutate(apiUrl('/api/maintenance/tasks'))
        setIsCreateTaskOpen(false)
        // Reset form
        setTaskTitle('')
        setTaskDescription('')
        setTaskDueDate('')
        setTaskPriority('MEDIUM')
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const isAnomalyDetected = liveData && (liveData.status === 'ANOMALY' || liveData.status === 'WARNING')

  return (
    <div className="space-y-8">
      {/* Machine Selector & Action Button */}
      <PageHeader
        eyebrow="Anomaly"
        title="Anomaly Detection"
        description="AI-powered detection of equipment abnormalities"
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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
                      {machine.machine_id} - {machine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAnomalyDetected && (
              <Button
                onClick={handleTakeAction}
                variant="cta"
                ctaIcon={<Wrench className="w-4 h-4" />}
                className="w-full justify-between sm:w-auto"
              >
                <AlertTriangle className="w-4 h-4" />
                Take Action
              </Button>
            )}
          </div>
        }
      />

      {/* Alert Banner for Anomalies */}
      {isAnomalyDetected && (
        <div className="relative overflow-hidden rounded-[10px] bg-red-500/[0.08] p-6 ring-1 ring-red-500/30 sm:p-7" role="alert">
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-red-500" />
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <h3 className="text-2xl font-normal tracking-[-0.02em] text-white">Anomaly Detected!</h3>
              <p className="mt-1 text-slate-300">
                The AI system has detected abnormal behavior. Click "Take Action" to create a maintenance task.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
                <div>Health Score: <span className="font-medium text-white">{liveData.health?.score}%</span></div>
                <div>Status: <span className="font-medium text-red-400">{liveData.status}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pareto Analysis - Machine-Specific Anomaly Causes */}
      <ParetoChart
        machineId={machineId}
        type="anomalies"
        title={`Anomaly Root Causes - ${machineId}`}
        showCost={false}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {liveData?.health ? (
            <HealthScoreCard
              score={liveData.health.score}
              status={liveData.health.status}
              daysUntilMaintenance={liveData.health.days_until_maintenance}
              maintenanceUrgency={liveData.health.maintenance_urgency}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                  <Activity className="mx-auto mb-3 h-12 w-12 animate-pulse text-slate-700" />
                  <p className="text-slate-500">Loading health data...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-base sm:text-lg">AI Health Score Trend</CardTitle>
              <CardDescription>Last 50 readings</CardDescription>
            </div>
            <LivePill />
          </CardHeader>
          <CardContent className="h-64 min-h-64 sm:h-80">
            {historyData && historyData.length > 0 ? (
              <LiveChart data={historyData} />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">Waiting for data...</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Last 50 alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertTimeline alerts={alertsData || []} />
        </CardContent>
      </Card>

      {/* Create Maintenance Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Maintenance Task from Anomaly</DialogTitle>
            <DialogDescription>
              Create a maintenance task to address the detected anomaly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div>
              <label className="mb-2 block text-[13px] text-slate-400">
                Task Title
              </label>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title..."
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] text-slate-400">
                Description
              </label>
              <Textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter detailed description..."
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[13px] text-slate-400">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-slate-400">
                  Priority
                </label>
                <Select value={taskPriority} onValueChange={(v) => setTaskPriority(v as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {liveData && (
              <div className="rounded-[10px] bg-coal px-4 py-1 ring-1 ring-white/[0.06]">
                <h4 className="border-b border-white/[0.08] py-3 text-[13px] text-slate-400">Current Sensor Readings:</h4>
                <div className="grid grid-cols-1 text-sm sm:grid-cols-3 sm:gap-4">
                  <div className="spec-row sm:border-b-0">
                    <span className="text-slate-500">Vibration:</span>
                    <span className="text-white">{liveData.vibration}</span>
                  </div>
                  <div className="spec-row sm:border-b-0">
                    <span className="text-slate-500">Temperature:</span>
                    <span className="text-white">{liveData.temperature}°C</span>
                  </div>
                  <div className="spec-row">
                    <span className="text-slate-500">Health:</span>
                    <span className="text-white">{liveData.health?.score}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={isCreating || !taskTitle || !taskDescription || !taskDueDate}
              variant="cta"
            >
              {isCreating ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
