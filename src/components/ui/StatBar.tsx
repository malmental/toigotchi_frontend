interface StatBarProps {
  label: string
  value: number
  max?: number
  color?: 'health' | 'energy' | 'hunger' | 'cleanliness'
}

export function StatBar({
  label,
  value,
  max = 100,
  color = 'health',
}: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    health: {
      bg: 'bg-danger/20',
      fill: 'bg-danger',
      low: percentage < 30,
    },
    energy: {
      bg: 'bg-warning/20',
      fill: 'bg-warning',
      low: percentage < 30,
    },
    hunger: {
      bg: 'bg-warning/20',
      fill: 'bg-warning',
      low: percentage > 70,
    },
    cleanliness: {
      bg: 'bg-primary/20',
      fill: 'bg-primary',
      low: percentage < 30,
    },
  }

  const colorScheme = colors[color]

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span
          className={`font-medium ${
            colorScheme.low ? 'text-danger' : 'text-text-primary'
          }`}
        >
          {Math.round(value)}/{max}
        </span>
      </div>
      <div className={`h-2 rounded-full ${colorScheme.bg}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            colorScheme.fill
          } ${colorScheme.low ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
