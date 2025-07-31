import { createContext, useContext } from 'react'

export interface Profile {
  dateTime?: string
  region: string
}

export interface AppContextType {
  // Date and time state
  dateAndTime: Date
  setDateAndTime: (date: Date) => void
  clearDateAndTime: () => void
  month: number
  time: number
  
  // Region state
  region: string
  setRegion: (region: string) => void
  clearRegion: () => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
} 