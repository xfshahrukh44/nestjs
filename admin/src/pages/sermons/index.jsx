import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getSermons,
    loading as sermonsLoading,
    sermons as sermonsList,
    total as sermonsTotal,
    totalPages as sermonsTotalPages,
    deleteSermon
} from '../../store/slices/sermonsSlice'
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
// import {deletePost} from "../../store/slices/sermonssSlice";
// import {getPosts} from "../../store/slices/prayerssSlice";

function Sermons(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(sermonsLoading)
    const sermons = useSelector(sermonsList)
    const total = useSelector(sermonsTotal)
    const totalPages = useSelector(sermonsTotalPages)
console.log("sermonss" , sermons)
    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        console.log(id)
        await dispatch(deleteSermon({id}))
        await dispatch(getSermons({page}))
    }

    useEffect(() => {
        dispatch(getSermons({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Sermons
                    </Typography>
                    <Button component={Link} href='/sermons/create' sx={{marginLeft: 'auto'}}>
                        Create Sermon
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
                                            <TableCell>Url</TableCell>
                                            <TableCell>Media</TableCell>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sermons.map(sermon => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={sermon.id}>
                                                    <TableCell>
                                                        <span>{sermon.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{sermon.title}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{sermon.description ?? ''}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{sermon.url}</span>
                                                    </TableCell >
                                                    {/*<TableCell>*/}
                                                    {/*    <span>{sermon.media}</span>*/}
                                                    {/*</TableCell>*/}
                                                    {/*<TableCell>*/}
                                                    {/*    <span>{sermon.image}</span>*/}
                                                    {/*</TableCell>*/}

                                                    <TableCell className="text-center">
                                                        {(sermon.media !== null && sermon.media !== 'null') ? (
                                                            <Button tag='a' href={sermon.media} target="_blank"
                                                                    layout="link"
                                                                    size="small">
                                                                View Image
                                                            </Button>
                                                        ) : null}
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                        {(sermon.image !== null && sermon.image !== 'null') ? (
                                                            <Button tag='a' href={sermon.image} target="_blank"
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
                                                                push(`/sermons/${sermon.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, sermon.id)}
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

export default Sermons;