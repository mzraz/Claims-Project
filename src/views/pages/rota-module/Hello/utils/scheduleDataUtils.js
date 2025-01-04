// utils/scheduleDataUtils.js
import dayjs from 'dayjs';
import { getAllShiftsByCompanyId } from '../../../../../store/rota/RotaSlice';

export const transformBackendDate = (dateArray) => {
  if (!dateArray) return null;
  const [year, month, day] = dateArray;
  return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
};

export const transformBackendTime = (timeArray) => {
  if (!timeArray) return null;
  const [hours, minutes] = timeArray;
  return dayjs().hour(hours).minute(minutes).format('HH:mm');
};

export const normalizeShiftTemplates = (backendShift, index) => ({
  id: backendShift.id,
  name: backendShift.name,
  colorIndex: index,
  startDate: transformBackendDate(backendShift.startDate),
  endDate: transformBackendDate(backendShift.endDate),
  startTime: transformBackendTime(backendShift.startTime),
  endTime: transformBackendTime(backendShift.endTime),
  breakStartTime: transformBackendTime(backendShift.breakStartTime),
  breakEndTime: transformBackendTime(backendShift.breakEndTime),
  isBreakPaid: backendShift.isBreakPaid === 1,
});
export const normalizeEmployeeShift = (shiftDetail, shiftId, employeeDetails) => {
  const employee = employeeDetails?.find((emp) => emp.employeeId === shiftDetail.employeeId);
  console.log(employee);

  return {
    id: shiftDetail.id,
    shiftId: shiftId,
    employeeId: shiftDetail.employeeId,
    employeeName: employee?.employeeName,
    employeeDesignation: employee?.employeeDesignation,
    baseRatePerHour: employee?.baseRatePerHour,
    date: dayjs(shiftDetail.start).format('YYYY-MM-DD'),
    startTime: dayjs(shiftDetail.start).format('HH:mm'),
    endTime: dayjs(shiftDetail.end).format('HH:mm'),
    breakStartTime: transformBackendTime(shiftDetail.breakStartTime),
    breakEndTime: transformBackendTime(shiftDetail.breakEndTime),
    isBreakPaid: shiftDetail.isBreakPaid === 1,
    isNotAvailable: shiftDetail.isNotAvailable === 1,
    isOnLeave: shiftDetail.isEmployeeOnLeave === 1,
    isUnpaidLeave: shiftDetail.isEmployeeOnUnpaidLeave === 1,
    hourlyRate: shiftDetail.hourlyRate,
  };
};

export const fetchScheduleData = async (dispatch, firmId) => {
  const formData = new FormData();
  formData.append('companyId', firmId);

  const result = await dispatch(getAllShiftsByCompanyId(formData)).unwrap();
  if (result) {
    const shiftTemplates = result.DATA.map((shift, index) => normalizeShiftTemplates(shift, index));

    const employeeShifts = result.DATA.flatMap((shift) =>
      shift.shiftDetail.map((detail) => {
        return normalizeEmployeeShift(detail, shift.id, shift.shiftEmployeeDetail);
      }),
    );
    console.log(employeeShifts);
    return {
      shiftTemplates,
      employeeShifts,
    };
  }

  throw new Error(result.message || 'Failed to fetch schedule data');
};

// For sending data back to backend
export const formatShiftForBackend = (shiftData) => {
  const formData = new FormData();

  // Convert times back to arrays
  const startTime = dayjs(shiftData.startTime, 'HH:mm');
  const endTime = dayjs(shiftData.endTime, 'HH:mm');

  formData.append('shiftEmployeeId', shiftData.id);
  formData.append('startTime', JSON.stringify([startTime.hour(), startTime.minute()]));
  formData.append('endTime', JSON.stringify([endTime.hour(), endTime.minute()]));

  if (shiftData.breakStartTime && shiftData.breakEndTime) {
    const breakStart = dayjs(shiftData.breakStartTime, 'HH:mm');
    const breakEnd = dayjs(shiftData.breakEndTime, 'HH:mm');

    formData.append('breakStartTime', JSON.stringify([breakStart.hour(), breakStart.minute()]));
    formData.append('breakEndTime', JSON.stringify([breakEnd.hour(), breakEnd.minute()]));
  }

  formData.append('isBreakPaid', shiftData.isBreakPaid ? 1 : 0);

  return formData;
};
