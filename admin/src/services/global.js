import getConfig from 'next/config';
import Cookie from "js-cookie";


export const apiUrl = () => {
    const {publicRuntimeConfig} = getConfig();
    return publicRuntimeConfig.apiUrl
};

export const urlWithParams = (path, params = {}) => {
    return `${path}?${Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')}`;
}

export const getToken = () => {
    return Cookie.get('token')
}

export const successResponse = (data = null, message = null) => {
    return {
        data,
        message: handleMessage(message)
    }
}

export const errorResponse = (data = null, message = "Server Error!") => {
    return {
        data,
        message: handleMessage(message)
    }
}

export const exceptionResponse = (data = null, message = "Exception Error!") => ({
    data,
    message: handleMessage(message)
})

const handleMessage = message => message ? (Array.isArray(message) ? message : [message]) : null