import React, { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { setOTPExpTime, signupUser } from '../../../store/auth/signup/SignupSlice';
import { useDispatch } from 'react-redux';
import AlertMessage from '../../../components/shared/AlertMessage';
import CustomPasswordField from '../../../components/forms/theme-elements/CustomPasswordField';
import logo from 'src/assets/images/backgrounds/GBVR.jpg';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .test('trim', 'First Name cannot have leading or trailing spaces', (value) => {
      if (value) {
        return value.trim() === value; // Check if trimmed value is same as original value
      }
      return true; // Allow empty value
    })
    .test(
      'no-extra-spaces',
      'First Name cannot have more than one space between characters',
      (value) => {
        if (value) {
          return !/\s{2,}/.test(value); // Check if there are no more than one space between characters
        }
        return true; // Allow empty value
      },
    )
    .required('First Name is Required')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!'),
  lastName: yup
    .string()
    .test('trim', 'Last Name cannot have leading or trailing spaces', (value) => {
      if (value) {
        return value.trim() === value; // Check if trimmed value is same as original value
      }
      return true; // Allow empty value
    })
    .test(
      'no-extra-spaces',
      'Last Name cannot have more than one space between characters',
      (value) => {
        if (value) {
          return !/\s{2,}/.test(value); // Check if there are no more than one space between characters
        }
        return true; // Allow empty value
      },
    )
    .required('Last Name is Required')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .required('Password is required'),
  confirmPassword: yup.string().when('password', {
    is: (val) => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf([yup.ref('password')], 'Both passwords need to be the same')
      .required('Confirm password is required'),
  }),
  // firmName: yup.string().required('Firm Name is Required').min(2, 'Too Short!').max(20, 'Too Long!')
});

const AuthRegister = ({ title, subtitle, subtext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userTypeId: '1',
      // firmName: '',
      // businessType: '',
      // firmURL: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(signupUser(values))
        .then((result) => {
          console.log(result, 'result');
          if (result.payload.SUCCESS === 1) {
            console.log(result.payload);
            setAlert({
              open: true,
              severity: 'success',
              message:
                result.payload.USER_MESSAGE ||
                'Verification code has been sent to your given email. Please verify!',
            });
            setTimeout(() => {
              navigate('/auth/two-steps', { state: { UUID: result.payload.DATA } });
            }, 3000);

            dispatch(setOTPExpTime(60));
          } else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
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
        <Typography fontWeight="700" variant="h3" mb={2}>
          {title}
        </Typography>
      ) : null} */}
      <Box className="flex justify-center my-[2rem]">
        <img src={logo} className="w-[220px]" />
      </Box>

      {subtext}
      {/* <AuthSocialButtons title="Sign up with" /> */}

      {/* <Box my={1} fullWidth>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box> */}

      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Stack mb={3}>
            <Stack sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <CustomFormLabel htmlFor="firstName" sx={{ marginTop: '10px' }}>
                  First Name
                  <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                </CustomFormLabel>
                <CustomTextField
                  id="firstName"
                  variant="outlined"
                  fullWidth
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Box>

              <Box sx={{ width: '100%' }}>
                <CustomFormLabel htmlFor="lastName" sx={{ marginTop: '10px' }}>
                  Last Name
                  <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                </CustomFormLabel>
                <CustomTextField
                  id="lastName"
                  variant="outlined"
                  fullWidth
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Box>
            </Stack>

            <Box sx={{ width: '100%' }}>
              <CustomFormLabel htmlFor="email" sx={{ marginTop: '10px' }}>
                Email Address
                <span style={{ color: 'red', fontSize: '15px' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Box>

            <Stack>
              <Box>
                <CustomFormLabel htmlFor="password" sx={{ marginTop: '10px' }}>
                  Password
                  <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                </CustomFormLabel>
                <CustomPasswordField
                  id="password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Box>

              <Box>
                <CustomFormLabel htmlFor="confirmPassword" sx={{ marginTop: '10px' }}>
                  Confirm Password
                  <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                </CustomFormLabel>
                <CustomPasswordField
                  id="confirmPassword"
                  variant="outlined"
                  fullWidth
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
              </Box>
            </Stack>

            {/* <Typography variant="h6" color="primary" mt={2}>
              Company details.
            </Typography> */}

            {/* <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <CustomFormLabel htmlFor="firmName">
                  Firm Name
                  <span style={{ color: "red", fontSize: "15px" }}>
                    *
                  </span>
                </CustomFormLabel>
                <CustomTextField sx={{ width: '220px' }} id="firmName" variant="outlined" fullWidth
                  name="firmName"
                  value={formik.values.firmName}
                  onChange={formik.handleChange}
                  error={formik.touched.firmName && Boolean(formik.errors.firmName)}
                  helperText={formik.touched.firmName && formik.errors.firmName}
                />
              </Box>

              <Box sx={{ width: '100%' }}>
                <CustomFormLabel htmlFor="businessType">
                  Business Type
                  <span style={{ color: "white", fontSize: "15px" }}>
                    *
                  </span>
                </CustomFormLabel>
                <CustomTextField sx={{ width: '220px' }} id="businessType" variant="outlined" fullWidth
                  name="businessType"
                  value={formik.values.businessType}
                  onChange={formik.handleChange}
                  error={formik.touched.businessType && Boolean(formik.errors.businessType)}
                  helperText={formik.touched.businessType && formik.errors.businessType}
                />
              </Box>
            </Stack> */}

            {/* <CustomFormLabel htmlFor="firmURL">Firm URL</CustomFormLabel>
            <CustomTextField id="firmURL" variant="outlined" fullWidth
              name="firmURL"
              value={formik.values.firmURL}
              onChange={formik.handleChange}
              error={formik.touched.firmURL && Boolean(formik.errors.firmURL)}
              helperText={formik.touched.firmURL && formik.errors.firmURL}
            /> */}
          </Stack>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Get Verification Code
          </Button>
        </Box>
        {subtitle}
      </form>
    </>
  );
};

export default AuthRegister;
