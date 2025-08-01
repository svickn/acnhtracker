import { useState } from "react"
import { useDateAndTime } from "../hooks/use-date-time"
import { useRegion } from "../hooks/use-region"
import { getCurrentlyAvailableItems, snakeCaseToTitleCase } from "../api/utils"
import type { ApiData, ApiResponse, Region, ItemType } from "../api/types"
import { useEffect } from "react"
import { Alert, Box, Chip, CircularProgress, Container, Paper, Typography, useTheme, useMediaQuery } from "@mui/material"
import { ItemDisplay } from "./item-display"
import { useBugData, useFishData, useSeaCreatureData } from "../api"

export function CollectionDisplay({name, hook}: {name: ItemType, hook: () => ApiData}) {
  const title = snakeCaseToTitleCase(name);
  const { response, error, loading } = hook()
  const [availableItems, setAvailableItems] = useState<ApiResponse[]>([])
  const [dateAndTime,,, month, time] = useDateAndTime()
  const [region] = useRegion()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (response) {
      const availableItems = getCurrentlyAvailableItems(response, region as Region, dateAndTime)
      setAvailableItems(availableItems)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, region, month, time])

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
    </Typography>
    <Chip 
      label={`${availableItemCount} ${title}${availableItemCount === 1 ? '' : 's'} found`}
      color="primary"
      sx={{ mb: isMobile ? 1.5 : 2 }}
    />
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
      {availableItems.map((item) => (
        <ItemDisplay key={item.name} item={item} />
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