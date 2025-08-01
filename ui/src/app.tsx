
import {
  Container,
  Typography,
  AppBar,
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { FishDisplay, BugDisplay, SeaCreatureDisplay } from './components/collection-display'
import { ProfileSelector } from './components/profile-selector'
import { AppProvider } from './contexts/app-provider'
import { Route, HashRouter, Routes } from 'react-router'
import { Menu as MenuIcon, Pets, BugReport, Water, Person } from '@mui/icons-material'
import { useState } from 'react'
import { DateTime } from './components/date-time'

function NavBar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNavigation = (path: string) => {
    window.location.hash = path
    handleMenuClose()
  }

  const menuItems = [
    { path: '/', label: 'Fish', icon: <Pets /> },
    { path: '/bugs', label: 'Bugs', icon: <BugReport /> },
    { path: '/sea-creatures', label: 'Sea Creatures', icon: <Water /> },
    { path: '/profile', label: 'Profile', icon: <Person /> }
  ]

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
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          flex: 1,
          justifyContent: 'center'
        }}>
          <DateTime />
        </Box>
        
        <Box sx={{ flexGrow: 0 }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            aria-controls={open ? 'navigation-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick}
            sx={{ 
              display: 'flex', // Show on all screen sizes for now
              ml: 1
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Menu
            id="navigation-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            sx={{ zIndex: 1001 }} // Ensure menu appears above AppBar
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                zIndex: 1001, // Ensure menu appears above AppBar
                width: isMobile ? '100vw' : 'auto',
                maxWidth: isMobile ? '100vw' : 'auto',
                left: isMobile ? '0 !important' : 'auto',
                right: isMobile ? '0 !important' : 'auto',
                borderRadius: isMobile ? 0 : 1,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: isMobile ? 'none' : 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  width: isMobile ? '100vw' : 'auto',
                  maxWidth: isMobile ? '100vw' : 'auto',
                }
              }
            }}
          >
            {menuItems.map((item) => (
              <MenuItem 
                key={item.path} 
                onClick={() => handleNavigation(item.path)}
                sx={{ 
                  minWidth: isMobile ? '100%' : 150,
                  py: isMobile ? 2 : 1,
                  px: isMobile ? 3 : 2,
                  borderBottom: isMobile ? '1px solid' : 'none',
                  borderColor: isMobile ? 'divider' : 'transparent',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: isMobile ? 48 : 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: isMobile ? '1.1rem' : 'inherit',
                      fontWeight: isMobile ? 500 : 'inherit'
                    }
                  }}
                />
              </MenuItem>
            ))}
          </Menu>
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
