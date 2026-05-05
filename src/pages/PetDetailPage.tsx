import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useStreamingChat } from '@/hooks/useStreamingChat'
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

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '3px solid #1b1c19',
  boxShadow: '4px 4px 0px 0px #1b1c19',
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const percentage = Math.min(100, Math.max(0, value))
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: '4px',
        color: '#1b1c19',
      }}>
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div style={{
        height: '16px',
        border: '2px solid #1b1c19',
        backgroundColor: '#e4e2dd',
        padding: '2px',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: color,
          transition: 'width 0.5s',
        }} />
      </div>
    </div>
  )
}

export function PetDetailPage() {
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
    setIsActionLoading(true)
    try {
      const response = await api.performAction(pet.id, actionType)
      setPet(response.pet)
      await loadPets()
    } catch (err) {
      console.error('Action failed:', err)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleChat = async () => {
    if (!pet || !token || !chatMessage.trim() || isChatStreaming) return
    setChatResponse('')
    setIsChatStreaming(true)
    await sendMessage(pet.id, token)
  }

  if (isLoading || !pet) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#48454f',
      }}>
        Loading...
      </div>
    )
  }

  if (!pet.is_alive) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ ...cardStyle, padding: '48px', textAlign: 'center', maxWidth: '320px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', filter: 'grayscale(100%)', opacity: 0.5 }}>💀</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '24px',
            fontWeight: 600,
            color: '#1b1c19',
            marginBottom: '8px',
          }}>
            {pet.name} has passed away
          </h2>
          <p style={{ color: '#48454f', marginBottom: '24px' }}>
            Your companion lived a happy life.
          </p>
          <button
            onClick={() => navigate('/')}
            className="y2k-button"
            style={{
              padding: '12px 24px',
              backgroundColor: '#645495',
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              border: '3px solid #1b1c19',
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '24px' }}>
      <header style={{
        backgroundColor: '#C0C0C0',
        borderBottom: '2px solid #000',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          backgroundColor: '#645495',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #000',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            ← Back
          </button>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
          }}>
            {pet.name}.exe
          </h1>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      <main style={{ padding: '24px 16px', maxWidth: '448px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ ...cardStyle, padding: '32px', textAlign: 'center' }}>
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: '#f5f3ee',
            border: '3px solid #1b1c19',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
          }}>
            {speciesEmojis[pet.species]}
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#1b1c19',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}>
            {pet.name}
          </h2>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#48454f',
            letterSpacing: '0.1em',
          }}>
            {pet.mood}
          </span>
        </div>

        <div style={{ ...cardStyle, padding: '24px' }}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#48454f',
            marginBottom: '16px',
          }}>
            System Status
          </h3>
          <StatBar label="Health" value={pet.health} color="#b2c97c" />
          <StatBar label="Energy" value={pet.energy} color="#735476" />
          <StatBar label="Hunger" value={pet.hunger} color="#645495" />
          <StatBar label="Cleanliness" value={pet.cleanliness} color="#526524" />
        </div>

        <div style={{ ...cardStyle, padding: '24px' }}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#48454f',
            marginBottom: '16px',
          }}>
            Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {actionButtons.map(({ type, label, emoji }) => (
              <button
                key={type}
                onClick={() => handleAction(type)}
                disabled={isActionLoading}
                className="y2k-button"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 8px',
                  backgroundColor: '#f5f3ee',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#1b1c19',
                  cursor: isActionLoading ? 'not-allowed' : 'pointer',
                  opacity: isActionLoading ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: '24px' }}>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, padding: '24px' }}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#48454f',
            marginBottom: '16px',
          }}>
            Chat Protocol
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatResponse && (
              <div style={{ padding: '16px', backgroundColor: '#f5f3ee', border: '2px solid #1b1c19' }}>
                <div style={{ fontSize: '10px', color: '#48454f', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {pet.name}://
                </div>
                <div style={{ color: '#1b1c19', whiteSpace: 'pre-wrap' }}>{chatResponse}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isChatStreaming && handleChat()}
                placeholder={`Talk to ${pet.name}...`}
                disabled={isChatStreaming}
                className="y2k-input"
                style={{
                  flex: 1,
                  height: '48px',
                  padding: '0 16px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleChat}
                disabled={isChatStreaming}
                className="y2k-button"
                style={{
                  padding: '0 16px',
                  height: '48px',
                  backgroundColor: '#645495',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: '3px solid #1b1c19',
                  cursor: isChatStreaming ? 'not-allowed' : 'pointer',
                  opacity: isChatStreaming ? 0.5 : 1,
                }}
              >
                {isChatStreaming ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
