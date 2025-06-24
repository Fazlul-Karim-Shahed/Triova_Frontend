"use client";

import Logo from "@/public/Logo_Trans.svg";
import { signupApi } from "@/src/api/AuthApi";
import { saveToken } from "@/src/functions/AuthFunctions";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AdminRegistration() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        role: "",
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

        const regex = /^(?:\+?88)?01[3-9]\d{8}$/;

        if (regex.test(state.mobile) == false) {
            setModalState({ error: true, message: "Invalid phone number", open: true });
            setLoading(false);
            return;
        }

        signupApi(state)
            .then((data) => {
                //console.log(data);
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
        <div className="">
            <div className="grid lg:grid-cols-2 gap-4 max-lg:gap-12 bg-gradient-to-r from-brand-800 to-brand-900 px-3 md:px-8 py-12 h-[320px]">
                <div>
                    <Link href="/">
                        <Image width="100" height="100" src={Logo} alt="logo" className="md:w-40 w-28" />
                    </Link>
                    <div className="max-w-2xl mt-16 max-lg:hidden">
                        <h3 className="text-3xl font-bold text-red-500">Create an account</h3>
                        <p className="text-sm mt-4 text-white">
                            Join us and discover a world of shopping delights. Create an account to enjoy personalized shopping, exclusive deals, and hassle-free order management.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:px-6 px-4 py-8 md:max-w-lg w-full h-max shadow-[0_5px_15px_-3px_rgba(6,81,237,0.6)] max-lg:mx-auto mb-5">
                    <form onSubmit={handleSubmit} className="">
                        <div className="mb-8">
                            <h3 className="text-3xl font-extrabold text-red-600">Internal Registration</h3>
                        </div>

                        <div className="mt-4">
                            <label className="text-gray-800 text-sm mb-2 block font-bold ">Role</label>
                            <select
                                name="role"
                                value={state.role}
                                onChange={(e) => handleChange(e)}
                                className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                            >
                                <option value="">--Select--</option>
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                                <option value="superAdmin">Super Admin</option>
                            </select>
                        </div>

                        <div className="mt-4 grid md:grid-cols-2 md:gap-4">
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">First name</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="firstName"
                                        value={state.firstName}
                                        onChange={(e) => handleChange(e)}
                                        type="text"
                                        required
                                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="John"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path
                                            d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                            data-original="#000000"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="md:mt-0 mt-4">
                                <label className="text-gray-800 text-sm mb-2 block">Last name</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="lastName"
                                        value={state.lastName}
                                        onChange={(e) => handleChange(e)}
                                        type="text"
                                        required
                                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="Doe"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path
                                            d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                            data-original="#000000"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-gray-800 text-sm mb-2 block">Mobile</label>
                            <div className="relative flex items-center">
                                <input
                                    name="mobile"
                                    value={state.mobile}
                                    onChange={(e) => handleChange(e)}
                                    type="text"
                                    minLength="11"
                                    maxLength="13"
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="+8801234567890"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                    <path
                                        d="M20.487 15.14l-4.821-1.069a1.001 1.001 0 0 0-.979.271l-2.209 2.209c-2.615-1.392-4.752-3.529-6.144-6.144l2.209-2.209a1.001 1.001 0 0 0 .271-.979L8.86 3.513a1.001 1.001 0 0 0-1.006-.724A11.936 11.936 0 0 0 2.002 4.178a1.001 1.001 0 0 0-.271 1.023c1.251 4.063 3.903 7.653 7.331 10.081 3.428 2.427 7.018 4.079 10.081 5.331a1.001 1.001 0 0 0 1.023-.271 11.936 11.936 0 0 0 1.389-5.852 1.001 1.001 0 0 0-.724-1.006z"
                                        data-original="#000000"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-gray-800 text-sm mb-2 block">Email</label>
                            <div className="relative flex items-center">
                                <input
                                    name="email"
                                    value={state.email}
                                    onChange={(e) => handleChange(e)}
                                    type="email"
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="abc@example.com"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01l-8 5-8-5V6h16zM4 18v-8l8 5 8-5v8H4z" data-original="#000000"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-gray-800 text-sm mb-2 block">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    value={state.password}
                                    onChange={(e) => handleChange(e)}
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="!@#$%^&*()"
                                />
                                <svg
                                    onClick={() => setShowPassword(!showPassword)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-[20px] h-[20px] absolute right-4 cursor-pointer text-gray-500"
                                >
                                    {showPassword ? (
                                        // Eye-off icon
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-10-7 1.094-2.593 2.987-4.75 5.4-6.03M15 12a3 3 0 01-3 3m0 0a3 3 0 01-3-3m3 3V9m4.243 1.757a9.965 9.965 0 011.757 3.243M9.88 4.12l9 9M3 3l18 18"
                                        />
                                    ) : (
                                        // Eye icon
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                                        />
                                    )}
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6 mt-4">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="remember_me" className="text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-[#FA1768] to-[#ff0000] hover:shadow-xl focus:outline-none focus:bg-green-900 rounded-md"
                            >
                                {loading ? <div className="loading loading-spinner loading-md"></div> : "Sign up"}
                            </button>
                        </div>

                        <span className="text-sm text-center block my-3 text-red-600 font-bold">{message}</span>
                    </form>
                </div>
            </div>
        </div>
    );
}
