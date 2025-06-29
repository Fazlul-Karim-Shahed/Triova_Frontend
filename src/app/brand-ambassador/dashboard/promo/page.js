"use client";

import { useEffect, useState } from "react";
import { createPromoApi, getAllPromoApi, deletPromoApi } from "@/src/api/SuperAdminApi/PromoApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { getAllAdminApi } from "@/src/api/AuthApi";

export default function PromoPage() {
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        startDate: "",
        endDate: "",
        discount: "",
        maxAmount: "",
        minOrder: "",
        isAffiliate: false,
    });

    const [promos, setPromos] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        setModalState({ message: "Fetching all admins", open: 1, loading: 1 });
        getAllAdminApi().then((data) => {
            if (data.error) {
                setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
            } else {
                setAdmins(data.data);
                setModalState({ error: data.error, message: data.message, open: 0, loading: 0 });
            }
        });
    }, []);

    const handleChange = (e) => {
        if(e.target.name === "isAffiliate") setFormData({ ...formData, [e.target.name]: e.target.checked });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchPromos = async () => {
        setModalState({ message: "Fetching all promos", open: 1, loading: 1 });
        const data = await getAllPromoApi();
        if (!data.error) {
            setModalState({ error: data.error, message: data.message, open: 0, loading: 0 });
            setPromos(data.data);
        } else {
            setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        for (let key in formData) payload.append(key, formData[key]);

        setModalState({ message: "Creating promo code...", open: 1, loading: 1 });
        const res = await createPromoApi(payload);

        if (!res.error) {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            setFormData({
                code: "",
                description: "",
                startDate: "",
                endDate: "",
                discount: "",
                maxAmount: "",
                minOrder: "",
            });
            fetchPromos();
        } else {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this promo?")) return;

        setModalState({ message: "Deleting promo code...", open: 1, loading: 1 });

        const res = await deletPromoApi(id);
        if (!res.error) {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            fetchPromos();
        } else {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    return (
        <div className="min-h-screen py-10">
            <div className=" rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New Promo</h2>

                <form onSubmit={handleSubmit} className="">
                    {/* Custom Checkbox */}
                    <div className="flex items-center mb-4">
                        <input
                            id="isAffiliate"
                            name="isAffiliate"
                            type="checkbox"
                            checked={formData.isAffiliate}
                            onChange={(e) => setFormData({ ...formData, isAffiliate: e.target.checked })}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isAffiliate" className="ml-2 block text-sm text-gray-700 font-medium">
                            Affiliate Promo
                        </label>
                    </div>

                    {/* Show admin selects if isAffiliate is true */}
                    {formData.isAffiliate && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Admin</label>
                                <select
                                    name="admin"
                                    value={formData.admin}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full rounded-lg bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
                                >
                                    <option value="">Select Admin</option>
                                    {admins.map((admin) => (
                                        <option key={admin._id} value={admin._id}>
                                            {admin.firstName} {admin.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Promo Code", name: "code" },
                            { label: "Description", name: "description" },
                            { label: "Start Date", name: "startDate", type: "date" },
                            { label: "End Date", name: "endDate", type: "date" },
                            { label: "Discount (%)", name: "discount", type: "number" },
                            { label: "Max Amount", name: "maxAmount", type: "number" },
                            { label: "Min Order", name: "minOrder", type: "number" },
                        ].map(({ label, name, type = "text" }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full rounded-lg bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
                                    required
                                />
                            </div>
                        ))}

                        <div className="md:col-span-2 mt-4">
                            <button type="submit" disabled={modalState.loading} className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md">
                                {modalState.loading ? "Creating..." : "Create Promo"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Promo list */}
            <div className="mx-auto mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">All Promos</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {promos?.length > 0 ? (
                        promos.map((promo) => (
                            <div key={promo._id} className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-md relative group transition-all hover:shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800">{promo.code}</h3>
                                <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(promo.startDate).toLocaleDateString()} → {new Date(promo.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    <strong>Discount:</strong> {promo.discount}%<br />
                                    <strong>Max:</strong> ${promo.maxAmount} <br />
                                    <strong>Min Order:</strong> ${promo.minOrder}
                                </p>
                                <button
                                    onClick={() => handleDelete(promo._id)}
                                    className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                                >
                                    Delete
                                </button>
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
