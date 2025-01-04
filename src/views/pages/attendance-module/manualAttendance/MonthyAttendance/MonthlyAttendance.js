import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Fade,
  Menu,
  Autocomplete,
  TextField,
  Button,
  Popover,
  Badge,
  LinearProgress,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import {
  getAllMonthlyAttendances,
  deleteEmployeeAttendance,
  updateEmployeeAttendance,
} from '../../../../../store/attendance/AttendanceSlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import FullscreenDialog from '../../../../../components/material-ui/dialog/FullscreenDialog';
import AttendanceDetail from '../AttendanceDetail';
import { IconLoader2 } from '@tabler/icons';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Breadcrumb from '../../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import CreateAttendanceModal from '../CreateAttendanceModal';
import UpdateAttendanceModal from '../UpdateAttendanceModal';
import AlertMessage from '../../../../../components/shared/AlertMessage';
import DeleteAttendanceModal from '../DeleteAttendanceModal';
dayjs.extend(isToday);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

import ExportMenu from './ExportMenu';
import AttendanceCell from './AttendanceCell';
import AttendanceStatusLegend from './AttendanceStatusLegend';
import StatusSummary from './StatusSummary';
import DailySummaryCell from './DailySummaryCell';

const MonthlyAttendanceCalendar = () => {
  const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [availableMonths, setAvailableMonths] = useState([]);
  const dispatch = useDispatch();
  const [date, setDate] = useState({
    from: selectedMonth.startOf('month').format('YYYY-MM-DD'),
    to: selectedMonth.endOf('month').format('YYYY-MM-DD'),
  });
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewDetail, setViewDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [changes, setChanges] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const openFilter = Boolean(anchorEl);
  const id = openFilter ? 'filter-popover' : undefined;

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const getWeeksOfMonth = useCallback(() => {
    const startOfMonth = selectedMonth.startOf('month');
    const endOfMonth = selectedMonth.endOf('month');
    const weeks = [];
    let currentWeekStart = startOfMonth.startOf('week');

    while (currentWeekStart.isBefore(endOfMonth)) {
      const weekEnd = currentWeekStart.endOf('week');
      weeks.push({
        start: currentWeekStart,
        end: weekEnd,
        label: `${currentWeekStart.format('MMM D')} - ${weekEnd.format('MMM D')}`,
      });
      currentWeekStart = currentWeekStart.add(1, 'week');
    }

    return weeks;
  }, [selectedMonth]);

  const weeks = getWeeksOfMonth();

  useEffect(() => {
    setSelectedWeek(null); // Reset selected week when month changes
  }, [selectedMonth]);

  const generateMonthsForYear = (year) => {
    return Array.from({ length: 12 }, (_, i) => dayjs().year(year).month(i).format('MMMM YYYY'));
  };
  useEffect(() => {
    const currentYear = selectedMonth.year();
    const previousYear = currentYear - 1;
    const months = [...generateMonthsForYear(previousYear), ...generateMonthsForYear(currentYear)];
    setAvailableMonths(months);
  }, [selectedMonth]);

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => prev.add(1, 'month'));
  };

  const handleWeekChange = (e) => {
    const selectedWeekData = weeks.find((week) => week.label === e.target.value);
    setSelectedWeek(selectedWeekData);
    if (selectedWeekData) {
      setDate({
        from: selectedWeekData.start.format('YYYY-MM-DD'),
        to: selectedWeekData.end.format('YYYY-MM-DD'),
      });
    } else {
      // If "All Weeks" is selected, set date to full month
      setDate({
        from: selectedMonth.startOf('month').format('YYYY-MM-DD'),
        to: selectedMonth.endOf('month').format('YYYY-MM-DD'),
      });
    }
  };

  const openEmployeeDetailModal = (id) => {
    setEmployeeId(id);
    setOpen(true);
  };

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen((prevState) => !prevState);
  }, []);

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

  useEffect(() => {
    setDate({
      from: selectedMonth.startOf('month').format('YYYY-MM-DD'),
      to: selectedMonth.endOf('month').format('YYYY-MM-DD'),
    });
  }, [selectedMonth]);

  useEffect(() => {
    if (!date.to || !date.from) return;
    setLoading(true);

    const formdata = new FormData();
    formdata.append('companyId', firmId);
    formdata.append('startDate', dayjs(date.from).format('YYYY-MM-DD'));
    formdata.append('endDate', dayjs(date.to).format('YYYY-MM-DD'));

    dispatch(getAllMonthlyAttendances(formdata))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAttendanceData(result.payload.DATA);
          setLoading(false);
        } else {
          // Handle error
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        // Handle error
      });
  }, [date.to, date.from, changes]);

  const handleCreateAttendance = (employeeId, date) => {
    setSelectedAttendance({ employeeId, date });
    setCreateModalOpen(true);
  };

  const handleEditAttendance = (attendance, employeeId, employeeName) => {
    setSelectedAttendance({ ...attendance, employeeId: employeeId, employeeName: employeeName });
    setUpdateModalOpen(true);
  };
  const handleDeleteAttendance = (attendanceId) => {
    setAttendanceToDelete(attendanceId);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.append('attendenceId', attendanceToDelete);

    dispatch(deleteEmployeeAttendance(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setChanges((prev) => prev + 1);
          setAlert({
            open: true,
            severity: 'success',
            message: 'Attendance deleted successfully',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Failed to delete attendance',
        });
      })
      .finally(() => {
        setConfirmModalOpen(false);
        setAttendanceToDelete(null);
      });
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    let currentDate = dayjs(start);
    const endDate = dayjs(end);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      dates.push(currentDate);
      currentDate = currentDate.add(1, 'day');
    }

    return dates;
  };

  const getStatusSummary = useCallback((employee) => {
    const summary = {
      P: 0,
      A: 0,
      L: 0,
      CDO: 0,
      PH: 0,
      OPL: 0,
      OUPL: 0,
    };

    employee.employeeDetail.forEach((detail) => {
      if (summary.hasOwnProperty(detail.statusSymbol)) {
        summary[detail.statusSymbol]++;
      }
      if (detail.statusSymbol === 'OPL' || detail.statusSymbol === 'OUPL') {
        summary.L++;
      }
    });

    return summary;
  }, []);

  const dates = getDatesInRange(date.from, date.to);

  const getStatusColor = (status) => {
    switch (status) {
      case 'P':
        return { backgroundColor: '#e0ffe9', color: 'green' };
      case 'A':
        return { backgroundColor: '#ffc7c7', color: 'red' };
      case 'L':
        return { backgroundColor: '#fff0d6', color: 'black' };
      case 'CDO':
        return { backgroundColor: '#e3efff', color: '#0197f6' };
      case 'PH':
        return { backgroundColor: '#ececf9', color: 'purple' };
      case 'OPL':
        return { backgroundColor: '#fff4e5', color: '#e65100' };
      case 'OUPL':
        return { backgroundColor: '#e8eaf6', color: '#3f51b5' };
      default:
        return { backgroundColor: 'inherit', color: 'inherit' };
    }
  };

  const isToday = (date) => dayjs(date, 'DD/MM/YYYY').isToday();

  const employeeNames = [...new Set(attendanceData.map((employee) => employee.employeeName))];
  const designations = [
    ...new Set(attendanceData.map((employee) => employee.employeeDesignationLabel)),
  ];

  const filteredData = useMemo(() => {
    return attendanceData.filter(
      (employee) =>
        (selectedEmployees.length === 0 || selectedEmployees.includes(employee.employeeName)) &&
        (selectedDesignations.length === 0 ||
          selectedDesignations.includes(employee.employeeDesignationLabel)),
    );
  }, [attendanceData, selectedEmployees, selectedDesignations]);

  const filteredDates = useMemo(() => {
    return selectedWeek
      ? getDatesInRange(selectedWeek.start, selectedWeek.end)
      : getDatesInRange(date.from, date.to);
  }, [selectedWeek, date.from, date.to]);

  const exportToCSV = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Set default styles
    worksheet.properties.defaultRowHeight = 15;
    worksheet.properties.defaultColWidth = 15;

    // Get all dates
    const dateRows = data[0]?.employeeDetail.map((detail) => detail.date) || [];

    // Create employee name headers with employee numbers
    const headers = ['Employee Name'];
    data.forEach((employee) => {
      headers.push(`${employee.employeeName} (${employee.employeeNo})`, '', '');
    });

    // Create designation row
    const designationRow = ['Designation'];
    data.forEach((employee) => {
      designationRow.push(employee.employeeDesignationLabel, '', '');
    });

    // Create column headers
    const columnHeaders = [''];
    data.forEach(() => {
      columnHeaders.push('Time In', 'Time Out', 'Total');
    });

    // Add headers and merge cells for employee names and designations
    const headerRow = worksheet.addRow(headers);
    const designationHeaderRow = worksheet.addRow(designationRow);
    const columnHeaderRow = worksheet.addRow(columnHeaders);

    // Merge cells for employee names and designations
    for (let i = 2; i <= headers.length; i += 3) {
      worksheet.mergeCells(1, i, 1, i + 2); // Merge employee name cells
      worksheet.mergeCells(2, i, 2, i + 2); // Merge designation cells

      // Center align the merged cells
      worksheet.getCell(1, i).alignment = { horizontal: 'center' };
      worksheet.getCell(2, i).alignment = { horizontal: 'center' };
    }

    // Style headers
    [headerRow, designationHeaderRow, columnHeaderRow].forEach((row) => {
      row.font = { name: 'Calibri', size: 11, bold: true };
    });

    // Add data rows
    dateRows.forEach((date) => {
      const row = worksheet.addRow([dayjs(date, 'DD/MM/YYYY').format('D MMM ddd')]);
      row.getCell(1).font = { name: 'Calibri', size: 11, bold: true };

      data.forEach((employee) => {
        const attendance = employee.employeeDetail.find((d) => d.date === date);

        if (attendance) {
          const status = attendance.statusSymbol;
          const timeIn = attendance.checkInTime || status;
          const timeOut = attendance.checkOutTime || status;

          let total = '-';
          if (attendance.checkInTime && attendance.checkOutTime && status === 'P') {
            const startTime = dayjs(attendance.checkInTime, 'h:mm A');
            const endTime = dayjs(attendance.checkOutTime, 'h:mm A');
            const duration = endTime.diff(startTime, 'minute');
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            total = `${hours}:${minutes.toString().padStart(2, '0')}`;
          } else {
            total = status;
          }

          [timeIn, timeOut, total].forEach((value) => {
            const cell = row.getCell(row.cellCount + 1);
            cell.value = value;
            cell.font = { name: 'Calibri', size: 11, color: { argb: getTextColor(status) } };
            cell.alignment = { horizontal: 'center' };
          });
        } else {
          // Add empty cells if no attendance found
          for (let i = 0; i < 3; i++) {
            const cell = row.getCell(row.cellCount + 1);
            cell.value = '-';
            cell.font = { name: 'Calibri', size: 11 };
            cell.alignment = { horizontal: 'center' };
          }
        }
      });
    });

    // Add empty row before summaries for distinction
    worksheet.addRow([]);

    // Calculate and add summary rows
    const summaryLabels = [
      'Total Hours (hh:mm)',
      'Total Present Days',
      'Total Absent Days',
      'Total Leaves Days',
      'Total Paid Leaves Days',
      'Total Unpaid Leaves Days',
      'Total Others Days',
    ];

    summaryLabels.forEach((label) => {
      const summaryRow = worksheet.addRow([label]);
      summaryRow.getCell(1).font = { name: 'Calibri', size: 11, bold: true };

      data.forEach((employee) => {
        const summary = calculateEmployeeSummary(employee.employeeDetail);

        // Get the "Total" column index (every 3rd column starting from 4)
        const totalColumnIndex = summaryRow.cellCount + 3;

        // Add empty cells for Time In and Time Out
        summaryRow.getCell(totalColumnIndex - 2).value = '';
        summaryRow.getCell(totalColumnIndex - 1).value = '';

        // Add the summary value in the Total column
        const totalCell = summaryRow.getCell(totalColumnIndex);
        let value = '';

        switch (label) {
          case 'Total Hours (hh:mm)':
            value = summary.totalHours;
            break;
          case 'Total Present Days':
            value = summary.presentDays;
            break;
          case 'Total Absent Days':
            value = summary.absentDays;
            break;
          case 'Total Leaves Days':
            value = summary.leaveDays;
            break;
          case 'Total Paid Leaves Days':
            value = summary.paidLeaveDays;
            break;
          case 'Total Unpaid Leaves Days':
            value = summary.unpaidLeaveDays;
            break;
          case 'Total Others Days':
            value = summary.otherDays;
            break;
        }

        totalCell.value = value;
        totalCell.font = { name: 'Calibri', size: 11 };
        totalCell.alignment = { horizontal: 'right' };
      });
    });

    // Helper functions remain the same
    function calculateEmployeeSummary(details) {
      let totalMinutes = 0;
      const summary = {
        presentDays: 0,
        absentDays: 0,
        leaveDays: 0,
        paidLeaveDays: 0,
        unpaidLeaveDays: 0,
        otherDays: 0,
      };

      details.forEach((detail) => {
        switch (detail.statusSymbol) {
          case 'P':
            summary.presentDays++;
            if (detail.checkInTime && detail.checkOutTime) {
              const startTime = dayjs(detail.checkInTime, 'h:mm A');
              const endTime = dayjs(detail.checkOutTime, 'h:mm A');
              totalMinutes += endTime.diff(startTime, 'minute');
            }
            break;
          case 'A':
            summary.absentDays++;
            break;
          case 'OPL':
            summary.paidLeaveDays++;
            summary.leaveDays++;
            break;
          case 'OUPL':
            summary.unpaidLeaveDays++;
            summary.leaveDays++;
            break;
          case 'CDO':
          case 'PH':
            summary.otherDays++;
            break;
        }
      });

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      summary.totalHours = `${hours}:${minutes.toString().padStart(2, '0')}`;

      return summary;
    }

    function getTextColor(status) {
      switch (status) {
        case 'A':
          return 'FF0000'; // Red
        case 'OPL':
          return 'FF8C00'; // Orange
        case 'CDO':
          return '0000FF'; // Blue
        case 'P':
          return '000000'; // Green
        default:
          return '000000'; // Black
      }
    }

    // Set column widths
    worksheet.getColumn(1).width = 20; // Date column
    for (let i = 2; i <= headers.length; i++) {
      worksheet.getColumn(i).width = 15;
    }

    // Add borders
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (!cell.font) {
          cell.font = { name: 'Calibri', size: 11 };
        }
      });
    });

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `attendance_${selectedMonth.format('MMMM_YYYY')}.xlsx`);
  };

  const activeFilterCount = selectedDesignations.length + selectedEmployees.length;
  const BCrumb = [
    {
      to: '/attendance',
      title: 'Attendance',
    },
    {
      title: 'Monthly Wise Attendance',
    },
  ];

  const dailyStatusCounts = useMemo(() => {
    const counts = {};
    filteredData.forEach((employee) => {
      employee.employeeDetail.forEach((detail) => {
        const date = dayjs(detail.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        if (!counts[date]) {
          counts[date] = { P: 0, A: 0, L: 0, CDO: 0, PH: 0, OPL: 0, OUPL: 0 };
        }
        counts[date][detail.statusSymbol] = (counts[date][detail.statusSymbol] || 0) + 1;
      });
    });
    return counts;
  }, [filteredData]);

  const MemoizedStatusSummary = React.memo(StatusSummary);
  const MemoizedDailySummaryCell = React.memo(DailySummaryCell);

  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      {/* <CustomBackdrop loading={loading} /> */}
      <Breadcrumb title="Monthly Wise Attendance" items={BCrumb} />
      {open && (
        <FullscreenDialog open={open} setOpen={setOpen} title="Employee Attendance Details">
          <AttendanceDetail id={employeeId} initialDate={date} />
        </FullscreenDialog>
      )}
      <Box sx={{ position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              zIndex: 1000,
              ...(isFullScreen && {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999999,
                maxHeight: 'auto',
                mt: 0,
                overflow: 'auto',
              }),
            }}
          >
            <Box
              sx={{
                height: '100%',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                color={'primary.main'}
                className="text-center flex flex-col items-center justify-center"
              >
                <div className="animate-spin mb-2">
                  <IconLoader2 size={40} />
                </div>
                <Typography variant="body2">Loading...</Typography>
              </Box>
            </Box>
          </Box>
        )}
        <TableContainer
          component={Paper}
          sx={{
            // maxHeight: '600px',
            scrollbarWidth: 'thin',
            mt: 0,
            ...(isFullScreen && {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
              maxHeight: 'auto',
              mt: 0,
              overflow: 'auto',
              backgroundColor: 'white',
            }),
          }}
        >
          <Box
            sx={{ width: '100%' }}
            className="py-5 border-t flex justify-center items-center sticky left-0 top-0"
          >
            <Box sx={{ width: '100%' }} className="flex justify-between items-center px-5 w-full">
              <Box className="flex items-center gap-5">
                <Typography color={'primary.main'} variant="h6" fontWeight={600}>
                  {filteredData.length} Employee(s)
                </Typography>
                <Divider flexItem orientation="vertical" />
                <Box className="flex items-center justify-between border ">
                  <IconButton onClick={handlePreviousMonth}>
                    <KeyboardArrowLeftIcon sx={{ color: 'primary.main' }} />
                  </IconButton>
                  <FormControl size="">
                    <Select
                      id="monthSelector"
                      name="monthSelector"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSelect-select': {
                          pr: '5px !important',
                          pl: '5px !important',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                      disabled={loading}
                      value={selectedMonth.format('MMMM YYYY')}
                      IconComponent={() => {}}
                      onChange={(e) => setSelectedMonth(dayjs(e.target.value, 'MMMM YYYY'))}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {availableMonths.map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={handleNextMonth}>
                    <KeyboardArrowRightIcon sx={{ color: 'primary.main' }} />
                  </IconButton>
                </Box>
                <FormControl size="">
                  <Select
                    id="weekSelector"
                    value={selectedWeek ? selectedWeek.label : ''}
                    onChange={handleWeekChange}
                    displayEmpty
                    disabled={loading}
                  >
                    <MenuItem value="">All Weeks</MenuItem>
                    {weeks.map((week) => (
                      <MenuItem key={week.label} value={week.label}>
                        {week.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box className="flex items-center gap-5">
                <Badge
                  badgeContent={activeFilterCount}
                  color="primary"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 5,
                      top: 5,
                      padding: '0 4px',
                      height: '18px',
                      minWidth: '18px',
                    },
                  }}
                >
                  <Button
                    aria-describedby={id}
                    variant="outlined"
                    onClick={handleFilterClick}
                    className="flex items-center gap-2 w-[6.6rem] h-[2.8rem]"
                    sx={{
                      color: true ? 'gray !important' : 'gray !important',
                      border: true ? '1px solid #e5e7eb' : '1px solid lightgray',
                      backgroundColor: 'white !important',
                    }}
                  >
                    Filters
                    <FilterAltIcon />
                  </Button>
                </Badge>

                <Popover
                  id={id}
                  open={openFilter}
                  anchorEl={anchorEl}
                  onClose={handleFilterClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Box sx={{ p: 2, pb: 4, width: 400 }}>
                    <Box
                      className="flex justify-end"
                      onClick={() => {
                        setSelectedDesignations([]);
                        setSelectedEmployees([]);
                        setAnchorEl(null);
                      }}
                    >
                      <Typography
                        color={'primary.main'}
                        className="w-fit pb-1 underline cursor-pointer"
                      >
                        Clear
                      </Typography>
                    </Box>

                    <Typography fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                      Designations
                    </Typography>
                    <Autocomplete
                      multiple
                      id="designationFilter"
                      options={designations}
                      value={selectedDesignations}
                      onChange={(event, newValue) => setSelectedDesignations(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          placeholder="All Designations"
                        />
                      )}
                    />
                    <Typography fontWeight={600} gutterBottom sx={{ mt: 2, mb: 1 }}>
                      Employees
                    </Typography>
                    <Autocomplete
                      multiple
                      id="employeeFilter"
                      options={employeeNames}
                      value={selectedEmployees}
                      onChange={(event, newValue) => setSelectedEmployees(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          placeholder="All Employees"
                        />
                      )}
                    />
                  </Box>
                </Popover>
                <FormControlLabel
                  value="start"
                  control={
                    <Switch
                      color="primary"
                      checked={viewDetail}
                      onChange={(e) => setViewDetail(e.target.checked)}
                    />
                  }
                  label="View Detail"
                  labelPlacement="start"
                />
                <AttendanceStatusLegend getStatusColor={getStatusColor} />
                <IconButton onClick={toggleFullScreen}>
                  {!isFullScreen ? (
                    <FullscreenIcon color="primary" />
                  ) : (
                    <FullscreenExitIcon color="primary" />
                  )}
                </IconButton>
                <ExportMenu exportToCSV={exportToCSV} attendanceData={filteredData} />
              </Box>
            </Box>
          </Box>
          <Table
            padding="normal"
            header={'true'}
            stickyHeader
            sx={{
              width: '100%',
              position: 'relative',
              '& .MuiTableRow-root:last-child td': {
                borderBottom: '1px solid #e5eaef',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ zIndex: 12 }}
                  className="min-w-[15rem] w-[15rem] sticky left-0 bg-white border-r border-t"
                >
                  <Typography fontWeight={600}> Employee Name</Typography>
                </TableCell>

                {filteredDates.map((date) => (
                  <TableCell
                    sx={{
                      backgroundColor: isToday(date) ? 'primary.main' : '',
                      color: isToday(date) ? 'white' : '',
                    }}
                    key={date.valueOf()}
                    align="center"
                    className="min-w-[4rem] border-r border-t"
                  >
                    <Box>
                      <Typography color={isToday(date) ? 'white' : 'gray'}>
                        {date.format('MMM')}
                      </Typography>
                      <Typography fontWeight={800}>{date.format('DD')} </Typography>
                      <Typography color={isToday(date) ? 'white' : 'gray'}>
                        {date.format('ddd')}
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
                <TableCell
                  className="border-r border-t"
                  sx={{
                    backgroundColor: 'background.paper',
                  }}
                />
              </TableRow>
            </TableHead>
            <TableBody sx={{ position: 'relative' }}>
              {filteredData.map((employee, index) => (
                <TableRow key={employee.employeeId}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                    className="sticky left-0 border-r min-w-[10rem] bg-white "
                  >
                    <Box className="flex items-center gap-2">
                      <Avatar
                        src={`https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${employee?.profileFileName}`}
                        sx={{ width: 35, height: 35 }}
                      />
                      <Box>
                        <Typography fontWeight={600} className="whitespace-nowrap text-ellipsis">
                          {' '}
                          {employee.employeeName}
                        </Typography>
                        <Typography fontSize={10} color={'grey'}>
                          {employee.employeeNo}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={() => openEmployeeDetailModal(employee.employeeId)}>
                      <AccessAlarmIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                    </IconButton>
                  </TableCell>
                  {filteredDates.map((date) => {
                    return (
                      <TableCell
                        sx={{ maxWidth: selectedWeek ? '4.3rem' : '' }}
                        key={date.valueOf()}
                        align="center"
                        className="border-r"
                        padding="none"
                      >
                        <AttendanceCell
                          employee={employee}
                          date={date}
                          getStatusColor={getStatusColor}
                          handleEditAttendance={handleEditAttendance}
                          handleCreateAttendance={handleCreateAttendance}
                          handleDeleteAttendance={handleDeleteAttendance}
                          viewDetail={viewDetail}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      zIndex: 0,
                      maxWidth: '15rem',
                      overflow: 'hidden',
                      py: 0,
                    }}
                    className="sticky right-0 border-l bg-white"
                  >
                    <MemoizedStatusSummary summary={getStatusSummary(employee)} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  className="border-r"
                  sx={{
                    backgroundColor: 'background.paper',
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                  }}
                >
                  Daily Summary
                </TableCell>
                {filteredDates.map((date, index) => (
                  <TableCell
                    key={date.valueOf()}
                    align="center"
                    sx={{
                      backgroundColor: 'background.paper',
                      padding: '8px 4px',
                    }}
                    className={`border-r ${index === 0 && 'border-l'}`}
                  >
                    <MemoizedDailySummaryCell dailyStatusCounts={dailyStatusCounts} date={date} />
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    backgroundColor: 'background.paper',
                  }}
                />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <CreateAttendanceModal
        open={createModalOpen}
        setAlert={setAlert}
        handleClose={() => setCreateModalOpen(false)}
        employeeId={selectedAttendance?.employeeId}
        selectedDate={selectedAttendance?.date}
        companyId={firmId}
        setChanges={setChanges}
      />

      <UpdateAttendanceModal
        setAlert={setAlert}
        open={updateModalOpen}
        handleClose={() => setUpdateModalOpen(false)}
        attendanceData={selectedAttendance}
        companyId={firmId}
        setChanges={setChanges}
      />
      <DeleteAttendanceModal
        open={confirmModalOpen}
        handleClose={() => setConfirmModalOpen(false)}
        handleConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this attendance record? This action cannot be undone."
      />
    </>
  );
};

export default MonthlyAttendanceCalendar;
