import { useTheme } from '@/contexts/ThemeContext'

export function useKawaiiColors() {
  const { isDark } = useTheme()

  return {
    lavender: '#E6E6FA',
    lavenderDark: '#9B8FC2',
    pink: '#FFB6C1',
    pinkLight: isDark ? '#6b5a8a' : '#FFF0F5',
    mint: '#98FB98',
    cream: '#FDF6E3',
    softWhite: isDark ? '#3d3555' : '#FFFFFF',
    softText: isDark ? '#E6E6FA' : '#6B5B7A',
    softBorder: isDark ? '#5a4f7a' : '#DDD6E8',
    background: isDark ? '#1a1625' : '#FBF5F0',
    backgroundSecondary: isDark ? '#252036' : '#FDF6E3',
    headerBar: isDark ? '#4a4170' : '#E6E6FA',
    headerBg: isDark ? '#2d2850' : '#FFFFFF',
    inputBg: isDark ? '#252036' : '#FDF6E3',
    cardBg: isDark ? '#252036' : '#FFFFFF',
    selectedBg: isDark ? '#3d2f5a' : '#FFF0F5',
  }
}