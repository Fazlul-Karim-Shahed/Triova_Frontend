"use client";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import React from "react";
import Logo from "@/public/Logo_Bg.png";
import Image from "next/image";

export default function Branding() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-5">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-indigo-700 mb-8 drop-shadow-lg">Branding Services</h1>

                <div className="glassmorphic-card p-10 rounded-3xl shadow-2xl bg-white/40 backdrop-blur-lg border border-indigo-200 mb-12">
                    <p className="text-xl leading-relaxed text-gray-900 mb-6">
                        At <strong>Triova Limited</strong>, we believe a strong brand is the foundation of lasting success. Our expert branding services help you build a memorable identity that truly
                        reflects your vision and values.
                    </p>
                    <p className="text-lg text-gray-800 mb-6">
                        From logo design and color palettes to messaging strategies and brand storytelling, we tailor every element to resonate deeply with your target audience.
                    </p>
                    <p className="text-lg text-gray-800 mb-8">
                        Let us help you craft a consistent, authentic brand presence that stands out in Bangladesh’s competitive fashion market and builds customer loyalty.
                    </p>

                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-shadow shadow-indigo-400 hover:shadow-indigo-600">
                        Get in Touch
                    </button>
                </div>

                {/* Download Section */}
                <div className="glassmorphic-card p-8 rounded-3xl shadow-2xl bg-white/50 backdrop-blur-lg border border-indigo-200 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Download Our Branding Portfolio</h2>
                    <p className="text-gray-700 mb-6">Explore our recent branding projects to see how we elevate identities with creative design and strategy.</p>

                    <Image src={Logo} quality={100} alt="Triova Limited Logo" width={1000} height={1000} className="w-full h-full" />

                    {/* Replace href with your actual file */}
                    {/* <a
                        href="/files/TriovaLimited-Branding-Portfolio.pdf"
                        download
                        className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition-shadow shadow-indigo-400 hover:shadow-indigo-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
                        </svg>
                        Download Portfolio
                    </a> */}
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
