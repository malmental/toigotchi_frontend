import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function RegisterPage() {
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100', maxWidth: '340px' }}>
        {/* Logo */}
        <div className="animate-fade-slide-in" style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#c8b6ff',
            border: '3px solid #1b1c19',
            boxShadow: '6px 6px 0px 0px rgba(27,28,25,1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px',
          }}>
            🫧
          </div>
          {/* Title */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '40px',
            fontWeight: 700,
            color: '#645495',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}>
            Toigotchi
          </h1>
          {/* Tagline */}
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            color: '#48454f',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontStyle: 'italic',
          }}>
            Registration Protocol
          </p>
        </div>

        {/* Register Window */}
        <div className="animate-fade-slide-in animate-fade-slide-in-delay-1 y2k-window" style={{ overflow: 'hidden' }}>
          {/* Window Header */}
          <div style={{
            backgroundColor: '#645495',
            borderBottom: '3px solid #1b1c19',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}>
              Register.exe
            </span>
            {/* Window Controls */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '16px', height: '16px', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>_</div>
              <div style={{ width: '16px', height: '16px', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>X</div>
            </div>
          </div>

          {/* Register Form */}
          <div style={{ padding: '16px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Error Message */}
              {error && (
                <div
                  className="animate-fade-in"
                  onClick={clearError}
                  style={{
                    padding: '12px',
                    borderRadius: '0',
                    backgroundColor: '#ffdad6',
                    border: '3px solid #1b1c19',
                    color: '#ba1a1a',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1b1c19',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  User_Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="YOUR_NAME"
                  required
                  className="y2k-input"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1b1c19',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  User_Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="USER@DOMAIN.COM"
                  required
                  className="y2k-input"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1b1c19',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  Access_Key
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="MIN 6 CHARS"
                  required
                  minLength={6}
                  className="y2k-input"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="y2k-button"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#645495',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontFamily: "'Space Grotesk', sans-serif",
                  border: '3px solid #1b1c19',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>

        {/* Login Link */}
        <div className="animate-fade-slide-in animate-fade-slide-in-delay-2" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#48454f',
            textTransform: 'uppercase',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#645495', fontWeight: 600 }}>
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}