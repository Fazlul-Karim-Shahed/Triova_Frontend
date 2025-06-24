
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