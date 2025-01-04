import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Slider,
  Grid,
  FormControlLabel,
  TextField,
  Avatar,
  Select,
  MenuItem,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import './timerange.css';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { IconLoader2 } from '@tabler/icons';

export default function EmployeeShiftsEdit({
  open,
  toggle,
  employee,
  defaultShifts,
  onUpdate,
  shifts,
  fetchedSchedule,
  status,
}) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [dayShifts, setDayShifts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(shifts[0].id);
  const selectedShiftData = shifts.find((shift) => shift.id === selectedShift);
  const selectedShiftStartTime = dayjs()
    .hour(selectedShiftData.startTime[0])
    .minute(selectedShiftData.startTime[1]);
  const selectedShiftEndTime = dayjs()
    .hour(selectedShiftData.endTime[0])
    .minute(selectedShiftData.endTime[1]);

  useEffect(() => {
    if (!selectedShift) return;

    const startDate = dayjs(selectedShiftData.startDate.join('-'));
    const endDate = dayjs(selectedShiftData.endDate.join('-'));

    const initialDayShifts = daysOfWeek.reduce((acc, day) => {
      const defaultShiftsForDay = defaultShifts.filter(
        (shift) =>
          dayjs(shift.start).format('dddd') === day &&
          shift.shiftId === selectedShift &&
          dayjs(shift.start).isBetween(startDate, endDate, 'day', '[]'),
      );

      const regularShifts = defaultShiftsForDay.filter(
        (shift) => !shift.isNotAvailable && !shift.isEmployeeOnLeave,
      );
      const specialStatusShifts = defaultShiftsForDay.filter(
        (shift) => shift.isNotAvailable || shift.isEmployeeOnLeave,
      );

      const hasRegularShifts = regularShifts.length > 0;
      const hasSpecialStatusShifts = specialStatusShifts.length > 0;

      acc[day] = {
        checked: hasRegularShifts,
        start: hasRegularShifts ? dayjs(regularShifts[0].start) : dayjs(selectedShiftStartTime),
        end: hasRegularShifts ? dayjs(regularShifts[0].end) : dayjs(selectedShiftEndTime),
        sliderValue: hasRegularShifts
          ? [
              timeToSliderValue(dayjs(regularShifts[0].start).format('HH:mm')),
              timeToSliderValue(dayjs(regularShifts[0].end).format('HH:mm')),
            ]
          : [
              timeToSliderValue(dayjs(selectedShiftStartTime).format('HH:mm')),
              timeToSliderValue(dayjs(selectedShiftEndTime).format('HH:mm')),
            ],
        shiftId: selectedShift,
        hasSpecialStatus: hasSpecialStatusShifts,
        specialStatusCount: specialStatusShifts.length,
        totalShifts: defaultShiftsForDay.length,
      };
      return acc;
    }, {});
    setDayShifts(initialDayShifts);
    setIsLoading(false);
  }, [defaultShifts, selectedShift, selectedShiftData]);

  const timeToSliderValue = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    let value = hours * 2 + Math.floor(minutes / 30);
    if (value === 0) value = 47; // 12:00 AM is the last value
    return value - 1; // Subtract 1 to start from 12:30 AM
  };

  const sliderValueToTime = (value) => {
    value = (value + 1) % 48; // Add 1 and use modulo to handle 12:00 AM
    const hours = Math.floor(value / 2);
    const minutes = (value % 2) * 30;
    return dayjs().hour(hours).minute(minutes);
  };

  const handleDayToggle = (day) => {
    setDayShifts((prev) => ({
      ...prev,
      [day]: { ...prev[day], checked: !prev[day].checked },
    }));
  };

  const handleTimeChange = (day, type, newValue) => {
    setDayShifts((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: newValue,
        sliderValue:
          type === 'start'
            ? [timeToSliderValue(newValue.format('HH:mm')), prev[day].sliderValue[1]]
            : [prev[day].sliderValue[0], timeToSliderValue(newValue.format('HH:mm'))],
      },
    }));
  };

  const handleSliderChange = (day, newValue) => {
    setDayShifts((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        start: sliderValueToTime(newValue[0]),
        end: sliderValueToTime(newValue[1]),
        sliderValue: newValue,
      },
    }));
  };

  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  const handleUpdate = () => {
    const startDate = dayjs(selectedShiftData.startDate.join('-'));
    const endDate = dayjs(selectedShiftData.endDate.join('-'));

    const extractTimeFromISOString = (isoString) => {
      return dayjs(isoString).format('HH:mm');
    };

    const updatedShifts = Object.entries(dayShifts)
      .filter(([_, shift]) => shift.checked)
      .flatMap(([day, shift]) => {
        const existingShifts = defaultShifts.filter(
          (defaultShift) =>
            dayjs(defaultShift.start).format('dddd') === day &&
            defaultShift.shiftId === selectedShift &&
            dayjs(defaultShift.start).isBetween(startDate, endDate, 'day', '[]'),
        );

        return existingShifts.map((existingShift) => {
          if (existingShift.isNotAvailable || existingShift.isEmployeeOnLeave) {
            return {
              ...existingShift,
              start: extractTimeFromISOString(existingShift.start),
              end: extractTimeFromISOString(existingShift.end),
            };
          } else {
            return {
              id: existingShift.id,
              day,
              start: shift.start.format('HH:mm'),
              end: shift.end.format('HH:mm'),
              shiftId: selectedShift,
            };
          }
        });
      });

    // Handle new shifts for days that didn't have any regular shifts before
    Object.entries(dayShifts)
      .filter(([_, shift]) => shift.checked)
      .forEach(([day, shift]) => {
        const regularExistingShifts = defaultShifts.filter(
          (defaultShift) =>
            dayjs(defaultShift.start).format('dddd') === day &&
            defaultShift.shiftId === selectedShift &&
            dayjs(defaultShift.start).isBetween(startDate, endDate, 'day', '[]') &&
            !defaultShift.isNotAvailable &&
            !defaultShift.isEmployeeOnLeave,
        );

        if (regularExistingShifts.length === 0) {
          let currentDate = startDate.clone();
          while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            if (currentDate.format('dddd') === day) {
              const specialStatusShift = defaultShifts.find(
                (defaultShift) =>
                  dayjs(defaultShift.start).isSame(currentDate, 'day') &&
                  defaultShift.shiftId === selectedShift &&
                  (defaultShift.isNotAvailable || defaultShift.isEmployeeOnLeave),
              );

              if (!specialStatusShift) {
                updatedShifts.push({
                  day,
                  date: currentDate.format('YYYY-MM-DD'),
                  start: shift.start.format('HH:mm'),
                  end: shift.end.format('HH:mm'),
                  isNew: true,
                  shiftId: selectedShift,
                });
              }
            }
            currentDate = currentDate.add(1, 'day');
          }
        }
      });

    const deletedShifts = defaultShifts
      .filter(
        (defaultShift) =>
          defaultShift.shiftId === selectedShift &&
          !dayShifts[dayjs(defaultShift.start).format('dddd')]?.checked &&
          dayjs(defaultShift.start).isBetween(startDate, endDate, 'day', '[]') &&
          !defaultShift.isNotAvailable &&
          !defaultShift.isEmployeeOnLeave,
      )
      .map((shift) => shift.id);
    onUpdate(employee.id, updatedShifts, deletedShifts, selectedShift);
  };
  return (
    <Dialog open={open} onClose={toggle} fullWidth maxWidth={'md'}>
      <Stack>
        <DialogTitle
          id="alert-dialog-title"
          variant="h4"
          sx={{ backgroundColor: 'primary.main', color: 'white' }}
        >
          {`Edit ${employee.name}'s schedule`}
          <Typography sx={{ color: 'white', pt: 0.5 }}>
            Changes made here will apply to the selected days. Unchecked days will be deleted from
            the schedule.
          </Typography>
        </DialogTitle>
      </Stack>

      <DialogContent sx={{ pt: 0.3, px: 7, height: '40rem' }}>
        {!isLoading ? (
          <Box>
            <Grid item xs={1} className="border-b">
              <Box className="p-2 flex flex-row justify-start space-x-2 items-center">
                <Avatar src={employee.img} sx={{ width: 64, height: 64 }} />
                <Stack sx={{ width: '100%', pb: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Stack sx={{ width: '100%' }}>
                      <Typography sx={{ fontSize: '19px', fontWeight: 600, width: '100%' }}>
                        {employee.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '12px', fontWeight: 600 }}
                        className="text-overflow-ellipsis "
                      >
                        {employee.title}
                      </Typography>
                    </Stack>
                    <Box className="flex justify-end items-center space-between gap-2 w-full">
                      <Typography fontWeight={600}>Selected shift:</Typography>
                      <Select
                        value={selectedShift}
                        onChange={handleShiftChange}
                        displayEmpty
                        sx={{ width: '40%' }}
                      >
                        {shifts.map((shift) => (
                          <MenuItem key={shift.id} value={shift.id}>
                            {shift.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
            {daysOfWeek.map((day) => (
              <Box key={day} className="grid grid-cols-4 place-content-center py-2">
                <FormControlLabel
                  control={
                    <CustomCheckbox
                      checked={dayShifts[day]?.checked || false}
                      onChange={() => handleDayToggle(day)}
                      disabled={!selectedShift}
                    />
                  }
                  label={<span style={{ fontWeight: '800' }}>{day}</span>}
                />
                <Box className="flex flex-col w-full col-span-3">
                  <Box className="flex items-center gap-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        disableOpenPicker
                        size="small"
                        value={dayShifts[day]?.start}
                        onChange={(newValue) => handleTimeChange(day, 'start', newValue)}
                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                        disabled={!selectedShift}
                      />
                    </LocalizationProvider>
                    <Typography>to</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        disableOpenPicker
                        value={dayShifts[day]?.end}
                        onChange={(newValue) => handleTimeChange(day, 'end', newValue)}
                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                        disabled={!selectedShift}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Slider
                    disableSwap
                    value={dayShifts[day]?.sliderValue || [18, 34]}
                    onChange={(_, newValue) => handleSliderChange(day, newValue)}
                    min={0}
                    max={47}
                    step={1}
                    marks={[
                      { value: 0, label: '12:30 AM' },
                      { value: 23, label: '12:00 PM' },
                      { value: 47, label: '12:00 AM' },
                    ]}
                    disabled={!selectedShift}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            color={'primary.main'}
            className="w-full min-h-full flex justify-center items-center"
          >
            <IconLoader2 sx={{ fontSize: '2rem' }} className="animate-spin" />
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: 'space-between', p: 0, py: 1.5 }}
        className="flex items-center justify-between mx-[24px]"
      >
        <Button
          variant="outlined"
          onClick={toggle}
          sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
          onClick={handleUpdate}
        >
          {status === 'updating' ? <IconLoader2 className="animate-spin text-white" /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
