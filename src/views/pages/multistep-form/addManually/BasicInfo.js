import { Box, Stack } from '@mui/system';
import React from 'react';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomPasswordField from '../../../../components/forms/theme-elements/CustomPasswordField';
import { InputAdornment } from '@mui/material';
import UploadAvatar from '../../../apps/user-profile/UploadAvatar';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const BasicInfo = ({ formik, avatarData, setAvatarData }) => {
  const currencySymbol = useSelector(
    (state) => state.loginReducer.user?.currencyData?.symbolNative,
  );
  return (
    <>
      <Stack direction="row" spacing={3}>
        {/* <Box className='flex items-end ' sx={{ width: "20%" }}>
                    <UploadAvatar avatarData={avatarData} setAvatarData={setAvatarData} h={70} w={70} />
                </Box> */}
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="firstName">
            First Name
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="firstName"
            variant="outlined"
            fullWidth
            name="firstName"
            inputProps={{ autoComplete: 'off' }}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="lastName">
            Last Name
            {/* <span style={{ color: "red", fontSize: "15px" }}>
                            *
                        </span> */}
          </CustomFormLabel>
          <CustomTextField
            id="lastName"
            variant="outlined"
            fullWidth
            name="lastName"
            inputProps={{ autoComplete: 'off' }}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="nickName">
            Nick Name
            {/* <span style={{ color: "red", fontSize: "15px" }}>
                            *
                        </span> */}
          </CustomFormLabel>
          <CustomTextField
            id="nickName"
            variant="outlined"
            fullWidth
            name="nickName"
            inputProps={{ autoComplete: 'off' }}
            value={formik.values.nickName}
            onChange={formik.handleChange}
            error={formik.touched.nickName && Boolean(formik.errors.nickName)}
            helperText={formik.touched.nickName && formik.errors.nickName}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="email">
            Email Address
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            name="email"
            inputProps={{ autoComplete: 'off' }}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Box>
      </Stack>

      {/* <Stack direction="row" spacing={3}>
                <Box sx={{ width: "100%" }}>
                    <CustomFormLabel htmlFor="password">
                        Password
                        <span style={{ color: "red", fontSize: "15px" }}>
                            *
                        </span>
                    </CustomFormLabel>
                    <CustomPasswordField id="password" variant="outlined" fullWidth
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                </Box>

                <Box sx={{ width: "100%" }}>
                    <CustomFormLabel htmlFor="confirmPassword">
                        Confirm Password
                        <span style={{ color: "red", fontSize: "15px" }}>
                            *
                        </span>
                    </CustomFormLabel>
                    <CustomPasswordField id="confirmPassword" variant="outlined" fullWidth
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                </Box>
            </Stack> */}

      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="contactNo">
            Contact Number
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="contactNo"
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{ autoComplete: 'off' }}
            name="contactNo"
            value={formik.values.contactNo}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
            helperText={formik.touched.contactNo && formik.errors.contactNo}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="hourlyRate">
            Hourly rate <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="hourlyRate"
            inputProps={{ autoComplete: 'off', step: 'any', min: 0 }}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <strong>{currencySymbol}</strong>
                </InputAdornment>
              ),
            }}
            type="number"
            name="hourlyRate"
            value={formik.values.hourlyRate}
            onChange={formik.handleChange}
            error={formik.touched.hourlyRate && Boolean(formik.errors.hourlyRate)}
            helperText={formik.touched.hourlyRate && formik.errors.hourlyRate}
          />
        </Box>
      </Stack>
    </>
  );
};

export default BasicInfo;
