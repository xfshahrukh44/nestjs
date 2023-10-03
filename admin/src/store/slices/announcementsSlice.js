import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/announcementService';

export const getAnnouncements = createAsyncThunk(
    'announcements/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addAnnouncement = createAsyncThunk(
    'announcements/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteAnnouncement = createAsyncThunk(
    'announcements/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    announcements: [],
    total: 0,
    totalPages: 0,
};

export const announcementsSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setBooksFetched: (state, {data, message}) => {
            state.announcements = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.announcements,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getAnnouncements.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getAnnouncements.fulfilled, (state, action) => {
            const {data, message} = action.payload

            announcementsSlice.caseReducers.setBooksFetched(state, {data, message})
        })

        builder.addCase(addAnnouncement.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addAnnouncement.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteAnnouncement.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteAnnouncement.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = announcementsSlice.actions;
export const announcements = (state) => state.announcements.announcements;
export const loading = (state) => state.announcements.loading;
export const total = (state) => state.announcements.total;
export const totalPages = (state) => state.announcements.totalPages;
export const errors = (state) => state.announcements.errors;
export const success = (state) => state.announcements.success;
export default announcementsSlice.reducer;