"use client";

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center text-gray-600">
            <svg className="w-48 h-48" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="softGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f3f4f6" />
                        <stop offset="100%" stopColor="#e5e7eb" />
                    </linearGradient>
                </defs>

                {/* Cart Base */}
                <path d="M50 50 H150 L135 115 H65 L50 50 Z" fill="url(#softGradient)" stroke="#d1d5db" strokeWidth="2" />

                {/* Handle */}
                <line x1="50" y1="50" x2="30" y2="20" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />

                {/* Wheels */}
                <circle cx="75" cy="135" r="10" fill="#f9fafb" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="125" cy="135" r="10" fill="#f9fafb" stroke="#9ca3af" strokeWidth="2" />

                {/* Subtle Accent Shapes */}
                <circle cx="28" cy="155" r="3" fill="#d1d5db" />
                <circle cx="165" cy="38" r="2" fill="#d1d5db" />
                <path d="M150 30 l4 -4" stroke="#e5e7eb" strokeWidth="1.5" />
                <path d="M60 30 l-4 4" stroke="#e5e7eb" strokeWidth="1.5" />
            </svg>

            <h2 className=" text-lg font-medium">Your cart is empty</h2>
        </div>
    );
}
