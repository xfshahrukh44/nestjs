import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/userService';

export const getUser = createAsyncThunk(
    'user/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateUser = createAsyncThunk(
    'user/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    user: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.user,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getUser.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getUser.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.user = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateUser.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateUser.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = userSlice.actions;
export const user = (state) => state.user.user;
export const loading = (state) => state.user.loading;
export const errors = (state) => state.user.errors;
export const success = (state) => state.user.success;
export default userSlice.reducer;