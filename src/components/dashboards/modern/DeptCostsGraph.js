import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import DashboardWidgetCard from '../../shared/DashboardWidgetCard';
import { useSelector } from 'react-redux';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TimelineRounded as TimelineIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { Box } from '@mui/system';
import { CircularProgress, Typography } from '@mui/material';

const DeptCostGraph = () => {
  const { departmentData, totalCost, highestCostDepartment, loading } = useSelector(
    (state) => state.dashboardReducer,
  );
  const currencySymbol = useSelector(
    (state) => state.loginReducer.user?.currencyData?.symbolNative,
  );

  const formatCurrency = (amount) => {
    const spacedCurrencies = ['Rs', '₨', 'kr', 'Rp'];
    const needsSpace = spacedCurrencies.includes(currencySymbol);
    return `${currencySymbol}${needsSpace ? ' ' : ''}${amount.toFixed(2)}`;
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;

  const optionscolumnchart = {
    series: departmentData.map((dept) => parseFloat(dept.cost.toFixed(2))),
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: departmentData.map((dept) => dept.description),
      colors: [primary, secondary, success, warning, error],
      title: {
        align: 'center',
      },
    },
  };

  const hasCostData = departmentData.length > 0 && totalCost > 0;

  return (
    <DashboardWidgetCard
      title="Department Costs"
      subtitle="Costs breakdown"
      dataLabel1="Total"
      dataItem1={hasCostData ? formatCurrency(totalCost) : 'N/A'}
      dataLabel2="Most Expensive"
      dataItem2={hasCostData ? highestCostDepartment : 'N/A'}
    >
      <>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress />
          </Box>
        ) : hasCostData ? (
          <Chart
            options={optionscolumnchart.options}
            series={optionscolumnchart.series}
            type="pie"
            height="400px"
          />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={10}
            height={400}
            color={'GrayText'}
          >
            <PieChartIcon style={{ fontSize: 60, marginBottom: 16 }} />
            <Typography variant="body1" align="center">
              No cost data available for the selected period.
            </Typography>
          </Box>
        )}
      </>
    </DashboardWidgetCard>
  );
};

export default DeptCostGraph;
