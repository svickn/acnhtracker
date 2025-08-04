import React from "react"
import { Typography, Box, useTheme, useMediaQuery, Chip, IconButton, Button } from "@mui/material"
import { OpenInNew } from "@mui/icons-material"

import type { ApiResponse, ItemSize, ItemType } from "../api/types"
import { useRegion } from "../hooks/use-region"
import { useDateAndTime } from "../hooks/use-date-time"
import { useItemTracking } from "../hooks/use-item-tracking"
import { capitalizeFirstLetter } from "../api/utils"

export type ItemDisplayProps = {
  item: ApiResponse
  itemType: ItemType
}

function shadowSizeImage(shadowSize: ItemSize) {
  const imageName = shadowSize?.includes('finned') ? 'Finned' : shadowSize?.replace(' ','_').replace('__','_') ?? '';
  return `images/128px-${imageName}_NH_Fish_Shadow.png`;
}

function DetailTypography({children}: {children: React.ReactNode}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
  <Typography 
  variant={isMobile ? "body2" : "body1"}
  color="text.secondary"
  sx={{ textAlign: 'center' }}
>
  {children}
  </Typography>
  )
}

export function DetailsComponent({item, itemType}: ItemDisplayProps) {
  const [region] = useRegion()
  const [dateAndTime] = useDateAndTime()
  const itemRegion = region === 'north' ? item.north : item.south;

  return (
    <>
      {itemType !== 'sea-creature' && (
        <DetailTypography>
          Location: {item.location}
        </DetailTypography>
      )}
      {itemType === 'fish' && (
        <DetailTypography>
          Shadow Size: {item.shadow_size}
        </DetailTypography>
      )}
      <DetailTypography>
        Months: {itemRegion.months}
      </DetailTypography>
      <DetailTypography>
        Hours (Today): {itemRegion.times_by_month[dateAndTime.getMonth() + 1]}
      </DetailTypography>
    </>
  )
}

function TrackingButtons({item, itemType}: ItemDisplayProps) {
  const { getTracking, setTracking } = useItemTracking(itemType)
  const tracking = getTracking(item.number.toString())
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleCaughtToggle = () => {
    const newTracking = {
      caught: !tracking?.caught,
      donated: tracking?.donated || false
    }
    setTracking(item.number.toString(), newTracking)
  }

  const handleDonatedToggle = () => {
    const newTracking = {
      caught: tracking?.caught || false,
      donated: !tracking?.donated
    }
    setTracking(item.number.toString(), newTracking)
  }
  return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 1,
        mt: isMobile ? 1 : 1.5,
        justifyContent: 'center'
      }}>
        <Button
          variant={tracking?.caught ? "contained" : "outlined"}
          color={tracking?.caught ? "success" : "primary"}
          onClick={handleCaughtToggle}
          size={isMobile ? "medium" : "small"}
          sx={{
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '120px'
          }}
        >
          {tracking?.caught ? "Caught!" : "Not Caught"}
        </Button>
        <Button
          variant={tracking?.donated ? "contained" : "outlined"}
          color={tracking?.donated ? "success" : "primary"}
          onClick={handleDonatedToggle}
          size={isMobile ? "medium" : "small"}
          sx={{
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '120px'
          }}
        >
          {tracking?.donated ? "Donated!" : "Not Donated"}
        </Button>
      </Box>
  )
}

function ItemHeader({item, itemType}: ItemDisplayProps) {
  const [region] = useRegion()
  const [dateAndTime] = useDateAndTime()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const itemRegion = region === 'north' ? item.north : item.south;
  const leavingSoon = !itemRegion.months_array.includes(dateAndTime.getMonth() + 2);
  const availableThisMonth = itemRegion.months_array.includes(dateAndTime.getMonth() + 1);

  return (
    <>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      mb: isMobile ? 0.5 : 1 
    }}>
      <IconButton
        size="small"
        onClick={() => window.open(item.url, '_blank')}
        sx={{ 
          p: 0.5,
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main'
          }
        }}
      >
        <OpenInNew fontSize="small" />
      </IconButton>
      <Typography 
        variant={isMobile ? "subtitle1" : "h6"} 
      >
        {capitalizeFirstLetter(item.name)}
      </Typography>
      { availableThisMonth && (
        <Chip 
          label="Here This Month" 
          size="small" 
          color="success" 
          variant="outlined"
        />
      )}
      {availableThisMonth && leavingSoon && (
        <Chip 
          label="Leaving Soon" 
          size="small" 
          color="warning" 
          variant="outlined"
        />
      )}
    </Box>
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
      {itemType === 'fish' && (
        <img         
        src={shadowSizeImage(item.shadow_size)} 
        alt={item.shadow_size} 
        style={{
          maxWidth: isSmallMobile ? '100px' : isMobile ? '120px' : '150px',
          height: 'auto',
          borderRadius: '4px'
        }}/>
      )}
    </Box>
    </>
  )
}

export function ItemDisplay(props: ItemDisplayProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ 
      mb: isMobile ? 1.5 : 2,
      p: isMobile ? 1 : 1.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      backgroundColor: 'background.paper'
    }}>
      <ItemHeader {...props} />
      <DetailsComponent {...props} />
      <TrackingButtons {...props} />
    </Box>
  )
}