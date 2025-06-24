"use client";

import { deleteSubBrandApi, updateSubBrandApi } from "@/src/api/SuperAdminApi/SubBrandApi";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function UpdateSubBrand({ subBrands }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [selectedSubBrand, setSelectedSubBrand] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        logo: null,
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

        updateSubBrandApi(formData, selectedSubBrand._id).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true });
            document.getElementById("subbrand_edit_modal").close();
        });
    };

    const handleClick = (subBrand) => {
        setSelectedSubBrand(subBrand);
        setFormData({
            name: subBrand.name,
            description: subBrand.description,
            logo: subBrand.logo,
            promotionalImage: subBrand.promotionalImage,
            promotionalDescription: subBrand.promotionalDescription,
            promotionalLink: subBrand.promotionalLink,
        });
        document.getElementById("subbrand_edit_modal").showModal();
    };

    const deleteSubBrand = (id) => {
        deleteSubBrandApi(id).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true });
        });
    };

    return (
        <div>
            <section class="bg-white dark:bg-gray-900">
                <div class="py-5">
                    <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                        {subBrands.map((subBrand) => (
                            <div class="items-center group bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
                                <a href="#"><ClientImageWithLoader src={imageSrc(subBrand.logo.name)} alt="Bonnie Avatar" /></a>
                                <div class="p-5">
                                    <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-green-600 ">
                                        <a onClick={() => handleClick(subBrand)} href="#">
                                            {subBrand.name}
                                        </a>
                                    </h3>
                                    <span class="text-gray-500 dark:text-gray-400 ">Brand: {subBrand.brandId.name}</span>
                                    <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400 text-xs">{subBrand.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <dialog id="subbrand_edit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg text-center">{selectedSubBrand && selectedSubBrand.name}</h3>

                    {selectedSubBrand && (
                        <div>
                            <form className="space-y-6 mt-8" onSubmit={handleSubmit} encType="multipart/form-data">
                                <div>
                                    <label className="block text-gray-700 mb-1">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Description</label>
                                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Logo</label>
                                    <input type="file" name="logo" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
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

                            <button onClick={() => deleteSubBrand(selectedSubBrand._id)} type="button" className="w-full mt-5 bg-red-500 text-white p-2 rounded hover:bg-red-700">
                                Delete Brand
                            </button>
                        </div>
                    )}
                </div>
            </dialog>

            <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
        </div>
    );
}
