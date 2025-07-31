import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, () => void] {
  // Initialize state with default value
  const [value, setValue] = useState<T>(defaultValue)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      try {
        setValue(JSON.parse(stored))
      } catch (error) {
        console.warn(`Failed to parse localStorage value for key "${key}":`, error)
        setValue(defaultValue)
      }
    }
  }, [key, defaultValue])

  // Function to update the value
  const updateValue = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  // Function to clear the value (resets to default)
  const clearValue = () => {
    setValue(defaultValue)
    localStorage.removeItem(key)
  }

  return [value, updateValue, clearValue]
} 