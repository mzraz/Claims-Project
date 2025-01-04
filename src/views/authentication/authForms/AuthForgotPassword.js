import React, { useState } from 'react';
import { Button, Stack, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { sendResetLink } from '../../../store/auth/login/LoginSlice';
import { useDispatch } from 'react-redux';
import AlertMessage from '../../../components/shared/AlertMessage';

const validationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required')
});

const AuthForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(sendResetLink(values))
        .then((result) => {
          console.log(result)

          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE
            })

            setTimeout(() => {
              navigate('/auth/login')
            }, 3000)
          }
          else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload
            })
          }

        })
        .catch((err) => {
          console.log(err)
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.'
          })
        })
    },
  });

  return (
    <>
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      <form onSubmit={formik.handleSubmit}>
        <Stack mt={2} >
          <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
          <CustomTextField variant="outlined" fullWidth
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Stack mt={'3rem'} spacing={2}>
            <Button color="primary" variant="contained" size="large" fullWidth type='submit' >
              Send Reset Link
            </Button>
            <Button color="primary" variant="contained" size="large" fullWidth component={Link} to="/auth/login" >
              Back to Login
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  )
};

export default AuthForgotPassword;
