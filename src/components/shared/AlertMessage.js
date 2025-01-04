import * as React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { createPortal } from 'react-dom';

const AlertMessage = ({ open, setAlert, severity, message }) => {
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({
      open: false,
      severity: '',
      message: '',
    });
  };

  const alertContent = (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
      onClose={handleClose}
      sx={{
        position: 'fixed',
        zIndex: 99999999, // Extremely high z-index
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '330px',
          color: 'white',
          backgroundColor: severity === 'success' ? '#009F0C' : '',
          boxShadow: '0px 5px 15px rgba(0,0,0,0.3)', // Strong shadow for emphasis
        }}
      >
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    </Snackbar>
  );

  return createPortal(alertContent, document.body);
};

export default AlertMessage;
