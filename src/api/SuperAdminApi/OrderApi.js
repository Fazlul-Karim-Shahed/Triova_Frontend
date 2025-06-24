


import axios from "axios"


export const createOrderApi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/order', obj, {
        headers: {
            // "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

// export const updateBrandApi = (obj, id) => {

//     let data = axios.put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/brand/' + id, obj, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//             "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
//         }
//     }).then(response => response.data).catch(error => {
//         return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
//     })

//     return data

// }


export const updateOrderStatusApi = (id, obj) => {

    let data = axios.put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/order/' + id, { ...obj }, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        }
    }).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}


export const getAllOrdersApi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/order/get', obj ).then(response => response.data).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

export const getAnOrderApi = async (orderId) => {
  try {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    return { data };
  } catch (err) {
    return { error: "Failed to fetch order." };
  }
};

export const deleteOrderApi = (id) => {
    let data = axios
        .delete(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/order/" + id, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};


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

// export const deleteBrandApi = (id) => {

//     let data = axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/brand/' + id, {
//         headers: {
//             "Authorization": "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
//         }
//     }).then(response => response.data).catch(error => {
//         return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
//     })

//     return data


// }