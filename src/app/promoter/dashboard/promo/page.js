"use client";

import { useEffect, useState } from "react";
import { getAllPromoApi } from "@/src/api/SuperAdminApi/PromoApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { useSelector } from "react-redux";

export default function PromoPage() {

    const [promos, setPromos] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const store = useSelector((store) => store.triova);


    const fetchPromos = async () => {
        setModalState({ message: "Fetching all promos", open: 1, loading: 1 });
        const data = await getAllPromoApi();
        if (!data.error) {
            console.log(data.data);
            setModalState({ error: data.error, message: data.message, open: 0, loading: 0 });
            setPromos(data.data.filter(promo => promo.owner?._id === store.decodedToken._id));
        } else {
            setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    return (
        <div className="min-h-screen py-10">
            {/* Promo list */}
            <div className="mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Promos</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {promos?.length > 0 ? (
                        promos.map((promo) => (
                            <div key={promo._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                                {/* Promo Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-gray-800">{promo.code}</h3>
                                    <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">{promo.discount}% OFF</span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4">{promo.description}</p>

                                {/* Validity Dates */}
                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                    <span className="bg-gray-100 px-2 py-1 rounded-lg">{new Date(promo.startDate).toLocaleDateString()}</span>
                                    <span className="mx-2 text-gray-400">→</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded-lg">{new Date(promo.endDate).toLocaleDateString()}</span>
                                </div>

                                {/* Promo Details */}
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div>
                                        <strong className="text-gray-900">Max Discount:</strong> ${promo.maxAmount}
                                    </div>
                                    <div>
                                        <strong className="text-gray-900">Minimum Order:</strong> ${promo.minOrder}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No promos found.</p>
                    )}
                </div>
            </div>

            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />
        </div>
    );
}
