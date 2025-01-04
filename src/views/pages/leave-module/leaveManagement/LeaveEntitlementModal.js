import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Grid,
  Avatar,
  InputAdornment,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import { IconSearch } from '@tabler/icons';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion, AnimatePresence } from 'framer-motion';
import InfoIcon from '@mui/icons-material/Info';

const LeaveEntitlementModal = ({ open, handleClose, initialData, employees, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [entitlement, setEntitlement] = useState(
    initialData || {
      name: '',
      description: '',
      medical: '',
      casual: '',
      annual: '',
    },
  );
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [availableSearch, setAvailableSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  const [initiallyAssignedEmployees, setInitiallyAssignedEmployees] = useState([]);

  useEffect(() => {
    if (initialData) {
      setEntitlement(initialData);
      const initialAssigned = initialData.employeeList?.map((emp) => emp.id) || [];
      setAssignedEmployees(initialAssigned);
      setInitiallyAssignedEmployees(initialAssigned);
    } else {
      setEntitlement({
        name: '',
        description: '',
        medical: '',
        casual: '',
        annual: '',
      });
      setAssignedEmployees([]);
      setInitiallyAssignedEmployees([]);
    }
    setActiveStep(0);
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntitlement((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeToggle = (employeeId) => {
    setAssignedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    );
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = () => {
    onSave(entitlement, assignedEmployees);
    handleClose();
  };

  const filteredAvailable = employees.filter(
    (employee) =>
      !assignedEmployees.includes(employee.id) &&
      (employee.fullName.toLowerCase().includes(availableSearch.toLowerCase()) ||
        employee.employeeNo.toString().includes(availableSearch)) &&
      (initialData
        ? employee.companyLeaveId === 0 || initiallyAssignedEmployees.includes(employee.id)
        : employee.companyLeaveId === 0),
  );

  const filteredAssigned = employees.filter(
    (employee) =>
      assignedEmployees.includes(employee.id) &&
      (employee.fullName.toLowerCase().includes(assignedSearch.toLowerCase()) ||
        employee.employeeNo.toString().includes(assignedSearch)),
  );

  const handleAssignAll = () => {
    setAssignedEmployees(
      employees
        .filter((emp) => emp.companyLeaveId === 0 || initiallyAssignedEmployees.includes(emp.id))
        .map((emp) => emp.id),
    );
  };

  const handleUnassignAll = () => {
    setAssignedEmployees([]);
  };

  const isEntitlementValid =
    entitlement.name.trim() !== '' &&
    entitlement.medical !== null &&
    entitlement.medical !== undefined &&
    entitlement.medical !== '' &&
    entitlement.casual !== null &&
    entitlement.casual !== undefined &&
    entitlement.casual !== '' &&
    entitlement.annual !== null &&
    entitlement.annual !== undefined &&
    entitlement.annual !== '';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
        <Typography variant="h4" className="text-white">
          {initialData ? 'Edit Leave Entitlement' : 'New Leave Entitlement'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ my: 2, pb: 0 }}>
        {activeStep === 0 ? (
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Name:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="name"
                value={entitlement.name}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., Standard Employee, Manager, Executive"
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Description:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="description"
                value={entitlement.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Enter description"
              />
            </Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Leave Allocations
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Medical Leaves:
                </Typography>
                <TextField
                  fullWidth
                  name="medical"
                  value={entitlement.medical}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                  size="small"
a                  InputProps={{
                    endAdornment: <Typography variant="body2">days</Typography>,
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Casual Leaves:
                </Typography>
                <TextField
                  fullWidth
                  name="casual"
                  value={entitlement.casual}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2">days</Typography>,
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Annual Leaves:
                </Typography>
                <TextField
                  fullWidth
                  name="annual"
                  value={entitlement.annual}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2">days</Typography>,
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        ) : (
          <Box>
            <Stack direction={'row'} spacing={5} sx={{ overflow: 'hidden' }}>
              <Box sx={{ width: '100%' }}>
                <Box
                  direction={'row'}
                  justifyContent={'space-end'}
                  mb={1}
                  className="pb-1 grid grid-cols-2"
                >
                  <Box className="col-span-1 flex items-center">
                    <Typography sx={{ fontWeight: 'bold' }}>Available Employees</Typography>
                    <Tooltip title="Only employees not assigned to any leave entitlement are shown here.">
                      <IconButton size="small">
                        <InfoIcon size="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography
                    sx={{ fontWeight: 'bold', pl: 1 }}
                    className="col-span-1 self-center mt-1"
                  >
                    {filteredAssigned.length} employee(s) in entitlement
                  </Typography>
                </Box>
                <Stack direction={'row'} spacing={2} mb={1}>
                  <TextField
                    color="primary"
                    sx={{
                      width: '100%',
                      marginBottom: '1rem',
                      '& .MuiInputBase-root': {
                        border: 'none !important',
                        height: '30px',
                      },
                      '& .MuiOutlinedInput-input': {
                        pl: 0,
                      },
                    }}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconSearch
                            color={`${availableSearch ? 'primary.main' : 'gray'}`}
                            size="1.1rem"
                          />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="name, employee number"
                    size="small"
                    value={availableSearch}
                    onChange={(e) => setAvailableSearch(e.target.value)}
                  />
                  <TextField
                    color="primary"
                    sx={{
                      width: '100%',
                      marginBottom: '1rem',
                      '& .MuiInputBase-root': {
                        border: 'none !important',
                        height: '30px',
                      },
                      '& .MuiOutlinedInput-input': {
                        pl: 0,
                      },
                    }}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconSearch
                            color={`${assignedSearch ? 'primary.main' : 'gray'}`}
                            size="1.1rem"
                          />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="name, employee number"
                    size="small"
                    value={assignedSearch}
                    onChange={(e) => setAssignedSearch(e.target.value)}
                  />
                </Stack>

                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  spacing={2}
                  sx={{ height: '23rem', overflow: 'hidden' }}
                  fullWidth
                >
                  <Stack
                    sx={{
                      width: '100%',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      scrollbarWidth: 'thin',
                    }}
                    className=""
                  >
                    <AnimatePresence mode="wait">
                      {filteredAvailable.length > 0 ? (
                        <motion.div key={'available'}>
                          <AnimatePresence>
                            {filteredAvailable.map((employee) => (
                              <motion.div
                                key={employee.id}
                                layout
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Grid
                                  item
                                  xs={1}
                                  className={`border-b w-full cursor-pointer hover:bg-zinc-100`}
                                  onClick={() => handleEmployeeToggle(employee.id)}
                                >
                                  <Box
                                    sx={{ height: '50px' }}
                                    className="p-2 flex flex-row justify-start space-x-2 align-top"
                                  >
                                    <Avatar src={employee.imageUrl} className="w-8 h-8" />
                                    <Stack sx={{ width: '100%' }}>
                                      <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                                        {employee.fullName}
                                      </Typography>
                                      <Typography
                                        sx={{ fontSize: '11px', fontWeight: 600 }}
                                        className="text-overflow-ellipsis whitespace-nowrap"
                                      >
                                        {employee.employeeNo}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Grid>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      ) : (
                        <Typography
                          key={'no-available'}
                          sx={{ p: 2, textAlign: 'center', color: 'gray' }}
                        >
                          No available employees found for "{availableSearch}"
                        </Typography>
                      )}
                    </AnimatePresence>
                  </Stack>
                  <Stack
                    sx={{
                      width: '100%',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      scrollbarWidth: 'thin',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {filteredAssigned.length > 0 ? (
                        <motion.div key={'assigned'}>
                          <AnimatePresence>
                            {filteredAssigned.map((employee) => (
                              <motion.div
                                key={employee.id}
                                layout
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Grid
                                  item
                                  xs={1}
                                  sx={{
                                    bgcolor: (theme) => `${theme.palette.primary.main}20`,
                                  }}
                                  className={`border-b w-full cursor-pointer hover:opacity-70`}
                                  onClick={() => handleEmployeeToggle(employee.id)}
                                >
                                  <Box
                                    sx={{ height: '50px' }}
                                    className="p-2 flex flex-row justify-start space-x-2 align-top"
                                  >
                                    <Avatar src={employee.imageUrl} className="w-8 h-8" />
                                    <Stack sx={{ width: '100%' }}>
                                      <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                                        {employee.fullName}
                                      </Typography>
                                      <Typography
                                        sx={{ fontSize: '11px', fontWeight: 600 }}
                                        className="text-overflow-ellipsis whitespace-nowrap"
                                      >
                                        {employee.employeeNo}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Grid>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      ) : (
                        <Typography
                          key={'no-assigned'}
                          sx={{ p: 2, textAlign: 'center', color: 'gray' }}
                        >
                          No assigned employees found for "{assignedSearch}"
                        </Typography>
                      )}
                    </AnimatePresence>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? handleClose : handleBack}
          sx={{ color: 'primary.main', bgcolor: '#fff !important', borderColor: 'primary.main' }}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {activeStep === 0 ? (
          <Button
            variant="contained"
            sx={{ bgcolor: 'primary.main' }}
            onClick={handleNext}
            disabled={!isEntitlementValid}
          >
            Next
          </Button>
        ) : (
          <Button variant="contained" sx={{ bgcolor: 'primary.main' }} onClick={handleSave}>
            {initialData ? 'Update' : 'Add'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LeaveEntitlementModal;
