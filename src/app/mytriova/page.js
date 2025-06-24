"use client";
import { getAProfileApi } from "@/src/api/SuperAdminApi/ProfileApi";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import AuthContext from "@/src/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyTriovaPage() {
    const [user, setUser] = useState(null);
    const store = useSelector((state) => state.triova);

    useEffect(() => {
        getAProfileApi(store.decodedToken && store.decodedToken._id, store.decodedToken && store.decodedToken.role).then((data) => {
            if (!data.error) {
                setUser(data.data);
            }
        });
    }, []);

    return (
        <AuthContext>
            {user ? (
                <div className="bg-white py-10 px-4 flex items-center justify-center pt-28 md:pt-20 w-full">
                    <div className="w-full md:max-w-5xl flex flex-col md:grid md:grid-cols-3 gap-6">
                        {/* Sidebar */}
                        <div className="w-full md:col-span-1 bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-xl rounded-2xl p-6 border border-gray-200 mb-6 md:mb-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                                    {user.image?.type ? (
                                        <ClientImageWithLoader src={`data:${user.image.contentType};base64,${user.image.type}`} alt={user.firstName} width={96} height={96} className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">{user.firstName?.[0]?.toUpperCase() || "U"}</div>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {user.firstName} {user.lastName || ""}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{user.email || "No Email Provided"}</p>
                                <Link
                                    href="/mytriova/history"
                                    className="mt-6 inline-block w-full text-center py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition duration-300"
                                >
                                    Order History
                                </Link>
                            </div>
                        </div>

                        {/* Main Details */}
                        <div className="w-full md:col-span-2 bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-700 mb-6">Profile Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Mobile */}
                                <div className="bg-white bg-opacity-90 rounded-xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition">
                                    <h4 className="text-gray-700 font-semibold mb-1 flex items-center">
                                        Mobile
                                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${user.mobileVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {user.mobileVerified ? "Verified" : "Not Verified"}
                                        </span>
                                    </h4>
                                    <p className="text-gray-600 text-sm">{user.mobile}</p>
                                </div>

                                {/* Address */}
                                <div className="bg-white bg-opacity-90 rounded-xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition">
                                    <h4 className="text-gray-700 font-semibold mb-1">Address</h4>
                                    <p className="text-gray-600 text-sm">{user.address || "Address not provided"}</p>
                                    <p className="text-gray-500 text-xs mt-1">{user.zip || ""}</p>
                                </div>

                                {/* Role */}
                                <div className="bg-white bg-opacity-90 rounded-xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition">
                                    <h4 className="text-gray-700 font-semibold mb-1">Role</h4>
                                    <p className="text-gray-600 text-sm">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                                </div>

                                {/* Member Since */}
                                <div className="bg-white bg-opacity-90 rounded-xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition">
                                    <h4 className="text-gray-700 font-semibold mb-1">Member Since</h4>
                                    <p className="text-gray-600 text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Edit Profile Button */}
                            <div className="mt-10 text-right">
                                <button className="py-2 px-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold hover:shadow-xl transition">Edit Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="font-bold text-gray-600 p-28">Loading...</h1>
                </div>
            )}
        </AuthContext>
    );
}
