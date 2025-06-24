import axios from "axios";

export const createDepartmentApi = (obj) => {
    let data = axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/department", obj, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const updateDepartmentApi = (obj, id) => {
    let data = axios
        .put(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/department/" + id, obj, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const getAllDepartmentApi = (query) => {
    let data = axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/department/get", query)
        .then((response) => {
            //console.log("Department: ", response.data)
            return response.data;
        })
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const deleteDepartmentApi = (id) => {
    let data = axios
        .delete(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/department/" + id, {
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
