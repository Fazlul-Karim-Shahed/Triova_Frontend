"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { formatRole, toKebabCase } from "@/src/functions/CustomFunction";

export default function SuperAdmin() {
    const state = useSelector((state) => state.triova);

    return (
        <>
            <div className="container">
                <div className="card animate-fadeInZoom">
                    <h1 className="title">Hello, {state?.decodedToken?.firstName || "User"}!</h1>
                    <p className="subtitle">Welcome to the {formatRole(state?.decodedToken?.role)} Panel</p>

                    <Link href={`${toKebabCase(state?.decodedToken?.role)}/dashboard`} className="btn">
                        Visit Dashboard
                    </Link>
                </div>
            </div>

            <style jsx>{`
                /* Container: full screen flex center with light gradient background */
                .container {
                    min-height: 95vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem;
                    background: linear-gradient(135deg, #ffffff 0%, #d1fae5 50%, #ffffff 100%);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                }

                /* Card: glassmorphic style */
                .card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.25);
                    max-width: 400px;
                    width: 100%;
                    padding: 2.5rem 2rem;
                    text-align: center;
                    box-sizing: border-box;
                    animation: fadeInZoom 0.6s ease forwards;
                }

                /* Title */
                .title {
                    color: #16a34a; /* emerald-600 */
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                }

                /* Subtitle */
                .subtitle {
                    color: #15803d; /* emerald-700 */
                    font-size: 1.125rem;
                    margin-bottom: 2rem;
                }

                /* Button */
                .btn {
                    display: inline-block;
                    background-color: #22c55e; /* emerald-500 */
                    color: white;
                    font-weight: 600;
                    padding: 0.75rem 2rem;
                    border-radius: 16px;
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
                    transition: background-color 0.3s ease, transform 0.3s ease;
                    cursor: pointer;
                    user-select: none;
                    animation: none;
                }

                .btn:hover {
                    background-color: #16a34a; /* emerald-600 */
                    animation: bounceSlow 0.8s ease-in-out;
                    transform-origin: center bottom;
                }

                /* Animations */
                @keyframes fadeInZoom {
                    0% {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes bounceSlow {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-6px);
                    }
                }
            `}</style>
        </>
    );
}
