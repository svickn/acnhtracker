import { Typography, Box, useTheme, useMediaQuery } from "@mui/material"

import type { ApiResponse } from "../api/types"
import { useRegion } from "../hooks/use-region"
import { useDateAndTime } from "../hooks/use-date-time"

export function ItemDisplay({item}: {item: ApiResponse}) {
  const [region] = useRegion()
  const [dateAndTime] = useDateAndTime()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const itemRegion = region === 'north' ? item.north : item.south;

  return (
    <Box sx={{ 
      mb: isMobile ? 1.5 : 2,
      p: isMobile ? 1 : 1.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      backgroundColor: 'background.paper'
    }}>
      <Typography 
        variant={isMobile ? "subtitle1" : "h6"} 
        sx={{ mb: isMobile ? 0.5 : 1 }}
      >
        {item.name}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: isMobile ? 0.5 : 1
      }}>
        <img 
          src={item.image_url} 
          alt={item.name} 
          style={{
            maxWidth: isSmallMobile ? '100px' : isMobile ? '120px' : '150px',
            height: 'auto',
            borderRadius: '4px'
          }}
        />
      </Box>
      <Typography 
        variant={isMobile ? "body2" : "body1"}
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Location: {item.location}
      </Typography>
      <Typography 
        variant={isMobile ? "body2" : "body1"}
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Times: {itemRegion.times_by_month[dateAndTime.getMonth() + 1]}
      </Typography>
    </Box>
  )
}