// Machine Health Score component with circular progress

'use client'

interface HealthScoreCardProps {
  score: number;
  status: string;
  daysUntilMaintenance: number;
  maintenanceUrgency: string;
}

export default function HealthScoreCard({
  score,
  status,
  daysUntilMaintenance,
  maintenanceUrgency
}: HealthScoreCardProps) {
  // Determine colors based on score
  const getColors = () => {
    if (score >= 80) return { text: 'text-white', ring: 'stroke-signal', bar: 'bg-signal' }
    if (score >= 60) return { text: 'text-white', ring: 'stroke-green-400', bar: 'bg-green-400' }
    if (score >= 40) return { text: 'text-amber-300', ring: 'stroke-amber-400', bar: 'bg-amber-400' }
    if (score >= 20) return { text: 'text-orange-400', ring: 'stroke-orange-500', bar: 'bg-orange-500' }
    return { text: 'text-red-400', ring: 'stroke-red-500', bar: 'bg-red-500' }
  }

  const colors = getColors()

  // Calculate circle progress
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  // Format maintenance text
  const getMaintenanceText = () => {
    if (maintenanceUrgency === 'immediate') {
      return '⚠️ Maintenance Required Now'
    }
    if (maintenanceUrgency === 'soon') {
      return `Maintenance in ${Math.ceil(daysUntilMaintenance)} day${Math.ceil(daysUntilMaintenance) !== 1 ? 's' : ''}`
    }
    return `Next service in ${Math.ceil(daysUntilMaintenance)} days`
  }

  return (
    <div className="h-full rounded-[10px] bg-ink p-5 ring-1 ring-white/[0.06] sm:p-6 lg:p-7">
      <h3 className="eyebrow mb-4 text-[13px] text-slate-400 sm:mb-6">Machine Health</h3>

      {/* Circular Progress */}
      <div className="relative mb-4 flex items-center justify-center sm:mb-6">
        <svg className="h-36 w-36 -rotate-90 transform sm:h-44 sm:w-44 lg:h-48 lg:w-48" viewBox="0 0 180 180">
          {/* Tick ring */}
          <circle cx="90" cy="90" r="86" stroke="currentColor" strokeWidth="1" strokeDasharray="1 5" fill="none" className="text-white/20" />
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-white/[0.07]"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className={`${colors.ring} transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-normal tracking-[-0.04em] sm:text-5xl ${colors.text}`}>{score}%</span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400">{status}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={`h-full ${colors.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Maintenance info */}
      <div className="text-center">
        <p className={`text-xs font-medium sm:text-sm ${maintenanceUrgency === 'immediate' ? 'text-red-400' : 'text-slate-300'}`}>
          {getMaintenanceText()}
        </p>
      </div>

      {/* Status indicators */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:mt-6">
        <div className="text-center">
          <div className={`mb-1.5 h-[3px] w-full rounded ${score >= 80 ? 'bg-signal' : 'bg-white/10'}`} />
          <span className="hidden text-slate-500 sm:inline">Excellent</span>
          <span className="text-slate-500 sm:hidden">Good</span>
        </div>
        <div className="text-center">
          <div className={`mb-1.5 h-[3px] w-full rounded ${score >= 40 && score < 80 ? 'bg-amber-400' : 'bg-white/10'}`} />
          <span className="text-slate-500">Fair</span>
        </div>
        <div className="text-center">
          <div className={`mb-1.5 h-[3px] w-full rounded ${score < 40 ? 'bg-red-500' : 'bg-white/10'}`} />
          <span className="hidden text-slate-500 sm:inline">Critical</span>
          <span className="text-slate-500 sm:hidden">Bad</span>
        </div>
      </div>
    </div>
  )
}
