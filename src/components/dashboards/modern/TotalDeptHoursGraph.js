import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Box, CircularProgress } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import { useSelector } from 'react-redux';
import {
  TimelineRounded as TimelineIcon,
} from '@mui/icons-material';

const YearlyBreakup = () => {
  const theme = useTheme();
  const { departmentData, totalHours, averageHoursPerDepartment, loading } = useSelector((state) => state.dashboardReducer);

  const optionsChart = {
    chart: {
      type: 'treemap',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (text, op) {
        return [text, op.value + ' hrs']
      },
      style: {
        fontSize: '12px',
      }
    },
    legend: {
      show: false
    }
  };

  const seriesChart = [{
    data: departmentData.map(dept => ({
      x: dept.description,
      y: parseFloat(dept.hoursWorked.toFixed(2))
    }))
  }];
  const hasHoursData = departmentData.length > 0 && totalHours > 0;

  return (
    <DashboardCard title="Hours Worked by Department" subtitle="Hourly Breakdown">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={350}>
              <CircularProgress />
            </Box>
          ) : hasHoursData ? (
            <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
              <Chart
                options={optionsChart}
                series={seriesChart}
                type="treemap"
                height="350"
                width="100%"
              />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10} color={'GrayText'}>
              <TimelineIcon style={{ fontSize: 60, marginBottom: 16 }} />
              <Typography variant="body1" align="center">
                No hours data available for the selected period.
              </Typography>
            </Box>
          )}
        </Grid>
        {hasHoursData && !loading && (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Typography variant="subtitle2" color="textSecondary">
                Total Hours: {totalHours.toFixed(2)}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Avg. per Dept: {averageHoursPerDepartment.toFixed(2)}
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;