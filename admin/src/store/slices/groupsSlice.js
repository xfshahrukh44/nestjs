import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/groupService';

export const getGroups = createAsyncThunk(
    'groups/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addGroup = createAsyncThunk(
    'groups/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteGroup = createAsyncThunk(
    'groups/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    groups: [],
    total: 0,
    totalPages: 0,
};

export const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setBooksFetched: (state, {data, message}) => {
            state.groups = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.groups,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getGroups.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getGroups.fulfilled, (state, action) => {
            const {data, message} = action.payload

            groupsSlice.caseReducers.setBooksFetched(state, {data, message})
        })

        builder.addCase(addGroup.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addGroup.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteGroup.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteGroup.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = groupsSlice.actions;
export const groups = (state) => state.groups.groups;
export const loading = (state) => state.groups.loading;
export const total = (state) => state.groups.total;
export const totalPages = (state) => state.groups.totalPages;
export const errors = (state) => state.groups.errors;
export const success = (state) => state.groups.success;
export default groupsSlice.reducer;