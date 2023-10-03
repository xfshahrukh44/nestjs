import {apiUrl, errorResponse, exceptionResponse, getToken, successResponse, urlWithParams} from "./global";

export const create = async (payload) => {
    try {

        if (payload.parent_id === "") {
            payload.parent_id = null;
        }

        console.log(payload);

        const response = await fetch(`${apiUrl()}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        } else if (data?.statusCode === 400) {
            return errorResponse(null, data?.message ?? ['Server Error'])
        }
        return successResponse(data)
    } catch (e) {
        return exceptionResponse()
    }
}


// export const update = async ({
//                                  id,
//                                  ...payload
//                              }) => {
//     try {
//         const form = new FormData()
//         for (const payloadKey in payload) {
//             form.append(payloadKey, payload[payloadKey])
//         }
//
//         console.log(form);
//         const response = await fetch(`${apiUrl()}/categories/${id}`, {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': `Bearer ${getToken()}`
//             },
//             body: form,
//         });
//
//         const data = await response.json();
//
//         if (data?.success === false) {
//             return errorResponse(null, data?.message ?? 'Server Error')
//         } else if (data?.statusCode === 400) {
//             return errorResponse(null, data?.message ?? ['Server Error'])
//         }
//         return successResponse(data)
//     } catch (e) {
//         return exceptionResponse()
//     }
// }


export const update = async ({id, ...payload}) => {
    try {
        const response = await fetch(`${apiUrl()}/categories/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        } else if (data?.statusCode === 400) {
            return errorResponse(null, data?.message ?? ['Server Error'])
        }
        return successResponse(data)
    } catch (e) {
        return exceptionResponse()
    }
}



export const get = async (page = 1, limit = 15) => {
    try {
        const response = await fetch(urlWithParams(`${apiUrl()}/categories`, {
            page, limit
        }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        }

        return successResponse(data)
    } catch (e) {
        return exceptionResponse()
    }
}

export const getAllCategory = async (page = 1, limit = 1000) => {
    try {
        const response = await fetch(urlWithParams(`${apiUrl()}/categories`, {
            page, limit
        }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        }

        return successResponse(data)
    } catch (e) {
        return exceptionResponse()
    }
}

export const getMenu = async (page = 1, limit = 1000) => {
    try {
        const response = await fetch(urlWithParams(`${apiUrl()}/categories/get-menu`, {
            page, limit
        }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        const data = await response.json();
        // console.log('getMenu', data)

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        }

        return successResponse(data)
    } catch (e) {
        return exceptionResponse()
    }
}

export const show = async (id) => {
    try {
        const response = await fetch(`${apiUrl()}/categories/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        }

        return successResponse(data)
    } catch (e) {
        return exceptionResponse()
    }
}

export const destroy = async ({
                                  id
                              }) => {
    try {
        console.log("delete form", id)

        const response = await fetch(`${apiUrl()}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            // body: form,
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        } else if (data?.statusCode === 400) {
            return errorResponse(null, data?.message ?? ['Server Error'])
        }
        return successResponse(data)
    } catch (e) {
        return exceptionResponse()
    }
}

export const showTranslation = async (module_id, language_id, key) => {
    try {
        const response = await fetch(`${apiUrl()}/categories/translation/get/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                module_id: module_id,
                language_id: language_id,
                key: key,
            })
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        }

        return data;
    } catch (e) {
        return exceptionResponse()
    }
}