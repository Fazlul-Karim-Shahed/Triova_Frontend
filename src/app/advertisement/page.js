"use client";

import React from "react";

export default function Advertisement() {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-pink-100 p-5">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-pink-700 mb-8 drop-shadow-lg">Advertisement Services</h1>

                <div className="glassmorphic-card p-10 rounded-3xl shadow-2xl bg-white/40 backdrop-blur-lg border border-pink-200">
                    <p className="text-xl leading-relaxed text-gray-800 mb-6">
                        At <strong>Triova BD</strong>, we specialize in crafting compelling advertisement campaigns tailored to your brand's unique voice. Whether you're launching a new collection or
                        boosting seasonal sales, our expert strategies drive engagement, traffic, and conversions.
                    </p>
                    <p className="text-lg text-gray-700 mb-8">Partner with us to amplify your reach and watch your sales soar in the vibrant fashion market of Bangladesh.</p>

                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-shadow shadow-pink-400 hover:shadow-pink-600">Contact Our Team</button>
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
