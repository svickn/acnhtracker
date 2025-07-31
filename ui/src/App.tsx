import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material'
import { useFishData, useBugData, useSeaCreatureData } from './api'
import { DateTime } from './components/datetime'
import type { ApiData, ApiResponse, Region } from './api/types'
import { useDateAndTime } from './hooks/useDateTime'
import { useRegion } from './hooks/useDateTime'
import { getCurrentlyAvailableItems } from './api/utils'
import { AppProvider } from './contexts/AppContext'

function CollectionDisplay({name, hook}: {name: string, hook: () => ApiData}) {
  const { response, error, loading } = hook()
  const [availableItems, setAvailableItems] = useState<ApiResponse[]>([])
  const [dateAndTime,,, month, time] = useDateAndTime()
  const [region] = useRegion()

  useEffect(() => {
    if (response) {
      const availableItems = getCurrentlyAvailableItems(response, region as Region, dateAndTime)
      setAvailableItems(availableItems)
    }
  }, [response, region, month, time])

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {error}
        </Alert>
      </Container>
    )
  }

  if (!response) {
    return <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        No data found
      </Alert>
    </Container>
  }

  const availableItemCount = availableItems.length

  return <Box sx={{ mt: 3 }} key={name}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      {name} Collection
    </Typography>
    <Chip 
      label={`${availableItemCount} ${name} found`}
      color="primary"
      sx={{ mb: 2 }}
    />
    <Box
      sx={{
        maxHeight: 400,
        overflow: 'auto',
        backgroundColor: 'grey.50',
        p: 2,
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '0.875rem'
      }}
    >
      {availableItems.map((item) => (
        <ItemDisplay key={item.name} item={item} />
      ))}
    </Box>
  </Paper>
</Box>
}

function ItemDisplay({item}: {item: ApiResponse}) {
  // display the item name, image, and location
  // use material ui components
  return <div>
    <Typography variant="h6">{item.name}</Typography>
    <img src={item.image_url} alt={item.name} />
    <Typography variant="body1">{item.location}</Typography>
  </div>
}

function FishDisplay() {
  return <CollectionDisplay name="Fish" hook={useFishData} />
}

function BugDisplay() {
  return <CollectionDisplay name="Bug" hook={useBugData} />
}

function SeaCreatureDisplay() {
  return <CollectionDisplay name="Sea Creature" hook={useSeaCreatureData} />
}


function AppContent() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ACNH Collection Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <DateTime />
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Animal Crossing: New Horizons
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Animal Crossing: New Horizons Collection Tracker
        </Typography>

        <FishDisplay />
        <BugDisplay />
        <SeaCreatureDisplay />
      </Container>
    </Box>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
