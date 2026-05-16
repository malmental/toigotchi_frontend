import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useKawaiiColors } from '@/hooks/useKawaiiColors'
import { api } from '@/services/api'

const speciesOptions = [
  { value: 'blobcat', emoji: '🫧', label: 'Blobcat', description: 'Calm & Floating' },
  { value: 'foxkid', emoji: '🦊', label: 'Foxkid', description: 'Energetic & Clever' },
  { value: 'draggle', emoji: '🐉', label: 'Draggle', description: 'Wise & Loyal' },
]

export function CreatePetPage() {
  const colors = useKawaiiColors()
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.softBorder} 1px, transparent 0)`,
      backgroundSize: '28px 28px',
      paddingBottom: '100px',
    }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: colors.headerBar,
        borderBottom: `2px solid ${colors.softBorder}`,
      }}>
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.softText,
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← back
          </button>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: colors.softText,
          }}>
            ✧ New Friend
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main style={{
        paddingTop: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
        maxWidth: '480px',
        margin: '0 auto',
      }}>
        <div className="animate-fade-slide-in" style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: colors.softWhite,
            borderRadius: '50%',
            border: `3px solid ${colors.softBorder}`,
            boxShadow: '0 8px 25px rgba(155, 143, 194, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '40px',
          }}>
            ✨
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '26px',
            fontWeight: 700,
            color: colors.softText,
            marginBottom: '8px',
          }}>
            Create New Friend
          </h2>
          <p style={{ color: colors.softText, fontSize: '14px', opacity: 0.8 }}>
            Choose a companion to grow alongside you
          </p>
        </div>

        {error && (
          <div className="animate-fade-in" style={{
            padding: '14px',
            borderRadius: '16px',
            backgroundColor: '#FFB5B5',
            color: '#8B4A4A',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: '24px',
            border: '2px solid #D45656',
          }}>
            ✧ {error} ✧
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="animate-fade-slide-in animate-fade-slide-in-delay-1" style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: colors.softText,
              marginBottom: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              ✧ Friend Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="give them a name..."
                required
                maxLength={50}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '15px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  backgroundColor: colors.softWhite,
                  border: `2px solid ${colors.softBorder}`,
                  borderRadius: '16px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = colors.lavenderDark}
                onBlur={(e) => e.target.style.borderColor = colors.softBorder}
              />
            </div>
          </div>

          <div className="animate-fade-slide-in animate-fade-slide-in-delay-2" style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: colors.softText,
              marginBottom: '12px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              ✧ Choose Species
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {speciesOptions.map(({ value, emoji, label, description }) => (
                <div
                  key={value}
                  onClick={() => setFormData({ ...formData, species: value })}
                  style={{
                    backgroundColor: formData.species === value ? colors.pinkLight : colors.softWhite,
                    padding: '16px 20px',
                    borderRadius: '20px',
                    border: `2px solid ${formData.species === value ? colors.lavenderDark : colors.softBorder}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.species === value
                      ? '0 6px 20px rgba(155, 143, 194, 0.25)'
                      : '0 4px 15px rgba(155, 143, 194, 0.1)',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: formData.species === value ? colors.lavender : colors.inputBg,
                      borderRadius: '50%',
                      border: `2px solid ${colors.softBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                    }}>
                      {emoji}
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '16px',
                        fontWeight: 600,
                        color: colors.softText,
                        marginBottom: '4px',
                      }}>
                        {label}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: colors.softText,
                        opacity: 0.7,
                      }}>
                        {description}
                      </p>
                    </div>
                    {formData.species === value && (
                      <div style={{
                        marginLeft: 'auto',
                        width: '28px',
                        height: '28px',
                        backgroundColor: colors.lavenderDark,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-slide-in animate-fade-slide-in-delay-3" style={{
            backgroundColor: colors.inputBg,
            border: `2px solid ${colors.softBorder}`,
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '18px' }}>💜</span>
            <p style={{
              fontSize: '12px',
              color: colors.softText,
              lineHeight: 1.5,
            }}>
              Each species has unique traits and preferences. Choose what resonates with you!
            </p>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.name.trim()}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: isLoading || !formData.name.trim() ? colors.softBorder : colors.lavenderDark,
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              border: 'none',
              borderRadius: '20px',
              boxShadow: isLoading || !formData.name.trim()
                ? 'none'
                : '0 6px 20px rgba(155, 143, 194, 0.35)',
              cursor: isLoading || !formData.name.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? '✨ creating...' : '✨ create new friend'}
          </button>
        </form>
      </main>
    </div>
  )
}