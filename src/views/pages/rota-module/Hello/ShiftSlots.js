import { useState } from 'react';
import { Box, Typography, IconButton, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import InfoIcon from '@mui/icons-material/Info';
import { calculateShiftHours } from './utils/shiftCalculations';

export const SHIFT_COLORS = [
  { bg: 'bg-blue-50 border-l-blue-200', hover: 'hover:bg-blue-100/50' },
  { bg: 'bg-purple-50 border-l-purple-200', hover: 'hover:bg-purple-100/50' },
  { bg: 'bg-red-50 border-l-red-200', hover: 'hover:bg-red-100/50' },
  { bg: 'bg-green-50 border-l-green-200', hover: 'hover:bg-green-100/50' },
  { bg: 'bg-yellow-50 border-l-yellow-200', hover: 'hover:bg-yellow-100/50' },
  { bg: 'bg-orange-50 border-l-orange-200', hover: 'hover:bg-orange-100/50' },
  { bg: 'bg-teal-50 border-l-teal-200', hover: 'hover:bg-teal-100/50' },
  { bg: 'bg-indigo-50 border-l-indigo-200', hover: 'hover:bg-indigo-100/50' },
  { bg: 'bg-pink-50 border-l-pink-200', hover: 'hover:bg-pink-100/50' },
  { bg: 'bg-cyan-50 border-l-cyan-200', hover: 'hover:bg-cyan-100/50' },
];

export const ShiftSlot = ({ shift, template, onEdit, onDelete, formatCurrency }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (shift.isNotAvailable) {
    return (
      <Box
        sx={{
          py: 0.5,
          px: 1,
          border: '1px dashed grey',
          borderRadius: 1,
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <BlockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="caption">Not available</Typography>
      </Box>
    );
  }

  if (shift.isOnLeave) {
    const hoursForDay = calculateShiftHours(shift);

    return (
      <Box
        sx={{
          py: 0.5,
          px: 1,
          border: `1px dashed ${shift.isUnpaidLeave ? '#FB8C00' : '#4CAF50'}`,
          borderRadius: 1,
          bgcolor: shift.isUnpaidLeave ? '#FFF3E0' : '#E8F5E9',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <BeachAccessIcon
          sx={{
            fontSize: 16,
            color: shift.isUnpaidLeave ? '#FB8C00' : '#4CAF50',
          }}
        />
        <Typography
          variant="caption"
          color={shift.isUnpaidLeave ? '#FB8C00' : '#4CAF50'}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          {shift.isUnpaidLeave ? 'Unpaid Leave' : 'Paid Leave'}
          {!shift.isUnpaidLeave && hoursForDay > 0 && (
            <Tooltip title={`Paid for ${hoursForDay.toFixed(1)} hours`} arrow>
              <InfoIcon sx={{ fontSize: 14, ml: 0.5, cursor: 'help' }} />
            </Tooltip>
          )}
        </Typography>
      </Box>
    );
  }

  const colorSet =
    template?.colorIndex !== undefined
      ? SHIFT_COLORS[template.colorIndex % SHIFT_COLORS.length]
      : { bg: 'bg-gray-50 border-l-gray-200', hover: 'hover:bg-gray-100/50' };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ borderRadius: 0 }}
      className={`py-0.5 px-1 pl-2 border border-l-4 relative w-full transition-colors ${colorSet.bg} ${colorSet.hover}`}
    >
      <Stack>
        <Typography
          variant="caption"
          className="text-xs"
          sx={{ fontSize: '10px', fontWeight: 600 }}
        >
          {shift.startTime} - {shift.endTime}
        </Typography>

        <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary' }}>
          {template?.name}
        </Typography>
      </Stack>

      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 4,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            zIndex: 1,
          }}
        >
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={onEdit} sx={{ padding: 0.5 }}>
              <EditIcon sx={{ fontSize: '0.875rem' }} />
            </IconButton>
            <IconButton size="small" onClick={onDelete} sx={{ padding: 0.5 }}>
              <DeleteIcon sx={{ fontSize: '0.875rem', color: 'error.main' }} />
            </IconButton>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export const EmptySlot = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 32,
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            borderRadius: 0,
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AddIcon sx={{ fontSize: 20, color: 'gray' }} />
        </Box>
      )}
    </Box>
  );
};
