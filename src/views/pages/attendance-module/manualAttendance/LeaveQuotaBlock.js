import React, { useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  tooltipClasses,
  Badge,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[3],
    fontSize: 13,
    padding: 0,
    maxWidth: 'none',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const LeaveQuotaBlock = ({ employeeLeaves, leavesTaken }) => {
  const [isHovered, setIsHovered] = useState(false);
  const quotaData = employeeLeaves?.length > 0 ? employeeLeaves[0] : null;

  // Calculate total leaves taken
  const totalLeavesTaken = quotaData
    ? quotaData.medicalTotal -
      quotaData.medicalRemainingTotal +
      (quotaData.casualTotal - quotaData.casualRemainingTotal) +
      (quotaData.annualTotal - quotaData.annualRemainingTotal)
    : 0;

  // Calculate total leaves remaining
  const totalLeavesRemaining = quotaData
    ? quotaData.medicalRemainingTotal +
      quotaData.casualRemainingTotal +
      quotaData.annualRemainingTotal
    : 0;

  const tooltipContent = (
    <Box>
      <TableContainer component={Paper} sx={{ minWidth: 300 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Leave Type</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>
                Total
              </TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>
                Taken
              </TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>
                Remaining
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotaData && (
              <>
                <TableRow hover>
                  <TableCell>Medical</TableCell>
                  <TableCell align="center">{quotaData.medicalTotal}</TableCell>
                  <TableCell align="center">
                    {quotaData.medicalTotal - quotaData.medicalRemainingTotal}
                  </TableCell>
                  <TableCell align="center">{quotaData.medicalRemainingTotal}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Casual</TableCell>
                  <TableCell align="center">{quotaData.casualTotal}</TableCell>
                  <TableCell align="center">
                    {quotaData.casualTotal - quotaData.casualRemainingTotal}
                  </TableCell>
                  <TableCell align="center">{quotaData.casualRemainingTotal}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Annual</TableCell>
                  <TableCell align="center">{quotaData.annualTotal}</TableCell>
                  <TableCell align="center">
                    {quotaData.annualTotal - quotaData.annualRemainingTotal}
                  </TableCell>
                  <TableCell align="center">{quotaData.annualRemainingTotal}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{
                      border: 0,
                      py: 0.5,
                      pr: 2.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          textAlign: 'right',
                          color: 'text.secondary',
                          pr: 1,
                        }}
                      >
                        {'Total Remaining Quota: '}
                      </Typography>
                      <Typography fontSize={'small'} sx={{ color: 'primary.main' }}>
                        {totalLeavesRemaining}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <LightTooltip title={tooltipContent} arrow placement="top" enterDelay={200}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          bgcolor: 'grey.50',
          px: 4,
          py: 2,
          borderRadius: '12px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-1px)',
          },
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h5" fontWeight={800}>
              {leavesTaken}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ color: 'grey' }}>Leaves Taken</Typography>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                variant="dot"
              >
                <InfoIcon
                  sx={{
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    color: isHovered ? 'primary.main' : 'grey.400',
                  }}
                />
              </StyledBadge>
            </Box>
          </div>
        </div>
      </Box>
    </LightTooltip>
  );
};

export default LeaveQuotaBlock;
