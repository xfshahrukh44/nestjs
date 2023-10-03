import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/bookService';

export const getBooks = createAsyncThunk(
    'books/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addBook = createAsyncThunk(
    'books/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteBook = createAsyncThunk(
    'books/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)


const initialState = {
    success: false,
    loading: false,
    errors: null,
    books: [],
    total: 0,
    totalPages: 0,
};

export const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setBooksFetched: (state, {data, message}) => {
            state.books = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.books,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getBooks.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getBooks.fulfilled, (state, action) => {
            const {data, message} = action.payload

            booksSlice.caseReducers.setBooksFetched(state, {data, message})
        })

        builder.addCase(addBook.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addBook.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteBook.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteBook.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = booksSlice.actions;
export const books = (state) => state.books.books;
export const loading = (state) => state.books.loading;
export const total = (state) => state.books.total;
export const totalPages = (state) => state.books.totalPages;
export const errors = (state) => state.books.errors;
export const success = (state) => state.books.success;
export default booksSlice.reducer;