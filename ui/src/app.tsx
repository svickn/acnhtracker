
import {
  Container,
  Typography,
  AppBar,
  Box,
  Toolbar,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { DateTime } from './components/date-time'
import { FishDisplay, BugDisplay, SeaCreatureDisplay } from './components/item-display'
import { ProfileSelector } from './components/profile-selector'
import { AppProvider } from './contexts/app-provider'
import { Route, Switch } from 'wouter'

function AppContent() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%'
    }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            ACNH Collection Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: isMobile ? 1 : 2,
        mb: isMobile ? 1 : 2
      }}>
        <DateTime />
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          mt: isMobile ? 2 : 4, 
          mb: isMobile ? 2 : 4,
          px: isSmallMobile ? 2 : 3
        }}
      >
        <Typography 
          variant={isSmallMobile ? "h4" : isMobile ? "h3" : "h2"} 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ mb: isMobile ? 2 : 3 }}
        >
          Animal Crossing: New Horizons
        </Typography>
        <Typography 
          variant={isSmallMobile ? "h6" : isMobile ? "h5" : "h4"} 
          component="h2" 
          gutterBottom 
          align="center" 
          color="text.secondary"
          sx={{ mb: isMobile ? 3 : 4 }}
        >
          Animal Crossing: New Horizons Collection Tracker
        </Typography>
        <Box sx={{ mb: isMobile ? 3 : 4 }}>
          <ProfileSelector />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Switch>
            <Route path="/" component={FishDisplay} />
            <Route path="/bugs" component={BugDisplay} />
            <Route path="/sea-creatures" component={SeaCreatureDisplay} />
          </Switch>
        </Box>
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
