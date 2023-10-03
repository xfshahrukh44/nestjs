import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get, getAllCategory} from '../../services/categoryService';

export const getCategories = createAsyncThunk(
    'categories/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const getAllCategories = createAsyncThunk(
    'categories/all/get',
    async ({page = 1}, thunkAPI) => {
        return await getAllCategory(page)
    }
)

export const addCategory = createAsyncThunk(
    'categories/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)


const initialState = {
    success: false,
    loading: false,
    errors: null,
    categories: [],
    total: 0,
    totalPages: 0,
};

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setCategoriesFetched: (state, {data, message}) => {
            state.categories = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.categories,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getCategories.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getCategories.fulfilled, (state, action) => {
            const {data, message} = action.payload

            categoriesSlice.caseReducers.setCategoriesFetched(state, {data, message})
        })

        builder.addCase(getAllCategories.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getAllCategories.fulfilled, (state, action) => {
            const {data, message} = action.payload

            categoriesSlice.caseReducers.setCategoriesFetched(state, {data, message})
        })

        builder.addCase(addCategory.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addCategory.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteCategory.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = categoriesSlice.actions;
export const categories = (state) => state.categories.categories;
export const allCategories = (state) => state.categories.categories;
export const loading = (state) => state.categories.loading;
export const total = (state) => state.categories.total;
export const totalPages = (state) => state.categories.totalPages;
export const errors = (state) => state.categories.errors;
export const success = (state) => state.categories.success;
export default categoriesSlice.reducer;