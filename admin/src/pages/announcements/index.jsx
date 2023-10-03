import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getAnnouncements,
    loading as annLoading,
    announcements as annList,
    total as annTotal,
    totalPages as annTotalPages,
    deleteAnnouncement
} from '../../store/slices/announcementsSlice'
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

function Announcements(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(annLoading)
    const announcements = useSelector(annList)
    const total = useSelector(annTotal)
    const totalPages = useSelector(annTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteAnnouncement({id}))
        await dispatch(getAnnouncements({page}))
    }

    useEffect(() => {
        dispatch(getAnnouncements({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Announcements
                    </Typography>
                    <Button component={Link} href='/announcements/create' sx={{marginLeft: 'auto'}}>
                        Create Announcement
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
                                            <TableCell>Date</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {announcements.map(announcement => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={announcement.id}>
                                                    <TableCell>
                                                        <span>{announcement.id}</span>
                                                    </TableCell>
                                                    <TableCell width="200">
                                                        <span>{announcement.date}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{announcement.title}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{announcement.description}</span>
                                                    </TableCell>
                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/announcements/${announcement.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, announcement.id)}
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

export default Announcements;