"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Modal({ open, handleOpen, error, message, loading }) {
    const [typedMessage, setTypedMessage] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        if (open && !loading && message) {
            const capitalizedMessage = String(message).charAt(0).toUpperCase() + String(message).slice(1);
            let i = 0;
            const typingEffect = setInterval(() => {
                setTypedMessage(capitalizedMessage.slice(0, i + 1));
                i++;
                if (i >= capitalizedMessage.length) {
                    clearInterval(typingEffect);
                }
            }, 40);
            return () => clearInterval(typingEffect);
        } else {
            setTypedMessage("");
        }
    }, [open, message, loading]);

    if (!open || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] bg-white/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                className={`w-full max-w-xl relative rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] text-center border backdrop-blur-xl bg-white/70 transition-all duration-500 transform animate-modalDrop ${
                    error ? "border-red-200" : "border-emerald-200"
                }`}
            >
                {/* Background Effects */}
                <div className={`absolute -inset-1 rounded-3xl blur-2xl opacity-30 -z-10 ${
                    error
                        ? "bg-gradient-to-tr from-red-200 via-red-100 to-pink-100 animate-pulse"
                        : "bg-gradient-to-tr from-yellow-200 via-pink-100 to-emerald-100 animate-pulse"
                }`} />

                {/* Modal content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-14 h-14 border-4 border-t-transparent border-purple-400 rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-semibold text-purple-700 animate-pulse drop-shadow">{message || "Loading..."}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-6">
                            {error ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-400 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12" y2="16" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            )}
                        </div>

                        <h3 className="text-2xl font-semibold text-gray-800 drop-shadow-sm mb-6">{typedMessage}</h3>

                        <button
                            onClick={handleOpen}
                            className="mt-2 px-6 py-2 text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Close
                        </button>
                    </>
                )}
            </div>

            {/* Tailwind animation styles */}
            <style jsx>{`
                @keyframes modalDrop {
                    0% {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-modalDrop {
                    animation: modalDrop 0.4s ease-out;
                }
            `}</style>
        </div>,
        document.body
    );
}
