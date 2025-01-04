// LeaveSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    features: [],
    userList: [],
    leaveTypes: [],
    allLeavesData: [],
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

export const getAllLeavesByCompanyId = createAsyncThunk(
    'leave/getAllLeavesByCompanyId',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyLeaves/GetAllByCompanyId`;
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

export const getAllUsersByFirm = createAsyncThunk(
    'leave/getAllUsersByFirm',
    async (credentials, { rejectWithValue }) => {
        const url = `${'http://35.179.98.1:8081'}/${'AMS'}/Attendances/GetUsersDropdownByFirm`;
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

export const saveLeaveData = createAsyncThunk(
    'leave/saveLeaveData',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyLeaves/Save`;
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

export const getLeaveById = createAsyncThunk(
    'leave/getLeaveById',
    async (credentials, { rejectWithValue }) => {
        const url = `${'http://35.179.98.1:8081'}/${'AMS'}/Leaves/GetByIdAndFirm`;
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
    'leave/deleteById',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyLeaves/Delete`;
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

// New async thunks for the 5 new APIs

export const saveCompanyEmployeeLeave = createAsyncThunk(
    'leave/saveCompanyEmployeeLeave',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeeLeaves/Save`;
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

export const deleteCompanyEmployeeLeave = createAsyncThunk(
    'leave/deleteCompanyEmployeeLeave',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeeLeaves/Delete`;
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

export const getCompanyEmployeeLeaveById = createAsyncThunk(
    'leave/getCompanyEmployeeLeaveById',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeeLeaves/GetById`;
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

export const getAllCompanyEmployeeLeavesByCompanyId = createAsyncThunk(
    'leave/getAllCompanyEmployeeLeavesByCompanyId',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeeLeaves/GetAllByCompanyId`;
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

export const getPendingLeaveQuotaByCompanyId = createAsyncThunk(
    'leave/getPendingLeaveQuotaByCompanyId',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeeLeaves/GetPenidingLeaveQuotaByCompanyId`;
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

const LeaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllUsersByFirm.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllUsersByFirm.fulfilled, (state, action) => {
            state.userList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAllUsersByFirm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

export default LeaveSlice.reducer;