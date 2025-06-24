"use client";

import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import Styles from "./ShowSubCategories.module.css";
import { deleteDepartmentApi, updateDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import { Modal } from "../../Common/Modal/Modal";
import { deleteSubCategoryApi, updateSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function ShowSubCategories({ subCategories, category }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

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
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        updateSubCategoryApi(formData, selectedSubCategory._id).then((data) => {
            // //console.log(data)
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
            //console.log(data);
            setModalState({ error: data.error, message: data.message, open: true });
        });
    };

    return (
        <div>
            <div className="text-2xl text-center my-10 font-semibold">Sub Categories | Category ~ {category.name}</div>

            <div className="grid md:grid-cols-3 gap-7 my-5">
                {subCategories.map((subCategory) => {
                    return (
                        <div className={Styles.total} key={subCategory._id}>
                            <div class="relative flex flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg hover:bg-green-100 hover:shadow-xl h-ful">
                                <div class="relative m-0 overflow-hidden text-gray-700 bg-transparent rounded-none shadow-none bg-clip-border h-60">
                                    <ClientImageWithLoader src={imageSrc(subCategory.featureImage.name)} alt="ui/ux review check" fill={true} objectFit="cover" />
                                </div>
                                <div class="p-6">
                                    <h4 class="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">{subCategory.name}</h4>
                                    <p class="block mt-3 font-sans text-sm antialiased font-normal leading-relaxed text-gray-700">
                                        {subCategory.description.length > 150 ? subCategory.description.slice(0, 150) + "....." : subCategory.description}
                                    </p>

                                    <div className={`text-end space-x-3 absolute top-0 right-3 ${Styles.test}`}>
                                        <button onClick={() => handleClick({ ...subCategory })} className="mt-5 bg-slate-200 px-3 py-2 rounded text-blue-500 hover:bg-slate-300 text-xs ">
                                            {" "}
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button onClick={() => deleteSubCategory(subCategory._id)} className="mt-5 bg-slate-200 px-3 py-2 rounded text-red-500 hover:bg-slate-300 text-xs">
                                            {" "}
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <dialog id="department_edit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg text-center">{selectedSubCategory && selectedSubCategory.name}</h3>

                    {selectedSubCategory && (
                        <div>
                            <form className="space-y-6 mt-8" onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        name="visible"
                                        checked={formData.visible}
                                        onChange={handleChange}
                                        className="mr-2  text-green-600 border-gray-300 rounded focus:ring-green-500 checkbox checkbox-success"
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
                        </div>
                    )}
                </div>
            </dialog>

            <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
        </div>
    );
}
