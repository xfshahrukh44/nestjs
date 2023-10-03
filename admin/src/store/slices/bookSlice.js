import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/bookService';

export const getBook = createAsyncThunk(
    'book/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateBook = createAsyncThunk(
    'book/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    book: null
};

export const bookSlice = createSlice({
    name: 'book',
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
                    ...action.payload.book,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getBook.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getBook.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.book = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateBook.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateBook.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = bookSlice.actions;
export const book = (state) => state.book.book;
export const loading = (state) => state.book.loading;
export const errors = (state) => state.book.errors;
export const success = (state) => state.book.success;
export default bookSlice.reducer;