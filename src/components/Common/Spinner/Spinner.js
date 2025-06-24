import React from "react";

export default function Spinner({ message }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-600 mb-4"></div>
            <p className="text-lg font-semibold text-purple-600 animate-pulse">{message && message != "" ? message : "Loading data..."}</p>
        </div>
    );
}
