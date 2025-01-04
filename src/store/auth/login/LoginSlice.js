import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';
import { current } from '@reduxjs/toolkit';
import { getCompany, getCurrencyById } from '../../admin/FirmSlice';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

// Define your initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Define the login API request thunk
// LoginSlice.js

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const urlToken = `${BASE_URL}/csrf-token`;
    const urlLogin = `${BASE_URL}/login`;

    try {
      // const tokenResponse = await axios.get(urlToken);
      // const userToken = tokenResponse.data.csrf_token;
      const userToken = 'asdasd23123asdasdaweqweqwe';
      if (userToken) {
        // localStorage.setItem('AutoBeatXToken', userToken);
        localStorage.setItem('AutoBeatXToken', 'asdasd23123asdasdaweqweqwe');

        // const loginResponse = await axios.post(urlLogin, credentials, {
        //   headers: {
        //     'X-CSRF-TOKEN': userToken,
        //     'Content-Type': 'application/json',
        //   },
        // });

        // const userData = loginResponse.user;

        const basicUserData = {
          // ...userData,
          firstName: 'Zeshan',
          lastname: 'Raza',
          phoneNumber: 'asdasdasd',
          profileFileName: 'abc',
          firmId: 48,
        };
        localStorage.setItem('AutoBeatXData', JSON.stringify(basicUserData));

        return { SUCCESS: 1, DATA: basicUserData };
      } else {
        return rejectWithValue('Failed to fetch CSRF token.');
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.USER_MESSAGE || 'Something went wrong.');
    }
  },
);

export const sendResetLink = createAsyncThunk(
  'auth/resetLink',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Users/ResetPasswordRequest`;

    try {
      const response = await axios.post(url, null, { params: { email: credentials.email } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (data, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Users/ResetPassword`;

    try {
      const response = await axios.post(url, data);
      const result = response.data;
      console.log(result);
      return result;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);

// Create the auth slice
const LoginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUserOnLoad: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    updateUserData: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('AutoBeatXData', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('AutoBeatXData');
      localStorage.removeItem('AutoBeatXToken');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.DATA;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to login';
    });
  },
});

// Extract the action creators
export const { authenticateUserOnLoad, logout, updateUserData } = LoginSlice.actions;

// Extract the reducer
export default LoginSlice.reducer;
