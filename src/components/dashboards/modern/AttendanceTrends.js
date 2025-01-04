import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import {
  MenuItem,
  Grid,
  Stack,
  Typography,
  Button,
  Avatar,
  Box,
  CircularProgress,
} from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import { useSelector } from 'react-redux';
import { BarChart as BarChartIcon } from '@mui/icons-material';

const AttendanceTrends = () => {
  const [month, setMonth] = React.useState('1');
  const { attendanceData, loading } = useSelector((state) => state.dashboardReducer);

  const hasAttendanceData =
    attendanceData.currentMonth &&
    attendanceData.previousMonth &&
    (Object.values(attendanceData.currentMonth).some((val) => val > 0) ||
      Object.values(attendanceData.previousMonth).some((val) => val > 0));

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const primarylight = '#2bae59';

  const formatData = (data) => {
    return [data?.present, data?.lateIn, data?.earlyIn, data?.earlyOut, data?.lateOut];
  };

  const seriescolumnchart = [
    {
      name: 'This Period',
      data: formatData(attendanceData.currentMonth),
    },
    {
      name: 'Last Period',
      data: formatData(attendanceData.previousMonth),
    },
  ];

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Present', 'Early In', 'Early Out', 'Late In', 'Late Out'],
    },
    // yaxis: {
    //   title: {
    //     text: 'Number of Employees'
    //   }
    // },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    legend: {
      show: true,
    },
  };

  return (
    <DashboardCard title="Attendance trends" subtitle="Overview of Attendance statuses">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={350}>
              <CircularProgress />
            </Box>
          ) : hasAttendanceData ? (
            <Box className="">
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="350px"
              />
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={10}
              color={'GrayText'}
            >
              <BarChartIcon style={{ fontSize: 60, marginBottom: 16 }} />
              <Typography variant="body1" align="center">
                No attendance data available for the selected period.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default AttendanceTrends;
