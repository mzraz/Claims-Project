import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import logo from 'src/assets/images/backgrounds/GBVR.jpg';

import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

import AuthSocialButtons from './AuthSocialButtons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { loginUser } from '../../../store/auth/login/LoginSlice';
import { useDispatch } from 'react-redux';
import AlertMessage from '../../../components/shared/AlertMessage';
import CustomPasswordField from '../../../components/forms/theme-elements/CustomPasswordField';

const validationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup.string('Enter your password').required('Password is required'),
});

const AuthLogin = ({ title, subtitle, subtext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: 'Login successful',
            });
            const user = result.payload.DATA;
            const modules = [
              ...new Set(user.userFeatures.map((feature) => feature.featureGroupLabel)),
            ];

            // Create menu items based on modules and sort them
            const sortedMenuItems = modules
              .map((module) => {
                const feature = user.userFeatures.find((f) => f.featureGroupLabel === module);
                return {
                  id: module,
                  title: module,
                  icon: iconMap[feature.featureGroupIcon] || IconSettings2,
                  href: feature.featureGroupURL,
                  featureGroupId: feature.featureGroupId, // Add this for sorting
                };
              })
              .sort((a, b) => a.featureGroupId - b.featureGroupId);

            console.log(sortedMenuItems);
            if (result.payload.DATA.isCompanyProfileCompleted) {
              navigate('/');
            } else {
              navigate('/admin/add-companies');
            }

            // if (
            //   result.payload.DATA.isAdmin === 0 &&
            //   result.payload.DATA.isUserProfileReviewed === 0
            // ) {
            //   navigate("/user-profile");
            // } else if (
            //   result.payload.DATA.isAdmin === 0 &&
            //   result.payload.DATA.isUserProfileReviewed === 1
            // ) {
            //   navigate("/");
            // } else if (
            //   result.payload.DATA.isAdmin === 1 &&
            //   result.payload.DATA.isUserProfileReviewed === 0
            // ) {
            //   navigate("/user-profile");
            // } else if (
            //   result.payload.DATA.isAdmin === 1 &&
            //   result.payload.DATA.isFirmProfileReviewed === 0
            // ) {
            //   navigate("/admin/add-companies");
            // } else if (
            //   result.payload.DATA.isAdmin === 1 &&
            //   result.payload.DATA.isFirmProfileReviewed === 1
            // ) {
            //   navigate("/");
            // } else {
            //   navigate("/");
            // }
          } else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((error) => {
          setAlert({
            open: true,
            severity: 'error',
            message: 'Something went wrong.',
          });
        });
    },
  });

  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      {/* {title ? (
        <Typography fontWeight="700" variant="h3" mb={1} textAlign={'center'}>
          {title}
        </Typography>
      ) : null} */}
      <Box className="flex justify-center mb-[2.5rem]">
        <img src={logo} className="w-[220px]" />
      </Box>

      {subtext}

      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
            <CustomTextField
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <EmailIcon fontSize='small' color='primary' />
              //     </InputAdornment>
              //   ),
              // }}
              variant="outlined"
              fullWidth
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomPasswordField
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <EmailIcon fontSize='small' color='primary' />
              //     </InputAdornment>
              //   ),
              // }}
              variant="outlined"
              fullWidth
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remember this Device"
              />
            </FormGroup>
            {/* <Typography
              component={Link}
              to="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Forgot Password ?
            </Typography> */}
          </Stack>
        </Stack>
        <Box mt={2}>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Sign In
          </Button>
        </Box>
        {/* <Box mt={3}>
          <Divider>
            <Typography
              component="span"
              color="textSecondary"
              variant="h6"
              fontWeight="400"
              position="relative"
              px={2}
            >
              or
            </Typography>
          </Divider>
        </Box>
        <AuthSocialButtons title="Sign in with" /> */}
      </form>
      {subtitle}
    </>
  );
};

export default AuthLogin;
