import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/donationService';

export const getDonations = createAsyncThunk(
    'donations/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addDonation = createAsyncThunk(
    'donations/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteDonation = createAsyncThunk(
    'donations/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    donations: [],
    total: 0,
    totalPages: 0,
};

export const donationsSlice = createSlice({
    name: 'donations',
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
                    ...action.payload.donations,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getDonations.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getDonations.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.donations = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        })

        builder.addCase(addDonation.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addDonation.fulfilled, (state, action) => {
            const {data, message} = action.payload

            console.log("save data", data, message)

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteDonation.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteDonation.fulfilled, (state, action) => {
            const {data, message} = action.payload

            console.log("delete data", data, message)

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = donationsSlice.actions;
export const donations = (state) => state.donations.donations;
export const loading = (state) => state.donations.loading;
export const total = (state) => state.donations.total;
export const totalPages = (state) => state.donations.totalPages;
export const errors = (state) => state.donations.errors;
export const success = (state) => state.donations.success;
export default donationsSlice.reducer;