import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getSermon,
    sermon as sermonDetail,
    loading as sermonLoading,
    errors as sermonErrors,
    success as sermonSuccess, updateSermon, setErrors, setSuccess
} from "../../store/slices/sermonSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Sermon(props) {
    const {push, query} = useRouter()
    console.log("query", query)

    const {sermonId} = query

    const dispatch = useDispatch()

    const sermon = useSelector(sermonDetail)
    const loading = useSelector(sermonLoading)
    const errors = useSelector(sermonErrors)
    const success = useSelector(sermonSuccess)

    const [successMsg, setSuccessMessage] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [media, setMedia] = useState(null)
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (sermonId) {
            console.log("sermonId", sermonId)
            dispatch(getSermon({id: sermonId}))
        }
    }, [sermonId])

    useEffect(() => {
        if (sermon) {
            console.log("sermon", sermon)
            setTitle(sermon.title)
            setDescription(sermon.description != null ? sermon.description : "")
            setUrl(sermon.url)
            setMedia(sermon.media)
            setImage(sermon.image)
        }
    }, [sermon])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Sermon updated successfully!')
            setTimeout(() => {
                push('/sermons')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (loading) {
            return
        }

        if (!fileValidation()) {
            return
        };

        console.log("IN Submit" , sermonId,title, description, url, media, image);

        dispatch(updateSermon({
            id: sermonId,
            title, description, url, media, image
        }))

    }

    const fileValidation = () => {
        let _errors = []

        if (image === null) {
            _errors.push("Image is required!")
        }
        if (media === null) {
            _errors.push("Media is required!")
        }

        if (_errors.length > 0) {
            console.log("in error")
            dispatch(setErrors(_errors))
        }

        return _errors.length < 1
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Edit Sermon
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
                                    <TextField fullWidth label='Description' value={description}
                                               onChange={e => setDescription(e.target.value)}/>
                                </Grid>
                                <br/>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Url' value={url}
                                               onChange={e => setUrl(e.target.value)}/>
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

export default Sermon;