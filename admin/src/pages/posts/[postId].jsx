import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getPost,
    post as postDetail,
    loading as postLoading,
    errors as postErrors,
    success as postSuccess, updatePost, setErrors, setSuccess, getPostTitleArabicTranslation, getPostDescriptionArabicTranslation
} from "../../store/slices/postSlice";
import {
    getCategories,
    categories as categoriesList,
} from '../../store/slices/categoriesSlice'
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// import {getCategories} from "../../store/slices/categoriesSlice";

function Post(props) {
    const {push, query} = useRouter()
    console.log("query" , query)

    const {postId} = query

    const dispatch = useDispatch()

    const post = useSelector(postDetail)
    const loading = useSelector(postLoading)
    const errors = useSelector(postErrors)
    const success = useSelector(postSuccess)
    const categories = useSelector(categoriesList)

    const [successMsg, setSuccessMessage] = useState(null)

    const [category_ids, setCategoryId] = useState([]); // Make sure to initialize category_ids as an array

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
        dispatch(getCategories({page}))
    }, [page])

    useEffect(() => {
        if (postId) {
            console.log("postId" , postId)
            dispatch(getPost({id: postId}))

            let translation_record = dispatch(getPostTitleArabicTranslation({module_id: parseInt(postId), language_id: 2, key: 'title'}))
            translation_record.then((record) => {
                if (record.payload.data && record.payload.data.value) {
                    setTitleAr(record.payload.data.value)
                }
            });

            translation_record = dispatch(getPostDescriptionArabicTranslation({module_id: parseInt(postId), language_id: 2, key: 'description'}))
            translation_record.then((record) => {
                if (record.payload.data && record.payload.data.value) {
                    setDescriptionAr(record.payload.data.value)
                }
            });
        }
    }, [postId])

    useEffect(() => {
        if (post) {
            let category_ids = [];
            post.categories.forEach((category) => {
                category_ids.push(category.id)
            });
            setCategoryId(category_ids)
            setTitle(post.title)
            setDescription(post.description)
            setUrl(post.url)
            // setDate(post.date)
            // setTime(post.time)
            setVideo(post.video)
            setAudio(post.audio)
            setImage(post.image)
            setPdf(post.pdf)
        }
    }, [post])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Post updated successfully!')
            setTimeout(() => {
                push('/posts')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        if (!fileValidation()) return;

        dispatch(updatePost({
            id: postId,
            category_ids , title, title_ar, description, description_ar, url , video , audio , image , pdf
            // category_ids , title, title_ar, description, description_ar, url , date , time , video , audio , image , pdf
        }))

    }

    const fileValidation = () => {
        let _errors = []
        // if (file === null) {
        //     _errors.push("File is required!")
        // }
        // if (media === null) {
        //     _errors.push("Image is required!")
        // }

        if (_errors.length > 0) {
            dispatch(setErrors(_errors))
        }

        return _errors.length < 1
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Edit Post
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
                                            multiple // This allows selecting multiple categories
                                            value={category_ids}
                                            onChange={handleCategoryChange}
                                        >
                                            {categories.map((category) => (
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

export default Post;
