import axios from "axios";



export const createSettingsApi = (obj) => {
    let data = axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/settings", obj, {
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



export const updateSettingsApi = (id, obj) => {
    return axios
        .put(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/settings/" + id, obj, {
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


export const getSettingsApi = () => {
    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/settings/", { cache: "no-store" })
        .then((response) => response.json())
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};