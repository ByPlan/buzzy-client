import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import groupService from '../../services/group.service';

export const createGroup = createAsyncThunk(
  'group/create',
  async ({userId, name, description}, thunkAPI) => {
    try {
      const response = await groupService.createGroup(
        userId,
        name,
        description,
      );
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      console.log(error);
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);
export const joinGroup = createAsyncThunk(
  'group/join',
  async ({userId, groupCode}, thunkAPI) => {
    try {
      const response = await groupService.joinGroup(userId, groupCode);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      console.log(error);
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);
export const findByGroup = createAsyncThunk(
  'group/findUsers',
  async ({userId, groupId}, thunkAPI) => {
    try {
      const response = await groupService.findByGroup(userId, groupId);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      console.log(error);
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);
export const readMeetings = createAsyncThunk(
  'group/readMeetings',
  async ({userId, groupId, month}, thunkAPI) => {
    try {
      const response = await groupService.readMeetings(userId, groupId, month);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      console.log(error);
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);
export const findItems = createAsyncThunk(
  'group/findItems',
  async ({userId, groupId}, thunkAPI) => {
    try {
      const response = await groupService.findItems(userId, groupId);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      console.log(error);
      const message =
        (error.response && error.response.data && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);

const initialState = {isLoggedIn: false, user: null, groupArray: null};
const groupSlice = createSlice({
  name: 'group',
  initialState,
  extraReducers: {
    [createGroup.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.groupArray = action.payload.groupArray;
    },
  },
});
const {reducer} = groupSlice;
export default reducer;
