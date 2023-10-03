import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getQuotations,
    loading as quotationsLoading,
    quotations as quotationsList,
    total as quotationTotal,
    totalPages as quotationTotalPages,
    deleteQuotation
} from '../../store/slices/quotationsSlice'
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

function Quotations(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(quotationsLoading)
    const quotations = useSelector(quotationsList)
    const total = useSelector(quotationTotal)
    const totalPages = useSelector(quotationTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteQuotation({id}))
        await dispatch(getQuotations({page}))
    }



    useEffect(() => {
        dispatch(getQuotations({page}))
    }, [page])

    // Assuming you have a selector to get the 'data' array from the Redux store
    const data = useSelector((state) => state.quotations.data);

    // Function to get the parent quotation name based on parent_id
    const getParentName = (parentId) => {
        const parentQuotation = quotations.find((quotation) => quotation.id === parentId);
        return parentQuotation ? parentQuotation.name : 'N/A';
    };

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Quotations
                    </Typography>
                    <Button component={Link} href='/quotations/create' sx={{marginLeft: 'auto'}}>
                        Create Quotations
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
                                            <TableCell>Author</TableCell>
                                            <TableCell>Audio</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {quotations.map(quotation => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={quotation.id}>
                                                    <TableCell>
                                                        <span>{quotation.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{quotation.title}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{quotation.description}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{quotation.author}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {quotation.audio && (
                                                            <audio controls>
                                                                <source src={quotation.audio} type="audio/mpeg" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        )}
                                                    </TableCell>

                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/quotations/${quotation.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, quotation.id)}
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

export default Quotations;
