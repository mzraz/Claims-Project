import {
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  Stack,
  Typography,
  Box,
  IconButton,
  Link,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import dayjs from 'dayjs';
import { ShiftSlot, EmptySlot, SHIFT_COLORS } from './ShiftSlots';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { calculateShiftCost, calculateShiftHours } from './utils/shiftCalculations';

// Extend dayjs with required plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

const ScheduleTableBody = ({
  employees,
  weekDates,
  employeeShifts,
  shiftTemplates,
  onShiftAdd,
  onShiftEdit,
  onShiftDelete,
  currencyCode,
  currencySymbol,
  onEditEmployeeShifts,
  onEmployeeClick,
}) => {
  // Helper functions remain the same
  const getShiftsForDateAndEmployee = (date, employeeId) => {
    return employeeShifts.filter(
      (shift) => shift.employeeId === employeeId && dayjs(shift.date).isSame(date, 'day'),
    );
  };

  const calculateWeeklyTotals = (employeeId) => {
    return weekDates.reduce(
      (totals, date) => {
        const shifts = getShiftsForDateAndEmployee(date, employeeId);

        const dayTotals = shifts.reduce(
          (dayTotal, shift) => {
            if (!shift.isNotAvailable && !shift.isOnLeave) {
              const hours = calculateShiftHours(shift);
              const cost = calculateShiftCost(shift);
              return {
                hours: dayTotal.hours + hours,
                cost: dayTotal.cost + cost,
              };
            }
            return dayTotal;
          },
          { hours: 0, cost: 0 },
        );

        return {
          hours: totals.hours + dayTotals.hours,
          cost: totals.cost + dayTotals.cost,
        };
      },
      { hours: 0, cost: 0 },
    );
  };

  const formatCurrency = (amount) => {
    const needsSpace = ['Rs', '₨', 'kr', 'Rp'].includes(currencySymbol);
    return `${currencySymbol}${needsSpace ? ' ' : ''}${amount.toFixed(2)}`;
  };

  return (
    <TableBody>
      {employees.map((employee) => {
        const weeklyTotals = calculateWeeklyTotals(employee.id);

        return (
          <TableRow key={employee.id}>
            <TableCell
              sx={{
                position: 'sticky',
                left: 0,
                borderRight: '1px solid',
                backgroundColor: 'background.paper',
                zIndex: 2,
                borderColor: 'divider',

                minWidth: '240px',
                p: 1,
                minHeight: '120px',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  src={employee.img}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid',
                    borderColor: 'divider',
                  }}
                />
                <Box sx={{ flex: 1, position: 'relative', minHeight: '42px' }}>
                  <Typography
                    variant="body1"
                    onClick={() => onEmployeeClick?.(employee)}
                    sx={{
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'primary.main',
                      textAlign: 'left',
                      pr: '32px',
                      lineHeight: 1.2,
                      '&:hover': {
                        textDecoration: 'none',
                        opacity: 0.8,
                      },
                    }}
                  >
                    {employee.name}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      mt: 0.5,
                      pr: '32px',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="caption">{weeklyTotals.hours.toFixed(1)} hrs</Typography>
                    <Typography variant="caption">/</Typography>
                    <Typography variant="caption">{formatCurrency(weeklyTotals.cost)}</Typography>
                  </Stack>

                  <IconButton
                    size="small"
                    onClick={() => onEditEmployeeShifts(employee)}
                    sx={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      padding: '4px',
                    }}
                  >
                    <ScheduleIcon fontSize="small" color="primary" />
                  </IconButton>
                </Box>
              </Stack>
            </TableCell>

            {/* Date Cells */}
            {weekDates.map((date) => {
              const shifts = getShiftsForDateAndEmployee(date, employee.id);
              const availableShiftTemplates = shiftTemplates.filter((template) =>
                dayjs(date).isBetween(template.startDate, template.endDate, 'day', '[]'),
              );

              return (
                <TableCell
                  key={date.format('YYYY-MM-DD')}
                  sx={{
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    p: 0.5,
                    position: 'relative',
                    verticalAlign: 'top',
                  }}
                >
                  {shifts.length > 0 ? (
                    <Stack spacing={0.5}>
                      {shifts.map((shift) => (
                        <ShiftSlot
                          key={shift.id}
                          shift={shift}
                          template={shiftTemplates.find((t) => t.id === shift.shiftId)}
                          onEdit={() => onShiftEdit(shift)}
                          onDelete={() => onShiftDelete(shift.id)}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <EmptySlot
                      onClick={() => onShiftAdd(employee.id, date)}
                      availableTemplates={availableShiftTemplates}
                    />
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default ScheduleTableBody;
