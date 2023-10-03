import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getPrayers,
    loading as prayersLoading,
    prayers as prayersList,
    total as prayersTotal,
    totalPages as prayersTotalPages,
} from '../../store/slices/prayersSlice'
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
import {format, parse} from "date-fns";
//Additonal
// import {deletePost} from "../../store/slices/prayerssSlice";
// import {getPosts} from "../../store/slices/prayerssSlice";

function Prayers(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(prayersLoading)
    const prayers = useSelector(prayersList)
    const total = useSelector(prayersTotal)
    const totalPages = useSelector(prayersTotalPages)
console.log("prayer" , prayers)
    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        // console.log(id)
        // await dispatch(deletePost({id}))
        await dispatch(getPrayers({page}))
    }

    useEffect(() => {
        dispatch(getPrayers({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Prayer Requests
                    </Typography>
                    {/*<Button component={Link} href='/prayer-request/create' sx={{marginLeft: 'auto'}}>*/}
                    {/*    Create Post*/}
                    {/*</Button>*/}
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
                                            <TableCell>Email</TableCell>
                                            <TableCell>Contact</TableCell>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prayers.map(prayer => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={prayer.id}>
                                                    <TableCell>
                                                        <span>{prayer.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{prayer.name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{prayer.email}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{prayer.contact}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{prayer.time}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{prayer.description}</span>
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

export default Prayers;