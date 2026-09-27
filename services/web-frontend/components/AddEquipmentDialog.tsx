'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Wifi, Database } from 'lucide-react'
import { mutate } from 'swr'
import { apiUrl } from '@/lib/api-config'

interface AddEquipmentDialogProps {
  onSuccess?: () => void
}

export default function AddEquipmentDialog({ onSuccess }: AddEquipmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'Motor',
    location: '',
    mqtt_topic: 'factory/plc/data',
    status: 'ONLINE'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(apiUrl('/api/equipment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error: ${error.detail || 'Failed to add equipment'}`)
        setLoading(false)
        return
      }

      const result = await response.json()
      
      // Show MQTT connection info
      alert(
        `✅ Equipment Added Successfully!\n\n` +
        `Equipment ID: ${result.equipment.id}\n` +
        `MQTT Broker: ${result.mqtt_info.broker}\n` +
        `Topic: ${result.mqtt_info.topic}\n\n` +
        `Configure your ESP32 to publish data to this topic.`
      )

      // Refresh equipment list
      mutate(apiUrl('/api/equipment'))
      
      // Reset form and close dialog
      setFormData({
        id: '',
        name: '',
        type: 'Motor',
        location: '',
        mqtt_topic: 'factory/plc/data',
        status: 'ONLINE'
      })
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      alert('Failed to add equipment. Check console for details.')
      console.error('Add equipment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cta" ctaIcon={<Plus className="w-4 h-4" />}>
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-signal text-neutral-950"><Wifi className="w-[18px] h-[18px]" /></span>
            Connect New Equipment (ESP32/PLC)
          </DialogTitle>
          <DialogDescription>
            Register equipment connected via ESP32 MQTT bridge. The system will automatically monitor data from the configured topic.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Equipment ID */}
          <div>
            <Label htmlFor="id" className="mb-2">
              Equipment ID <span className="text-red-400">*</span>
            </Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
              placeholder="e.g., PLC_001, ESP32_MOTOR_01"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Unique identifier for this equipment</p>
          </div>

          {/* Equipment Name */}
          <div>
            <Label htmlFor="name" className="mb-2">
              Equipment Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Assembly Line Robot, Cooling Fan"
              required
            />
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="mb-2">
                Type <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Motor">Motor</SelectItem>
                  <SelectItem value="Pump">Pump</SelectItem>
                  <SelectItem value="Conveyor">Conveyor</SelectItem>
                  <SelectItem value="Press">Press</SelectItem>
                  <SelectItem value="Robot">Robot</SelectItem>
                  <SelectItem value="Fan">Fan</SelectItem>
                  <SelectItem value="Compressor">Compressor</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="mb-2">
                Location <span className="text-red-400">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Line A, Building 2"
                required
              />
            </div>
          </div>

          {/* MQTT Topic */}
          <div>
            <Label htmlFor="mqtt_topic" className="mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              MQTT Topic <span className="text-red-400">*</span>
            </Label>
            <Input
              id="mqtt_topic"
              value={formData.mqtt_topic}
              onChange={(e) => setFormData({ ...formData, mqtt_topic: e.target.value })}
              placeholder="factory/plc/data"
              className="font-mono"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              ESP32 will publish sensor data to this topic
            </p>
          </div>

          {/* ESP32 Configuration Info */}
          <div className="rounded-[10px] bg-ink p-5 ring-1 ring-white/[0.06]">
            <h4 className="mb-3 text-[15px] font-medium text-white">📡 ESP32 Configuration</h4>
            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <p><span className="text-slate-500">Broker:</span> mqtt://mosquitto:1883</p>
              <p><span className="text-slate-500">Topic:</span> {formData.mqtt_topic}</p>
              <p><span className="text-slate-500">Data Format (JSON):</span></p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-graphite p-3 text-xs text-signal">
{`{
  "machine_id": "${formData.id || 'YOUR_ID'}",
  "equipment_name": "${formData.name || 'YOUR_NAME'}",
  "vibration": 45.2,
  "temperature": 62.5,
  "humidity": 55.0,
  "timestamp": 1701234567
}`}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="cta"
              ctaIcon={<Plus className="w-4 h-4" />}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  Add Equipment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
