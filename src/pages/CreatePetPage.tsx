import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'

/* Species Options */
const speciesOptions = [
  { value: 'blobcat', emoji: '🫧', label: 'Blobcat', description: 'Calm & Floating' },
  { value: 'foxkid', emoji: '🦊', label: 'Foxkid', description: 'Energetic & Clever' },
  { value: 'draggle', emoji: '🐉', label: 'Draggle', description: 'Wise & Loyal' },
]

export function CreatePetPage() {
  const navigate = useNavigate()
  const { token, loadPets } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', species: 'blobcat' })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      api.setToken(token)
      await api.createPet(formData)
      await loadPets()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '120px' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '8px',
      }}>
        <div style={{
          backgroundColor: '#645495',
          border: '3px solid #1b1c19',
          boxShadow: '4px 4px 0px 0px #1b1c19',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            ← Cancel
          </button>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
            textTransform: 'uppercase',
          }}>
            Create_Pet.exe
          </h1>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      {/* Main Content */}
      <main style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '480px', margin: '0 auto' }}>
        {/* Page Title */}
        <div className="animate-fade-slide-in" style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#1b1c19',
            marginBottom: '8px',
          }}>
            Begin Your Journey
          </h2>
          <p style={{ color: '#48454f' }}>
            Choose a companion to grow alongside you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="animate-fade-slide-in animate-fade-slide-in-delay-1" style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#1b1c19',
              marginBottom: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Companion Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ENTER_NAME_HERE..."
                required
                maxLength={50}
                className="y2k-inset-shadow"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  backgroundColor: '#ffffff',
                  border: '3px solid #1b1c19',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#48454f',
              }}>
                <span style={{ fontSize: '20px' }}>⌨</span>
              </div>
            </div>
          </div>

          {/* Species Selection */}
          <div className="animate-fade-slide-in animate-fade-slide-in-delay-2" style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#1b1c19',
              marginBottom: '12px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Select Species
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {speciesOptions.map(({ value, emoji, label, description }) => (
                <div
                  key={value}
                  onClick={() => setFormData({ ...formData, species: value })}
                  className="y2k-border y2k-shadow"
                  style={{
                    backgroundColor: formData.species === value ? '#e8ddff' : '#ffffff',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: formData.species === value ? '#c8b6ff' : '#f5f3ee',
                      border: '2px solid #1b1c19',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                    }}>
                      {emoji}
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#1b1c19',
                        marginBottom: '4px',
                      }}>
                        {label}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#48454f',
                      }}>
                        {description}
                      </p>
                    </div>
                    {formData.species === value && (
                      <div style={{
                        marginLeft: 'auto',
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#645495',
                        border: '2px solid #1b1c19',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Notice */}
          <div className="animate-fade-slide-in animate-fade-slide-in-delay-3" style={{
            backgroundColor: '#f5f3ee',
            border: '3px solid #1b1c19',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '20px' }}>⚠</span>
            <p style={{
              fontSize: '12px',
              color: '#48454f',
              lineHeight: 1.5,
            }}>
              Species choice affects your companion's initial personality and preferred self-care routines.
            </p>
          </div>
        </form>
      </main>

      {/* Footer with Submit Button */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px',
        backgroundColor: '#f0eee9',
        borderTop: '3px solid #1b1c19',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.name.trim()}
            className="y2k-button"
            style={{
              width: '100%',
              height: '64px',
              backgroundColor: isLoading || !formData.name.trim() ? '#9ca3af' : '#645495',
              color: 'white',
              fontSize: '18px',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif",
              border: '3px solid #1b1c19',
              boxShadow: '4px 4px 0px 0px #1b1c19',
              cursor: isLoading || !formData.name.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creating...' : 'Create_Pet.exe'}
          </button>
        </div>
      </footer>
    </div>
  )
}