import React, {forwardRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Select from '@mui/material/Select'; // Correct import statement
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import {
    getCategories,
    addCategory,
    loading as categoryLoading,
    errors as categoryErrors,
    success as categorySuccess,
    categories as categoriesList,
    setSuccess, setErrors,
    // getCategories, // Import the getCategories async action

} from '../../store/slices/categoriesSlice'
import {useRouter} from "next/navigation";
import Grid from "@mui/material/Grid";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

function Create(props) {
    const [categoryAdded, setCategoryAdded] = useState(false);

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(categoryLoading)
    const errors = useSelector(categoryErrors)
    const success = useSelector(categorySuccess)
    const categories = useSelector(categoriesList)

    const [successMsg, setSuccessMessage] = useState(null)
    const [name, setName] = useState('')
    const [name_ar, setNameAr] = useState('')
    const [parentId, setParentId] = useState('')
    // const [categories, setCategories] = useState([]);

    const [page, setPage] = useState(1)

    useEffect(() => {
        // Reset the success message when the component is mounted
        setSuccessMessage(null);
    }, []);
    // useEffect(() => {
    //     dispatch(setSuccess(false))
    // }, [success])

    // useEffect(() => {
    //     dispatch(setSuccess(false));
    //     dispatch(getCategories({ page: 1 })); // Fetch categories when the component mounts
    // }, [success, dispatch]);

    useEffect(() => {
        dispatch(getCategories({page}))
    }, [page])

    useEffect(() => {
        if (!loading && success && categoryAdded) {
            setSuccessMessage('Category added successfully!')
            setTimeout(() => {
                setSuccessMessage(null);
            }, 500);
            setTimeout(() => {
                push('/categories')
            }, 500)
        }
    }, [success, loading , categoryAdded])



    // useEffect(() => {
    //     // Update the categories state when the categories list changes
    //     setCategories(categoriesSelector); // Replace 'categoriesSelector' with the actual selector for categories list from Redux
    // }, [categoriesSelector]);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        dispatch(addCategory({
            name: name,
            name_ar: name_ar,
            parent_id: parentId,
        }))
        setCategoryAdded(true);
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Create Category
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        {successMsg ? (
                            <Alert severity="success" sx={{mb: 4}}>
                                <AlertTitle>Success</AlertTitle>
                                <Box component='strong' sx={{display: 'block'}}>{successMsg}</Box>
                            </Alert>
                        ) : null}
                        {errors && errors.length > 0 ? (
                            <Alert severity="error" sx={{mb: 4}}>
                                <AlertTitle>Errors</AlertTitle>
                                {errors.map((item, ind) => (
                                    <Box component='strong' sx={{display: 'block'}} key={ind}>{item}</Box>
                                ))}
                            </Alert>
                        ) : null}
                        <form onSubmit={handleSubmit}>
                            <Grid row>
                                <Grid item xs={12}>
                                    <Stack direction="row" gap={5}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Name Arabic"
                                            value={name_ar}
                                            onChange={(e) => setNameAr(e.target.value)}
                                        />
                                        <FormControl fullWidth>
                                            <Select  label="Select" value={parentId} onChange={(e) => setParentId(e.target.value)}>
                                                {categories.map((category) =>  (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 5 }}>
                                    <Button type="submit" variant="contained" disabled={loading}>
                                        {loading ? 'Saving' : 'Save'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Create;
