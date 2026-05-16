import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useKawaiiColors } from '@/hooks/useKawaiiColors'

export function LoginPage() {
  const colors = useKawaiiColors()
  const { login, error, clearError } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
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
      paddingTop: '80px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflowY: 'auto',
    }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '12px 20px',
        backgroundColor: colors.headerBg,
        borderBottom: `2px solid ${colors.softBorder}`,
        boxShadow: '0 4px 20px rgba(155, 143, 194, 0.1)',
      }}>
        <div style={{
          backgroundColor: colors.headerBar,
          borderRadius: '20px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: colors.softWhite,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            border: `2px solid ${colors.softBorder}`,
          }}>
            🫧
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: colors.lavenderDark,
            marginLeft: '10px',
          }}>
            Toigotchi
          </span>
          <ThemeToggle style={{ marginLeft: 'auto' }} />
        </div>
      </header>
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
            your cozy digital companion
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
            backgroundColor: colors.lavender,
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
              border: `2px solid ${colors.lavenderDark}`,
            }}>
              🫧
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: colors.lavenderDark,
            }}>
              Welcome Back!
            </span>
          </div>

          {/* Form */}
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Error Message */}
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
                  placeholder="••••••••"
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

              {/* Forgot Link */}
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: colors.lavenderDark,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                    opacity: 0.8,
                  }}
                >
                  forgot password?
                </button>
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
                {isLoading ? '✨ connecting...' : '✨ start adventure'}
              </button>
            </form>
          </div>
        </div>

        {/* Register Link */}
        <div className="animate-fade-slide-in animate-fade-slide-in-delay-2" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: colors.softText,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            new friend?{' '}
            <Link
              to="/register"
              style={{
                color: colors.lavenderDark,
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: `2px dashed ${colors.pink}`,
              }}
            >
              create account
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