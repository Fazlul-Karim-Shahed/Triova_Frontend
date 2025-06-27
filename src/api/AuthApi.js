
import axios from "axios"


export const signinApi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/signin", obj).then(data => data.data).catch(err => {
        return { message: `Something went wrong. - (${err.message}). Try again`, error: true }
    })

    return data

}


export const signupApi = (obj) => {

    let data = axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/signup", obj).then(data => data.data).catch(err => {
        return { message: `Something went wrong. - (${err.message}). Try again`, error: true }
    })

    return data

}


export const getAllAdminApi = (obj) => {
    let data = axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth", {
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