// scheduleUtils.js

import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function getNextDateOfWeek(dayOfWeek, baseDate) {
  const dayIndex = daysOfWeek.indexOf(dayOfWeek);
  const baseDay = dayjs(baseDate);
  const startOfWeek = baseDay.startOf('week').add(1, 'day'); // Monday as start
  const targetDate = startOfWeek.add(dayIndex, 'day');

  if (targetDate.isBefore(baseDay)) {
    return targetDate.add(1, 'week').toDate();
  }

  return targetDate.toDate();
}

const getFilteredShiftsForDate = (date, shifts) => {
  return shifts.filter((shift) => {
    const shiftStart = dayjs(shift.startDate);
    const shiftEnd = dayjs(shift.endDate);
    return (
      dayjs(date).isSameOrAfter(shiftStart, 'day') && dayjs(date).isSameOrBefore(shiftEnd, 'day')
    );
  });
};

export function getActiveDays(weekDays) {
  return weekDays.map((day) => day.id);
}

export function parseDate(shift) {
  return new Date(shift.start.split('T')[0]);
}

export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function mapShiftsToDays(shiftDays, defaultShifts, staff, shifts, currentWeek) {
  // First, determine which employees have shifts in the current week
  const weekStart = dayjs(currentWeek).startOf('week').add(1, 'day');
  const weekEnd = dayjs(weekStart).add(6, 'days');

  const employeesWithShifts = new Set(
    defaultShifts
      .filter((shift) => {
        const shiftDate = dayjs(parseDate(shift));
        return shiftDate.isSameOrAfter(weekStart) && shiftDate.isSameOrBefore(weekEnd);
      })
      .map((shift) => shift.resource),
  );

  const staffWithShifts = staff.filter((employee) => employeesWithShifts.has(employee.id));

  shiftDays.forEach((shiftDay) => {
    const shiftDate = shiftDay.date;

    shiftDay.shifts = shifts.map((shift) => ({
      ...shift,
      employees: staffWithShifts.map((staffMember) => ({
        staff: staffMember,
        title: '',
        shiftId: shift.id,
        start: '',
        end: '',
        breakStartTime: '',
        breakEndTime: '',
        isBreakPaid: false,
      })),
    }));

    defaultShifts
      .filter((shift) => isSameDay(parseDate(shift), shiftDate))
      .forEach((shift) => {
        const shiftIndex = shiftDay.shifts.findIndex((s) => s.id === shift.shiftId);
        if (shiftIndex !== -1) {
          const staffIndex = shiftDay.shifts[shiftIndex].employees.findIndex(
            (s) => s.staff.id === shift.resource,
          );
          if (staffIndex !== -1) {
            shiftDay.shifts[shiftIndex].employees[staffIndex] = {
              ...shift,
              staff: shiftDay.shifts[shiftIndex].employees[staffIndex].staff,
            };
          }
        }
      });
  });

  return shiftDays;
}
export function calculateHours(startDate, endDate, breakStartTime, breakEndTime, isBreakPaid) {
  let start = dayjs(startDate);
  let end = dayjs(endDate);

  // If end is before start, assume it's the next day
  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  let totalHours = end.diff(start, 'hour', true);

  // Calculate break duration
  let breakDuration = 0;

  if (breakStartTime && breakEndTime) {
    breakDuration = calculateBreakDuration(breakStartTime, breakEndTime) / 60; // Convert minutes to hours
  }

  // Subtract break time if it's not paid
  if (!isBreakPaid) {
    totalHours -= breakDuration;
  }
  return Math.max(totalHours, 0);
}

export function calculateTotalCost(hours, hourlyRates, shiftId, breakDuration, isBreakPaid) {
  // If break is paid, we don't need to subtract it from the hours
  const paidHours = isBreakPaid ? hours : hours - breakDuration / 60;
  const rate =
    hourlyRates.find((r) => r.shiftId === shiftId)?.hourlyRate || hourlyRates[0]?.hourlyRate || 0;
  return (Math.max(paidHours, 0) * rate).toFixed(2);
}

export function EmployeeHoursAndCostPerShift(shiftData, shiftId) {
  let hours = 0;
  let cost = 0;
  const shiftSlots = shiftData.shifts.find((shift) => shift.id === shiftId)?.employees || [];

  shiftSlots.forEach((slot) => {
    if (slot.title) {
      const { start, end, breakStartTime, breakEndTime, isBreakPaid } = slot;
      const dayHours = calculateHours(start, end, breakStartTime, breakEndTime, isBreakPaid);
      hours += dayHours;

      // Calculate cost based on worked hours, which already accounts for unpaid breaks
      const rate =
        slot.staff.shifts.find((s) => s.shiftId === shiftId)?.hourlyRate || slot.staff.rate;
      cost += dayHours * rate;
    }
  });

  return {
    hours: hours > 0 ? hours.toFixed(1) : 0,
    cost: cost > 0 ? cost.toFixed(2) : 0,
  };
}

export function totalHoursWeekly(id, defaultShifts, currentWeek) {
  const currentWeekStart = dayjs(currentWeek).startOf('week');
  const currentWeekEnd = currentWeekStart.endOf('week');

  const resourceWeeklyData = defaultShifts.filter((shift) => {
    const shiftStart = dayjs(shift.start);
    return (
      shift.resource === id &&
      shiftStart.isAfter(currentWeekStart) &&
      shiftStart.isBefore(currentWeekEnd)
    );
  });

  let weeklyHours = 0;

  resourceWeeklyData.forEach((data) => {
    const shiftHours = calculateHours(
      data.start,
      data.end,
      data.breakStartTime,
      data.breakEndTime,
      data.isBreakPaid,
    );
    weeklyHours += shiftHours;
  });

  return weeklyHours > 0 ? weeklyHours.toFixed(1) : 0;
}

export function calculateWeeklyCostForEmployee(employee, defaultShifts, currentWeek) {
  const weeklyHours = totalHoursWeekly(employee.id, defaultShifts, currentWeek);

  if (weeklyHours === 0) return 0;

  let totalCost = 0;
  const currentWeekStart = dayjs(currentWeek).startOf('week');
  const currentWeekEnd = currentWeekStart.endOf('week');

  defaultShifts.forEach((shift) => {
    const shiftStart = dayjs(shift.start);
    if (
      shift.resource === employee.id &&
      shiftStart.isAfter(currentWeekStart) &&
      shiftStart.isBefore(currentWeekEnd)
    ) {
      const shiftHours = calculateHours(
        shift.start,
        shift.end,
        shift.breakStartTime,
        shift.breakEndTime,
        shift.isBreakPaid,
      );
      const hourlyRate = employee.shifts.find((s) => s.shiftId === shift.shiftId)?.hourlyRate || 0;
      totalCost += shiftHours * hourlyRate;
    }
  });

  return totalCost;
}
export function sumTotalWeeklyCost(staff, defaultShifts, currentWeek) {
  return staff.reduce((total, staffMember) => {
    const employeeCost = calculateWeeklyCostForEmployee(staffMember, defaultShifts, currentWeek);
    return total + employeeCost;
  }, 0);
}

export function getRandomHexColorCode() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
}
export function calculateBreakDuration(breakStartTime, breakEndTime) {
  if (!breakStartTime || !breakEndTime) return 0;
  let start = dayjs(`2000-01-01T${breakStartTime}`);
  let end = dayjs(`2000-01-01T${breakEndTime}`);

  // If end time is before start time, assume it's the next day
  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  return end.diff(start, 'minute');
}
const generateCSVContent = (
  includeRates,
  updatedShiftDays,
  shifts,
  withShifts,
  defaultShifts,
  currentWeek,
  currencyCode,
) => {
  const baseHeaders = ['Employee Name', 'Employee ID', 'Designation'];

  // Create date headers and shift subheaders
  let dateHeaders = [];
  let shiftHeaders = [];
  updatedShiftDays.forEach((day) => {
    const filteredShifts = getFilteredShiftsForDate(day.date, shifts);
    const dateHeader = dayjs(day.date).format('D MMM ddd');
    dateHeaders.push(dateHeader);

    // Add empty cells for additional shifts
    for (let i = 1; i < filteredShifts.length; i++) {
      dateHeaders.push('');
    }

    if (filteredShifts.length === 0) {
      shiftHeaders.push(''); // Empty placeholder for days with no shifts
    } else {
      filteredShifts.forEach((shift) => {
        shiftHeaders.push(shift.name);
      });
    }
  });

  let csvContent = [];

  // First row: base headers and dates
  csvContent.push(
    [...baseHeaders, ...dateHeaders, includeRates ? 'Weekly Hrs & Cost' : 'Weekly Total Hrs'].join(
      ',',
    ),
  );

  // Second row: shift names
  csvContent.push(['', '', '', ...shiftHeaders, ''].join(','));

  // Employee rows (only for withShifts employees)
  withShifts.forEach((employee) => {
    let row = [employee.name, employee.id, employee.title];

    updatedShiftDays.forEach((day) => {
      const filteredShifts = getFilteredShiftsForDate(day.date, shifts);
      if (filteredShifts.length === 0) {
        row.push('-'); // Add a placeholder for days with no shifts
      } else {
        filteredShifts.forEach((shift) => {
          const employeeShift = day.shifts
            .find((s) => s.id === shift.id)
            ?.employees.find((e) => e.staff.id === employee.id);
          if (employeeShift) {
            if (employeeShift.isNotAvailable) {
              row.push('N/A');
            } else if (employeeShift.isEmployeeOnLeave) {
              const scheduledHours = calculateHours(
                employeeShift.start,
                employeeShift.end,
                employeeShift.breakStartTime,
                employeeShift.breakEndTime,
                employeeShift.isBreakPaid,
              );
              if (scheduledHours > 0) {
                // Paid leave
                const shiftCost = calculateTotalCost(
                  scheduledHours,
                  employee.shifts,
                  shift.id,
                  0,
                  true,
                );
                row.push(
                  `On leave (${scheduledHours.toFixed(1)} hrs${
                    includeRates ? ` / ${currencyCode}${shiftCost}` : ''
                  })`,
                );
              } else {
                // Unpaid leave
                row.push('On leave (Unpaid)');
              }
            } else if (employeeShift.title) {
              const shiftHours = calculateHours(
                employeeShift.start,
                employeeShift.end,
                employeeShift.breakStartTime,
                employeeShift.breakEndTime,
                employeeShift.isBreakPaid,
              );
              const breakDuration = calculateBreakDuration(
                employeeShift.breakStartTime,
                employeeShift.breakEndTime,
              );
              const shiftCost = calculateTotalCost(
                shiftHours,
                employee.shifts,
                shift.id,
                breakDuration,
                employeeShift.isBreakPaid,
              );
              row.push(
                `${employeeShift.title} (${shiftHours.toFixed(1)} hrs${
                  includeRates ? ` / ${currencyCode}${shiftCost}` : ''
                })`,
              );
            } else {
              row.push('-');
            }
          } else {
            row.push('-');
          }
        });
      }
    });

    const weeklyHours = totalHoursWeekly(employee.id, defaultShifts, currentWeek);
    const weeklyCost = calculateWeeklyCostForEmployee(employee, defaultShifts, currentWeek);
    row.push(`${weeklyHours}${includeRates ? ` / ${currencyCode}${weeklyCost.toFixed(2)}` : ''}`);

    csvContent.push(row.join(','));
  });

  // Daily totals
  let dailyTotals = [includeRates ? 'Daily Hrs & Cost' : 'Daily Total Hrs', '', ''];

  updatedShiftDays.forEach((day) => {
    const filteredShifts = getFilteredShiftsForDate(day.date, shifts);
    if (filteredShifts.length === 0) {
      dailyTotals.push('-');
    } else {
      filteredShifts.forEach((shift) => {
        const { hours, cost } = EmployeeHoursAndCostPerShift(day, shift.id);
        dailyTotals.push(`${hours} hrs${includeRates ? ` / ${currencyCode}${cost}` : ''}`);
      });
    }
  });

  // Calculate total weekly hours and cost for employees with shifts
  const totalWeeklyHours = withShifts.reduce((total, employee) => {
    const weeklyHours = parseFloat(totalHoursWeekly(employee.id, defaultShifts, currentWeek));
    return total + (isNaN(weeklyHours) ? 0 : weeklyHours);
  }, 0);

  const totalWeeklyCost = sumTotalWeeklyCost(withShifts, defaultShifts, currentWeek);
  dailyTotals.push(
    `${totalWeeklyHours.toFixed(1)} hrs${
      includeRates ? ` / ${currencyCode}${totalWeeklyCost.toFixed(2)}` : ''
    }`,
  );

  csvContent.push(dailyTotals.join(','));

  return csvContent.join('\n');
};

export const exportToCSV = (
  includeRates,
  updatedShiftDays,
  currentWeek,
  shifts,
  withShifts,
  defaultShifts,
  currencyCode,
) => {
  const csvContent = generateCSVContent(
    includeRates,
    updatedShiftDays,
    shifts,
    withShifts,
    defaultShifts,
    currentWeek,
    currencyCode,
  );
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `schedule_${dayjs(currentWeek).format('YYYY-MM-DD')}.csv`);
};
