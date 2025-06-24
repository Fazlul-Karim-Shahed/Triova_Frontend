




import axios from "axios"


export const createSubBrandApi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-brand', obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const updateSubBrandApi = (obj, id) => {

    let data = axios.put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-brand/' + id, obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}


export const getAllSubBrandApi = () => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-brand' ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const getSubBrandByCategoryApi = (category_id) => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-brand/category/' + category_id ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const getASubBrandApi = (id) => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-brand/' + id ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const deleteSubBrandApi = (id) => {

    let data = axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sub-brand/' + id, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data


}