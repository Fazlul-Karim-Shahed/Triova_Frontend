"use client";
import React from "react";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-5">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">Privacy Policy</h1>

                <div className="glassmorphic-card text-left p-10 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-gray-200">
                    <p className="text-gray-800 text-lg mb-6">
                        At <strong>Triova Limited</strong>, your privacy is our top priority. We are committed to safeguarding your personal information and maintaining transparency in how we collect,
                        use, and protect it.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">1. Information We Collect</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
                        <li>Personal information such as name, email, phone number, and address.</li>
                        <li>Order history, browsing behavior, and preferences.</li>
                        <li>Device and usage information (IP address, browser type, device model).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">2. How We Use Your Data</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
                        <li>To process orders and deliver your products.</li>
                        <li>To personalize your shopping experience.</li>
                        <li>To improve our website and customer service.</li>
                        <li>To send promotional offers (only if opted-in).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">3. Sharing Your Data</h2>
                    <p className="text-gray-700 mb-6">
                        We never sell your personal data. We may share information with trusted third parties (like payment gateways or delivery services) solely for service fulfillment purposes.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">4. Your Rights</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
                        <li>Access your data at any time.</li>
                        <li>Request correction or deletion of personal information.</li>
                        <li>Withdraw consent for marketing communications.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">5. Data Protection</h2>
                    <p className="text-gray-700 mb-6">We use encryption, secure servers, and authentication systems to ensure your data is protected against unauthorized access or misuse.</p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">6. Cookies</h2>
                    <p className="text-gray-700 mb-6">
                        Cookies help us personalize your shopping experience and analyze site traffic. You can manage cookie preferences through your browser settings. See our{" "}
                        <a href="/cookie-policy" className="text-blue-600 underline">
                            Cookie Policy
                        </a>{" "}
                        for more.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">7. Contact Us</h2>
                    <p className="text-gray-700 mb-6">
                        For questions about your data or this privacy policy, contact us at{" "}
                        <a href="mailto:privacy@triovalimited.com" className="text-blue-600 underline">
                            privacy@triovalimited.com
                        </a>
                        .
                    </p>

                    <p className="text-sm text-gray-500">Last updated: June 2025</p>
                </div>
            </div>

            <style jsx>{`
                .glassmorphic-card {
                    backdrop-filter: saturate(180%) blur(20px);
                    -webkit-backdrop-filter: saturate(180%) blur(20px);
                }
            `}</style>
        </div>
    );
}
