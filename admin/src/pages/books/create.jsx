import React, {useEffect, useState} from 'react';
// import PageTitle from "../../example/components/Typography/PageTitle";
// import {Button, Input, Label, Select, Textarea} from "@roketid/windmill-react-ui";
// import Layout from "../../example/containers/Layout";
// import FileInput from "../../example/components/FileInput";
import {useDispatch, useSelector} from "react-redux";
import {
    addBook,
    loading as BookLoading,
    errors as BookErrors,
    success as BookSuccess,
    setSuccess, setErrors
} from '../../store/slices/booksSlice'
import {useRouter} from "next/navigation";
import Grid from "@mui/material/Grid";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

function Create(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(BookLoading)
    const errors = useSelector(BookErrors)
    const success = useSelector(BookSuccess)

    const [successMsg, setSuccessMessage] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [file, setFile] = useState(null)

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Book added successfully!')
            setTimeout(() => {
                push('/books')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        if (!fileValidation()) return;

        dispatch(addBook({
            title, image, file, description, url
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
                    Create Book
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
                            <Grid row>
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

export default Create;
