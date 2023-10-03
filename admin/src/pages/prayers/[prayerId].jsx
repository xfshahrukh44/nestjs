import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getPost,
    post as postDetail,
    loading as postLoading,
    errors as postErrors,
    success as postSuccess, updatePost, setErrors, setSuccess
} from "../../store/slices/postSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Post(props) {
    const {push, query} = useRouter()
    console.log("query" , query)

    const {postId} = query

    const dispatch = useDispatch()

    const post = useSelector(postDetail)
    const loading = useSelector(postLoading)
    const errors = useSelector(postErrors)
    const success = useSelector(postSuccess)

    const [successMsg, setSuccessMessage] = useState(null)
    const [title, setTitle] = useState('')
    const [media, setMedia] = useState(null)
    const [content, setContent] = useState('')

    useEffect(() => {
        if (postId) {
            console.log("postId" , postId)
            dispatch(getPost({id: postId}))
        }
    }, [postId])

    useEffect(() => {
        if (post) {
            console.log("post" , post)
            setTitle(post.title)
            setContent(post.content)
            setMedia(post.media)
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
            title, content, media
        }))

    }

    const fileValidation = () => {
        let _errors = []
        // if (file === null) {
        //     _errors.push("File is required!")
        // }
        if (media === null) {
            _errors.push("Image is required!")
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
                                    <TextField fullWidth label='Title' value={title}
                                               onChange={e => setTitle(e.target.value)}/>
                                </Grid>
                                <br/>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Content' value={content}
                                               onChange={e => setContent(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 5}}>
                                    <Stack direction="row" gap={2}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload Media
                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => {
                                                    setMedia(e.target?.files[0] ?? null)
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