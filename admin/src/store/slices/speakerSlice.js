import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/speakerService';

export const getSpeaker = createAsyncThunk(
    'speaker/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateSpeaker = createAsyncThunk(
    'speaker/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    speaker: null
};

export const speakerSlice = createSlice({
    name: 'speaker',
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
                    ...action.payload.speaker,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getSpeaker.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getSpeaker.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.speaker = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateSpeaker.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateSpeaker.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = speakerSlice.actions;
export const speaker = (state) => state.speaker.speaker;
export const loading = (state) => state.speaker.loading;
export const errors = (state) => state.speaker.errors;
export const success = (state) => state.speaker.success;
export default speakerSlice.reducer;