import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/faqService';

export const getFaq = createAsyncThunk(
    'faq/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateFaq = createAsyncThunk(
    'faq/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    faq: null
};

export const faqSlice = createSlice({
    name: 'faq',
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
                    ...action.payload.faq,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getFaq.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getFaq.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.faq = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateFaq.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateFaq.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = faqSlice.actions;
export const faq = (state) => state.faq.faq;
export const loading = (state) => state.faq.loading;
export const errors = (state) => state.faq.errors;
export const success = (state) => state.faq.success;
export default faqSlice.reducer;