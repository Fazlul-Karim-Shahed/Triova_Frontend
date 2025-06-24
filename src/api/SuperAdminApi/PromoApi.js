import axios from "axios";

export const createPromoApi = (obj) => {
    let data = axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/promo", obj, {
            headers: {
                "Content-Type": "multipart/form-data",
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

export const getAllPromoApi = () => {
    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/promo")
        .then((response) => response.json())
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const getAPromoApi = (code) => {
    let data = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/promo/" + code)
        .then((response) => response.json())
        .catch((error) => {
            return { message: `Something went wrong. - (${error.message}). Try again`, error: true };
        });

    return data;
};

export const deletPromoApi = (id) => {
    let data = axios
        .delete(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/promo/" + id, {
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
