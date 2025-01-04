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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TimeDropdown from '../TimeDropdown';

const EditShiftDialog = ({
  open,
  handleClose,
  shiftDetails,
  handleChange,
  shiftHours,
  editShift,
  disabled,
  calculateHours,
  shifts,
  formatCurrency,
}) => {
  const [includeBreak, setIncludeBreak] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedBreakTimes, setSavedBreakTimes] = useState({
    breakStartTime: '',
    breakEndTime: '',
    isBreakPaid: false,
  });

  const staff = shiftDetails.staff;
  const selectedShift = shifts.find((s) => s.id === shiftDetails.shiftId);

  // Initialize includeBreak state and save initial break values
  useEffect(() => {
    const hasBreak = Boolean(shiftDetails.breakStartTime || shiftDetails.breakEndTime);
    setIncludeBreak(hasBreak);
    if (hasBreak) {
      setSavedBreakTimes({
        breakStartTime: shiftDetails.breakStartTime,
        breakEndTime: shiftDetails.breakEndTime,
        isBreakPaid: shiftDetails.isBreakPaid,
      });
      validateBreakTimes();
    } else {
      setErrors({});
    }
  }, [shiftDetails.breakStartTime, shiftDetails.breakEndTime]);

  // Validate break times when relevant times change
  useEffect(() => {
    if (
      includeBreak &&
      shiftDetails.breakStartTime &&
      shiftDetails.breakEndTime &&
      shiftDetails.start &&
      shiftDetails.end
    ) {
      validateBreakTimes();
    }
  }, [
    shiftDetails.start,
    shiftDetails.end,
    shiftDetails.breakStartTime,
    shiftDetails.breakEndTime,
    includeBreak,
  ]);

  const handleTimeChange = (name, value) => {
    const formattedValue = value ? dayjs(value).format('h:mm A') : '';
    handleChange({
      target: {
        name,
        value: formattedValue,
      },
    });

    // Clear specific error when the corresponding field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateBreakTimes = () => {
    const newErrors = {};

    if (includeBreak && shiftDetails.breakStartTime && shiftDetails.breakEndTime) {
      const start = dayjs(shiftDetails.start, 'h:mm A');
      const end = dayjs(shiftDetails.end, 'h:mm A');
      const breakStart = dayjs(shiftDetails.breakStartTime, 'h:mm A');
      const breakEnd = dayjs(shiftDetails.breakEndTime, 'h:mm A');

      // Adjust end time if it's before start time (overnight shift)
      let adjustedEnd = end;
      if (end.isBefore(start)) {
        adjustedEnd = end.add(1, 'day');
      }

      // Adjust break end if it's before break start (overnight break)
      let adjustedBreakEnd = breakEnd;
      if (breakEnd.isBefore(breakStart)) {
        adjustedBreakEnd = breakEnd.add(1, 'day');
      }

      if (adjustedBreakEnd.isBefore(breakStart)) {
        newErrors.breakEndTime = 'Break end must be after break start';
      }
      if (breakStart.isBefore(start)) {
        newErrors.breakStartTime = 'Break must be within shift hours';
      }
      if (adjustedBreakEnd.isAfter(adjustedEnd)) {
        newErrors.breakEndTime = 'Break must be within shift hours';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBreakToggle = (e) => {
    const isChecked = e.target.checked;
    setIncludeBreak(isChecked);

    if (isChecked) {
      // Restore saved break times
      handleChange({ target: { name: 'breakStartTime', value: savedBreakTimes.breakStartTime } });
      handleChange({ target: { name: 'breakEndTime', value: savedBreakTimes.breakEndTime } });
      handleChange({ target: { name: 'isBreakPaid', value: savedBreakTimes.isBreakPaid } });
    } else {
      // Save current break times before clearing
      setSavedBreakTimes({
        breakStartTime: shiftDetails.breakStartTime,
        breakEndTime: shiftDetails.breakEndTime,
        isBreakPaid: shiftDetails.isBreakPaid,
      });
      // Clear break times in form
      handleChange({ target: { name: 'breakStartTime', value: '' } });
      handleChange({ target: { name: 'breakEndTime', value: '' } });
      handleChange({ target: { name: 'isBreakPaid', value: false } });
      setErrors({}); // Clear all errors when break is disabled
    }
  };

  const calculateShiftHours = () => {
    if (!shiftDetails.start || !shiftDetails.end) return 0;

    const start = dayjs(shiftDetails.start, 'h:mm A');
    let end = dayjs(shiftDetails.end, 'h:mm A');

    if (end.isBefore(start)) {
      end = end.add(1, 'day');
    }

    let totalMinutes = end.diff(start, 'minute');

    if (
      includeBreak &&
      shiftDetails.breakStartTime &&
      shiftDetails.breakEndTime &&
      !shiftDetails.isBreakPaid
    ) {
      const breakStart = dayjs(shiftDetails.breakStartTime, 'h:mm A');
      let breakEnd = dayjs(shiftDetails.breakEndTime, 'h:mm A');

      if (breakEnd.isBefore(breakStart)) {
        breakEnd = breakEnd.add(1, 'day');
      }

      const breakMinutes = breakEnd.diff(breakStart, 'minute');
      totalMinutes -= breakMinutes;
    }

    return Math.max(totalMinutes / 60, 0).toFixed(1);
  };

  const calculateCost = (hours) => {
    const hourlyRate =
      shiftDetails.staff.shifts.find((s) => s.shiftId === shiftDetails.shiftId).hourlyRate || 0;
    return (hours * hourlyRate).toFixed(2);
  };

  const handleSave = () => {
    const isValid = validateBreakTimes();
    if (isValid) {
      const updatedShiftDetails = {
        ...shiftDetails,
        breakStartTime: includeBreak ? shiftDetails.breakStartTime : null,
        breakEndTime: includeBreak ? shiftDetails.breakEndTime : null,
        isBreakPaid: includeBreak ? shiftDetails.isBreakPaid : false,
      };
      editShift(updatedShiftDetails);
    }
  };

  const hoursWorked = calculateShiftHours();
  const cost = calculateCost(hoursWorked);
  const isShiftValid = shiftDetails.start && shiftDetails.end;
  const isBreakValid =
    !includeBreak ||
    (shiftDetails.breakStartTime && shiftDetails.breakEndTime && Object.keys(errors).length === 0);
  const isFormValid = isShiftValid && isBreakValid;
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
        <DialogTitle sx={{ bgcolor: staff.color, py: 2 }}>
          <Stack direction="column">
            <Typography variant="h5" className="text-white">
              {shiftDetails.title === '' ? 'New Shift' : `Edit ${staff.name}'s schedule`}
            </Typography>
            <Typography variant="subtitle1" className="text-white">
              {`${shiftDetails.day}, ${dayjs(shiftDetails.date).format('DD MMM YYYY')}, ${
                selectedShift.name
              }`}
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
                slot={shiftDetails.slot}
                name="start"
                value={shiftDetails.start}
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
                slot={shiftDetails.slot}
                name="end"
                value={shiftDetails.end}
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
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: staff.color,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: staff.color,
                  },
                }}
                checked={includeBreak}
                onChange={handleBreakToggle}
                name="includeBreak"
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
                    value={
                      shiftDetails.breakStartTime
                        ? dayjs(shiftDetails.breakStartTime, 'h:mm A')
                        : null
                    }
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
                    value={
                      shiftDetails.breakEndTime ? dayjs(shiftDetails.breakEndTime, 'h:mm A') : null
                    }
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
                        color: staff.color,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: staff.color,
                      },
                    }}
                    checked={shiftDetails.isBreakPaid}
                    onChange={(e) =>
                      handleChange({ target: { name: 'isBreakPaid', value: e.target.checked } })
                    }
                    name="isBreakPaid"
                  />
                </Stack>
              </>
            )}

            <Stack py={1} direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight="600" variant="body1">
                Hours Worked:
              </Typography>
              <Typography variant="body1">
                {hoursWorked} hrs ({formatCurrency(cost, true)})
              </Typography>
            </Stack>

            {shiftDetails.title !== '' && (
              <Stack
                sx={{ px: '0px !important' }}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                p={1}
              >
                <Typography fontWeight={'600'} variant="body1" className="text-black">
                  Remarks:
                </Typography>
                <TextField />
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                mr: 1,
                color: staff.color,
                bgcolor: '#fff !important',
                borderColor: staff.color,
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={disabled || !isFormValid}
              variant="contained"
              sx={{
                bgcolor: disabled || !isFormValid ? '#d8dbdd !important' : staff.color,
              }}
              onClick={handleSave}
            >
              {shiftDetails.title ? 'Update' : 'Add'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditShiftDialog;
