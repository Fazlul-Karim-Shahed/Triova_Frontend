import axios from "axios";

export const createEventApi = (obj) => {
    let data = axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/event", obj, {
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

export const updateEventApi = (id, obj) => {
    return axios
        .put(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/event/" + id, obj, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME),
            },
        })
        .then((response) => response.data)
        .catch((error) => ({
            message: `Update failed - (${error.message})`,
            error: true,
        }));
};


export const getAllEventApi = (today) => {
    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/event/" + today, { cache: "no-store" })
        .then((response) => response.json())
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const getAEventApi = (name) => {
    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/event/single/" + name, { cache: "no-store" })
        .then((response) => response.json())
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const deleteEventApi = (id) => {
    let data = axios
        .delete(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/event/" + id, {
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
