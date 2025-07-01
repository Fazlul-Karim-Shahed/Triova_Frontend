"use client";

import React from "react";

export default function Marketing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-pink-100 p-5">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-pink-700 mb-8 drop-shadow-lg">Marketing Services</h1>

                <div className="glassmorphic-card p-10 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg border border-pink-200 text-left">
                    <p className="text-lg text-gray-800 mb-6">
                        At <strong>Triova BD</strong>, we offer powerful marketing solutions to amplify your brand’s voice, build loyal customers, and drive real business results. From fashion
                        startups to large online retailers, our strategies are designed to deliver visibility, engagement, and sales.
                    </p>

                    <h2 className="text-2xl font-semibold text-pink-700 mt-6 mb-3">Our Marketing Expertise</h2>
                    <ul className="list-disc list-inside text-gray-800 space-y-2">
                        <li>
                            <strong>Social Media Marketing:</strong> Reach millions of customers across Facebook, Instagram, and TikTok with platform-optimized campaigns.
                        </li>
                        <li>
                            <strong>Influencer Collaborations:</strong> Partner with fashion influencers to showcase your products to relevant audiences.
                        </li>
                        <li>
                            <strong>Email & SMS Campaigns:</strong> Build customer loyalty and boost retention with personalized messages.
                        </li>
                        <li>
                            <strong>SEO & Content Strategy:</strong> Drive organic traffic with compelling content and optimized product visibility.
                        </li>
                        <li>
                            <strong>Paid Ads:</strong> Run high-converting Google and Meta ad campaigns tailored for fashion e-commerce.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-pink-700 mt-8 mb-3">Why Choose Us?</h2>
                    <p className="text-gray-800 mb-4">
                        We’re not just marketers — we’re storytellers, data analysts, and brand strategists. Every campaign we run is performance-driven, fashion-aware, and ROI-focused.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        <div className="bg-white/70 p-6 rounded-xl shadow-md border border-pink-100">
                            <h3 className="text-xl font-bold text-pink-800">Fashion Campaigns</h3>
                            <p className="text-sm text-gray-700 mt-2">Seasonal and trend-based campaigns crafted to elevate product launches and drive excitement.</p>
                        </div>
                        <div className="bg-white/70 p-6 rounded-xl shadow-md border border-pink-100">
                            <h3 className="text-xl font-bold text-pink-800">Customer Retargeting</h3>
                            <p className="text-sm text-gray-700 mt-2">Win back abandoned carts and re-engage previous shoppers with smart automation.</p>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-shadow shadow-pink-400 hover:shadow-pink-600">
                            Request a Free Marketing Audit
                        </button>
                    </div>
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
