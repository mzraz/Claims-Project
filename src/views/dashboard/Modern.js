import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  ClickAwayListener,
  Button,
  IconButton,
} from '@mui/material';
import TopCards from '../../components/dashboards/modern/TopCards';
import RevenueUpdates from '../../components/dashboards/modern/AttendanceTrends';
import YearlyBreakup from '../../components/dashboards/modern/TotalDeptHoursGraph';
import EmployeeSalary from '../../components/dashboards/modern/DeptCostsGraph';
import Customers from '../../components/dashboards/modern/TotalEmployeesGraph';
import Projects from '../../components/dashboards/modern/FrequentlyUnavailableEmployees';
import TopPerformers from '../../components/dashboards/modern/TopPerformers';
import { Stack } from '@mui/system';
import { EnhancedTableToolbar } from '../pages/attendance-module/manualAttendance/ManualAttendanceList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getDashboardData } from '../../store/auth/dashboard/dashboardSlice';

const Modern = () => {
  const dispatch = useDispatch();
  const [date, setDate] = useState({ from: dayjs().startOf('month'), to: dayjs().endOf('month') });
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { user } = useSelector((state) => state.loginReducer);
  const state = useSelector((state) => state.dashboardReducer);

  const firmId = user.firmId;

  React.useEffect(() => {
    if (!date.to || !date.from) return;

    const formdata = new FormData();
    formdata.append('companyId', firmId);
    formdata.append('fromDate', dayjs(date.from).format('YYYY-MM-DD'));
    formdata.append('toDate', date.to.format('YYYY-MM-DD'));

    dispatch(getDashboardData(formdata))
      .then((result) => {
        console.log(result, 'result');
        if (result.payload.SUCCESS === 1) {
        } else {
          // setAlert({
          //   open: true,
          //   severity: 'error',
          //   message: result.payload
          // })
        }
      })
      .catch((err) => {
        console.log(err);
        // setAlert({
        //   open: true,
        //   severity: 'error',
        //   message: err.USER_MESSAGE || 'Something went wrong.'
        // })
      });
  }, [searchTrigger]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Attendance Overview
          </Typography>
          <Typography color="GrayText" sx={{ mb: 2 }}>
            Track and analyze attendance metrics across your organization.
          </Typography>
        </Box>
        <DatePickerWithClickAway
          date={date}
          setDate={setDate}
          setSearchTrigger={setSearchTrigger}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid item sm={12} lg={12}>
          <TopCards />
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <RevenueUpdates sx={{ flex: 1 }} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <YearlyBreakup sx={{ flex: 1 }} />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <EmployeeSalary />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Projects />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Customers />
        </Grid>
        <Grid item xs={12}>
          <TopPerformers />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Modern;

const DatePickerWithClickAway = ({ date, setDate, setSearchTrigger }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleToday = () => {
    const today = dayjs();
    setDate({ from: today, to: today });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleThisMonth = () => {
    const from = dayjs().startOf('month');
    const to = dayjs().endOf('month');
    setDate({ from: from, to: to });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handlePreviousMonth = () => {
    const from = dayjs().subtract(1, 'month').startOf('month');
    const to = dayjs().subtract(1, 'month').endOf('month');
    setDate({ from: from, to: to });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handlePreviousThreeMonths = () => {
    const from = dayjs().subtract(3, 'months').startOf('month');
    const to = dayjs().subtract(1, 'month').endOf('month');
    setDate({ from: from, to: to });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleDateSearch = () => {
    if (date.from && date.to) {
      setSearchTrigger((prev) => prev + 1);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setDate({ to: '', from: '' });
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box className="relative">
        <Button
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.7,
            cursor: 'pointer',
            bgcolor: '#fff !important',
          }}
        >
          <CalendarMonthIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
          <Typography
            variant="h5"
            sx={{ whiteSpace: 'nowrap', cursor: 'pointer', color: 'primary.main' }}
          >
            {date.from === '' || date.to === ''
              ? 'Select date'
              : `${date.from.format('DD MMMM YYYY')} - ${date.to.format('DD MMMM YYYY')}`}
          </Typography>
          <ArrowDropDownIcon
            sx={{ color: 'primary.main' }}
            className={`transition-transform ${!open ? 'rotate-180' : ''}`}
          />
        </Button>
        {open && (
          <Box className="absolute top-full right-2 z-[1000] w-[26rem] py-3 px-3 gap-4 bg-white drop-shadow-lg flex items-center flex-col justify-center">
            <Typography
              color={'primary.main'}
              onClick={handleClear}
              className="self-end cursor-pointer"
            >
              Clear
            </Typography>
            <Box className="flex items-end gap-2">
              <Box>
                <Typography fontSize={'.8rem'} className="self-start text-gray-500">
                  From:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    value={date.from ? dayjs(date.from, 'DD/MM/YYYY') : null}
                    onChange={(newValue) => setDate((prev) => ({ ...prev, from: newValue }))}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        sx={{
                          svg: { color: 'primary.main', fontSize: '1.5rem' },
                          input: { color: '' },
                        }}
                        size="small"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <Typography fontSize={'.8rem'} className="self-start text-gray-500">
                  To:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    value={date.to ? dayjs(date.to, 'DD/MM/YYYY') : null}
                    onChange={(newValue) => setDate((prev) => ({ ...prev, to: newValue }))}
                    minDate={dayjs(date.from, 'DD/MM/YYYY').subtract(1, 'day')}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        sx={{
                          svg: { color: 'primary.main', fontSize: '1.5rem' },
                          input: { color: '' },
                        }}
                        size="small"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <IconButton onClick={handleDateSearch}>
                <ManageSearchIcon sx={{ color: 'primary.main' }} />
              </IconButton>
            </Box>
            <Button
              onClick={handleToday}
              sx={{
                width: '100%',
                color: 'primary.main',
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                bgcolor: '#fff !important',
                '&:hover': {
                  backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                  color: 'white',
                },
              }}
            >
              Today
            </Button>
            <Button
              onClick={handleThisMonth}
              sx={{
                width: '100%',
                color: 'primary.main',
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                bgcolor: '#fff !important',
                '&:hover': {
                  backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                  color: 'white',
                },
              }}
            >
              This Month
            </Button>
            <Button
              onClick={handlePreviousMonth}
              sx={{
                width: '100%',
                color: 'primary.main',
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                bgcolor: '#fff !important',
                '&:hover': {
                  backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                  color: 'white',
                },
              }}
            >
              Last Month
            </Button>
            <Button
              onClick={handlePreviousThreeMonths}
              sx={{
                width: '100%',
                color: 'primary.main',
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                bgcolor: '#fff !important',
                '&:hover': {
                  backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                  color: 'white',
                },
              }}
            >
              Last 3 Months
            </Button>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};
