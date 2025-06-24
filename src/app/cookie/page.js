"use client";

import React from "react";

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 p-5">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-amber-700 mb-8 drop-shadow-lg">Cookie Policy</h1>

                <div className="glassmorphic-card p-10 rounded-3xl shadow-2xl bg-white/50 backdrop-blur-lg border border-amber-200 text-left">
                    <p className="text-lg text-gray-800 mb-6">
                        At <strong>Triova Limited</strong>, we use cookies and similar tracking technologies to enhance your browsing experience, personalize content, and analyze website traffic. This
                        policy outlines how and why we use cookies on our platform.
                    </p>

                    <h2 className="text-2xl font-semibold text-amber-700 mt-6 mb-3">What Are Cookies?</h2>
                    <p className="text-gray-800 mb-4">
                        Cookies are small data files stored on your device when you visit a website. They help us remember your preferences, login status, and provide you with a smoother and more
                        personalized experience.
                    </p>

                    <h2 className="text-2xl font-semibold text-amber-700 mt-6 mb-3">Types of Cookies We Use</h2>
                    <ul className="list-disc list-inside text-gray-800 space-y-2">
                        <li>
                            <strong>Essential Cookies:</strong> Necessary for the core functionality of our website (e.g., secure login).
                        </li>
                        <li>
                            <strong>Performance Cookies:</strong> Help us understand how visitors interact with our site by collecting anonymous data.
                        </li>
                        <li>
                            <strong>Functionality Cookies:</strong> Remember your preferences and enhance your user experience.
                        </li>
                        <li>
                            <strong>Marketing Cookies:</strong> Used to deliver relevant ads and measure the effectiveness of our advertising campaigns.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-amber-700 mt-6 mb-3">How You Can Manage Cookies</h2>
                    <p className="text-gray-800 mb-4">
                        You can control and/or delete cookies through your browser settings. Most browsers allow you to block or delete cookies, but this may affect how certain parts of our website
                        function.
                    </p>

                    <p className="text-gray-700 mt-6">
                        By using our website, you agree to our use of cookies as outlined in this policy. We may update this policy from time to time, so we recommend reviewing it periodically.
                    </p>
                </div>
            </div>

            <style jsx>{`
                .glassmorphic-card {
                    backdrop-filter: saturate(180%) blur(18px);
                    -webkit-backdrop-filter: saturate(180%) blur(18px);
                }
            `}</style>
        </div>
    );
}
