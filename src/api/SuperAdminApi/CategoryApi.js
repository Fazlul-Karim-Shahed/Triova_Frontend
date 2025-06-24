
import axios from "axios"


export const createCategoryApi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/category', obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const updateCategoryApi = (obj, id) => {

    let data = axios.put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/category/' + id, obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}


export const getAllCategoryApi = () => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/category' ).then(data => data.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })
    return data

}

export const getACategoryApi = (id) => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/category/' + id ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const deleteCategoryApi = (id) => {

    let data = axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/category/' + id, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data


}