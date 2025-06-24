

import { jwtDecode } from "jwt-decode"

export const saveToken = (value) => {

    const token = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
    if (token) {
        localStorage.removeItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
        localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME, value)
    }
    else {
        localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME, value)
    }

}

export const checkAuth = async () => {

    const token = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
    if (token) {
        let data = await jwtDecode(token)

        if (data) {
            let time = new Date().getTime()
            if (time < new Date(data.exp * 1000)) return true;
            else return false
        }
        else return false
    }
    return false

}

export const tokenDecode = async () => {

    const token = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)
    if (token && checkAuth()) {
        const data = await jwtDecode(token)
        return data
    }
    else return null

}