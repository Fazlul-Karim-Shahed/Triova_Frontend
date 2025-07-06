"use client";

import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Styles from "./ShowSubCategories.module.css";
import { deleteSubCategoryApi, updateSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";
import { Modal } from "../../Common/Modal/Modal";

export default function ShowSubCategories({ subCategories, category }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [viewMode, setViewMode] = useState("table");

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
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSubCategoryApi(formData, selectedSubCategory._id).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true });
            document.getElementById("department_edit_modal").close();
        });
    };

    const handleClick = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setFormData({
            name: subCategory.name,
            description: subCategory.description,
            featureImage: subCategory.featureImage,
            visible: subCategory.visible,
            promotionalImage: subCategory.promotionalImage,
            promotionalDescription: subCategory.promotionalDescription,
            promotionalLink: subCategory.promotionalLink,
        });
        document.getElementById("department_edit_modal").showModal();
    };

    const deleteSubCategory = (id) => {
        deleteSubCategoryApi(id).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true });
        });
    };

    return (
        <div>
            <div className="text-2xl text-center my-10 font-semibold">Sub Categories | Category ~ {category.name}</div>

            <div className="flex justify-end gap-2 mb-4">
                <button className={`px-4 py-1 border rounded ${viewMode === "table" ? "bg-green-600 text-white" : "bg-white text-gray-700"}`} onClick={() => setViewMode("table")}>
                    Table View
                </button>
                <button className={`px-4 py-1 border rounded ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-white text-gray-700"}`} onClick={() => setViewMode("grid")}>
                    Grid View
                </button>
            </div>

            {viewMode === "grid" ? (
                <div className="grid md:grid-cols-3 gap-7 my-5">
                    {subCategories.map((subCategory) => (
                        <div className={Styles.total} key={subCategory._id}>
                            <div className="relative flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg hover:bg-green-100 hover:shadow-xl h-full">
                                <div className="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border h-60">
                                    <ClientImageWithLoader src={imageSrc(subCategory.featureImage.name)} alt="sub" fill={true} objectFit="cover" />
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-gray-900">{subCategory.name}</h4>
                                    <p className="text-sm text-gray-700 mt-2">{subCategory.description.length > 150 ? subCategory.description.slice(0, 150) + "..." : subCategory.description}</p>
                                    <div className={`absolute top-0 right-3 space-x-3 ${Styles.test}`}>
                                        <button onClick={() => handleClick({ ...subCategory })} className="mt-5 bg-slate-200 px-3 py-2 rounded text-blue-500 hover:bg-slate-300 text-xs">
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button onClick={() => deleteSubCategory(subCategory._id)} className="mt-5 bg-slate-200 px-3 py-2 rounded text-red-500 hover:bg-slate-300 text-xs">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Visible</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subCategories.map((subCategory) => (
                                <tr key={subCategory._id} className="border-t hover:bg-green-50">
                                    <td className="p-3 font-semibold">{subCategory.name}</td>
                                    <td className="p-3 text-gray-600">
                                        {subCategory.description.slice(0, 80)}
                                        {subCategory.description.length > 80 && "..."}
                                    </td>
                                    <td className="p-3">{subCategory.visible ? "✅" : "❌"}</td>
                                    <td className="p-3 flex gap-2 text-sm">
                                        <button onClick={() => handleClick({ ...subCategory })} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button onClick={() => deleteSubCategory(subCategory._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <dialog id="department_edit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg text-center">{selectedSubCategory && selectedSubCategory.name}</h3>
                    {selectedSubCategory && (
                        <form className="space-y-6 mt-8" onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    name="visible"
                                    checked={formData.visible}
                                    onChange={handleChange}
                                    className="mr-2 text-green-600 border-gray-300 rounded focus:ring-green-500 checkbox checkbox-success"
                                />
                                <label className="block text-gray-700">Visible</label>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Description</label>
                                <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Feature Image</label>
                                <input type="file" name="featureImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Promotional Image</label>
                                <input type="file" name="promotionalImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Promotional Description</label>
                                <input
                                    type="text"
                                    name="promotionalDescription"
                                    value={formData.promotionalDescription}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Promotional Link</label>
                                <input
                                    type="text"
                                    name="promotionalLink"
                                    value={formData.promotionalLink}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                                />
                            </div>

                            <div>
                                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700">
                                    Submit
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
