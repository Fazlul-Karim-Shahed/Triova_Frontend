"use client";

import { createDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import { Modal } from "../../Common/Modal/Modal";

const CreateDepartment = () => {
    const [modalState, setModalState] = useState({
        error: false,
        message: "",
        open: false,
        loading: false,
    });

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
        // //console.log(formData)
        setModalState({ open: true, loading: true });
        createDepartmentApi(formData).then((data) => setModalState({ error: data.error, message: data.message, open: true, loading: false }));
    };

    return (
        <div className=" mx-auto bg-white rounded-lg mb-10">
            <h2 className="text-3xl font-semibold mb-8">Create Department Form</h2>

            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Description</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Feature Image</label>
                    <input type="file" name="featureImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
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
                    <input type="text" name="promotionalLink" value={formData.promotionalLink} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>

                <div>
                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700">
                        Submit
                    </button>
                </div>
            </form>

            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />
        </div>
    );
};

export default CreateDepartment;
