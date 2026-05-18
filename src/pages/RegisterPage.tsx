import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useKawaiiColors } from '@/hooks/useKawaiiColors'

export function RegisterPage() {
  const colors = useKawaiiColors()
  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await register(formData.name, formData.email, formData.password)
      navigate('/')
    } catch {
      // Error handled by context
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
      padding: '48px 24px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* Kawaii Logo */}
        <div className="animate-fade-slide-in" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: colors.softWhite,
            borderRadius: '50%',
            border: `4px solid ${colors.lavenderDark}`,
            boxShadow: `0 8px 24px rgba(155, 143, 194, 0.3)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              width: '16px',
              height: '10px',
              backgroundColor: colors.pink,
              borderRadius: '50%',
              top: '45%',
              left: '20%',
              opacity: 0.7,
            }} />
            <div style={{
              position: 'absolute',
              width: '16px',
              height: '10px',
              backgroundColor: colors.pink,
              borderRadius: '50%',
              top: '45%',
              right: '20%',
              opacity: 0.7,
            }} />
            <span style={{ fontSize: '48px' }}>🫧</span>
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '36px',
            fontWeight: 700,
            color: colors.lavenderDark,
            marginBottom: '8px',
            letterSpacing: '0.02em',
          }}>
            Toigotchi
          </h1>

          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            color: colors.softText,
            letterSpacing: '0.05em',
          }}>
            join the cozy family
          </p>
        </div>

        {/* Kawaii Card */}
        <div
          className="animate-fade-slide-in animate-fade-slide-in-delay-1"
          style={{
            backgroundColor: colors.softWhite,
            borderRadius: '24px',
            border: `2px solid ${colors.softBorder}`,
            boxShadow: `0 12px 40px rgba(155, 143, 194, 0.2)`,
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <div style={{
            backgroundColor: colors.pinkLight,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: colors.softWhite,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              border: `2px solid ${colors.pink}`,
            }}>
              ✨
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: colors.lavenderDark,
            }}>
              Create Account
            </span>
          </div>

          {/* Form */}
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <div
                  className="animate-fade-in"
                  onClick={clearError}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: '#FFB5B5',
                    color: '#D45656',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: '2px solid #D45656',
                  }}
                >
                  ✧ {error} ✧
                </div>
              )}

              {/* Name Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.softText,
                  marginBottom: '8px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  ✿ Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="your cute name"
                  required
                  style={{
                    width: '100%',
                    height: '52px',
                    padding: '0 16px',
                    fontSize: '15px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: colors.inputBg,
                    border: `2px solid ${colors.softBorder}`,
                    borderRadius: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.lavenderDark}
                  onBlur={(e) => e.target.style.borderColor = colors.softBorder}
                />
              </div>

              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.softText,
                  marginBottom: '8px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  ✉ Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  style={{
                    width: '100%',
                    height: '52px',
                    padding: '0 16px',
                    fontSize: '15px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: colors.inputBg,
                    border: `2px solid ${colors.softBorder}`,
                    borderRadius: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.lavenderDark}
                  onBlur={(e) => e.target.style.borderColor = colors.softBorder}
                />
              </div>

              {/* Password Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.softText,
                  marginBottom: '8px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  🔐 Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="min 6 characters"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    height: '52px',
                    padding: '0 16px',
                    fontSize: '15px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: colors.inputBg,
                    border: `2px solid ${colors.softBorder}`,
                    borderRadius: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.lavenderDark}
                  onBlur={(e) => e.target.style.borderColor = colors.softBorder}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: isLoading ? colors.softBorder : colors.lavenderDark,
                  color: colors.softWhite,
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: "'Space Grotesk', sans-serif",
                  border: 'none',
                  borderRadius: '20px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: isLoading ? 'none' : `0 6px 20px rgba(155, 143, 194, 0.4)`,
                  transition: 'all 0.2s',
                  marginTop: '8px',
                }}
              >
                {isLoading ? '✨ creating...' : '✨ join toigotchi'}
              </button>
            </form>
          </div>
        </div>

        {/* Login Link */}
        <div className="animate-fade-slide-in animate-fade-slide-in-delay-2" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: colors.softText,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            already a friend?{' '}
            <Link
              to="/login"
              style={{
                color: colors.lavenderDark,
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: `2px dashed ${colors.pink}`,
              }}
            >
              login here
            </Link>
          </p>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          fontSize: '24px',
          opacity: 0.3,
        }}>
          ✧
        </div>
        <ThemeToggle style={{ position: 'fixed', top: '20px', right: '20px', opacity: 0.6 }} />
      </div>
    </div>
  )
}