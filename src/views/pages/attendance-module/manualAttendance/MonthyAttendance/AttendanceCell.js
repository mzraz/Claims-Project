import React, { useState } from 'react';
import { Box, Tooltip, Typography, IconButton, Fade } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const AttendanceCell = React.memo(
  ({
    employee,
    date,
    getStatusColor,
    viewDetail,
    handleEditAttendance,
    handleCreateAttendance,
    handleDeleteAttendance,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const detail = employee.employeeDetail.find((d) =>
      dayjs(d.date, 'DD/MM/YYYY').isSame(date, 'day'),
    );

    return (
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex justify-center items-center mx-2 relative cursor-pointer"
      >
        {detail ? (
          <Tooltip
            disableInteractive
            title={`In: ${detail.checkInTime || '-'}, Out: ${detail.checkOutTime || '-'}`}
          >
            <Box
              className="flex items-center justify-center w-full"
              sx={{
                color: getStatusColor(detail.statusSymbol).color,
                backgroundColor: getStatusColor(detail.statusSymbol).backgroundColor,
                minWidth: '3rem',
                minHeight: '3rem',
                borderRadius: 0,
                transition: 'ease-in',
              }}
            >
              <Box fontWeight={800} sx={{ width: '100%' }}>
                {viewDetail && detail.statusSymbol === 'P' ? (
                  <Fade in>
                    <Box className="flex justify-center items-center mx-2 ">
                      {detail ? (
                        <Tooltip
                          title={`In: ${detail.checkInTime || '-'}, Out: ${
                            detail.checkOutTime || '-'
                          }`}
                        >
                          <Box
                            className="flex items-center justify-center w-full"
                            sx={{
                              color: getStatusColor(detail.statusSymbol).color,
                              backgroundColor: getStatusColor(detail.statusSymbol).backgroundColor,
                              minWidth: '3rem',
                              minHeight: '3rem',
                              borderRadius: 0,
                              transition: 'ease-in',
                            }}
                          >
                            <Box fontWeight={800} sx={{ width: '100%' }}>
                              {viewDetail && detail.statusSymbol === 'P' ? (
                                <Fade in>
                                  <Box textAlign={'start'} className="px-2">
                                    <Box className="grid grid-cols-[auto,1fr] gap-x-3 items-center">
                                      <Typography
                                        fontSize={11}
                                        className="flex items-center gap-1 whitespace-nowrap"
                                        variant="caption"
                                      >
                                        <span className="p-1 max-h-1 max-w-1 bg-green-500 rounded-full" />
                                        IN:
                                      </Typography>
                                      <Typography
                                        fontSize={11}
                                        className="whitespace-nowrap text-right"
                                        variant="caption"
                                      >
                                        {detail.checkInTime || '-'}
                                      </Typography>

                                      <Typography
                                        fontSize={11}
                                        className="flex items-center gap-1 whitespace-nowrap"
                                        variant="caption"
                                      >
                                        <span className="p-1 max-h-1 max-w-1 bg-red-500 rounded-full" />
                                        OUT:
                                      </Typography>
                                      <Typography
                                        fontSize={11}
                                        className="whitespace-nowrap text-right"
                                        variant="caption"
                                      >
                                        {detail.checkOutTime || '-'}
                                      </Typography>

                                      <Typography
                                        fontSize={11}
                                        className="flex items-center gap-1 whitespace-nowrap"
                                        variant="caption"
                                      >
                                        <span className="p-1 max-h-1 max-w-1 bg-blue-500 rounded-full" />
                                        TW:
                                      </Typography>
                                      <Typography
                                        fontSize={11}
                                        className="whitespace-nowrap text-right"
                                        variant="caption"
                                      >
                                        {detail.totalWorked}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Fade>
                              ) : (
                                detail.statusSymbol
                              )}
                            </Box>
                          </Box>
                        </Tooltip>
                      ) : (
                        <Box
                          className="flex items-center justify-center w-full"
                          sx={{ minWidth: '3rem', minHeight: '3rem', borderRadius: 0 }}
                        >
                          <Typography>-</Typography>
                        </Box>
                      )}
                    </Box>
                  </Fade>
                ) : (
                  detail.statusSymbol
                )}
              </Box>
            </Box>
          </Tooltip>
        ) : (
          <Box
            className="flex items-center justify-center w-full"
            sx={{ minWidth: '3rem', minHeight: '3rem', borderRadius: 0 }}
          >
            <Typography>-</Typography>
          </Box>
        )}

        <AnimatePresence>
          {isHovered && detail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 4 }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                // left: '50%',
                // transform: 'translateX(-50%)',
                zIndex: 10,
                backgroundColor: 'white',
                boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '4px',
                minWidth: '50px',
                border: '1px solid #e0e0e0',
              }}
            >
              {/* <Fade in={isHovered} timeout={200}> */}

              {detail.attendenceId ? (
                <>
                  {/* <Typography variant="caption" display="block">
                                  In: {detail.checkInTime || '-'}
                              </Typography>
                              <Typography variant="caption" display="block">
                                  Out: {detail.checkOutTime || '-'}
                              </Typography> */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 0.5,
                      alignItems: 'center',
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEditAttendance(detail, employee.employeeId, employee.employeeName)
                        }
                      >
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteAttendance(detail.attendenceId)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Tooltip title="Create Attendance">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleCreateAttendance(employee.employeeId, date.format('YYYY-MM-DD'))
                      }
                    >
                      <AddIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              {/* </Fade> */}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
  },
);

export default AttendanceCell;
