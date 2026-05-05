import type {
  AuthResponse,
  ChatResponse,
  LoginResponse,
  Pet,
  PetAction,
  PetMemory,
  ActionResponse,
} from '@/types'

const API_BASE = '/api'

class ApiService {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(): Promise<void> {
    await this.request('/logout', { method: 'POST' })
    this.token = null
  }

  async getPet(id: number): Promise<{ data: Pet }> {
    return this.request<{ data: Pet }>(`/v1/pets/${id}`)
  }

  async getPets(): Promise<Pet[]> {
    const response = await this.request<{ data: Pet[] }>('/v1/pets')
    return response.data
  }

  async createPet(pet: { name: string; species: string }): Promise<{ data: Pet }> {
    return this.request<{ data: Pet }>('/v1/pets', {
      method: 'POST',
      body: JSON.stringify(pet),
    })
  }

  async updatePet(id: number, data: { name?: string }): Promise<{ data: Pet }> {
    return this.request<{ data: Pet }>(`/v1/pets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deletePet(id: number): Promise<void> {
    await this.request(`/v1/pets/${id}`, { method: 'DELETE' })
  }

  async performAction(
    petId: number,
    type: string,
    payload: Record<string, unknown> = {}
  ): Promise<ActionResponse> {
    return this.request<ActionResponse>(`/v1/pets/${petId}/actions`, {
      method: 'POST',
      body: JSON.stringify({ type, payload }),
    })
  }

  async getActionHistory(petId: number): Promise<{ data: PetAction[] }> {
    return this.request<{ data: PetAction[] }>(`/v1/pets/${petId}/actions`)
  }

  async chat(petId: number, message: string): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/v1/pets/${petId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  async getMemories(petId: number): Promise<{ data: PetMemory[] }> {
    return this.request<{ data: PetMemory[] }>(`/v1/pets/${petId}/memories`)
  }
}

export const api = new ApiService()
