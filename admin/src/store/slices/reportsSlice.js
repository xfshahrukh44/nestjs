import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {destroy, acceptReport as accept, get} from '../../services/reportService';

export const getReports = createAsyncThunk(
    'reports/get',
    async ({page = 1, type}, thunkAPI) => {
        return await get({page, type})
    }
)

export const deleteReport = createAsyncThunk(
    'reports/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

export const acceptReport = createAsyncThunk(
    'reports/accept',
    async (payload, thunkAPI) => {
        return await accept(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    reports: [],
    total: 0,
    totalPages: 0,
};

export const reportsSlice = createSlice({
    name: 'reports',
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
                    ...action.payload.reports,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getReports.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getReports.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.reports = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        })

        builder.addCase(deleteReport.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteReport.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })

        builder.addCase(acceptReport.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(acceptReport.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = reportsSlice.actions;
export const reports = (state) => state.reports.reports;
export const loading = (state) => state.reports.loading;
export const total = (state) => state.reports.total;
export const totalPages = (state) => state.reports.totalPages;
export const errors = (state) => state.reports.errors;
export const success = (state) => state.reports.success;
export default reportsSlice.reducer;