import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/userService';

export const getUsers = createAsyncThunk(
    'users/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addUser = createAsyncThunk(
    'users/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    users: [],
    total: 0,
    totalPages: 0,
};

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setBooksFetched: (state, {data, message}) => {
            state.users = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.users,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getUsers.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getUsers.fulfilled, (state, action) => {
            const {data, message} = action.payload

            usersSlice.caseReducers.setBooksFetched(state, {data, message})
        })

        builder.addCase(addUser.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addUser.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteUser.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = usersSlice.actions;
export const users = (state) => state.users.users;
export const loading = (state) => state.users.loading;
export const total = (state) => state.users.total;
export const totalPages = (state) => state.users.totalPages;
export const errors = (state) => state.users.errors;
export const success = (state) => state.users.success;
export default usersSlice.reducer;