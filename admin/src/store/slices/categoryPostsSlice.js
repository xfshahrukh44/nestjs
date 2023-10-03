import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {get} from '../../services/categoryPostService';
import {show, update} from "../../services/categoryPostService";

export const getCategoryPosts = createAsyncThunk(
    'categoryPosts/get',
    async ({id}, thunkAPI) => {
        console.log(id);
        return await get(id)
    }
)
//
// export const addPost = createAsyncThunk(
//     'posts/add',
//     async (payload, thunkAPI) => {
//         return await create(payload)
//     }
// )
//
// export const deletePost = createAsyncThunk(
//     'posts/delete',
//     async (payload, thunkAPI) => {
//         return await destroy(payload)
//     }
// )
//
// export const getPost = createAsyncThunk(
//     'posts/get',
//     async ({id}, thunkAPI) => {
//         return await show(id)
//     }
// )
//
// export const updatePost = createAsyncThunk(
//     'posts/update',
//     async (payload, thunkAPI) => {
//         return await update(payload)
//     }
// )

const initialState = {
    success: false,
    loading: false,
    errors: null,
    categoryPosts: [],
    total: 0,
    totalPages: 0,
};

export const categoryPostsSlice = createSlice({
    name: 'categoryPosts',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setPostsFetched: (state, {data, message}) => {
            state.categoryPosts = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.categoryPosts,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getCategoryPosts.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getCategoryPosts.fulfilled, (state, action) => {
            const {data, message} = action.payload

            categoryPostsSlice.caseReducers.setPostsFetched(state, {data, message})
        })

        // builder.addCase(addPost.pending, (state, action) => {
        //     state.loading = true
        //     state.success = false
        //     state.errors = null
        // })
        // builder.addCase(addPost.fulfilled, (state, action) => {
        //     const {data, message} = action.payload
        //
        //     state.loading = false
        //     state.success = !message
        //     state.errors = message
        // })
        //
        // builder.addCase(deletePost.pending, (state, action) => {
        //     state.loading = true
        //     state.success = false
        //     state.errors = null
        // })
        // builder.addCase(deletePost.fulfilled, (state, action) => {
        //     const {data, message} = action.payload
        //
        //     state.loading = false
        //     state.success = !message
        //     state.errors = message
        // })
    }
});

export const {setSuccess, setErrors} = categoryPostsSlice.actions;
export const categoryPosts = (state) => state.categoryPosts.categoryPosts;
export const loading = (state) => state.categoryPosts.loading;
export const total = (state) => state.categoryPosts.total;
export const totalPages = (state) => state.categoryPosts.totalPages;
export const errors = (state) => state.categoryPosts.errors;
export const success = (state) => state.categoryPosts.success;
export default categoryPostsSlice.reducer;