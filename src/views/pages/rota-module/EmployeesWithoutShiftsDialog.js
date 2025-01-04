import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Box,
  Avatar,
  Typography,
  Stack,
  Button,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { EmptySlot, NoShiftsPlaceholder } from './Schedule';
import AddShiftDialog from './Employee shift actions/AddShiftDialog';
import LocalShiftSlot from './LocalShiftSlot';

const dayColors = ['#FFF0F0', '#F0FFF0', '#F0F0FF', '#FFFFF0', '#FFF0FF', '#F0FFFF', '#FFF5E6'];

const EmployeesWithoutShiftsDialog = ({
  open,
  onClose,
  withoutShifts,
  shiftDays,
  shifts,
  handleSaveNewShift,
  handleMarkNotAvailable,
  formatCurrency,
}) => {
  const [localShifts, setLocalShifts] = useState([]);
  const [addShiftOpen, setAddShiftOpen] = useState(false);
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

  useEffect(() => {
    if (open) {
      setLocalShifts([]);
    }
  }, [open]);

  const handleDoubleClick = (date, employeeId, shiftId) => {
    const employee = withoutShifts.find((s) => s.id === employeeId);
    setNewShiftDetails({
      date,
      employeeId,
      shiftId,
      startTime: '',
      endTime: '',
      breakStartTime: '',
      breakEndTime: '',
      isBreakPaid: false,
      hourlyRate: employee.baseRatePerHour,
      baseRatePerHour: employee.baseRatePerHour,
      name: employee.name,
      color: employee.color,
    });
    setAddShiftOpen(true);
  };

  const handleAddShiftClose = () => {
    setAddShiftOpen(false);
  };

  const handleAddShiftChange = (e) => {
    setNewShiftDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveNewLocalShift = () => {
    const newShift = {
      ...newShiftDetails,
      id: `temp-${Date.now()}`, // Temporary ID for local management
    };
    setLocalShifts((prevShifts) => [...prevShifts, newShift]);
    setAddShiftOpen(false);
  };

  const handleDeleteLocalShift = (shiftId) => {
    setLocalShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== shiftId));
  };

  const handleSaveAllShifts = () => {
    localShifts.forEach((shift) => {
      if (shift.isNotAvailable) {
        handleMarkNotAvailable(null, shift.date, shift.employeeId, shift.shiftId);
      } else {
        handleSaveNewShift(shift);
      }
    });
    onClose();
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

  const handleLocalMarkNotAvailable = (date, employeeId, shiftId) => {
    const newNAShift = {
      id: `temp-${Date.now()}`,
      date,
      employeeId,
      shiftId,
      isNotAvailable: true,
    };
    setLocalShifts((prevShifts) => [...prevShifts, newNAShift]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
        <Stack direction="column">
          <Typography variant="h5" className="text-white">
            Employees Without Shifts
          </Typography>
          <Typography variant="subtitle1" className="text-white">
            {`${dayjs(shiftDays[0].date).format('MMMM D')} - ${dayjs(
              shiftDays[shiftDays.length - 1].date,
            ).format('MMMM D, YYYY')}`}
          </Typography>
        </Stack>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container sx={{ scrollbarWidth: 'thin' }} flexWrap="nowrap" className="relative">
          {/* Employee names column */}
          <Grid item className="border-r min-w-auto sticky left-0 bg-white">
            <div className="px-2 pt-[2.45rem] border-b text-gray-500 flex items-end justify-end">
              <Typography fontSize={12} className="text-blue w-fit text-gray-500 text-end">
                Employees
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
                      <Box className="flex justify-between items-center">
                        <Typography
                          sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                          {employee.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '11px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            ml: 2,
                          }}
                          className="text-gray-400 px-2"
                        >
                          {formatCurrency(employee.baseRatePerHour)}/hr
                        </Typography>
                      </Box>
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
            flexWrap="nowrap"
            sx={{ scrollbarWidth: 'thin', overflowX: 'scroll', overflowY: 'hidden' }}
          >
            {shiftDays.map((shiftData, index) => {
              const filteredShifts = getFilteredShiftsForDate(shiftData.date);

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
                    className={`px-2 py-1 ${
                      index < shiftDays.length - 1 ? 'border-r' : ''
                    } border-b`}
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
                                  {localShifts.find(
                                    (s) =>
                                      s.employeeId === employee.id &&
                                      s.shiftId === shift.id &&
                                      dayjs(s.date).isSame(shiftData.date, 'day'),
                                  ) ? (
                                    <LocalShiftSlot
                                      shift={localShifts.find(
                                        (s) =>
                                          s.employeeId === employee.id &&
                                          s.shiftId === shift.id &&
                                          dayjs(s.date).isSame(shiftData.date, 'day'),
                                      )}
                                      onDelete={handleDeleteLocalShift}
                                    />
                                  ) : (
                                    <EmptySlot
                                      date={shiftData.date}
                                      staffId={employee.id}
                                      shiftId={shift.id}
                                      onClick={handleDoubleClick}
                                      onMarkNA={() =>
                                        handleLocalMarkNotAvailable(
                                          shiftData.date,
                                          employee.id,
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
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveAllShifts} color="primary" variant="contained">
          Save All Shifts
        </Button>
      </DialogActions>
      {addShiftOpen && (
        <AddShiftDialog
          open={addShiftOpen}
          handleClose={handleAddShiftClose}
          shiftDetails={newShiftDetails}
          handleChange={handleAddShiftChange}
          onSave={handleSaveNewLocalShift}
          shifts={shifts}
          formatCurrency={formatCurrency}
        />
      )}
    </Dialog>
  );
};

export default EmployeesWithoutShiftsDialog;
