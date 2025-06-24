"use client";

import React, { useState } from "react";

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 p-5">
            <div className="max-w-4xl mx-auto text-center">
                <header>
                    <h1 className="text-5xl font-extrabold text-cyan-700 mb-8 drop-shadow-lg">Contact Us</h1>
                    <p className="text-lg text-gray-700 mb-12 max-w-xl mx-auto shadow-md rounded-3xl p-6 bg-white/70 backdrop-blur-md">
                        Have questions or need assistance? Reach out to the Triova Limited team anytime! Email us at <strong>triovabd@gmail.com</strong> or call <strong>+880 1312379588</strong>. Or
                        use the contact form below.
                    </p>
                </header>

                <section aria-label="Contact Form">
                    <form onSubmit={handleSubmit} className="glassmorphic-card max-w-2xl mx-auto p-10 rounded-3xl shadow-2xl bg-white/50 backdrop-blur-lg border border-cyan-300 text-left" noValidate>
                        {submitted && <div className="mb-6 p-4 rounded bg-green-100 text-green-800 font-semibold">Thank you for reaching out! We will respond shortly.</div>}

                        <label className="block mb-4">
                            <span className="text-cyan-900 font-semibold mb-1 block">Name</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your full name"
                                className="w-full rounded-lg border border-cyan-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </label>

                        <label className="block mb-4">
                            <span className="text-cyan-900 font-semibold mb-1 block">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-cyan-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </label>

                        <label className="block mb-6">
                            <span className="text-cyan-900 font-semibold mb-1 block">Message</span>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Write your message here..."
                                rows={5}
                                className="w-full rounded-lg border border-cyan-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                            />
                        </label>

                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-full transition-shadow shadow-cyan-400 hover:shadow-cyan-600">
                            Send Message
                        </button>
                    </form>
                </section>
            </div>

            <style jsx>{`
                .glassmorphic-card {
                    backdrop-filter: saturate(180%) blur(18px);
                    -webkit-backdrop-filter: saturate(180%) blur(18px);
                }
            `}</style>
        </main>
    );
}
