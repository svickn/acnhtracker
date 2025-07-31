import { useAppContext } from '../contexts/app-context'

export function useDateAndTime(): [Date, (date: Date) => void, () => void, number, number] {
  const { dateAndTime, setDateAndTime, clearDateAndTime, month, time } = useAppContext()
  
  return [dateAndTime, setDateAndTime, clearDateAndTime, month, time]
}