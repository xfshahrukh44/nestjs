import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, accept, destroy, get} from '../../services/groupRequestService';

export const getGroupRequests = createAsyncThunk(
    'group_requests/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addGroupRequest = createAsyncThunk(
    'group_requests/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteGroupRequest = createAsyncThunk(
    'group_requests/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

export const acceptGroupRequest = createAsyncThunk(
    'group_requests/accept',
    async (payload, thunkAPI) => {
        return await accept(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    group_requests: [],
    total: 0,
    totalPages: 0,
};

export const groupRequestsSlice = createSlice({
    name: 'group_requests',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setBooksFetched: (state, {data, message}) => {
            state.group_requests = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.group_requests,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getGroupRequests.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getGroupRequests.fulfilled, (state, action) => {
            const {data, message} = action.payload

            groupRequestsSlice.caseReducers.setBooksFetched(state, {data, message})
        })

        builder.addCase(addGroupRequest.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addGroupRequest.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteGroupRequest.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteGroupRequest.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })

        builder.addCase(acceptGroupRequest.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(acceptGroupRequest.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = groupRequestsSlice.actions;
export const group_requests = (state) => state.group_requests.group_requests;
export const loading = (state) => state.group_requests.loading;
export const total = (state) => state.group_requests.total;
export const totalPages = (state) => state.group_requests.totalPages;
export const errors = (state) => state.group_requests.errors;
export const success = (state) => state.group_requests.success;
export default groupRequestsSlice.reducer;