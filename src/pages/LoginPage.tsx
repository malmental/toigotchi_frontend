import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '340px' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
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
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            color: '#48454f',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontStyle: 'italic',
          }}>
            Digital Serenity OS v1.0
          </p>
        </div>

        <div className="y2k-window" style={{ overflow: 'hidden' }}>
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
              Login.exe
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '16px', height: '16px', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>_</div>
              <div style={{ width: '16px', height: '16px', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>X</div>
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && (
                <div
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
                  placeholder="********"
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

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#645495',
                    textTransform: 'uppercase',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Lost Key?
                </button>
              </div>

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
                {isLoading ? 'Signing in...' : 'Enter System'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#48454f',
            textTransform: 'uppercase',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            New User?{' '}
            <Link to="/register" style={{ color: '#645495', fontWeight: 600 }}>
              REGISTRATION
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
