import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useKawaiiColors } from '@/hooks/useKawaiiColors'
import type { Pet } from '@/types'

const speciesEmojis: Record<string, string> = {
  blobcat: '🫧',
  foxkid: '🦊',
  draggle: '🐉',
}

const moodColors: Record<string, { bg: string; text: string }> = {
  happy: { bg: '#C8E8B8', text: '#4A6B4A' },
  angry: { bg: '#FFB5B5', text: '#8B4A4A' },
  tired: { bg: '#FFE8C5', text: '#8B6B4A' },
  dirty: { bg: '#F0D5F0', text: '#7B5B7B' },
  neutral: { bg: '#E8E0F0', text: '#6B5B7A' },
}

interface PetCardProps {
  pet: Pet
  colors: ReturnType<typeof useKawaiiColors>
}

function PetCard({ pet, colors }: PetCardProps) {
  const mood = moodColors[pet.mood] || moodColors.neutral
  const moodBg = colors.inputBg
  const moodText = colors.softText

  return (
    <Link
      to={`/pets/${pet.id}`}
      style={{
        display: 'block',
        backgroundColor: colors.cardBg,
        padding: '20px',
        borderRadius: '20px',
        border: `2px solid ${colors.softBorder}`,
        boxShadow: '0 6px 20px rgba(155, 143, 194, 0.15)',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLAnchorElement
        target.style.transform = 'translateY(-4px)'
        target.style.boxShadow = '0 12px 30px rgba(155, 143, 194, 0.25)'
        target.style.borderColor = colors.lavenderDark
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLAnchorElement
        target.style.transform = 'none'
        target.style.boxShadow = '0 6px 20px rgba(155, 143, 194, 0.15)'
        target.style.borderColor = colors.softBorder
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          backgroundColor: colors.lavenderDark,
          borderRadius: '50%',
          border: `2px solid ${colors.softBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
        }}>
          {speciesEmojis[pet.species]}
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: colors.softText,
            marginBottom: '4px',
          }}>
            {pet.name}
          </h3>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: moodBg,
            color: moodText,
            textTransform: 'capitalize',
          }}>
            ✧ {pet.mood}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            fontWeight: 600,
            marginBottom: '6px',
            color: colors.softText,
          }}>
            <span>🍎 Hunger</span>
            <span>{pet.hunger}%</span>
          </div>
          <div style={{
            height: '10px',
            borderRadius: '8px',
            backgroundColor: colors.softBorder,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pet.hunger}%`,
              backgroundColor: colors.lavenderDark,
              borderRadius: '8px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            fontWeight: 600,
            marginBottom: '6px',
            color: colors.softText,
          }}>
            <span>⚡ Energy</span>
            <span>{pet.energy}%</span>
          </div>
          <div style={{
            height: '10px',
            borderRadius: '8px',
            backgroundColor: colors.softBorder,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pet.energy}%`,
              backgroundColor: colors.pink,
              borderRadius: '8px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>
    </Link>
  )
}

interface EmptyStateProps {
  colors: ReturnType<typeof useKawaiiColors>
}

function EmptyState({ colors }: EmptyStateProps) {
  return (
    <div style={{
      backgroundColor: colors.cardBg,
      padding: '48px 24px',
      borderRadius: '24px',
      border: `2px solid ${colors.softBorder}`,
      boxShadow: '0 8px 30px rgba(155, 143, 194, 0.15)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🐾</div>
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '24px',
        fontWeight: 600,
        color: colors.softText,
        marginBottom: '8px',
      }}>
        No friends yet
      </h3>
      <p style={{
        fontSize: '14px',
        color: colors.softText,
        opacity: 0.8,
        marginBottom: '24px',
      }}>
        Create your first companion to begin the adventure!
      </p>
      <Link
        to="/pets/new"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 28px',
          backgroundColor: colors.lavenderDark,
          color: 'white',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          borderRadius: '20px',
          boxShadow: '0 6px 20px rgba(155, 143, 194, 0.35)',
        }}
      >
        ✧ Create First Friend
      </Link>
    </div>
  )
}

export function DashboardPage() {
  const colors = useKawaiiColors()
  const { pets, loadPets, logout, user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPets().finally(() => setIsLoading(false))
  }, [loadPets])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.softBorder} 1px, transparent 0)`,
      backgroundSize: '28px 28px',
      paddingBottom: '80px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: colors.softWhite,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              border: `2px solid ${colors.softBorder}`,
            }}>
              🫧
            </div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: colors.lavenderDark,
            }}>
              Toigotchi
            </h1>
          </div>
          <button
            onClick={logout}
            style={{
              backgroundColor: colors.softWhite,
              border: `2px solid ${colors.softBorder}`,
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              color: colors.softText,
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.pinkLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.softWhite
            }}
          >
            ✧ Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '32px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div className="animate-fade-slide-in">
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              color: colors.softText,
              marginBottom: '8px',
            }}>
              Welcome back, {user?.name ?? 'friend'}!
            </h2>
            <div style={{
              height: '4px',
              width: '48px',
              backgroundColor: colors.lavenderDark,
              borderRadius: '4px',
            }} />
          </div>
          <Link
            to="/pets/new"
            className="animate-fade-slide-in animate-fade-slide-in-delay-1"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: colors.lavenderDark,
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              textDecoration: 'none',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(155, 143, 194, 0.35)',
            }}
          >
            <span style={{ fontSize: '18px' }}>✨</span>
            <span>New Friend</span>
          </Link>
        </div>

        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            color: colors.softText,
            fontSize: '14px',
          }}>
            ✧ loading...
          </div>
        ) : pets.length === 0 ? (
          <EmptyState colors={colors} />
        ) : (
          <div className="animate-fade-slide-in animate-fade-slide-in-delay-2" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} colors={colors} />
            ))}
          </div>
        )}
      </main>

      <div style={{ position: 'fixed', bottom: '20px', left: '20px', fontSize: '20px', opacity: 0.3, pointerEvents: 'none' }}>✧</div>
      <ThemeToggle style={{ position: 'fixed', top: '80px', right: '30px', opacity: 0.6 }} />
    </div>
  )
}