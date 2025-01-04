import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon,
  EventBusy as EventBusyIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';

const TopCards = () => {
  const {
    todayTotalHours,
    todayTotalCost,
    todayTotalOnleaveEmployees,
    todayTotalScheduledHours,
    todayTotalScheduledCost,
    loading,
  } = useSelector((state) => state.dashboardReducer);
  const currencySymbol = useSelector(
    (state) => state.loginReducer.user?.currencyData?.symbolNative || '$',
  );

  const formatCurrency = (amount) => {
    const spacedCurrencies = ['Rs', '₨', 'kr', 'Rp'];
    const needsSpace = spacedCurrencies.includes(currencySymbol);
    return `${currencySymbol}${needsSpace ? ' ' : ''}${amount.toFixed(2)}`;
  };

  const topcards = [
    {
      icon: <AccessTimeIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
      title: "Today's Total Hours",
      digits: todayTotalHours !== undefined ? `${todayTotalHours.toFixed(2)} hrs` : null,
      iconBackgroundColor: 'bg-teal-500',
      textColor: 'text-teal-700',
      cardBackgroundColor: '!bg-teal-50',
    },
    {
      icon: <MonetizationOnIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
      title: "Today's Total Cost",
      digits: todayTotalCost !== undefined ? formatCurrency(todayTotalCost) : null,
      iconBackgroundColor: 'bg-yellow-400',
      textColor: 'text-yellow-700',
      cardBackgroundColor: '!bg-yellow-50',
    },
    {
      icon: <EventBusyIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
      title: "Today's Leaves",
      digits: todayTotalOnleaveEmployees !== undefined ? todayTotalOnleaveEmployees : null,
      iconBackgroundColor: 'bg-rose-600',
      textColor: 'text-rose-700',
      cardBackgroundColor: '!bg-rose-50',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
      title: "Today's Scheduled Hours",
      digits:
        todayTotalScheduledHours !== undefined
          ? `${todayTotalScheduledHours.toFixed(2)} hrs`
          : null,
      iconBackgroundColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      cardBackgroundColor: '!bg-emerald-50',
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
      title: "Today's Scheduled Cost",
      digits:
        todayTotalScheduledCost !== undefined ? formatCurrency(todayTotalScheduledCost) : null,
      iconBackgroundColor: 'bg-green-500',
      textColor: 'text-green-700',
      cardBackgroundColor: '!bg-green-50',
    },
  ];

  return (
    <Grid container spacing={3} rowGap={3} mt={0} columns={10}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i} sx={{ pt: '0 !important' }}>
          <Card textAlign="center" className={topcard.cardBackgroundColor}>
            <CardContent sx={{ padding: '2px !important' }}>
              <Box
                className={
                  'flex items-center justify-center w-fit p-3 ' + topcard.iconBackgroundColor
                }
              >
                {topcard.icon}
              </Box>

              <Typography
                className={`${topcard.textColor}`}
                sx={{ opacity: 0.7, fontWeight: 500 }}
                mt={1}
                variant="subtitle1"
                mb={1}
              >
                {topcard.title}
              </Typography>
              <Box className="flex items-end justify-between">
                <Typography variant="h3" fontWeight={800} className={`${topcard.textColor}`}>
                  {loading || topcard.digits === null ? <Skeleton width="80px" /> : topcard.digits}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
