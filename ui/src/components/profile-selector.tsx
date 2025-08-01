import { useState, useRef } from 'react'
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
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, FileDownload as ExportIcon, FileUpload as ImportIcon } from '@mui/icons-material'
import { useAppContext } from '../contexts/app-context'
import type { Profile } from '../contexts/app-context'

export function ProfileSelector() {
  const { 
    profiles, 
    currentProfileIndex, 
    currentProfile, 
    addProfile, 
    removeProfile, 
    setCurrentProfile,
    updateCurrentProfile,
    exportProfile,
    importProfile,
    addImportedProfile
  } = useAppContext()
  
  const [newProfileName, setNewProfileName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [overwriteDialogOpen, setOverwriteDialogOpen] = useState(false)
  const [profileToOverwrite, setProfileToOverwrite] = useState<{ profile: Profile; existingIndex: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setProfileToDelete(index)
      setDeleteDialogOpen(true)
    }
  }

  const confirmDelete = () => {
    if (profileToDelete !== null) {
      removeProfile(profileToDelete)
      setDeleteDialogOpen(false)
      setProfileToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setProfileToDelete(null)
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

  const handleExportProfile = () => {
    exportProfile(currentProfileIndex)
  }

  const handleImportProfile = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const result = await importProfile(file)
        
        if (result.needsOverwrite) {
          // Show overwrite confirmation dialog
          setProfileToOverwrite({
            profile: result.profile,
            existingIndex: result.existingProfileIndex!
          })
          setOverwriteDialogOpen(true)
        } else {
          // Add new profile directly
          addImportedProfile(result.profile)
          setImportError(null)
        }
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to import profile')
      }
      // Reset the input
      event.target.value = ''
    }
  }

  const handleCloseError = () => {
    setImportError(null)
  }

  const handleConfirmOverwrite = () => {
    if (profileToOverwrite) {
      addImportedProfile(profileToOverwrite.profile, profileToOverwrite.existingIndex)
      setOverwriteDialogOpen(false)
      setProfileToOverwrite(null)
      setImportError(null)
    }
  }

  const handleCancelOverwrite = () => {
    setOverwriteDialogOpen(false)
    setProfileToOverwrite(null)
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

      {/* Export/Import Section */}
      <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
        <Typography variant={isMobile ? "body1" : "subtitle1"} gutterBottom>
          Export / Import
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          flexDirection: isSmallMobile ? 'column' : 'row',
          '& > *': { width: isSmallMobile ? '100%' : 'auto' }
        }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleExportProfile}
            startIcon={<ExportIcon />}
            fullWidth={isSmallMobile}
          >
            {isSmallMobile ? 'Export' : 'Export Profile'}
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleImportProfile}
            startIcon={<ImportIcon />}
            fullWidth={isSmallMobile}
          >
            {isSmallMobile ? 'Import' : 'Import Profile'}
          </Button>
        </Box>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".nt,.json"
          style={{ display: 'none' }}
        />
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

      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{profileToDelete !== null ? profiles[profileToDelete]?.name : ''}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Overwrite Confirmation Dialog */}
      <Dialog
        open={overwriteDialogOpen}
        onClose={handleCancelOverwrite}
        aria-labelledby="overwrite-dialog-title"
        aria-describedby="overwrite-dialog-description"
      >
        <DialogTitle id="overwrite-dialog-title">Profile Already Exists</DialogTitle>
        <DialogContent>
          <DialogContentText id="overwrite-dialog-description">
            A profile with the same ID already exists: "{profileToOverwrite ? profiles[profileToOverwrite.existingIndex]?.name : ''}". 
            Do you want to overwrite the existing profile with the imported data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelOverwrite} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmOverwrite} color="warning" variant="contained">
            Overwrite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!importError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {importError}
        </Alert>
      </Snackbar>
    </Paper>
  )
} 