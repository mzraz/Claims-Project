import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Checkbox,
  TextField,
  Slider,
  Stack,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { calculateHours, calculateBreakDuration } from './scheduleUtils';
import { IconGridDots } from '@tabler/icons';

const DateShiftEdit = ({
  open,
  onClose,
  shiftData,
  employees,
  onUpdate,
  defaultShifts,
  selectedDate,
  currencySymbol,
  formatCurrency,
}) => {
  const [employeeShifts, setEmployeeShifts] = useState({});
  const [chartData, setChartData] = useState({ employeeData: [], totalHours: 0, totalCost: 0 });
  const theme = useTheme();

  // Add the format currency function

  const shiftId = shiftData.id;

  // Filter out unavailable employees and those on leave
  const availableEmployees = employees.filter((emp) => {
    const existingShift = defaultShifts.find(
      (s) =>
        s.shiftId === shiftData.id &&
        s.resource === emp.id &&
        dayjs(s.start).isSame(selectedDate, 'day'),
    );
    return !(existingShift && (existingShift.isNotAvailable || existingShift.isEmployeeOnLeave));
  });

  useEffect(() => {
    if (open && shiftData) {
      const initialEmployeeShifts = availableEmployees.reduce((acc, emp) => {
        const existingShift = defaultShifts.find(
          (s) =>
            s.shiftId === shiftData.id &&
            s.resource === emp.id &&
            dayjs(s.start).isSame(selectedDate, 'day'),
        );

        acc[emp.id] = {
          selected: !!existingShift,
          startTime: existingShift
            ? dayjs(existingShift.start)
            : dayjs().hour(shiftData.startTime[0]).minute(shiftData.startTime[1]),
          endTime: existingShift
            ? dayjs(existingShift.end)
            : dayjs().hour(shiftData.endTime[0]).minute(shiftData.endTime[1]),
          breakStartTime:
            existingShift && existingShift.breakStartTime
              ? dayjs(selectedDate)
                  .hour(parseInt(existingShift.breakStartTime.split(':')[0]))
                  .minute(parseInt(existingShift.breakStartTime.split(':')[1]))
              : null,
          breakEndTime:
            existingShift && existingShift.breakEndTime
              ? dayjs(selectedDate)
                  .hour(parseInt(existingShift.breakEndTime.split(':')[0]))
                  .minute(parseInt(existingShift.breakEndTime.split(':')[1]))
              : null,
          isBreakPaid: existingShift ? existingShift.isBreakPaid : false,
          hourlyRate:
            emp.shifts.find((s) => s.shiftId === shiftId)?.hourlyRate || emp.baseRatePerHour,
        };
        return acc;
      }, {});
      setEmployeeShifts(initialEmployeeShifts);
    }
  }, [open, shiftData, defaultShifts, selectedDate]);

  useEffect(() => {
    const newChartData = getChartData();
    setChartData(newChartData);
  }, [employeeShifts]);

  const handleEmployeeToggle = (employeeId) => {
    setEmployeeShifts((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], selected: !prev[employeeId].selected },
    }));
  };

  const handleTimeChange = (employeeId, field, newValue) => {
    setEmployeeShifts((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [field]: newValue },
    }));
  };

  const handleUpdate = () => {
    const updatedShifts = [];
    const deletedShiftIds = [];

    Object.entries(employeeShifts).forEach(([empId, data]) => {
      const existingShift = defaultShifts.find(
        (s) =>
          s.shiftId === shiftData.id &&
          s.resource === parseInt(empId) &&
          dayjs(s.start).isSame(selectedDate, 'day'),
      );

      if (data.selected) {
        updatedShifts.push({
          id: existingShift ? existingShift.id : null,
          employeeId: parseInt(empId),
          shiftId: shiftData.id,
          start: data.startTime.format('HH:mm'),
          end: data.endTime.format('HH:mm'),
          breakStartTime: data.breakStartTime ? data.breakStartTime.format('HH:mm') : null,
          breakEndTime: data.breakEndTime ? data.breakEndTime.format('HH:mm') : null,
          isBreakPaid: data.isBreakPaid,
          date: selectedDate.format('YYYY-MM-DD'),
        });
      } else if (existingShift) {
        deletedShiftIds.push(existingShift.id);
      }
    });

    onUpdate(updatedShifts, deletedShiftIds);
    onClose();
  };

  const timeToSliderValue = (time) => {
    if (!time || !dayjs.isDayjs(time)) return 0;
    let value = time.hour() * 2 + Math.floor(time.minute() / 30);
    if (value === 0) value = 47; // 12:00 AM is the last value
    return value - 1; // Subtract 1 to start from 12:30 AM
  };

  const sliderValueToTime = (value) => {
    value = (value + 1) % 48; // Add 1 and use modulo to handle 12:00 AM
    const hours = Math.floor(value / 2);
    const minutes = (value % 2) * 30;
    return dayjs().hour(hours).minute(minutes);
  };

  const generateDistinctColors = (count) => {
    const hueStep = 360 / count;
    return Array.from({ length: count }, (_, i) => `hsl(${i * hueStep}, 70%, 50%)`);
  };

  const getChartData = () => {
    const employeeData = Object.entries(employeeShifts)
      .filter(([_, data]) => data.selected)
      .map(([empId, data]) => {
        const employee = availableEmployees.find((e) => e.id === parseInt(empId));
        const startTime = data.startTime.format('HH:mm');
        const endTime = data.endTime.format('HH:mm');
        const breakStartTime = data.breakStartTime ? data.breakStartTime.format('HH:mm') : null;
        const breakEndTime = data.breakEndTime ? data.breakEndTime.format('HH:mm') : null;

        const hours = calculateHours(
          `2000-01-01T${startTime}`,
          `2000-01-01T${endTime}`,
          breakStartTime,
          breakEndTime,
          data.isBreakPaid,
        );

        const breakDuration = calculateBreakDuration(breakStartTime, breakEndTime);
        const hourlyRate = data.hourlyRate;
        const cost = (hours * hourlyRate).toFixed(2);

        return {
          name: employee?.name || 'Unknown',
          hours: isNaN(hours) ? 0 : parseFloat(hours.toFixed(2)),
          rate: hourlyRate,
          cost: isNaN(cost) ? 0 : parseFloat(cost),
        };
      });

    const totalHours = employeeData.reduce((sum, emp) => sum + emp.hours, 0);
    const totalCost = employeeData.reduce((sum, emp) => sum + emp.cost, 0);

    return {
      employeeData,
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
    };
  };

  const pieChartOptions = {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: chartData.employeeData.map((emp) => emp.name),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    colors: generateDistinctColors(chartData.employeeData.length),
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex, dataPointIndex, w }) {
          const employee = chartData.employeeData[seriesIndex];
          return `${employee.hours.toFixed(2)} hours (${formatCurrency(employee.cost)})`;
        },
      },
    },
    dataLabels: {
      formatter: function (val, opts) {
        const employee = chartData.employeeData[opts.seriesIndex];
        return `${employee.hours.toFixed(1)}h`;
      },
    },
  };

  const pieSeries = chartData.employeeData.map((emp) => emp.hours);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
        <Stack direction="column">
          <Typography variant="h5" className="text-white">
            Edit "{shiftData?.name}"
          </Typography>
          <Typography variant="subtitle1" className="text-white">{`${selectedDate.format(
            'dddd',
          )}, ${selectedDate.format('DD MMM YYYY')}`}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" my={2} gutterBottom>
                Available Employees
              </Typography>
              <Box
                sx={{
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin',
                  pr: 1,
                  overflowX: 'hidden',
                }}
              >
                {availableEmployees.map((emp) => (
                  <Box key={emp.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '30%',
                        minWidth: '200px',
                      }}
                    >
                      <Checkbox
                        checked={employeeShifts[emp.id]?.selected || false}
                        onChange={() => handleEmployeeToggle(emp.id)}
                      />
                      <Avatar src={emp.img} sx={{ width: 40, height: 40, mr: 2 }} />
                      <Box>
                        <Typography fontSize={15} fontWeight={600} noWrap>
                          {emp.name}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimePicker
                          disableOpenPicker
                          value={employeeShifts[emp.id]?.startTime}
                          onChange={(newValue) => handleTimeChange(emp.id, 'startTime', newValue)}
                          renderInput={(params) => (
                            <TextField {...params} size="small" sx={{ width: '45%' }} />
                          )}
                          disabled={!employeeShifts[emp.id]?.selected}
                        />
                        <Typography sx={{ mx: 1 }}>-</Typography>
                        <TimePicker
                          disableOpenPicker
                          value={employeeShifts[emp.id]?.endTime}
                          onChange={(newValue) => handleTimeChange(emp.id, 'endTime', newValue)}
                          renderInput={(params) => (
                            <TextField {...params} size="small" sx={{ width: '45%' }} />
                          )}
                          disabled={!employeeShifts[emp.id]?.selected}
                        />
                      </Box>
                      <Slider
                        disableSwap
                        value={[
                          timeToSliderValue(employeeShifts[emp.id]?.startTime),
                          timeToSliderValue(employeeShifts[emp.id]?.endTime),
                        ]}
                        onChange={(_, newValue) => {
                          handleTimeChange(emp.id, 'startTime', sliderValueToTime(newValue[0]));
                          handleTimeChange(emp.id, 'endTime', sliderValueToTime(newValue[1]));
                        }}
                        min={0}
                        max={47}
                        step={1}
                        disabled={!employeeShifts[emp.id]?.selected}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: '30px' }}>
                <Typography variant="h5">Shift Statistics</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Employee hours and costs
                </Typography>
                {chartData.employeeData.length > 0 && chartData.totalCost > 0 ? (
                  <>
                    <Chart options={pieChartOptions} series={pieSeries} type="pie" height={300} />
                    <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          width={38}
                          height={38}
                          bgcolor="primary.light"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <IconGridDots width={22} color={theme.palette.primary.main} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Total Hours
                          </Typography>
                          <Typography variant="h6" fontWeight="600">
                            {chartData.totalHours.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          width={38}
                          height={38}
                          bgcolor="grey.200"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <IconGridDots width={22} color={theme.palette.grey[400]} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Total Cost
                          </Typography>
                          <Typography variant="h6" fontWeight="600">
                            {formatCurrency(chartData.totalCost)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body1">
                    No cost data available. Please select employees and ensure they have shifts
                    assigned.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}
        >
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateShiftEdit;
