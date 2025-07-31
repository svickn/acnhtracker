// A component that displays the current date andtime based on the user's region and time zone
// also allows the user to  change to a different date and time

import { useState } from 'react'
import { Box, Button, Typography, Modal, useTheme, useMediaQuery, IconButton } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useDateAndTime } from '../hooks/use-date-time'
import { useRegion } from '../hooks/use-region'
import { Edit, SwapHoriz } from '@mui/icons-material'

interface DateTimeEditModalProps {
  open: boolean
  onClose: () => void
}

export const DateTimeEditModal = ({ open, onClose }: DateTimeEditModalProps) => {
  const [dateAndTime, setDateAndTime, clearDateAndTime] = useDateAndTime()
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dateAndTime ? dayjs(dateAndTime) : dayjs())

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleSave = () => {
    if (selectedDateTime) {
      const newDate = selectedDateTime.toDate()
      setDateAndTime(newDate)
    }
    onClose()
  }

  const handleUseCurrent = () => {
    clearDateAndTime()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="datetime-modal-title"
      aria-describedby="datetime-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isSmallMobile ? '90%' : isMobile ? 350 : 400,
        maxWidth: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: isMobile ? 3 : 4,
        borderRadius: 2,
      }}>
        <Typography 
          id="datetime-modal-title" 
          variant={isMobile ? "h6" : "h5"} 
          component="h2" 
          sx={{ mb: isMobile ? 1.5 : 2 }}
        >
          Select Date and Time
        </Typography>
        <DateTimePicker
          label="Date and Time"
          value={selectedDateTime}
          onChange={(newValue) => setSelectedDateTime(newValue)}
          sx={{ width: '100%', mb: isMobile ? 1.5 : 2 }}
        />
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          justifyContent: 'flex-end',
          flexDirection: isSmallMobile ? 'column' : 'row'
        }}>
          <Button 
            onClick={onClose}
            size={isMobile ? "small" : "medium"}
            fullWidth={isSmallMobile}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUseCurrent}
            size={isMobile ? "small" : "medium"}
            fullWidth={isSmallMobile}
          >
            Use Current
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            size={isMobile ? "small" : "medium"}
            fullWidth={isSmallMobile}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export const DateTime = () => {
  const theme = useTheme()
  const [dateAndTime] = useDateAndTime()
  const [region, setRegion] = useRegion()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [dateTimeModalOpen, setDateTimeModalOpen] = useState(false)

  const handleDateTimeClick = () => {
    setDateTimeModalOpen(true)
  }

  const handleDateTimeClose = () => {
    setDateTimeModalOpen(false)
  }

  const handleSwapRegion = () => {
    setRegion(region === 'north' ? 'south' : 'north')
  }

  return (
    <>
      
          {/* Date/Time Menu Item */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography 
              variant={isSmallMobile ? "body2" : isMobile ? "body1" : "h6"}
              sx={{ 
                fontWeight: 'medium',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={handleDateTimeClick}
            >
              {dayjs(dateAndTime).format('MMMM D, h:mm A')}
            </Typography>
            <IconButton
              size="small"
              onClick={handleDateTimeClick}
              sx={{ 
                p: 0.5,
                color: 'inherit',
                '&:hover': { opacity: 0.8 }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          {/* Region Menu Item */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography 
              variant={isSmallMobile ? "body2" : isMobile ? "body1" : "h6"}
              sx={{ 
                fontWeight: 'medium',
                cursor: 'pointer',
                textTransform: 'capitalize',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={handleSwapRegion}
            >
              {region}
            </Typography>
            <IconButton
              size="small"
              onClick={handleSwapRegion}
              sx={{ 
                p: 0.5,
                color: 'inherit',
                '&:hover': { opacity: 0.8 }
              }}
            >
              <SwapHoriz fontSize="small" />
            </IconButton>
          </Box>

      
      {/* Date/Time Edit Modal */}
      <DateTimeEditModal open={dateTimeModalOpen} onClose={handleDateTimeClose} />
    </>
  )
}