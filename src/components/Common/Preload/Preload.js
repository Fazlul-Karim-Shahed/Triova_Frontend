"use client";

import { getSettingsApi } from "@/src/api/SuperAdminApi/SettingsApi";
import { checkAuth, tokenDecode } from "@/src/functions/AuthFunctions";
import { getReduxCart, getSettngs, preloadAuth } from "@/src/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Preload() {
    const dispath = useDispatch();

    useEffect(() => {
        tokenDecode().then((data) => {
            checkAuth().then((auth) => {
                dispath(
                    preloadAuth({
                        decodedToken: data,
                        authenticated: auth,
                    })
                );
            });
        });

        getSettingsApi().then((data) => {
            if (!data.error) {
                dispath(
                    getSettngs({
                        settings: data.data,
                    })
                );
            }
        });
        dispath(
            getReduxCart({
                cart: localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME) ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)).length : 0,
            })
        );
    }, []);

    return <div></div>;
}
