"use client";

import { deleteDepartmentApi, updateDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { useRouter } from "next/navigation";
import { imageSrc } from "@/src/functions/CustomFunction";
import Loading from "@/src/app/loading";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function ShowDepartments({ departments }) {
    const [modalState, setModalState] = useState({
        error: false,
        message: "",
        open: false,
        loading: false,
    });
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        featureImage: null,
        visible: true,
        promotionalImage: null,
        promotionalDescription: "",
        promotionalLink: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalState({ open: true, loading: true });
        const res = await updateDepartmentApi(formData, selectedDepartment._id);
        if (res.error) {
            setModalState({ error: res.error, message: res.message, open: true, loading: false });
        } else {
            setModalState({ error: res.error, message: res.message, open: false, loading: false });
        }

        document.getElementById("department_edit_modal").showModal();
    };

    const handleClick = (dept) => {
        setSelectedDepartment(dept);
        setFormData({
            name: dept.name,
            description: dept.description,
            featureImage: dept.featureImage,
            visible: dept.visible,
            promotionalImage: dept.promotionalImage,
            promotionalDescription: dept.promotionalDescription,
            promotionalLink: dept.promotionalLink,
        });
        document.getElementById("department_edit_modal").showModal();
    };

    const handleDelete = async (id) => {
        setModalState({ open: true, loading: true, message: "Deleting..." });
        const res = await deleteDepartmentApi(id);
        if (res) {
            setModalState({ error: res.error, message: res.message, open: true, loading: false });
        }
    };

    return (
        <div className="space-y-10">
            <div className="grid md:grid-cols-3 gap-7">
                {departments.length === 0 ? (
                    <div className="col-span-full text-center text-lg font-semibold text-gray-500">No Departments Found</div>
                ) : (
                    departments.map((dept) => (
                        <div key={dept._id} className="bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden border transition-all relative">
                            <div className="w-full h-48 overflow-hidden">
                                <ClientImageWithLoader src={imageSrc(dept.featureImage?.name)} alt={dept.name} className="w-full h-48 object-cover" />
                            </div>

                            <div className="p-4 space-y-2">
                                <h3 className="text-lg font-bold text-gray-800">{dept.name}</h3>
                                <p className="text-sm text-gray-600">{dept.description.length > 150 ? dept.description.slice(0, 150) + "..." : dept.description}</p>

                                <div className="absolute top-3 right-3 flex space-x-2">
                                    <button onClick={() => handleClick(dept)} className="p-2 bg-white border border-gray-200 rounded-full text-blue-600 hover:bg-blue-50" title="Edit">
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                    <button onClick={() => handleDelete(dept._id)} className="p-2 bg-white border border-gray-200 rounded-full text-red-500 hover:bg-red-50" title="Delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for editing department */}
            <dialog id="department_edit_modal" className="modal z-50">
                <div className="modal-box w-11/12 max-w-4xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="text-xl font-semibold text-center">Edit: {selectedDepartment?.name}</h3>

                    {selectedDepartment && (
                        <form onSubmit={handleSubmit} className="space-y-6 mt-6" encType="multipart/form-data">
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} className="checkbox checkbox-success" />
                                <label className="text-gray-700 font-medium">Visible</label>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Description</label>
                                <input type="text" name="description" value={formData.description} onChange={handleChange} className="input input-bordered w-full" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Feature Image</label>
                                <input type="file" name="featureImage" onChange={handleChange} className="file-input file-input-bordered w-full" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Promotional Image</label>
                                <input type="file" name="promotionalImage" onChange={handleChange} className="file-input file-input-bordered w-full" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Promotional Description</label>
                                <input type="text" name="promotionalDescription" value={formData.promotionalDescription} onChange={handleChange} className="input input-bordered w-full" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Promotional Link</label>
                                <input type="text" name="promotionalLink" value={formData.promotionalLink} onChange={handleChange} className="input input-bordered w-full" />
                            </div>

                            <div>
                                <button type="submit" className="btn btn-success w-full text-white font-bold uppercase">
                                    ✅ Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>

            <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
        </div>
    );
}
