import { useEffect, useRef, useState } from 'react'

const colors = {
  pink: '#FFB6C1',
  lavender: '#E6E6FA',
  lavenderDark: '#9B8FC2',
  mint: '#98FB98',
  cream: '#FDF6E3',
  softWhite: '#FFFFFF',
  softText: '#6B5B7A',
  errorPink: '#FFB5B5',
  errorRed: '#D45656',
}

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
      setTimeout(onDismiss, 400)
    }, 12000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [onDismiss])

  const handleDismiss = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
    setTimeout(onDismiss, 400)
  }

  const changeItems = [
    formatChange(changes.hunger, '🍖 Hunger'),
    formatChange(changes.energy, '⚡ Energy'),
    formatChange(changes.cleanliness, '🛁 Clean'),
    formatChange(changes.health, '💗 Health'),
  ].filter(Boolean)

  if (!visible) return null

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: colors.softWhite,
        color: colors.softText,
        padding: '0',
        borderRadius: '24px',
        fontSize: '13px',
        fontWeight: 500,
        zIndex: 1000,
        boxShadow: '0 12px 40px rgba(155, 143, 194, 0.35)',
        border: `3px solid ${colors.lavender}`,
        maxWidth: '340px',
        width: '90%',
        overflow: 'hidden',
      }}
    >
      {/* Header Banner */}
      <div style={{
        backgroundColor: colors.lavender,
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🌸</span>
          <div>
            <div style={{
              fontSize: '10px',
              color: colors.lavenderDark,
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}>
              Welcome Back!
            </div>
            <div style={{
              fontSize: '15px',
              color: colors.softText,
              fontWeight: 600,
            }}>
              {petName} missed you!
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            backgroundColor: colors.cream,
            border: `2px solid ${colors.lavender}`,
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.softText,
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.2s',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Time Away */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: changeItems.length > 0 ? '14px' : 0,
          color: colors.softText,
          fontSize: '13px',
        }}>
          <span style={{ opacity: 0.6 }}>🕐</span>
          <span>You were away for <strong>{formatTime(hoursAway)}</strong></span>
        </div>

        {/* Stats Lost */}
        {changeItems.length > 0 && (
          <div style={{
            backgroundColor: colors.cream,
            borderRadius: '16px',
            padding: '12px 14px',
          }}>
            <div style={{
              color: colors.errorRed,
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>📉</span> Stats decreased
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {changeItems.map((item, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: colors.softWhite,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.errorRed,
                    border: `1px solid ${colors.errorPink}`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        <div style={{
          marginTop: '14px',
          textAlign: 'center',
          fontSize: '12px',
          color: colors.lavenderDark,
          fontWeight: 600,
        }}>
          ✧ take good care of {petName}! ✧
        </div>
      </div>
    </div>
  )
}