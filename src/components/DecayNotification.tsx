import { useEffect, useRef, useState } from 'react'

interface DecayNotificationProps {
  hoursAway: number
  changes: {
    hunger: number
    energy: number
    cleanliness: number
    health: number
  }
  petName: string
  onDismiss: () => void
}

function formatTime(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes}min`
  }
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

function formatChange(value: number, label: string): string {
  if (value === 0) return null
  const sign = value > 0 ? '+' : ''
  return `${label} ${sign}${value}`
}

export function DecayNotification({ hoursAway, changes, petName, onDismiss }: DecayNotificationProps) {
  const [visible, setVisible] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 5000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [onDismiss])

  const handleDismiss = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  const changeItems = [
    formatChange(changes.hunger, 'Hunger'),
    formatChange(changes.energy, 'Energy'),
    formatChange(changes.cleanliness, 'Cleanliness'),
    formatChange(changes.health, 'Health'),
  ].filter(Boolean)

  if (!visible) return null

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1b1c19',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        zIndex: 1000,
        boxShadow: '4px 4px 0px 0px #645495',
        border: '3px solid #1b1c19',
        maxWidth: '320px',
        width: '90%',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
      }}>
        <div>
          <div style={{
            fontSize: '10px',
            color: '#c8b6ff',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}>
            Welcome Back
          </div>
          <div style={{
            fontSize: '14px',
            color: '#ffffff',
          }}>
            {petName} missed you!
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Time Away */}
      <div style={{
        fontSize: '11px',
        color: '#c0c0c0',
        marginBottom: '8px',
      }}>
        You were away for {formatTime(hoursAway)}
      </div>

      {/* Stats Lost */}
      {changeItems.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '8px',
          fontSize: '11px',
        }}>
          <div style={{ color: '#ffdad6', marginBottom: '4px' }}>Stats decreased:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {changeItems.map((item, i) => (
              <span key={i} style={{ color: '#ffdad6' }}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}