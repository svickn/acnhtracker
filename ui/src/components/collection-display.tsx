import { useState } from "react"
import { useDateAndTime } from "../hooks/use-date-time"
import { useRegion } from "../hooks/use-region"
import { getCurrentlyAvailableItems, getItemsAvailableThisMonth, getAllItems, snakeCaseToTitleCase } from "../api/utils"
import type { ApiData, ApiResponse, Region, ItemType } from "../api/types"
import { useEffect } from "react"
import { Alert, Box, Chip, CircularProgress, Container, Paper, Typography, useTheme, useMediaQuery, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { ItemDisplay } from "./item-display"
import { useBugData, useFishData, useSeaCreatureData } from "../api"

type FilterType = 'all' | 'current' | 'month'

export function CollectionDisplay({name, hook}: {name: ItemType, hook: () => ApiData}) {
  const title = snakeCaseToTitleCase(name);
  const { response, error, loading } = hook()
  const [availableItems, setAvailableItems] = useState<ApiResponse[]>([])
  const [filterType, setFilterType] = useState<FilterType>('current')
  const [dateAndTime,,, month, time] = useDateAndTime()
  const [region] = useRegion()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
        default:
          filteredItems = getCurrentlyAvailableItems(response, region as Region, dateAndTime)
      }
      
      setAvailableItems(filteredItems)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, region, month, time, filterType])

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
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

  return <Box sx={{ mt: isMobile ? 2 : 3 }} key={name}>
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
        sx={{ mb: 1 }}
      >
        <ToggleButton value="all" aria-label="all items">
          All Items
        </ToggleButton>
        <ToggleButton value="current" aria-label="available now">
          Available Now
        </ToggleButton>
        <ToggleButton value="month" aria-label="this month">
          This Month
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