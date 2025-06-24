




import axios from "axios"


export const createBatchpi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/batch', obj, {
        headers: {
            "Content-Type": "multipart/form-data",
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


export const getAllBatchApi = () => {

    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/batch', {cache: 'no-store'} ).then(response => response.json()).catch(error => {
        return { message: `Something went wrong. - (${error.message}). Try again`, error: true }
    })

    return data

}

// Fetch batch by ID
export async function getBatchByIdApi(batchId) {
  // Fetch from backend, example:
  try {
    const res = await fetch(`/api/batches/${batchId}`);
    const data = await res.json();
    return data; // { error: false, data: { ...batch } }
  } catch (err) {
    return { error: true, message: "Failed to fetch batch" };
  }
}

// Update batch
export async function updateBatchApi(batchId, updatedData) {
  try {
    const res = await fetch(`/api/batches/${batchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    const data = await res.json();
    return data; // { error: false, message: "Batch updated successfully" }
  } catch (err) {
    return { error: true, message: "Failed to update batch" };
  }
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