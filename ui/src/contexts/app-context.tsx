import { createContext, useContext } from 'react'
import type { ItemTypeTracking, ItemType, ItemTrackingData } from '../api/types'

export interface Profile {
  id: string
  name: string
  dateTime?: string
  region: string
  fish: ItemTypeTracking
  bug: ItemTypeTracking
  'sea-creature': ItemTypeTracking
}

export interface AppContextType {
  // Profile management
  profiles: Profile[]
  currentProfileIndex: number
  currentProfile: Profile
  addProfile: (name: string) => void
  removeProfile: (index: number) => void
  setCurrentProfile: (index: number) => void
  updateCurrentProfile: (updates: Partial<Profile>) => void
  exportProfile: (profileIndex: number) => void
  importProfile: (file: File) => Promise<{ needsOverwrite: boolean; existingProfileIndex: number | null; profile: Profile }>
  addImportedProfile: (profile: Profile, overwriteIndex?: number) => void
  
  // Item tracking management
  getItemTracking: (itemType: ItemType, itemId: string) => ItemTrackingData | undefined
  setItemTracking: (itemType: ItemType, itemId: string, tracking: ItemTrackingData) => void
  getItemTypeTracking: (itemType: ItemType) => ItemTypeTracking
  
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