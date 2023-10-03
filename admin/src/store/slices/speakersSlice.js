import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/speakerService';
import {show, update} from "../../services/speakerService";

export const getSpeakers = createAsyncThunk(
    'speakers/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addSpeaker = createAsyncThunk(
    'speakers/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteSpeaker = createAsyncThunk(
    'speakers/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

// export const getPost = createAsyncThunk(
//     'speakers/get',
//     async ({id}, thunkAPI) => {
//         return await show(id)
//     }
// )
//
// export const updatePost = createAsyncThunk(
//     'speakers/update',
//     async (payload, thunkAPI) => {
//         return await update(payload)
//     }
// )

const initialState = {
    success: false,
    loading: false,
    errors: null,
    speakers: [],
    total: 0,
    totalPages: 0,
};

export const speakersSlice = createSlice({
    name: 'speakers',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setPostsFetched: (state, {data, message}) => {
            state.speakers = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.speakers,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getSpeakers.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getSpeakers.fulfilled, (state, action) => {
            const {data, message} = action.payload

            speakersSlice.caseReducers.setPostsFetched(state, {data, message})
        })

        builder.addCase(addSpeaker.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addSpeaker.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteSpeaker.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteSpeaker.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = speakersSlice.actions;
export const speakers = (state) => state.speakers.speakers;
export const loading = (state) => state.speakers.loading;
export const total = (state) => state.speakers.total;
export const totalPages = (state) => state.speakers.totalPages;
export const errors = (state) => state.speakers.errors;
export const success = (state) => state.speakers.success;
export default speakersSlice.reducer;