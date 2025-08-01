import { useAppContext } from '../contexts/app-context'
import type { ItemType, ItemTrackingData, ItemTypeTracking } from '../api/types'

/**
 * Hook for managing item tracking data for a specific ItemType
 * 
 * @param itemType - The type of item ('fish', 'bug', or 'sea-creature')
 * @returns Object with functions to get and set tracking data
 * 
 * @example
 * ```tsx
 * const fishTracking = useItemTracking('fish')
 * 
 * // Get tracking for a specific fish
 * const fish1Tracking = fishTracking.getTracking('1')
 * 
 * // Set tracking for a fish
 * fishTracking.setTracking('1', { caught: true, donated: false })
 * 
 * // Get all fish tracking data
 * const allFishTracking = fishTracking.getAllTracking()
 * ```
 */
export function useItemTracking(itemType: ItemType) {
  const { getItemTracking, setItemTracking, getItemTypeTracking } = useAppContext()
  
  const getTracking = (itemId: string): ItemTrackingData | undefined => {
    return getItemTracking(itemType, itemId)
  }
  
  const setTracking = (itemId: string, tracking: ItemTrackingData) => {
    setItemTracking(itemType, itemId, tracking)
  }
  
  const getAllTracking = (): ItemTypeTracking => {
    return getItemTypeTracking(itemType)
  }
  
  return {
    getTracking,
    setTracking,
    getAllTracking
  }
} 