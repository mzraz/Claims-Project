import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import {
  Stack,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Tooltip,
  IconButton,
  MenuItem,
  Divider,
  Paper,
  TextField,
  Fade,
  Skeleton,
  Grid,
  Checkbox,
  Collapse,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import { Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { useDispatch } from 'react-redux';
import { getFirmSchedule, saveFirmSchedule } from '../../../../store/admin/FirmSlice';

const FirmSchedulePicker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const { user } = useSelector((state) => state.loginReducer);
  const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const roundingOptions = [
    { value: 'nearest', label: 'Round to nearest interval' },
    { value: 'up', label: 'Always round up' },
    { value: 'down', label: 'Always round down' },
  ];

  const incrementOptions = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
  ];

  const setFetchedSchedule = (data) => {
    formik.setValues({
      ...formik.values,
      workStartTime: dayjs(data.startTime.join(':'), 'HH:mm'),
      workEndTime: dayjs(data.endTime.join(':'), 'HH:mm'),
      breakStartTime: dayjs(data.breakStartTime.join(':'), 'HH:mm'),
      breakEndTime: dayjs(data.breakEndTime.join(':'), 'HH:mm'),
      selectedDays: data.weekDays.map((day) => dayIds.find((d) => d.id === day.id).name),
      enableGracePeriod: data.enableGracePeriod || false,
      clockInGracePeriod: data.clockInGracePeriod || 10,
      clockOutGracePeriod: data.clockOutGracePeriod || 10,
      roundToShiftStart: data.roundToShiftStart || false,
      roundToShiftEnd: data.roundToShiftEnd || false,
      shiftStartRoundingIncrement: data.shiftStartRoundingIncrement || 15,
      shiftEndRoundingIncrement: data.shiftEndRoundingIncrement || 15,
      shiftStartRoundingDirection: data.shiftStartRoundingDirection || 'nearest',
      shiftEndRoundingDirection: data.shiftEndRoundingDirection || 'nearest',
    });
  };

  useEffect(() => {
    let formdata = new FormData();
    formdata.append('companyId', firmId);

    dispatch(getFirmSchedule(formdata))
      .then((result) => {
        if (result.payload.SUCCESS) {
          setLoading(false);
        }
        if (result.payload.SUCCESS === 1 && result.payload.DATA.length > 0) {
          setFetchedSchedule(result.payload.DATA[0]);
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || "Couldn't fetch schedule. Make sure it exists.",
        });
      });
  }, []);

  const dayIds = daysOfWeek.map((day, index) => ({ id: index + 1, name: day }));

  const formik = useFormik({
    initialValues: {
      workStartTime: dayjs('2022-04-17T09:00'),
      workEndTime: dayjs('2022-04-17T17:00'),
      breakStartTime: dayjs('2022-04-17T13:00'),
      breakEndTime: dayjs('2022-04-17T14:00'),
      selectedDays: daysOfWeek,
      enableGracePeriod: false,
      clockInGracePeriod: 10,
      clockOutGracePeriod: 10,
      roundToShiftStart: false,
      roundToShiftEnd: false,
      shiftStartRoundingIncrement: 15,
      shiftEndRoundingIncrement: 15,
      shiftStartRoundingDirection: 'nearest',
      shiftEndRoundingDirection: 'nearest',
    },
    validationSchema: Yup.object({
      workStartTime: Yup.string().nullable().required('Start time is required'),
      workEndTime: Yup.string().nullable().required('End time is required'),
      breakStartTime: Yup.string().nullable().required('Break start time is required'),
      breakEndTime: Yup.string().nullable().required('Break end time is required'),
      selectedDays: Yup.array().min(1, 'Select at least one working day'),
      clockInGracePeriod: Yup.number().when('enableGracePeriod', {
        is: true,
        then: Yup.number()
          .min(1, 'Must be at least 1 minute')
          .max(60, 'Cannot exceed 60 minutes')
          .required('Required when grace period enabled'),
      }),
      clockOutGracePeriod: Yup.number().when('enableGracePeriod', {
        is: true,
        then: Yup.number()
          .min(1, 'Must be at least 1 minute')
          .max(60, 'Cannot exceed 60 minutes')
          .required('Required when grace period enabled'),
      }),
      shiftStartRoundingIncrement: Yup.number().when('roundToShiftStart', {
        is: true,
        then: Yup.number()
          .oneOf([5, 10, 15, 30], 'Select a valid rounding interval')
          .required('Required when rounding is enabled'),
      }),
      shiftEndRoundingIncrement: Yup.number().when('roundToShiftEnd', {
        is: true,
        then: Yup.number()
          .oneOf([5, 10, 15, 30], 'Select a valid rounding interval')
          .required('Required when rounding is enabled'),
      }),
    }),
    onSubmit: (values) => {
      const schedule = {
        startTime: dayjs(values.workStartTime).format('HH:mm'),
        endTime: dayjs(values.workEndTime).format('HH:mm'),
        breakStartTime: dayjs(values.breakStartTime).format('HH:mm'),
        breakEndTime: dayjs(values.breakEndTime).format('HH:mm'),
        weekdaysIdList: values.selectedDays.map((day) => dayIds.find((d) => d.name === day).id),
        companyId: firmId,
        enableGracePeriod: values.enableGracePeriod,
        clockInGracePeriod: values.clockInGracePeriod,
        clockOutGracePeriod: values.clockOutGracePeriod,
        roundToShiftStart: values.roundToShiftStart,
        roundToShiftEnd: values.roundToShiftEnd,
        shiftStartRoundingIncrement: values.shiftStartRoundingIncrement,
        shiftEndRoundingIncrement: values.shiftEndRoundingIncrement,
        shiftStartRoundingDirection: values.shiftStartRoundingDirection,
        shiftEndRoundingDirection: values.shiftEndRoundingDirection,
      };

      let formdata = new FormData();
      for (const key in schedule) {
        formdata.append(key, schedule[key]);
      }

      dispatch(saveFirmSchedule(formdata))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE,
            });

            if (user.isCompanyProfileCompleted) {
              setAlert({
                open: true,
                severity: 'success',
                message: 'Firm data saved.',
              });
              setTimeout(() => {
                navigate('/admin');
              }, 1000);
            } else {
              navigate(`/admin/addEmployees/${firmId}`);
            }
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

  const handleUserSelectedDays = (day) => {
    const { selectedDays } = formik.values;
    if (selectedDays.includes(day)) {
      formik.setFieldValue(
        'selectedDays',
        selectedDays.filter((d) => d !== day),
      );
    } else {
      formik.setFieldValue('selectedDays', [...selectedDays, day]);
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="text" width={500} height={24} />
        <Stack direction="row" spacing={4} mt={4}>
          <Box width="30%">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} variant="text" height={40} />
            ))}
          </Box>
          <Stack flex={1} spacing={3}>
            {[1, 2].map((section) => (
              <Box key={section}>
                <Skeleton variant="text" width={200} height={32} />
                <Stack direction="row" spacing={2} mt={2}>
                  <Skeleton variant="rounded" width={200} height={46} />
                  <Skeleton variant="rounded" width={200} height={46} />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Fade in>
      <form onSubmit={formik.handleSubmit}>
        <AlertMessage
          open={alert.open}
          setAlert={setAlert}
          severity={alert.severity}
          message={alert.message}
        />
        <Paper elevation={0} sx={{ p: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Standard Schedule Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Set the standard working hours and days for your organization. This schedule will be
            used as the default template for all employees.
          </Typography>

          <Stack direction="row" spacing={4} mb={4}>
            <Box sx={{ width: '30%' }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Working Days
              </Typography>
              <FormGroup>
                {daysOfWeek.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Switch
                        checked={formik.values.selectedDays.includes(day)}
                        onChange={() => handleUserSelectedDays(day)}
                      />
                    }
                    label={<Typography>{day}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>

            <Stack spacing={3} flex={1}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={2} mt={1}>
                  Working Hours
                </Typography>
                <Stack direction="row" spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="From"
                      value={formik.values.workStartTime}
                      onChange={(value) => formik.setFieldValue('workStartTime', value)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <TimePicker
                      label="To"
                      value={formik.values.workEndTime}
                      onChange={(value) => formik.setFieldValue('workEndTime', value)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Break Time
                </Typography>
                <Stack direction="row" spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="From"
                      value={formik.values.breakStartTime}
                      onChange={(value) => formik.setFieldValue('breakStartTime', value)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <TimePicker
                      label="To"
                      value={formik.values.breakEndTime}
                      onChange={(value) => formik.setFieldValue('breakEndTime', value)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Stack>
              </Box>
            </Stack>
          </Stack>
          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Typography variant="h5" color="primary.main" gutterBottom>
              Attendance Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Configure how the system handles attendance tracking, including grace periods and time
              rounding rules.
            </Typography>

            <Grid container spacing={6} maxWidth="1000px">
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={6}>
                  {/* Grace Period Section */}
                  <Box className="setting-box" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Checkbox
                          checked={formik.values.enableGracePeriod}
                          onChange={(e) =>
                            formik.setFieldValue('enableGracePeriod', e.target.checked)
                          }
                          sx={{ pt: 0, pr: 0 }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Stack spacing={0} flex={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2">Grace Period</Typography>
                          <Tooltip title="Grace period allows a window of time after shift start for clock-in and before shift end for clock-out without being marked as late/early">
                            <InfoIcon fontSize="small" color="action" />
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Allow flexibility in clock-in and clock-out times
                        </Typography>

                        <Collapse in={formik.values.enableGracePeriod}>
                          <Stack spacing={3} sx={{ mt: 2 }}>
                            <CustomTextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Clock-in Grace Period (minutes)"
                              name="clockInGracePeriod"
                              value={formik.values.clockInGracePeriod}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.clockInGracePeriod &&
                                Boolean(formik.errors.clockInGracePeriod)
                              }
                              helperText={
                                formik.touched.clockInGracePeriod &&
                                formik.errors.clockInGracePeriod
                              }
                            />
                            <CustomTextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Clock-out Grace Period (minutes)"
                              name="clockOutGracePeriod"
                              value={formik.values.clockOutGracePeriod}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.clockOutGracePeriod &&
                                Boolean(formik.errors.clockOutGracePeriod)
                              }
                              helperText={
                                formik.touched.clockOutGracePeriod &&
                                formik.errors.clockOutGracePeriod
                              }
                            />
                          </Stack>
                        </Collapse>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Shift Start Rounding */}
                  <Box className="setting-box" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Checkbox
                          checked={formik.values.roundToShiftStart}
                          onChange={(e) =>
                            formik.setFieldValue('roundToShiftStart', e.target.checked)
                          }
                          sx={{ pt: 0, pr: 0 }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Stack spacing={0} flex={1}>
                        <Typography variant="subtitle2">Round to Shift Start</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Automatically adjust early arrivals to shift start time (e.g., 8:45 →
                          9:00)
                        </Typography>

                        <Collapse in={formik.values.roundToShiftStart}>
                          <Stack spacing={3} sx={{ mt: 2 }}>
                            <CustomTextField
                              select
                              size="small"
                              label="Rounding Interval"
                              name="shiftStartRoundingIncrement"
                              value={formik.values.shiftStartRoundingIncrement}
                              onChange={formik.handleChange}
                              fullWidth
                            >
                              {incrementOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </CustomTextField>
                            <CustomTextField
                              select
                              size="small"
                              label="Rounding Direction"
                              name="shiftStartRoundingDirection"
                              value={formik.values.shiftStartRoundingDirection}
                              onChange={formik.handleChange}
                              fullWidth
                            >
                              {roundingOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </CustomTextField>
                          </Stack>
                        </Collapse>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Early Clock-out Rounding */}
                  <Box className="setting-box" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Checkbox
                          checked={formik.values.enableEarlyClockOutRounding}
                          onChange={(e) =>
                            formik.setFieldValue('enableEarlyClockOutRounding', e.target.checked)
                          }
                          sx={{ pt: 0, pr: 0 }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Stack spacing={0} flex={1}>
                        <Typography variant="subtitle2">Round Early Clock-outs</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Apply interval-based rounding to early departures
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={6}>
                  {/* Shift End Rounding */}
                  <Box className="setting-box" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Checkbox
                          checked={formik.values.roundToShiftEnd}
                          onChange={(e) =>
                            formik.setFieldValue('roundToShiftEnd', e.target.checked)
                          }
                          sx={{ pt: 0, pr: 0 }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Stack spacing={0} flex={1}>
                        <Typography variant="subtitle2">Round to Shift End</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Automatically adjust late departures to shift end time (e.g., 5:15 → 5:00)
                        </Typography>

                        <Collapse in={formik.values.roundToShiftEnd}>
                          <Stack spacing={3} sx={{ mt: 2 }}>
                            <CustomTextField
                              select
                              size="small"
                              label="Rounding Interval"
                              name="shiftEndRoundingIncrement"
                              value={formik.values.shiftEndRoundingIncrement}
                              onChange={formik.handleChange}
                              fullWidth
                            >
                              {incrementOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </CustomTextField>
                            <CustomTextField
                              select
                              size="small"
                              label="Rounding Direction"
                              name="shiftEndRoundingDirection"
                              value={formik.values.shiftEndRoundingDirection}
                              onChange={formik.handleChange}
                              fullWidth
                            >
                              {roundingOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </CustomTextField>
                          </Stack>
                        </Collapse>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Late Clock-in Rounding */}
                  <Box className="setting-box" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Checkbox
                          checked={formik.values.enableLateClockInRounding}
                          onChange={(e) =>
                            formik.setFieldValue('enableLateClockInRounding', e.target.checked)
                          }
                          sx={{ pt: 0, pr: 0 }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Stack spacing={0} flex={1}>
                        <Typography variant="subtitle2">Round Late Clock-ins</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Apply interval-based rounding to late arrivals
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Stack direction="row" justifyContent="space-between" mt={4}>
            <Button
              sx={{ bgcolor: '#fff !important' }}
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Stack direction="row" spacing={2}>
              {!user.isCompanyProfileCompleted && (
                <Button variant="outlined" type="submit" sx={{ bgcolor: '#fff !important' }}>
                  Skip
                </Button>
              )}
              <Button variant="contained" type="submit" color="primary">
                Save Settings
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </form>
    </Fade>
  );
};

export default FirmSchedulePicker;
