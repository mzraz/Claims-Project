import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Stack,
  Box,
  Fab,
  FormControlLabel,
  Switch,
  lighten,
  Avatar,
  ListItem,
  ListItemText,
  List,
  ListItemButton,
  Divider,
  Chip,
} from '@mui/material';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllCompanyEmployeeLeavesByCompanyId,
  saveCompanyEmployeeLeave,
  deleteCompanyEmployeeLeave,
} from '../../../../store/leave/LeaveSlice';
import { getAllActiveEmployeesData } from '../../../../store/hr/EmployeeSlice';

import '../../hr-module/calendar/Calendar.css';
import PageContainer from '../../../../components/container/PageContainer';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { useDispatch } from 'react-redux';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Check as IconCheck,
  ViewAgenda as ViewAgendaIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import AlertMessage from '../../../../components/shared/AlertMessage';
import LeaveDialog from './LeaveDialog';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';
import CloseIcon from '@mui/icons-material/Close';

const localizer = dayjsLocalizer(dayjs);

const CustomToolbar = ({
  date,
  onNavigate,
  showRemarks,
  setShowRemarks,
  toggleFullScreen,
  isFullScreen,
  view,
  onView,
}) => {
  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToCurrent = () => {
    onNavigate('TODAY');
  };

  const label = () => {
    return dayjs(date).format('MMMM YYYY');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        bgcolor: (theme) => lighten(theme.palette.primary.main, 0.9),
        borderRadius: '0px',
        marginBottom: '0px',
      }}
    >
      <Box className="flex gap-3 items-center">
        <Button
          variant="outlined"
          size="small"
          onClick={goToCurrent}
          sx={{ bgcolor: 'transparent !important' }}
        >
          Today
        </Button>
        <Box>
          <IconButton onClick={goToBack} sx={{ color: 'primary.main' }}>
            <ArrowBackIos sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton onClick={goToNext} sx={{ color: 'primary.main' }}>
            <ArrowForwardIos sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: '600', color: 'primary.main', width: '12rem' }}>
          {label()}
        </Typography>
      </Box>

      <Stack direction={'row'} alignItems="center">
        {/* <IconButton onClick={() => onView(view === Views.MONTH ? Views.AGENDA : Views.MONTH)} sx={{ mr: 2 }}>
                    {view === Views.MONTH ? <ViewAgendaIcon color="primary" /> : <CalendarMonthIcon color="primary" />}
                </IconButton> */}
        <IconButton onClick={toggleFullScreen} sx={{ mr: 2 }}>
          {!isFullScreen ? (
            <FullscreenIcon color="primary" />
          ) : (
            <FullscreenExitIcon color="primary" />
          )}
        </IconButton>
        <FormControlLabel
          labelPlacement="start"
          control={
            <Switch checked={showRemarks} onChange={(e) => setShowRemarks(e.target.checked)} />
          }
          label={
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ color: (theme) => lighten(theme.palette.primary.main, 0.1) }}
            >
              Show Remarks
            </Typography>
          }
        />
      </Stack>
    </Box>
  );
};

const CustomEvent = React.memo(({ event, showRemarks }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Avatar loading="lazy" src={event.employee.img} sx={{ width: 24, height: 24, mr: 1 }} />
    <div>
      <Typography variant="body2" fontWeight={600}>
        {event.title}
      </Typography>
      {showRemarks && event.remarks && <div style={{ fontSize: '0.8em' }}>{event.remarks}</div>}
    </div>
  </div>
));

const LeaveCalendar = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('AutoBeatXData'));
  const firmId = user?.firmId;

  const [leaves, setLeaves] = useState([]);
  const [open, setOpen] = useState(false);
  const [showRemarks, setShowRemarks] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const prevDateRef = useRef(currentDate);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: '', message: '' });
  const [slotInfo, setSlotInfo] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [moreEventsOpen, setMoreEventsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleShowMore = useCallback((events, date) => {
    setSelectedDate(date);
    setEventsForSelectedDate(events);
    setMoreEventsOpen(true);
  }, []);

  const handleCloseMoreEvents = useCallback(() => {
    setMoreEventsOpen(false);
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  const fetchEmployees = () => {
    const formData = new FormData();
    formData.append('companyId', firmId);
    dispatch(getAllActiveEmployeesData(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const employeesWithImages = result.payload.DATA.filter(
            (employee) => employee.companyLeaveId,
          ).map((employee) => ({
            ...employee,
            imageUrl: `https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`,
          }));
          setEmployees(employeesWithImages);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to fetch employees.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while fetching employees.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const getLeaveQuotaIdAndColor = (data) => {
    if (data.isMedical === 1) return { id: 1, color: 'red', label: 'Medical' };
    if (data.isCasual === 1) return { id: 2, color: 'green', label: 'Casual' };
    if (data.isAnnual === 1) return { id: 3, color: 'blue', label: 'Annual' };
    return { quota: '', color: 'default', label: 'Unknown' };
  };
  const handleViewChange = (newView) => {
    setView(newView);
  };

  const fetchLeaves = () => {
    const formData = new FormData();
    formData.append('companyId', firmId);
    dispatch(getAllCompanyEmployeeLeavesByCompanyId(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const formattedLeaves = result.payload.DATA.map((leave) => ({
            id: leave.companyEmployeeLeaveId,
            title: `${leave.employeeFullName} - ${leave.leaveTypeLabel}`,
            start: dayjs(leave.fromDate, 'DD/MM/YYYY').toDate(),
            end: dayjs(leave.toDate, 'DD/MM/YYYY').toDate(),
            leaveType: leave.leaveTypeId,
            leaveQuota: getLeaveQuotaIdAndColor(leave).id,
            leaveQuotaLabel: getLeaveQuotaIdAndColor(leave).label,
            color: getLeaveQuotaIdAndColor(leave).color || 'default',
            leaveTypeLabel: leave.leaveTypeLabel,
            employee: {
              id: leave.employeeId,
              fullName: leave.employeeFullName,
              employeeNo: leave.employeeNo,
              companyLeaveId: leave.companyLeaveId,
              img: `https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${leave.profileFileName}`,
            },
            remarks: leave?.remarks,
            isPaidLeave: leave.isUnpaid === 0,
          }));
          setLeaves(formattedLeaves);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to fetch leaves.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while fetching leaves.',
        });
      });
  };

  const checkOverlappingLeaves = (employeeId, start, end, currentLeaveId = null) => {
    return leaves.some(
      (leave) =>
        leave.employee.id === employeeId &&
        leave.id !== currentLeaveId &&
        (dayjs(start).isBetween(dayjs(leave.start), dayjs(leave.end), null, '[]') ||
          dayjs(end).isBetween(dayjs(leave.start), dayjs(leave.end), null, '[]') ||
          dayjs(leave.start).isBetween(dayjs(start), dayjs(end), null, '[]') ||
          dayjs(leave.end).isBetween(dayjs(start), dayjs(end), null, '[]')),
    );
  };

  const handleSaveLeave = (leaveData) => {
    const isEditing = !!editingLeave;
    const currentLeaveId = isEditing ? editingLeave.id : null;

    if (
      checkOverlappingLeaves(leaveData.employee.id, leaveData.start, leaveData.end, currentLeaveId)
    ) {
      setAlert({
        open: true,
        severity: 'warning',
        message:
          'This employee already has a leave during the selected period. Please choose different dates.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('companyId', firmId);
    formData.append('employeeId', leaveData.employee.id);
    formData.append('companyLeaveId', leaveData.employee.companyLeaveId);
    formData.append('leavetypeId', leaveData.leaveTypeId);
    formData.append('leaveQuotaId', leaveData.leaveQuotaId || 0);
    formData.append('fromDate', dayjs(leaveData.start).format('YYYY-MM-DD'));
    formData.append('toDate', dayjs(leaveData.end).format('YYYY-MM-DD'));
    formData.append('remarks', leaveData.remarks);
    formData.append('color', leaveData.color);
    formData.append('isUnpaid', leaveData.isUnpaid);

    if (editingLeave) {
      formData.append('companyEmployeeLeaveId', editingLeave.id);
    }

    dispatch(saveCompanyEmployeeLeave(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: editingLeave ? 'Leave updated successfully.' : 'Leave added successfully.',
          });
          fetchLeaves();
          setEditingLeave(null);
          setOpen(false);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to save leave.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while saving leave.',
        });
      });
  };

  const handleDeleteLeave = (leaveId) => {
    const formData = new FormData();
    formData.append('companyEmployeeLeaveId', leaveId);

    dispatch(deleteCompanyEmployeeLeave(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Leave deleted successfully.',
          });
          fetchLeaves();
          setEditingLeave(null);
          setOpen(false);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to delete leave.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while deleting leave.',
        });
      });
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

  const addNewLeave = (slotInfo) => {
    setSlotInfo(slotInfo);
    setEditingLeave(null);
    setOpen(true);
  };

  const editLeave = (leave) => {
    setSlotInfo(null);
    setEditingLeave(leave);
    setOpen(true);
  };

  const handleNavigate = (action) => {
    let newDate;
    switch (action) {
      case 'PREV':
        newDate = currentDate.subtract(1, 'month');
        break;
      case 'NEXT':
        newDate = currentDate.add(1, 'month');
        break;
      case 'TODAY':
        newDate = dayjs();
        break;
      default:
        newDate = currentDate;
    }
    prevDateRef.current = currentDate;
    setCurrentDate(newDate);
  };

  const getAnimationDirection = () => {
    if (currentDate.isAfter(prevDateRef.current)) {
      return 'left';
    } else if (currentDate.isBefore(prevDateRef.current)) {
      return 'right';
    }
    return 'none';
  };

  const slideVariants = {
    enterLeft: {
      x: '50px',
      opacity: 0,
    },
    enterRight: {
      x: '-50px',
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exitLeft: {
      opacity: 0.5,
    },
    exitRight: {
      opacity: 0.5,
    },
  };

  const direction = getAnimationDirection();
  const BCrumb = [
    {
      to: '/Hr',
      title: 'Hr module',
    },
    {
      title: 'Leave Calendar',
    },
  ];
  const memoizedComponents = useMemo(
    () => ({
      event: (props) => <CustomEvent {...props} showRemarks={showRemarks} />,
    }),
    [showRemarks],
  );

  return (
    <>
      {isLoading && <CustomBackdrop loading={isLoading} />}
      {open && (
        <LeaveDialog
          open={open}
          handleClose={() => setOpen(false)}
          onSave={handleSaveLeave}
          onDelete={handleDeleteLeave}
          initialData={editingLeave}
          slotInfo={slotInfo}
          employees={employees}
          firmId={firmId}
          checkOverlappingLeaves={(employeeId, start, end) =>
            checkOverlappingLeaves(employeeId, start, end, editingLeave?.id)
          }
        />
      )}

      <PageContainer title="Leave Calendar" description="This is the Leave Calendar page">
        <Breadcrumb title="Leave Calendar" items={BCrumb} />
        {/* <Typography variant='h3' color={'primary.main'} my={3}>Leave Calendar</Typography> */}
        <AlertMessage
          open={alert.open}
          setAlert={setAlert}
          severity={alert.severity}
          message={alert.message}
        />
        <Box
          variant="outlined"
          sx={{
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
          <Box sx={{ overflow: 'hidden' }}>
            <CustomToolbar
              date={currentDate.toDate()}
              onNavigate={handleNavigate}
              showRemarks={showRemarks}
              setShowRemarks={setShowRemarks}
              toggleFullScreen={toggleFullScreen}
              isFullScreen={isFullScreen}
              view={view}
              onView={handleViewChange}
            />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentDate.toString()}
                initial={direction === 'left' ? 'enterLeft' : 'enterRight'}
                animate="center"
                exit={direction === 'left' ? 'exitLeft' : 'exitRight'}
                variants={slideVariants}
                transition={{ type: 'tween', duration: 0.1 }}
              >
                <Calendar
                  selectable
                  events={leaves}
                  // views={[Views.MONTH, Views.AGENDA]}
                  views={['month']}
                  defaultView="month"
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  date={currentDate.toDate()}
                  onNavigate={handleNavigate}
                  localizer={localizer}
                  style={{
                    height: isFullScreen ? 'calc(100vh - 100px)' : 'calc(100vh - 350px)',
                    transition: 'height 0.3s ease-in-out',
                  }}
                  onSelectEvent={(leave) => editLeave(leave)}
                  onSelectSlot={(slotInfo) => addNewLeave(slotInfo)}
                  eventPropGetter={(event) => ({
                    className: `event-${event.color || 'default'}`,
                  })}
                  components={memoizedComponents}
                  dayPropGetter={(date) => ({
                    style: {
                      backgroundColor: dayjs(date).isSame(dayjs(), 'day') ? '#e6f7e6' : undefined,
                      borderBottom: 'none',
                    },
                  })}
                  endAccessor={(event) => {
                    return dayjs(event.end).add(1, 'day').toDate();
                  }}
                  toolbar={null}
                  onShowMore={handleShowMore}
                />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </PageContainer>
      <Dialog open={moreEventsOpen} onClose={handleCloseMoreEvents} maxWidth="sm" fullWidth>
        <DialogTitle>
          Events for {selectedDate && dayjs(selectedDate).format('MMMM D, YYYY')}
          <IconButton
            aria-label="close"
            onClick={handleCloseMoreEvents}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {eventsForSelectedDate.map((event, index) => (
              <>
                {index > 0 && <Divider component="li" />}

                <ListItemButton
                  key={index}
                  onClick={() => {
                    handleCloseMoreEvents();
                    editLeave(event);
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="flex-start">
                        <Avatar src={event.employee.img} sx={{ width: 50, height: 50, mr: 2 }} />
                        <Box>
                          <Box className="flex gap-2 items-center">
                            <Typography variant="subtitle1" component="div">
                              {event.title}
                            </Typography>
                            <Typography
                              className={`event-${event.color || 'default'}`}
                              sx={{ borderRadius: '10px', px: 1, color: 'white' }}
                            >
                              {event.leaveQuotaLabel || 'hia hee'}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.primary">
                            {`${dayjs(event.start).format('DD MMM YYYY')} - ${dayjs(
                              event.end,
                            ).format('DD MMM YYYY')}`}
                          </Typography>
                          {event.remarks && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Remarks: {event.remarks}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </>
            ))}
          </List>
          {/* <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 0 }}>
                        <Button
                            variant='outlined'
                            onClick={handleCloseMoreEvents}
                            sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
                        >
                            Back
                        </Button>
                    </DialogActions> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaveCalendar;
