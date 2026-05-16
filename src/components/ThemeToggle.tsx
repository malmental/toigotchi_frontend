import { useTheme } from '@/contexts/ThemeContext'
import { useKawaiiColors } from '@/hooks/useKawaiiColors'

export function ThemeToggle({ style = {} }: { style?: object }) {
  const { isDark, toggle } = useTheme()
  const colors = useKawaiiColors()

  return (
    <button
      onClick={toggle}
      style={{
        backgroundColor: colors.softWhite,
        border: `2px solid ${colors.softBorder}`,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 700,
        padding: '8px 14px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        color: colors.softText,
        fontFamily: "'Space Grotesk', sans-serif",
        ...style,
      }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀ dark' : '✧ light'}
    </button>
  )
}