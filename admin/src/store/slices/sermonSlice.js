import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/sermonService';

export const getSermon = createAsyncThunk(
    'sermon/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateSermon = createAsyncThunk(
    'sermon/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    sermon: null
};

export const sermonSlice = createSlice({
    name: 'sermon',
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
                    ...action.payload.sermon,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getSermon.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getSermon.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.sermon = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateSermon.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateSermon.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = sermonSlice.actions;
export const sermon = (state) => state.sermon.sermon;
export const loading = (state) => state.sermon.loading;
export const errors = (state) => state.sermon.errors;
export const success = (state) => state.sermon.success;
export default sermonSlice.reducer;