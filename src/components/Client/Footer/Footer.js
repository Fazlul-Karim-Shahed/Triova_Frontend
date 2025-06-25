"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Logo from "@/public/Logo.svg";
import Image from "next/image";
import Link from "next/link";
import Subscribe from "../Subscribe/Subscribe";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/signin" || pathname === "/signup" || pathname.startsWith("/admin") || pathname.startsWith("/super-admin") || pathname.startsWith("/employee")) {
        return null;
    }

    return (
        <div className="bg-white">
            <Subscribe />

            <footer className="bg-gray-900 text-gray-200 py-10 px-5 md:px-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <Image src={Logo} width={100} alt="Logo" className="mb-4 -ms-2" />
                        <p className="text-sm">
                            <strong>Triova Limited</strong>
                            <br />
                            Bangladesh's largest online shopping mall since 2025
                        </p>
                    </div>

                    <div className="md:text-end">
                        <h6 className="text-lg font-semibold mb-4">Services</h6>
                        {[
                            { label: "Branding", href: "/branding" },
                            { label: "Design", href: "/design" },
                            { label: "Marketing", href: "/marketing" },
                            { label: "Advertisement", href: "/advertisement" },
                        ].map(({ label, href }) => (
                            <Link key={label} href={href} className="block mb-2 text-sm hover:text-brand-200 transition-all duration-200">
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="md:text-end">
                        <h6 className="text-lg font-semibold mb-4">Company</h6>
                        {[
                            { label: "About us", href: "/about" },
                            { label: "Contact", href: "/contact" },
                            { label: "Jobs", href: "/job" },
                            { label: "Press kit", href: "/press" },
                        ].map(({ label, href }) => (
                            <Link key={label} href={href} className="block mb-2 text-sm hover:text-brand-200 transition-all duration-200">
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="md:text-end">
                        <h6 className="text-lg font-semibold mb-4">Legal</h6>
                        {[
                            { label: "Terms of use", href: "/terms" },
                            { label: "Privacy policy", href: "/privacy" },
                            { label: "Cookie policy", href: "/cookie" },
                        ].map(({ label, href }) => (
                            <Link key={label} href={href} className="block mb-2 text-sm hover:text-brand-200 transition-all duration-200">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-center md:text-left mb-4 md:mb-0">&copy; {new Date().getFullYear()} Triova Bangladesh Ltd. All rights reserved.</p>

                    <div className="flex space-x-5">
                        {/* Facebook */}
                        <a
                            href="https://web.facebook.com/people/Triova-Limited/61568890781626/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-gray-400 hover:text-blue-500 transition-transform transform hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.675 0h-21.35C.598 0 0 .597 0 1.333v21.333C0 23.403.598 24 1.325 24H12.82v-9.294H9.692V11.01h3.128V8.412c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.462.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116C23.402 24 24 23.403 24 22.667V1.333C24 .597 23.402 0 22.675 0z" />
                            </svg>
                        </a>

                        {/* Twitter */}
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="text-gray-400 hover:text-sky-400 transition-transform transform hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 001.97-2.48 9.05 9.05 0 01-2.88 1.1A4.52 4.52 0 0016.5 0c-2.5 0-4.5 2.15-4.5 4.79 0 .37.04.73.11 1.07-3.74-.19-7.04-1.98-9.25-4.7a4.81 4.81 0 00-.61 2.41c0 1.66.82 3.13 2.08 3.99a4.41 4.41 0 01-2.05-.59v.06c0 2.32 1.55 4.26 3.6 4.7a4.65 4.65 0 01-2.02.08 4.53 4.53 0 004.2 3.2A9.05 9.05 0 012 20.41a12.72 12.72 0 006.92 2.07c8.3 0 12.85-7.27 12.85-13.58 0-.21 0-.42-.02-.63A9.56 9.56 0 0023 3z" />
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="text-gray-400 hover:text-red-500 transition-transform transform hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184C16.011 2.938 7.984 2.939 4.385 3.184c-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
