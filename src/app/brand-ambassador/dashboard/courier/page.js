"use client";

import { createCourierApi, getAllCourierApi } from "@/src/api/SuperAdminApi/CourierApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { useEffect, useState } from "react";

export default function CourierPage() {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [courier, setCourier] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });

    useEffect(() => {
        setModalState({ open: true, loading: true });
        getAllCourierApi().then((data) => {
            setModalState({ error: data.error, message: data.message, open: false, loading: false });
            if (!data.error) setCourier(data.data);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalState({ open: true, loading: true });
        createCourierApi(formData).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true, loading: false });
            if (!data.error) {
                setFormData({ name: "", phone: "" });
                getAllCourierApi().then((res) => {
                    if (!res.error) setCourier(res.data);
                });
            }
        });
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto bg-white/80 backdrop-blur-md rounded-xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🚚 Add New Courier Service</h1>

                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Courier Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Sundarban Courier"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 bg-white shadow-inner"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g., 017XXXXXXXX"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 bg-white shadow-inner"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-semibold shadow-md transition duration-200"
                        >
                            ➕ Add Courier
                        </button>
                    </div>
                </form>

                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 All Couriers</h2>
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="w-full bg-white/70 backdrop-blur border border-gray-200 rounded-lg">
                            <thead className="bg-green-100 text-gray-700 text-sm">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Courier Name</th>
                                    <th className="p-3 border">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courier.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center p-4 text-gray-400">
                                            No couriers added yet.
                                        </td>
                                    </tr>
                                ) : (
                                    courier.map((item, index) => (
                                        <tr key={index} className="hover:bg-green-50 transition">
                                            <td className="p-3 border text-center">{index + 1}</td>
                                            <td className="p-3 border">{item.name}</td>
                                            <td className="p-3 border">{item.phone}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal for Feedback */}
                <Modal loading={modalState.loading} open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
            </div>
        </div>
    );
}
