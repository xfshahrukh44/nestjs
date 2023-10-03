import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {create, destroy, get} from '../../services/contactService';

export const getContacts = createAsyncThunk(
    'contacts/get',
    async ({page = 1}, thunkAPI) => {
        return await get(page)
    }
)

export const addContact = createAsyncThunk(
    'contacts/add',
    async (payload, thunkAPI) => {
        return await create(payload)
    }
)

export const deleteContact = createAsyncThunk(
    'contacts/delete',
    async (payload, thunkAPI) => {
        return await destroy(payload)
    }
)

const initialState = {
    success: false,
    loading: false,
    errors: null,
    contacts: [],
    total: 0,
    totalPages: 0,
};

export const contactsSlice = createSlice({
    name: 'contacts',
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

        builder.addCase(getContacts.pending, (state, action) => {
            state.loading = true
            state.errors = null
        })
        builder.addCase(getContacts.fulfilled, (state, action) => {
            const {data, message} = action.payload

            state.contacts = data?.data ?? []
            state.total = data?.total ?? 0
            state.totalPages = data?.totalPages ?? 0

            state.loading = false
            state.errors = message
        })

        builder.addCase(addContact.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(addContact.fulfilled, (state, action) => {
            const {data, message} = action.payload

            console.log("save data", data, message)

            state.loading = false
            state.success = !message
            state.errors = message
        })

        builder.addCase(deleteContact.pending, (state, action) => {
            state.loading = true
            state.success = false
            state.errors = null
        })
        builder.addCase(deleteContact.fulfilled, (state, action) => {
            const {data, message} = action.payload

            console.log("delete data", data, message)

            state.loading = false
            state.success = !message
            state.errors = message
        })
    }
});

export const {setSuccess, setErrors} = contactsSlice.actions;
export const contacts = (state) => state.contacts.contacts;
export const loading = (state) => state.contacts.loading;
export const total = (state) => state.contacts.total;
export const totalPages = (state) => state.contacts.totalPages;
export const errors = (state) => state.contacts.errors;
export const success = (state) => state.contacts.success;
export default contactsSlice.reducer;