import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getUsers,
    loading as usersLoading,
    users as usersList,
    total as usersTotal,
    totalPages as usersTotalPages,
    deleteUser
} from '../../store/slices/usersSlice'
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

function Announcements(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(usersLoading)
    const users = useSelector(usersList)
    const total = useSelector(usersTotal)
    const totalPages = useSelector(usersTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteUser({id}))
        await dispatch(getUsers({page}))
    }

    useEffect(() => {
        dispatch(getUsers({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Users
                    </Typography>
                    <Button component={Link} href='/users/create' sx={{marginLeft: 'auto'}}>
                        Create User
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
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Blocked at</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map(user => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={user.id}>
                                                    <TableCell>
                                                        <span>{user.id}</span>
                                                    </TableCell>
                                                    <TableCell width="200">
                                                        <span>{user.first_name} {user.last_name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{user.email}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{user.phone}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{user?.blocked_at ? moment(parseInt(user?.blocked_at)).format('H:m:s DD/MM/YYYY') : null}</span>
                                                    </TableCell>
                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/users/${user.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, user.id)}
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