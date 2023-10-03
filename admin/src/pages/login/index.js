// ** React Imports
import {useEffect, useState} from 'react'

// ** Next Imports
import Link from 'next/link'
import {useRouter} from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import {styled, useTheme} from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import {useDispatch, useSelector} from "react-redux";

import {loginUser, errors, loading as loginLoading, isAuth} from 'src/store/slices/authSlice'

// ** Styled Components
const Card = styled(MuiCard)(({theme}) => ({
    [theme.breakpoints.up('sm')]: {width: '28rem'}
}))

const LoginPage = () => {

    // ** Hook
    const theme = useTheme()
    const router = useRouter()
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const errorsMessages = useSelector(errors)
    const loading = useSelector(loginLoading)
    const isAuthenticated = useSelector(isAuth)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = event => {
        event.preventDefault()
    }

    const loginHandle = async (e) => {
        e.preventDefault()
        if (loading) return;
        await dispatch(loginUser({email, password}))
    }

    useEffect(() => {
        if (isAuthenticated)
            router.reload()
    }, [isAuthenticated])

    return (
        <Box className='content-center'>
            <Card sx={{zIndex: 1}}>
                <CardContent sx={{padding: theme => `${theme.spacing(12, 9, 7)} !important`}}>
                    <Box sx={{mb: 8}}>
                        <Typography variant='h5' sx={{fontWeight: 600, textAlign: 'center'}}>
                           Sameem Admin Panel
                        </Typography>
                    </Box>
                    <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
                        <TextField autoFocus fullWidth id='email' onChange={e => setEmail(e.target.value)} label='Email'
                                   sx={{marginBottom: 4}}/>
                        <FormControl fullWidth sx={{mb: 6}}>
                            <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
                            <OutlinedInput
                                label='Password'
                                value={password}
                                id='auth-login-password'
                                onChange={e => setPassword(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            edge='end'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            aria-label='toggle password visibility'
                                        >
                                            {showPassword ? <EyeOutline/> : <EyeOffOutline/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        {/*<Box
                            sx={{
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between'
                            }}
                        >
                            <FormControlLabel control={<Checkbox/>} label='Remember Me'/>
                            <Link passHref href='/'>
                                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
                            </Link>
                        </Box>*/}
                        <Button
                            fullWidth
                            size='large'
                            variant='contained'
                            sx={{marginBottom: 7}}
                            onClick={loginHandle}
                        >
                            Login
                        </Button>
                        {errorsMessages ? (
                            <Box component='div'>
                                {errorsMessages.map((item, ind) => (
                                    <Typography sx={{color: 'red'}} component='p' textAlign='center' key={ind}>{item}</Typography>
                                ))}
                            </Box>
                        ) : null}
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
