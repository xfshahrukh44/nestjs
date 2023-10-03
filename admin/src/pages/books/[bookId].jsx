import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getBook,
    book as bookDetail,
    loading as bookLoading,
    errors as bookErrors,
    success as bookSuccess, updateBook, setErrors, setSuccess
} from "../../store/slices/bookSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Book(props) {
    const {push, query} = useRouter()
    const {bookId} = query

    const dispatch = useDispatch()

    const book = useSelector(bookDetail)
    const loading = useSelector(bookLoading)
    const errors = useSelector(bookErrors)
    const success = useSelector(bookSuccess)

    const [successMsg, setSuccessMessage] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [file, setFile] = useState('')

    useEffect(() => {
        if (bookId) {
            dispatch(getBook({id: bookId}))
        }
    }, [bookId])

    useEffect(() => {
        if (book) {
            setTitle(book.title)
            setUrl(book.url ?? '')
            setDescription(book.description ?? '')
        }
    }, [book])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Book updated successfully!')
            setTimeout(() => {
                push('/books').then((r) => 'success');
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        // if (!fileValidation()) return;
        let data = {
            title,
            url,
            description
        }

        if (image)
            data['image'] = image ?? ''

        if (file)
            data['file'] = file ?? ''

        dispatch(updateBook({
            id: bookId,
            ...data
        }))

    }

    const fileValidation = () => {
        let _errors = []
        /*if (file === null) {
            _errors.push("File is required!")
        }
        if (image === null) {
            _errors.push("Image is required!")
        }*/

        if (_errors.length > 0) {
            dispatch(setErrors(_errors))
        }

        return _errors.length < 1
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Edit Book
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
                        ) : ''}
                        {errors && errors.length > 0 ? (
                            <Alert severity="error" sx={{mb: 4}}>
                                <AlertTitle>Errors</AlertTitle>
                                {errors.map((item, ind) => (
                                    <Box component='strong' sx={{display: 'block'}} key={ind}>{item}</Box>
                                ))}
                            </Alert>
                        ) : ''}
                        <form onSubmit={handleSubmit}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Title' value={title}
                                               onChange={e => setTitle(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12} mt={5}>
                                    <TextField fullWidth label='URL' value={url}
                                               onChange={e => setUrl(e.target.value)}/>
                                </Grid>
                                {/*<Grid item xs={12} mt={5}>
                                    <TextField fullWidth label='Description' multiline rows={4} value={description}
                                               onChange={e => setDescription(e.target.value)}/>
                                </Grid>*/}
                                <Grid item xs={12} sx={{mt: 5}}>
                                    <Stack direction="row" gap={2}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload File
                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => {
                                                    setFile(e.target?.files[0] ?? '')
                                                }}
                                            />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload Image
                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => {
                                                    setImage(e.target?.files[0] ?? '')
                                                }}
                                            />
                                        </Button>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sx={{mt: 5}}>
                                    <Button type='submit' variant='contained' disabled={loading}>
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

export default Book;