import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

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

const DailySummaryCell = ({ date, dailyStatusCounts }) => {
  const statusOrder = ['P', 'A', 'L', 'CDO', 'PH', 'OPL', 'OUPL'];
  const statusLabels = {
    P: 'Present',
    A: 'Absent',
    L: 'Leave',
    CDO: 'Company Day Off',
    PH: 'Public Holiday',
    OPL: 'On Paid Leave',
    OUPL: 'On Unpaid Leave',
  };
  const counts = dailyStatusCounts[date.format('YYYY-MM-DD')] || {};
  const totalLeaves = (counts.OPL || 0) + (counts.OUPL || 0);
  const totalCount = Object.values(counts).reduce((acc, curr) => acc + curr, 0);
  const otherCount = (counts.CDO || 0) + (counts.PH || 0) + (counts.OPL || 0) + (counts.OUPL || 0);

  return (
    <Tooltip
      title={
        <Box>
          {statusOrder.map((status) => (
            <Typography key={status} variant="body2">
              {statusLabels[status]}: {counts[status] || 0}
            </Typography>
          ))}
        </Box>
      }
    >
      <Box width="100%" className="px-2">
        {['P', 'A', 'L'].map((status) => (
          <Box key={status} className="flex items-center justify-between">
            <Typography variant="body2" sx={{ color: getStatusColor(status), fontWeight: 'bold' }}>
              {status}:
            </Typography>
            <Typography variant="body2" textAlign={'right'}>
              {status === 'L' ? totalLeaves || '-' : counts[status] || '-'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Tooltip>
  );
};

export default DailySummaryCell;
