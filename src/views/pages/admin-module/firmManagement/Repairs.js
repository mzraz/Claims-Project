import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Skeleton, Fade, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import {
  getAllCountries,
  getCompany,
  saveFirm,
  getAllCurrencies,
} from '../../../../store/admin/FirmSlice';
import { useTheme } from '@mui/material/styles';
import CountrySelect from './CountrySelector';
import { InputAdornment } from '@mui/material';
import { PhoneNumberUtil } from 'google-libphonenumber';
import UploadAvatar from '../../../apps/user-profile/UploadAvatar';
import { updateUserData } from '../../../../store/auth/login/LoginSlice';
import { updateProfileImageByUser } from '../../../../store/auth/userProfile/ProfileSlice';
import BreadcrumbNext from '../../../../layouts/full/shared/breadcrumb/BreadcrumbNext';

const validationSchema = () =>
  yup.object({
    name: yup
      .string()
      .required('Organization Name is Required')
      .min(2, 'Too Short!')
      .max(20, 'Too Long!'),
    type: yup
      .string()
      .required('Business type is Required')
      .min(2, 'Too Short!')
      .max(20, 'Too Long!'),
    url: yup
      .string()
      .matches(/^(ftp|http|https):\/\/[^ "]+$/, 'Enter a valid URL')
      .required('URL is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    countryId: yup.object().nullable().required('Country is Required'),
    contactNo: yup
      .string()
      .required('Contact number is Required')
      .test('is-phone-valid', 'Phone number is not valid', function (value) {
        const { countryId } = this?.parent;
        return countryId ? isPhoneValid(value, countryId) : false;
      }),
    currencyId: yup.object().nullable().required('Currency is Required'),
  });

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone, countryId) => {
  const fullNumber = '+' + countryId?.phoneCode + phone;
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(fullNumber));
  } catch (error) {
    return false;
  }
};

const FirmManagement = () => {
  const { user } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const theme = useTheme();
  const [countryList, setCountryList] = useState([]);
  const [avatarData, setAvatarData] = React.useState({
    preview:
      user.profileFileName ||
      `https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${user.targetFileName}`,
    file: null,
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      url: '',
      address: '',
      city: '',
      countryId: null,
      contactNo: '',
      firmId: user.firmId || '0',
      currencyId: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let formdata = new FormData();

      for (const key in values) {
        if (key === 'countryId') {
          formdata.append(key, values[key].id);
        } else if (key === 'currencyId') {
          formdata.append(key, values[key].id);
        } else {
          formdata.append(key, values[key]);
        }
      }

      let formDataImg = new FormData();
      formDataImg.append('file', avatarData.file);
      formDataImg.append('userId', user.id);

      // Handle profile image upload
      dispatch(updateProfileImageByUser(formDataImg))
        .then((result) => {
          if (result.payload.SUCCESS !== 1) {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
          });
        });

      // Save firm data and update user data on success
      dispatch(saveFirm(formdata))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            // Update all user data in one go
            dispatch(
              updateUserData({
                ...user,
                profileFileName: avatarData.preview,
                currencyData: values.currencyId,
                firmId: result.payload.DATA.id,
              }),
            );

            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE,
            });
            navigate(`/admin/addSchedule/${result.payload.DATA.id}`);
          } else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
          });
        });
    },
  });

  const fetchDataSequentially = async () => {
    try {
      // Step 1: Fetch Currencies
      const currenciesResult = await dispatch(getAllCurrencies());
      if (currenciesResult.payload.SUCCESS !== 1) {
        setAlert({
          open: true,
          severity: 'error',
          message: currenciesResult.payload,
        });
        return;
      }
      setCurrencies(currenciesResult.payload.DATA);

      // Step 2: Fetch Countries
      const countriesResult = await dispatch(getAllCountries());
      if (countriesResult.payload.SUCCESS !== 1) {
        setAlert({
          open: true,
          severity: 'error',
          message: countriesResult.payload,
        });
        return;
      }
      const allCountries = countriesResult.payload.DATA;
      setCountryList(allCountries);

      // Step 3: Fetch Firm Data
      const firmResult = await dispatch(getCompany());
      if (firmResult.payload.SUCCESS !== 1) {
        setAlert({
          open: true,
          severity: 'error',
          message: firmResult.payload,
        });
        return;
      }

      // Set firm data with access to both countries and currencies
      const firmData = firmResult.payload.DATA;
      if (firmData?.id) {
        formik.setValues({
          ...formik.values,
          name: firmData?.name,
          type: firmData?.type,
          url: firmData?.url,
          address: firmData?.address,
          countryId: allCountries.find((a) => a.id === firmData.countryId),
          city: firmData?.city,
          contactNo: firmData?.contactNo,
          firmId: firmData?.id,
          currencyId:
            currenciesResult.payload.DATA.find((c) => c.id === firmData.currencyId) || null,
        });

        dispatch(
          updateUserData({
            ...user,
            firmId: firmData?.id,
            companyId: firmData?.id,
          }),
        );
      }
    } catch (error) {
      setAlert({
        open: true,
        severity: 'error',
        message: error.USER_MESSAGE || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchDataSequentially();
  }, []);

  const BCrumb = [
    {
      to: '/admin',
      title: 'Admin',
    },
    {
      title: 'Firm Management',
    },
  ];

  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          justifyContent: 'space-between',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Breadcrumb title="Firm Management" items={BCrumb} />
        <BreadcrumbNext
          title="Firm Management"
          items={BCrumb}
          navigationURL={'/admin/inspection'}
        />
      </Box>

      {loading ? (
        <Box mt={5}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
              <Stack direction="row" alignItems="center">
                <Skeleton variant="circular" width={100} height={100} />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={3}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ width: '100%' }}>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="rounded" height={46} />
                </Box>
              ))}
            </Stack>
            <Stack direction="row" spacing={3}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ width: '100%' }}>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="rounded" height={46} />
                </Box>
              ))}
            </Stack>
            <Box>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="rounded" height={46} />
            </Box>
          </Stack>
        </Box>
      ) : (
        <Fade in>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <Stack>
                {/* <UploadAvatar avatarData={avatarData} setAvatarData={setAvatarData} /> */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: `3px solid ${theme.palette.primary.main}`,
                    paddingBottom: 2,
                    borderRadius: 0,
                    display: 'inline-block',
                    marginBottom: '30px',
                  }}
                >
                  Repairs
                </Typography>
                {/* First Row */}
                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="name">
                      Repairer
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      fullWidth
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="type">
                      Status
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="type"
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      error={formik.touched.type && Boolean(formik.errors.type)}
                      helperText={formik.touched.type && formik.errors.type}
                      fullWidth
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="url">
                      Date Repair Authorised
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="url"
                      name="url"
                      value={formik.values.url}
                      onChange={formik.handleChange}
                      error={formik.touched.url && Boolean(formik.errors.url)}
                      helperText={formik.touched.url && formik.errors.url}
                      fullWidth
                    />
                  </Box>
                </Stack>

                {/* Second Row */}
                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="countryId">
                      Date In
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CountrySelect
                      countries={countryList?.length > 0 ? countryList : []}
                      formik={formik}
                    />
                    <span style={{ color: '#FA896B', fontSize: '0.75rem' }}>
                      {formik.touched.countryId && formik.errors.countryId}
                    </span>
                  </Box>

                  <Box sx={{ width: '100%', opacity: !formik.values.countryId ? '.5' : null }}>
                    <CustomFormLabel htmlFor="city">
                      Date Out
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="city"
                      name="city"
                      disabled={!formik.values.countryId}
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                      fullWidth
                    />
                  </Box>

                  <Box sx={{ width: '100%', opacity: !formik.values.countryId ? '.5' : null }}>
                    <CustomFormLabel htmlFor="contactNo">
                      Satisfaction Note Signed
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="contactNo"
                      name="contactNo"
                      value={formik.values.contactNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                      helperText={formik.touched.contactNo && formik.errors.contactNo}
                      disabled={!formik.values.countryId}
                      fullWidth
                      type="tel"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span className="text-zinc-700 font-semibold border-r border-zinc-300 pr-2">
                              +{formik.values.countryId?.phoneCode}
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>

                {/* Third Row */}
                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="countryId">
                      Repair Amount
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CountrySelect
                      countries={countryList?.length > 0 ? countryList : []}
                      formik={formik}
                    />
                    <span style={{ color: '#FA896B', fontSize: '0.75rem' }}>
                      {formik.touched.countryId && formik.errors.countryId}
                    </span>
                  </Box>
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent="end" mt={4}>
                <Button color="primary" variant="contained" type="submit">
                  Submit
                </Button>
              </Stack>
            </Box>
          </form>
        </Fade>
      )}
    </>
  );
};

export default FirmManagement;
