

import axios from "axios"


export const createSubCategoryApi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-category', obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const updateSubCategoryApi = (obj, id) => {

    let data = axios.put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-category/' + id, obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}


export const getAllSubCategoryApi = (query) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-category/get', query ).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}


export const getSubCategoryByCategoryApi = (category_id) => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-category/category/' + category_id ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}


export const deleteSubCategoryApi = (id) => {

    let data = axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-category/' + id, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data


}