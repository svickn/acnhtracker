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

function App() {
  const { response: fishResponse, error: fishError, loading: fishLoading } = useFishData()
  const { response: bugResponse, error: bugError, loading: bugLoading } = useBugData()
  const { response: seaResponse, error: seaError, loading: seaLoading } = useSeaCreatureData()

  if (fishLoading || bugLoading || seaLoading) {
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

  if (fishError || bugError || seaError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {fishError || bugError || seaError}
        </Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ACNH Fish Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Animal Crossing: New Horizons
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Animal Crossing: New Horizons Collection Tracker
        </Typography>

        {[{name: "Fish", collection: fishResponse}, {name: "Bugs", collection: bugResponse}, {name: "Sea Creatures", collection: seaResponse}].map(({name, collection}) => (
        <Box sx={{ mt: 3 }} key={name}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {name} Collection
            </Typography>
            <Chip 
              label={`${Array.isArray(collection) ? collection.length : 0} ${name} found`}
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
              <pre>{JSON.stringify(collection, null, 2)}</pre>
            </Box>
          </Paper>
        </Box>))}
      </Container>
    </Box>
  )
}

export default App
