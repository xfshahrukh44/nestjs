import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/faqService';

export const getFaqs = createAsyncThunk(
    'faqs/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addFaq = createAsyncThunk(
    'faqs/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteFaq = createAsyncThunk(
    'faqs/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)


const initialState = {
    success: false,
    loading: false,
    errors: null,
    faqs: [],
    total: 0,
    totalPages: 0,
};

export const faqsSlice = createSlice({
    name: 'faqs',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setFaqsFetched: (state, {data, message}) => {
            state.faqs = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.faqs,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getFaqs.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getFaqs.fulfilled, (state, action) => {
            const {data, message} = action.payload

            faqsSlice.caseReducers.setFaqsFetched(state, {data, message})
        })

        builder.addCase(addFaq.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addFaq.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteFaq.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteFaq.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = faqsSlice.actions;
export const faqs = (state) => state.faqs.faqs;
export const loading = (state) => state.faqs.loading;
export const total = (state) => state.faqs.total;
export const totalPages = (state) => state.faqs.totalPages;
export const errors = (state) => state.faqs.errors;
export const success = (state) => state.faqs.success;
export default faqsSlice.reducer;