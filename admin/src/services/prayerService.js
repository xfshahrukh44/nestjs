import {apiUrl, errorResponse, exceptionResponse, getToken, successResponse, urlWithParams} from "./global";
//
// export const create = async ({
//                                  name,
//                                  email,
//                                  contact,
//                                  start_date,
//                                  end_date,
//                                  time,
//                                  description
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
//
// export const update = async ({
//                                  id,
//                                  title,
//                                  content,
//                                  media
//                              }) => {
//     try {
//         console.log("update form", id, title,
//             content,
//             media)
//         const form = new FormData()
//         form.append('title', title)
//         form.append('content', content)
//         form.append('media', media)
//
//         const response = await fetch(`${apiUrl()}/posts/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${getToken()}`
//             },
//             body: form,
//         });
//
//         const data = await response.json();
//         console.log("updated Data" , data)
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

export const get = async (page = 1, limit = 15) => {
    try {
        const response = await fetch(urlWithParams(`${apiUrl()}/prayer-requests`, {
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

//
export const show = async (id) => {
    try {
        const response = await fetch(`${apiUrl()}/prayer-requests/${id}`, {
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
//
// export const destroy = async ({
//                                  id
//                              }) => {
//     try {
//         console.log("delete form", id)
//
//         const response = await fetch(`${apiUrl()}/posts/${id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `Bearer ${getToken()}`
//             },
//             // body: form,
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