"use client";

import { useEffect } from "react";

export default function ClientErrorBoundary({ children }) {
    useEffect(() => {
        const handler = (e) => {
            if (e?.message?.includes("ChunkLoadError")) {
                console.warn("ChunkLoadError detected. Reloading...");
                // window.location.reload();
            }
        };

        window.addEventListener("error", handler);
        return () => window.removeEventListener("error", handler);
    }, []);

    return children;
}
