import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

function LoadingCircular({baseHeight}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={baseHeight || "90vh"}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

export default LoadingCircular