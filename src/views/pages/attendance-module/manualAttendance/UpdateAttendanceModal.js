import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Box, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { updateEmployeeAttendance } from '../../../../store/attendance/AttendanceSlice';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const UpdateAttendanceModal = ({ open, handleClose, attendanceData, setAlert, companyId, setChanges, }) => {
    const dispatch = useDispatch();
    const [date, setDate] = useState(dayjs());
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');

    console.log(attendanceData)
    useEffect(() => {
        if (attendanceData) {
            let parsedDate;
            if (attendanceData.date?.includes('/')) {
                // Format: "DD/MM/YYYY"
                parsedDate = dayjs(attendanceData.date, 'DD/MM/YYYY', true);
            } else {
                // For other formats, let dayjs handle it automatically
                parsedDate = dayjs(attendanceData.date);
            }
            setDate(parsedDate.isValid() ? parsedDate : dayjs());

            // Handle start time
            const checkInTime = attendanceData.checkIn || attendanceData.checkInTime;
            setStartTime(checkInTime ? dayjs(checkInTime, 'hh:mm A') : null);

            // Handle end time
            const checkOutTime = attendanceData.checkOut || attendanceData.checkOutTime;
            setEndTime(checkOutTime ? dayjs(checkOutTime, 'hh:mm A') : null);

            // Handle employee ID
            setEmployeeId(attendanceData.employeeId || attendanceData.id);

            // Handle employee name
            setEmployeeName(attendanceData.employeeName || '');
        }
    }, [attendanceData]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('companyId', companyId);
        formData.append('employeeId', employeeId);
        formData.append('date', date.format('YYYY-MM-DD'));
        formData.append('startTime', startTime ? startTime.format('HH:mm') : '');
        formData.append('endTime', endTime ? endTime.format('HH:mm') : '');
        formData.append('attendenceId', attendanceData.attendanceId || attendanceData.attendenceId);

        dispatch(updateEmployeeAttendance(formData))
            .then(result => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Attendance updated successfully'
                    });
                    setChanges(prev => prev + 1);
                    handleClose();
                } else {
                    throw new Error(result);
                }
            })
            .catch(err => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong updating attendance.'
                });
            });
    };
    const disabled = !date || !startTime || !endTime;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
                <Stack direction='column'>
                    <Typography variant='h5' className='text-white'>
                        Edit {employeeName}'s Attendance
                    </Typography>
                    <Typography variant='subtitle1' className='text-white'>
                        {date.isValid() ? `${date.format('dddd')}, ${date.format('DD MMM YYYY')}` : 'Invalid Date'}
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TimePicker
                            label="Start Time"
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <TimePicker
                            label="End Time"
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Stack>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
                <Box sx={{ ml: 'auto' }}>
                    <Button
                        variant='outlined'
                        onClick={handleClose}
                        sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={disabled}
                        variant='contained'
                        sx={{ bgcolor: disabled ? '#d8dbdd !important' : undefined }}
                        onClick={handleSubmit}
                    >
                        Update
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateAttendanceModal;