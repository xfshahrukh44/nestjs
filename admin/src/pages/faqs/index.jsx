import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getFaqs,
    loading as faqsLoading,
    faqs as faqsList,
    total as faqTotal,
    totalPages as faqTotalPages,
    deleteFaq
} from '../../store/slices/faqsSlice'
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

function Faqs(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(faqsLoading)
    const faqs = useSelector(faqsList)
    const total = useSelector(faqTotal)
    const totalPages = useSelector(faqTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteFaq({id}))
        await dispatch(getFaqs({page}))
    }

    useEffect(() => {
        dispatch(getFaqs({page}))
    }, [page])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        All FAQ'S
                    </Typography>
                    <Button component={Link} href='/faqs/create' sx={{marginLeft: 'auto'}}>
                        Create Faq
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
                                            <TableCell>Question</TableCell>
                                            <TableCell>Question Arabic</TableCell>
                                            {/*<TableCell>Description</TableCell>*/}
                                            <TableCell>Answer</TableCell>
                                            <TableCell>Answer Arabic</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {faqs.map(faq => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={faq.id}>
                                                    <TableCell>
                                                        <span>{faq.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{faq.question}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{faq.question_ar}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{faq.answer}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{faq.answer_ar}</span>
                                                    </TableCell>

                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/faqs/${faq.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, faq.id)}
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

export default Faqs;
