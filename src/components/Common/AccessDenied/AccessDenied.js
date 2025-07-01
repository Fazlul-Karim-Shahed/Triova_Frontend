"use client";
import Link from "next/link";
import React from "react";

export default function AccessDenied() {
    return (
        <div className="min-h-screen w-full backdrop-blur-lg bg-black bg-[url('https://static.vecteezy.com/system/resources/previews/000/151/791/large_2x/falling-numbers-matrix-background-vector.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-[0_0_30px_5px_rgba(0,255,255,0.2)] p-8 md:p-12 max-w-md w-full text-center animate-fade-in-up text-white">
                <div className="text-red-500 text-5xl md:text-6xl font-bold drop-shadow-md mb-4 animate-pulse">ACCESS DENIED</div>
                <p className="text-lg md:text-xl text-gray-300 mb-3">You do not have the necessary permissions to view this page.</p>
                <p className="text-sm text-gray-400 mb-6">
                    <span className="text-red-400">Error 403:</span> Forbidden Access
                </p>
                <Link href="/signin" className="inline-block bg-cyan-500 hover:bg-cyan-600 transition px-6 py-2 rounded-full font-semibold text-black shadow-md hover:shadow-cyan-400/50">
                    🔐 Return to Login
                </Link>
                <div className="mt-8 text-2xl animate-fade-in-up-slow">🚫🚫🚫🚫🚫</div>
            </div>
        </div>
    );
}
