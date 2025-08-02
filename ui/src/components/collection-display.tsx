import { useState } from "react"
import { useDateAndTime } from "../hooks/use-date-time"
import { useRegion } from "../hooks/use-region"
import { getCurrentlyAvailableItems, getItemsAvailableThisMonth, getAllItems, snakeCaseToTitleCase, getItemsLeavingThisMonth } from "../api/utils"
import type { ApiData, ApiResponse, Region, ItemType } from "../api/types"
import { useEffect, useRef } from "react"
import { Alert, Box, Chip, CircularProgress, Container, Paper, Typography, useTheme, useMediaQuery, ToggleButtonGroup, ToggleButton, Fab } from "@mui/material"
import { KeyboardArrowUp } from '@mui/icons-material'
import { ItemDisplay } from "./item-display"
import { useBugData, useFishData, useSeaCreatureData } from "../api"
import { useItemTracking } from "../hooks/use-item-tracking"

type FilterType = 'all' | 'current' | 'month' | 'leaving'

export function CollectionDisplay({name, hook}: {name: ItemType, hook: () => ApiData}) {
  const title = snakeCaseToTitleCase(name);
  const { response, error, loading } = hook()
  const [availableItems, setAvailableItems] = useState<ApiResponse[]>([])
  const [filterType, setFilterType] = useState<FilterType>('current')
  const [showCollected, setShowCollected] = useState(true)
  const [showDonated, setShowDonated] = useState(true)
  const [dateAndTime,,, month, time] = useDateAndTime()
  const [region] = useRegion()
  const { getTracking, getAllTracking } = useItemTracking(name)
  const allTracking = getAllTracking()
  const containerRef = useRef<HTMLDivElement>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Scroll to top when switching between collection types
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [name])

  useEffect(() => {
    if (response) {
      let filteredItems: ApiResponse[]
      
      switch (filterType) {
        case 'all':
          filteredItems = getAllItems(response)
          break
        case 'current':
          filteredItems = getCurrentlyAvailableItems(response, region as Region, dateAndTime)
          break
        case 'month':
          filteredItems = getItemsAvailableThisMonth(response, region as Region, dateAndTime)
          break
        case 'leaving':
          filteredItems = getItemsLeavingThisMonth(response, region as Region, dateAndTime)
          break
        default:
          filteredItems = getCurrentlyAvailableItems(response, region as Region, dateAndTime)
      }
      
      // Apply tracking filters
      filteredItems = filteredItems.filter((item) => {
        const tracking = getTracking(item.number.toString())
        
        // Filter by collected status
        if (!showCollected && tracking?.caught) {
          return false
        }
        
        // Filter by donated status
        if (!showDonated && tracking?.donated) {
          return false
        }
        
        return true
      })
      
      setAvailableItems(filteredItems)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, region, month, time, filterType, showCollected, showDonated, allTracking])

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: FilterType,
  ) => {
    if (newFilter !== null) {
      setFilterType(newFilter)
    }
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={isMobile ? "50vh" : "100vh"}
      >
        <CircularProgress size={isMobile ? 40 : 60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {error}
        </Alert>
      </Container>
    )
  }

  if (!response) {
    return <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        No data found
      </Alert>
    </Container>
  }

  const availableItemCount = availableItems.length

  return (
    <>
      <Box ref={containerRef} sx={{ mt: isMobile ? 2 : 3 }} key={name}>
      <Paper sx={{ 
        p: isMobile ? 2 : 3,
        minHeight: 'fit-content',
        height: 'auto'
      }}>
    <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
      {title} Collection
      <Chip 
        label={`${availableItemCount} ${title}${ availableItemCount === 1 ? '' : name !== 'fish' ? 's' : ''} found`}
        color="primary"
        sx={{ ml: 1 }}
      />
    </Typography>
    
    <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
      <ToggleButtonGroup
        value={filterType}
        exclusive
        onChange={handleFilterChange}
        aria-label="filter selection"
        size={isMobile ? "small" : "medium"}
        sx={{ 
          mb: 1,
          width: isMobile ? '100%' : 'auto'
        }}
      >
        <ToggleButton value="all" aria-label="all items" sx={{ flex: isMobile ? 1 : 'auto' }}>
          All
        </ToggleButton>
        <ToggleButton value="current" aria-label="available now" sx={{ flex: isMobile ? 1 : 'auto' }}>
          Now
        </ToggleButton>
        <ToggleButton value="month" aria-label="this month" sx={{ flex: isMobile ? 1 : 'auto' }}>
          This Month
        </ToggleButton>
        <ToggleButton value="leaving" aria-label="leaving this month" sx={{ flex: isMobile ? 1 : 'auto' }}>
          Leaving
        </ToggleButton>
      </ToggleButtonGroup>
      
      <ToggleButtonGroup
        value={showCollected ? "show" : "hide"}
        exclusive
        onChange={(_, value) => setShowCollected(value === "show")}
        aria-label="collected filter"
        size={isMobile ? "small" : "medium"}
        sx={{ 
          mb: 1, 
          ml: isMobile ? 0 : 1,
          width: isMobile ? '100%' : 'auto'
        }}
      >
        <ToggleButton value="show" aria-label="show collected" sx={{ flex: isMobile ? 1 : 'auto' }}>
          Show Collected
        </ToggleButton>
        <ToggleButton value="hide" aria-label="hide collected" sx={{ flex: isMobile ? 1 : 'auto' }}>
          Hide Collected
        </ToggleButton>
      </ToggleButtonGroup>
      
      <ToggleButtonGroup
        value={showDonated ? "show" : "hide"}
        exclusive
        onChange={(_, value) => setShowDonated(value === "show")}
        aria-label="donated filter"
        size={isMobile ? "small" : "medium"}
        sx={{ 
          mb: 1, 
          ml: isMobile ? 0 : 1,
          width: isMobile ? '100%' : 'auto'
        }}
      >
        <ToggleButton value="show" aria-label="show donated" sx={{ flex: isMobile ? 1 : 'auto' }}>
          Show Donated
        </ToggleButton>
        <ToggleButton value="hide" aria-label="hide donated" sx={{ flex: isMobile ? 1 : 'auto' }}>
          Hide Donated
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
    <Box
      sx={{
        backgroundColor: 'grey.50',
        p: isMobile ? 1.5 : 2,
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: isMobile ? '0.8rem' : '0.875rem',
        minHeight: 'fit-content',
        height: 'auto'
      }}
    >
      {availableItems
        .sort((a, b) => a.number - b.number)
        .map((item) => (
          <ItemDisplay key={item.number} item={item} itemType={name} />
        ))}
    </Box>
        </Paper>
    </Box>
    
    {/* Floating scroll to top button */}
    <Fab
      color="primary"
      aria-label="scroll to top"
      onClick={() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <KeyboardArrowUp />
    </Fab>
    </>
  )
}

export function FishDisplay() {
  return <CollectionDisplay name="fish" hook={useFishData} />
}

export function BugDisplay() {
  return <CollectionDisplay name="bug" hook={useBugData} />
}

export function SeaCreatureDisplay() {
  return <CollectionDisplay name="sea-creature" hook={useSeaCreatureData} />
}