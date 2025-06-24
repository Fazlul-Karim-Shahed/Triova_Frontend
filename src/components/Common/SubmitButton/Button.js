import React from "react";

const colorMap = {
    primary: {
        from: "from-blue-500",
        to: "to-indigo-600",
        hoverFrom: "hover:from-blue-600",
        hoverTo: "hover:to-indigo-700",
        solid: "bg-blue-500",
    },
    success: {
        from: "from-green-500",
        to: "to-green-600",
        hoverFrom: "hover:from-green-600",
        hoverTo: "hover:to-green-700",
        solid: "bg-green-500",
    },
    warning: {
        from: "from-yellow-400",
        to: "to-amber-500",
        hoverFrom: "hover:from-yellow-500",
        hoverTo: "hover:to-amber-600",
        solid: "bg-yellow-400 text-black",
    },
    error: {
        from: "from-red-500",
        to: "to-red-600",
        hoverFrom: "hover:from-red-600",
        hoverTo: "hover:to-red-700",
        solid: "bg-red-500",
    },
    info: {
        from: "from-cyan-500",
        to: "to-sky-500",
        hoverFrom: "hover:from-cyan-600",
        hoverTo: "hover:to-sky-600",
        solid: "bg-cyan-500",
    },
    gray: {
        from: "from-gray-400",
        to: "to-gray-500",
        hoverFrom: "hover:from-gray-500",
        hoverTo: "hover:to-gray-600",
        solid: "bg-gray-400 text-black",
    },
};

const sizeMap = {
    small: "text-sm py-1 px-3",
    regular: "text-base py-2 px-4",
    large: "text-lg py-3 px-6",
};

export default function Button({
    type = "submit",
    loading,
    loadingName = "Loading...",
    className = "",
    color = "primary",
    size = "regular", // 'small', 'regular', or 'large'
    children,
    ...props
}) {
    const selected = colorMap[color] || colorMap.primary;
    const sizeClasses = sizeMap[size] || sizeMap.regular;

    const gradientClasses = `bg-gradient-to-r ${selected.from} ${selected.to} ${selected.hoverFrom} ${selected.hoverTo}`;
    const baseClasses = `text-white ${sizeClasses} rounded shadow transition duration-300 font-medium inline-flex items-center justify-center gap-2`;



    return (
        <button type={type} disabled={loading} className={`${baseClasses} ${loading ? selected.solid : gradientClasses} ${loading ? "cursor-not-allowed opacity-90" : ""} ${className}`} {...props}>
            {loading ? (
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:.3s]"></span>
                    <span>{loadingName}</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
}
