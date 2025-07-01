"use client";

import React from "react";

export default function PressKit() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-100 p-5">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-indigo-700 mb-8 drop-shadow-lg">Press Kit</h1>

                <div className="glassmorphic-card p-10 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg border border-indigo-200 text-left">
                    <p className="text-lg text-gray-800 mb-6">
                        Welcome to the official Triova BD Press Kit — your one-stop destination for brand assets, media tools, and press-ready content. Whether you're writing about us, collaborating
                        on a feature, or just showcasing our story, these materials will help you represent Triova BD beautifully and accurately.
                    </p>

                    <h2 className="text-2xl font-semibold text-indigo-700 mt-6 mb-3">What’s Inside</h2>
                    <ul className="list-disc list-inside text-gray-800 space-y-2 mb-6">
                        <li>
                            <strong>Logo Pack:</strong> High-resolution versions in PNG, SVG, and EPS (dark & light versions)
                        </li>
                        <li>
                            <strong>Brand Guidelines:</strong> Fonts, colors, and usage rules to maintain consistency
                        </li>
                        <li>
                            <strong>Product Photos:</strong> Clean and lifestyle shots of our top fashion items
                        </li>
                        <li>
                            <strong>Founder Bio & Quotes:</strong> Official bios, headshots, and approved soundbites
                        </li>
                        <li>
                            <strong>Recent Press Releases:</strong> Company news and official announcements
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Download Assets</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <a href="/downloads/triova-logo-pack.zip" className="bg-white/70 hover:bg-white/90 transition p-6 rounded-xl shadow-md border border-indigo-100 text-center">
                            <h3 className="text-lg font-bold text-indigo-800 mb-2">Logo Pack</h3>
                            <p className="text-sm text-gray-700">PNG, SVG, EPS • Dark & Light versions</p>
                        </a>
                        <a href="/downloads/triova-brand-guidelines.pdf" className="bg-white/70 hover:bg-white/90 transition p-6 rounded-xl shadow-md border border-indigo-100 text-center">
                            <h3 className="text-lg font-bold text-indigo-800 mb-2">Brand Guidelines</h3>
                            <p className="text-sm text-gray-700">Colors, fonts, spacing, and usage rules</p>
                        </a>
                        <a href="/downloads/triova-product-photos.zip" className="bg-white/70 hover:bg-white/90 transition p-6 rounded-xl shadow-md border border-indigo-100 text-center">
                            <h3 className="text-lg font-bold text-indigo-800 mb-2">Product Photos</h3>
                            <p className="text-sm text-gray-700">High-resolution fashion images</p>
                        </a>
                        <a href="/downloads/triova-press-releases.zip" className="bg-white/70 hover:bg-white/90 transition p-6 rounded-xl shadow-md border border-indigo-100 text-center">
                            <h3 className="text-lg font-bold text-indigo-800 mb-2">Press Releases</h3>
                            <p className="text-sm text-gray-700">Recent official statements</p>
                        </a>
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-gray-700 mb-4">Need a custom quote or media inquiry?</p>
                        <a
                            href="mailto:press@triovalimited.com"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-shadow shadow-indigo-400 hover:shadow-indigo-600"
                        >
                            Contact Our Press Team
                        </a>
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
