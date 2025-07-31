import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface Profile {
  dateTime?: string
  region: string
}

interface AppContextType {
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

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  // Load profile from localStorage with migration support
  const [profile, setProfileState] = useState<Profile>(() => {
    const stored = localStorage.getItem('acnh-profile')
    if (stored !== null) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.warn('Failed to parse acnh-profile from localStorage:', error)
        return { region: 'north' }
      }
    }
  })
  
  const [currentDate, setCurrentDate] = useState(new Date())

  // Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // If stored date is null, use current date, otherwise use stored date
  const dateAndTime = profile.dateTime === undefined ? currentDate : new Date(profile.dateTime)
  const month = dateAndTime.getMonth() + 1
  const time = dateAndTime.getHours()
  const region = profile.region

  const setDateAndTime = (newDate: Date) => {
    const dateString = newDate.toISOString()
    const newProfile = { ...profile, dateTime: dateString }
    setProfileState(newProfile)
    localStorage.setItem('acnh-profile', JSON.stringify(newProfile))
  }

  const clearDateAndTime = () => {
    const newProfile = { ...profile }
    delete newProfile.dateTime
    setProfileState(newProfile)
    localStorage.setItem('acnh-profile', JSON.stringify(newProfile))
  }

  const setRegion = (newRegion: string) => {
    const newProfile = { ...profile, region: newRegion }
    setProfileState(newProfile)
    localStorage.setItem('acnh-profile', JSON.stringify(newProfile))
  }

  const clearRegion = () => {
    const newProfile = { ...profile, region: 'north' }
    setProfileState(newProfile)
    localStorage.setItem('acnh-profile', JSON.stringify(newProfile))
  }

  const value: AppContextType = {
    dateAndTime,
    setDateAndTime,
    clearDateAndTime,
    month,
    time,
    region,
    setRegion,
    clearRegion
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
} 