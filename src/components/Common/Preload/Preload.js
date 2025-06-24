
"use client"

import { checkAuth, tokenDecode } from "@/src/functions/AuthFunctions"
import { getReduxCart, preloadAuth } from "@/src/redux/store"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Preload() {

    const dispath = useDispatch()

    useEffect(() => {

        tokenDecode().then(data => {
            checkAuth().then(auth => {

                dispath(preloadAuth({
                    decodedToken: data,
                    authenticated: auth
                }))

            })
        })

        dispath(getReduxCart({
            cart: localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME) ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)).length : 0
        }))


    }, [])



    return <div></div>
}
