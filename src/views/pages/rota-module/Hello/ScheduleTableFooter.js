import { TableFooter, TableRow, TableCell, Typography, Stack, Box } from '@mui/material';
import {
  calculateDailyTotals,
  calculateWeekTotals,
  formatCurrency,
} from './utils/shiftCalculations';

const TotalRow = ({ label, value, unit }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    }}
  >
    <Typography variant="caption" color="text.primary">
      {label}
    </Typography>
    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
      {value}
      {unit}
    </Typography>
  </Box>
);

const DailyValue = ({ value, unit }) => (
  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
    {value}
    {unit}
  </Typography>
);

const ScheduleTableFooter = ({ weekDates, employeeShifts, currencySymbol }) => {
  const weekTotals = calculateWeekTotals(weekDates, employeeShifts);

  return (
    <TableFooter
      sx={{
        position: 'sticky',
        bottom: 0,
        bgcolor: 'grey.50',
        zIndex: 2,
        '& tr': {
          '& td': {
            borderBottom: 'none',
            borderTop: '1px solid',
            borderTopColor: 'divider',
            // Reduced padding
            py: 1, // Changed from py: 2
          },
        },
      }}
    >
      <TableRow>
        <TableCell
          sx={{
            position: 'sticky',
            left: 0,
            backgroundColor: 'grey.50',
            borderRight: '1px solid',
            borderColor: 'divider',
            zIndex: 3,
            width: '240px',
            py: 1, // Changed from py: 2
          }}
        >
          <Stack spacing={0.5} width="100%">
            {' '}
            {/* Reduced spacing from 1 to 0.5 */}
            <TotalRow label="Scheduled Hours" value={weekTotals.hours.toFixed(1)} unit="h" />
            <TotalRow
              label="Labor Cost"
              value={formatCurrency(weekTotals.cost, currencySymbol)}
              unit=""
            />
            <TotalRow label="Employees" value={weekTotals.employees} unit="" />
          </Stack>
        </TableCell>

        {weekDates.map((date) => {
          const dailyTotals = calculateDailyTotals(date, employeeShifts);

          return (
            <TableCell
              key={date.format('YYYY-MM-DD')}
              sx={{
                backgroundColor: 'grey.50',
                borderRight: '1px solid',
                borderColor: 'divider',
                py: 1, // Changed from py: 2
              }}
            >
              <Stack spacing={0.25} alignItems="center">
                {' '}
                {/* Reduced spacing from 0.5 to 0.25 */}
                <DailyValue value={dailyTotals.hours.toFixed(1)} unit="h" />
                <DailyValue value={formatCurrency(dailyTotals.cost, currencySymbol)} unit="" />
                <DailyValue value={`${dailyTotals.employees} staff`} unit="" />
              </Stack>
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
};
export default ScheduleTableFooter;
