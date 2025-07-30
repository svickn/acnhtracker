import React from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Paper,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material'
// import { GitHub as GitHubIcon } from '@mui/icons-material'
import { useFishData } from './api'

function App() {
  const [count, setCount] = React.useState(0)
  const { response, error, loading } = useFishData()

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
          Error loading fish data: {error}
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
          {/* GitHub icon button removed temporarily */}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Animal Crossing: New Horizons
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Fish Collection Tracker
        </Typography>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Counter Example
              </Typography>
              <Button
                variant="contained"
                onClick={() => setCount((count) => count + 1)}
                sx={{ mb: 2 }}
              >
                Count is {count}
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fish Data
            </Typography>
            <Chip 
              label={`${Array.isArray(response) ? response.length : 0} fish found`}
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
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default App
