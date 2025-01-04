import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { alpha, Box, Stack } from '@mui/system';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import {
  getAllActiveShiftsByCompanyId,
  deleteEmployeeShiftById,
  saveShiftEmployee,
  updateAndDeleteShiftEmployee,
  getAllShiftsByCompanyId,
  updateShiftById,
} from '../../../store/rota/RotaSlice';
import {
  daysOfWeek,
  getNextDateOfWeek,
  getActiveDays,
  mapShiftsToDays,
  calculateHours,
  EmployeeHoursAndCostPerShift,
  totalHoursWeekly,
  sumTotalWeeklyCost,
  exportToCSV,
  calculateBreakDuration,
  calculateWeeklyCostForEmployee,
} from './scheduleUtils';
import { getFirmSchedule } from '../../../store/admin/FirmSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomBackdrop from '../../../components/forms/theme-elements/CustomBackdrop';
import AlertMessage from '../../../components/shared/AlertMessage';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import EditScheduleModal from '../multistep-form/addbySearch/EditScheduleModal';
import EditShiftDialog from './Employee shift actions/EditShiftDialog';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmployeeShiftsEdit from './EmployeeShiftsEdit';
import AddShiftDialog from './Employee shift actions/AddShiftDialog';
import { AnimatePresence, motion } from 'framer-motion';
import { lighten } from '@mui/material/styles';
import DateShiftEdit from './DateShiftEdit';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaidIcon from '@mui/icons-material/Paid';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { saveAs } from 'file-saver';
import ExportMenu from '../components/ExportMenu.js';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AddIcon from '@mui/icons-material/Add';
import EmployeesWithoutShiftsDialog from './EmployeesWithoutShiftsDialog.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

dayjs.extend(duration);
dayjs.extend(customParseFormat);

const employeeColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F06292',
  '#AED581',
  '#7E57C2',
  '#FFD54F',
  '#4DB6AC',
  '#FF7043',
  '#9CCC65',
  '#5C6BC0',
  '#FFF176',
  '#4DD0E1',
  '#F8BBD0',
  '#C5E1A5',
  '#9575CD',
  '#FFE082',
  '#80CBC4',
  '#FFAB91',
  '#DCE775',
  '#7986CB',
  '#FFD180',
  '#80DEEA',
  '#F48FB1',
  '#A5D6A7',
  '#BA68C8',
  '#FFB74D',
  '#4FC3F7',
  '#81C784',
  '#64B5F6',
  '#FFB300',
  '#4DB6AC',
  '#FF8A65',
  '#AED581',
  '#7986CB',
  '#FFF59D',
  '#4DD0E1',
  '#F06292',
  '#9CCC65',
  '#5C6BC0',
  '#FFE082',
  '#26A69A',
  '#FF7043',
  '#C5E1A5',
  '#3F51B5',
  '#FFD54F',
  '#26C6DA',
  '#EC407A',
];
const dayColors = [
  '#FFF0F0', // Light Red
  '#F0FFF0', // Light Green
  '#F0F0FF', // Light Blue
  '#FFFFF0', // Light Yellow
  '#FFF0FF', // Light Magenta
  '#F0FFFF', // Light Cyan
  '#FFF5E6', // Light Gray
];

const Schedule = () => {
  const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [direction, setDirection] = useState(0);
  const currencyData = useSelector((state) => state.loginReducer.user?.currencyData);
  const currencySymbol = currencyData.symbolNative;
  const currencyCode = currencyData.currencyCode;
  //to set monday as the start of the week instead of sunday lol
  const [currentWeek, setCurrentWeek] = React.useState(
    dayjs().startOf('week').add(1, 'day').toDate(),
  );
  const [employeeShiftsEditOpen, setEmployeeShiftsEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [shifts, setShifts] = React.useState([]);
  const [fetchedSchedule, setFetchedSchedule] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const [openWithoutShiftsDialog, setOpenWithoutShiftsDialog] = useState(false);

  const [staff, setStaff] = useState([]);
  const [defaultShifts, setDefaultShifts] = React.useState([]);
  const [shiftDetails, setShiftDetails] = React.useState({
    date: '',
    day: '',
    start: '',
    end: '',
    title: '',
    notes: '',
    breakStartTime: '',
    breakEndTime: '',
    isBreakPaid: false,
    shiftName: '',
  });
  const [newShiftDetails, setNewShiftDetails] = useState({
    date: '',
    startTime: '',
    endTime: '',
    breakStartTime: '',
    breakEndTime: '',
    employeeId: '',
    shiftId: '',
    isBreakPaid: false,
    employeeName: '',
    baseRatePerHour: '',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [changes, setChanges] = useState(0);
  const todayRef = React.useRef(null);
  const containerRef = React.useRef(null);
  // const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('loading');
  const [selectedShift, setSelectedShift] = useState(null);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen((prevState) => !prevState);
  }, []);

  const handleDoubleClick = (date, employeeId, shiftId) => {
    const employee = staff.find((s) => s.id === employeeId);
    const shift = shifts.find((s) => s.id === shiftId);

    let hourlyRate = null;
    let isHourlyRateRequired = false;

    if (employee && shift) {
      const existingShiftRate = employee.shifts.find((s) => s.shiftId === shiftId);
      if (existingShiftRate) {
        hourlyRate = existingShiftRate.hourlyRate;
      } else {
        isHourlyRateRequired = true;
      }
    } else {
      isHourlyRateRequired = true;
    }

    setNewShiftDetails({
      date,
      employeeId,
      shiftId,
      startTime: '',
      endTime: '',
      breakStartTime: '',
      breakEndTime: '',
      isBreakPaid: false,
      hourlyRate: hourlyRate || employee.baseRatePerHour, // here i added it so that if there is no hourly rate found for a shift, we use the baseRate
      baseRatePerHour: employee.baseRatePerHour,
      name: employee.name,
      color: employee.color,
      isHourlyRateRequired,
    });
    setAddShiftOpen(true);
  };
  const spacedCurrencies = ['Rs', '₨', 'kr', 'Rp'];
  const formatCurrency = (amount, isString) => {
    const needsSpace = spacedCurrencies.includes(currencySymbol);
    return `${currencySymbol}${needsSpace ? ' ' : ''}${isString ? amount : amount.toFixed(2)}`;
  };

  const handleAddShiftClose = () => {
    setAddShiftOpen(false);
  };
  const handleAddShiftChange = (e) => {
    setNewShiftDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        toggleFullScreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen, toggleFullScreen]);

  useEffect(() => {
    if (isFullScreen) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  function processBackendData(response) {
    const shiftDataArray = response.payload.DATA;

    // Create shifts array
    const shifts = shiftDataArray.map((shiftData) => ({
      id: shiftData.id,
      name: shiftData.name,
      startDate: shiftData.startDate,
      endDate: shiftData.endDate,
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
    }));

    // Create staff array with unique shifts
    const staffMap = new Map();

    shiftDataArray.forEach((shiftData) => {
      shiftData.shiftEmployeeDetail.forEach((employee) => {
        const employeeShifts = shiftData.shiftDetail.filter(
          (shift) => shift.employeeId === employee.employeeId,
        );

        if (!staffMap.has(employee.employeeId)) {
          staffMap.set(employee.employeeId, {
            id: employee.employeeId,
            name: employee.employeeName,
            color: employeeColors[employee.employeeId % employeeColors.length],
            title: employee.employeeDesignation,
            img: `https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`,
            baseRatePerHour: employee.baseRatePerHour,
            employeeDesignationId: employee.employeeDesignationId,
            shifts: new Map(),
          });
        }

        const staffMember = staffMap.get(employee.employeeId);

        employeeShifts.forEach((shift) => {
          if (!staffMember.shifts.has(shift.shiftId)) {
            const shiftName = shifts.find((s) => s.id === shift.shiftId)?.name || 'Unknown Shift';
            staffMember.shifts.set(shift.shiftId, {
              shiftId: shift.shiftId,
              hourlyRate: shift.hourlyRate,
              name: shiftName,
            });
          }
        });
      });
    });

    // Convert staff Map to Array, calculate min/max rates, and sort by employeeDesignationId
    const uniqueStaffArray = Array.from(staffMap.values())
      .map((staff) => {
        const rates = Array.from(staff.shifts.values())
          .map((shift) => shift.hourlyRate)
          .filter((rate) => rate > 0);
        const minRate = rates.length > 0 ? Math.min(...rates) : 0;
        const maxRate = rates.length > 0 ? Math.max(...rates) : 0;

        return {
          ...staff,
          rate: minRate === maxRate ? minRate || 0 : { min: minRate, max: maxRate },
          shifts: Array.from(staff.shifts.values()),
        };
      })
      .sort((a, b) => {
        // Handle cases where employeeDesignationId might be null
        if (a.employeeDesignationId === null && b.employeeDesignationId === null) {
          return 0; // Both are null, consider them equal
        }
        if (a.employeeDesignationId === null) {
          return 1; // Null values go to the end
        }
        if (b.employeeDesignationId === null) {
          return -1; // Null values go to the end
        }
        return a.employeeDesignationId - b.employeeDesignationId;
      });

    // Process shift details
    const processedShifts = shiftDataArray.flatMap((shiftData) =>
      shiftData.shiftDetail.map((detail) => ({
        start: detail.start,
        end: detail.end,
        title: detail.title,
        resource: detail.employeeId,
        shiftId: detail.shiftId,
        id: detail.id || null,
        breakStartTime: detail.breakStartTime
          ? `${detail.breakStartTime[0].toString().padStart(2, '0')}:${detail.breakStartTime[1]
              .toString()
              .padStart(2, '0')}`
          : null,
        breakEndTime: detail.breakEndTime
          ? `${detail.breakEndTime[0].toString().padStart(2, '0')}:${detail.breakEndTime[1]
              .toString()
              .padStart(2, '0')}`
          : null,
        isBreakPaid: detail.isBreakPaid === 1,
        isNotAvailable: detail.isNotAvailable === 1,
        isEmployeeOnLeave: detail.isEmployeeOnLeave === 1,
        isEmployeeOnUnpaidLeave: detail.isEmployeeOnUnpaidLeave === 1,
      })),
    );
    return { shifts, staffArray: uniqueStaffArray, processedShifts };
  }

  const scrollToToday = () => {
    if (containerRef.current && todayRef.current) {
      const container = containerRef.current;
      const todayElement = todayRef.current;

      const containerRect = container.getBoundingClientRect();
      const todayRect = todayElement.getBoundingClientRect();

      const offsetLeft = todayRect.left - containerRect.left + container.scrollLeft;
      const offsetTop = todayRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        left: offsetLeft,
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToToday();
  }, [currentWeek]);

  useEffect(() => {
    let formdata = new FormData();
    formdata.append('companyId', firmId);
    dispatch(getFirmSchedule(formdata))
      .then((result) => {
        if (result.payload.SUCCESS === 1 && result.payload.DATA.length > 0) {
          setFetchedSchedule(result.payload.DATA[0]);
        } else {
          // setAlert({
          //     open: true,
          //     severity: 'error',
          //     message: result.payload.SUCCESS
          // })
        }
      })
      .catch((err) => {
        setStatus('init');
        console.log(err);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Couldnt fetch schedule. Make sure it exists.',
        });
      });
    dispatch(getAllShiftsByCompanyId(formdata))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const { shifts, staffArray, processedShifts } = processBackendData(result);
          setShifts(shifts);
          setStaff(staffArray);
          setDefaultShifts(processedShifts);
          setStatus('init');
          setTimeout(() => {
            scrollToToday();
          }, 100);
        } else {
          setStatus('init');
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus('init');
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, [changes]);

  const handleClickOpen = (slotData, shiftData) => {
    setShiftDetails((prevState) => ({
      ...prevState,
      ...slotData,
      start: dayjs(slotData.title.split(' - ')[0], 'h:mm').format('h:mm A'),
      end: dayjs(slotData.title.split(' - ')[1], 'h:mm').format('h:mm A'),
      shiftId: slotData.shiftId,
      date: shiftData.date,
      day: shiftData.day,
      id: slotData.id,
      breakStartTime: slotData.breakStartTime
        ? dayjs(slotData.breakStartTime, 'h:mm').format('h:mm A')
        : '',
      breakEndTime: slotData.breakEndTime
        ? dayjs(slotData.breakEndTime, 'h:mm').format('h:mm A')
        : '',
      isBreakPaid: slotData.isBreakPaid || false,
    }));

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (slot, shiftData) => {
    handleClickOpen(slot, shiftData);
  };

  const handleSaveNewShift = (newShiftDetailsOrShift, isFromDialog = false) => {
    let date,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      employeeId,
      shiftId,
      hourlyRate,
      isBreakPaid,
      isHourlyRateRequired;

    if (isFromDialog) {
      ({
        date,
        startTime,
        endTime,
        breakStartTime,
        breakEndTime,
        employeeId,
        shiftId,
        hourlyRate,
        isBreakPaid,
        isHourlyRateRequired,
      } = newShiftDetailsOrShift);
    } else {
      ({
        date,
        startTime,
        endTime,
        breakStartTime,
        breakEndTime,
        employeeId,
        shiftId,
        hourlyRate,
        isBreakPaid,
        isHourlyRateRequired,
      } = newShiftDetails);
    }

    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    let newShift = {
      end: `${formattedDate}T${dayjs(endTime, 'h:mm A').format('HH:mm')}`,
      resource: parseInt(employeeId),
      shiftId: parseInt(shiftId),
      start: `${formattedDate}T${dayjs(startTime, 'h:mm A').format('HH:mm')}`,
      title: `${dayjs(startTime, 'h:mm A').format('HH:mm')} - ${dayjs(endTime, 'h:mm A').format(
        'HH:mm',
      )}`,
      breakStartTime: breakStartTime ? dayjs(breakStartTime, 'h:mm A').format('HH:mm') : null,
      breakEndTime: breakEndTime ? dayjs(breakEndTime, 'h:mm A').format('HH:mm') : null,
      isBreakPaid: isBreakPaid,
    };

    if (!isFromDialog) {
      handleAddShiftClose();
    }

    const formData = new FormData();
    formData.append('companyId', firmId);
    formData.append('date', formattedDate);
    formData.append('startTime', dayjs(startTime, 'h:mm A').format('HH:mm'));
    formData.append('endTime', dayjs(endTime, 'h:mm A').format('HH:mm'));
    formData.append(
      'breakStartTime',
      breakStartTime ? dayjs(breakStartTime, 'h:mm A').format('HH:mm') : '',
    );
    formData.append(
      'breakEndTime',
      breakEndTime ? dayjs(breakEndTime, 'h:mm A').format('HH:mm') : '',
    );
    formData.append('employeeId', employeeId);
    formData.append('employeeHourlyRate', hourlyRate);
    formData.append('shiftId', shiftId);
    formData.append('isBreakPaid', isBreakPaid ? 1 : 0);

    return dispatch(saveShiftEmployee(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Shift added successfully',
          });

          newShift = { ...newShift, id: result.payload.shiftEmployeeId };
          setDefaultShifts((prevShifts) => [...prevShifts, newShift]);

          if (isHourlyRateRequired) {
            setStaff((prevStaff) => {
              return prevStaff.map((employee) => {
                if (employee.id === newShiftDetails.employeeId) {
                  const updatedShifts = [...employee.shifts];
                  const existingShiftIndex = updatedShifts.findIndex(
                    (s) => s.shiftId === newShiftDetails.shiftId,
                  );

                  if (existingShiftIndex !== -1) {
                    updatedShifts[existingShiftIndex].hourlyRate = newShiftDetails.hourlyRate;
                  } else {
                    updatedShifts.push({
                      shiftId: newShiftDetails.shiftId,
                      hourlyRate: newShiftDetails.hourlyRate,
                      name: shifts.find((s) => s.id === newShiftDetails.shiftId)?.name || '',
                    });
                  }

                  // Recalculate min and max rates
                  const rates = updatedShifts.map((s) => s.hourlyRate);
                  const minRate = Math.min(...rates);
                  const maxRate = Math.max(...rates);

                  return {
                    ...employee,
                    shifts: updatedShifts,
                    rate: { min: minRate, max: maxRate },
                  };
                }
                return employee;
              });
            });
          }

          if (!isFromDialog) {
            setAddShiftOpen(false);
          }

          return newShift;
        } else {
          throw new Error(result.payload);
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Error adding shift',
        });
        throw err;
      });
  };

  const editShift = () => {
    const backendData = {
      shiftEmployeeId: shiftDetails.id,
      startTime: dayjs(shiftDetails.start, 'hh:mmA').format('HH:mm'),
      endTime: dayjs(shiftDetails.end, 'hh:mmA').format('HH:mm'),
      breakStartTime: shiftDetails.breakStartTime
        ? dayjs(shiftDetails.breakStartTime, 'hh:mmA').format('HH:mm')
        : '',
      breakEndTime: shiftDetails.breakEndTime
        ? dayjs(shiftDetails.breakEndTime, 'hh:mmA').format('HH:mm')
        : '',
      isBreakPaid: shiftDetails.isBreakPaid ? 1 : 0,
    };

    let formdata = new FormData();
    for (let key in backendData) {
      formdata.append(key, backendData[key]);
    }

    dispatch(updateShiftById(formdata))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Changes Saved.',
          });
        } else {
          // setAlert({
          //     open: true,
          //     severity: 'error',
          //     message: result.payload
          // })
        }
      })
      .catch((err) => {
        console.log(err);
        // setAlert({
        //     open: true,
        //     severity: 'error',
        //     message: err.USER_MESSAGE || 'Something went wrong.'
        // })
      });

    setDefaultShifts((prevShifts) => {
      const updatedShifts = prevShifts.map((shift) => {
        if (
          shift.resource === shiftDetails.staff.id &&
          shift.shiftId === shiftDetails.shiftId &&
          dayjs(shift.start).isSame(dayjs(shiftDetails.date), 'day')
        ) {
          return {
            ...shift,
            start: `${dayjs(shiftDetails.date).format('YYYY-MM-DD')}T${dayjs(
              shiftDetails.start,
              'h:mm A',
            ).format('HH:mm')}`,
            end: `${dayjs(shiftDetails.date).format('YYYY-MM-DD')}T${dayjs(
              shiftDetails.end,
              'h:mm A',
            ).format('HH:mm')}`,
            title: `${dayjs(shiftDetails.start, 'h:mm A').format('HH:mm')} - ${dayjs(
              shiftDetails.end,
              'h:mm A',
            ).format('HH:mm')}`,
            breakStartTime: shiftDetails.breakStartTime
              ? dayjs(shiftDetails.breakStartTime, 'h:mm A').format('HH:mm')
              : '',
            breakEndTime: shiftDetails.breakEndTime
              ? dayjs(shiftDetails.breakEndTime, 'h:mm A').format('HH:mm')
              : '',
            isBreakPaid: shiftDetails.isBreakPaid,
          };
        }
        return shift;
      });

      return updatedShifts;
    });

    setOpen(false);
  };

  const deleteEmployeeShiftFromBE = (slotId) => {
    let formData = new FormData();
    formData.append('shiftEmployeeId', slotId);
    dispatch(deleteEmployeeShiftById(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          // setAlert({
          //     open: true,
          //     severity: 'success',
          //     message: 'Shift deleted successfully'
          // });
          return true;
        } else {
          throw new Error(result.payload);
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong deleting the shift.',
        });
        return false;
      });
  };
  const handleDelete = (shiftId, staffId, date, slotId) => {
    console.log(slotId);
    setDefaultShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== slotId));
    deleteEmployeeShiftFromBE(slotId);
    if (open) {
      setOpen(false);
    }
    setHoveredSlot(null);
  };

  const handleChange = (e) => {
    setShiftDetails((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleEmployeeShiftsEdit = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeShiftsEditOpen(true);
  };
  //this function handles the bulk crud shift actions
  const handleEmployeeShiftsUpdate = (employeeId, updatedShifts, deletedShifts, selectedShift) => {
    setStatus('updating');

    // setDefaultShifts(prevShifts => {
    //     // Log the shifts that should be deleted
    //     console.log("Shifts to be deleted:", prevShifts.filter(shift => deletedShifts.includes(shift.id)));

    //     // Remove deleted shifts
    //     let newShifts = prevShifts.filter(shift => !deletedShifts.includes(shift.id));

    //     // Update existing shifts and add new ones
    //     updatedShifts.forEach(updatedShift => {
    //         const shiftDate = dayjs(updatedShift.date).format('YYYY-MM-DD');
    //         const existingShiftIndex = newShifts.findIndex(shift =>
    //             (shift.id === updatedShift.id) ||
    //             (shift.resource === employeeId &&
    //                 shift.shiftId === selectedShift &&
    //                 dayjs(shift.start).format('YYYY-MM-DD') === shiftDate)
    //         );

    //         const processedShift = {
    //             id: updatedShift.id || `new-${employeeId}-${selectedShift}-${shiftDate}`,
    //             resource: employeeId,
    //             shiftId: selectedShift,
    //             start: `${shiftDate}T${updatedShift.start}`,
    //             end: `${shiftDate}T${updatedShift.end}`,
    //             title: `${updatedShift.start} - ${updatedShift.end}`
    //         };

    //         if (existingShiftIndex !== -1) {
    //             // Update existing shift
    //             newShifts[existingShiftIndex] = processedShift;
    //         } else {
    //             // Add new shift
    //             newShifts.push(processedShift);
    //         }
    //     });

    //     console.log("Updated shifts:", newShifts);
    //     return newShifts;
    // });

    // Prepare data for backend update
    const shiftEmployeeIds = [];
    const startTimes = [];
    const endTimes = [];
    const shiftEmployeeDeletionIds = deletedShifts;

    updatedShifts.forEach((shift) => {
      if (shift.id) {
        shiftEmployeeIds.push(shift.id);
        startTimes.push(shift.start);
        endTimes.push(shift.end);
      }
    });

    // Call API to update backend
    if (shiftEmployeeIds.length > 0 || shiftEmployeeDeletionIds.length > 0) {
      const formData = new FormData();
      formData.append('shiftEmployeeIds', shiftEmployeeIds);
      formData.append('startTimes', startTimes);
      formData.append('endTimes', endTimes);
      formData.append('shiftEmployeeDeletionIds', shiftEmployeeDeletionIds);

      dispatch(updateAndDeleteShiftEmployee(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: 'Shifts updated successfully',
            });
          } else {
            throw new Error(result.payload);
          }
        })
        .catch((err) => {
          console.error(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Error updating shifts',
          });
        });
    }
    // Handle new shifts
    const newShifts = updatedShifts.filter((shift) => !shift.id);
    newShifts.forEach((shift) => {
      const formData = new FormData();
      formData.append('companyId', firmId);
      formData.append('date', shift.date);
      formData.append('startTime', shift.start);
      formData.append('endTime', shift.end);
      formData.append('employeeId', employeeId);
      formData.append(
        'employeeHourlyRate',
        staff.find((s) => s.id === shift.employeeId || employeeId).baseRatePerHour,
      );
      formData.append('shiftId', shift.shiftId);

      dispatch(saveShiftEmployee(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setDefaultShifts((prevShifts) => {
              const newShift = {
                ...shift,
                id: result.payload.shiftEmployeeId,
                resource: shift.employeeId,
                start: `${shift.date}T${shift.start}`,
                end: `${shift.date}T${shift.end}`,
                breakStartTime: shift.breakStartTime
                  ? dayjs(shift.breakStartTime).format('HH:mm')
                  : null,
                breakEndTime: shift.breakEndTime ? dayjs(shift.breakEndTime).format('HH:mm') : null,
                title: `${shift.start} - ${shift.end}`,
              };
              console.log(newShift);
              return [...prevShifts, newShift];
            });
          } else {
            throw new Error(result.payload);
          }
        })
        .catch((err) => {
          console.error(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Error adding new shift',
          });
        });
    });
    setChanges((prev) => prev + 1);
    setStatus('init');
    setEmployeeShiftsEditOpen((prev) => !prev);
  };
  console.log(currentWeek);
  const handleWeekChange = (direction) => {
    setDirection(direction === 'next' ? -1 : 1);
    setCurrentWeek((prevWeek) => {
      const newWeek = dayjs(prevWeek)
        .add(direction === 'next' ? 1 : -1, 'week')
        .toDate();
      return newWeek;
    });
  };

  const activeDayIds = fetchedSchedule ? getActiveDays(fetchedSchedule.weekDays) : [1, 2, 3, 4, 5]; // Default to Mon-Fri if no schedule

  const shiftDays = useMemo(() => {
    const activeDayIds = fetchedSchedule
      ? getActiveDays(fetchedSchedule.weekDays)
      : [1, 2, 3, 4, 5];
    return daysOfWeek
      .map((day, index) => ({
        id: index + 1,
        day: day,
        date: getNextDateOfWeek(day, currentWeek),
      }))
      .filter((day) => activeDayIds.includes(day.id));
  }, [currentWeek, fetchedSchedule]);

  // Function to compare two dates ignoring the time part
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const updatedShiftDays = useMemo(
    () => mapShiftsToDays(shiftDays, defaultShifts, staff, shifts, currentWeek),
    [shiftDays, defaultShifts, staff, shifts],
  );

  const disabled = !shiftDetails.start || !shiftDetails.end;

  const shiftHours = () => {
    const startTime = dayjs(shiftDetails.start, 'hh:mm A');
    const endTime = dayjs(shiftDetails.end, 'hh:mm A');

    if (!startTime.isValid() || !endTime.isValid()) {
      // console.error('Invalid time format');
      return 0;
    } else {
      // If end time is before start time, assume it's the next day
      const adjustedEndTime = endTime.isBefore(startTime) ? endTime.add(1, 'day') : endTime;
      const difference = dayjs.duration(adjustedEndTime.diff(startTime));
      const hours = difference.asHours();

      return hours.toFixed(1);
    }
  };

  const startOfWeek = dayjs(currentWeek).startOf('week').add(1, 'day').format('D MMM');
  const endOfWeek = dayjs(currentWeek).endOf('week').add(1, 'day').format(`D MMM, YYYY`);

  const BCrumb = [
    {
      to: '/rota',
      title: 'Rota',
    },
    {
      title: 'Schedule',
    },
  ];
  const handleShiftUpdates = (updatedShifts, deletedShiftIds) => {
    const shiftEmployeeIds = [];
    const startTimes = [];
    const endTimes = [];
    const shiftEmployeeDeletionIds = deletedShiftIds;

    updatedShifts.forEach((shift) => {
      if (shift.id) {
        shiftEmployeeIds.push(shift.id);
        startTimes.push(shift.start);
        endTimes.push(shift.end);
      }
    });

    if (shiftEmployeeIds.length > 0 || shiftEmployeeDeletionIds.length > 0) {
      const formData = new FormData();
      formData.append('shiftEmployeeIds', shiftEmployeeIds);
      formData.append('startTimes', startTimes);
      formData.append('endTimes', endTimes);
      formData.append('shiftEmployeeDeletionIds', shiftEmployeeDeletionIds);

      dispatch(updateAndDeleteShiftEmployee(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setIsEditModalOpen(false);
            setAlert({
              open: true,
              severity: 'success',
              message: 'Shifts updated successfully',
            });
            setChanges((prev) => prev + 1);
          } else {
            throw new Error(result.payload);
          }
        })
        .catch((err) => {
          console.error(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Error updating shifts',
          });
        });
    }

    // Handle new shifts
    const newShifts = updatedShifts.filter((shift) => !shift.id);
    newShifts.forEach((shift) => {
      const formData = new FormData();
      formData.append('companyId', firmId);
      formData.append('date', shift.date);
      formData.append('startTime', shift.start);
      formData.append('endTime', shift.end);
      formData.append('employeeId', shift.employeeId);
      formData.append(
        'employeeHourlyRate',
        staff.find((s) => s.id === shift.employeeId).baseRatePerHour,
      );
      formData.append('shiftId', shift.shiftId);

      dispatch(saveShiftEmployee(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setDefaultShifts((prevShifts) => {
              const newShift = {
                ...shift,
                id: result.payload.shiftEmployeeId,
                resource: shift.employeeId,
                start: `${shift.date}T${shift.start}`,
                end: `${shift.date}T${shift.end}`,
                breakStartTime: shift.breakStartTime
                  ? dayjs(shift.breakStartTime).format('HH:mm')
                  : null,
                breakEndTime: shift.breakEndTime ? dayjs(shift.breakEndTime).format('HH:mm') : null,
                title: `${shift.start} - ${shift.end}`,
              };
              return [...prevShifts, newShift];
            });
          } else {
            throw new Error(result.payload);
          }
        })
        .catch((err) => {
          console.error(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Error adding new shift',
          });
        });
    });
  };
  console.log(newShiftDetails);
  const handleShiftClick = (date, shiftId) => {
    setSelectedDate(dayjs(date));
    setSelectedShift(shifts.find((shift) => shift.id === shiftId));
    setIsEditModalOpen(true);
  };
  const getFilteredShiftsForDate = (date) => {
    return shifts.filter((shift) => {
      const shiftStart = dayjs(shift.startDate);
      const shiftEnd = dayjs(shift.endDate);
      return (
        dayjs(date).isSameOrAfter(shiftStart, 'day') && dayjs(date).isSameOrBefore(shiftEnd, 'day')
      );
    });
  };
  const handleMarkNotAvailable = (e, date, employeeId, shiftId) => {
    // e.preventDefault();
    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    // If no existing slot, add N/A status

    const newNAShift = {
      end: `${formattedDate}T00:00:00`,
      resource: parseInt(employeeId),
      shiftId: parseInt(shiftId),
      start: `${formattedDate}T00:00:00`,
      title: 'N/A',
      breakStartTime: null,
      breakEndTime: null,
      isBreakPaid: false,
      isNotAvailable: 1,
    };

    const formData = new FormData();
    formData.append('companyId', firmId);
    formData.append('date', formattedDate);
    formData.append('startTime', '00:00');
    formData.append('endTime', '00:00');
    formData.append('employeeId', newNAShift.resource);
    formData.append('employeeHourlyRate', 0);
    // formData.append('employeeHourlyRate', hourlyRate || staff.find(s => s.id === employeeId).rate);
    formData.append('shiftId', newNAShift.shiftId);
    formData.append('isBreakPaid', newNAShift.isBreakPaid ? 1 : 0);
    formData.append('isNotAvailable', 1);

    dispatch(saveShiftEmployee(formData)).then((result) => {
      if (result.payload.SUCCESS === 1) {
        setAlert({
          open: true,
          severity: 'success',
          message: 'Shift marked as N/A successfully',
        });
        newNAShift.id = result.payload.shiftEmployeeId;
        setDefaultShifts((prevShifts) => [...prevShifts, newNAShift]);
      }
    });
  };

  const categorizeEmployees = (staff, shifts, currentWeek) => {
    const weekStart = dayjs(currentWeek).startOf('week').add(1, 'day');
    const weekEnd = dayjs(weekStart).add(6, 'days');

    const employeesWithShifts = new Set();
    shifts.forEach((shift) => {
      const shiftDate = dayjs(shift.start);
      if (shiftDate.isSameOrAfter(weekStart) && shiftDate.isSameOrBefore(weekEnd)) {
        employeesWithShifts.add(shift.resource);
      }
    });

    const withShifts = staff.filter((employee) => employeesWithShifts.has(employee.id));
    const withoutShifts = staff.filter((employee) => !employeesWithShifts.has(employee.id));

    return { withShifts, withoutShifts };
  };
  const { withShifts, withoutShifts } = useMemo(
    () => categorizeEmployees(staff, defaultShifts, currentWeek),
    [staff, defaultShifts, currentWeek],
  );
  console.log(withShifts, withoutShifts);
  return (
    <Box
      pb={3}
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
      {!isFullScreen && <Breadcrumb title="Rota Module" items={BCrumb} />}

      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <EmployeesWithoutShiftsDialog
        open={openWithoutShiftsDialog}
        onClose={() => setOpenWithoutShiftsDialog(false)}
        withoutShifts={withoutShifts}
        shiftDays={updatedShiftDays}
        shifts={shifts}
        handleDoubleClick={handleDoubleClick}
        handleSaveNewShift={(newShiftDetails) => handleSaveNewShift(newShiftDetails, true)}
        handleMarkNotAvailable={handleMarkNotAvailable}
        currencySymbol={currencySymbol}
        formatCurrency={formatCurrency}
      />
      {open && (
        <EditShiftDialog
          open={open}
          shifts={shifts}
          handleClose={handleClose}
          shiftDetails={shiftDetails}
          handleChange={handleChange}
          calculateHours={calculateHours}
          shiftHours={shiftHours}
          editShift={editShift}
          disabled={disabled}
          currencySymbol={currencySymbol}
          formatCurrency={formatCurrency}
        />
      )}
      {addShiftOpen && (
        <AddShiftDialog
          staff={staff}
          open={addShiftOpen}
          shifts={shifts}
          handleClose={handleAddShiftClose}
          shiftDetails={newShiftDetails}
          handleChange={handleAddShiftChange}
          onSave={handleSaveNewShift}
          currencySymbol={currencySymbol}
          formatCurrency={formatCurrency}
        />
      )}
      {employeeShiftsEditOpen && (
        <EmployeeShiftsEdit
          fetchedSchedule={fetchedSchedule}
          shifts={shifts}
          open={employeeShiftsEditOpen}
          toggle={() => setEmployeeShiftsEditOpen(!employeeShiftsEditOpen)}
          employee={selectedEmployee}
          defaultShifts={defaultShifts.filter((s) => s.resource === selectedEmployee?.id)}
          onUpdate={handleEmployeeShiftsUpdate}
          status={status}
        />
      )}
      {isEditModalOpen && (
        <DateShiftEdit
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          shiftData={selectedShift}
          employees={staff}
          onUpdate={handleShiftUpdates}
          defaultShifts={defaultShifts}
          selectedDate={selectedDate}
          currencySymbol={currencySymbol}
          formatCurrency={formatCurrency}
        />
      )}
      <CustomBackdrop loading={status === 'loading'} />
      {status !== 'loading' && (
        <Paper
          sx={{
            scrollbarWidth: 'thin',
            maxHeight: isFullScreen ? 'auto' : 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          elevation={8}
          className="w-full relative "
        >
          <Box
            sx={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              bgcolor: (theme) => lighten(theme.palette.primary.main, 0.9),
            }}
            className="sticky top-[0] z-[99]"
          >
            <Stack direction="row" justifyContent="space-between" px={2} py={1}>
              <Typography mt={1} variant="h4" color="primary">
                {`${startOfWeek} - ${endOfWeek}`}
              </Typography>
              <Stack direction="row" alignItems={'center'}>
                <Box mr={3}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenWithoutShiftsDialog(true)}
                    startIcon={<PersonOffIcon />}
                    sx={{ bgcolor: 'transparent !important' }}
                  >
                    View Employees Without Shifts {` (${withoutShifts.length})`}
                  </Button>
                </Box>
                <IconButton onClick={toggleFullScreen}>
                  {!isFullScreen ? (
                    <FullscreenIcon color="primary" />
                  ) : (
                    <FullscreenExitIcon color="primary" />
                  )}
                </IconButton>
                <Box className="space-x-2">
                  <IconButton onClick={() => handleWeekChange('prev')}>
                    <KeyboardArrowLeftIcon color="primary" />
                  </IconButton>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setCurrentWeek(dayjs().startOf('week').add(1, 'day').toDate());
                    }}
                  >
                    Current Week
                  </Button>

                  <IconButton onClick={() => handleWeekChange('next')}>
                    <KeyboardArrowRightIcon color="primary" />
                  </IconButton>
                </Box>

                <ExportMenu
                  exportToCSV={(includeRates) =>
                    exportToCSV(
                      includeRates,
                      updatedShiftDays,
                      currentWeek,
                      shifts,
                      withShifts,
                      defaultShifts,
                      currencyCode,
                    )
                  }
                  withRatesOption={true}
                />
              </Stack>
            </Stack>
          </Box>
          {/* <div className='w-full h-10 bg-blue-500 sticky top-[4rem]'></div> */}
          {/* removed border here. Seems like giving fixed widths to chidlren was causing issues  */}
          <Grid
            container
            sx={{ scrollbarWidth: 'thin', minHeight: '500px' }}
            flexWrap={'nowrap'}
            className="relative "
          >
            {/* Staff Grid */}
            {withShifts.length > 0 && (
              <Grid item className="border-r min w-auto sticky left-0 bg-white">
                <Box className="px-2 py-[2.15rem] border-b border-white text-white flex items-end justify-end">
                  <Typography fontSize={12} className="text-blue  w-fit text-white text-end">
                    Daily hrs & cost
                  </Typography>
                </Box>
                <Grid container>
                  <Grid item>
                    <Typography fontSize={12} className="px-2 py-1 border-b text-gray-500 text-end">
                      Daily hrs & cost
                    </Typography>
                    <Grid container direction="column" columns={2}>
                      {withShifts.map((data, idx) => (
                        <Grid key={idx} item xs={1} className="border-b">
                          <Box
                            sx={{ height: '60px', minWidth: 'rem' }}
                            className="p-2 flex flex-row justify-start space-x-2 align-top"
                          >
                            <Avatar src={data.img} sx={{ width: '35px', height: '35px' }} />
                            <Stack sx={{ width: '100%' }}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="start"
                                sx={{ width: '100%' }}
                              >
                                <Typography
                                  sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}
                                >
                                  {data.name}
                                </Typography>

                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      {data.shifts.map((shift) => (
                                        <Typography key={shift.shiftId} sx={{ fontSize: '11px' }}>
                                          {shift.name}: {formatCurrency(data.baseRatePerHour)}/hr
                                        </Typography>
                                      ))}
                                    </React.Fragment>
                                  }
                                  arrow
                                >
                                  {/* <Typography
                                    sx={{
                                      fontSize: '11px',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      ml: 2,
                                    }}
                                    className="text-gray-400 px-2"
                                  >
                                    £{data.baseRatePerHour}/hr
                                    {(() => {
                                      const minRate = data.rate.min;
                                      const maxRate = data.rate.max;
                                      if (typeof data.rate === 'number') {
                                        return `£${data.rate}/hr`;
                                      } else {
                                        return `£${minRate}/£${maxRate}/hr`;
                                      }
                                    })()}
                                  </Typography> */}
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      ml: 2,
                                    }}
                                    className="text-gray-400 px-2"
                                  >
                                    {formatCurrency(data.baseRatePerHour)}/hr
                                  </Typography>
                                </Tooltip>
                              </Stack>
                              <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography
                                  sx={{ fontSize: '11px', fontWeight: 600 }}
                                  className="whitespace-nowrap "
                                >
                                  {data.title}
                                </Typography>
                                <ScheduleIcon
                                  onClick={() => handleEmployeeShiftsEdit(data)}
                                  className="pr-2 pb-1 cursor-pointer"
                                  sx={{ fontSize: '1.5rem', color: 'primary.main', ml: 2 }}
                                />
                              </Stack>
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    {/* <Grid key={'2'} item xs={1} className="border-b">
                    <Box
                      sx={{ height: '60px' }}
                      className="p-2 flex flex-row justify-start space-x-2 align-top w-full"
                    >
                      <Avatar sx={{ width: '35px', height: '35px' }} />
                      <Typography fontSize={14} sx={{ whiteSpace: 'nowrap' }}>
                        Add Employee
                      </Typography>
                    </Box>
                  </Grid> */}
                    {/* <Typography className='px-2 py-1 text-white'>Name</Typography> */}
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid
              item
              container
              flexWrap={'nowrap'}
              sx={{ scrollbarWidth: 'thin', overflowX: 'scroll', overflowY: 'hidden' }}
              ref={containerRef}
            >
              {/* Shifts Grid */}
              {updatedShiftDays.map((shiftData, index) => {
                const filteredShifts = getFilteredShiftsForDate(shiftData.date);
                return (
                  <Grid
                    key={index}
                    item
                    sx={{
                      backgroundColor: dayColors[index % 7],
                      position: 'relative',
                      flex: 1,
                      minWidth: `${filteredShifts.length > 0 ? filteredShifts.length * 9 : 9}rem`,
                    }}
                  >
                    <Box
                      sx={{ borderRadius: '0px !important' }}
                      className={`px-2 py-1  ${
                        updatedShiftDays.length - 1 !== index && 'border-r'
                      } border-b`}
                    >
                      <Typography
                        // onClick={() => handleDateClick(dayjs(shiftData.date))}
                        ref={isSameDay(shiftData.date, new Date()) ? todayRef : null}
                        fontWeight={600}
                        className={`text-center w-fit ${
                          isSameDay(shiftData.date, new Date())
                            ? 'px-5 text-white rounded-full'
                            : ''
                        }`}
                        sx={{
                          position: 'sticky',
                          left: '2px',
                          top: '100px',
                          bgcolor: (theme) =>
                            isSameDay(shiftData.date, new Date()) &&
                            `${theme.palette.primary.main}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dayjs(shiftData.date).format('D MMM ddd')}
                      </Typography>
                    </Box>
                    {filteredShifts.length > 0 ? (
                      <Grid container columns={filteredShifts.length}>
                        {filteredShifts.map((shift, shiftIndex) => {
                          const shiftDataForThisShift = shiftData.shifts.find(
                            (s) => s.id === shift.id,
                          );

                          return (
                            <Grid item xs={1} key={shift.id}>
                              <Typography
                                sx={{ fontWeight: 600 }}
                                className={`pl-2 py-1 border-r border-b cursor-pointer overflow-hidden h-[30px]`}
                              >
                                {shift.name}
                                <ScheduleIcon
                                  onClick={() => handleShiftClick(shiftData.date, shift.id)}
                                  className="pr-2 pb-[3px] cursor-pointer"
                                  sx={{ fontSize: '1.5rem', color: 'primary.main', ml: 1 }}
                                />
                              </Typography>
                              <Grid item>
                                <Box
                                  sx={{ height: '60px', borderRadius: 0 }}
                                  className="p-2 border-b border-r max-w-full"
                                >
                                  {(() => {
                                    const { hours, cost } = EmployeeHoursAndCostPerShift(
                                      shiftData,
                                      shift.id,
                                    );
                                    return (
                                      <>
                                        <Typography
                                          sx={{ fontSize: 12 }}
                                          className="text-center cursor-pointer rounded-sm"
                                        >
                                          {hours > 0 ? `${hours} hrs` : ''}
                                        </Typography>
                                        <Typography
                                          sx={{ fontSize: 12, fontWeight: '600' }}
                                          className="text-center cursor-pointer rounded-sm"
                                        >
                                          {cost > 0
                                            ? `${
                                                spacedCurrencies.includes(currencySymbol)
                                                  ? `${currencySymbol} `
                                                  : currencySymbol
                                              }${cost}`
                                            : ''}
                                        </Typography>
                                      </>
                                    );
                                  })()}
                                </Box>
                              </Grid>
                              <Grid container direction="column" columns={1} className="border-r">
                                {shiftDataForThisShift?.employees.map((slot, slotIndex) => (
                                  <Grid key={slotIndex} item xs={1} className="border-b">
                                    <Box
                                      sx={{ height: '60px' }}
                                      className="p-2 flex items-center justify-center"
                                      // onContextMenu={(e) => handleRightClick(e, shiftData.date, slot.staff.id, shift.id)}
                                    >
                                      {slot.title ? (
                                        <Slot
                                          slot={slot}
                                          shiftData={shiftData}
                                          shift={shift}
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                        />
                                      ) : (
                                        <EmptySlot
                                          date={shiftData.date}
                                          staffId={slot.staff.id}
                                          shiftId={shift.id}
                                          onClick={handleDoubleClick}
                                          onMarkNA={(e) =>
                                            handleMarkNotAvailable(
                                              e,
                                              shiftData.date,
                                              slot.staff.id,
                                              shift.id,
                                            )
                                          }
                                        />
                                      )}
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <NoShiftsPlaceholder date={shiftData.date} />
                    )}
                  </Grid>
                );
              })}
            </Grid>

            {/* Cost grid */}

            <Grid item xs={1} className="border-l relative  bg-white">
              {/* <Typography fontWeight={600} fontSize={12} className='px-2 py-1 border-b border-white text-black text-center'>Weekly</Typography> */}
              <Grid container columns={2}>
                <Grid item xs={2}>
                  <Typography
                    fontWeight={500}
                    fontSize={12}
                    className="px-2 py-2 pb-[.3rem] h-[57px] border-b text-center text-gray-500"
                  >
                    Weekly <br /> <span className="whitespace-nowrap">Hrs & cost</span>
                  </Typography>
                  <Typography
                    key={currentWeek}
                    sx={{ fontSize: 12 }}
                    className="px-2 py-[.55rem] border-b text-center text-gray-500 w-full"
                  >
                    Total:
                    <br />
                    <Typography
                      variant="span"
                      style={{
                        fontWeight: 600,
                        fontSize: 12,
                        color: 'black',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isNaN(sumTotalWeeklyCost(withShifts, defaultShifts, currentWeek))
                        ? ''
                        : formatCurrency(
                            sumTotalWeeklyCost(withShifts, defaultShifts, currentWeek),
                          )}
                    </Typography>
                  </Typography>
                  <Grid container direction="column" columns={2}>
                    {withShifts.map((staffData, indx) => (
                      <Grid key={indx} item xs={1} className="border-b box-bordera">
                        <Box
                          sx={{ height: '60px', boxSizing: 'border-box !important' }}
                          className="p-2"
                        >
                          <Typography
                            sx={{ fontSize: 12 }}
                            className="text-center cursor-pointer rounded-sm"
                          >
                            {(() => {
                              const hours = totalHoursWeekly(
                                staffData.id,
                                defaultShifts,
                                currentWeek,
                              );
                              return hours > 0 ? `${hours} hrs` : '';
                            })()}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 12, fontWeight: '600', whiteSpace: 'nowrap' }}
                            className="text-center cursor-pointer rounded-sm"
                          >
                            {(() => {
                              const cost = calculateWeeklyCostForEmployee(
                                staffData,
                                defaultShifts,
                                currentWeek,
                              );
                              return cost > 0 ? formatCurrency(cost) : '';
                            })()}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default Schedule;

const Slot = ({ slot, shiftData, shift, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleEdit = () => {
    onEdit(slot, shiftData);
  };

  const handleDelete = () => {
    onDelete(shift.id, slot.staff.id, shiftData.date, slot.id);
  };

  if (slot.isNotAvailable) {
    return (
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          fontSize: '11px',
          boxSizing: 'border-box',
          color: 'gray.600',
          fontWeight: 'bold',
          borderRadius: '5px',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: 'rgba(224, 224, 224, 0.5)',
          border: '1px dashed #9E9E9E',
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '6.5rem',
        }}
      >
        <BlockIcon sx={{ fontSize: 18, color: '#757575', marginBottom: '2px' }} />
        <Typography variant="caption" sx={{ fontWeight: 'medium', color: '#616161' }}>
          N/A
        </Typography>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-full left-[0] flex flex-col z-[10] bg-white w-[6.5rem] text-black drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 4 }}
              transition={{ duration: 0.1 }}
            >
              <Box>
                <Typography
                  sx={{ color: 'red' }}
                  onClick={handleDelete}
                  className="flex gap-3 py-2 hover:bg-gray-200 px-2"
                >
                  <DeleteIcon fontSize="small" sx={{ color: 'red' }} /> Delete
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
  }

  if (slot.isEmployeeOnLeave) {
    const leaveType = slot.isEmployeeOnUnpaidLeave ? 'Unpaid Leave' : 'Paid Leave';
    const leaveColor = slot.isEmployeeOnUnpaidLeave ? '#FF9800' : '#4CAF50';

    let paidHours = 0;
    if (!slot.isEmployeeOnUnpaidLeave) {
      paidHours = calculateHours(
        slot.start,
        slot.end,
        slot.breakStartTime,
        slot.breakEndTime,
        slot.isBreakPaid,
      );
    }

    return (
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          fontSize: '11px',
          boxSizing: 'border-box',
          color: 'gray.600',
          fontWeight: 'bold',
          borderRadius: '5px',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: 'rgba(255, 235, 205, 0.5)',
          border: `1px dashed ${leaveColor}`,
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '6.5rem',
        }}
      >
        <BeachAccessIcon sx={{ fontSize: 18, color: leaveColor, marginBottom: '2px' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 'medium', color: leaveColor, mr: 0.5 }}>
            {leaveType}
          </Typography>
          {!slot.isEmployeeOnUnpaidLeave && (
            <Tooltip
              title={
                !slot.isEmployeeOnUnpaidLeave
                  ? `Paid for ${paidHours.toFixed(1)} hours`
                  : 'Unpaid Leave'
              }
            >
              <IconButton size="small" sx={{ padding: 0 }}>
                <InfoIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-full left-[0] flex flex-col z-[10] bg-white w-[6.5rem] text-black drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 4 }}
              transition={{ duration: 0.1 }}
            >
              <Box>
                <Typography
                  sx={{ color: 'red' }}
                  onClick={handleDelete}
                  className="flex gap-3 py-2 hover:bg-gray-200 px-2"
                >
                  <DeleteIcon fontSize="small" sx={{ color: 'red' }} /> Delete
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
  }

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontSize: '10px',
        borderLeft: `7px solid ${slot.staff.color}`,
        backgroundColor: slot.isNotAvailable ? 'lightgray' : 'white',
        boxSizing: 'border-box',
        color: 'black',
        fontWeight: 'bold',
        borderRadius: '5px',
        position: 'relative',
      }}
      className="text-center cursor-pointer rounded-sm px-2 w-[6.5rem] flex flex-col"
    >
      {slot.title}
      <Box
        sx={{
          fontSize: '10px',
          alignSelf: 'start',
          pl: 0.85,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <FreeBreakfastIcon sx={{ fontSize: 13, color: slot.staff.color }} />
        <Typography fontSize={'10px'} pb={0.2} className="flex items-center gap-1">
          {slot.breakStartTime && slot.breakEndTime ? (
            <>
              {` ${calculateBreakDuration(slot.breakStartTime, slot.breakEndTime)}m`}
              {slot.isBreakPaid && (
                <Tooltip title="Paid break">
                  <Box
                    component="span"
                    sx={{
                      borderRadius: '10px',
                      color: 'primary.main',
                      fontSize: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Paid
                  </Box>
                </Tooltip>
              )}
            </>
          ) : (
            'No break'
          )}
        </Typography>
      </Box>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            onPointerDownCapture={(e) => e.stopPropagation()}
            className="absolute bottom-full left-[-.3rem] flex flex-col z-[10] bg-white w-[6.5rem] text-black drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.1 }}
          >
            <Box>
              <Typography
                sx={{ color: 'primary.main' }}
                onClick={handleEdit}
                className="flex gap-3 py-2 hover:bg-gray-200 px-2 border-b"
              >
                <EditIcon fontSize="small" sx={{ color: 'primary.main' }} /> Edit
              </Typography>
              <Typography
                sx={{ color: 'red' }}
                onClick={handleDelete}
                className="flex gap-3 py-2 hover:bg-gray-200 px-2"
              >
                <DeleteIcon fontSize="small" sx={{ color: 'red' }} /> Delete
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const EmptySlot = ({ date, staffId, shiftId, onClick, onMarkNA }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        height: '50px',
        width: '100%',
        position: 'relative',
        borderRadius: 0,
        backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        textAlign: 'center',
        fontSize: 11,
      }}
      className="p-2 flex items-center justify-center cursor-pointer"
      onClick={() => onClick(date, staffId, shiftId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && '+ Add new shift'}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full flex flex-col z-[10] bg-white w-[8rem] text-black drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.1 }}
          >
            <Box>
              <Typography
                sx={{ color: 'black' }}
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkNA();
                }}
                className="flex gap-3 items-center py-2 hover:bg-gray-200 px-2"
              >
                <EventBusyIcon fontSize="small" sx={{ color: 'black' }} /> Mark as N/A
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
export const NoShiftsPlaceholder = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        textAlign: 'center',
      }}
    >
      <EventBusyIcon
        sx={{
          fontSize: 28,
          mb: 1,

          color: (theme) => alpha(theme.palette.text.secondary, 0.4),
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: (theme) => alpha(theme.palette.text.secondary, 0.6),
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        No shift scheduled
      </Typography>
    </Box>
  );
};

const FreeEmployeesSchedule = ({
  withoutShifts,
  shiftDays,
  shifts,
  handleDoubleClick,
  handleMarkNotAvailable,
}) => {
  return (
    <Grid container sx={{ scrollbarWidth: 'thin' }} flexWrap={'nowrap'} className="relative">
      {/* Employee names column */}
      <Grid item className="border-r min-w-auto sticky left-0 bg-white">
        <div className="px-2 pt-[2.45rem] border-b text-gray-500 flex items-end justify-end">
          <Typography fontSize={12} className="text-blue w-fit text-gray-500 text-end">
            Free Employees
          </Typography>
        </div>
        <Grid container direction="column" sx={{ pb: 1 }}>
          {withoutShifts.map((employee, idx) => (
            <Grid key={idx} item className="border-b">
              <Box
                sx={{ height: '60px', borderRadius: 0 }}
                className="p-2 flex flex-row justify-start space-x-2 align-top mr-3"
              >
                <Avatar src={employee.img} sx={{ width: '35px', height: '35px' }} />
                <Stack sx={{ width: '100%' }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {employee.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '11px', fontWeight: 600 }}
                    className="whitespace-nowrap"
                  >
                    {employee.title}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Schedule grid */}
      <Grid
        item
        container
        flexWrap={'nowrap'}
        sx={{ scrollbarWidth: 'thin', overflowX: 'scroll', overflowY: 'hidden' }}
      >
        {shiftDays.map((shiftData, index) => {
          const filteredShifts = shifts.filter(
            (shift) =>
              dayjs(shift.startDate).isSameOrBefore(shiftData.date) &&
              dayjs(shift.endDate).isSameOrAfter(shiftData.date),
          );

          return (
            <Grid
              key={index}
              item
              sx={{
                backgroundColor: dayColors[index % 7],
                position: 'relative',
                flex: 1,
                borderRadius: 0,
                minWidth: `${filteredShifts.length > 0 ? filteredShifts.length * 9 : 9}rem`,
              }}
            >
              <Box
                sx={{ borderRadius: 0 }}
                className={`px-2 py-1 ${index < shiftDays.length - 1 ? 'border-r' : ''} border-b`}
              >
                <Typography fontWeight={600} className="text-center w-fit">
                  {dayjs(shiftData.date).format('D MMM ddd')}
                </Typography>
              </Box>
              {filteredShifts.length > 0 ? (
                <Grid container columns={filteredShifts.length}>
                  {filteredShifts.map((shift) => (
                    <Grid item xs={1} key={shift.id}>
                      <Typography
                        sx={{ fontWeight: 600 }}
                        className="pl-2 py-1 border-r border-b overflow-hidden h-[31px]"
                      >
                        {shift.name}
                      </Typography>
                      <Grid container direction="column" columns={1} className="border-r">
                        {withoutShifts.map((employee) => (
                          <Grid key={employee.id} item xs={1} className="border-b">
                            <Box
                              sx={{ height: '60px' }}
                              className="p-2 flex items-center justify-center"
                            >
                              <EmptySlot
                                date={shiftData.date}
                                staffId={employee.id}
                                shiftId={shift.id}
                                onClick={handleDoubleClick}
                                onMarkNA={(e) =>
                                  handleMarkNotAvailable(e, shiftData.date, employee.id, shift.id)
                                }
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <NoShiftsPlaceholder />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
