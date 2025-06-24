"use client"
import { checkAuth } from "@/src/functions/AuthFunctions"
import { preloadAuth } from "@/src/redux/store"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function LogoutPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        if (typeof window !== "undefined") { // Check if window object is available
            window.localStorage.removeItem(process.env.NEXT_PUBLIC_LOCAL_TOKEN_NAME)

            checkAuth().then(data => {
                dispatch(preloadAuth({
                    decodedToken: null,
                    authenticated: data
                }))
                window.location.href = "/"
            })
        }
    }, [dispatch])

    return <div className="p-32 text-center">Logging out...</div>
}
