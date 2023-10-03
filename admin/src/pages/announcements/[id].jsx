import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getAnnouncement,
    announcement as annDetail,
    loading as annLoading,
    errors as annErrors,
    success as annSuccess, updateAnnouncement, setErrors, setSuccess
} from "../../store/slices/announcementSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "../../@core/styles/libs/react-datepicker";
import {CustomDateInput} from "./create";

import 'react-datepicker/dist/react-datepicker.css'
import moment from "moment";

function Announcement(props) {
    const {push, query} = useRouter()
    const {id} = query

    const dispatch = useDispatch()

    const announcement = useSelector(annDetail)
    const loading = useSelector(annLoading)
    const errors = useSelector(annErrors)
    const success = useSelector(annSuccess)

    const [successMsg, setSuccessMessage] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')

    useEffect(() => {
        if (id) {
            dispatch(getAnnouncement({id}))
        }
    }, [id])

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title)
            setDescription(announcement.description)
            const _date = moment(announcement.date, 'DD-MM-YYYY')
            if (_date.isValid()) {
                setDate(_date.toDate())
            }
        }
    }, [announcement])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Announcement updated successfully!')
            setTimeout(() => {
                push('/announcements')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        dispatch(updateAnnouncement({
            id,
            title, description, date: moment(date).format('DD-MM-YYYY')
        }))

    }

    return (
        <DatePickerWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Typography variant='h5'>
                        Edit Announcement
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
                                            includeDates={[new Date(), date]}
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

export default Announcement;