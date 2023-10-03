import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/announcementService';

export const getAnnouncement = createAsyncThunk(
    'announcement/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateAnnouncement = createAsyncThunk(
    'announcement/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    announcement: null
};

export const announcementSlice = createSlice({
    name: 'announcement',
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
                    ...action.payload.announcement,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getAnnouncement.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getAnnouncement.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.announcement = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateAnnouncement.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateAnnouncement.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = announcementSlice.actions;
export const announcement = (state) => state?.announcement?.announcement;
export const loading = (state) => state?.announcement?.loading;
export const errors = (state) => state?.announcement?.errors;

export const success = (state) => state?.announcement?.success;
export default announcementSlice.reducer;