import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import CallAPI from '../../services/CallAPI';
import CallAuthAPI from '../../services/CallAuthAPI';

const initialState = {
    isAuthenticated: null,
    profile: null,
    isLoad: false,
    error: '',
}

// First, create the thunk
export const login = createAsyncThunk('user/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await CallAPI('/user/login', 'post', userData);
        localStorage.setItem('access_token', response.data.token);
        return response.data;
    } catch (err) {
        let error = err // cast the error for access
        if (!error.response) {
            throw err
        }
        // We got validation errors, let's return those so we can reference in our component and set form errors
        return rejectWithValue(error.response.data)
    }
});

export const getMyProfile = createAsyncThunk('user/getMyProfile', async (userData, { rejectWithValue }) => {
    try {
        const response = await CallAuthAPI('/user/profile', 'get', {});
        return response.data;
    } catch (err) {
        let error = err // cast the error for access
        if (!error.response) {
            throw err
        }
        // We got validation errors, let's return those so we can reference in our component and set form errors
        return rejectWithValue(error.response.data)
    }
});

export const updateProfile = createAsyncThunk('user/edit', async (userData, { rejectWithValue }) => {
    try {
        const response = await CallAuthAPI('/user/edit-profile', 'put', userData);
        return response.data;
    } catch (err) {
        let error = err // cast the error for access
        if (!error.response) {
            throw err
        }
        // We got validation errors, let's return those so we can reference in our component and set form errors
        return rejectWithValue(error.response.data)
    }
});

// Then, handle actions in your reducers:
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
        },
    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        //--------------------------------------------------------login
        [login.pending]: state => {
            state.isLoad = true;
            state.error = '';
        },
        [login.rejected]: (state, action) => {
            if (action.payload) {
                // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, the payload will be available here.
                state.error = action.payload.err;
            } else {
                state.error = action.error.message;
            }
            state.isLoad = false;
        },
        [login.fulfilled]: (state, action) => {
            state.isLoad = false;
            state.error = '';
            state.isAuthenticated = true;
        },
        //--------------------------------------------------------get profile
        [getMyProfile.pending]: state => {
            state.isLoad = true;
        },
        [getMyProfile.rejected]: (state, action) => {
            if (action.payload) {
                // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, the payload will be available here.
                state.error = action.payload.err;
            } else {
                state.error = action.error.message;
            }
            state.isLoad = false;
        },
        [getMyProfile.fulfilled]: (state, action) => {
            state.isLoad = false;
            state.error = '';
            state.isAuthenticated = true;
            state.profile = action.payload;
        },
        //--------------------------------------------------------update profile
        [updateProfile.pending]: state => {
            state.isLoad = true;
        },
        [updateProfile.rejected]: (state, action) => {
            if (action.payload) {
                // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, the payload will be available here.
                state.error = action.payload.err;
            } else {
                state.error = action.error.message;
            }
            state.isLoad = false;
        },
        [updateProfile.fulfilled]: (state, action) => {
            state.isLoad = false;
            state.error = '';
            state.profile = action.payload;
        },
    }
})

// Action creators are generated for each case reducer function
export const { logout } = userSlice.actions

export default userSlice.reducer