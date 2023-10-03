import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getCategoryMenus,
    loading as categoryMenusLoading,
    categoryMenus as categoryMenusList,
    total as categoryMenuTotal,
    totalPages as categoryMenuTotalPages,
} from '../../store/slices/categoryMenusSlice'
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

function CategoryMenus(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(categoryMenusLoading)
    const categoryMenus = useSelector(categoryMenusList)
    const total = useSelector(categoryMenuTotal)
    const totalPages = useSelector(categoryMenuTotalPages)

    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    // const handleDelete = async (e, id) => {
    //     e.preventDefault()
    //     await dispatch(deleteCategory({id}))
    //     await dispatch(getCategories({page}))
    // }



    useEffect(() => {
        dispatch(getCategoryMenus({page}))
    }, [page])

    // Assuming you have a selector to get the 'data' array from the Redux store
    const data = useSelector((state) => state.categoryMenus.data);

    // Function to get the parent category name based on parent_id
    // const getParentName = (parentId) => {
    //     const parentCategory = categories.find((category) => category.id === parentId);
    //     return parentCategory ? parentCategory.name : 'N/A';
    // };

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Category Menus
                    </Typography>

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
                                            <TableCell className="text-center" width="150">Sub Category</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categoryMenus.map(category => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={category.id}>
                                                    <TableCell>
                                                        <span>{category.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{category.name}</span>
                                                    </TableCell>
                                                    {category.children && category.children.length > 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={3}>
                                                                <Table>
                                                                    <TableBody>
                                                                        {category.children.map((childCategory) => (
                                                                            <TableRow hover role="checkbox" tabIndex={-1} key={childCategory.id}>
                                                                                <TableCell>
                                                                                    <span>{childCategory.name}</span>
                                                                                </TableCell>

                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

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

export default CategoryMenus;