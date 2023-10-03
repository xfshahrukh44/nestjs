import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/postService';
import {showTranslation} from "../../services/postService";

export const getPost = createAsyncThunk(
    'post/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const getPostTitleArabicTranslation = createAsyncThunk(
    'post/translation/get',
    async ({module_id, language_id, key}, thunkAPI) => {
        return await showTranslation(module_id, language_id, key)
    }
)

export const getPostDescriptionArabicTranslation = createAsyncThunk(
    'post/translation/get',
    async ({module_id, language_id, key}, thunkAPI) => {
        return await showTranslation(module_id, language_id, key)
    }
)

export const updatePost = createAsyncThunk(
    'post/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    post: null
};

export const postSlice = createSlice({
    name: 'post',
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
                    ...action.payload.post,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getPost.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getPost.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.post = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updatePost.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updatePost.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = postSlice.actions;
export const post = (state) => state.post.post;
export const loading = (state) => state.post.loading;
export const errors = (state) => state.post.errors;
export const success = (state) => state.post.success;
export default postSlice.reducer;
