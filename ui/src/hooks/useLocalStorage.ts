import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, () => void] {
  // Initialize state with default value
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.warn(`Failed to parse localStorage value for key "${key}":`, error)
        return defaultValue
      }
    }
    return defaultValue
  })

  // Listen for storage events from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Failed to parse localStorage value for key "${key}":`, error)
          setValue(defaultValue)
        }
      }
    }

    // Listen for custom events from same window
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key && e.detail.newValue !== null) {
        try {
          setValue(JSON.parse(e.detail.newValue))
        } catch (error) {
          console.warn(`Failed to parse localStorage value for key "${key}":`, error)
          setValue(defaultValue)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener)
    }
  }, [key, defaultValue])

  // Function to update the value
  const updateValue = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new CustomEvent('localStorageChange', {
      detail: { key, newValue: JSON.stringify(newValue) }
    }))
  }

  // Function to clear the value (resets to default)
  const clearValue = () => {
    setValue(defaultValue)
    localStorage.removeItem(key)
  }

  return [value, updateValue, clearValue]
} 