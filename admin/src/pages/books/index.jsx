import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getBooks,
    loading as booksLoading,
    books as booksList,
    total as bookTotal,
    totalPages as bookTotalPages,
    deleteBook
} from '../../store/slices/booksSlice'
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

function Books(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(booksLoading)
    const books = useSelector(booksList)
    const total = useSelector(bookTotal)
    const totalPages = useSelector(bookTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteBook({id}))
        await dispatch(getBooks({page}))
    }

    useEffect(() => {
        dispatch(getBooks({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Books
                    </Typography>
                    <Button component={Link} href='/books/create' sx={{marginLeft: 'auto'}}>
                        Create Book
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
                                            {/*<TableCell>Description</TableCell>*/}
                                            <TableCell className="text-center" width="150">Link</TableCell>
                                            <TableCell className="text-center" width="150">File</TableCell>
                                            <TableCell className="text-center" width="150">Image</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {books.map(book => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={book.id}>
                                                    <TableCell>
                                                        <span>{book.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{book.title}</span>
                                                    </TableCell>
                                                    {/*<TableCell>
                                                        <span>{book.description}</span>
                                                    </TableCell>*/}
                                                    <TableCell className="text-center">
                                                        {(book?.url && book.url.length > 0) ? (
                                                            <Button tag='a' href={book.url} target="_blank"
                                                                    layout="link"
                                                                    size="small">
                                                                View URL
                                                            </Button>
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {(book.file !== null && book.file !== 'null') ? (
                                                            <Button tag='a' href={book.file} target="_blank"
                                                                    layout="link"
                                                                    size="small">
                                                                View File
                                                            </Button>
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {(book.image !== null && book.image !== 'null') ? (
                                                            <Button tag='a' href={book.image} target="_blank"
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
                                                                push(`/books/${book.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, book.id)}
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

export default Books;