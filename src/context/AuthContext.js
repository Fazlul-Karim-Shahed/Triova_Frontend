"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AuthContext({ children }) {
    const store = useSelector((store) => store.triova);
    const [state, setState] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setState(true);
        const timeout = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    if (!state)
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-14 h-14 border-4 border-t-transparent border-purple-400 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-semibold text-purple-700 animate-pulse drop-shadow">Varifying. Please wait...</p>
            </div>
        );

    return store.authenticated ? (
        children
    ) : (
        <div className={`my-10 flex justify-center items-center px-4 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"} transition-all duration-700 ease-out`}>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl p-8 text-center max-w-md w-full transform hover:shadow-2xl transition duration-300">
                {/* SVG Lock Icon */}
                <div className="w-10 h-24 mx-auto mb-6 animate-bounce-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white/80 drop-shadow">
                        <path
                            fillRule="evenodd"
                            d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9zm3 3a1 1 0 00-.993.883L11 14v2.586l-.293.293a1 1 0 001.32 1.497l.094-.083L13 17.414V14a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-black mb-4 drop-shadow">Oops! You’re Locked Out</h2>
                <p className="text-white/80 mb-6">It looks like you’re not authenticated. Please log in to continue.</p>
                <Link href="/signin">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold py-3 px-6 rounded-full shadow-md hover:brightness-110 transition duration-300">
                        Login Now
                    </button>
                </Link>
            </div>
        </div>
    );
}
