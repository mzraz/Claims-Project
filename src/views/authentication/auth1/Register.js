import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Typography, Stack } from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/sign-up-bg-v2.jpeg';
import Logo from 'src/layouts/full/shared/logo/Logo';

import AuthRegister from '../authForms/AuthRegister';
import ColoredOverlay from './ColoredOverlay';

const Register = () => (
  <PageContainer title="Register" description="this is Register page">
    <Grid container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}>
      <Grid
        item
        xs={12}
        sm={12}
        lg={7}
        xl={7.5}
        sx={{
          display: {
            xs: 'none',
            lg: 'block',
          },
          position: 'relative',
          background: { img1 },
          minHeight: '100vh',
          '&:before': {
            content: '""',
            background: `url(${img1})`,
            backgroundSize: 'cover',
            objectFit: 'cover',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '1',
          },
        }}
      >
        <Box position="relative" height={'100%'}>
          <Box
            sx={{ textShadow: '.3px .3px 1px black' }}
            className="absolute bottom-[12rem] left-[5rem] z-10 text-white max-w-[60%]"
          >
            <Typography variant="h1" mb={'2rem'} fontWeight={'900'}>
              Sign Up to <span className="text-black">GBVR</span> Claims and Repairs
            </Typography>
            <Typography variant="h6">
              Say goodbye to manual processes and hello to automated efficiency. Sign up now and
              experience seamless management of repairing!
            </Typography>
          </Box>
          <ColoredOverlay />

          {/* <Box px={3}>
            <Logo />
          </Box> */}

          {/* <Box className="absolute top-0 left-0 right-0 bottom-0 bg-[#2ADC68] opacity-60">

          </Box> */}

          <Box
            alignItems="center"
            justifyContent="center"
            height={'100%'}
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
              px: {
                xs: 6,
              },
            }}
          >
            {/* <img
              src={img1}
              alt="bg"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            /> */}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        lg={5}
        xl={4.5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box px={12} sx={{}} width={'100%'}>
          <AuthRegister
            title="Welcome to AutoBeatX"
            // subtext={
            //   <Typography variant="h6" color="primary">
            //     Please register for administrator and company <br /> account.
            //   </Typography>
            // }
            subtitle={
              <Stack direction="row" spacing={1} my={3} justifyContent={'center'}>
                <Typography color="textSecondary" variant="p" fontWeight="400">
                  Already have an Account?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/login"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Sign In
                </Typography>
              </Stack>
            }
          />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Register;
