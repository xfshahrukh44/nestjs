import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/eventService';

export const getEvents = createAsyncThunk(
    'events/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addEvent = createAsyncThunk(
    'events/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteEvent = createAsyncThunk(
    'events/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    events: [],
    total: 0,
};

export const eventsSlice = createSlice({
    name: 'events',
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

        builder.addCase(getEvents.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getEvents.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.events = data?.data ?? []
            state.total = data?.total ?? 0

            state.loading = false
            state.errors = message
        })

        builder.addCase(addEvent.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addEvent.fulfilled, (state, action) => {
            const {data, message} = action.payload

            console.log("save data", data, message)

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteEvent.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            const {data, message} = action.payload

            console.log("delete data", data, message)

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = eventsSlice.actions;
export const events = (state) => state.events.events;
export const loading = (state) => state.events.loading;
export const total = (state) => state.events.total;
export const errors = (state) => state.events.errors;
export const success = (state) => state.events.success;
export default eventsSlice.reducer;