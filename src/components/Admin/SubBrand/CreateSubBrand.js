
"use client"

import { useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { createSubBrandApi } from "@/src/api/SuperAdminApi/SubBrandApi";



export default function CreateSubBrand({ category, brand }) {


    const [modalState, setModalState] = useState({ error: false, message: '', open: false });

    const [formData, setFormData] = useState({

        verified: true, // change when employee
        name: '',
        description: '',
        logo: null,
        promotionalImage: null,
        promotionalDescription: '',
        promotionalLink: '',
        departmentId: category.departmentId._id,
        categoryId: category._id,
        brandId: ''
    });

    const handleChange = (e) => {

        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createSubBrandApi(formData).then(data => {
            setModalState({ error: data.error, message: data.message, open: true })
        })
    };


    return (
        <div className="mx-auto bg-white rounded pt-6 pb-8 mb-4">

            <h1 className="text-2xl text-center mb-2">Create Sub Brand for Department -  <span className='text-blue-600'>{category.departmentId.name}</span></h1>
            <h1 className="text-xl text-center mb-10">Category - <span className='text-blue-600'>{category.name}</span></h1>

            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">


                <div>
                    <label className="block text-gray-700 mb-1">Brand Name</label>
                    <select name="brandId" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                        <option value="">Select</option>
                        {brand.map(brand => (
                            <option key={brand._id} value={brand._id}>{brand.name}</option>
                        ))} 
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Sub Brand Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Description</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Logo</label>
                    <input type="file" name="logo" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Promotional Image</label>
                    <input type="file" name="promotionalImage" onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Promotional Description</label>
                    <input type="text" name="promotionalDescription" value={formData.promotionalDescription} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
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


            <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
        </div>
    )
}
