"use client";

import { makePaymentApi, updateEmployeeApi } from "@/src/api/SuperAdminApi/EmployeeApi";
import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function EmployeeCommissionPage() {
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [editingEmp, setEditingEmp] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        description: "",
        paymentMethod: "Bkash",
        paymentStatus: "Paid",
        transactionId: "",
        document: null,
    });

    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address: "",
        commissionRate: "",
    });

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const orderRes = await getAllOrdersApi({ promoFinder: true });

            if (!orderRes.error) {
                const deliveredOrders = orderRes.data.filter((order) => order.orderStatus === "Delivered" && order.reffer);
                const summary = {};

                deliveredOrders.forEach((order) => {
                    const ref = order.reffer;
                    const ownerId = ref._id;

                    if (!summary[ownerId]) {
                        summary[ownerId] = {
                            employee: ref,
                            role: order.orderTakerRole || "N/A",
                            totalOrders: 0,
                            totalAmount: 0,
                            commission: 0,
                        };
                    }

                    const commissionRate = order.commission || 0;
                    const orderCommission = order.totalPrice * (commissionRate / 100);

                    summary[ownerId].totalOrders += 1;
                    summary[ownerId].totalAmount += order.totalPrice;
                    summary[ownerId].commission += orderCommission;
                });

                setEmployeeData(Object.values(summary));
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const handleOpenModal = (emp) => {
        const totalPaid = emp.employee.payment?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
        const paymentDue = emp.commission - totalPaid;

        setSelectedEmp(emp);
        setPaymentForm({
            amount: paymentDue.toFixed(2),
            description: `Commission payout for ${emp.employee.firstName}`,
            paymentMethod: "Bkash",
            paymentStatus: "Paid",
            transactionId: "",
            document: null,
        });

        document.getElementById("makePaymentModal").showModal();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        Object.entries(paymentForm).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        const res = await makePaymentApi(selectedEmp.employee._id, formData);

        setAlert({
            type: res.error ? "error" : "success",
            message: res.error ? "Payment failed" : "Payment successful",
        });

        if (!res.error) document.getElementById("makePaymentModal").close();

        setTimeout(() => setAlert(null), 4000);
        setSubmitting(false);
    };

    const handleOpenEdit = (emp) => {
        setEditingEmp(emp);
        setEditForm({
            firstName: emp.employee.firstName || "",
            lastName: emp.employee.lastName || "",
            email: emp.employee.email || "",
            mobile: emp.employee.mobile || "",
            address: emp.employee.address || "",
            commissionRate: emp.employee.commissionRate || "",
        });
        document.getElementById("editEmployeeModal").showModal();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
            if (value !== undefined && value !== null) formData.append(key, value);
        });

        const res = await updateEmployeeApi(editingEmp.employee._id, formData);

        if (!res.error) {
            setAlert({ type: "success", message: "Profile updated" });
            document.getElementById("editEmployeeModal").close();
            window.location.reload();
        } else {
            setAlert({ type: "error", message: "Update failed" });
        }

        setTimeout(() => setAlert(null), 4000);
        setUpdating(false);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Employee Promo Commission Report</h2>

            {alert && <div className={`mb-4 p-4 rounded text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>{alert.message}</div>}

            {loading ? (
                <div className="text-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Mobile</th>
                                <th className="px-4 py-2 border">Role</th>
                                <th className="px-4 py-2 border">Promo Orders</th>
                                <th className="px-4 py-2 border">Total Order Amount</th>
                                <th className="px-4 py-2 border">Commission</th>
                                <th className="px-4 py-2 border text-red-500">Due</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.map((emp, idx) => {
                                const totalPaid = emp.employee.payment?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
                                const paymentDue = emp.commission - totalPaid;

                                return (
                                    <tr key={idx} className="text-center">
                                        <td className="px-4 py-2 border">
                                            {emp.employee?.firstName} {emp.employee?.lastName}
                                        </td>
                                        <td className="px-4 py-2 border">{emp.employee?.mobile || "N/A"}</td>
                                        <td className="px-4 py-2 border">{emp.employee.role}</td>
                                        <td className="px-4 py-2 border">{emp.totalOrders}</td>
                                        <td className="px-4 py-2 border">৳{emp.totalAmount.toFixed(2)}</td>
                                        <td className="px-4 py-2 border text-green-600 font-semibold">৳{emp.commission.toFixed(2)}</td>
                                        <td className="px-4 py-2 border text-red-600 font-semibold">৳{paymentDue.toFixed(2)}</td>
                                        <td className="px-4 py-2 border flex gap-2 justify-center">
                                            <button onClick={() => handleOpenModal(emp)} className="btn btn-sm btn-primary">
                                                Pay
                                            </button>
                                            <button onClick={() => handleOpenEdit(emp)} className="btn btn-sm btn-secondary">
                                                Edit
                                            </button>
                                            <Link href={{ pathname: "/super-admin/dashboard/profile", query: { role: emp.employee.role, id: emp.employee._id } }} className="btn btn-sm btn-info">
                                                Visit
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Make Payment Modal */}
            <dialog id="makePaymentModal" className="modal">
                <div className="modal-box max-w-xl">
                    <h3 className="font-bold text-lg mb-4">Make Payment to {selectedEmp?.employee.firstName}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                        <input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} className="input input-bordered w-full" required />
                        <input type="text" value={paymentForm.description} onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })} className="input input-bordered w-full" />
                        <select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })} className="select select-bordered w-full">
                            <option value="Bkash">Bkash</option>
                            <option value="Nagad">Nagad</option>
                            <option value="Bank">Bank</option>
                            <option value="Cash">Cash</option>
                        </select>
                        <input
                            type="text"
                            value={paymentForm.transactionId}
                            onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                            className="input input-bordered w-full"
                        />
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => setPaymentForm({ ...paymentForm, document: e.target.files[0] })}
                            className="file-input file-input-bordered w-full"
                        />
                        <div className="modal-action">
                            <button type="submit" className="btn btn-success" disabled={submitting}>
                                {submitting ? "Submitting..." : "Pay"}
                            </button>
                            <button type="button" className="btn" onClick={() => document.getElementById("makePaymentModal").close()}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Quick Edit Modal */}
            <dialog id="editEmployeeModal" className="modal">
                <div className="modal-box max-w-xl">
                    <h3 className="font-bold text-lg mb-4">Quick Edit Profile</h3>
                    <form onSubmit={handleEditSubmit} className="space-y-3" encType="multipart/form-data">
                        <label className="block">
                            First Name
                            <input
                                type="text"
                                placeholder="First Name"
                                value={editForm.firstName}
                                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                className="input input-bordered w-full"
                                required
                            />
                        </label>

                        <label className="block">
                            Last Name
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={editForm.lastName}
                                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </label>

                        <label className="block">
                            Email
                            <input
                                type="email"
                                placeholder="Email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="input input-bordered w-full"
                                required
                            />
                        </label>

                        <label className="block">
                            Mobile
                            <input
                                type="text"
                                placeholder="Mobile"
                                value={editForm.mobile}
                                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </label>

                        <label className="block">
                            Address
                            <input
                                type="text"
                                placeholder="Address"
                                value={editForm.address}
                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </label>

                        <label className="block">
                            Commission Rate (%)
                            <input
                                type="number"
                                placeholder="Commission Rate (%)"
                                value={editForm.commissionRate}
                                onChange={(e) => setEditForm({ ...editForm, commissionRate: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </label>

                        <div className="modal-action">
                            <button type="submit" className="btn btn-success" disabled={updating}>
                                {updating ? "Updating..." : "Update"}
                            </button>
                            <button type="button" className="btn" onClick={() => document.getElementById("editEmployeeModal").close()} disabled={updating}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
}
