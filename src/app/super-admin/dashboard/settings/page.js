"use client";

import { useEffect, useState } from "react";
import { updateSettingsApi, getSettingsApi } from "@/src/api/SuperAdminApi/SettingsApi";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function SettingsPage() {
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [bestSelling, setBestSelling] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [settingsId, setSettingsId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalState, setModalState] = useState({
        error: false,
        message: "",
        open: false,
        loading: 0,
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const [productRes, settingsRes] = await Promise.all([getAllProductApi(), getSettingsApi()]);

        if (!productRes.error) {
            setAllProducts(productRes.data);
        }

        if (!settingsRes.error && settingsRes.data) {
            const s = settingsRes.data;
            setSettingsId(s._id);
            setBestSelling(s.bestSelling.map((p) => p._id));
            setCoverPreview(s.coverPhoto?.url || null);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        setCoverPhoto(file);
        if (file) setCoverPreview(URL.createObjectURL(file));
    };

    const toggleProduct = (id) => {
        setBestSelling((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]));
    };

    const selectAllProducts = () => {
        setBestSelling(allProducts.map((p) => p._id));
    };

    const unselectAllProducts = () => {
        setBestSelling([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!settingsId) {
            return alert("⚠️ Settings ID not loaded yet. Try refreshing.");
        }

        const formData = new FormData();
        if (coverPhoto) formData.append("coverPhoto", coverPhoto);
        bestSelling.forEach((id) => formData.append("bestSelling", id)); // Correct way

        const res = await updateSettingsApi(settingsId, formData);

        setModalState({
            error: res.error,
            message: res.message,
            open: true,
            loading: 0,
        });
    };

    return (
        <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Website Settings</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-700">Cover Photo</label>
                        {coverPreview && <img src={coverPreview} alt="Preview" className="mb-3 w-full h-48 object-cover rounded-lg shadow" />}
                        <input type="file" accept="image/*" onChange={handleCoverChange} className="file-input file-input-bordered w-full" />
                    </div>

                    <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-700">Best Selling Products</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="🔍 Search products..." className="input input-sm input-bordered" onChange={(e) => setSearchTerm(e.target.value)} />
                                <button type="button" className="btn btn-xs btn-outline" onClick={selectAllProducts}>
                                    Select All
                                </button>
                                <button type="button" className="btn btn-xs btn-outline" onClick={unselectAllProducts}>
                                    Unselect All
                                </button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-64 border rounded-lg">
                            <table className="table table-sm w-full text-sm">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Product</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProducts
                                        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <input type="checkbox" className="checkbox checkbox-sm" checked={bestSelling.includes(product._id)} onChange={() => toggleProduct(product._id)} />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.sellingPrice}/-</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition">
                            Update Settings
                        </button>
                    </div>
                </form>
            </div>

            <Modal loading={modalState.loading} open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: false })} error={modalState.error} message={modalState.message} />
        </div>
    );
}
