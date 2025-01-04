import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  TextField,
  Box,
  Button,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TimeDropdown from '../TimeDropdown';

const AddShiftDialog = ({
  open,
  handleClose,
  shiftDetails,
  handleChange,
  onSave,
  shifts,
  currencySymbol,
  formatCurrency,
}) => {
  const [includeBreak, setIncludeBreak] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    startTime,
    endTime,
    breakStartTime,
    breakEndTime,
    hourlyRate,
    isBreakPaid,
    isHourlyRateRequired,
    name,
    baseRatePerHour,
    color,
  } = shiftDetails;

  useEffect(() => {
    if (includeBreak && breakStartTime && breakEndTime && startTime && endTime) {
      validateBreakTimes();
    } else if (!includeBreak) {
      setErrors({});
    }
  }, [breakStartTime, breakEndTime, startTime, endTime, includeBreak]);

  const validateBreakTimes = () => {
    const newErrors = {};

    if (includeBreak) {
      const start = dayjs(startTime, 'h:mm A');
      const end = dayjs(endTime, 'h:mm A');
      const breakStart = dayjs(breakStartTime, 'h:mm A');
      const breakEnd = dayjs(breakEndTime, 'h:mm A');

      if (breakEnd.isBefore(breakStart)) {
        newErrors.breakEndTime = 'Break end must be after break start';
      }
      if (breakStart.isBefore(start)) {
        newErrors.breakStartTime = 'Break must be within shift hours';
      }
      if (breakEnd.isAfter(end)) {
        newErrors.breakEndTime = 'Break must be within shift hours';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateShiftHours = () => {
    if (!startTime || !endTime) return 0;

    const start = dayjs(startTime, 'h:mm A');
    let end = dayjs(endTime, 'h:mm A');

    // If end time is before start time, assume it's the next day
    if (end.isBefore(start)) {
      end = end.add(1, 'day');
    }

    let totalMinutes = end.diff(start, 'minute');

    // Subtract break time if it exists and is not paid
    if (breakStartTime && breakEndTime && !isBreakPaid) {
      const breakStart = dayjs(breakStartTime, 'h:mm A');
      let breakEnd = dayjs(breakEndTime, 'h:mm A');

      // If break end is before break start, assume it's the next day
      if (breakEnd.isBefore(breakStart)) {
        breakEnd = breakEnd.add(1, 'day');
      }

      const breakMinutes = breakEnd.diff(breakStart, 'minute');
      totalMinutes -= breakMinutes;
    }

    return Math.max(totalMinutes / 60, 0).toFixed(1);
  };

  const calculateCost = (hours) => {
    const rate = hourlyRate || baseRatePerHour;
    return (hours * rate).toFixed(2);
  };

  const hoursWorked = calculateShiftHours();
  const cost = calculateCost(hoursWorked);

  const handleTimeChange = (name, value) => {
    const formattedValue = value ? dayjs(value).format('h:mm A') : '';
    handleChange({
      target: {
        name,
        value: formattedValue,
      },
    });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBreakToggle = (e) => {
    setIncludeBreak(e.target.checked);
    if (!e.target.checked) {
      handleChange({ target: { name: 'breakStartTime', value: '' } });
      handleChange({ target: { name: 'breakEndTime', value: '' } });
      handleChange({ target: { name: 'isBreakPaid', value: false } });
    }
    setErrors({});
  };

  const handleSaveClick = () => {
    if (validateBreakTimes()) {
      const updatedShiftDetails = {
        ...shiftDetails,
        breakStartTime: includeBreak ? breakStartTime : null,
        breakEndTime: includeBreak ? breakEndTime : null,
        isBreakPaid: includeBreak ? isBreakPaid : false,
      };
      onSave(updatedShiftDetails);
    }
  };

  const isShiftValid = startTime && endTime;
  const isBreakValid =
    !includeBreak || (breakStartTime && breakEndTime && Object.keys(errors).length === 0);
  const isFormValid = isShiftValid && isBreakValid;
  const selectedShift = shifts.find((s) => s.id === shiftDetails.shiftId);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: color, py: 2 }}>
          <Stack direction="column">
            <Typography variant="h5" className="text-white">
              New Shift for {name}
            </Typography>
            <Typography variant="subtitle1" className="text-white">
              {`${dayjs(shiftDetails.date).format('dddd, DD MMM YYYY')}, ${selectedShift.name}`}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ my: 2 }}>
          <Stack direction="column">
            <Stack
              sx={{ px: '0px !important' }}
              direction="row"
              justifyContent="space-between"
              alignItems={'center'}
              spacing={2}
              p={1}
            >
              <Typography fontWeight={'600'} variant="body1" className="text-black">
                Shift start:
              </Typography>
              <TimeDropdown
                name="startTime"
                value={startTime}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Stack>

            <Stack
              sx={{ px: '0px !important' }}
              direction="row"
              justifyContent="space-between"
              alignItems={'center'}
              spacing={2}
              p={1}
            >
              <Typography fontWeight={'600'} variant="body1" className="text-black">
                Shift end:
              </Typography>
              <TimeDropdown
                name="endTime"
                value={endTime}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Stack>

            <Stack
              sx={{ px: '0px !important' }}
              direction="row"
              alignItems={'center'}
              spacing={1}
              p={1}
            >
              <Typography fontWeight={'600'} variant="body1" className="text-black">
                Include Break:
              </Typography>
              <Switch
                checked={includeBreak}
                onChange={handleBreakToggle}
                name="includeBreak"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: color,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: color,
                  },
                }}
              />
            </Stack>

            {includeBreak && (
              <>
                <Stack
                  sx={{ px: '0px !important' }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems={'center'}
                  spacing={2}
                  p={1}
                >
                  <Typography fontWeight={'600'} variant="body1" className="text-black">
                    Break start:
                  </Typography>
                  <TimePicker
                    minutesStep={5}
                    value={breakStartTime ? dayjs(breakStartTime, 'h:mm A') : null}
                    onChange={(value) => handleTimeChange('breakStartTime', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        sx={{ width: '180px' }}
                        error={!!errors.breakStartTime}
                        helperText={errors.breakStartTime}
                      />
                    )}
                  />
                </Stack>

                <Stack
                  sx={{ px: '0px !important' }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems={'center'}
                  spacing={2}
                  p={1}
                >
                  <Typography fontWeight={'600'} variant="body1" className="text-black">
                    Break end:
                  </Typography>
                  <TimePicker
                    minutesStep={5}
                    value={breakEndTime ? dayjs(breakEndTime, 'h:mm A') : null}
                    onChange={(value) => handleTimeChange('breakEndTime', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        sx={{ width: '180px' }}
                        error={!!errors.breakEndTime}
                        helperText={errors.breakEndTime}
                      />
                    )}
                  />
                </Stack>

                <Stack
                  sx={{ px: '0px !important' }}
                  direction="row"
                  alignItems={'center'}
                  spacing={1}
                  p={1}
                >
                  <Typography fontWeight={'600'} variant="body1" className="text-black">
                    Break Paid:
                  </Typography>
                  <Switch
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: color,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: color,
                      },
                    }}
                    checked={isBreakPaid}
                    onChange={(e) =>
                      handleChange({ target: { name: 'isBreakPaid', value: e.target.checked } })
                    }
                    name="isBreakPaid"
                  />
                </Stack>
              </>
            )}

            {isHourlyRateRequired && (
              <Stack
                sx={{ px: '0px !important' }}
                direction="row"
                justifyContent="space-between"
                alignItems={'center'}
                spacing={2}
                p={1}
              >
                <Typography fontWeight={'600'} variant="body1" className="text-black">
                  Hourly rate:
                </Typography>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <strong>{currencySymbol}</strong>
                      </InputAdornment>
                    ),
                  }}
                  disabled
                  name="hourlyRate"
                  type="number"
                  value={baseRatePerHour}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0 }}
                  sx={{ width: '180px' }}
                />
              </Stack>
            )}

            <Stack py={1} direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight="600" variant="body1">
                Hours Worked:
              </Typography>
              <Typography variant="body1">
                {hoursWorked} hrs ({formatCurrency(cost, true)})
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ mr: 1, color: color, bgcolor: '#fff !important', borderColor: color }}
            >
              Cancel
            </Button>
            <Button
              disabled={!isFormValid}
              variant="contained"
              sx={{ bgcolor: !isFormValid ? '#d8dbdd !important' : color }}
              onClick={handleSaveClick}
            >
              Add
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddShiftDialog;
