import React, {forwardRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Select from '@mui/material/Select'; // Correct import statement
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import {
    getQuotation,
    addQuotation,
    loading as quotationLoading,
    errors as quotationErrors,
    success as quotationSuccess,
    quotations as quotationsList,
    setSuccess, setErrors,
    // getQuotation, // Import the getQuotation async action

} from '../../store/slices/quotationsSlice'
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
    const [quotationAdded, setQuotationAdded] = useState(false);

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(quotationLoading)
    const errors = useSelector(quotationErrors)
    const success = useSelector(quotationSuccess)
    const quotations = useSelector(quotationsList)

    const [successMsg, setSuccessMessage] = useState(null)
    const [title, setTitle] = useState('')
    const [title_ar, setTitleAr] = useState('')
    const [description, setDescription] = useState('')
    const [description_ar, setDescriptionAr] = useState('')
    const [author, setAuthor] = useState('')
    const [author_ar, setAuthorAr] = useState('')
    const [audio, setAudio] = useState('')

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
    //     dispatch(getQuotation({ page: 1 })); // Fetch quotations when the component mounts
    // }, [success, dispatch]);

    useEffect(() => {
        dispatch(getQuotation({page}))
    }, [page])

    useEffect(() => {
        if (!loading && success && quotationAdded) {
            setSuccessMessage('Quotation added successfully!')
            setTimeout(() => {
                setSuccessMessage(null);
            }, 500);
            setTimeout(() => {
                push('/quotations')
            }, 500)
        }
    }, [success, loading , quotationAdded])



    // useEffect(() => {
    //     // Update the quotations state when the quotations list changes
    //     setQuotation(quotationsSelector); // Replace 'quotationsSelector' with the actual selector for quotations list from Redux
    // }, [quotationsSelector]);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        dispatch(addQuotation({
            title: title,
            title_ar: title_ar,
            description: description,
            description_ar: description_ar,
            author: author,
            author_ar: author_ar,
            audio: audio,
        }))
        setQuotationAdded(true);
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Create Quotation
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
                                            label="Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Title Arabic"
                                            value={title_ar}
                                            onChange={(e) => setTitleAr(e.target.value)}
                                        />
                                    </Stack>
                                    <Stack direction="row" gap={5}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Description Arabic"
                                            value={description_ar}
                                            onChange={(e) => setDescriptionAr(e.target.value)}
                                        />
                                    </Stack>
                                    <Stack direction="row" gap={5}>
                                        <TextField
                                            fullWidth
                                            label="Author"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Author Arabic"
                                            value={author_ar}
                                            onChange={(e) => setAuthorAr(e.target.value)}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sx={{mt: 5}}>
                                    <Stack direction="row" gap={2}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload Audio
                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => {
                                                    setAudio(e.target?.files[0] ?? null)
                                                }}
                                            />
                                        </Button>
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
