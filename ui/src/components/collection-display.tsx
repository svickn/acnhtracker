import { useState } from "react"
import { useDateAndTime } from "../hooks/use-date-time"
import { useRegion } from "../hooks/use-region"
import { getCurrentlyAvailableItems } from "../api/utils"
import type { ApiData, ApiResponse, Region } from "../api/types"
import { useEffect } from "react"
import { Alert, Box, Chip, CircularProgress, Container, Paper, Typography } from "@mui/material"
import { ItemDisplay } from "./item-display"

export function CollectionDisplay({name, hook}: {name: string, hook: () => ApiData}) {
  const { response, error, loading } = hook()
  const [availableItems, setAvailableItems] = useState<ApiResponse[]>([])
  const [dateAndTime,,, month, time] = useDateAndTime()
  const [region] = useRegion()

  useEffect(() => {
    if (response) {
      const availableItems = getCurrentlyAvailableItems(response, region as Region, dateAndTime)
      setAvailableItems(availableItems)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, region, month, time])

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {error}
        </Alert>
      </Container>
    )
  }

  if (!response) {
    return <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        No data found
      </Alert>
    </Container>
  }

  const availableItemCount = availableItems.length

  return <Box sx={{ mt: 3 }} key={name}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      {name} Collection
    </Typography>
    <Chip 
      label={`${availableItemCount} ${name} found`}
      color="primary"
      sx={{ mb: 2 }}
    />
    <Box
      sx={{
        maxHeight: 400,
        overflow: 'auto',
        backgroundColor: 'grey.50',
        p: 2,
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '0.875rem'
      }}
    >
      {availableItems.map((item) => (
        <ItemDisplay key={item.name} item={item} />
      ))}
    </Box>
  </Paper>
</Box>
}