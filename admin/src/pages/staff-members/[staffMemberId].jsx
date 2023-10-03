import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getStaffMember,
    staffMember as staffMemberDetail,
    loading as staffMemberLoading,
    errors as staffMemberErrors,
    success as staffMemberSuccess, updateStaffMember, setErrors, setSuccess
} from "../../store/slices/staffMemberSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function StaffMember(props) {
    const {push, query} = useRouter()
    const {staffMemberId} = query

    const dispatch = useDispatch()

    const staffMember = useSelector(staffMemberDetail)
    const loading = useSelector(staffMemberLoading)
    const errors = useSelector(staffMemberErrors)
    const success = useSelector(staffMemberSuccess)

    const [successMsg, setSuccessMessage] = useState(null)

    const [name, setName] = useState('')
    const [description, setDescription] = useState(null)
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (staffMemberId) {
            dispatch(getStaffMember({id: staffMemberId}))
        }
    }, [staffMemberId])

    useEffect(() => {
        if (staffMember) {
            setName(staffMember.name)
            setDescription(staffMember.description)
            setImage(staffMember.image)
        }
    }, [staffMember])



    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Staff-Member updated successfully!')
            setTimeout(() => {
                push('/staff-members')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        if (!fileValidation()) return;

        dispatch(updateStaffMember({
            id: staffMemberId,
            name, description, image
        }))

    }

    const fileValidation = () => {
        let _errors = []
        if (name === null) {
            _errors.push("Name is required!")
        }
        if (description === null) {
            _errors.push("Description is required!")
        }

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
                    Edit Staff Member
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

export default StaffMember;