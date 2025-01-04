import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    departmentData: [],
    totalCost: 0,
    highestCostDepartment: '',
    totalHours: 0,
    averageHoursPerDepartment: 0,
    employeeData: {
        totalEmployees: 0,
        employeesAdded: 0,
        employeesLeft: 0,
        dailyChanges: []
    },
    attendanceData: {
        attendanceTrends: {
            currentMonth: {},
            previousMonth: {}
        }
    },
    frequentlyUnavailableEmployees: [],
    topEmployeesByHours: [],
    loading: false,
    error: null,
    todayTotalHours: 0,
    todayTotalCost: 0,
    todayTotalOnleaveEmployees: 0,
    todayTotalScheduledHours: 0.0,
    todayTotalScheduledCost: 0.0,
};

export const getDashboardData = createAsyncThunk(
    'dashboard/getDashboardData',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Dashboard/GetAllByDatePeriodAndCompanyId`;

        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("AutoBeatXToken")}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.DATA[0]; // Assuming the data is always in the first element of the DATA array
                state.departmentData = data.departmentData || [];
                state.totalCost = data.totalCost || 0;
                state.highestCostDepartment = data.highestCostDepartment || '';
                state.totalHours = data.totalHours || 0;
                state.averageHoursPerDepartment = data.averageHoursPerDepartment === "NaN" ? 0 : data.averageHoursPerDepartment;
                state.employeeData = data.employeeData || initialState.employeeData;
                state.attendanceData = data.attendanceData || initialState.attendanceData;
                state.todayTotalHours = data.todayTotalHours || 0.0;
                state.todayTotalCost = data.todayTotalCost || 0.0;
                state.todayTotalOnleaveEmployees = data.todayTotalOnleaveEmployees || 0;
                state.todayTotalScheduledHours = data.todayTotalScheduledHours || 0.0;
                state.todayTotalScheduledCost = data.todayTotalScheduledCost || 0.0;
                state.frequentlyUnavailableEmployees = data.frequentlyUnavailableEmployees.map(emp => ({ ...emp, image: `https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${emp.profileFileName}` }))
                state.topEmployeesByHours = data.topEmployeesByHours.map((emp) => ({ ...emp, image: `https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${emp.profileFileName}` }))
            })
            .addCase(getDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch dashboard data';
                state.dataAvailable = false;
            });
    },
});

export default dashboardSlice.reducer;