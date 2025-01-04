import dayjs from 'dayjs';

// Basic time calculations
export const calculateBreakDuration = (breakStartTime, breakEndTime) => {
  if (!breakStartTime || !breakEndTime) return 0;

  let start = dayjs(`2000-01-01T${breakStartTime}`);
  let end = dayjs(`2000-01-01T${breakEndTime}`);

  // If end time is before start time, assume it's the next day
  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  return end.diff(start, 'minute');
};

export const calculateShiftHours = (shift) => {
  if (!shift.startTime || !shift.endTime) return 0;

  let start = dayjs(`2000-01-01T${shift.startTime}`);
  let end = dayjs(`2000-01-01T${shift.endTime}`);

  // If end time is before start time, assume it's the next day
  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  let totalMinutes = end.diff(start, 'minute');

  // Subtract break time if it exists and is not paid
  if (shift.breakStartTime && shift.breakEndTime && !shift.isBreakPaid) {
    const breakDuration = calculateBreakDuration(shift.breakStartTime, shift.breakEndTime);
    totalMinutes -= breakDuration;
  }

  return Math.max(totalMinutes / 60, 0);
};

export const calculateShiftCost = (shift) => {
  const hours = calculateShiftHours(shift);
  return hours * shift.hourlyRate;
};

// Daily calculations
export const calculateDailyTotals = (date, employeeShifts) => {
  const dateShifts = employeeShifts.filter(
    (shift) => dayjs(shift.date).isSame(date, 'day') && !shift.isNotAvailable,
  );

  return dateShifts.reduce(
    (totals, shift) => {
      const hours = calculateShiftHours(shift);
      const cost = calculateShiftCost(shift);

      return {
        hours: totals.hours + hours,
        cost: totals.cost + cost,
        employees: totals.employees + 1,
      };
    },
    { hours: 0, cost: 0, employees: 0 },
  );
};

// Weekly calculations
export const calculateWeekTotals = (weekDates, employeeShifts) => {
  return weekDates.reduce(
    (totals, date) => {
      const dayTotals = calculateDailyTotals(date, employeeShifts);
      return {
        hours: totals.hours + dayTotals.hours,
        cost: totals.cost + dayTotals.cost,
        employees: Math.max(totals.employees, dayTotals.employees),
      };
    },
    { hours: 0, cost: 0, employees: 0 },
  );
};

// Employee calculations
export const calculateEmployeeWeeklyTotals = (employeeId, weekDates, employeeShifts) => {
  return weekDates.reduce(
    (totals, date) => {
      const shifts = getEmployeeShiftsForDate(date, employeeId, employeeShifts);

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

// Helper functions
export const getEmployeeShiftsForDate = (date, employeeId, employeeShifts) => {
  return employeeShifts.filter(
    (shift) => shift.employeeId === employeeId && dayjs(shift.date).isSame(date, 'day'),
  );
};

export const formatCurrency = (amount, currencySymbol) => {
  const needsSpace = ['Rs', '₨', 'kr', 'Rp'].includes(currencySymbol);
  return `${currencySymbol}${needsSpace ? ' ' : ''}${amount.toFixed(2)}`;
};
