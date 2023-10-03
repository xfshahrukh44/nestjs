import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/categoryMenuService';

export const getCategoryMenus = createAsyncThunk(
    'categoryMenus/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)


const initialState = {
    success: false,
    loading: false,
    errors: null,
    categoryMenus: [],
    total: 0,
    totalPages: 0,
};

export const categoryMenusSlice = createSlice({
    name: 'categoryMenus',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setCategoryMenusFetched: (state, {data, message}) => {
            state.categoryMenus = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.categoryMenus,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getCategoryMenus.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getCategoryMenus.fulfilled, (state, action) => {
            const {data, message} = action.payload

            categoryMenusSlice.caseReducers.setCategoryMenusFetched(state, {data, message})
        })

        // builder.addCase(addCategory.pending, (state, action) => {
        //     state.loading = true
        //     state.success = false
        //     state.errors = null
        // })
        // builder.addCase(addCategory.fulfilled, (state, action) => {
        //     const {data, message} = action.payload
        //
        //     state.loading = false
        //     state.success = !message
        //     state.errors = message
        // })

        // builder.addCase(deleteCategory.pending, (state, action) => {
        //     state.loading = true
        //     state.success = false
        //     state.errors = null
        // })
        // builder.addCase(deleteCategory.fulfilled, (state, action) => {
        //     const {data, message} = action.payload
        //
        //     state.loading = false
        //     // state.success = !message
        //     // state.errors = message
        // })
    }
});

export const {setSuccess, setErrors} = categoryMenusSlice.actions;
export const categoryMenus = (state) => state.categoryMenus.categoryMenus;
export const loading = (state) => state.categoryMenus.loading;
export const total = (state) => state.categoryMenus.total;
export const totalPages = (state) => state.categoryMenus.totalPages;
export const errors = (state) => state.categoryMenus.errors;
export const success = (state) => state.categoryMenus.success;
export default categoryMenusSlice.reducer;