"use client";

import { deleteBrandApi, updateBrandApi } from "@/src/api/SuperAdminApi/BrandApi";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function UpdateBrand({ brands }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false });
    const [selectedBrand, setSelectedBrand] = useState(null);

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

        updateBrandApi(formData, selectedBrand._id).then((data) => {
            // //console.log(data)
            setModalState({ error: data.error, message: data.message, open: true });
            document.getElementById("brand_edit_modal").close();
        });
    };

    const handleClick = (brand) => {
        setSelectedBrand(brand);
        setFormData({
            name: brand.name,
            description: brand.description,
            logo: brand.logo,
            promotionalImage: brand.promotionalImage,
            promotionalDescription: brand.promotionalDescription,
            promotionalLink: brand.promotionalLink,
        });
        document.getElementById("brand_edit_modal").showModal();
    };

    const deleteBrand = (id) => {
        deleteBrandApi(id).then((data) => {
            //console.log(data);
            setModalState({ error: data.error, message: data.message, open: true });
        });
    };

    return (
        <div>
            {!brands.error && (
                <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-8 max-w-xl mx-auto md:max-w-3xl lg:max-w-full">
                    {brands.map((brand) => (
                        <div onClick={() => handleClick(brand)} className="block group md:col-span-2 lg:col-span-1 ">
                            <div className="relative mb-4">
                                <ClientImageWithLoader quality={100}
                                width={200}
                                height={200}
                                src={imageSrc(brand.logo.name)}
                                alt="Antonio image" className="w-60 h-60 rounded-full mx-auto transition-all duration-500 object-contain border border-solid border-transparent
                                group-hover:border-green-600 hover:shadow-xl" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-green-600">{brand.name}</h4>
                        </div>
                    ))}
                </div>
            )}

            <dialog id="brand_edit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg text-center">{selectedBrand && selectedBrand.name}</h3>

                    {selectedBrand && (
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

                            <button onClick={() => deleteBrand(selectedBrand._id)} type="button" className="w-full mt-5 bg-red-500 text-white p-2 rounded hover:bg-red-700">
                                Delete Brand
                            </button>
                        </div>
                    )}
                </div>

                <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
            </dialog>
        </div>
    );
}
