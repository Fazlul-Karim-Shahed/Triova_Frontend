"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccessDenied from "../components/Common/AccessDenied/AccessDenied";

export default function PromoterContext({ children }) {
    const store = useSelector((store) => store.triova);
    const [state, setState] = useState(false);

    useEffect(() => {
        setState(true);
    }, []);

    if (!state)
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-14 h-14 border-4 border-t-transparent border-purple-400 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-semibold text-purple-700 animate-pulse drop-shadow">Varifying. Please wait...</p>
            </div>
        );

    return store.authenticated && store.decodedToken.role === "promoter" ? children : <AccessDenied />;
}
