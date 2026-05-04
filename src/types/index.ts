export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface Pet {
  id: number
  user_id: number
  name: string
  species: 'blobcat' | 'foxkid' | 'draggle'
  health: number
  energy: number
  hunger: number
  cleanliness: number
  mood: string
  is_alive: boolean
  created_at: string
  updated_at: string
}

export interface PetAction {
  id: number
  pet_id: number
  type: string
  payload: Record<string, unknown>
  effects_applied: Record<string, number>
  created_at: string
}

export interface PetMemory {
  id: number
  pet_id: number
  type: 'conversation' | 'action' | 'event'
  content: string
  ai_response: string | null
  importance: number
  created_at: string
}

export interface AuthResponse {
  user: User
  access_token: string
  token_type: 'Bearer'
}

export interface LoginResponse {
  access_token: string
  token_type: 'Bearer'
}

export interface ChatResponse {
  reply: string
  pet: {
    id: number
    name: string
    mood: string
  }
}

export interface ActionResponse {
  message: string
  effects: Record<string, number>
  pet: Pet
}

export interface ApiError {
  message: string
  error?: string
  retry_after?: number
}
