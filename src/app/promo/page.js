"use client";

import { getAllPromoApi } from "@/src/api/SuperAdminApi/PromoApi";
import Spinner from "@/src/components/Common/Spinner/Spinner";
import React, { useEffect, useState } from "react";

export default function PromoCodeCard() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        getAllPromoApi()
            .then((res) => {
                if (!res.error) {
                    const now = new Date();
                    // Normalize current date to remove time
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                    const filteredPromos = (res.data || []).filter((promo) => {
                        const start = new Date(promo.startDate);
                        const end = new Date(promo.endDate);

                        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                        const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

                        // Logs for debugging
                        // console.log(`Now: ${today}, Start: ${startDate}, End: ${endDate}`);

                        return today >= startDate && today <= endDate;
                    });

                    setPromos(filteredPromos);
                }
                setLoading(false);
            })
            .catch((err) => {
                // console.error("Failed to fetch promos", err);
                setLoading(false);
            });
    }, []);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Promo Codes</h1>

            {loading ? (
                <Spinner message={"Loading promo data..."} />
            ) : promos.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promos.map((promo, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">🎁 {promo.title || "Promo Offer"}</h2>
                                <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                            </div>

                            <div className="mt-auto">
                                <div className="bg-gray-100 text-gray-800 font-mono text-center text-base font-semibold py-2 px-4 rounded-lg mb-4">{promo.code}</div>
                                <button onClick={() => handleCopy(promo.code)} className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition">
                                    {copiedCode === promo.code ? "✅ Copied!" : "Copy Code"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-red-400 py-20">Sorry. Currently no promo code is available</div>
            )}
        </div>
    );
}
