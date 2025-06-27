
import axios from "axios";

export const createTaskApi = (obj) => {
    let data = axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/task", obj, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return {
                message: `Something went wrong. - (${error.message}). Try again`,
                error: true,
            };
        });

    return data;
};

export const updateTaskStatusApi = (id, obj) => {
    let data = axios
        .put(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/task" + "/" + id, obj, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return {
                message: `Something went wrong. - (${error.message}). Try again`,
                error: true,
            };
        });

    return data;
};

export const deleteTaskApi = (id) => {
    let data = axios
        .delete(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/task" + "/" + id, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return {
                message: `Something went wrong. - (${error.message}). Try again`,
                error: true,
            };
        });

    return data;
};

export const getAllTasksApi = () => {
    let data = axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/task", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return {
                message: `Something went wrong. - (${error.message}). Try again`,
                error: true,
            };
        });

    return data;
};

export const getIndividualTasksApi = (id) => {
    let data = axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/task" + "/" + id, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            return {
                message: `Something went wrong. - (${error.message}). Try again`,
                error: true,
            };
        });

    return data;
};