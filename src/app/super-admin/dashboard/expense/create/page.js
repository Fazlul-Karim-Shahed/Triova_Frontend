"use client";

import React, { useState } from "react";
import { createExpenseApi } from "@/src/api/SuperAdminApi/ExpenseApi";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function CreateExpensePage() {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });

    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        companyName: "",
    });

    

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalState({ error: false, message: "Please wait...", open: true, loading: true });

        createExpenseApi(formData).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true, loading: false });
        });
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg ring-1 ring-white/40">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="e.g. ABC Ltd."
                            required
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="e.g. 1200"
                            required
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Optional description..."
                            rows={3}
                            className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Documents</label>
                        <input
                            type="file"
                            name="documents"
                            onChange={handleChange}
                            multiple
                            className="w-full file:bg-blue-600 file:text-white file:rounded-md file:px-4 file:py-2 file:border-0 bg-white/60 p-2 rounded-xl"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={modalState.loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300"
                    >
                        {modalState.loading ? "Submitting..." : "Create Expense"}
                    </button>
                </form>

                <Modal loading={modalState.loading} open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
            </div>
        </div>
    );
}
