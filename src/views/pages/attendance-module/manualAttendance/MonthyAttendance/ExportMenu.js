import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileOpenIcon from '@mui/icons-material/FileOpen';

function ExportMenu({ exportToCSV, attendanceData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    exportToCSV(attendanceData);
    handleClose();
  };

  return (
    <Box>
      <IconButton
        aria-label="more"
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleExport} sx={{ color: 'primary.main' }}>
          <FileOpenIcon fontSize="small" sx={{ color: 'primary.main', marginRight: 1 }} />
          Export to CSV
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ExportMenu;