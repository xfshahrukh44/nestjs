import {apiUrl, errorResponse, exceptionResponse, getToken, successResponse, urlWithParams} from "./global";

export const create = async ({
                                 title,
                                 title_ar,
                                 description,
                                 description_ar,
                                 author,
                                 author_ar,
                                 audio,
                             }) => {
    try {

        const form = new FormData()
        form.append('title', title)
        form.append('title_ar', title_ar)
        form.append('description', description)
        form.append('description_ar', description_ar)
        form.append('author', author)
        form.append('author_ar', author_ar)
        form.append('audio', audio)

        console.log('audioaudioaudioaudioaudioaudioaudioaudioaudioaudio', audio);

        const response = await fetch(`${apiUrl()}/quotations`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            // body: JSON.stringify(payload),
            body: form,
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
//         const response = await fetch(`${apiUrl()}/quotations/${id}`, {
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


export const update = async ({
                                 id,
                                 title,
                                 title_ar,
                                 description,
                                 description_ar,
                                 author,
                                 author_ar,
                                 audio,
                             }) => {
    try {


        const form = new FormData()
        form.append('title', title)
        form.append('title_ar', title_ar)
        form.append('description', description)
        form.append('description_ar', description_ar)
        form.append('author', author)
        form.append('author_ar', author_ar)
        form.append('audio', audio)

        const response = await fetch(`${apiUrl()}/quotations/${id}`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            // body: JSON.stringify(payload),
            body: form,
        });

        const data = await response.json();

        if (data?.success === false) {
            return errorResponse(null, data?.message ?? 'Server Error')
        } else if (data?.statusCode === 400) {
            return errorResponse(null, data?.message ?? ['Server Error'])
        }
        return successResponse(data)
    } catch (e) {
        console.log('asdasdasda');
        return exceptionResponse()
    }
}



export const get = async (page = 1, limit = 15) => {
    try {
        const response = await fetch(urlWithParams(`${apiUrl()}/quotations`, {
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


export const show = async (id) => {
    try {
        const response = await fetch(`${apiUrl()}/quotations/${id}`, {
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

        const response = await fetch(`${apiUrl()}/quotations/${id}`, {
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
        const response = await fetch(`${apiUrl()}/quotations/translation/get/`, {
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
