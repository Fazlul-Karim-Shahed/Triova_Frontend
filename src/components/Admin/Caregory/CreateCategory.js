"use client";

import { createCategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import { getAllDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { Modal } from "../../Common/Modal/Modal";

const CreateCategory = () => {
    const [departments, setDepartments] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        featureImage: null,
        visible: true,
        promotionalImage: null,
        promotionalDescription: "",
        promotionalLink: "",
        departmentId: "",
    });

    useEffect(() => {
        setModalState({ message: "Loading departments...", open: true, loading: true });
        getAllDepartmentApi().then((data) => {
            if (!data.error) {
                setModalState({ error: data.error, message: data.message, open: 0, loading: 0 });
                setDepartments(data.data);
            } else {
                setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
            }
        });
    }, []);

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
        setModalState({ message: "Create new category...", open: 1, loading: 1 });
        createCategoryApi(formData).then((data) => {
            setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        });
    };

    return (
        <div className=" mx-auto bg-white rounded-lg mb-10">
            <h2 className="text-3xl font-semibold mb-8">Create Category Form</h2>

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
                    {/* <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required /> */}
                    <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                        <option value="">Select</option>
                        {departments.map((department) => {
                            return <option value={department._id}>{department.name}</option>;
                        })}
                    </select>
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

export default CreateCategory;
