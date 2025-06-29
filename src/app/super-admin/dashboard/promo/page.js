"use client";

import { useEffect, useState } from "react";
import { createPromoApi, getAllPromoApi, deletPromoApi } from "@/src/api/SuperAdminApi/PromoApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { getAllAdminApi } from "@/src/api/AuthApi";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";

export default function PromoPage() {
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        startDate: "",
        endDate: "",
        discount: "",
        maxAmount: "",
        minOrder: "",
        isAffiliate: false,
        owner: null,
        commission: "",
        products: [],
    });

    const [promos, setPromos] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const [admins, setAdmins] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAllAdminApi().then((data) => {
            if (!data.error) setAdmins(data.data);
        });
        fetchPromos();
        fetchProducts();
    }, []);

    const fetchPromos = async () => {
        const data = await getAllPromoApi();
        if (!data.error) setPromos(data.data);
    };

    const fetchProducts = async () => {
        const res = await getAllProductApi();
        if (!res.error) setProducts(res.data);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const toggleProduct = (id) => {
        setFormData((prev) => ({
            ...prev,
            products: prev.products.includes(id) ? prev.products.filter((pid) => pid !== id) : [...prev.products, id],
        }));
    };

    const selectAllProducts = () => {
        setFormData((prev) => ({ ...prev, products: products.map((p) => p._id) }));
    };

    const unselectAllProducts = () => {
        setFormData((prev) => ({ ...prev, products: [] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if (key === "products") {
                val.forEach((id) => payload.append("products[]", id));
            } else {
                payload.append(key, val);
            }
        });

        const res = await createPromoApi(payload);
        if (!res.error) {
            setFormData({
                code: "",
                description: "",
                startDate: "",
                endDate: "",
                discount: "",
                maxAmount: "",
                minOrder: "",
                isAffiliate: false,
                owner: "",
                commission: "",
                products: [],
            });
            fetchPromos();
        }
        setModalState({ error: res.error, message: res.message, open: true, loading: 0 });
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this promo?")) return;
        const res = await deletPromoApi(id);
        if (!res.error) fetchPromos();
        setModalState({ error: res.error, message: res.message, open: true, loading: 0 });
    };

    return (
        <div className="min-h-screen py-10">
            <div className="rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New Promo</h2>

                <form onSubmit={handleSubmit}>
                    <div className="flex items-center mb-4">
                        <input id="isAffiliate" name="isAffiliate" type="checkbox" checked={formData.isAffiliate} onChange={handleChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded" />
                        <label htmlFor="isAffiliate" className="ml-2 block text-sm font-medium text-gray-700">
                            Affiliate Promo
                        </label>
                    </div>

                    {formData.isAffiliate && (
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Admin</label>
                                <select name="owner" value={formData.owner} onChange={handleChange} className="mt-1 p-2 w-full rounded-lg border border-gray-300" required>
                                    <option value="">Select Admin</option>
                                    {admins.map((admin) => (
                                        <option key={admin._id} value={admin._id}>
                                            {admin.firstName} {admin.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Commission (%)</label>
                                <input type="number" name="commission" value={formData.commission} onChange={handleChange} className="mt-1 p-2 w-full rounded-lg border border-gray-300" required />
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { label: "Promo Code", name: "code" },
                            { label: "Description", name: "description" },
                            { label: "Start Date", name: "startDate", type: "date" },
                            { label: "End Date", name: "endDate", type: "date" },
                            { label: "Discount (%)", name: "discount", type: "number" },
                            { label: "Max Amount", name: "maxAmount", type: "number" },
                            { label: "Min Order", name: "minOrder", type: "number" },
                        ].map(({ label, name, type = "text" }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                <input type={type} name={name} value={formData[name]} onChange={handleChange} className="mt-1 p-2 w-full rounded-lg border border-gray-300" required />
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Product Selection */}
                    <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium text-gray-700">Select Products</label>
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
                                    {products
                                        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.products.includes(product._id)}
                                                        onChange={() => toggleProduct(product._id)}
                                                        className="checkbox checkbox-sm"
                                                    />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.sellingPrice}/-</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button type="submit" className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full">
                        Create Promo
                    </button>
                </form>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center">All Promos</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {promos.length ? (
                        promos.map((promo) => (
                            <div key={promo._id} className="bg-white/60 p-6 rounded-xl shadow">
                                <h3 className="text-lg font-bold">{promo.code}</h3>
                                <p>{promo.description}</p>
                                <p className="text-sm mt-2">
                                    {promo.startDate?.slice(0, 10)} → {promo.endDate?.slice(0, 10)}
                                    <br />
                                    Discount: {promo.discount}%<br />
                                    Max: ${promo.maxAmount} | Min Order: ${promo.minOrder}
                                    <br />
                                    {promo.commission && <>Commission: {promo.commission}%</>}
                                </p>
                                <button className="mt-2 text-red-500 text-sm hover:underline" onClick={() => handleDelete(promo._id)}>
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No promos found.</p>
                    )}
                </div>
            </div>

            <Modal loading={modalState.loading} open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: false })} error={modalState.error} message={modalState.message} />
        </div>
    );
}
