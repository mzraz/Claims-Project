import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import DashboardCard from '../../shared/DashboardCard';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  TableContainer,
  Stack,
  CircularProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';

const TopPerformers = () => {
  const { topEmployeesByHours, loading } = useSelector((state) => state.dashboardReducer);

  // Sort employees by hours in descending order
  const sortedEmployees = useMemo(() => {
    if (!topEmployeesByHours) return [];
    return [...topEmployeesByHours].sort((a, b) => b.totalHours - a.totalHours);
  }, [topEmployeesByHours]);

  return (
    <DashboardCard
      title="Top Performers"
      subtitle={'Top employees by hours'}
    >
      <TableContainer>
        <Table
          aria-label="top employees table"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap' }}>Employee</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap' }}>Email</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap' }}>Designation</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap' }}>Total Hours</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : sortedEmployees.length > 0 ? (
              sortedEmployees.map((employee, index) => (
                <TableRow key={employee.employeeNo} sx={{
                  backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'inherit',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={`${employee.image}`}
                        alt={employee.fullName}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {employee.fullName}
                          {index === 0 && <EmojiEventsIcon sx={{ ml: 1, fontSize: 16, color: 'warning.main' }} />}
                        </Typography>
                        <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                          {employee.employeeNo}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {employee.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WorkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                        {employee.designationLabel}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={600}>
                      {employee.totalHours.toFixed(2)} hrs
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="subtitle1">No top employees data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TopPerformers;