import { Box, Typography } from '@mui/material';
import { getYear } from 'date-fns';
import React from 'react';

const Footer = () => {
  return (
    <Box display="flex" flexDirection="row" sx={{ px: 3, position: 'absolute', bottom: '10px' }}>
      <Typography sx={{ letterSpacing: '2px' }}>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <Typography variant="span" color={'primary.main'}>
          The Claims Team
        </Typography>
        , All rights Reserved
      </Typography>
    </Box>
  );
};

export default Footer;
