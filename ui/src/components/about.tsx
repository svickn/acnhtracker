import { Box, Typography, Paper, Container, Link } from '@mui/material'
import { Info } from '@mui/icons-material'

export function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Info sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              About NookTracker
            </Typography>
          </Box>
          
          <Typography variant="h6" component="h2" gutterBottom color="primary.main">
            NookTracker.com
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Your comprehensive Animal Crossing: New Horizons companion app for tracking fish, bugs, and sea creatures.
          </Typography>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Powered by
            </Typography>
            <Link 
              href="https://nookipedia.com/api/" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Nookipedia API
            </Link>
            
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              All data and images are provided by{' '}
              <Link 
                href="https://nookipedia.com" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                nookipedia.com
              </Link>
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            NookTracker is not affiliated with Nintendo or Animal Crossing. 
            This is a fan-made application for educational and entertainment purposes.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
} 