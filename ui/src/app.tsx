
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          pt: isMobile ? 10 : 8, // Add top padding to account for fixed NavBar
          pb: isMobile ? 2 : 4,
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
