import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';

const RedirectPage = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{mt: 8,display: 'flex',flexDirection: 'column',alignItems: 'center',textAlign: 'center',}}
      >
        <Typography variant="h4" gutterBottom>
          Profile Updated Successfully!
        </Typography>
        <CircularProgress sx={{ mt: 4, mb: 2 }} />
        <Typography variant="body1">
          Redirecting to homepage in {countdown} seconds...
        </Typography>
      </Box>
    </Container>
  );
};

export default RedirectPage;