// A component that displays the current date andtime based on the user's region and time zone
// also allows the user to  change to a different date and time

import { useState } from 'react'
import { Box, Button, Typography, Modal, useTheme, useMediaQuery } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useDateAndTime } from '../hooks/use-date-time'
import { useRegion } from '../hooks/use-region'

export const DateTime = () => {
  const [dateAndTime, setDateAndTime, clearDateAndTime] = useDateAndTime()
  const [region, setRegion] = useRegion()
  const [open, setOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs())

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpen = () => {
    setSelectedDateTime(dayjs(dateAndTime))
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    if (selectedDateTime) {
      const newDate = selectedDateTime.toDate()
      setDateAndTime(newDate)
    }
    handleClose()
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: isMobile ? 1 : 1.5
    }}>
      {/* Format date like August 1st */}
      <Typography variant={isMobile ? "h6" : "h5"}>
        {dayjs(dateAndTime).format('MMMM D')}, {dayjs(dateAndTime).format('h:mm A')}
      </Typography>
      <Typography 
        variant={isMobile ? "body1" : "h6"} 
        sx={{ 
          textTransform: 'capitalize', 
          color: 'text.secondary',
          mb: isMobile ? 1 : 1.5
        }}
      >
        Region: {region}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        flexDirection: isSmallMobile ? 'column' : 'row',
        width: isSmallMobile ? '100%' : 'auto'
      }}>
        <Button 
          variant="contained" 
          onClick={handleOpen}
          size={isMobile ? "small" : "medium"}
          fullWidth={isSmallMobile}
        >
          Change Date and Time
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setRegion(region === 'north' ? 'south' : 'north')}
          size={isMobile ? "small" : "medium"}
          fullWidth={isSmallMobile}
        >
          Swap Region
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
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
              onClick={handleClose}
              size={isMobile ? "small" : "medium"}
              fullWidth={isSmallMobile}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {clearDateAndTime(); handleClose()}}
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
    </Box>
  )
}