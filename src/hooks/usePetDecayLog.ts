import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import type { DecayLog } from '@/types'

interface UsePetDecayLogOptions {
  petId: number
  token: string | null
  enabled?: boolean
}

export function usePetDecayLog({ petId, token, enabled = true }: UsePetDecayLogOptions) {
  const [logs, setLogs] = useState<DecayLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    if (!token || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      api.setToken(token)
      const response = await api.getDecayLogs(petId)
      setLogs(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch decay logs')
    } finally {
      setIsLoading(false)
    }
  }, [petId, token, enabled])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const totalChanges = logs.reduce(
    (acc, log) => {
      return {
        hunger: acc.hunger + (log.changes.hunger || 0),
        energy: acc.energy + (log.changes.energy || 0),
        cleanliness: acc.cleanliness + (log.changes.cleanliness || 0),
        health: acc.health + (log.changes.health || 0),
      }
    },
    { hunger: 0, energy: 0, cleanliness: 0, health: 0 }
  )

  const totalHoursAway = logs.reduce((sum, log) => sum + log.hours_elapsed, 0)

  return {
    logs,
    totalChanges,
    totalHoursAway,
    isLoading,
    error,
    refresh: fetchLogs,
  }
}