import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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
  // Date and time state
  const [storedDate, setStoredDate] = useState<string | null>(() => {
    const stored = localStorage.getItem('acnh-date-time')
    return stored !== null ? stored : null
  })
  const [currentDate, setCurrentDate] = useState(new Date())

  // Region state
  const [region, setRegionState] = useState<string>(() => {
    const stored = localStorage.getItem('acnh-region')
    return stored !== null ? stored : 'north'
  })

  // Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // If stored date is null, use current date, otherwise use stored date
  const dateAndTime = storedDate === null ? currentDate : new Date(storedDate)
  const month = dateAndTime.getMonth() + 1
  const time = dateAndTime.getHours()

  const setDateAndTime = (newDate: Date) => {
    const dateString = newDate.toISOString()
    setStoredDate(dateString)
    localStorage.setItem('acnh-date-time', dateString)
  }

  const clearDateAndTime = () => {
    setStoredDate(null)
    localStorage.removeItem('acnh-date-time')
  }

  const setRegion = (newRegion: string) => {
    setRegionState(newRegion)
    localStorage.setItem('acnh-region', newRegion)
  }

  const clearRegion = () => {
    setRegionState('north')
    localStorage.removeItem('acnh-region')
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

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
} 