import React, {forwardRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    addAnnouncement,
    loading as AnnLoading,
    errors as AnnErrors,
    success as AnnSuccess,
    setSuccess, setErrors
} from '../../store/slices/announcementsSlice'
import {useRouter} from "next/navigation";
import Grid from "@mui/material/Grid";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import DatePicker from "react-datepicker";
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import moment from "moment";

export const CustomDateInput = forwardRef((props, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} label='Date' autoComplete='off'/>
})

function Create(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(AnnLoading)
    const errors = useSelector(AnnErrors)
    const success = useSelector(AnnSuccess)

    const [successMsg, setSuccessMessage] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Announcement added successfully!')
            setTimeout(() => {
                push('/announcements')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        dispatch(addAnnouncement({
            title, description, date: moment(date).format('DD-MM-YYYY')
        }))

    }

    return (
        <DatePickerWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Typography variant='h5'>
                        Create Announcement
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            {successMsg ? (
                                <Alert severity="success" sx={{mb: 4}}>
                                    <AlertTitle>Success</AlertTitle>
                                    <Box component='strong' sx={{display: 'block'}}>{successMsg}</Box>
                                </Alert>
                            ) : null}
                            {errors && errors.length > 0 ? (
                                <Alert severity="error" sx={{mb: 4}}>
                                    <AlertTitle>Errors</AlertTitle>
                                    {errors.map((item, ind) => (
                                        <Box component='strong' sx={{display: 'block'}} key={ind}>{item}</Box>
                                    ))}
                                </Alert>
                            ) : null}
                            <form onSubmit={handleSubmit}>
                                <Grid row>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label='Title' value={title}
                                                   onChange={e => setTitle(e.target.value)}/>
                                    </Grid>
                                    <Grid item xs={12} sx={{mt: 5}}>
                                        <TextField fullWidth label='Description' value={description}
                                                   multiline
                                                   maxRows={4}
                                                   onChange={e => setDescription(e.target.value)}/>
                                    </Grid>
                                    <Grid item xs={12} sx={{mt: 5}}>
                                        <DatePicker
                                            selected={date}
                                            showYearDropdown
                                            showMonthDropdown
                                            placeholderText='MM-DD-YYYY'
                                            todayButton={"Current Date"}
                                            includeDates={[new Date()]}
                                            customInput={<CustomDateInput/>}
                                            id='form-layouts-separator-date'
                                            onChange={date => setDate(date)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={{mt: 5}}>
                                        <Button type='submit' variant='contained' disabled={loading}>
                                            {loading ? 'Saving' : 'Save'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DatePickerWrapper>
    );
}

export default Create;