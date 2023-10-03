import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    getFaq,
    faq as faqDetail,
    loading as faqLoading,
    errors as faqErrors,
    success as faqSuccess, updateFaq, setErrors, setSuccess
} from "../../store/slices/faqSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Faq(props) {
    const {push, query} = useRouter()
    const {faqId} = query

    const dispatch = useDispatch()

    const faq = useSelector(faqDetail)
    const loading = useSelector(faqLoading)
    const errors = useSelector(faqErrors)
    const success = useSelector(faqSuccess)

    const [successMsg, setSuccessMessage] = useState('')
    const [question, setQuestion] = useState('')
    const [question_ar, setQuestionAr] = useState('')
    const [answer, setAnswer] = useState('')
    const [answer_ar, setAnswerAr] = useState('')

    useEffect(() => {
        if (faqId) {
            dispatch(getFaq({id: faqId}))
        }
    }, [faqId])

    useEffect(() => {
        if (faq) {
            setQuestion(faq.question)
            setQuestionAr(faq.question_ar)
            setAnswer(faq.answer ?? '')
            setAnswerAr(faq.answer_ar ?? '')
        }
    }, [faq])

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Faq updated successfully!')
            setTimeout(() => {
                push('/faqs').then((r) => 'success');
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        // if (!fileValidation()) return;
        let data = {
            question,
            question_ar,
            answer,
            answer_ar
        }
        dispatch(updateFaq({
            id: faqId,
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
                    Edit Faq
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
                                    <Stack direction='row' gap={5}>
                                        <TextField fullWidth label='Question' value={question}
                                                   onChange={e => setQuestion(e.target.value)}/>
                                        <TextField fullWidth label='Question Arabic' value={question_ar}
                                                   onChange={e => setQuestionAr(e.target.value)}/>
                                    </Stack>
                                    <Stack direction='row' gap={5}>
                                        <TextField fullWidth label='Answer' value={answer}
                                                   onChange={e => setAnswer(e.target.value)}/>
                                        <TextField fullWidth label='Answer Arabic' value={answer_ar}
                                                   onChange={e => setAnswerAr(e.target.value)}/>
                                    </Stack>
                                </Grid>

                                {/*<Grid item xs={12} mt={5}>
                                    <TextField fullWidth label='Description' multiline rows={4} value={description}
                                               onChange={e => setDescription(e.target.value)}/>
                                </Grid>*/}


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

export default Faq;
