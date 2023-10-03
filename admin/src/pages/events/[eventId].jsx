import React, {forwardRef, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getEvent,
    event as eventDetail,
    loading as eventLoading,
    errors as eventErrors,
    success as eventSuccess, updateEvent, setErrors, setSuccess
} from "../../store/slices/EventSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import moment from "moment";
export const CustomDateInput = forwardRef((props, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} label='Date' autoComplete='off'/>
})

function Event(props) {
    const {push, query} = useRouter()
    const {eventId} = query

    const dispatch = useDispatch()

    const event = useSelector(eventDetail)
    const loading = useSelector(eventLoading)
    const errors = useSelector(eventErrors)
    const success = useSelector(eventSuccess)

    const [successMsg, setSuccessMessage] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date_to, setDate_to] = useState('')
    const [date_from, setDate_from] = useState('')
    const [start_time, setStart_time] = useState('')
    const [end_time, setEnd_time] = useState('')
    const [location, setLocation] = useState('')
    const [image, setImage] = useState('')

    useEffect(() => {
        if (eventId) {
            dispatch(getEvent({id: eventId}))
        }
    }, [eventId])

    useEffect(() => {
        if (event) {
            setTitle(event.title)
            setDescription(event.description)
            setDate_to(event.date_to)
            setDate_from(event.date_from)
            setStart_time(event.start_time)
            setEnd_time(event.end_time)
            setLocation(event.location)
            setImage(event.image)
        }
    }, [event])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Event updated successfully!')
            setTimeout(() => {
                push('/events').then((r) => 'error')
            }, 500)
        }
    }, [success, loading])

    const formatDate = (date) => moment(date, 'YYYY-MM-DDTHH:mm').format('MM/DD/YYYY, hh:mm A')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        // if (!fileValidation()) return;

        dispatch(updateEvent({
            id: eventId,
            title, description, date_to ,date_from, start_time, end_time, location , image
        }))

    }

    const fileValidation = () => {
        let _errors = []
        if (title === null) {
            _errors.push("Title is required!")
        }
        if (description === null) {
            _errors.push("Description is required!")
        }

        if (date_to === null) {
            _errors.push("Date 1 is required!")
        }
        if (date_from === null) {
            _errors.push("Date 2 is required!")
        }
        if (location === null) {
            _errors.push("Location is required!")
        }
        if (image === null) {
            _errors.push("Image is required!")
        }

        if (_errors.length > 0) {
            dispatch(setErrors(_errors))
        }

        return _errors.length < 1
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Edit Event
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
                        ) : ''}
                        {errors && errors.length > 0 ? (
                            <Alert severity="error" sx={{mb: 4}}>
                                <AlertTitle>Errors</AlertTitle>
                                {errors.map((item, ind) => (
                                    <Box component='strong' sx={{display: 'block'}} key={ind}>{item}</Box>
                                ))}
                            </Alert>
                        ) : ''}
                        <form onSubmit={handleSubmit}>
                            <Grid container className="my-4">
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Title' value={title}
                                               onChange={e => setTitle(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 5}}>
                                    <TextField fullWidth label='description' value={description}
                                               onChange={e => setDescription(e.target.value)}/>
                                </Grid>

                                <Grid item xs={12} sx={{mt: 5}}>
                                    <TextField fullWidth type="text"
                                               label='Date To'
                                               value={date_to}
                                               onFocus={e => {
                                                   e.target.type = 'date'
                                               }}
                                               onBlur={e => {
                                                   e.target.type = 'text'
                                               }}
                                               onChange={e => setDate_to(e.target.value)}/>
                                </Grid>

                                <Grid item xs={12} sx={{mt: 5}}>
                                    <TextField fullWidth type="text"
                                               label='Date From'
                                               value={date_from}
                                               onFocus={e => {
                                                   e.target.type = 'date'
                                               }}
                                               onBlur={e => {
                                                   e.target.type = 'text'
                                               }}
                                               onChange={e => setDate_from(e.target.value)}/>
                                </Grid>

                                <Grid item xs={12} sx={{mt: 5}}>
                                    <TextField fullWidth label='Start Time' type="text"
                                               onFocus={e => {
                                                   e.target.type = 'time'
                                               }}
                                               onBlur={e => {
                                                   e.target.type = 'text'
                                               }}
                                               value={start_time}
                                               onChange={e => setStart_time(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 5}}>
                                    <TextField fullWidth label='End Time' type="text"
                                               onFocus={e => {
                                                   e.target.type = 'time'
                                               }}
                                               onBlur={e => {
                                                   e.target.type = 'text'
                                               }}
                                               value={end_time}
                                               onChange={e => setEnd_time(e.target.value)}/>
                                </Grid>

                                <Grid item xs={12} sx={{mt: 5}}>
                                    <TextField fullWidth label='location' value={location}
                                               onChange={e => setLocation(e.target.value)}/>
                                </Grid>


                                <Grid item xs={12} sx={{mt: 5}}>
                                    <Stack direction="row" gap={2}>

                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload Image

                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => {
                                                    setImage(e.target?.files[0] ?? '')
                                                }}
                                            />

                                        </Button>
                                    </Stack>
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
    );
}

export default Event;