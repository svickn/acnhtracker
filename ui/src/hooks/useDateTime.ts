import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useDateAndTime():[Date, (date:Date) => void, () => void] {
  const [storedDate, setStoredDate, clearStoredDate] = useLocalStorage<Date | null>('acnh-date-time', null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // If stored date is null, use current date, otherwise use stored date
  const date = storedDate || currentDate

  const setDate = (newDate: Date) => {
    setStoredDate(newDate)
  }

  const clearDate = () => {
    clearStoredDate()
  }

  return [date, setDate, clearDate]
}

export function useRegion():[string, (region:string) => void, () => void] {
  return useLocalStorage<string>('acnh-region', 'north')
} 