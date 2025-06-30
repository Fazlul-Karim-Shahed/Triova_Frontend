"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAProfileApi } from "@/src/api/SuperAdminApi/ProfileApi";
import { updateEmployeeApi } from "@/src/api/SuperAdminApi/EmployeeApi";

export default function EmployeeProfilePage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const role = searchParams.get("role");

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // For Edit Modal & Form
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        role: "employee",
        department: "",
        address: "",
        position: "",
        salary: "",
        dob: "",
        nidNumber: "",
        commissionRate: "",
        mobileVerified: false,
        superAdminVerified: false,
        nidFrontImage: null,
        nidBackImage: null,
        image: null,
    });
    const [updating, setUpdating] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (!id || !role) {
            setError("Missing required URL parameters: id and role.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            const res = await getAProfileApi(id, role);
            if (res.error) {
                setError(res.message || "Failed to load profile.");
                setEmployee(null);
            } else {
                setEmployee(res.data);
                // Prefill edit form
                setEditForm({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                    mobile: res.data.mobile || "",
                    role: res.data.role || "employee",
                    department: res.data.department || "",
                    address: res.data.address || "",
                    position: res.data.position || "",
                    salary: res.data.salary || "",
                    dob: res.data.dob ? res.data.dob.slice(0, 10) : "", // YYYY-MM-DD format for input type=date
                    nidNumber: res.data.nidNumber || "",
                    commissionRate: res.data.commissionRate || "",
                    mobileVerified: res.data.mobileVerified || false,
                    superAdminVerified: res.data.superAdminVerified || false,
                    nidFrontImage: null,
                    nidBackImage: null,
                    image: null,
                });
                setError(null);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [id, role]);

    // Handle opening edit modal
    const openEditModal = () => {
        document.getElementById("editEmployeeModal").showModal();
    };

    // Handle edit form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const formData = new FormData();
            Object.entries(editForm).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // For files: only append if a File object
                    if ((key === "nidFrontImage" || key === "nidBackImage" || key === "image") && value instanceof File) {
                        formData.append(key, value);
                    } else if (key !== "nidFrontImage" && key !== "nidBackImage" && key !== "image") {
                        formData.append(key, value);
                    }
                }
            });

            const res = await updateEmployeeApi(id, formData);

            if (!res.error) {
                setAlert({ type: "success", message: "Profile updated successfully." });
                // Refresh employee data
                const updatedProfile = await getAProfileApi(id, role);
                if (!updatedProfile.error) setEmployee(updatedProfile.data);
                document.getElementById("editEmployeeModal").close();
            } else {
                setAlert({ type: "error", message: res.message || "Update failed." });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message || "Update failed." });
        }
        setTimeout(() => setAlert(null), 4000);
        setUpdating(false);
    };

    if (loading) return <div className="flex justify-center items-center h-48 text-lg text-gray-600 font-semibold">Loading profile...</div>;
    if (error) return <div className="p-6 text-center text-red-600 font-semibold">Error: {error}</div>;
    if (!employee) return <div className="p-6 text-center text-red-600 font-semibold">No profile found.</div>;

    const totalPaid = employee.payment?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
    const paymentDue = (employee.totalCommission || 0) - totalPaid;

    return (
        <div className="mx-auto py-8 px-4 max-w-7xl font-sans text-gray-800">
            {alert && <div className={`mb-4 p-4 rounded text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>{alert.message}</div>}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <span>👤</span> Profile
                </h1>
                <button onClick={openEditModal} className="btn btn-primary btn-sm" type="button">
                    Edit Profile
                </button>
            </div>

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

                        <div className="flex justify-between items-center pb-3">
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

            {/* Edit Modal */}
            <dialog id="editEmployeeModal" className="modal">
                <div className="modal-box max-w-xl">
                    <h3 className="font-bold text-lg mb-4">Update Profile</h3>
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
                            Role
                            <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="select select-bordered w-full" required>
                                <option value="employee">employee</option>
                                <option value="brandAmbassador">brandAmbassador</option>
                                <option value="promoter">promoter</option>
                                <option value="influencer">influencer</option>
                                <option value="others">others</option>
                            </select>
                        </label>

                        <label className="block">
                            Department
                            <input
                                type="text"
                                placeholder="Department"
                                value={editForm.department}
                                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </label>

                        <label className="block">
                            Position
                            <input
                                type="text"
                                placeholder="Position"
                                value={editForm.position}
                                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </label>

                        <label className="block">
                            Salary
                            <input
                                type="number"
                                placeholder="Salary"
                                value={editForm.salary}
                                onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
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
                            Date of Birth
                            <input
                                type="date"
                                placeholder="Date of Birth"
                                value={editForm.dob}
                                onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                                className="input input-bordered w-full"
                            />
                        </label>

                        <label className="block">
                            NID Number
                            <input
                                type="text"
                                placeholder="NID Number"
                                value={editForm.nidNumber}
                                onChange={(e) => setEditForm({ ...editForm, nidNumber: e.target.value })}
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

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={editForm.mobileVerified} onChange={(e) => setEditForm({ ...editForm, mobileVerified: e.target.checked })} className="checkbox" />
                            Mobile Verified
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={editForm.superAdminVerified} onChange={(e) => setEditForm({ ...editForm, superAdminVerified: e.target.checked })} className="checkbox" />
                            Super Admin Verified
                        </label>

                        <fieldset className="flex flex-col gap-2 mt-5">
                            <legend className="font-semibold">NID Images & Profile Image</legend>

                            <label className="block">
                                NID Front Image
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setEditForm({ ...editForm, nidFrontImage: e.target.files[0] })}
                                    className="file-input file-input-bordered w-full"
                                />
                            </label>

                            <label className="block">
                                NID Back Image
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setEditForm({ ...editForm, nidBackImage: e.target.files[0] })}
                                    className="file-input file-input-bordered w-full"
                                />
                            </label>

                            <label className="block">
                                Profile Image
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
                                    className="file-input file-input-bordered w-full"
                                />
                            </label>
                        </fieldset>

                        <div className="modal-action mt-5 flex justify-end gap-2">
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
