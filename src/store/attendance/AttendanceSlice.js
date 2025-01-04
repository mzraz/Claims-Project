// AttendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    features: [],
    attendanceList: [],
    employeeList: [],
    firmBranches: [],
    newAttendances: [],
    loading: false,
    error: null,
};

export const getAttendanceFeatures = createAsyncThunk(
    'leave/getAttendanceFeatures',
    async (credentials, { rejectWithValue }) => {
        let formData = new FormData();
        formData.append("groupId", 104);

        const url = `${BASE_URL}${SUB_API_NAME}/UsersFeatures/GetAllByGroupIdAndUser`;

        try {
            const response = await axios.post(url, formData, {
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

export const getEmployees = createAsyncThunk(
    'attendance/getEmployees',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Attendances/GetUsersDropdownByFirm`;

        try {
            const response = await axios.post(url, null, {
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

export const verifyEmployeeFingerprint = createAsyncThunk(
    'attendance/verifyEmployeeFingerprint',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesFingerprints/verify`;

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

export const updateEmployeeAttendance = createAsyncThunk(
    'attendance/updateEmployeeAttendance',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesAttendence/Update`;

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
export const deleteEmployeeAttendance = createAsyncThunk(
    'attendance/deleteEmployeeAttendance',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesAttendence/Delete`;

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

export const saveNewAttendance = createAsyncThunk(
    'attendance/saveNewAttendance',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesAttendence/Save`;

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

export const getUserFirmBranches = createAsyncThunk(
    'attendance/getUserFirmBranches',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Attendances/GetUserFirmBranchesByUserIdAndFirm`;

        try {
            const response = await axios.post(url, credentials, {
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

export const getAllAttendances = createAsyncThunk(
    'attendance/getAllAttendances',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesAttendence/GetAllByCompanyIdAndDatePeriod`;
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

export const getAllMonthlyAttendances = createAsyncThunk(
    'attendance/getAllMonthlyAttendances',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesAttendence/GetAllDateWiseAttendenceByCompanyIdAndDatePeriod`;
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

export const getAttendanceById = createAsyncThunk(
    'attendance/getAttendanceById',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesAttendence/GetAllByEmployeeIdAndDatePeriod`;

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

export const saveManualAttendance = createAsyncThunk(
    'attendance/saveManualAttendance',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Attendances/SaveManual`;

        try {
            const response = await axios.post(url, credentials, {
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

export const deleteById = createAsyncThunk(
    'attendance/deleteById',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Attendances/DeleteByIdAndFirm`;

        try {
            const response = await axios.post(url, credentials, {
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

const AttendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        addNewAttendance: (state, action) => {
            state.newAttendances = [...state.newAttendances, action.payload];
        },
        resetAttendance: (state) => {
            state.newAttendances = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAttendanceFeatures.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAttendanceFeatures.fulfilled, (state, action) => {
            state.features = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAttendanceFeatures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getEmployees.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getEmployees.fulfilled, (state, action) => {
            state.employeeList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getEmployees.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getUserFirmBranches.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getUserFirmBranches.fulfilled, (state, action) => {
            state.firmBranches = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getUserFirmBranches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getAllAttendances.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllAttendances.fulfilled, (state, action) => {
            state.attendanceList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAllAttendances.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

export const { addNewAttendance, resetAttendance } = AttendanceSlice.actions;

export default AttendanceSlice.reducer;
