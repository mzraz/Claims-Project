import React from 'react';
import { Grid, Typography, Box, Breadcrumbs, Link, Button } from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BreadcrumbNext = ({ subtitle, items, title, children, navigationURL }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(navigationURL);
  };

  return (
    <Grid
      container
      sx={{
        borderRadius: (theme) => theme.shape.borderRadius / 4,
        p: '15px 5px',
        pb: '5px',
        marginTop: '5px',
        marginBottom: '5px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Grid item xs={12} sm={6} lg={8} mb={0}>
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={handleBack}
          variant="outlined"
          color="primary"
          size="small"
          sx={{
            backgroundColor: '#fff !important',
          }}
        >
          Next
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} lg={4} display="flex" alignItems="flex-end">
        <Box
          sx={{
            display: { xs: 'none', md: 'block', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          {children && <Box sx={{ top: '0px', position: 'absolute' }}>{children}</Box>}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BreadcrumbNext;

{
  /* {children ? (
          <Box sx={{ top: '0px', position: 'absolute' }}>{children}</Box>
        ) : (
          <>
            <Box sx={{ top: '0px', position: 'absolute' }}>
              <img src={breadcrumbImg} alt={breadcrumbImg} width={'165px'} />
            </Box>
          </>
)} */
}
