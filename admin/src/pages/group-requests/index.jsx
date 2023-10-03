import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getGroupRequests,
    loading as groupReqLoading,
    group_requests as groupReqList,
    total as groupReqTotal,
    totalPages as groupReqTotalPages,
    deleteGroupRequest, acceptGroupRequest
} from '../../store/slices/groupRequestsSlice'
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
import {IconButton, Pagination, Stack} from "@mui/material";
import {Delete} from 'mdi-material-ui'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

function GroupRequests(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(groupReqLoading)
    const group_requests = useSelector(groupReqList)
    const total = useSelector(groupReqTotal)
    const totalPages = useSelector(groupReqTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteGroupRequest({id}))
        await dispatch(getGroupRequests({page}))
    }

    const handleGroupRequest = async (e, id) => {
        e.preventDefault()
        await dispatch(acceptGroupRequest({id}))
        await dispatch(getGroupRequests({page}))
    }

    useEffect(() => {
        dispatch(getGroupRequests({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Group Requests
                </Typography>
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
                                            <TableCell>Group</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {group_requests.map(g_request => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={g_request.id}>
                                                    <TableCell>
                                                        <span>{g_request.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{`${g_request?.group?.name}`}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{`${g_request?.user?.first_name} ${g_request?.user?.last_name} (${g_request?.user?.email})`}</span>
                                                    </TableCell>
                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleGroupRequest(e, g_request.id)}
                                                            sx={{marginLeft: 'auto'}}>
                                                            <CheckCircleOutlineOutlinedIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, g_request.id)}
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

export default GroupRequests;
