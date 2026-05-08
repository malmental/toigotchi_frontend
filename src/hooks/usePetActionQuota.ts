import { useCallback, useEffect, useRef, useState } from 'react'
import type { PetQuota } from '@/types'
import { api } from '@/services/api'

interface UsePetActionQuotaOptions {
  petId: number
  token: string | null
  enabled?: boolean
}

interface UsePetActionQuotaReturn {
  quota: PetQuota | null
  isLoading: boolean
  error: string | null
  canPerformAction: boolean
  remaining: number
  resetsAt: Date | null
  isExhausted: boolean
  refresh: () => Promise<void>
}

export function usePetActionQuota({
  petId,
  token,
  enabled = true,
}: UsePetActionQuotaOptions): UsePetActionQuotaReturn {
  const [quota, setQuota] = useState<PetQuota | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = useCallback(async () => {
    if (!token || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await api.getPetQuota(petId)
      setQuota(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quota')
    } finally {
      setIsLoading(false)
    }
  }, [petId, token, enabled])

  useEffect(() => {
    refresh()

    refreshIntervalRef.current = setInterval(() => {
      if (quota?.resets_at) {
        const resetsAt = new Date(quota.resets_at)
        if (resetsAt <= new Date()) {
          refresh()
        }
      }
    }, 30000)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [refresh, quota?.resets_at])

  const resetsAt = quota?.resets_at ? new Date(quota.resets_at) : null

  return {
    quota,
    isLoading,
    error,
    canPerformAction: !quota?.is_exhausted,
    remaining: quota?.remaining ?? 3,
    resetsAt,
    isExhausted: quota?.is_exhausted ?? false,
    refresh,
  }
}