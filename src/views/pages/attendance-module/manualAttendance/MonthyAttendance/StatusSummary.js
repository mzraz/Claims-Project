import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  [`&.${LinearProgress}colorPrimary`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'P':
      return '#4caf50'; // Green
    case 'A':
      return '#f44336'; // Red
    case 'L':
      return '#ff9800'; // Orange
    case 'CDO':
      return '#2196f3'; // Blue
    case 'PH':
      return '#9c27b0'; // Purple
    case 'OPL':
      return '#00bcd4'; // Cyan
    case 'OUPL':
      return '#607d8b'; // Blue Grey
    default:
      return '#9e9e9e'; // Grey
  }
};
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 1)',
    boxShadow: theme.shadows[3],
    fontSize: 11,
  },
}));

const StatusSummary = React.memo(({ summary }) => {
  const totalDays = Object.values(summary).reduce((acc, curr) => acc + curr, 0);
  const otherCount = summary.CDO + summary.PH + summary.OPL + summary.OUPL;
  const statusLabels = {
    P: 'Present',
    A: 'Absent',
    L: 'Leave',
    CDO: 'Company Day Off',
    PH: 'Public Holiday',
    OPL: 'On Paid Leave',
    OUPL: 'On Unpaid Leave',
  };
  return (
    <LightTooltip
      placement="left"
      title={
        <Box width="100%">
          {Object.entries(summary).map(([status, count]) => (
            <Box key={status} mb={0.5} sx={{ width: '100%' }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={5}
                mb={0.25}
                sx={{ width: '100%' }}
              >
                <Typography variant="caption" fontWeight="bold" color={getStatusColor(status)}>
                  {statusLabels[status]}
                </Typography>
                <Box className="flex items-center gap-2">
                  <Typography variant="caption" fontWeight={'bold'}>
                    {count}
                  </Typography>
                  <Typography variant="caption" component={'span'} color="GrayText">
                    ({((count / totalDays) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              </Box>
              <StyledLinearProgress
                variant="determinate"
                value={(count / totalDays) * 100}
                sx={{
                  bgcolor: `${getStatusColor(status)}20`,
                  '& .MuiLinearProgress-bar': { bgcolor: getStatusColor(status) },
                }}
              />
            </Box>
          ))}
        </Box>
      }
    >
      <Box sx={{ minWidth: '2.5rem' }}>
        {['P', 'A', 'L'].map((status) => (
          <Box className="flex items-center justify-between">
            <Typography
              key={status}
              variant="body2"
              sx={{ color: getStatusColor(status), fontWeight: 'bold' }}
            >
              {status}:
            </Typography>
            <Typography variant="body2" textAlign={'right'}>
              {summary[status] || '-'}
            </Typography>
          </Box>
        ))}
        {/* <Typography variant="body2" sx={{ color: getStatusColor('Others'), fontWeight: 'bold' }}>
            Others: {otherCount}
          </Typography> */}
      </Box>
    </LightTooltip>
  );
});

export default StatusSummary;
