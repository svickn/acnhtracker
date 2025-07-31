import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useDateAndTime():[Date, (date:Date) => void, () => void, number, number] {
  const [storedDate, setStoredDate, clearStoredDate] = useLocalStorage<string | null>('acnh-date-time', null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // If stored date is null, use current date, otherwise use stored date
  const date = storedDate === null ? currentDate : new Date(storedDate)

  const setDate = (newDate: Date) => {
    setStoredDate(newDate.toISOString())
  }

  const clearDate = () => {
    clearStoredDate()
  }

  const month = date.getMonth() + 1
  const time = date.getHours()

  return [date, setDate, clearDate, month, time]
}

export function useRegion():[string, (region:string) => void, () => void] {
  return useLocalStorage<string>('acnh-region', 'north')
} 