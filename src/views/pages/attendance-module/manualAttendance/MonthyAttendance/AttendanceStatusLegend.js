import React, { useState } from 'react';
import { Box, Tooltip, IconButton, Popover, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AttendanceStatusLegend = ({ getStatusColor }) => {
    const statusDescriptions = {
      P: 'Present',
      A: 'Absent',
      L: 'Leave',
      CDO: 'Company Day Off',
      PH: 'Public Holiday',
      OPL: 'On Paid Leave',
      OUPL: 'On Unpaid Leave',
    };
  
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'status-legend-popover' : undefined;
  
    return (
      <Box>
        <Tooltip title="View Status Legend">
          <IconButton onClick={handleClick}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            {/* <Typography variant="h6" gutterBottom>
              Status Legend
            </Typography> */}
            {Object.entries(statusDescriptions).map(([status, description]) => (
              <Box key={status} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    mr: 1,
                    ...getStatusColor(status),
                  }}
                />
                <Typography variant="body2">
                  <strong>{status}</strong>: {description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>
    );
  };
  

export default AttendanceStatusLegend;