import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getSpeakers,
    loading as speakersLoading,
    speakers as speakersList,
    total as speakersTotal,
    totalPages as speakersTotalPages,
    deleteSpeaker
} from '../../store/slices/speakersSlice'
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
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {IconButton, Pagination, Stack} from "@mui/material";
import {Pencil, Delete} from 'mdi-material-ui'
import {log} from "next/dist/server/typescript/utils";
//Additonal
// import {deletePost} from "../../store/slices/speakerssSlice";
// import {getPosts} from "../../store/slices/prayerssSlice";

function Speakers(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(speakersLoading)
    const speakers = useSelector(speakersList)
    const total = useSelector(speakersTotal)
    const totalPages = useSelector(speakersTotalPages)
console.log("speakerss" , speakers)
    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        console.log(id)
        await dispatch(deleteSpeaker({id}))
        await dispatch(getSpeakers({page}))
    }

    useEffect(() => {
        dispatch(getSpeakers({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Speakers
                    </Typography>
                    <Button component={Link} href='/speakers/create' sx={{marginLeft: 'auto'}}>
                        Create Speaker
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
                                            <TableCell>Name</TableCell>
                                            <TableCell>Designation</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {speakers.map(speaker => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={speaker.id}>
                                                    <TableCell>
                                                        <span>{speaker.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{speaker.name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{speaker.designation}</span>
                                                    </TableCell >
                                                    <TableCell>
                                                        <span>{speaker.description}</span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {(speaker.image !== null && speaker.image !== 'null') ? (
                                                            <Button tag='a' href={speaker.image} target="_blank"
                                                                    layout="link"
                                                                    size="small">
                                                                View Image
                                                            </Button>
                                                        ) : null}
                                                    </TableCell>

                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/speakers/${speaker.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, speaker.id)}
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

export default Speakers;