"use client";

import { useState, useEffect } from "react";

export default function ClientImageWithLoader({ src, alt, width, height, className = "", loaderClass = "", ...props }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const img = new window.Image();

        img.src = src;
        img.onload = () => {
            if (isMounted) {
                setIsLoaded(true);
                setIsError(false);
            }
        };
        img.onerror = () => {
            if (isMounted) {
                setIsLoaded(true); // Stop showing spinner
                setIsError(true);
            }
        };

        return () => {
            isMounted = false;
        };
    }, [src]);

    return (
        <div className={`relative w-full h-full ${loaderClass}`}>
            {!isLoaded && !isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            )}

            {!isError ? (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setIsLoaded(true);
                        setIsError(true);
                    }}
                    {...props}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                    <span className="text-sm">Image failed to load</span>
                </div>
            )}
        </div>
    );
}
