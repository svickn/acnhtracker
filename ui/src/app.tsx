
import {
  Container,
  Typography,
  AppBar,
  Box,
  Toolbar
} from '@mui/material'
import { DateTime } from './components/date-time'
import { FishDisplay, BugDisplay, SeaCreatureDisplay } from './components/item-display'
import { ProfileSelector } from './components/profile-selector'
import { AppProvider } from './contexts/app-provider'
import { Route, Switch } from 'wouter'




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
        <ProfileSelector />
        <Switch>
          <Route path="/" component={FishDisplay} />
          <Route path="/bugs" component={BugDisplay} />
          <Route path="/sea-creatures" component={SeaCreatureDisplay} />
        </Switch>
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
