import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/groupService';

export const getGroup = createAsyncThunk(
    'group/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateGroup = createAsyncThunk(
    'group/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    group: null
};

export const groupSlice = createSlice({
    name: 'group',
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
                    ...action.payload.group,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getGroup.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getGroup.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.group = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateGroup.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateGroup.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = groupSlice.actions;
export const group = (state) => state.group.group;
export const loading = (state) => state.group.loading;
export const errors = (state) => state.group.errors;
export const success = (state) => state.group.success;
export default groupSlice.reducer;