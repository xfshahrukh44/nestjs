import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/eventService';

export const getEvent = createAsyncThunk(
    'event/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateEvent = createAsyncThunk(
    'event/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    event: null
};

export const eventSlice = createSlice({
    name: 'event',
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
                    ...action.payload.event,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getEvent.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getEvent.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.event = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateEvent.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = eventSlice.actions;
export const event = (state) => state.event.event;
export const loading = (state) => state.event.loading;
export const errors = (state) => state.event.errors;
export const success = (state) => state.event.success;
export default eventSlice.reducer;