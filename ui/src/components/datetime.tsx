// A component that displays the current date andtime based on the user's region and time zone
// also allows the user to  change to a different date and time

import { useState } from 'react'
import { Box, Button, Typography, Modal } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useDateAndTime, useRegion } from '../hooks/useDateTime'

export const DateTime = () => {
  const [dateAndTime, setDateAndTime, clearDateAndTime] = useDateAndTime()
  const [region, setRegion] = useRegion()
  const [open, setOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs())

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Format date like August 1st */}
      <Typography variant="h6">{dayjs(dateAndTime).format('MMMM D')}, {dayjs(dateAndTime).format('h:mm:ss A')}</Typography>
      <Typography variant="h6" sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
        Region: {region}
      </Typography>
      <Button variant="contained" onClick={handleOpen}>Change Date and Time</Button>
      <Button variant="contained" onClick={() => setRegion(region === 'north' ? 'south' : 'north')}>Swap Region</Button>

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
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="datetime-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Select Date and Time
          </Typography>
            <DateTimePicker
              label="Date and Time"
              value={selectedDateTime}
              onChange={(newValue) => setSelectedDateTime(newValue)}
              sx={{ width: '100%', mb: 2 }}
            />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={() => {clearDateAndTime(); handleClose()}}>Use Current</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}