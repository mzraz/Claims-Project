import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, TextField, InputAdornment, Stack } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import AddIcon from '@mui/icons-material/Add';

import LeaveEntitlementTable from './LeaveEntitlementTable';
import LeaveEntitlementModal from './LeaveEntitlementModal';

import {
  saveLeaveData,
  getAllLeavesByCompanyId,
  deleteById,
} from '../../../../store/leave/LeaveSlice';
import { getAllActiveEmployeesData } from '../../../../store/hr/EmployeeSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';

const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;

export default function LeaveEntitlementManager() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.leaveReducer);
  const { user } = useSelector((state) => state.loginReducer);

  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const [selectedEntitlement, setSelectedEntitlement] = useState(null);
  const [entitlementsUpdated, setEntitlementsUpdated] = useState(0);
  const [entitlements, setEntitlements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const BCrumb = [
    {
      to: '/leave',
      title: 'Leave Management',
    },
    {
      title: 'Leave Entitlement Manager',
    },
  ];

  useEffect(() => {
    fetchEntitlements();
    fetchEmployees();
  }, [entitlementsUpdated]);

  const fetchEntitlements = () => {
    const formData = new FormData();
    formData.append('companyId', user.firmId);
    dispatch(getAllLeavesByCompanyId(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setEntitlements(result.payload.DATA);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to fetch entitlements.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while fetching entitlements.',
        });
      })
      .finally((a) => {
        setIsLoading(false);
      });
  };

  const fetchEmployees = () => {
    const formData = new FormData();
    formData.append('companyId', user.firmId);
    dispatch(getAllActiveEmployeesData(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const employeesWithImages = result.payload.DATA.map((employee) => ({
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
      });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleAddNewEntitlement = () => {
    setSelectedEntitlement(null);
    setOpenModal(true);
  };

  const handleEditEntitlement = (entitlement) => {
    setSelectedEntitlement(entitlement);
    setOpenModal(true);
  };

  const handleDeleteEntitlement = (entitlementId) => {
    const formData = new FormData();
    formData.append('companyLeaveId', entitlementId);

    dispatch(deleteById(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Entitlement deleted successfully.',
          });
          setEntitlementsUpdated((prev) => prev + 1);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to delete entitlement.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while deleting the entitlement.',
        });
      });
  };

  const handleSaveEntitlement = (entitlementData, assignedEmployees) => {
    const formData = new FormData();
    formData.append('companyId', firmId);
    formData.append('companyLeaveId', entitlementData.companyLeaveId || 0);
    formData.append('name', entitlementData.name);
    formData.append('description', entitlementData.description || '');
    formData.append('medical', entitlementData.medical);
    formData.append('casual', entitlementData.casual);
    formData.append('annual', entitlementData.annual);
    formData.append('employeIds', assignedEmployees);

    dispatch(saveLeaveData(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: result.payload.MESSAGE || 'Entitlement saved successfully.',
          });
          setEntitlementsUpdated((prev) => prev + 1);
          setOpenModal(false);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to save entitlement.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while saving the entitlement.',
        });
      });
  };

  return (
    <>
      {/* <CustomBackdrop loading={loading} /> */}
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <Breadcrumb title="Leave Management" items={BCrumb} />
      <Box sx={{ pt: 0 }}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            Leave Entitlements
          </Typography>
          <Stack direction={'row'} spacing={2}>
            <TextField
              onChange={handleSearch}
              value={search}
              color="primary"
              sx={{
                width: '250px',
                '& .MuiInputBase-root': {
                  border: 'none !important',
                },
                '& .MuiOutlinedInput-input': {
                  pl: 0,
                },
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch color={`${search ? 'primary.main' : 'gray'}`} size="1.1rem" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search entitlements"
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewEntitlement}
              startIcon={<AddIcon />}
            >
              Add New Entitlement
            </Button>
          </Stack>
        </Stack>

        <LeaveEntitlementTable
          entitlements={entitlements}
          handleEditEntitlement={handleEditEntitlement}
          handleDeleteEntitlement={handleDeleteEntitlement}
          search={search}
          loading={isLoading}
        />

        {openModal && (
          <LeaveEntitlementModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
            initialData={selectedEntitlement}
            employees={employees}
            onSave={handleSaveEntitlement}
          />
        )}
      </Box>
    </>
  );
}
