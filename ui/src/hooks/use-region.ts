import { useAppContext } from '../contexts/app-context'

export function useRegion(): [string, (region: string) => void, () => void] {
  const { region, setRegion, clearRegion } = useAppContext()
  
  return [region, setRegion, clearRegion]
} 