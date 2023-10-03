import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/quotationService';

export const getQuotations = createAsyncThunk(
    'quotations/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addQuotation = createAsyncThunk(
    'quotations/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteQuotation = createAsyncThunk(
    'quotations/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)


export const getQuotation = createAsyncThunk(
    'quotation/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)


const initialState = {
    success: false,
    loading: false,
    errors: null,
    quotations: [],
    total: 0,
    totalPages: 0,
};

export const quotationsSlice = createSlice({
    name: 'quotations',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setQuotationsFetched: (state, {data, message}) => {
            state.quotations = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.quotations,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getQuotations.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getQuotations.fulfilled, (state, action) => {
            const {data, message} = action.payload

            quotationsSlice.caseReducers.setQuotationsFetched(state, {data, message})
        })

        builder.addCase(addQuotation.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addQuotation.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteQuotation.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteQuotation.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = quotationsSlice.actions;
export const quotations = (state) => state.quotations.quotations;
export const loading = (state) => state.quotations.loading;
export const total = (state) => state.quotations.total;
export const totalPages = (state) => state.quotations.totalPages;
export const errors = (state) => state.quotations.errors;
export const success = (state) => state.quotations.success;
export default quotationsSlice.reducer;
