import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getContacts,
    loading as contactsLoading,
    contacts as contactsList,
    total as contactTotal,
    deleteContact, totalPages as contactTotalPages
} from '../../store/slices/contactsSlice'
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
import {Pagination, Stack} from "@mui/material";

function Contacts(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    // const loading = useSelector(booksLoading)
    // const books = useSelector(booksList)
    // const total = useSelector(bookTotal)

    const loading = useSelector(contactsLoading)
    const contacts = useSelector(contactsList)
    const total = useSelector(contactTotal)
    const totalPages = useSelector(contactTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    useEffect(() => {
        dispatch(getContacts({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Contacts
                </Typography>
            </Grid>


            <Grid item xs={12}>
                <Card>
                    <Paper sx={{width: '100%', overflow: 'hidden'}}>
                        <TableContainer sx={{maxHeight: 440}}>
                            <Table stickyHeader aria-label='sticky table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell width="150">Name</TableCell>
                                        <TableCell className="text-center" width="150">Email</TableCell>
                                        <TableCell className="text-center" width="150">Phone</TableCell>
                                        <TableCell className="text-center" width="150">Company</TableCell>
                                        <TableCell className="text-center">Message</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contacts.map(contact => {
                                        return (
                                            <TableRow hover role='checkbox' tabIndex={-1} key={contact.id}>
                                                <TableCell>
                                                    <span>{contact.id}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{contact.name}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{contact.email}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{contact.phone}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{contact.company}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{contact.message}</span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack direction='row' sx={{my: 4, display: (loading ? 'none' : '')}} justifyContent='center'>
                            <Pagination count={totalPages} onChange={onPageChange}/>
                        </Stack>
                    </Paper>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Contacts;