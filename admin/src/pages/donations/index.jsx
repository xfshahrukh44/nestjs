import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getDonations,
    loading as donationLoading,
    donations as donationList,
    total as donationTotal,
    totalPages as donationTotalPages
} from '../../store/slices/donationsSlice'
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

function Donations(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(donationLoading)
    const donations = useSelector(donationList)
    const total = useSelector(donationTotal)
    const totalPages = useSelector(donationTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    useEffect(() => {
        dispatch(getDonations({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Announcements
                    </Typography>
                    <Button component={Link} href='/donations/create' sx={{marginLeft: 'auto'}}>
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
                                            <TableCell>amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {donations.map(donation => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={donation.id}>
                                                    <TableCell>
                                                        <span>{donation.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{donation.amount}</span>
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

export default Donations;