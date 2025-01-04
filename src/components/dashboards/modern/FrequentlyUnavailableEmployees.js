import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, CircularProgress, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PieChartIcon from '@mui/icons-material/PieChart';
import DashboardWidgetCard from '../../shared/DashboardWidgetCard';
import { useSelector } from 'react-redux';

const FrequentlyUnavailableEmployeesChart = () => {
  const theme = useTheme();
  const { frequentlyUnavailableEmployees, loading } = useSelector((state) => state.dashboardReducer)
  const { series, categories, employeeData, totalUnavailableDays, mostUnavailableEmployee, maxUnavailableDays } = useMemo(() => {
    if (!frequentlyUnavailableEmployees || frequentlyUnavailableEmployees.length === 0) {
      return { series: [], categories: [], employeeData: [], totalUnavailableDays: 0, mostUnavailableEmployee: 'N/A' };
    }

    const sortedData = [...frequentlyUnavailableEmployees].sort((a, b) => b.unavailableCount - a.unavailableCount);
    const total = sortedData.reduce((sum, emp) => sum + emp.unavailableCount, 0);
    const maxDays = Math.max(...sortedData.map(emp => emp.unavailableCount));
    const mostUnavailable = sortedData[0];

    return {
      series: [{ data: sortedData.map(emp => emp.unavailableCount) }],
      categories: sortedData.map(emp => `${emp.fullName} (${emp.employeeNo})`),
      employeeData: sortedData,
      totalUnavailableDays: total,
      mostUnavailableEmployee: mostUnavailable
        ? `${mostUnavailable.fullName} (${mostUnavailable.unavailableCount} ${mostUnavailable.unavailableCount === 1 ? 'day' : 'days'})`
        : 'N/A',
      maxUnavailableDays: maxDays
    };
  }, [frequentlyUnavailableEmployees]);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F06292', '#AED581', '#7986CB', '#9575CD', '#4DB6AC'
  ];

  const options = {
    chart: {
      type: 'bar',
      fontFamily: theme.typography.fontFamily,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '30%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px',
          fontWeight: 500
        },
        formatter: function (value) {
          return Math.floor(value) + ' days';
        }
      },
      min: 0,
      max: maxUnavailableDays,
      tickAmount: maxUnavailableDays,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        },
      },

    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const employee = employeeData[dataPointIndex];
        return `<div class="custom-tooltip">
          <img src=${employee.image} alt="${employee.fullName}" style="width:50px;height:50px;border-radius:50%;margin-bottom:10px;">
          <div><b>${employee.fullName}</b></div>
          <div>Employee No: ${employee.employeeNo}</div>
          <div>Unavailable Days: ${employee.unavailableCount}</div>
        </div>`;
      }
    },
    colors: colors,
    legend: {
      show: false
    },
  };

  return (
    <DashboardWidgetCard
      title="Employee Unavailability"
      subtitle="Frequently unavailable employees"
      dataLabel1="Total Unavailable Days"
      dataItem1={totalUnavailableDays.toString()}
      dataLabel2="Most Unavailable"
      dataItem2={mostUnavailableEmployee}
    >
      <>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        ) : employeeData.length > 0 ? (
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={390}
          />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10} height={400} color={'GrayText'}>
            <PieChartIcon style={{ fontSize: 60, marginBottom: 16 }} />
            <Typography variant="body1" align="center">
              No unavailability data available for the selected period.
            </Typography>
          </Box>
        )}
      </>
    </DashboardWidgetCard>
  );
};

export default FrequentlyUnavailableEmployeesChart;