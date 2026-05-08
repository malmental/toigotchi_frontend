import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { Pet } from '@/types'

const speciesEmojis: Record<string, string> = {
  blobcat: '🫧',
  foxkid: '🦊',
  draggle: '🐉',
}

const moodColors: Record<string, { bg: string; text: string }> = {
  happy: { bg: '#b2c97c', text: '#151f00' },
  angry: { bg: '#ffdad6', text: '#93000a' },
  tired: { bg: '#ffe1b2', text: '#5c4300' },
  dirty: { bg: '#ffd6ff', text: '#5a3c5d' },
  neutral: { bg: '#e4e2dd', text: '#1b1c19' },
}

function PetCard({ pet }: { pet: Pet }) {
  const mood = moodColors[pet.mood] || moodColors.neutral

  return (
    <Link
      to={`/pets/${pet.id}`}
      className="y2k-border y2k-shadow"
      style={{
        display: 'block',
        backgroundColor: '#ffffff',
        padding: '24px',
        transition: 'all 0.1s',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translate(2px, 2px)'
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '2px 2px 0px 0px #1b1c19'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'none'
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '4px 4px 0px 0px #1b1c19'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#f5f3ee',
          border: '2px solid #1b1c19',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
        }}>
          {speciesEmojis[pet.species]}
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '20px',
            fontWeight: 600,
            color: '#1b1c19',
            marginBottom: '4px',
          }}>
            {pet.name}
          </h3>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#48454f',
          }}>
            {pet.mood}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '4px',
            color: '#1b1c19',
          }}>
            <span>Hunger</span>
            <span>{pet.hunger}%</span>
          </div>
          <div style={{
            height: '12px',
            border: '2px solid #1b1c19',
            backgroundColor: '#e4e2dd',
            padding: '2px',
          }}>
            <div style={{
              height: '100%',
              width: `${pet.hunger}%`,
              backgroundColor: '#645495',
            }} />
          </div>
        </div>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '4px',
            color: '#1b1c19',
          }}>
            <span>Energy</span>
            <span>{pet.energy}%</span>
          </div>
          <div style={{
            height: '12px',
            border: '2px solid #1b1c19',
            backgroundColor: '#e4e2dd',
            padding: '2px',
          }}>
            <div style={{
              height: '100%',
              width: `${pet.energy}%`,
              backgroundColor: '#735476',
            }} />
          </div>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="animate-fade-slide-in y2k-border y2k-shadow" style={{
      backgroundColor: '#ffffff',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐾</div>
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '24px',
        fontWeight: 600,
        color: '#1b1c19',
        marginBottom: '8px',
      }}>
        No pets yet
      </h3>
      <p style={{
        fontSize: '16px',
        color: '#48454f',
        marginBottom: '24px',
      }}>
        Create your first companion to begin
      </p>
      <Link
        to="/pets/new"
        className="y2k-button"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#645495',
          color: 'white',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          textTransform: 'uppercase',
          textDecoration: 'none',
          border: '3px solid #1b1c19',
          boxShadow: '4px 4px 0px 0px #1b1c19',
        }}
      >
        + New Pet
      </Link>
    </div>
  )
}

export function DashboardPage() {
  const { pets, loadPets, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPets().finally(() => setIsLoading(false))
  }, [loadPets])

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🐾</span>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: 'white',
            }}>
              Toigotchi.exe
            </h1>
          </div>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#C0C0C0',
              border: '2px solid #000',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '32px 16px', maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div className="animate-fade-slide-in">
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '32px',
              fontWeight: 700,
              color: '#1b1c19',
            }}>
              Dashboard
            </h2>
            <div style={{ height: '4px', width: '48px', backgroundColor: '#645495', marginTop: '4px' }} />
          </div>
          <Link
            to="/pets/new"
            className="y2k-button animate-fade-slide-in animate-fade-slide-in-delay-1"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#e4e2dd',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: '#1b1c19',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px 0px #000',
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            <span>New Pet</span>
          </Link>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#48454f' }}>
            Loading...
          </div>
        ) : pets.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="animate-fade-slide-in animate-fade-slide-in-delay-2" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
