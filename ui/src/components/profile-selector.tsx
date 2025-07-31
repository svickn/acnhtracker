import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useAppContext } from '../contexts/app-context'

export function ProfileSelector() {
  const { 
    profiles, 
    currentProfileIndex, 
    currentProfile, 
    addProfile, 
    removeProfile, 
    setCurrentProfile,
    updateCurrentProfile 
  } = useAppContext()
  
  const [newProfileName, setNewProfileName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      addProfile(newProfileName.trim())
      setNewProfileName('')
    }
  }

  const handleRemoveProfile = (index: number) => {
    if (profiles.length > 1) {
      removeProfile(index)
    }
  }

  const handleStartEdit = () => {
    setEditingName(currentProfile.name)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editingName.trim()) {
      updateCurrentProfile({ name: editingName.trim() })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingName('')
  }

  return (
    <Paper sx={{ p: isMobile ? 1.5 : 2, mb: isMobile ? 1.5 : 2 }}>
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        Profiles
      </Typography>
      
      {/* Current Profile Display */}
      <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
        <Typography variant={isMobile ? "body1" : "subtitle1"} gutterBottom>
          Current Profile
        </Typography>
        {isEditing ? (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            flexDirection: isSmallMobile ? 'column' : 'row',
            '& > *': { width: isSmallMobile ? '100%' : 'auto' }
          }}>
            <TextField
              size="small"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') handleCancelEdit()
              }}
              autoFocus
              fullWidth={isSmallMobile}
            />
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              width: isSmallMobile ? '100%' : 'auto'
            }}>
              <Button size="small" variant="contained" onClick={handleSaveEdit} fullWidth={isSmallMobile}>
                Save
              </Button>
              <Button size="small" variant="outlined" onClick={handleCancelEdit} fullWidth={isSmallMobile}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body1">{currentProfile.name}</Typography>
            <IconButton size="small" onClick={handleStartEdit}>
              <EditIcon />
            </IconButton>
            {profiles.length > 1 && (
              <IconButton 
                size="small" 
                onClick={() => handleRemoveProfile(currentProfileIndex)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      <Divider sx={{ my: isMobile ? 1.5 : 2 }} />

      {/* Profile List */}
      <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
        <Typography variant={isMobile ? "body1" : "subtitle1"} gutterBottom>
          All Profiles
        </Typography>
        <List dense>
          {profiles.map((profile, index) => (
            <ListItem 
              key={profile.id}
              sx={{
                bgcolor: index === currentProfileIndex ? 'primary.light' : 'transparent',
                borderRadius: 1,
                mb: 0.5,
                flexDirection: isSmallMobile ? 'column' : 'row',
                alignItems: isSmallMobile ? 'flex-start' : 'center'
              }}
            >
              <ListItemText 
                primary={profile.name} 
                sx={{ 
                  flex: 1,
                  mb: isSmallMobile ? 1 : 0
                }}
              />
              {index !== currentProfileIndex && (
                <ListItemSecondaryAction sx={{ 
                  position: isSmallMobile ? 'static' : 'absolute',
                  right: isSmallMobile ? 'auto' : 16,
                  top: isSmallMobile ? 'auto' : '50%',
                  transform: isSmallMobile ? 'none' : 'translateY(-50%)',
                  display: 'flex',
                  gap: 1,
                  width: isSmallMobile ? '100%' : 'auto'
                }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setCurrentProfile(index)}
                    sx={{ mr: isSmallMobile ? 0 : 1 }}
                    fullWidth={isSmallMobile}
                  >
                    Switch
                  </Button>
                  {profiles.length > 1 && (
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveProfile(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: isMobile ? 1.5 : 2 }} />

      {/* Add New Profile */}
      <Box>
        <Typography variant={isMobile ? "body1" : "subtitle1"} gutterBottom>
          Add New Profile
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          flexDirection: isSmallMobile ? 'column' : 'row',
          '& > *': { width: isSmallMobile ? '100%' : 'auto' }
        }}>
          <TextField
            size="small"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Profile name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddProfile()
            }}
            sx={{ flex: isSmallMobile ? 'none' : 1 }}
            fullWidth={isSmallMobile}
          />
          <Button 
            size="small" 
            variant="contained" 
            onClick={handleAddProfile}
            startIcon={<AddIcon />}
            fullWidth={isSmallMobile}
          >
            {isSmallMobile ? 'Add' : 'Add Profile'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
} 