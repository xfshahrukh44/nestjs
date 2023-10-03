import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getSpeaker,
    speaker as speakerDetail,
    loading as speakerLoading,
    errors as speakerErrors,
    success as speakerSuccess, updateSpeaker, setErrors, setSuccess
} from "../../store/slices/speakerSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Speaker(props) {
    const {push, query} = useRouter()
    console.log("query" , query)

    const {speakerId} = query

    const dispatch = useDispatch()

    const speaker = useSelector(speakerDetail)
    const loading = useSelector(speakerLoading)
    const errors = useSelector(speakerErrors)
    const success = useSelector(speakerSuccess)

    const [successMsg, setSuccessMessage] = useState(null)
    const [name, setName] = useState('')
    const [designation, setDesignation] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    // const [file, setFile] = useState(null)

    useEffect(() => {
        if (speakerId) {
            console.log("speakerId" , speakerId)
            dispatch(getSpeaker({id: speakerId}))
        }
    }, [speakerId])

    useEffect(() => {
        if (speaker) {
            console.log("speaker" , speaker)
            setName(speaker.name)
            setDescription(speaker.description)
            setDesignation(speaker.designation)
            setImage(speaker.image)
        }
    }, [speaker])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Speaker updated successfully!')
            setTimeout(() => {
                push('/speakers')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        if (!fileValidation()) return;

        dispatch(updateSpeaker({
            id: speakerId,
            name, designation, description , image
        }))

    }

    const fileValidation = () => {
        let _errors = []
        // if (file === null) {
        //     _errors.push("File is required!")
        // }
        console.log("img" , image);
        if (image === null) {
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
                    Edit Speaker
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
                                    <TextField fullWidth label='Name' value={name}
                                               onChange={e => setName(e.target.value)}/>
                                </Grid>
                                <br/>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Designation' value={designation}
                                               onChange={e => setDesignation(e.target.value)}/>
                                </Grid>
                                <br/>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Description' value={description}
                                               onChange={e => setDescription(e.target.value)}/>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 5}}>
                                    <Stack direction="row" gap={2}>
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

export default Speaker;