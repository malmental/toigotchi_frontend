import type { Pet } from '@/types'

interface PetAvatarProps {
  pet: Pet
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showMood?: boolean
}

const speciesEmojis = {
  blobcat: '🫧',
  foxkid: '🦊',
  draggle: '🐉',
}

const moodColors = {
  happy: 'text-success',
  angry: 'text-danger',
  tired: 'text-warning',
  dirty: 'text-secondary',
  neutral: 'text-text-secondary',
}

export function PetAvatar({ pet, size = 'md', showMood = true }: PetAvatarProps) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          ${sizes[size]} transition-transform duration-300
          ${pet.is_alive ? 'animate-bounce-subtle' : 'opacity-50 grayscale'}
        `}
        style={{ fontSize: 'inherit' }}
      >
        {speciesEmojis[pet.species]}
      </div>
      <span className="font-display text-lg font-semibold text-text-primary">
        {pet.name}
      </span>
      {showMood && (
        <span className={`text-sm capitalize ${moodColors[pet.mood as keyof typeof moodColors]}`}>
          {pet.mood}
        </span>
      )}
    </div>
  )
}
