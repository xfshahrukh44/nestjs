import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show, get, showTranslation} from '../../services/quotationService';

export const getQuotation = createAsyncThunk(
    'quotation/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const getQuotationNameArabicTranslation = createAsyncThunk(
    'quotation/translation/get',
    async ({module_id, language_id, key}, thunkAPI) => {
        return await showTranslation(module_id, language_id, key)
    }
)

export const updateQuotation = createAsyncThunk(
    'quotation/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

export const getQuotations = createAsyncThunk(
    'quotations/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    quotation: null,

};

export const quotationSlice = createSlice({
    name: 'quotation',
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
                    ...action.payload.quotation,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getQuotation.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getQuotation.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.quotation = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateQuotation.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateQuotation.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = quotationSlice.actions;
export const quotation = (state) => state.quotation.quotation;
export const loading = (state) => state.quotation.loading;
export const errors = (state) => state.quotation.errors;
export const success = (state) => state.quotation.success;
export default quotationSlice.reducer;
