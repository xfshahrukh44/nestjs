import {apiUrl, errorResponse, exceptionResponse, getToken, successResponse, urlWithParams} from "./global";

// export const create = async ({
//                                  title,
//                                  content,
//                                  media
//                              }) => {
//     try {
//         const form = new FormData()
//         form.append('title', title)
//         form.append('content', content)
//         form.append('media', media)
//
//         const response = await fetch(`${apiUrl()}/posts`, {
//             method: 'POST',
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

export const create = async ({
                                 title,
                                 category_ids,
                                 title_ar,
                                 description,
                                 description_ar,
                                 url,
                                 // date,
                                 // time,
                                 image,
                                 video,
                                 audio,
                                 pdf,
                             }) => {
    try {

        console.log(image);
        const form = new FormData()
        form.append('title', title)
        // let cat_array = category_ids.split(',');
        // console.log('category_ids.split', category_ids.split(','))
        form.append('category_ids[]', category_ids);
        console.log('form.category_ids', form.category_ids);
        form.append('title_ar', title_ar)
        form.append('description', description)
        form.append('description_ar', description_ar)
        form.append('url', url)
        // form.append('date', date)
        // form.append('time', time)
        form.append('image', image)
        form.append('video', video)
        form.append('audio', audio)
        form.append('pdf', pdf)


        const response = await fetch(`${apiUrl()}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
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

export const update = async ({
                                 id,
                                 title,
                                 category_ids,
                                 title_ar,
                                 description,
                                 description_ar,
                                 url,
                                 // date,
                                 // time,
                                 video,
                                 audio,
                                 image,
                                 pdf
                             }) => {
    try {
        console.log("update form", id, title, title_ar, description, description_ar)
        const form = new FormData()
        form.append('title', title)
        // let cat_array = category_ids.split(',');
        // console.log('category_ids.split', category_ids.split(','))
        form.append('category_ids[]', category_ids);
        console.log('form.category_ids', form.category_ids);
        form.append('title_ar', title_ar)
        form.append('description', description)
        form.append('description_ar', description_ar)
        form.append('url', url)
        // form.append('date', date)
        // form.append('time', time)
        form.append('image', image)
        form.append('video', video)
        form.append('audio', audio)
        form.append('pdf', pdf)

        const response = await fetch(`${apiUrl()}/posts/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                // 'Content-Type': 'multipart/form-data'
            },
            body: form,
        });

        const data = await response.json();
        console.log("updated Data" , data)
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

export const markAsFeatured = async ({post_id, is_featured}) => {
    try {
        const form = new FormData()
        form.append('is_featured', is_featured)

        const response = await fetch(`${apiUrl()}/posts/${post_id}/mark-as-featured`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            // body: form,
            body: JSON.stringify({
                is_featured: is_featured
            }),
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
        const response = await fetch(urlWithParams(`${apiUrl()}/posts`, {
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
        const response = await fetch(`${apiUrl()}/posts/${id}`, {
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

        const response = await fetch(`${apiUrl()}/posts/${id}`, {
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
        const response = await fetch(`${apiUrl()}/posts/translation/get/`, {
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
