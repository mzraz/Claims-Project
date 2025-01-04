import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Alert,
  Box,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchScheduleData,
  formatShiftForBackend,
  normalizeEmployeeShift,
  normalizeShiftTemplates,
} from './utils/scheduleDataUtils';
// import { calculateShiftHours, calculateTotalCost } from './utils/shiftCalculations';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { getAllShiftsByCompanyId } from '../../../../store/rota/RotaSlice';
import ScheduleTableBody from './TableBody';
import ScheduleHeader from './ScheduleTableHeader';
import OldSchedule from 'src/views/pages/rota-module/Schedule.js';
import ScheduleTableFooter from './ScheduleTableFooter';

const Schedule = () => {
  const dispatch = useDispatch();
  const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;

  // Core state
  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week').add(1, 'day').toDate());
  const [shiftTemplates, setShiftTemplates] = useState([]);
  const [employeeShifts, setEmployeeShifts] = useState([]); // UI state
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const [newShiftDetails, setNewShiftDetails] = useState({});
  const [employeeShiftsEditOpen, setEmployeeShiftsEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const loadScheduleData = useCallback(async () => {
    try {
      setStatus('loading');
      const data = await fetchScheduleData(dispatch, firmId);
      setShiftTemplates(data.shiftTemplates);
      setEmployeeShifts(data.employeeShifts);
      setStatus('succeeded');
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: err.message || 'Failed to load schedule',
      });
      setStatus('failed');
    }
  }, [dispatch, firmId]);

  // Then, let's add the currency data from Redux:
  const currencyData = useSelector((state) => state.loginReducer.user?.currencyData);

  // Add the handler for deleting shifts:
  const handleShiftDelete = async (shiftId) => {
    try {
      setStatus('updating');
      const formData = new FormData();
      formData.append('shiftEmployeeId', shiftId);

      const result = await dispatch(deleteEmployeeShiftById(formData)).unwrap();

      if (result.SUCCESS === 1) {
        await loadScheduleData();
        setAlert({
          open: true,
          severity: 'success',
          message: 'Shift deleted successfully',
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: err.message || 'Failed to delete shift',
      });
    } finally {
      setStatus('succeeded');
    }
  };

  const handleWeekChange = (direction, date) => {
    if (direction === 'current' && date) {
      setCurrentWeek(date);
    } else {
      setCurrentWeek((prev) =>
        dayjs(prev)
          .add(direction === 'next' ? 1 : -1, 'week')
          .toDate(),
      );
    }
  };
  useEffect(() => {
    loadScheduleData();
  }, []);
  // Calculate week dates
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = dayjs(currentWeek);

    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.add(i, 'day'));
    }

    return dates;
  }, [currentWeek]);

  // Get employees with shifts this week
  const weeklyEmployees = useMemo(() => {
    const employeeMap = new Map();

    weekDates.forEach((date) => {
      const dateShifts = employeeShifts.filter((shift) => dayjs(shift.date).isSame(date, 'day'));

      dateShifts.forEach((shift) => {
        console.log(shift);
        if (!employeeMap.has(shift.employeeId)) {
          employeeMap.set(shift.employeeId, {
            id: shift.employeeId,
            name: shift.employeeName,
            designation: shift.employeeDesignation,
            baseRate: shift.baseRatePerHour,
          });
        }
      });
    });

    return Array.from(employeeMap.values());
  }, [employeeShifts, weekDates]);

  // Handlers
  const handleAddShift = async (employeeId, date, shiftTemplateId) => {
    try {
      setStatus('updating');
      const formData = new FormData();
      formData.append('employeeId', employeeId);
      formData.append('date', dayjs(date).format('YYYY-MM-DD'));
      formData.append('shiftTemplateId', shiftTemplateId);

      const result = await dispatch(saveShiftEmployee(formData)).unwrap();

      if (result.SUCCESS === 1) {
        await loadScheduleData();
        setAlert({
          open: true,
          severity: 'success',
          message: 'Shift added successfully',
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: err.message || 'Failed to add shift',
      });
    } finally {
      setStatus('succeeded');
      setAddShiftOpen(false);
    }
  };

  const handleShiftUpdate = async (shiftId, updates) => {
    try {
      setStatus('updating');
      const formData = formatShiftForBackend({ id: shiftId, ...updates });
      const result = await dispatch(updateShiftById(formData)).unwrap();

      if (result.SUCCESS === 1) {
        await loadScheduleData();
        setAlert({
          open: true,
          severity: 'success',
          message: 'Shift updated successfully',
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: err.message || 'Failed to update shift',
      });
    } finally {
      setStatus('succeeded');
      setEditModalOpen(false);
    }
  };

  const toggleFullScreen = () => {
    if (isFullScreen && document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <Box
        py={isFullScreen ? 0 : 3}
        sx={{
          ...(isFullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            overflow: 'auto',
            backgroundColor: 'white',
          }),
        }}
      >
        <CustomBackdrop loading={status === 'loading'} />
        <AlertMessage
          open={alert.open}
          setAlert={setAlert}
          severity={alert.severity}
          message={alert.message}
        />
        <Paper
          sx={{
            scrollbarWidth: 'thin',
            maxHeight: isFullScreen ? 'auto' : 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          elevation={8}
        >
          <ScheduleHeader
            currentWeek={currentWeek}
            onWeekChange={handleWeekChange}
            isFullScreen={isFullScreen}
            onToggleFullScreen={toggleFullScreen}
          />
          <TableContainer sx={{ maxHeight: isFullScreen ? 'calc(100vh - 70px)' : '600px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.paper',
                      minWidth: '240px',
                    }}
                  >
                    Employee
                  </TableCell>
                  {weekDates.map((date) => (
                    <TableCell
                      key={date.format('YYYY-MM-DD')}
                      sx={{
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        minWidth: 180,
                        backgroundColor: dayjs().isSame(date, 'day')
                          ? 'primary.light'
                          : 'background.paper',
                      }}
                    >
                      {date.format('ddd DD')}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <ScheduleTableBody
                employees={weeklyEmployees}
                weekDates={weekDates}
                employeeShifts={employeeShifts}
                shiftTemplates={shiftTemplates}
                onShiftAdd={handleAddShift}
                onShiftEdit={(shift) => {
                  setSelectedShift(shift);
                  setEditModalOpen(true);
                }}
                onShiftDelete={(shiftId) => {
                  // Add delete handler
                  handleShiftDelete(shiftId);
                }}
                currencyCode={currencyData?.currencyCode} // Add this to your component state
                currencySymbol={currencyData?.symbolNative} // Add this to your component state
                onEditEmployeeShifts={(employee) => {
                  setSelectedEmployee(employee);
                  setEmployeeShiftsEditOpen(true);
                }}
              />
              <ScheduleTableFooter
                weekDates={weekDates}
                employeeShifts={employeeShifts}
                currencySymbol={currencyData?.symbolNative}
              />
            </Table>
          </TableContainer>
        </Paper>
        {/* Modals will go here */}
      </Box>
      <OldSchedule />
    </>
  );
};

export default Schedule;
