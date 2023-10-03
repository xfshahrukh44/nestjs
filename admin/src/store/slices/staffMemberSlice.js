import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/staffMemberService';

export const getStaffMember = createAsyncThunk(
    'staffMember/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateStaffMember  = createAsyncThunk(
    'staffMember/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    staffMember: null
};

export const staffMemberSlice = createSlice({
    name: 'staffMember',
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
                    ...action.payload.staffMember,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getStaffMember.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getStaffMember.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.staffMember = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateStaffMember.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateStaffMember.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = staffMemberSlice.actions;
export const staffMember = (state) => state.staffMember.staffMember;
export const loading = (state) => state.staffMember.loading;
export const errors = (state) => state.staffMember.errors;
export const success = (state) => state.staffMember.success;
export default staffMemberSlice.reducer;