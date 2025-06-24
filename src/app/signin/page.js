"use client";

import { signinApi } from "@/src/api/AuthApi";
import Logo from "@/src/app/White_Logo.png";
import { saveToken } from "@/src/functions/AuthFunctions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../globals.css";

export default function Signin() {
    const [message, setMessage] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [state, setState] = useState({
        mobile: "",
        password: "",
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        signinApi(state)
            .then((data) => {
                setLoading(false);
                if (data.error) throw data.message;
                saveToken(data.value.token);
                window.location.href = "/";
            })
            .catch((error) => {
                setLoading(false);
                setMessage(error);
            });
    };

    return (
        <div className="font-[sans-serif]">
            <div className="grid lg:grid-cols-2 gap-4 max-lg:gap-12 bg-[#0A0619] to-white px-3 md:px-8 py-12 h-[320px] ">
                <div>
                    <Link href="/">
                        <Image width="100" height="100" src={Logo} alt="logo" className="md:w-40 w-28" />
                    </Link>
                    <div className="max-w-2xl mt-16 max-lg:hidden">
                        <h3 className="text-3xl font-bold text-white">Sign In</h3>
                        <p className="text-sm mt-4 text-white">
                            We&apos;re glad to see you again! Log in to stay connected with the latest updates, special offers, and to make your shopping journey even smoother.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:px-6 px-4 py-8 md:max-w-lg w-full h-max shadow-[0_5px_15px_-3px_rgba(6,81,237,0.6)] max-lg:mx-auto mb-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h3 className="text-3xl font-extrabold text-gray-800">Sign in</h3>
                        </div>

                        {/* Mobile Input */}
                        <div className="mt-4">
                            <label className="text-gray-800 text-sm mb-2 block">Mobile</label>
                            <div className="relative flex items-center">
                                <input
                                    name="mobile"
                                    value={state.mobile}
                                    onChange={handleChange}
                                    type="text"
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="+8801234567890"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#bbb" strokeWidth="2" className="w-5 h-5 absolute right-4" viewBox="0 0 24 24">
                                    <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.72 19.72 0 0 1-8.63-3.07 19.49 19.49 0 0 1-6-6A19.72 19.72 0 0 1 1 4.18 2 2 0 0 1 3 2h4.09a2 2 0 0 1 2 1.72c.12.81.31 1.6.57 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.72a2 2 0 0 1 2.11-.45c.76.26 1.55.45 2.36.57a2 2 0 0 1 1.72 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="mt-4">
                            <label className="text-gray-800 text-sm mb-2 block">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    value={state.password}
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="!@#$%^&*()"
                                />
                                <div className="absolute right-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#bbb" strokeWidth="2">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.273.24-2.49.675-3.6M4.9 4.9L19.1 19.1M15 11a3 3 0 00-3-3M9.88 9.88A3 3 0 0115 15"
                                            />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#bbb" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* <div className="mt-4 text-right">
                            <a href="javascript:void(0);" className="text-gray-500 text-sm font-semibold hover:underline">
                                Forgot your password?
                            </a>
                        </div> */}

                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-full py-3 px-6 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-[#FA1768] to-[#F001FF] hover:shadow-xl focus:outline-none"
                            >
                                {loading ? <div className="loading loading-spinner loading-md"></div> : "Log in"}
                            </button>
                        </div>

                        <p className="text-sm mt-8 text-center text-gray-800">
                            Don&apos;t have an account?
                            <Link href="/signup" className="text-gray-500 font-semibold hover:underline ml-1 whitespace-nowrap">
                                Register here
                            </Link>
                        </p>

                        <span className="text-sm text-center block my-3 text-red-600 font-bold">{message}</span>
                    </form>
                </div>
            </div>
        </div>
    );
}
