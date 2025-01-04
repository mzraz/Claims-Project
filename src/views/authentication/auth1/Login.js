import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Stack, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg-v2.jpeg';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import { fontWeight } from '@mui/system';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import img2 from 'src/assets/images/backgrounds/logo-overlay.jpg';
import ColoredOverlay from './ColoredOverlay';

const Login = () => (
  <PageContainer title="Login" description="this is Login page">
    <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
      <Grid
        item
        xs={12}
        sm={12}
        lg={7}
        xl={7.5}
        sx={{
          position: 'relative',
          background: { img1 },
          height: '100vh',

          display: {
            xs: 'none',
            lg: 'block',
          },

          '&:before': {
            content: '""',
            background: `url(${img1})`,
            backgroundSize: 'cover',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '1',
          },
        }}
      >
        <Box position="relative" height={'100%'}>
          {/* <Box px={3}>
            <Logo />
          </Box> */}
          <Box
            sx={{ textShadow: '.3px .3px 1px black' }}
            className="absolute bottom-[12rem] left-[5rem] z-10 text-white max-w-[60%]"
          >
            <Typography variant="h1" mb={'2rem'} fontWeight={'900'}>
              Sign In to <span className="text-black">GBVR</span> <br />
              Claims and Repairs!
            </Typography>
            <Typography variant="h6">
              Welcome to the GBVR Admin Panel. Your gateway to streamlined Claiming and Repairing.
              Access your account effortlessly and stay on top of repairing with ease. Log in now
              and experience the power of automation!
            </Typography>
          </Box>
          <ColoredOverlay />
          <Box
            alignItems="center"
            justifyContent="center"
            height={'100%'}
            sx={{
              display: {
                xs: 'none',
                lg: 'block',
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
        width="100%"
      >
        <Box
          width={'100%'}
          sx={{
            p: {
              xs: 12,
              lg: '0 96px 0 96px',
            },
            px: {
              xs: 6,
            },
          }}
        >
          <AuthLogin
            title="Welcome to AutoBeatX"
            // subtext={
            //   <Typography variant="subtitle1" color="textSecondary" mb={1}>
            //     Your Admin Dashboard
            //   </Typography>
            // }
            subtitle={
              <Stack direction="row" spacing={1} mt={3} justifyContent={'center'}>
                <Typography color="textSecondary" variant="p" fontWeight="500">
                  New user?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/register"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Create an account
                </Typography>
              </Stack>
            }
          />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Login;
