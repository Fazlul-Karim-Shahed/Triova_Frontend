"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAProfileApi } from "@/src/api/SuperAdminApi/ProfileApi";

export default function EmployeeProfilePage() {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const store = useSelector((store) => store.triova);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getAProfileApi(store.decodedToken._id, store.decodedToken.role);
            if (!res.error) {
                setEmployee(res.data);
            }
            setLoading(false);
        };

        if (store.decodedToken._id) fetchProfile();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-48 text-lg text-gray-600 font-semibold">Loading profile...</div>;
    if (!employee) return <div className="p-6 text-center text-red-600 font-semibold">Failed to load profile.</div>;

    const totalPaid = employee.payment?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
    const paymentDue = (employee.totalCommission || 0) - totalPaid;

    return (
        <div className="mx-auto py-8 font-sans text-gray-800">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight flex items-center gap-3">
                <span>👤</span> Profile
            </h1>

            {/* Profile and Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-10">
                {/* Personal Info */}
                <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-gray-700 flex items-center gap-2">🧾 Personal Info</h2>
                    <div className="space-y-4 text-gray-700 text-base">
                        <p>
                            <strong>Name:</strong> {employee.firstName} {employee.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {employee.email}
                        </p>
                        <p>
                            <strong>Mobile:</strong> {employee.mobile}
                        </p>
                        <p>
                            <strong>Department:</strong> {employee.department || "N/A"}
                        </p>
                        <p>
                            <strong>Address:</strong> {employee.address || "N/A"}
                        </p>
                        <p>
                            <strong>Joined On:</strong> {new Date(employee.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Date of Birth:</strong> {employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
                        </p>
                        <p>
                            <strong>Emergency Contact:</strong> {employee.emergencyContact || "N/A"}
                        </p>
                    </div>
                </section>

                {/* Role & Commission Highlight */}
                <section className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 text-white rounded-xl shadow-lg p-6 flex flex-col justify-center border border-indigo-800">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">🏷️ Role & Commission</h2>
                    <div className="space-y-8 text-lg">
                        <div className="flex justify-between items-center border-b border-white/30 pb-3">
                            <span className="capitalize font-medium tracking-wide">Role</span>
                            <span className="bg-white/25 px-4 py-1 rounded-full text-sm tracking-wide">{employee.role}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/30 pb-3">
                            <span className="font-semibold text-xl tracking-wide">Balance Due</span>
                            <span className={`font-extrabold text-4xl drop-shadow-lg ${paymentDue <= 0 ? "text-red-300" : "text-green-300"}`}>৳{paymentDue.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/30 pb-3">
                            <span className="font-semibold text-xl tracking-wide">Total Commission Earned</span>
                            <span className="font-extrabold text-4xl text-green-300 drop-shadow-lg">৳{(employee.totalCommission || 0).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center  pb-3">
                            <span>Commission Rate</span>
                            <span>{employee.commissionRate ? `${employee.commissionRate}%` : "N/A"}</span>
                        </div>


                    </div>
                </section>

                {/* Employment Summary & Stats */}
                <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-gray-700 flex items-center gap-2">📊 Employment Summary</h2>
                    <ul className="list-disc list-inside space-y-3 text-gray-700 text-base">
                        <li>
                            <strong>Employment Type:</strong> {employee.employmentType || "Full-time"}
                        </li>
                        <li>
                            <strong>Work Location:</strong> {employee.workLocation || "Remote"}
                        </li>
                        <li>
                            <strong>Manager:</strong> {employee.managerName || "N/A"}
                        </li>
                        <li>
                            <strong>Projects Assigned:</strong> {employee.projects?.length || 0}
                        </li>
                        <li>
                            <strong>Years in Company:</strong> {employee.yearsInCompany || "N/A"}
                        </li>
                        <li>
                            <strong>Last Promotion Date:</strong> {employee.lastPromotionDate ? new Date(employee.lastPromotionDate).toLocaleDateString() : "N/A"}
                        </li>
                        <li>
                            <strong>Performance Rating:</strong> {employee.performanceRating || "N/A"}
                        </li>
                    </ul>
                </section>
            </div>

            {/* Payment History */}
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">💳 Payment History</h2>

                {employee.payment?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300 text-gray-800 text-sm">
                            <thead className="bg-indigo-50 text-indigo-700 font-semibold">
                                <tr>
                                    <th className="border border-gray-300 px-5 py-3 text-left">Date</th>
                                    <th className="border border-gray-300 px-5 py-3 text-right">Amount</th>
                                    <th className="border border-gray-300 px-5 py-3 text-left">Method</th>
                                    <th className="border border-gray-300 px-5 py-3 text-left">Status</th>
                                    <th className="border border-gray-300 px-5 py-3 text-left">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.payment.map((pay, idx) => (
                                    <tr key={idx} className="border border-gray-300 hover:bg-indigo-50 transition-colors">
                                        <td className="px-5 py-3 whitespace-nowrap">{new Date(pay.date).toLocaleDateString()}</td>
                                        <td className="px-5 py-3 font-semibold text-right text-green-700 whitespace-nowrap">৳{(pay.amount || 0).toFixed(2)}</td>
                                        <td className="px-5 py-3 whitespace-nowrap">{pay.paymentMethod}</td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    pay.paymentStatus === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {pay.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">{pay.description || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-12 text-lg font-medium">No payments found.</p>
                )}
            </section>
        </div>
    );
}
