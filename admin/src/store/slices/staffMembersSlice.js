import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/staffMemberService';

export const getStaffMembers= createAsyncThunk(
    'staffMembers/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addStaffMember = createAsyncThunk(
    'staffMembers/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteStaffMember= createAsyncThunk(
    'staffMembers/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    staffMembers: [],
    total: 0,
    totalPages: 0,
};

export const staffMembersSlice = createSlice({
    name: 'staffMembers',
    initialState,
    reducers: {
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setErrors: (state, {payload}) => {
            state.errors = payload
        },
        setStaffMembersFetched: (state, {data, message}) => {
            state.staffMembers = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.staffMembers,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getStaffMembers.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getStaffMembers.fulfilled, (state, action) => {
            const {data, message} = action.payload

            staffMembersSlice.caseReducers.setStaffMembersFetched(state, {data, message})
        })

        builder.addCase(addStaffMember.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addStaffMember.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteStaffMember.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteStaffMember.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            // state.success = !message
            // state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = staffMembersSlice.actions;
export const staffMembers = (state) => state.staffMembers.staffMembers;
export const loading = (state) => state.staffMembers.loading;
export const total = (state) => state.staffMembers.total;
export const totalPages = (state) => state.staffMembers.totalPages;
export const errors = (state) => state.staffMembers.errors;
export const success = (state) => state.staffMembers.success;
export default staffMembersSlice.reducer;