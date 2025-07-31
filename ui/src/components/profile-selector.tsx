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
  Divider
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
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Profiles
      </Typography>
      
      {/* Current Profile Display */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Current Profile
        </Typography>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') handleCancelEdit()
              }}
              autoFocus
            />
            <Button size="small" variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button size="small" variant="outlined" onClick={handleCancelEdit}>
              Cancel
            </Button>
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

      <Divider sx={{ my: 2 }} />

      {/* Profile List */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          All Profiles
        </Typography>
        <List dense>
          {profiles.map((profile, index) => (
            <ListItem 
              key={profile.id}
              sx={{
                bgcolor: index === currentProfileIndex ? 'primary.light' : 'transparent',
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemText primary={profile.name} />
              {index !== currentProfileIndex && (
                <ListItemSecondaryAction>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setCurrentProfile(index)}
                    sx={{ mr: 1 }}
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

      <Divider sx={{ my: 2 }} />

      {/* Add New Profile */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Add New Profile
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Profile name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddProfile()
            }}
            sx={{ flex: 1 }}
          />
          <Button 
            size="small" 
            variant="contained" 
            onClick={handleAddProfile}
            startIcon={<AddIcon />}
          >
            Add Profile
          </Button>
        </Box>
      </Box>
    </Paper>
  )
} 