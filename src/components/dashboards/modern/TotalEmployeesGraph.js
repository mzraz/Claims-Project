import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, CircularProgress } from '@mui/material';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import { useSelector } from 'react-redux';
import { Box } from '@mui/system';
import GroupIcon from '@mui/icons-material/Group';

const Customers = () => {
  const { employeeData, loading } = useSelector((state) => state.dashboardReducer);
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const errorlight = theme.palette.error.light;
  const successlight = theme.palette.success.light;

  const chartData = employeeData.dailyChanges.length > 1
    ? employeeData.dailyChanges.map(change => change.change)
    : [0, ...employeeData.dailyChanges.map(change => change.change)];

  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 80,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        show: false,
      },
    },
  };
  const seriescolumnchart = [
    {
      name: 'Employees',
      color: secondary,
      data: chartData,
    },
  ];

  const totalEmployees = employeeData.totalEmployees;
  const employeesAdded = employeeData.employeesAdded;
  const employeesLeft = employeeData.employeesLeft;
  const netChange = employeesAdded - employeesLeft;
  const netChangePercentage = ((netChange / totalEmployees) * 100).toFixed(2);
  const hasEmployeeData = employeeData.totalEmployees > 0 || employeeData.employeesAdded > 0 || employeeData.employeesLeft > 0;

  return (
    <DashboardCard
      footer={
        hasEmployeeData && !loading && (
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="area"
            height="80px"
          />
        )
      }
    >
      <>
        <Typography variant="subtitle2" color="textSecondary">
          Total Employees
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={100}>
            <CircularProgress />
          </Box>
        ) : hasEmployeeData ? (
          <>
            <Typography variant="h4">{totalEmployees}</Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: netChange > 0 ? successlight : errorlight, width: 24, height: 24 }}>
                {netChange > 0 ? (
                  <IconArrowUpRight width={18} color="#69F0AE" />
                ) : (
                  <IconArrowDownRight width={18} color="#FA896B" />
                )}
              </Avatar>
              <Typography variant="subtitle2" className='flex items-center gap-3' fontWeight="600">
                {netChange > 0 ? '+' : ''}
                {netChangePercentage}%
                <Typography variant="body2" color="textSecondary">
                  {employeesAdded} added, {employeesLeft} left this month
                </Typography>
              </Typography>
            </Stack>
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={2} color='GrayText'>
            <GroupIcon style={{ fontSize: 60, marginBottom: 16 }} />
            <Typography variant="body1" align="center">
              No employee data available for the selected period.
            </Typography>
          </Box>
        )}
      </>
    </DashboardCard>
  );
};

export default Customers;