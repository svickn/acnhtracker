import { useAppContext } from '../contexts/AppContext'

export function useDateAndTime(): [Date, (date: Date) => void, () => void, number, number] {
  const { dateAndTime, setDateAndTime, clearDateAndTime, month, time } = useAppContext()
  
  return [dateAndTime, setDateAndTime, clearDateAndTime, month, time]
}

export function useRegion(): [string, (region: string) => void, () => void] {
  const { region, setRegion, clearRegion } = useAppContext()
  
  return [region, setRegion, clearRegion]
} 