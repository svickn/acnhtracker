import { useAppContext } from '../contexts/AppContext'

export function useAppState() {
  return useAppContext()
} 