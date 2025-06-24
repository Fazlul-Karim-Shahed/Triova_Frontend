"use client";

import { deleteCategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function ShowCategories({ categories }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    const deleteCategory = async (id) => {
        setModalState({ message: "Deleting category...", open: 1, loading: 1 });
        const data = await deleteCategoryApi(id);
        setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
    };

    return (
        <div className="bg-white rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">All Categories</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm text-left rounded-xl overflow-hidden">
                    <thead className="bg-gradient-to-r from-gray-100 to-white text-gray-700">
                        <tr>
                            <th className="py-3 px-4 font-semibold border-b">Image</th>
                            <th className="py-3 px-4 font-semibold border-b">Name</th>
                            <th className="py-3 px-4 font-semibold border-b">Department</th>
                            {/* <th className="py-3 px-4 font-semibold border-b">Description</th> */}
                            <th className="py-3 px-4 font-semibold border-b">Visible</th>
                            <th className="py-3 px-4 font-semibold border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={index} className="hover:bg-green-50 transition duration-200 border-b">
                                <td className="py-3 px-4">
                                    <ClientImageWithLoader src={imageSrc(category.featureImage?.name)} alt={category.name} className="h-16 w-16 object-cover rounded-md shadow" />
                                </td>
                                <td className="py-3 px-4 text-gray-800 font-medium">{category.name}</td>
                                <td className="py-3 px-4 text-gray-600">{category.departmentId?.name || "—"}</td>
                                {/* <td className="py-3 px-4 text-gray-600 truncate">{category.description.length > 50 ? category.description.slice(0, 50) + "..." : category.description}</td> */}
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${category.visible ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                        {category.visible ? "Yes" : "No"}
                                    </span>
                                </td>
                                <td className="py-3 px-4 flex gap-3 justify-center">
                                    <Link href={`/super-admin/dashboard/category/${category._id}`}>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow text-sm flex items-center gap-1">
                                            <FontAwesomeIcon icon={faEdit} />
                                            Edit
                                        </button>
                                    </Link>
                                    <button onClick={() => deleteCategory(category._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow text-sm flex items-center gap-1">
                                        <FontAwesomeIcon icon={faTrash} />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Feedback modal */}
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
