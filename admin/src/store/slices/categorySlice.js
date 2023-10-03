import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show, get, showTranslation} from '../../services/categoryService';

export const getCategory = createAsyncThunk(
    'category/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const getCategoryNameArabicTranslation = createAsyncThunk(
    'category/translation/get',
    async ({module_id, language_id, key}, thunkAPI) => {
        return await showTranslation(module_id, language_id, key)
    }
)

export const updateCategory = createAsyncThunk(
    'category/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

export const getCategories = createAsyncThunk(
    'categories/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    category: null,

};

export const categorySlice = createSlice({
    name: 'category',
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
                    ...action.payload.category,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getCategory.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getCategory.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.category = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateCategory.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateCategory.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = categorySlice.actions;
export const category = (state) => state.category.category;
export const loading = (state) => state.category.loading;
export const errors = (state) => state.category.errors;
export const success = (state) => state.category.success;
export default categorySlice.reducer;
