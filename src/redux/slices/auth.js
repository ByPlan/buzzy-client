import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import authService from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = createAsyncThunk(
  'auth/register',
  async ({name, email, password1, password2}, thunkAPI) => {
    try {
      const response = await authService.register(
        name,
        email,
        password1,
        password2,
      );
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);
export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}, thunkAPI) => {
    try {
      const data = await authService.login(email, password);
      return {user: data};
    } catch (error) {
      const message =
        (error.response && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

export const loadUserData = createAsyncThunk(
  'auth/loadUserData',
  async thunkAPI => {
    try {
      const jsonUserData = await authService.loadUserData();
      return {user: jsonUserData};
    } catch (error) {
      const message =
        (error.response && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);

const initialState = {isLoggedIn: false, user: null};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [loadUserData.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [loadUserData.pending]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [loadUserData.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});
const {reducer} = authSlice;
export default reducer;
