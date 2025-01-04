import {
  Paper,
  Typography,
  Avatar,
  ClickAwayListener,
  Toolbar,
  Button,
  IconButton,
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttendanceDetailTable from './AttendanceDetailTable';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Stack } from '@mui/system';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import { getAttendanceById } from '../../../../store/attendance/AttendanceSlice';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { timeDay } from 'd3';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Loader } from '../../../../layouts/full/shared/loadable/Loadable';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LeaveQuotaBlock from './LeaveQuotaBlock';

export default function AttendanceDetail({ id, initialDate }) {
  const dispatch = useDispatch();
  const [date, setDate] = useState({ to: initialDate.to, from: initialDate.from });
  const [loading, setLoading] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    if (!date.to || !date.from) return;
    setLoading(true);
    const formdata = new FormData();
    formdata.append('employeeId', id);
    formdata.append('startDate', dayjs(date.from).format('YYYY-MM-DD'));
    formdata.append('endDate', dayjs(date.to).format('YYYY-MM-DD'));

    dispatch(getAttendanceById(formdata))
      .then((result) => {
        console.log(result, 'result');
        if (result.payload.SUCCESS === 1) {
          const response = result.payload.DATA[0];

          const formattedData = result.payload.DATA[0].employeeDetail.map((item) => ({
            id: id,
            employeeName: response.employeeName,
            employeeId: response.employeeId,
            date: dayjs(item.date, 'DD/MM/YYYY').format('ddd D MMM, YYYY'), // Assuming current date, adjust as needed
            status: item.status,
            scheduled: `${item.shiftStartTime} - ${item.shiftEndTime}`,
            checkIn: item.checkInTime || '-',
            checkOut: item.checkOutTime || '-',
            checkInStatus: item.checkInStatus,
            checkOutStatus: item.checkOutStatus,
            totalWorked: item.totalWorked || '-',
            totalWorkedStatus: item.totalWorkedStatus,
            shiftLabel: item.shiftLabel || '-',
            shiftTotalHours: item.shiftTotalHours,
          }));

          const formattedDetail = {
            ...response,
          };

          setEmployeeData(formattedDetail);
          setTableRows(formattedData);
          setLoading(false);
          setAlert({
            open: true,
            severity: 'success',
            message: 'Retrieved employees list successfully',
          });
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
        setLoading(false);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, [searchTrigger]);

  const handleClick = () => {};

  return !loading ? (
    <main className="py-10 w-full max-w-[85%] mx-auto">
      <Stack direction={'row'} gap={4} alignItems={'center'}>
        <div>
          <Avatar
            sx={{ width: 160, height: 160 }}
            src={`https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${employeeData.profileFileName}`}
          />
        </div>
        <div className="mt-3">
          <Typography variant="h2">{employeeData.employeeName}</Typography>
          <Typography className="text-zinc-500">{employeeData.employeeDesignationLabel}</Typography>
          <div className="mt-3 text-zinc-500 flex flex-col gap-2">
            <Typography className="flex items-center gap-1">
              <PhoneAndroidIcon sx={{ fontSize: '1.2rem' }} /> {employeeData.employeeContactNo}
            </Typography>
            <Typography className="flex items-center gap-1">
              <EmailOutlinedIcon sx={{ fontSize: '1.2rem' }} /> {employeeData.employeeEmail}
            </Typography>
            {/* <Typography className="flex items-center gap-1">
                            <WorkHistoryOutlinedIcon sx={{ fontSize: '1.2rem' }} /> Last active time - 1:37 PM
                        </Typography> */}
          </div>
        </div>
      </Stack>

      <Paper className="pb-5 mt-10 border">
        <Stack
          py={2}
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          className="border-b px-10"
        >
          <Box className="flex justify- between items-center gap-2 " color={'primary.main'}>
            <CalendarMonthIcon fontSize="large" />
            <Typography color={'primary.main'} variant="h4">
              {dayjs(date.from).format('DD MMMM YYYY')} - {dayjs(date.to).format('DD MMMM YYYY')}
            </Typography>
          </Box>
          <EnhancedTableToolbar setSearchTrigger={setSearchTrigger} date={date} setDate={setDate} />
        </Stack>
        <div className="px-10 my-6">
          <Typography variant="h6" className="pb-5">
            Summary
          </Typography>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gray-50 px-4 py-4 rounded-xl">
              <Typography variant="h5" fontWeight={800}>
                {employeeData.shiftTotalWorkingTime}
              </Typography>
              <Typography sx={{ color: 'grey' }}>Scheduled</Typography>
            </div>
            <div className="bg-gray-50 px-4 py-4 rounded-xl">
              <Typography variant="h5" fontWeight={800}>
                {employeeData.totalWorked}
              </Typography>
              <Typography sx={{ color: 'grey' }}>Worked</Typography>
            </div>
            <div className="bg-gray-50 px-4 py-4 rounded-xl">
              <Typography variant="h5" fontWeight={800}>
                {employeeData.differnce}
              </Typography>
              <Typography sx={{ color: 'grey' }}>Difference</Typography>
            </div>
            <div className="bg-gray-50 px-4 py-4 rounded-xl">
              <Typography variant="h5" fontWeight={800}>
                {employeeData.totalAttendenceIncompleteRecords}
              </Typography>
              <Typography sx={{ color: 'grey' }}>incomplete records</Typography>
            </div>
            <div className="bg-gray-50 px-4 py-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.totalDelaysTime}
                </Typography>
                <Typography sx={{ color: 'grey' }}>
                  ({employeeData.totalDelays} Late Ins)
                </Typography>
              </div>
              <Typography sx={{ color: 'grey' }}>Total Delay</Typography>
            </div>
            <div className="bg-gray-50 px-4 py-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.totalShortageTime}
                </Typography>
                <Typography sx={{ color: 'grey' }}>
                  ({employeeData.totalShortage} early outs)
                </Typography>
              </div>
              <Typography sx={{ color: 'grey' }}>Shortage</Typography>
            </div>
            <div className="grid grid-cols-2 gap-x-6">
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.totalMissedShifts}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Missed Shifts</Typography>
              </div>
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.totalAttendenceAbsence}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Absence</Typography>
              </div>
            </div>

            <LeaveQuotaBlock
              leavesTaken={employeeData.employeeLeaves}
              employeeLeaves={employeeData.employeeLeavesQuota}
            />
          </div>
        </div>
      </Paper>
      <div>
        <AttendanceDetailTable tableRows={tableRows} />
      </div>
    </main>
  ) : (
    <Loader />
  );
}

const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    handleSearch,
    search,
    date,
    setDate,
    title,
    addBtn,
    loading,
    setLoading,
    setSearchTrigger,
  } = props;
  const [open, setOpen] = useState(false);

  const handleToday = () => {
    const today = dayjs();
    setDate({ from: today, to: today });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleDateSearch = () => {
    if (date.from && date.to) {
      setSearchTrigger((prev) => prev + 1);
      setOpen(false);
    }
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

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClear = () => {
    setDate({
      to: null,
      from: null,
    });
    setOpen(false);
  };

  return (
    <Toolbar
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Paper
          elevation={0}
          sx={{ borderRadius: '', display: 'flex', alignItems: 'center', gap: 3 }}
        >
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box className="relative">
              <Box
                onClick={handleClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.7,
                  cursor: 'pointer',
                  bgcolor: date.from ? 'primary.main' : '',
                  border: !date.from || !date.to ? '1px solid #DFE5EF' : '',
                }}
              >
                <CalendarMonthIcon
                  sx={{ color: !date.from ? 'gray' : 'white', fontSize: '1.1rem' }}
                />
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    color: !date.from ? '' : 'white',
                  }}
                >
                  {!date.from || !date.to
                    ? 'Select date'
                    : `${dayjs(date.from).format('DD/MM/YYYY')}-${dayjs(date.to).format(
                        'DD/MM/YYYY',
                      )}`}
                </Typography>
                <ArrowDropDownIcon
                  sx={{ color: !date.from ? 'primary.main' : 'white' }}
                  className={`transition-transform ${!open ? 'rotate-180 ' : ''}`}
                />
              </Box>
              {open && (
                <Box className="absolute top-full right-0 z-[1000] w-[26rem] py-3  px-3 gap-4 bg-white drop-shadow-lg flex items-center flex-col justify-center">
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
                          value={date.from ? dayjs(date.from) : null}
                          onChange={(newValue) => {
                            setDate((prev) => ({ ...prev, from: newValue }));
                          }}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              sx={{
                                svg: { color: 'primary.main', fontSize: '1.5rem', p: 0 },
                                '& .MuiInputBase-root': {
                                  outline: 'none',
                                  flexDirection: 'row-reverse',
                                },
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
                          value={date.to ? dayjs(date.to) : null}
                          onChange={(newValue) => {
                            setDate((prev) => ({ ...prev, to: newValue }));
                          }}
                          minDate={date.from ? dayjs(date.from) : null}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              sx={{
                                svg: { color: 'primary.main', fontSize: '1.5rem' },
                                '& .MuiInputBase-root': {
                                  outline: 'none',
                                  flexDirection: 'row-reverse',
                                },
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
        </Paper>
      </Box>
    </Toolbar>
  );
};
