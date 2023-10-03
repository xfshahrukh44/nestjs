import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getGroup,
    group as groupDetail,
    loading as groupLoading,
    errors as groupErrors,
    success as groupSuccess, updateGroup, setErrors, setSuccess
} from "../../store/slices/groupSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function User(props) {
    const {push, query} = useRouter()
    const {id} = query

    const dispatch = useDispatch()

    const group = useSelector(groupDetail)
    const loading = useSelector(groupLoading)
    const errors = useSelector(groupErrors)
    const success = useSelector(groupSuccess)

    const [successMsg, setSuccessMessage] = useState(null)
    const [name, setName] = useState('')

    useEffect(() => {
        if (id) {
            dispatch(getGroup({id}))
        }
    }, [id])

    useEffect(() => {
        if (group) {
            setName(group.name)
        }
    }, [group])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Group updated successfully!')
            setTimeout(() => {
                push('/groups')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        dispatch(updateGroup({
            id,
            name,
        }))

    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Edit User
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

export default User;