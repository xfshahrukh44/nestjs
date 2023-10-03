import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {apiUrl, getToken} from "../services/global";
import {authUser} from "../services/authService";
import Cookie from 'js-cookie'

function AuthMiddleware({children}) {

    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [lastUrl, setLastUrl] = useState(null)

    useEffect(() => {
        if (router.pathname === lastUrl)
            return;
        const checkAuthentication = async () => {
            const token = getToken()
            if (token) {
                const {data} = await authUser(token, apiUrl())
                if (!data) {
                    Cookie.remove('token')
                    await router.reload()
                } else if (router.pathname === '/login') {
                    await router.push('/categories')
                }
            } else if (!token && router.pathname !== '/login') {
                await router.push('/login')
            }

            setLastUrl(router.pathname)
            setLoading(false)
        };
        checkAuthentication();

    }, [router]);

    if (loading)
        return <p>Loading...</p>

    return children;
}

export default AuthMiddleware;