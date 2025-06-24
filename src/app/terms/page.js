"use client";
import React from "react";

export default function Terms() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-5">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">Terms of Use</h1>

                <div className="glassmorphic-card text-left p-10 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-gray-200">
                    <p className="text-gray-800 text-lg mb-6">
                        By accessing or using Triova Limited’s website, mobile app, or services, you agree to comply with and be bound by the following terms and conditions. Please read them
                        carefully.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 mb-6">
                        These Terms of Use form a legally binding agreement between you and Triova Limited. If you do not agree with any part of these terms, you may not use our services.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">2. Eligibility</h2>
                    <p className="text-gray-700 mb-6">You must be at least 18 years old or have legal parental/guardian consent to use our services.</p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">3. User Responsibilities</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
                        <li>Provide accurate information when registering or placing orders.</li>
                        <li>Maintain the confidentiality of your account credentials.</li>
                        <li>Do not use our platform for illegal or unauthorized purposes.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">4. Intellectual Property</h2>
                    <p className="text-gray-700 mb-6">
                        All content on Triova Limited (including logos, graphics, and product listings) is protected by copyright and intellectual property laws. You may not reuse or redistribute
                        content without our written permission.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">5. Order Acceptance & Cancellation</h2>
                    <p className="text-gray-700 mb-6">
                        We reserve the right to refuse or cancel any order for any reason, including but not limited to stock availability, pricing errors, or suspected fraud.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">6. Limitation of Liability</h2>
                    <p className="text-gray-700 mb-6">Triova Limited is not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">7. Modifications</h2>
                    <p className="text-gray-700 mb-6">We may update these terms from time to time. Continued use of our services after changes means you accept the new terms.</p>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">8. Governing Law</h2>
                    <p className="text-gray-700 mb-6">These Terms of Use are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka.</p>

                    <p className="text-sm text-gray-500 mt-6">Last updated: June 2025</p>
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
