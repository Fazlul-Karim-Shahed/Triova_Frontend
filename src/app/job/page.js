"use client";
import React from "react";

export default function Jobs() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-5">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-indigo-700 mb-8 drop-shadow-lg">Careers at Triova BD</h1>

                <div className="glassmorphic-card p-10 rounded-3xl shadow-2xl bg-white/50 backdrop-blur-lg border border-indigo-200 text-left">
                    <p className="text-lg text-gray-800 mb-6">
                        At <strong>Triova BD</strong>, we’re more than just an e-commerce platform — we’re a movement shaping the future of fashion and digital retail in Bangladesh. Our mission is to
                        empower talent, embrace innovation, and build a company culture rooted in excellence and creativity.
                    </p>

                    <h2 className="text-2xl font-semibold text-indigo-700 mt-6 mb-3">Why Work With Us?</h2>
                    <ul className="list-disc list-inside text-gray-800 space-y-2">
                        <li>
                            <strong>Innovative Culture:</strong> We foster an environment where bold ideas are encouraged and celebrated.
                        </li>
                        <li>
                            <strong>Growth Opportunities:</strong> Your career grows as we grow — with mentorship, training, and promotions.
                        </li>
                        <li>
                            <strong>Flexible Work:</strong> Hybrid work models, results-driven schedules, and work-life balance.
                        </li>
                        <li>
                            <strong>Team Spirit:</strong> Collaborate with a passionate team that supports and uplifts each other.
                        </li>
                        <li>
                            <strong>Impact:</strong> Help shape one of the fastest-growing fashion platforms in Bangladesh.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-indigo-700 mt-8 mb-3">Current Openings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/60 p-6 rounded-xl shadow-md border border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-800">Frontend Developer</h3>
                            <p className="text-gray-700 mt-2 text-sm">React.js expert with an eye for design. Work on next-gen interfaces for our fashion platform.</p>
                        </div>
                        <div className="bg-white/60 p-6 rounded-xl shadow-md border border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-800">Graphic Designer</h3>
                            <p className="text-gray-700 mt-2 text-sm">Visual storyteller who can turn concepts into stunning brand visuals, ads, and product designs.</p>
                        </div>
                        <div className="bg-white/60 p-6 rounded-xl shadow-md border border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-800">Customer Support Executive</h3>
                            <p className="text-gray-700 mt-2 text-sm">Empathetic communicator with a flair for solving problems and making customers feel valued.</p>
                        </div>
                        <div className="bg-white/60 p-6 rounded-xl shadow-md border border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-800">Marketing Specialist</h3>
                            <p className="text-gray-700 mt-2 text-sm">Drive strategy, digital campaigns, and growth hacks to boost brand presence and conversions.</p>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-gray-700 mb-4">Didn't find a role that fits? We're always on the lookout for talented individuals.</p>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-shadow shadow-indigo-400 hover:shadow-indigo-600">
                            Send Your Resume
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
