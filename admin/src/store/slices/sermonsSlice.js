import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/sermonService';
import {show, update} from "../../services/postService";

export const getSermons = createAsyncThunk(
    'sermons/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addSermon = createAsyncThunk(
    'sermons/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteSermon = createAsyncThunk(
    'sermons/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

export const getPost = createAsyncThunk(
    'sermons/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updatePost = createAsyncThunk(
    'sermons/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    sermons: [],
    total: 0,
    totalPages: 0,
};

export const sermonsSlice = createSlice({
    name: 'sermons',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setPostsFetched: (state, {data, message}) => {
            state.sermons = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.sermons,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getSermons.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getSermons.fulfilled, (state, action) => {
            const {data, message} = action.payload

            sermonsSlice.caseReducers.setPostsFetched(state, {data, message})
        })

        builder.addCase(addSermon.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addSermon.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteSermon.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteSermon.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = sermonsSlice.actions;
export const sermons = (state) => state.sermons.sermons;
export const loading = (state) => state.sermons.loading;
export const total = (state) => state.sermons.total;
export const totalPages = (state) => state.sermons.totalPages;
export const errors = (state) => state.sermons.errors;
export const success = (state) => state.sermons.success;
export default sermonsSlice.reducer;