import { useCallback, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

interface UseStreamingChatOptions {
  onChunk: (chunk: string) => void
  onDone: () => void
  onError: (error: string) => void
}

interface UseStreamingChatReturn {
  message: string
  setMessage: (value: string) => void
  isStreaming: boolean
  fullResponse: string
  sendMessage: (petId: number, token: string) => Promise<void>
  abort: () => void
}

export function useStreamingChat({
  onChunk,
  onDone,
  onError,
}: UseStreamingChatOptions): UseStreamingChatReturn {
  const [message, setMessage] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [fullResponse, setFullResponse] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (petId: number, token: string) => {
      if (!message.trim() || isStreaming) return

      setIsStreaming(true)
      setFullResponse('')
      abortControllerRef.current = new AbortController()

      const onEachChunk = (chunk: string) => {
        setFullResponse((prev) => prev + chunk)
        onChunk(chunk)
      }

      try {
        const response = await fetch(`/api/v1/pets/${petId}/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          while (buffer.includes('\n')) {
            const newlineIndex = buffer.indexOf('\n')
            const line = buffer.slice(0, newlineIndex).trim()
            buffer = buffer.slice(newlineIndex + 1)

            if (!line) continue

            if (line === '[DONE]') {
              onDone()
              break
            }

            try {
              const data = JSON.parse(line)
              if (data.chunk) {
                onEachChunk(data.chunk)
              }
              if (data.error) {
                onError(data.error)
                break
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }

        onDone()
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          onError('Request cancelled')
        } else {
          onError(err instanceof Error ? err.message : 'Stream failed')
        }
      } finally {
        setIsStreaming(false)
        setMessage('')
      }
    },
    [message, isStreaming, onChunk, onDone, onError]
  )

  const abort = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }, [])

  return {
    message,
    setMessage,
    isStreaming,
    fullResponse,
    sendMessage,
    abort,
  }
}
