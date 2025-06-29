"use client";

import { createImageSliderApi } from "@/src/api/SuperAdminApi/ImageSliderApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import React, { useState } from "react";

export default function ImageSlider() {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    const [formData, setFormData] = useState({
        verified: true, // change when employee
        name: "",
        description: "",
        promotionalImage: null,
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

        setModalState({ message: "Creating event. Please wait...", open: 1, loading: 1 });

        createImageSliderApi(formData).then((data) => {
            setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        });
    };

    return (
        <div className="mx-auto bg-white rounded pt-6 pb-8 mb-4">
            <h1 className="text-2xl text-center mb-2">Create Slide</h1>

            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label className="block text-gray-700 mb-1">Slide Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Description</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Promotional Image</label>
                    <input type="file" name="promotionalImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
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
}
