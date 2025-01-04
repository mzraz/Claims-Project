import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Box,
  Avatar,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Tooltip,
  IconButton,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import InfoIcon from '@mui/icons-material/Info';
import { getPendingLeaveQuotaByCompanyId } from '../../../../store/leave/LeaveSlice';
import { motion } from 'framer-motion';

const leaveTypes = [
  { id: 1, label: 'Full Day' },
  { id: 2, label: 'Half Day' },
  { id: 3, label: 'Short Leave' },
];

const leaveQuotaTypes = [
  { id: 1, label: 'Medical' },
  { id: 2, label: 'Casual' },
  { id: 3, label: 'Annual' },
];

const LeaveDialog = ({
  open,
  handleClose,
  onSave,
  onDelete,
  initialData,
  employees,
  slotInfo,
  firmId,
  checkOverlappingLeaves,
}) => {
  const dispatch = useDispatch();
  const [selectedEmployee, setSelectedEmployee] = useState(initialData?.employee || null);
  const [leaveType, setLeaveType] = useState(
    initialData?.leaveType ? initialData?.leaveTypeLabel : '',
  );
  const [leaveQuota, setLeaveQuota] = useState(
    initialData?.leaveQuota
      ? leaveQuotaTypes.find((quota) => quota.id === initialData?.leaveQuota)?.label
      : '',
  );
  const [start, setStart] = useState(initialData?.start ? dayjs(initialData.start) : dayjs());
  const [end, setEnd] = useState(initialData?.end ? dayjs(initialData.end) : dayjs());
  const [remarks, setRemarks] = useState(initialData?.remarks || '');
  const [color, setColor] = useState(initialData?.color || 'default');
  const [leaveDuration, setLeaveDuration] = useState(0);
  const [leaveQuotas, setLeaveQuotas] = useState([]);
  const [isLoadingQuotas, setIsLoadingQuotas] = useState(false);
  const [balanceError, setBalanceError] = useState('');
  const [originalQuota, setOriginalQuota] = useState(
    initialData?.leaveQuota
      ? leaveQuotaTypes.find((quota) => quota.id === initialData?.leaveQuota)?.label
      : '',
  );
  const [originalLeaveDuration, setOriginalLeaveDuration] = useState(0);
  const [overlapWarning, setOverlapWarning] = useState('');
  const [isPaidLeave, setIsPaidLeave] = useState(initialData?.isPaidLeave ?? true);

  const calculateLeaveDuration = (start, end, leaveType) => {
    const daysDiff = end.diff(start, 'day') + 1;
    const multipliers = { 'Full Day': 1, 'Half Day': 0.5, 'Short Leave': 0.25 };
    return daysDiff * multipliers[leaveType];
  };

  const calculateLeaveChanges = () => {
    if (!selectedEmployee || !leaveQuota || leaveQuotas.length === 0) {
      return { deducted: {}, balance: {}, availableBalance: 0 };
    }

    const quota = leaveQuotas[0];
    const leaveTypes = ['medical', 'casual', 'annual'];
    const initialBalance = leaveTypes.reduce((acc, type) => {
      acc[type] = quota[`${type}RemainingTotal`];
      return acc;
    }, {});

    const deducted = {
      [leaveQuota.toLowerCase()]: -leaveDuration,
    };

    if (initialData) {
      const originalQuotaLower = originalQuota.toLowerCase();
      if (originalQuotaLower === leaveQuota.toLowerCase()) {
        deducted[originalQuotaLower] += originalLeaveDuration;
      } else {
        deducted[originalQuotaLower] = originalLeaveDuration;
      }
    }

    const balance = leaveTypes.reduce((acc, type) => {
      acc[type] = initialBalance[type] + (deducted[type] || 0);
      return acc;
    }, {});

    let availableBalance = initialBalance[leaveQuota.toLowerCase()];
    if (initialData && originalQuota.toLowerCase() === leaveQuota.toLowerCase()) {
      availableBalance += originalLeaveDuration;
    }

    return { deducted, balance, availableBalance };
  };

  useEffect(() => {
    const { availableBalance } = calculateLeaveChanges();

    if (
      leaveDuration > availableBalance &&
      !isLoadingQuotas &&
      leaveQuota &&
      leaveType &&
      isPaidLeave
    ) {
      setBalanceError(
        `Insufficient ${leaveQuota} leave balance. Available: ${availableBalance} days`,
      );
    } else {
      setBalanceError('');
    }
  }, [
    selectedEmployee,
    leaveQuota,
    leaveDuration,
    leaveQuotas,
    originalLeaveDuration,
    originalQuota,
    isPaidLeave,
  ]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setSelectedEmployee(initialData.employee);
        setLeaveType(initialData.leaveTypeLabel);
        setLeaveQuota(leaveQuotaTypes.find((quota) => quota.id === initialData?.leaveQuota)?.label);
        setOriginalQuota(
          leaveQuotaTypes.find((quota) => quota.id === initialData?.leaveQuota)?.label,
        );
        setStart(dayjs(initialData.start));
        setEnd(dayjs(initialData.end));
        setRemarks(initialData.remarks);
        setColor(initialData.color);
        setIsPaidLeave(initialData.isPaidLeave ?? true);
        fetchLeaveQuotas(initialData.employee.id);
        setOriginalLeaveDuration(
          calculateLeaveDuration(
            dayjs(initialData.start),
            dayjs(initialData.end),
            initialData.leaveTypeLabel,
          ),
        );
      } else if (slotInfo) {
        setStart(dayjs(slotInfo.start));
        setEnd(dayjs(slotInfo.end).subtract(1, 'day'));
      } else {
        resetForm();
      }
    } else {
      setTimeout(() => {
        resetForm();
      }, 200);
    }
  }, [open, initialData, slotInfo]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchLeaveQuotas(selectedEmployee.id);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (start && end && leaveType) {
      setLeaveDuration(calculateLeaveDuration(start, end, leaveType));
    }
  }, [start, end, leaveType]);

  useEffect(() => {
    if (selectedEmployee && start && end) {
      const isOverlapping = checkOverlappingLeaves(selectedEmployee.id, start, end);
      if (isOverlapping) {
        setOverlapWarning('Warning: This employee already has a leave during the selected period.');
      } else {
        setOverlapWarning('');
      }
    }
  }, [selectedEmployee, start, end, checkOverlappingLeaves]);

  const fetchLeaveQuotas = (employeeId) => {
    setIsLoadingQuotas(true);
    const formData = new FormData();
    formData.append('companyId', firmId);
    formData.append('employeeId', employeeId);
    dispatch(getPendingLeaveQuotaByCompanyId(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setLeaveQuotas(result.payload.DATA);
        } else {
          console.error('Failed to fetch leave quotas:', result.payload.MESSAGE);
        }
      })
      .catch((err) => {
        console.error('An error occurred while fetching leave quotas:', err);
      })
      .finally(() => {
        setIsLoadingQuotas(false);
      });
  };

  const grayLabelSx = {
    '& .MuiInputLabel-root:not(.Mui-focused)': {
      color: 'gray',
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (balanceError || overlapWarning) {
      return;
    }
    const leaveData = {
      employee: selectedEmployee,
      leaveTypeId: leaveTypes.find((type) => type.label === leaveType)?.id,
      leaveQuotaId: isPaidLeave
        ? leaveQuotaTypes.find((quota) => quota.label === leaveQuota)?.id
        : null,
      start: start.toDate(),
      end: end.toDate(),
      remarks,
      color,
      isUnpaid: isPaidLeave ? 0 : 1,
    };
    onSave(leaveData);
    handleClose();
  };

  const isFormValid = () => {
    return (
      selectedEmployee &&
      leaveType &&
      (!isPaidLeave || leaveQuota) &&
      start &&
      end &&
      color &&
      !balanceError &&
      !overlapWarning
    );
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setLeaveType('');
    setLeaveQuota('');
    setOriginalQuota('');
    setStart(dayjs());
    setEnd(dayjs());
    setRemarks('');
    setColor('default');
    setLeaveQuotas([]);
    setIsPaidLeave(true);
  };

  const handleLeaveTypeChange = (event) => {
    setIsPaidLeave(event.target.value === 'paid');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Stack direction="column">
            <Typography variant="h5" className="text-white">
              {initialData
                ? `${isPaidLeave ? 'Paid' : 'Unpaid'} Leave Details`
                : `New ${isPaidLeave ? 'Paid' : 'Unpaid'} Leave`}
            </Typography>
            <Typography variant="subtitle1" className="text-white">
              {`${start.format('DD MMM YYYY')} - ${end.format('DD MMM YYYY')}`}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mb: 2 }}>
          {balanceError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {balanceError}
            </Alert>
          )}
          {overlapWarning && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {overlapWarning}
            </Alert>
          )}

          <Box pt={2} pb={2}>
            <Stack direction="row" spacing={2} alignItems="stretch">
              <Autocomplete
                disabled={initialData?.employee}
                options={employees}
                value={selectedEmployee}
                getOptionLabel={(option) => option.fullName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar src={option.imageUrl} sx={{ width: '35px', height: '35px', mr: 2 }} />
                    <Box>
                      <Typography>{option.fullName}</Typography>
                      <Typography fontSize={10}>{option.employeeNo}</Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Select Employee" sx={grayLabelSx} />
                )}
                onChange={(event, newValue) => {
                  setSelectedEmployee(newValue);
                }}
                sx={{ flexGrow: 1 }}
                size="medium"
              />
              {!initialData && (
                <FormControl sx={{ ...grayLabelSx, minWidth: 120 }}>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={isPaidLeave ? 'paid' : 'unpaid'}
                    label="Leave Type"
                    onChange={(e) => setIsPaidLeave(e.target.value === 'paid')}
                    size="medium"
                    sx={{
                      height: '100%',
                      '& .MuiInputBase-input': {
                        paddingTop: '16.5px',
                        paddingBottom: '16.5px',
                      },
                    }}
                  >
                    <MenuItem value="paid">Paid Leave</MenuItem>
                    <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>
          </Box>
          <Stack direction="column" gap={2}>
            {selectedEmployee && isPaidLeave && (
              <motion.div>
                {isLoadingQuotas ? (
                  <QuotaTableSkeleton />
                ) : (
                  leaveQuotas.length > 0 && (
                    <TableContainer
                      component={Paper}
                      sx={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}
                      elevation={0}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Leave Type</TableCell>
                            <TableCell align="center">Total Leaves</TableCell>
                            <TableCell align="center">Leaves Left</TableCell>
                            <TableCell align="center">Change</TableCell>
                            <TableCell align="center">New Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {['Medical', 'Casual', 'Annual'].map((type) => {
                            const lowerType = type.toLowerCase();
                            const { deducted, balance } = calculateLeaveChanges();
                            const quota = leaveQuotas[0];
                            const totalEntitlement = quota[`${lowerType}Total`];
                            const currentBalance = quota[`${lowerType}RemainingTotal`];
                            const change = deducted[lowerType] || 0;

                            return (
                              <TableRow key={type} selected={leaveQuota === type}>
                                <TableCell>{type}</TableCell>
                                <TableCell align="center">{totalEntitlement}</TableCell>
                                <TableCell align="center">{currentBalance}</TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    color:
                                      change > 0
                                        ? 'success.main'
                                        : change < 0
                                        ? 'error.main'
                                        : 'inherit',
                                  }}
                                >
                                  {change !== 0 ? (change > 0 ? `+${change}` : change) : '-'}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: leaveQuota === type ? 'bold' : 'normal' }}
                                >
                                  {balance[lowerType]}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )
                )}
              </motion.div>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={2}>
                <DesktopDatePicker
                  label="Start Date"
                  value={start}
                  maxDate={end}
                  onChange={(newValue) => setStart(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth sx={grayLabelSx} />}
                />
                <DesktopDatePicker
                  label="End Date"
                  minDate={start}
                  value={end}
                  onChange={(newValue) => setEnd(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth sx={grayLabelSx} />}
                />
              </Stack>
            </LocalizationProvider>

            {selectedEmployee && (
              <Stack direction={'row'} spacing={2} sx={grayLabelSx}>
                <FormControl fullWidth sx={grayLabelSx}>
                  <InputLabel>Leave Duration</InputLabel>
                  <Select
                    value={leaveType}
                    label="Leave Duration"
                    onChange={(e) => setLeaveType(e.target.value)}
                    startAdornment={
                      <Tooltip title={leaveTypeTooltip} placement="top-end">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <MenuItem value="" disabled>
                      Select Leave Duration
                    </MenuItem>
                    <MenuItem value="Full Day">Full Day</MenuItem>
                    <MenuItem value="Half Day">Half Day</MenuItem>
                    <MenuItem value="Short Leave">Short Leave</MenuItem>
                  </Select>
                </FormControl>

                {isPaidLeave && (
                  <FormControl fullWidth sx={grayLabelSx}>
                    <InputLabel>Leave Quota</InputLabel>
                    <Select
                      value={leaveQuota}
                      label="Leave Quota"
                      onChange={(e) => setLeaveQuota(e.target.value)}
                    >
                      <MenuItem value="Medical">Medical</MenuItem>
                      <MenuItem value="Casual">Casual</MenuItem>
                      <MenuItem value="Annual">Annual</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Stack>
            )}

            {selectedEmployee && (
              <TextField
                id="Remarks"
                placeholder="Enter Remarks"
                variant="outlined"
                fullWidth
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={grayLabelSx}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
          >
            Cancel
          </Button>

          <Box className="flex items-center gap-2">
            {initialData && (
              <Button
                variant="outlined"
                color="error"
                sx={{ backgroundColor: '#fff !important' }}
                onClick={() => onDelete(initialData.id)}
              >
                Delete
              </Button>
            )}
            <Button type="submit" disabled={!isFormValid()} variant="contained">
              {initialData ? 'Update Leave' : 'Add Leave'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeaveDialog;

const QuotaTableSkeleton = () => (
  <TableContainer
    component={Paper}
    sx={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}
    elevation={0}
  >
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Leave Type</TableCell>
          <TableCell align="center">Total Leaves</TableCell>
          <TableCell align="center">Leaves Left</TableCell>
          <TableCell align="center">Change</TableCell>
          <TableCell align="center">New Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {['Medical', 'Casual', 'Annual'].map((type) => (
          <TableRow key={type}>
            <TableCell>{type}</TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const leaveTypeTooltip = (
  <>
    <Typography variant="body2">Leave type calculations:</Typography>
    <ul>
      <li>Full Day: 1 day</li>
      <li>Half Day: 0.5 day</li>
      <li>Short Leave: 0.25 day</li>
    </ul>
    <Typography variant="caption">
      Note: For multiple days, the value is multiplied by the number of days selected.
    </Typography>
  </>
);
