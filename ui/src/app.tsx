
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
import { Route, Router, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { useDateAndTime } from './hooks/use-date-time'
import dayjs from 'dayjs'

function NavBar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [dateAndTime] = useDateAndTime()

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="div" 
          sx={{ flexGrow: 0 }}
        >
          ACNH Collection Tracker
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          flex: 1
        }}>
          <Typography 
            variant={isSmallMobile ? "body2" : isMobile ? "body1" : "h6"}
            sx={{ fontWeight: 'medium' }}
          >
            {dayjs(dateAndTime).format('MMMM D')}, {dayjs(dateAndTime).format('h:mm A')}
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 0, width: isMobile ? 0 : 'auto' }}>
          &nbsp;
          {/* Spacer to balance the layout */}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

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
      <NavBar />

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
        <Box sx={{ flex: 1 }}>
          <Switch>
            <Route path="/profile" component={ProfileSelector} />
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
  // if host does not contain localhost, use base /acnhtracker
  const base = window.location.host.includes('localhost') ? '' : '/acnhtracker'
  return (
    <Router base={base} hook={useHashLocation}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  )
}

export default App
