import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useDispatch } from 'react-redux';
import EmployeesList from './EmployeesList';
import { getAllEmployeesData, addNewEmployee } from '../../../../store/hr/EmployeeSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';

const EmployeeManagementTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const [changesCount, setChangesCount] = useState(0);

  const dispatch = useDispatch();
  const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;

  useEffect(() => {
    fetchEmployees();
  }, [changesCount]);

  const fetchEmployees = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('companyId', firmId);

    dispatch(getAllEmployeesData(formData))
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
            message: 'Could not fetch employees.',
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while fetching employees.',
        });
        setLoading(false);
      });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeStatus = (employeeId) => {
    const employee = employees.find((item) => item.id === employeeId);
    const updatedEmployees = employees.map((item) =>
      item.id === employeeId ? { ...item, isActive: item.isActive ? 0 : 1 } : item,
    );

    const transformedValues = {
      companyId: firmId,
      firstName: employee.firstName,
      lastName: employee.lastName || '',
      displayName: `${employee.firstName} ${employee.lastName || ''}`,
      nickName: employee.nickName || '',
      email: employee.email || '',
      contactNo: employee.contactNo || '',
      originOfPassportId: employee.originOfPassportId || '0',
      cnicNo: employee.cnicNo || '',
      bankAccount: employee.bankAccountNo || '',
      departmentId: employee.departmentId || 0,
      designationId: employee.designationId || 0,
      hourlyRate: employee.ratePerHour || '',
      userId: employee.userId || 0,
      isActive: employee.isActive ? 0 : 1,
    };

    let formdata = new FormData();
    for (const key in transformedValues) {
      formdata.append(key, transformedValues[key]);
    }

    dispatch(addNewEmployee(formdata))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setEmployees(updatedEmployees);
          setAlert({
            open: true,
            severity: 'success',
            message: 'Employee status has been updated',
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
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || "Couldn't edit employee. Please try again.",
        });
      });
  };

  const activeEmployees = employees.filter((employee) => employee.isActive === 1);
  const inactiveEmployees = employees.filter((employee) => employee.isActive === 0);

  const BCrumb = [
    {
      to: '/hr',
      title: 'HR',
    },
    {
      title: 'Employees Management',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />

      <Breadcrumb title="Employees Management" items={BCrumb} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="employee tabs">
          <Tab label="Active Employees" />
          <Tab label="Inactive Employees" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <EmployeesList
          setChangesCount={setChangesCount}
          data={activeEmployees}
          loading={loading}
          hideStatus={false}
          hideBreadCrumb={true}
          changeStatus={handleChangeStatus}
        />
      )}

      {tabValue === 1 && (
        <EmployeesList
          setChangesCount={setChangesCount}
          data={inactiveEmployees}
          loading={loading}
          hideStatus={false}
          hideBreadCrumb={true}
          changeStatus={handleChangeStatus}
        />
      )}
    </Box>
  );
};

export default EmployeeManagementTabs;
