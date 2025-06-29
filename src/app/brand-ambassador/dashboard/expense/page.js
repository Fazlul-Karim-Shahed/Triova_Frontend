"use client";

import React, { useEffect, useState } from "react";
import { deleteExpenseApi, getAllExpenseApi } from "@/src/api/SuperAdminApi/ExpenseApi";
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";
import Image from "next/image";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";

const dateOptions = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 15 Days", value: 15 },
    { label: "Last 1 Month", value: 30 },
    { label: "Last 3 Months", value: 90 },
    { label: "Last 6 Months", value: 180 },
    { label: "Last 1 Year", value: 365 },
];

export default function ExpensePage() {
    const [selectedDays, setSelectedDays] = useState(7);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [loading, setLoading] = useState(false);

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    useEffect(() => {
        setModalState({ error: false, message: "Please wait...", open: true, loading: true });
        getAllExpenseApi({})
            .then((data) => {
                setModalState({ error: data.error, message: data.message, open: false, loading: false });
                if (!data.error) {
                    const today = new Date();
                    let filteredExpenses = [];

                    if (startDate && endDate) {
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        filteredExpenses = data.data.filter((expense) => {
                            const expenseDate = new Date(expense.date);
                            return expenseDate >= start && expenseDate <= end;
                        });
                    } else {
                        filteredExpenses = data.data.filter((expense) => {
                            const expenseDate = new Date(expense.date);
                            const diffDays = Math.ceil((today - expenseDate) / (1000 * 60 * 60 * 24));
                            return diffDays <= selectedDays;
                        });
                    }

                    setExpenses(filteredExpenses);
                } else {
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    }, [selectedDays, startDate, endDate]);

    const handleClearDates = () => {
        setStartDate("");
        setEndDate("");
    };

    const deleteExpense = (id) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            setModalState({ error: false, message: "Deleting...", open: true, loading: true });
            deleteExpenseApi(id)
                .then((data) => {
                    setModalState({ error: data.error, message: data.message, open: false, loading: false });
                    if (!data.error) {
                        setExpenses(expenses.filter((expense) => expense._id !== id));
                        setModalState({ open: true, error: false, message: "Expense deleted successfully." });
                    } else {
                        setModalState({ open: true, error: true, message: data.message });
                    }
                })
                .catch((error) => {
                    setModalState({ open: true, error: true, message: `Error deleting expense: ${error.message}` });
                });
        }
    };

    const openDetailModal = (expense) => {
        setSelectedExpense(expense);
        setDetailModalOpen(true);
    };


    return (
        <div className="mx-auto py-8">
            <div className="text-end mb-6">
                <Link href="/super-admin/dashboard/expense/create">
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-4 rounded shadow-lg transition duration-300">
                        + Create New Expense
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-1 font-semibold">Preset Range</label>
                    <select
                        className="w-full p-2 border rounded bg-white shadow"
                        value={selectedDays}
                        onChange={(e) => {
                            setSelectedDays(parseInt(e.target.value));
                            setStartDate("");
                            setEndDate("");
                        }}
                        disabled={startDate || endDate}
                    >
                        {dateOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Start Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded bg-white shadow"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setSelectedDays(0);
                        }}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">End Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded bg-white shadow"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setSelectedDays(0);
                        }}
                    />
                </div>
            </div>

            {(startDate || endDate) && (
                <div className="mb-4">
                    <button onClick={handleClearDates} className="text-sm text-blue-600 underline">
                        Clear custom date filter
                    </button>
                </div>
            )}

            {/* Table */}
            {expenses.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">{ modalState.message }</div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-xl backdrop-blur-md bg-white/30 ring-1 ring-gray-200">
                    <table className="min-w-full table-auto">
                        <thead className="bg-white/40 backdrop-blur-md">
                            <tr className="text-left text-sm font-semibold text-gray-700">
                                <th className="px-6 py-3">Company</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, index) => (
                                <tr key={index} className="border-t border-gray-200 text-sm text-gray-800 hover:bg-white/40 transition">
                                    <td className="px-6 py-4">{expense.companyName}</td>
                                    <td className="px-6 py-4">${expense.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{expense.description}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => openDetailModal(expense)} className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Details
                                        </button>
                                        <button onClick={() => deleteExpense(expense._id)} className="text-sm px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirmation modal */}
            {/* <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} /> */}

            {/* Detail modal */}
            {detailModalOpen && selectedExpense && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                        {/* Close button */}
                        <button onClick={() => setDetailModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold" aria-label="Close modal">
                            &times;
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Expense Details</h2>

                        {/* Expense Info */}
                        <div className="space-y-4 text-gray-700 text-base">
                            <div>
                                <strong>Company:</strong> {selectedExpense.companyName}
                            </div>
                            <div>
                                <strong>Amount:</strong> ${selectedExpense.amount.toFixed(2)}
                            </div>
                            <div>
                                <strong>Date:</strong> {new Date(selectedExpense.date).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Description:</strong> {selectedExpense.description}
                            </div>
                        </div>

                        {/* Documents */}
                        {selectedExpense.documents?.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Attached Documents</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {selectedExpense.documents.map((item, index) => (
                                        <div key={index} className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                                            <ClientImageWithLoader src={imageSrc(item.name)} alt={`Document ${index + 1}`} width={500} height={300} className="w-full h-auto object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Modal loading={modalState.loading} open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
        </div>
    );
}
