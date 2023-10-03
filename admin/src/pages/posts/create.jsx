import React, {useEffect, useState} from 'react';
// import PageTitle from "../../example/components/Typography/PageTitle";
// import {Button, Input, Label, Select, Textarea} from "@roketid/windmill-react-ui";
// import Layout from "../../example/containers/Layout";
// import FileInput from "../../example/components/FileInput";
import Select from '@mui/material/Select'; // Correct import statement
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {useDispatch, useSelector} from "react-redux";
import {
    addPost,
    loading as PostLoading,
    errors as PostErrors,
    success as PostSuccess,
    setSuccess, setErrors
} from '../../store/slices/postsSlice'

// import {
//     getCategories,
//     categories as categoriesList,
// } from '../../store/slices/categoriesSlice';
import {
    getAllCategories,
    allCategories as categoriesList,
} from '../../store/slices/categoriesSlice'

import {useRouter} from "next/navigation";
import Grid from "@mui/material/Grid";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";

function Create(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(PostLoading)
    const errors = useSelector(PostErrors)
    const success = useSelector(PostSuccess)
    const categories = useSelector(categoriesList)

    const [successMsg, setSuccessMessage] = useState(null)
    const [category_ids, setCategoryId] = useState([]);


    const [title, setTitle] = useState('')
    const [title_ar, setTitleAr] = useState('')
    const [description, setDescription] = useState('')
    const [description_ar, setDescriptionAr] = useState('')
    const [url, setUrl] = useState('')
    // const [date, setDate] = useState('')
    // const [time, setTime] = useState('')
    const [video, setVideo] = useState('')
    const [audio, setAudio] = useState('')
    const [image, setImage] = useState(null)
    const [pdf, setPdf] = useState(null)

    const [page, setPage] = useState(1)


    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
    };
    // const [file, setFile] = useState(null)

    useEffect(() => {

        dispatch(getAllCategories({page}))
    }, [page])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Post added successfully!')
            setTimeout(() => {
                push('/posts')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        if (!fileValidation()) return;

        dispatch(addPost({
            // category_ids , title, title_ar, description, description_ar, url , date , time , video , audio , image , pdf
            category_ids , title, title_ar, description, description_ar, url , video , audio , image , pdf
        }))

    }

    const fileValidation = () => {
        let _errors = []
        // if (file === null) {
        //     _errors.push("File is required!")
        // }

        if (category_ids === null) {
            _errors.push("Category is required!")
        }

        if (_errors.length > 0) {
            dispatch(setErrors(_errors))
        }

        return _errors.length < 1
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Create Post
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
                                    <FormControl fullWidth required>
                                        <InputLabel>Select Category</InputLabel>
                                        <Select
                                            multiple
                                            value={category_ids}
                                            onChange={handleCategoryChange}
                                        >
                                            {categories.length > 0 && categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <br/>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Title' value={title}
                                               onChange={e => setTitle(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Title Arabic' value={title_ar}
                                               onChange={e => setTitleAr(e.target.value)}/>
                                </Grid>
                                <br/>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Description' value={description}
                                               onChange={e => setDescription(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Description Arabic' value={description_ar}
                                               onChange={e => setDescriptionAr(e.target.value)}/>
                                </Grid>
                                <br/>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Url' value={url}
                                               onChange={e => setUrl(e.target.value)}/>
                                </Grid>

                                {/*<Grid item xs={12} sx={{mt: 5}}>*/}
                                {/*    <TextField fullWidth label='Date '*/}
                                {/*               type="text"*/}
                                {/*               onFocus={e => {*/}
                                {/*                   e.target.type = 'date'*/}
                                {/*               }}*/}
                                {/*               onBlur={e => {*/}
                                {/*                   e.target.type = 'text'*/}
                                {/*               }}*/}
                                {/*               value={date}*/}
                                {/*               onChange={e => setDate(e.target.value)}/>*/}
                                {/*</Grid>*/}

                                {/*<Grid item xs={12} sx={{ mt: 5 }}>*/}
                                {/*    <TextField*/}
                                {/*        fullWidth*/}
                                {/*        label='Time'*/}
                                {/*        type="text"*/}
                                {/*        onFocus={e => {*/}
                                {/*            e.target.type = 'time'; // Change type to 'time' on focus*/}
                                {/*        }}*/}
                                {/*        onBlur={e => {*/}
                                {/*            e.target.type = 'text'; // Change type back to 'text' on blur*/}
                                {/*        }}*/}
                                {/*        value={time}*/}
                                {/*        onChange={e => setTime(e.target.value)}*/}
                                {/*    />*/}
                                {/*</Grid>*/}

                                <Grid item xs={12} sx={{mt: 5}}>
                                    <Stack direction="row" gap={2}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload Video
                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => {
                                                    setVideo(e.target?.files[0] ?? null)
                                                }}
                                            />
                                        </Button>

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
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload PDF
                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => {
                                                    setPdf(e.target?.files[0] ?? null)
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
                                                    setImage(e.target?.files[0] ?? null)
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
