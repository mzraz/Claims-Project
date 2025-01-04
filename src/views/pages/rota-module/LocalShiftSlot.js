import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import BlockIcon from '@mui/icons-material/Block';
import { calculateBreakDuration } from './scheduleUtils';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const LocalShiftSlot = ({ shift, onDelete, onEdit, onMarkNA }) => {
  console.log(shift);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (shift.isNotAvailable) {
    return (
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          fontSize: '11px',
          boxSizing: 'border-box',
          color: 'gray.600',
          fontWeight: 'bold',
          borderRadius: '5px',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: 'rgba(224, 224, 224, 0.5)',
          border: '1px dashed #9E9E9E',
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '6.5rem',
        }}
      >
        <BlockIcon sx={{ fontSize: 18, color: '#757575', marginBottom: '2px' }} />
        <Typography variant="caption" sx={{ fontWeight: 'medium', color: '#616161' }}>
          N/A
        </Typography>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-full left-[0] flex flex-col z-[10] bg-white w-[6.5rem] text-black drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 4 }}
              transition={{ duration: 0.1 }}
            >
              <Box>
                <Typography
                  sx={{ color: 'red' }}
                  onClick={() => onDelete(shift.id)}
                  className="flex gap-3 py-2 hover:bg-gray-200 px-2"
                >
                  <DeleteIcon fontSize="small" sx={{ color: 'red' }} /> Delete
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
  }

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontSize: '10px',
        borderLeft: `7px solid ${shift.color}`,
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: 'black',
        fontWeight: 'bold',
        borderRadius: '5px',
        position: 'relative',
      }}
      className="text-center cursor-pointer rounded-sm px-2 w-[6.5rem] flex flex-col"
    >
      {`${dayjs(shift.startTime, 'h:mm A').format('HH:mm')} - ${dayjs(
        shift.endTime,
        'h:mm A',
      ).format('HH:mm')}`}
      <Box
        sx={{
          fontSize: '10px',
          alignSelf: 'start',
          pl: 0.85,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <FreeBreakfastIcon sx={{ fontSize: 13, color: shift.color }} />
        <Typography fontSize={'10px'} pb={0.2} className="flex items-center gap-1">
          {shift.breakStartTime && shift.breakEndTime ? (
            <>
              {` ${calculateBreakDuration(
                dayjs(shift.breakStartTime, 'h:mm A').format('HH:mm'),
                dayjs(shift.breakEndTime, 'h:mm A').format('HH:mm'),
              )}m`}
              {shift.isBreakPaid && (
                <Tooltip title="Paid break">
                  <Box
                    component="span"
                    sx={{
                      borderRadius: '10px',
                      color: 'primary.main',
                      fontSize: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Paid
                  </Box>
                </Tooltip>
              )}
            </>
          ) : (
            'No break'
          )}
        </Typography>
      </Box>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            onPointerDownCapture={(e) => e.stopPropagation()}
            className="absolute bottom-full left-[-.3rem] flex flex-col z-[10] bg-white w-[6.5rem] text-black drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.1 }}
          >
            <Box>
              {/* <Typography
                sx={{ color: 'primary.main' }}
                onClick={() => onEdit(shift)}
                className="flex gap-3 py-2 hover:bg-gray-200 px-2 border-b"
              >
                <EditIcon fontSize="small" sx={{ color: 'primary.main' }} /> Edit
              </Typography> */}
              <Typography
                sx={{ color: 'red' }}
                onClick={() => onDelete(shift.id)}
                className="flex gap-3 py-2 hover:bg-gray-200 px-2"
              >
                <DeleteIcon fontSize="small" sx={{ color: 'red' }} /> Delete
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LocalShiftSlot;
