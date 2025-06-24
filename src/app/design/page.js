"use client";

import React from "react";

export default function Design() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-5">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-rose-700 mb-8 drop-shadow-lg">Design Services</h1>

                <div className="glassmorphic-card p-10 rounded-3xl shadow-2xl bg-white/50 backdrop-blur-lg border border-rose-200 text-left">
                    <p className="text-lg text-gray-800 mb-6">
                        At <strong>Triova Limited</strong>, our in-house design team transforms ideas into visually captivating experiences. Whether you're launching a fashion brand or refreshing your
                        existing style, we provide creative solutions that align perfectly with your business goals.
                    </p>

                    <h2 className="text-2xl font-semibold text-rose-700 mt-6 mb-3">What We Offer</h2>
                    <ul className="list-disc list-inside text-gray-800 space-y-2">
                        <li>
                            <strong>Logo & Brand Identity:</strong> A unique and memorable brand identity that defines your presence in the fashion industry.
                        </li>
                        <li>
                            <strong>Product & Packaging Design:</strong> Visually stunning layouts that elevate your product appeal.
                        </li>
                        <li>
                            <strong>Social Media Creatives:</strong> Eye-catching visuals and templates to boost engagement across platforms.
                        </li>
                        <li>
                            <strong>UI/UX Design:</strong> Clean, user-focused interfaces that turn visitors into customers.
                        </li>
                        <li>
                            <strong>Ad Banners & Visual Assets:</strong> Designs that convert clicks into sales.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-rose-700 mt-6 mb-3">Why Design Matters</h2>
                    <p className="text-gray-800 mb-4">
                        In the competitive world of fashion and e-commerce, first impressions are everything. Our expert designers ensure your brand communicates trust, elegance, and creativity from
                        the very first glance.
                    </p>

                    <h2 className="text-2xl font-semibold text-rose-700 mt-6 mb-3">Tailored for You</h2>
                    <p className="text-gray-800 mb-6">
                        We don’t believe in one-size-fits-all. Whether you're a startup or an established fashion label, our design packages are flexible and scalable to meet your exact needs.
                    </p>

                    <div className="text-center mt-10">
                        <button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3 rounded-full transition-shadow shadow-rose-400 hover:shadow-rose-600">
                            Book a Free Design Consultation
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
