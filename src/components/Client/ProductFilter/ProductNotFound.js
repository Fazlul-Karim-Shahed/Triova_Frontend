"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductNotFound() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center px-4 text-gray-700 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-[400px] h-[400px] bg-gradient-radial from-brand-50 via-white to-transparent rounded-full blur-3xl opacity-40" />
            </div>

            {/* SVG Illustration */}
            <svg className="w-52 md:w-72 h-52 md:h-72 animate-float transform-gpu" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bagGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f1f5f9" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                    <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <radialGradient id="sparkle" r="50%" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Shadow */}
                <ellipse cx="250" cy="430" rx="90" ry="18" fill="#e2e8f0" />

                {/* Bag Body */}
                <g className="origin-center animate-tilt">
                    <rect x="150" y="160" width="200" height="240" rx="30" fill="url(#bagGradient)" stroke="#94a3b8" strokeWidth="2" />
                    {/* Fold */}
                    <path d="M150 180 Q250 100 350 180" fill="#ffffff" opacity="0.6" />
                    {/* Handle */}
                    <path d="M185 160 Q185 110 250 110 Q315 110 315 160" fill="none" stroke="url(#handleGradient)" strokeWidth="6" strokeLinecap="round" />
                    {/* Eyes (blink animation) */}
                    <circle cx="210" cy="260" r="8" fill="#475569" className="animate-blink delay-0" />
                    <circle cx="290" cy="260" r="8" fill="#475569" className="animate-blink delay-200" />
                    {/* Sad mouth */}
                    <path d="M220 300 Q250 320 280 300" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* Shine on bag */}
                    <path d="M170 170 Q250 120 330 170" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                </g>

                {/* Sparkles */}
                <g className="animate-sparkle">
                    <circle cx="90" cy="90" r="4" fill="url(#sparkle)" />
                    <circle cx="420" cy="100" r="3" fill="url(#sparkle)" />
                    <circle cx="110" cy="370" r="3" fill="url(#sparkle)" />
                    <circle cx="400" cy="370" r="4" fill="url(#sparkle)" />
                </g>
            </svg>

            {/* Headings */}
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-800 ">Product Not Found</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">It looks like the item you’re looking for is not available. It may have been removed or never existed.</p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative mt-8 w-full max-w-md">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for another product..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-full bg-white/60 backdrop-blur-md shadow-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
                />
                <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 hover:text-brand-700" aria-label="Search">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                </button>
            </form>

            {/* Floating Animation */}
            <style jsx>{`
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-tilt {
                    animation: tilt 2s ease-in-out infinite;
                }
                .animate-blink {
                    animation: blink 2s infinite;
                    transform-origin: center;
                }
                .animate-blink.delay-200 {
                    animation-delay: 0.2s;
                }
                .animate-sparkle {
                    animation: sparkle 6s ease-in-out infinite;
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes tilt {
                    0%,
                    100% {
                        transform: rotate(0deg);
                    }
                    50% {
                        transform: rotate(1.5deg);
                    }
                }

                @keyframes blink {
                    0%,
                    90%,
                    100% {
                        r: 8;
                    }
                    92%,
                    98% {
                        r: 2;
                    }
                }

                @keyframes sparkle {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }
            `}</style>
        </div>
    );
}
