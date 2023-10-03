import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getCategories,
    loading as categoriesLoading,
    categories as categoriesList,
    total as categoryTotal,
    totalPages as categoryTotalPages,
    deleteCategory
} from '../../store/slices/categoriesSlice'
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

function Categories(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(categoriesLoading)
    const categories = useSelector(categoriesList)
    const total = useSelector(categoryTotal)
    const totalPages = useSelector(categoryTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        await dispatch(deleteCategory({id}))
        await dispatch(getCategories({page}))
    }



    useEffect(() => {
        dispatch(getCategories({page}))
    }, [page])

    // Assuming you have a selector to get the 'data' array from the Redux store
    const data = useSelector((state) => state.categories.data);

    // Function to get the parent category name based on parent_id
    const getParentName = (parentId) => {
        const parentCategory = categories.find((category) => category.id === parentId);
        return parentCategory ? parentCategory.name : 'N/A';
    };

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Categories
                    </Typography>
                    <Button component={Link} href='/categories/create' sx={{marginLeft: 'auto'}}>
                        Create Categories
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
                                            {/*<TableCell>Description</TableCell>*/}
                                            <TableCell className="text-center" width="150">Parent Category</TableCell>
                                            {/*<TableCell className="text-center" width="150">File</TableCell>*/}
                                            {/*<TableCell className="text-center" width="150">Image</TableCell>*/}
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categories.map(category => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={category.id}>
                                                    <TableCell>
                                                        <span>{category.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{category.name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {/*<span>{category.name}</span>*/}
                                                        <span>{getParentName(category.parent_id)}</span>

                                                    </TableCell>

                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/categories/${category.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, category.id)}
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

export default Categories;