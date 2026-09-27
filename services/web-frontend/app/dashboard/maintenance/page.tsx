"use client"

import { useState, useCallback, useMemo } from 'react'
import useSWR, { mutate } from 'swr'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FileText, Download, User, Calendar as CalendarIcon } from 'lucide-react'
import ParetoChart from '@/components/ParetoChart'
import Link from 'next/link'
import { apiUrl } from '@/lib/api-config'
import { NotchCard, PageHeader } from '@/components/design'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

type Task = {
  id: string
  equipmentId: string
  title: string
  description: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE'
  assignedTo: string | null
  completedBy: string | null
  completionNotes: string | null
  completedAt: string | null
  anomalyId: string | null
  aiDetectedCause?: string | null
  createdAt: string
  urgency?: 'URGENT' | 'NOT_URGENT'
  importance?: 'IMPORTANT' | 'NOT_IMPORTANT'
  orderPriority?: number
  eisenhowerQuadrant?: string
  autoCreated?: boolean
  nextDueDate?: string | null
}

type CalendarEvent = Event & {
  task: Task
}

const upcomingTasks: Task[] = [
  {
    id: 'T-1001',
    equipmentId: 'PRESS_001',
    title: 'Lubrication & inspection',
    description: 'Regular scheduled maintenance for hydraulic press',
    dueDate: '2025-12-15',
    priority: 'MEDIUM',
    status: 'NOT_STARTED',
    assignedTo: null,
    completedBy: null,
    completionNotes: null,
    completedAt: null,
    anomalyId: null,
    aiDetectedCause: null,
    createdAt: '2025-12-01T10:00:00Z',
    nextDueDate: '2026-03-15'
  },
  {
    id: 'T-1002',
    equipmentId: 'CONV_014',
    title: 'Belt tension check',
    description: 'High vibration detected by AI system',
    dueDate: '2025-12-12',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTo: 'John Smith',
    completedBy: null,
    completionNotes: null,
    completedAt: null,
    anomalyId: 'A-2025-12-09-001',
    aiDetectedCause: 'Vibration levels exceeded normal range (85.3). Possible belt misalignment or bearing wear detected.',
    createdAt: '2025-12-09T08:30:00Z',
    nextDueDate: '2026-01-12'
  },
  {
    id: 'T-1003',
    equipmentId: 'MOTOR_207',
    title: 'Bearing replacement',
    description: 'Scheduled bearing replacement',
    dueDate: '2025-12-20',
    priority: 'LOW',
    status: 'NOT_STARTED',
    assignedTo: null,
    completedBy: null,
    completionNotes: null,
    completedAt: null,
    anomalyId: null,
    aiDetectedCause: null,
    createdAt: '2025-12-05T14:00:00Z',
    nextDueDate: '2027-12-20'
  },
]

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const variants = {
    LOW: 'bg-white/[0.04] text-slate-300 border-white/15',
    MEDIUM: 'bg-signal/10 text-signal border-signal/30',
    HIGH: 'bg-red-500/10 text-red-400 border-red-500/30',
  }
  return <Badge variant="outline" className={variants[priority]}>{priority}</Badge>
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const variants = {
    NOT_STARTED: 'bg-white/[0.04] text-slate-300 border-white/15',
    IN_PROGRESS: 'bg-signal/10 text-signal border-signal/30',
    DONE: 'bg-green-500/10 text-green-400 border-green-500/30',
  }
  return <Badge variant="outline" className={variants[status]}>{status.replace('_', ' ')}</Badge>
}

export default function MaintenancePage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [assignTo, setAssignTo] = useState<string>('')
  const [completionNotes, setCompletionNotes] = useState<string>('')

  // Create Task State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    equipmentId: '',
    priority: 'MEDIUM',
    dueDate: '',
    nextDueDate: '',
    assignedTo: ''
  })

  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const { data, error } = useSWR<Task[]>(
    apiUrl('/api/maintenance/tasks'),
    fetcher,
    { refreshInterval: 30000 }
  )
  const tasks = data && Array.isArray(data) ? data : upcomingTasks

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setAssignTo(task.assignedTo || '')
    setCompletionNotes(task.completionNotes || '')
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = async (status: Task['status']) => {
    if (!selectedTask) return

    setIsUpdating(true)
    try {
      const response = await fetch(apiUrl(`/api/maintenance/tasks/${selectedTask.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          assignedTo: assignTo || null,
          completionNotes: status === 'DONE' ? completionNotes : null,
          completedBy: status === 'DONE' ? (assignTo || 'Unknown') : null,
        }),
      })

      if (response.ok) {
        await mutate(apiUrl('/api/maintenance/tasks'))
        setIsDetailsOpen(false)
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedTask) return

    try {
      const response = await fetch(apiUrl(`/api/maintenance/report/${selectedTask.id}`))

      if (response.ok) {
        // Download the PDF
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `maintenance-report-${selectedTask.id}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        console.error('Failed to generate report:', response.statusText)
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
  }

  // Convert tasks to calendar events
  const events = useMemo<CalendarEvent[]>(() => {
    return tasks.map(task => ({
      task,
      title: `${task.equipmentId}: ${task.title}`,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      resource: task,
    }))
  }, [tasks])

  // Event style customization based on priority
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const colors = {
      HIGH: { backgroundColor: '#ef4444', borderColor: '#dc2626', color: '#ffffff' },
      MEDIUM: { backgroundColor: '#f7cf49', borderColor: '#efc22e', color: '#111111' },
      LOW: { backgroundColor: '#e5e5e5', borderColor: '#cfcfcf', color: '#111111' },
    }
    return {
      style: {
        ...colors[event.task.priority],
        borderRadius: '999px',
        border: 'none',
        display: 'block',
      },
    }
  }, [])

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    handleViewTask(event.task)
  }, [])

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    const defaultStart = new Date(start)
    const defaultNext = new Date(start)
    defaultNext.setDate(defaultNext.getDate() + 30)

    setNewTaskForm({
      title: '',
      description: '',
      equipmentId: '',
      priority: 'MEDIUM',
      dueDate: defaultStart.toISOString().split('T')[0],
      nextDueDate: defaultNext.toISOString().split('T')[0],
      assignedTo: ''
    })
    setIsCreateOpen(true)
  }, [])

  const handleCreateTask = async () => {
    if (!newTaskForm.title || !newTaskForm.equipmentId) {
      alert("Le titre et l'équipement sont obligatoires.")
      return
    }

    setIsCreating(true)
    try {
      const postRes = await fetch(apiUrl('/api/maintenance/tasks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: newTaskForm.equipmentId,
          title: newTaskForm.title,
          description: newTaskForm.description,
          dueDate: newTaskForm.dueDate,
          nextDueDate: newTaskForm.nextDueDate || null,
          priority: newTaskForm.priority,
        }),
      })

      if (postRes.ok) {
        const createdTask = await postRes.json()
        if (newTaskForm.assignedTo) {
          await fetch(apiUrl(`/api/maintenance/tasks/${createdTask.id}`), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedTo: newTaskForm.assignedTo }),
          })
        }
        await mutate(apiUrl('/api/maintenance/tasks'))
        setIsCreateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <PageHeader
        eyebrow="Maintenance"
        title="Maintenance Planning"
        description="Schedule and track maintenance tasks"
      />
      <Card>
        <CardContent>
          <Tabs defaultValue="calendar" className="w-full">
            <div className="overflow-x-auto pb-2 mb-4">
              <TabsList className="inline-flex w-auto min-w-full gap-1 sm:min-w-[440px]">
                <TabsTrigger value="calendar" className="whitespace-nowrap px-3 sm:px-4">Calendar</TabsTrigger>
                <TabsTrigger value="list" className="whitespace-nowrap px-3 sm:px-4">List</TabsTrigger>
                <TabsTrigger value="matrix" className="whitespace-nowrap px-3 sm:px-4">Matrix</TabsTrigger>
                <TabsTrigger value="analytics" className="whitespace-nowrap px-3 sm:px-4">Analytics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calendar">
              <div className="h-[600px] sm:h-[700px] bg-coal rounded-[10px] p-2 sm:p-4 ring-1 ring-white/[0.06] overflow-x-auto">
                <div className="min-w-[600px] h-full">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable={true}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day', 'agenda']}
                    defaultView="month"
                  />
                </div>
                <style jsx global>{`
                  .rbc-calendar {
                    color: #e4e4e4;
                    font-family: inherit;
                  }
                  .rbc-header {
                    padding: 12px 3px;
                    font-weight: 400;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #7a7a7a;
                    background: #131313;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                  }
                  .rbc-header + .rbc-header,
                  .rbc-day-bg + .rbc-day-bg,
                  .rbc-month-row + .rbc-month-row,
                  .rbc-time-content > * + * > *,
                  .rbc-timeslot-group,
                  .rbc-time-header-content,
                  .rbc-agenda-view table.rbc-agenda-table,
                  .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td,
                  .rbc-agenda-view table.rbc-agenda-table tbody > tr + tr {
                    border-color: rgba(255, 255, 255, 0.06);
                  }
                  .rbc-month-view, .rbc-time-view, .rbc-agenda-view table.rbc-agenda-table {
                    background: #131313;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                    overflow: hidden;
                  }
                  .rbc-day-bg {
                    background: #161616;
                  }
                  .rbc-today {
                    background: rgba(247, 207, 73, 0.07);
                  }
                  .rbc-off-range-bg {
                    background: #111111;
                  }
                  .rbc-date-cell {
                    padding: 8px;
                    color: #cfcfcf;
                  }
                  .rbc-off-range {
                    color: #555555;
                  }
                  .rbc-current {
                    color: #f7cf49;
                  }
                  .rbc-event {
                    padding: 2px 8px;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    cursor: pointer;
                  }
                  .rbc-event:focus {
                    outline: 2px solid #f7cf49;
                    outline-offset: 1px;
                  }
                  .rbc-toolbar {
                    padding: 6px 0 14px;
                    margin-bottom: 6px;
                    gap: 0.5rem;
                  }
                  .rbc-toolbar button {
                    color: #cfcfcf;
                    background: #0b0b0b;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 7px 14px;
                    border-radius: 999px;
                    font-weight: 500;
                    font-size: 0.8125rem;
                    transition: background 0.2s, color 0.2s;
                  }
                  .rbc-btn-group button + button {
                    margin-left: 4px;
                  }
                  .rbc-btn-group > button:first-child:not(:last-child),
                  .rbc-btn-group > button:last-child:not(:first-child),
                  .rbc-btn-group > button:not(:first-child):not(:last-child) {
                    border-radius: 999px;
                  }
                  .rbc-toolbar button:hover,
                  .rbc-toolbar button:focus {
                    background: #242424;
                    color: #ffffff;
                  }
                  .rbc-toolbar button.rbc-active,
                  .rbc-toolbar button.rbc-active:hover {
                    background: #ffffff;
                    color: #111111;
                    border-color: #ffffff;
                    box-shadow: none;
                  }
                  .rbc-toolbar-label {
                    color: #ffffff;
                    font-weight: 400;
                    font-size: 1.375rem;
                    letter-spacing: -0.02em;
                  }
                  .rbc-show-more {
                    background: transparent;
                    color: #f7cf49;
                  }
                  .rbc-time-slot, .rbc-label {
                    color: #7a7a7a;
                  }
                  .rbc-current-time-indicator {
                    background-color: #f7cf49;
                  }
                  @media (max-width: 640px) {
                    .rbc-toolbar {
                      flex-direction: column;
                      gap: 0.5rem;
                      align-items: stretch;
                    }
                    .rbc-toolbar-label {
                      margin: 0.5rem 0;
                      text-align: center;
                      order: -1;
                    }
                    .rbc-btn-group {
                      display: flex;
                      justify-content: center;
                      flex-wrap: wrap;
                      gap: 0.25rem;
                    }
                    .rbc-btn-group button {
                      padding: 8px 12px;
                      font-size: 0.75rem;
                    }
                  }
                `}</style>
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-[700px] px-2 sm:px-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-[0.08em] text-slate-500">
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Task</th>
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Equipment</th>
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Due Date</th>
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Next Date</th>
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Priority</th>
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Status</th>
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Assigned</th>
                        <th className="text-left px-3 py-4 font-normal whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(t => (
                        <tr key={t.id} className="border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-white/[0.03]">
                          <td className="px-3 py-3.5 text-white font-medium whitespace-nowrap">{t.title}</td>
                          <td className="px-3 py-3.5 text-slate-300 whitespace-nowrap">{t.equipmentId}</td>
                          <td className="px-3 py-3.5 text-slate-300 whitespace-nowrap">{t.dueDate}</td>
                          <td className="px-3 py-3.5 text-slate-300 whitespace-nowrap">{t.nextDueDate || '-'}</td>
                          <td className="px-3 py-3.5"><PriorityBadge priority={t.priority} /></td>
                          <td className="px-3 py-3.5"><StatusBadge status={t.status} /></td>
                          <td className="px-3 py-3.5 text-slate-300 whitespace-nowrap">
                            {t.assignedTo || <span className="text-slate-500">Unassigned</span>}
                          </td>
                          <td className="px-3 py-3.5">
                            <Button
                              onClick={() => handleViewTask(t)}
                              variant="light"
                              size="sm"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {error && (
                    <p className="text-xs text-slate-500 mt-2">Showing sample tasks (API unavailable).</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="matrix">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DO FIRST - Urgent & Important (Quadrant 1) */}
                <div className="relative overflow-hidden rounded-[10px] bg-coal p-5 ring-1 ring-white/[0.06]">
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-red-500" />
                  <h3 className="text-white text-[15px] font-medium tracking-[-0.01em] mb-4 flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    DO FIRST (Urgent & Important)
                  </h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(t => t.eisenhowerQuadrant === 'DO_FIRST' || (!t.eisenhowerQuadrant && t.priority === 'HIGH'))
                      .sort((a, b) => (a.orderPriority || 1) - (b.orderPriority || 1))
                      .map(t => (
                        <div
                          key={t.id}
                          className="p-3.5 bg-graphite ring-1 ring-white/[0.06] rounded-lg cursor-pointer hover:bg-[#232323] hover:ring-white/15 transition-all duration-300"
                          onClick={() => handleViewTask(t)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-white text-sm">{t.title}</span>
                            <StatusBadge status={t.status} />
                          </div>
                          <div className="text-xs text-slate-400">{t.equipmentId}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-300">A faire:</span> {t.dueDate}
                            {t.nextDueDate && <span className="ml-2"><span className="font-medium text-slate-300">A refaire:</span> {t.nextDueDate}</span>}
                          </div>
                          {t.autoCreated && (
                            <div className="text-xs text-signal mt-1">⚡ Auto-created</div>
                          )}
                        </div>
                      ))}
                    {tasks.filter(t => t.eisenhowerQuadrant === 'DO_FIRST' || (!t.eisenhowerQuadrant && t.priority === 'HIGH')).length === 0 && (
                      <p className="text-slate-500 text-sm italic">No urgent & important tasks</p>
                    )}
                  </div>
                </div>

                {/* SCHEDULE - Not Urgent & Important (Quadrant 2) */}
                <div className="relative overflow-hidden rounded-[10px] bg-coal p-5 ring-1 ring-white/[0.06]">
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-signal" />
                  <h3 className="text-white text-[15px] font-medium tracking-[-0.01em] mb-4 flex items-center gap-2">
                    <span className="text-base">📅</span>
                    SCHEDULE (Not Urgent & Important)
                  </h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(t => t.eisenhowerQuadrant === 'SCHEDULE' || (!t.eisenhowerQuadrant && t.priority === 'MEDIUM'))
                      .sort((a, b) => (a.orderPriority || 2) - (b.orderPriority || 2))
                      .map(t => (
                        <div
                          key={t.id}
                          className="p-3.5 bg-graphite ring-1 ring-white/[0.06] rounded-lg cursor-pointer hover:bg-[#232323] hover:ring-white/15 transition-all duration-300"
                          onClick={() => handleViewTask(t)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-white text-sm">{t.title}</span>
                            <StatusBadge status={t.status} />
                          </div>
                          <div className="text-xs text-slate-400">{t.equipmentId}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-300">A faire:</span> {t.dueDate}
                            {t.nextDueDate && <span className="ml-2"><span className="font-medium text-slate-300">A refaire:</span> {t.nextDueDate}</span>}
                          </div>
                          {t.autoCreated && (
                            <div className="text-xs text-signal mt-1">⚡ Auto-created</div>
                          )}
                        </div>
                      ))}
                    {tasks.filter(t => t.eisenhowerQuadrant === 'SCHEDULE' || (!t.eisenhowerQuadrant && t.priority === 'MEDIUM')).length === 0 && (
                      <p className="text-slate-500 text-sm italic">No scheduled tasks</p>
                    )}
                  </div>
                </div>

                {/* DELEGATE - Urgent & Not Important (Quadrant 3) */}
                <div className="relative overflow-hidden rounded-[10px] bg-coal p-5 ring-1 ring-white/[0.06]">
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-white" />
                  <h3 className="text-white text-[15px] font-medium tracking-[-0.01em] mb-4 flex items-center gap-2">
                    <span className="text-base">👥</span>
                    DELEGATE (Urgent & Not Important)
                  </h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(t => t.eisenhowerQuadrant === 'DELEGATE')
                      .sort((a, b) => (a.orderPriority || 3) - (b.orderPriority || 3))
                      .map(t => (
                        <div
                          key={t.id}
                          className="p-3.5 bg-graphite ring-1 ring-white/[0.06] rounded-lg cursor-pointer hover:bg-[#232323] hover:ring-white/15 transition-all duration-300"
                          onClick={() => handleViewTask(t)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-white text-sm">{t.title}</span>
                            <StatusBadge status={t.status} />
                          </div>
                          <div className="text-xs text-slate-400">{t.equipmentId}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-300">A faire:</span> {t.dueDate}
                            {t.nextDueDate && <span className="ml-2"><span className="font-medium text-slate-300">A refaire:</span> {t.nextDueDate}</span>}
                          </div>
                          {t.autoCreated && (
                            <div className="text-xs text-signal mt-1">⚡ Auto-created</div>
                          )}
                        </div>
                      ))}
                    {tasks.filter(t => t.eisenhowerQuadrant === 'DELEGATE').length === 0 && (
                      <p className="text-slate-500 text-sm italic">No tasks to delegate</p>
                    )}
                  </div>
                </div>

                {/* ELIMINATE - Not Urgent & Not Important (Quadrant 4) */}
                <div className="relative overflow-hidden rounded-[10px] bg-coal p-5 ring-1 ring-white/[0.06]">
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-slate-500" />
                  <h3 className="text-slate-300 text-[15px] font-medium tracking-[-0.01em] mb-4 flex items-center gap-2">
                    <span className="text-base">🗑️</span>
                    ELIMINATE (Not Urgent & Not Important)
                  </h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(t => t.eisenhowerQuadrant === 'ELIMINATE' || (!t.eisenhowerQuadrant && t.priority === 'LOW'))
                      .sort((a, b) => (a.orderPriority || 4) - (b.orderPriority || 4))
                      .map(t => (
                        <div
                          key={t.id}
                          className="p-3.5 bg-graphite ring-1 ring-white/[0.06] rounded-lg cursor-pointer hover:bg-[#232323] hover:ring-white/15 transition-all duration-300"
                          onClick={() => handleViewTask(t)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-white text-sm">{t.title}</span>
                            <StatusBadge status={t.status} />
                          </div>
                          <div className="text-xs text-slate-400">{t.equipmentId}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-300">A faire:</span> {t.dueDate}
                            {t.nextDueDate && <span className="ml-2"><span className="font-medium text-slate-300">A refaire:</span> {t.nextDueDate}</span>}
                          </div>
                          {t.autoCreated && (
                            <div className="text-xs text-signal mt-1">⚡ Auto-created</div>
                          )}
                        </div>
                      ))}
                    {tasks.filter(t => t.eisenhowerQuadrant === 'ELIMINATE' || (!t.eisenhowerQuadrant && t.priority === 'LOW')).length === 0 && (
                      <p className="text-slate-500 text-sm italic">No low priority tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab with Pareto Chart */}
            <TabsContent value="analytics">
              <div className="space-y-6">
                <ParetoChart
                  type="maintenance"
                  title="Maintenance Task Distribution"
                  showCost={true}
                />

                <Card className="bg-coal">
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Analysis Summary</CardTitle>
                    <CardDescription>
                      Estimated costs based on historical maintenance patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-slate-300 space-y-2">
                      <p>• Each maintenance task is estimated at $500 baseline cost</p>
                      <p>• High vibration and bearing issues typically require specialist intervention</p>
                      <p>• Temperature-related problems may indicate cooling system failures</p>
                      <p>• Preventive maintenance is 3-5x more cost-effective than reactive repairs</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedTask.title}
                  <StatusBadge status={selectedTask.status} />
                </DialogTitle>
                <DialogDescription>
                  Task ID: {selectedTask.id} • Equipment: {selectedTask.equipmentId}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Task Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-normal text-slate-400">Priority</label>
                    <div className="mt-1"><PriorityBadge priority={selectedTask.priority} /></div>
                  </div>
                  <div>
                    <label className="text-[13px] font-normal text-slate-400 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Date à faire (Due)
                    </label>
                    <div className="mt-1 text-white">{selectedTask.dueDate}</div>
                  </div>
                  <div>
                    <label className="text-[13px] font-normal text-slate-400 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 text-emerald-500" />
                      Date pour la refaire (Next)
                    </label>
                    <div className="mt-1 text-emerald-400 font-medium">{selectedTask.nextDueDate || 'Non définie'}</div>
                  </div>
                </div>

                {/* Eisenhower Matrix Classification */}
                {selectedTask.eisenhowerQuadrant && (
                  <div className="p-4 bg-coal ring-1 ring-white/[0.06] rounded-[10px]">
                    <label className="text-[13px] font-normal text-slate-400 block mb-2">
                      Eisenhower Matrix Classification
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-slate-500">Quadrant</span>
                        <div className="mt-1 font-medium text-white">{selectedTask.eisenhowerQuadrant}</div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Urgency</span>
                        <div className="mt-1">
                          <Badge variant="outline" className={
                            selectedTask.urgency === 'URGENT'
                              ? 'bg-red-500/10 text-red-400 border-red-500/30'
                              : 'bg-white/[0.04] text-slate-300 border-white/15'
                          }>
                            {selectedTask.urgency || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Importance</span>
                        <div className="mt-1">
                          <Badge variant="outline" className={
                            selectedTask.importance === 'IMPORTANT'
                              ? 'bg-signal/10 text-signal border-signal/30'
                              : 'bg-white/[0.04] text-slate-400 border-white/15'
                          }>
                            {selectedTask.importance || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {selectedTask.autoCreated && (
                      <div className="mt-2 text-xs text-signal flex items-center gap-1">
                        <span>⚡</span> Auto-created from AI anomaly detection
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="text-[13px] font-normal text-slate-400">Description</label>
                  <p className="mt-1 text-white">{selectedTask.description}</p>
                </div>

                {/* AI Detected Cause */}
                {selectedTask.aiDetectedCause && (
                  <div className="p-4 bg-signal/[0.08] ring-1 ring-signal/30 rounded-[10px]">
                    <label className="text-sm font-medium text-signal flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      AI Detected Cause
                    </label>
                    <p className="mt-2 text-white text-sm">{selectedTask.aiDetectedCause}</p>
                    {selectedTask.anomalyId && (
                      <p className="mt-1 text-xs text-slate-400">Anomaly ID: {selectedTask.anomalyId}</p>
                    )}
                  </div>
                )}

                {/* Assignment */}
                <div>
                  <label className="text-[13px] font-normal text-slate-400 flex items-center gap-1 mb-2">
                    <User className="w-4 h-4" />
                    Assign To
                  </label>
                  <Select value={assignTo} onValueChange={setAssignTo}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                      <SelectItem value="David Brown">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Completion Notes (for DONE status) */}
                {selectedTask.status === 'DONE' || selectedTask.completionNotes ? (
                  <div>
                    <label className="text-[13px] font-normal text-slate-400 mb-2 block">
                      Completion Notes
                    </label>
                    {selectedTask.status === 'DONE' && !selectedTask.completionNotes ? (
                      <Textarea
                        value={completionNotes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCompletionNotes(e.target.value)}
                        placeholder="Enter notes about the maintenance performed..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-white text-sm p-3 bg-coal rounded-lg ring-1 ring-white/[0.06]">
                        {selectedTask.completionNotes}
                      </p>
                    )}
                    {selectedTask.completedBy && (
                      <p className="mt-2 text-xs text-slate-400">
                        Completed by: {selectedTask.completedBy} on {selectedTask.completedAt}
                      </p>
                    )}
                  </div>
                ) : selectedTask.status === 'IN_PROGRESS' ? (
                  <div>
                    <label className="text-[13px] font-normal text-slate-400 mb-2 block">
                      Completion Notes (optional)
                    </label>
                    <Textarea
                      value={completionNotes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCompletionNotes(e.target.value)}
                      placeholder="Add notes about work in progress..."
                      className="min-h-[100px]"
                    />
                  </div>
                ) : null}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {/* Status Update Buttons */}
                <div className="flex gap-2 flex-1">
                  {selectedTask.status === 'NOT_STARTED' && (
                    <Button
                      onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      disabled={isUpdating || !assignTo}
                      variant="cta"
                    >
                      Start Task
                    </Button>
                  )}
                  {selectedTask.status === 'IN_PROGRESS' && (
                    <Button
                      onClick={() => handleUpdateStatus('DONE')}
                      disabled={isUpdating || !assignTo}
                      variant="cta-light"
                    >
                      Mark Complete
                    </Button>
                  )}
                  {selectedTask.status === 'DONE' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                      Task Completed
                    </Badge>
                  )}
                </div>

                {/* Report Generation */}
                <Button
                  onClick={handleGenerateReport}
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Creation Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une Tâche de Maintenance</DialogTitle>
            <DialogDescription>
              Planifiez une nouvelle intervention manuellement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la tâche</Label>
                <Input
                  id="title"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Remplacement du filtre"
                 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipement</Label>
                <Select value={newTaskForm.equipmentId} onValueChange={(val) => setNewTaskForm(prev => ({ ...prev, equipmentId: val }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESS_001">PRESS_001</SelectItem>
                    <SelectItem value="CONV_014">CONV_014</SelectItem>
                    <SelectItem value="MOTOR_207">MOTOR_207</SelectItem>
                    <SelectItem value="MACHINE_002">MACHINE_002</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date à faire</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTaskForm.dueDate}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextDueDate">A refaire le</Label>
                <Input
                  id="nextDueDate"
                  type="date"
                  value={newTaskForm.nextDueDate}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, nextDueDate: e.target.value }))}
                 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={newTaskForm.priority} onValueChange={(val) => setNewTaskForm(prev => ({ ...prev, priority: val }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Basse (LOW)</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne (MEDIUM)</SelectItem>
                    <SelectItem value="HIGH">Haute (HIGH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigner au technicien (Optionnel)</Label>
              <Select value={newTaskForm.assignedTo} onValueChange={(val) => setNewTaskForm(prev => ({ ...prev, assignedTo: val }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Non assigné" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                  <SelectItem value="David Brown">David Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={newTaskForm.description}
                onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Détails de l'intervention..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTask} disabled={isCreating} variant="cta">
              {isCreating ? "Création..." : "Créer la tâche"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NotchCard tab="quote" className="rounded-[6px] px-6 pb-16 pt-16 sm:px-12">
        <div>
          <h2 className="text-2xl font-normal tracking-[-0.02em]">Planning Notes</h2>
          <p className="mt-1 text-sm text-neutral-800/80">Guidelines for scheduling maintenance</p>
        </div>
        <div className="mt-6">
          <ul className="list-disc list-inside space-y-2 text-[15px] font-medium leading-relaxed text-neutral-900 marker:text-neutral-900/50">
            <li>Prioritize HIGH tasks within 72 hours.</li>
            <li>Group tasks by equipment to minimize downtime.</li>
            <li>Verify parts availability before scheduling replacements.</li>
            <li>Record outcomes and update the next maintenance cycle.</li>
            <li>Review AI-detected causes to improve predictive models.</li>
          </ul>
        </div>
      </NotchCard>
    </div>
  )
}
