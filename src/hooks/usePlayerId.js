import { useMemo } from 'react'

function generateId() {
  return Math.random().toString(36).slice(2, 11)
}

export function usePlayerId() {
  return useMemo(() => {
    let id = localStorage.getItem('wai-player-id')
    if (!id) {
      id = generateId()
      localStorage.setItem('wai-player-id', id)
    }
    return id
  }, [])
}
