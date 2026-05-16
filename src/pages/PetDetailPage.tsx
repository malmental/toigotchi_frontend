import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useKawaiiColors } from '@/hooks/useKawaiiColors'
import { useStreamingChat } from '@/hooks/useStreamingChat'
import { usePetActionQuota } from '@/hooks/usePetActionQuota'
import { usePetDecayLog } from '@/hooks/usePetDecayLog'
import { DecayNotification } from '@/components/DecayNotification'
import type { Pet } from '@/types'
import { api } from '@/services/api'

const speciesEmojis: Record<string, string> = {
  blobcat: '🫧',
  foxkid: '🦊',
  draggle: '🐉',
}

const actionButtons = [
  { type: 'feed', label: 'Feed', emoji: '🍎' },
  { type: 'play', label: 'Play', emoji: '🎾' },
  { type: 'sleep', label: 'Sleep', emoji: '😴' },
  { type: 'clean', label: 'Clean', emoji: '🛁' },
  { type: 'heal', label: 'Heal', emoji: '💊' },
  { type: 'talk', label: 'Talk', emoji: '💬' },
]

interface StatBarProps {
  label: string
  value: number
  color: string
  emoji: string
  colors: ReturnType<typeof useKawaiiColors>
}

function StatBar({ label, value, color, emoji, colors }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, value))
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontWeight: 600,
        marginBottom: '6px',
        color: colors.softText,
      }}>
        <span>{emoji} {label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div style={{
        height: '12px',
        borderRadius: '10px',
        backgroundColor: colors.lavender,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: color,
          borderRadius: '10px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

interface KawaiiCardProps {
  children: React.ReactNode
  style?: object
  colors: ReturnType<typeof useKawaiiColors>
}

function KawaiiCard({ children, style, colors }: KawaiiCardProps) {
  return (
    <div style={{
      backgroundColor: colors.softWhite,
      borderRadius: '24px',
      border: `2px solid ${colors.softBorder}`,
      boxShadow: '0 8px 30px rgba(155, 143, 194, 0.15)',
      padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function PetDetailPage() {
  const colors = useKawaiiColors()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, loadPets } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatResponse, setChatResponse] = useState('')
  const [isChatStreaming, setIsChatStreaming] = useState(false)

  const onChunk = useCallback((chunk: string) => setChatResponse((prev) => prev + chunk), [])
  const onDone = useCallback(() => setIsChatStreaming(false), [])
  const onError = useCallback((error: string) => {
    console.error('Chat error:', error)
    setIsChatStreaming(false)
  }, [])

  const { sendMessage } = useStreamingChat({ onChunk, onDone, onError })

  const {
    isExhausted: isQuotaExhausted,
    remaining,
    resetsAt,
    refresh: refreshQuota,
  } = usePetActionQuota({
    petId: Number(id),
    token,
    enabled: !!token && !!id,
  })

  const {
    totalChanges,
    totalHoursAway,
  } = usePetDecayLog({
    petId: Number(id),
    token,
    enabled: !!token && !!id,
  })

  const [showDecayNotification, setShowDecayNotification] = useState(false)
  const [hasShownDecayNotification, setHasShownDecayNotification] = useState(false)

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 5000)
  }, [])

  useEffect(() => {
    if (isQuotaExhausted && resetsAt) {
      const minutes = Math.ceil((resetsAt.getTime() - Date.now()) / 60000)
      showToast(`✧ Actions paused. Wait ${minutes}min to continue`)
    }
  }, [isQuotaExhausted, resetsAt, showToast])

  useEffect(() => {
    if (!pet || totalHoursAway <= 0 || hasShownDecayNotification) return
    const timer = setTimeout(() => {
      setShowDecayNotification(true)
      setHasShownDecayNotification(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [pet, totalHoursAway, hasShownDecayNotification])

  useEffect(() => {
    if (!token) return
    api.setToken(token)
    api.getPet(Number(id))
      .then((res) => setPet(res.data))
      .catch(() => navigate('/'))
      .finally(() => setIsLoading(false))
  }, [token, id, navigate])

  const handleAction = async (actionType: string) => {
    if (!pet || !token || isActionLoading) return
    if (isQuotaExhausted) {
      const minutes = resetsAt ? Math.ceil((resetsAt.getTime() - Date.now()) / 60000) : 60
      showToast(`✧ Actions paused. Wait ${minutes}min`)
      return
    }
    const payload = actionType === 'feed' ? { food: 'apple' } : {}
    setIsActionLoading(true)
    try {
      const response = await api.performAction(pet.id, actionType, payload)
      setPet(response.pet)
      await loadPets()
      await refreshQuota()
    } catch (err: any) {
      console.error('Action failed:', err)
      if (err.quota?.resets_at) {
        showToast(`✧ Actions paused. Wait ${Math.ceil((new Date(err.quota.resets_at).getTime() - Date.now()) / 60000)}min`)
      }
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleChat = async () => {
    if (!pet || !token || !chatMessage.trim() || isChatStreaming) return
    const messageToSend = chatMessage.trim()
    setChatMessage('')
    setChatResponse('')
    setIsChatStreaming(true)
    await sendMessage(pet.id, messageToSend, token)
  }

  if (isLoading || !pet) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.softText,
        fontSize: '14px',
        backgroundColor: colors.background,
        backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.softBorder} 1px, transparent 0)`,
        backgroundSize: '28px 28px',
      }}>
        ✧ loading...
      </div>
    )
  }

  if (!pet.is_alive) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: colors.background,
        backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.softBorder} 1px, transparent 0)`,
        backgroundSize: '28px 28px',
      }}>
        <div style={{
          backgroundColor: colors.softWhite,
          borderRadius: '24px',
          border: `2px solid ${colors.softBorder}`,
          boxShadow: '0 12px 40px rgba(155, 143, 194, 0.2)',
          padding: '48px 32px',
          textAlign: 'center',
          maxWidth: '320px',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', filter: 'grayscale(100%)', opacity: 0.4 }}>💀</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '22px',
            fontWeight: 600,
            color: colors.softText,
            marginBottom: '8px',
          }}>
            {pet.name} has crossed the rainbow bridge
          </h2>
          <p style={{ color: colors.softText, opacity: 0.7, marginBottom: '24px', fontSize: '14px' }}>
            They lived a happy life filled with love ✧
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '14px 28px',
              backgroundColor: colors.lavenderDark,
              color: 'white',
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(155, 143, 194, 0.35)',
            }}
          >
            ✧ Back to Friends
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '24px',
      backgroundColor: colors.background,
      backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.softBorder} 1px, transparent 0)`,
      backgroundSize: '28px 28px',
    }}>
      <header style={{
        backgroundColor: colors.headerBg,
        borderBottom: `2px solid ${colors.softBorder}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(155, 143, 194, 0.1)',
      }}>
        <div style={{
          backgroundColor: colors.headerBar,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.lavenderDark,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            ← back
          </button>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: colors.lavenderDark,
          }}>
            ✧ {pet.name}
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main style={{
        padding: '24px 16px',
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div className="animate-fade-slide-in">
          <KawaiiCard colors={colors} style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              backgroundColor: colors.lavender,
              borderRadius: '50%',
              border: `3px solid ${colors.softBorder}`,
              boxShadow: '0 8px 25px rgba(155, 143, 194, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '52px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                width: '14px',
                height: '8px',
                backgroundColor: colors.pink,
                borderRadius: '50%',
                top: '45%',
                left: '18%',
                opacity: 0.6,
              }} />
              <div style={{
                position: 'absolute',
                width: '14px',
                height: '8px',
                backgroundColor: colors.pink,
                borderRadius: '50%',
                top: '45%',
                right: '18%',
                opacity: 0.6,
              }} />
              {speciesEmojis[pet.species]}
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '26px',
              fontWeight: 700,
              color: colors.softText,
              marginBottom: '8px',
            }}>
              {pet.name}
            </h2>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '16px',
              backgroundColor: colors.pinkLight,
              color: colors.lavenderDark,
            }}>
              ✧ {pet.mood}
            </span>
          </KawaiiCard>
        </div>

        <div className="animate-fade-slide-in animate-fade-slide-in-delay-1">
          <KawaiiCard colors={colors}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.softText,
              marginBottom: '16px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              ✧ Chat with {pet.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatResponse && (
                <div className="animate-fade-in" style={{
                  padding: '14px 16px',
                  backgroundColor: colors.lavender,
                  borderRadius: '16px',
                  border: `2px solid ${colors.softBorder}`,
                }}>
                  <div style={{ fontSize: '10px', color: colors.lavenderDark, marginBottom: '4px', fontWeight: 600 }}>
                    {pet.name} says:
                  </div>
                  <div style={{ color: colors.lavenderDark, whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: 1.5 }}>{chatResponse}</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isChatStreaming && handleChat()}
                  placeholder={`Say something to ${pet.name}...`}
                  disabled={isChatStreaming}
                  style={{
                    flex: 1,
                    height: '48px',
                    padding: '0 16px',
                    fontSize: '14px',
                    backgroundColor: colors.inputBg,
                    border: `2px solid ${colors.softBorder}`,
                    borderRadius: '16px',
                    outline: 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.lavenderDark}
                  onBlur={(e) => e.target.style.borderColor = colors.softBorder}
                />
                <button
                  onClick={handleChat}
                  disabled={isChatStreaming}
                  style={{
                    padding: '0 18px',
                    height: '48px',
                    backgroundColor: colors.lavenderDark,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '13px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    border: 'none',
                    borderRadius: '16px',
                    cursor: isChatStreaming ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(155, 143, 194, 0.3)',
                    opacity: isChatStreaming ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {isChatStreaming ? '...' : '✨'}
                </button>
              </div>
            </div>
          </KawaiiCard>
        </div>

        <div className="animate-fade-slide-in animate-fade-slide-in-delay-2">
          <KawaiiCard colors={colors}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: 600,
                color: colors.softText,
                margin: 0,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                ✧ Actions
              </h3>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: isQuotaExhausted ? '#D45656' : colors.lavenderDark,
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: isQuotaExhausted ? '#FFB5B5' : colors.pinkLight,
              }}>
                {isQuotaExhausted
                  ? `wait ${resetsAt ? Math.ceil((resetsAt.getTime() - Date.now()) / 60000) : '...'}min`
                  : `${remaining}/3 left`}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {actionButtons.map(({ type, label, emoji }) => (
                <button
                  key={type}
                  onClick={() => handleAction(type)}
                  disabled={isActionLoading || isQuotaExhausted}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '14px 8px',
                    backgroundColor: colors.inputBg,
                    border: `2px solid ${colors.softBorder}`,
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: colors.softText,
                    fontFamily: "'Space Grotesk', sans-serif",
                    cursor: isActionLoading || isQuotaExhausted ? 'not-allowed' : 'pointer',
                    opacity: (isActionLoading || isQuotaExhausted) ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActionLoading && !isQuotaExhausted) {
                      e.currentTarget.style.backgroundColor = colors.pinkLight
                      e.currentTarget.style.borderColor = colors.lavenderDark
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.inputBg
                    e.currentTarget.style.borderColor = colors.softBorder
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </KawaiiCard>
        </div>

        <div className="animate-fade-slide-in animate-fade-slide-in-delay-3">
          <KawaiiCard colors={colors}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.softText,
              marginBottom: '16px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              ✧ Status
            </h3>
            <StatBar label="Health" value={pet.health} color={colors.mint} emoji="💖" colors={colors} />
            <StatBar label="Energy" value={pet.energy} color={colors.pink} emoji="⚡" colors={colors} />
            <StatBar label="Hunger" value={pet.hunger} color={colors.lavenderDark} emoji="🍎" colors={colors} />
            <StatBar label="Clean" value={pet.cleanliness} color="#7EB87E" emoji="✨" colors={colors} />
          </KawaiiCard>
        </div>
      </main>

      {toastMessage && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.softWhite,
          color: colors.softText,
          padding: '12px 20px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: 600,
          zIndex: 1000,
          boxShadow: '0 8px 30px rgba(155, 143, 194, 0.3)',
          border: `2px solid ${colors.softBorder}`,
        }}>
          {toastMessage}
        </div>
      )}

      {showDecayNotification && pet && (
        <DecayNotification
          hoursAway={totalHoursAway}
          changes={totalChanges}
          petName={pet.name}
          onDismiss={() => setShowDecayNotification(false)}
        />
      )}
    </div>
  )
}