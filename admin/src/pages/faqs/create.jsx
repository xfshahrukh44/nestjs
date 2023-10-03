import React, {forwardRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    addFaq,
    loading as faqLoading,
    errors as faqErrors,
    success as faqSuccess,
    setSuccess, setErrors
} from '../../store/slices/faqsSlice'
import {useRouter} from "next/navigation";
import Grid from "@mui/material/Grid";
import {Alert, AlertTitle, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

function Create(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(faqLoading)
    const errors = useSelector(faqErrors)
    const success = useSelector(faqSuccess)

    const [successMsg, setSuccessMessage] = useState(null)
    const [question, setQuestion] = useState('')
    const [question_ar, setQuestionAr] = useState('')
    const [answer, setAnswer] = useState('')
    const [answer_ar, setAnswerAr] = useState('')
    // const [email, setEmail] = useState('')
    // const [phone, setPhone] = useState('')
    // const [password, setPassword] = useState('')

    useEffect(() => {
        dispatch(setSuccess(false))
    }, [success])

    useEffect(() => {
        if (!loading && success) {
            setSuccessMessage('Faq added successfully!')
            setTimeout(() => {
                push('/faqs')
            }, 500)
        }
    }, [success, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        dispatch(addFaq({
            question: question,
            question_ar: question_ar,
            answer: answer,
            answer_ar: answer_ar,
        }))
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                    Create Faq
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
