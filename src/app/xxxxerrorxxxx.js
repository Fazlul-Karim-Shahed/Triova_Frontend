"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
    useEffect(() => {
        // window.location.reload();
        useEffect(() => {
            if (error?.message?.includes("__webpack_modules__") || error?.message?.includes("moduleId") || error?.message?.includes("ChunkLoadError")) {
                console.warn("🔥 Detected stale module error — reloading page");
                window.location.reload();
            }
        }, [error]);
    }, [error]);

    const isChunkError = error?.message?.includes("ChunkLoadError");

    return (
        <div className="py-24 flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
            <div className="backdrop-blur-md bg-white/30 shadow-xl rounded-2xl p-8 max-w-md w-full border border-white/40">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Oops, something went wrong!</h2>
                    <p className="text-gray-600 mb-4">{isChunkError ? "The app updated in the background. Please click below to reload." : "An unexpected error occurred. Please try again."}</p>
                    <button
                        onClick={() => {
                            if (isChunkError) {
                                window.location.reload();
                            } else {
                                reset();
                            }
                        }}
                        className="mt-4 px-6 py-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all duration-300"
                    >
                        {isChunkError ? "Reload Page" : "Try Again"}
                    </button>
                </div>
            </div>
        </div>
    );
}
