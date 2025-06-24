"use client";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-600 mb-4"></div>
                <p className="text-lg font-semibold text-purple-600 animate-pulse">Loading data...</p>
            </div>
        </div>
    );
}
