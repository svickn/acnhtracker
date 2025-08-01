
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { FishDisplay, BugDisplay, SeaCreatureDisplay } from './components/collection-display'
import { ProfileSelector } from './components/profile-selector'
import { AppProvider } from './contexts/app-provider'
import { Route, HashRouter, Routes } from 'react-router'
import { NavBar } from './components/nav-bar'

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
        {/* DateTime component is now part of NavBar */}
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
          <Routes>
            <Route path="/profile" element={<ProfileSelector />} />
            <Route path="/" element={<FishDisplay />} />
            <Route path="/bugs" element={<BugDisplay />} />
            <Route path="/sea-creatures" element={<SeaCreatureDisplay />} />
          </Routes>
        </Box>
      </Container>
    </Box>
  )
}

function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </HashRouter>
  )
}

export default App
