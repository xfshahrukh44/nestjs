import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getStaffMembers,
    loading as staffMembersLoading,
    staffMembers as staffMembersList,
    total as staffMemberTotal,
    totalPages as staffMemberTotalPages,
    deleteStaffMembers, deleteStaffMember
} from '../../store/slices/staffMembersSlice'
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
import {IconButton, Pagination, Stack, Tooltip} from "@mui/material";
import {Pencil, Delete} from 'mdi-material-ui'

function StaffMembers(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(staffMembersLoading)
    const staffMembers = useSelector(staffMembersList)
    const total = useSelector(staffMemberTotal)
    const totalPages = useSelector(staffMemberTotalPages)

    const [page, setPage] = useState(1)

    const truncate = (text, max) => text.length > max ? `${text.substring(0, max)}...` : text;

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteStaffMember({id}))
        await dispatch(getStaffMembers({page}))
    }

    useEffect(() => {
        dispatch(getStaffMembers({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Staff Members
                    </Typography>
                    <Button component={Link} href='/staff-members/create' sx={{marginLeft: 'auto'}}>
                        Create Staff Member
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
                                            <TableCell>description</TableCell>
                                            <TableCell className="text-center" width="150">Image</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {staffMembers.map(staffMember => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={staffMember.id}>
                                                    <TableCell>
                                                        <span>{staffMember.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{staffMember.name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title={staffMember.description}>
                                                            <span>{truncate(staffMember.description, 50)}</span>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                        {(staffMember.image !== null && staffMember.image !== 'null') ? (
                                                            <Button tag='a' href={staffMember.image} target="_blank"
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
                                                                push(`/staff-members/${staffMember.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, staffMember.id)}
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

export default StaffMembers;