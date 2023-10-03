import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/postService';
import {show, update, markAsFeatured as serviceMarkAsFeatured} from "../../services/postService";

export const getPosts = createAsyncThunk(
    'posts/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addPost = createAsyncThunk(
    'posts/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deletePost = createAsyncThunk(
    'posts/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

export const getPost = createAsyncThunk(
    'posts/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updatePost = createAsyncThunk(
    'posts/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

export const markAsFeatured = createAsyncThunk(
    'posts/update',
    async (payload, thunkAPI) => {
        return await serviceMarkAsFeatured(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    posts: [],
    total: 0,
    totalPages: 0,
};

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setPostsFetched: (state, {data, message}) => {
            state.posts = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.posts,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getPosts.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getPosts.fulfilled, (state, action) => {
            const {data, message} = action.payload

            postsSlice.caseReducers.setPostsFetched(state, {data, message})
        })

        builder.addCase(addPost.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addPost.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deletePost.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deletePost.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = postsSlice.actions;
export const posts = (state) => state.posts.posts;
export const loading = (state) => state.posts.loading;
export const total = (state) => state.posts.total;
export const totalPages = (state) => state.posts.totalPages;
export const errors = (state) => state.posts.errors;
export const success = (state) => state.posts.success;
export default postsSlice.reducer;
