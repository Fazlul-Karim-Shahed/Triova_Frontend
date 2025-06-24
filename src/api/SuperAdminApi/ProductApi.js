

import axios from "axios"


export const createProductpi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/product', obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const updateProductApi = (id, obj) => {

    let data = axios.put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/product/' + id, obj, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}


export const getAllProductApi = (limit, searchObj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/product/get?limit=${limit ? limit : 0}`, searchObj ).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const getAProductApi = (id) => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/product/' + id ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

// export const getBrandByCategoryApi = (category_id) => {

//     let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/brand/category/' + category_id ).then(response => response.json()).catch(error => {
//         return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
//     })

//     return data

// }

// export const getABrandApi = (id) => {

//     let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/brand/' + id ).then(response => response.json()).catch(error => {
//         return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
//     })

//     return data

// }

export const deleteProductApi = (id) => {

    let data = axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/product/' + id, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data


}