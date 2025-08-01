import { useEffect, useState, type ReactNode } from "react"
import type { AppContextType, Profile } from "./app-context"
import type { ItemType, ItemTrackingData, ItemTypeTracking } from "../api/types"
import { AppContext } from "./app-context"

interface AppProviderProps {
  children: ReactNode
}

// Helper function to generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Helper function to migrate old single profile to new multi-profile format
const defaultProfile = (): Profile[] => [{
    id: generateId(),
    name: 'Default Profile',
    region: 'north',
    fish: {},
    bug: {},
    'sea-creature': {}
  }]

// Helper function to ensure a profile has all required tracking properties
const ensureProfileTracking = (profile: Partial<Profile>): Profile => {
  return {
    id: profile.id || generateId(),
    name: profile.name || 'Default Profile',
    region: profile.region || 'north',
    dateTime: profile.dateTime,
    fish: profile.fish || {},
    bug: profile.bug || {},
    'sea-creature': profile['sea-creature'] || {}
  }
}


export function AppProvider({ children }: AppProviderProps) {
  // Load profiles from localStorage with migration support
  const [profiles, setProfilesState] = useState<Profile[]>(() => {
    const stored = localStorage.getItem('acnh-profiles')
    if (stored !== null) {
      try {
        const parsedProfiles = JSON.parse(stored)
        // Ensure all profiles have the required tracking properties
        return Array.isArray(parsedProfiles) 
          ? parsedProfiles.map(ensureProfileTracking)
          : defaultProfile()
      } catch (error) {
        console.warn('Failed to parse acnh-profiles from localStorage:', error)
        return defaultProfile()
      }
    }
    // If no profiles exist, try to migrate old profile
    return defaultProfile()
  })
  
  const [currentProfileIndex, setCurrentProfileIndexState] = useState<number>(() => {
    const stored = localStorage.getItem('acnh-current-profile-index')
    if (stored !== null) {
      try {
        const index = parseInt(stored, 10)
        return index >= 0 && index < profiles.length ? index : 0
      } catch (error) {
        console.warn('Failed to parse current profile index:', error)
      }
    }
    return 0
  })
  
  const [currentDate, setCurrentDate] = useState(new Date())

  // Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Ensure currentProfileIndex is valid
  const validCurrentIndex = Math.max(0, Math.min(currentProfileIndex, profiles.length - 1))
  const currentProfile = profiles[validCurrentIndex] || profiles[0]

  // If stored date is null, use current date, otherwise use stored date
  const dateAndTime = currentProfile?.dateTime === undefined ? currentDate : new Date(currentProfile.dateTime)
  const month = dateAndTime.getMonth() + 1
  const time = dateAndTime.getHours()
  const region = currentProfile?.region || 'north'

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('acnh-profiles', JSON.stringify(profiles))
  }, [profiles])

  // Save current profile index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('acnh-current-profile-index', validCurrentIndex.toString())
  }, [validCurrentIndex])

  const setProfiles = (newProfiles: Profile[]) => {
    setProfilesState(newProfiles)
  }

  const addProfile = (name: string) => {
    const newProfile: Profile = {
      id: generateId(),
      name,
      region: 'north',
      fish: {},
      bug: {},
      'sea-creature': {}
    }
    setProfiles([...profiles, newProfile])
  }

  const removeProfile = (index: number) => {
    if (profiles.length <= 1) return // Don't remove the last profile
    const newProfiles = profiles.filter((_, i) => i !== index)
    setProfiles(newProfiles)
    
    // Adjust current index if necessary
    if (index <= validCurrentIndex && validCurrentIndex > 0) {
      setCurrentProfileIndexState(validCurrentIndex - 1)
    }
  }

  const setCurrentProfile = (index: number) => {
    if (index >= 0 && index < profiles.length) {
      setCurrentProfileIndexState(index)
    }
  }

  const updateCurrentProfile = (updates: Partial<Profile>) => {
    const newProfiles = [...profiles]
    newProfiles[validCurrentIndex] = { ...newProfiles[validCurrentIndex], ...updates }
    setProfiles(newProfiles)
  }

  const setDateAndTime = (newDate: Date) => {
    const dateString = newDate.toISOString()
    updateCurrentProfile({ dateTime: dateString })
  }

  const clearDateAndTime = () => {
    const newProfile = { ...currentProfile, dateTime: undefined }
    updateCurrentProfile(newProfile)
  }

  const setRegion = (newRegion: string) => {
    updateCurrentProfile({ region: newRegion })
  }

  const clearRegion = () => {
    updateCurrentProfile({ region: 'north' })
  }

  // Item tracking management functions
  const getItemTracking = (itemType: ItemType, itemId: string): ItemTrackingData | undefined => {
    const tracking = currentProfile[itemType]
    return tracking?.[itemId]
  }

  const setItemTracking = (itemType: ItemType, itemId: string, tracking: ItemTrackingData) => {
    const currentTracking = currentProfile[itemType] || {}
    const updatedTracking = { ...currentTracking, [itemId]: tracking }
    updateCurrentProfile({ [itemType]: updatedTracking })
  }

  const getItemTypeTracking = (itemType: ItemType): ItemTypeTracking => {
    return currentProfile[itemType] || {}
  }

  const value: AppContextType = {
    profiles,
    currentProfileIndex: validCurrentIndex,
    currentProfile,
    addProfile,
    removeProfile,
    setCurrentProfile,
    updateCurrentProfile,
    getItemTracking,
    setItemTracking,
    getItemTypeTracking,
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