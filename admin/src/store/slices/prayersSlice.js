import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/prayerService';
import {show, update} from "../../services/postService";
import {getBook, updateBook} from "./bookSlice";

export const getPrayers = createAsyncThunk(
    'prayer-requests/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

// export const addPost = createAsyncThunk(
//     'posts/add',
//     async (payload, thunkAPI) => {
//         return await create(payload)
//     }
// )

// export const deletePost = createAsyncThunk(
//     'posts/delete',
//     async (payload, thunkAPI) => {
//         return await destroy(payload)
//     }
// )

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
    prayers: [],
    total: 0,
    totalPages: 0,
};

export const prayersSlice = createSlice({
    name: 'prayers',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setPrayersFetched: (state, {data, message}) => {
            state.prayers = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.prayers,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getPrayers.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getPrayers.fulfilled, (state, action) => {
            const {data, message} = action.payload

            prayersSlice.caseReducers.setPrayersFetched(state, {data, message})
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




export const {setSuccess, setErrors} = prayersSlice.actions;
export const prayers = (state) => state.prayers.prayers;
export const loading = (state) => state.prayers.loading;
export const total = (state) => state.prayers.total;
export const totalPages = (state) => state.prayers.totalPages;
export const errors = (state) => state.prayers.errors;
export const success = (state) => state.prayers.success;
export default prayersSlice.reducer;