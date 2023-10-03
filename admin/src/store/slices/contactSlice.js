import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {update, show} from '../../services/contactService';

export const getContact = createAsyncThunk(
    'contact/get',
    async ({id}, thunkAPI) => {
        return await show(id)
    }
)

export const updateContact = createAsyncThunk(
    'contact/update',
    async (payload, thunkAPI) => {
        return await update(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    contact: null
};

export const contactSlice = createSlice({
    name: 'contact',
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
                    ...action.payload.contact,
                };
            },
        },
    },
    extraReducers: builder => {

        builder.addCase(getContact.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getContact.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.contact = data?.data ?? null

            state.loading = false
            state.errors = message
        })

        builder.addCase(updateContact.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(updateContact.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = contactSlice.actions;
export const contact = (state) => state.contact.contact;
export const loading = (state) => state.contact.loading;
export const errors = (state) => state.contact.errors;
export const success = (state) => state.contact.success;
export default contactSlice.reducer;