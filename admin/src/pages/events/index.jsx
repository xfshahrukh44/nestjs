import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getEvents,
    loading as eventLoading,
    events as eventList,
    total as eventTotal,
    totalPages as eventTotalPages,
    deleteEvent
} from '../../store/slices/eventsSlice'
import Link from "next/link";
import {useRouter} from "next/navigation";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {IconButton, Pagination, Stack} from "@mui/material";
import {Pencil, Delete} from 'mdi-material-ui'
import moment from "moment";

function Events(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(eventLoading)
    const events = useSelector(eventList)
    const total = useSelector(eventTotal)
    const totalPages = useSelector(eventTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteEvent({id}))
        await dispatch(getEvents({page}))
    }

    const formatDate = (date) => moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
    const formatTime = (time) => moment(time, 'Th:mm a').format('h:mm a')
    console.log('formatTime', formatTime);

    useEffect(() => {
        dispatch(getEvents({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Events
                    </Typography>
                    <Button component={Link} href='/events/create' sx={{marginLeft: 'auto'}}>
                        Create Event
                    </Button>
                </Stack>
            </Grid>


            <Grid item xs={12}>
                <Card>
                    <Paper sx={{width: '100%', overflow: 'hidden'}}>
                        {loading ? <Typography variant='h5' sx={{my: 3}} textAlign='center'>Loading...</Typography> : (
                            <TableContainer sx={{maxHeight: 440}}>
                                <Table stickyHeader aria-label='sticky table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell width='120'>Date To</TableCell>
                                            <TableCell width='120'>Date From</TableCell>
                                            <TableCell width='120'>Start Time</TableCell>
                                            <TableCell width='120'>End Time</TableCell>
                                            <TableCell>Location</TableCell>
                                            <TableCell>Image</TableCell>
                                            <TableCell width='150'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {events.map(event => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={event.id}>
                                                    <TableCell>
                                                        <span>{event.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{event.title}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{event.description}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{formatDate(event.date_to)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{formatDate(event.date_from)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{formatTime(event.start_time)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{formatTime(event.end_time)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{event.location}</span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {(event.image !== null && event.image !== 'null') ? (
                                                            <Button tag='a' href={event.image} target="_blank"
                                                                    layout="link"
                                                                    size="small" sx={{textAlign: 'center'}}>
                                                                View Image
                                                            </Button>
                                                        ) : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/events/${event.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, event.id)}
                                                            sx={{marginLeft: 'auto'}}>
                                                            <Delete/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        <Stack direction='row' sx={{my: 4, display: (loading ? 'none' : '')}} justifyContent='center'>
                            <Pagination count={totalPages} onChange={onPageChange}/>
                        </Stack>
                    </Paper>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Events;