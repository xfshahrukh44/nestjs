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
    totalPages: 0,
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
        setBooksFetched: (state, {data, message}) => {
            state.events = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.events,
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

            eventsSlice.caseReducers.setBooksFetched(state, {data, message})
        })

        builder.addCase(addEvent.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addEvent.fulfilled, (state, action) => {
            const {data, message} = action.payload

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

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = eventsSlice.actions;
export const events = (state) => state.events.events;
export const loading = (state) => state.events.loading;
export const total = (state) => state.events.total;
export const totalPages = (state) => state.events.totalPages;
export const errors = (state) => state.events.errors;
export const success = (state) => state.events.success;
export default eventsSlice.reducer;