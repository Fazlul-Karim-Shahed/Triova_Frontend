"use client";

import { deleteProductApi, updateProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import React, { useState, useMemo } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import Link from "next/link";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle, faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ShowProduct({ product }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedSubBrand, setSelectedSubBrand] = useState("");
    const [editRow, setEditRow] = useState(null);
    const [savingState, setSavingState] = useState({});
    const [editData, setEditData] = useState({});

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setModalState({ message: "Deleting product", open: true, loading: true });
            deleteProductApi(id).then((data) => {
                setModalState({ error: data.error, message: data.message, open: true, loading: false });
            });
        }
    };

    // Extract filter values
    const uniqueCategories = useMemo(() => [...new Set(product?.data?.map((p) => p.categoryId?.name).filter(Boolean))], [product]);
    const uniqueSubCategories = useMemo(() => [...new Set(product?.data?.map((p) => p.subCategoryId?.name).filter(Boolean))], [product]);
    const uniqueBrands = useMemo(() => [...new Set(product?.data?.map((p) => p.brandId?.name).filter(Boolean))], [product]);
    const uniqueSubBrands = useMemo(() => [...new Set(product?.data?.map((p) => p.subBrandId?.name).filter(Boolean))], [product]);

    const filteredProducts = product?.data?.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? item.categoryId?.name === selectedCategory : true;
        const matchesSubCategory = selectedSubCategory ? item.subCategoryId?.name === selectedSubCategory : true;
        const matchesBrand = selectedBrand ? item.brandId?.name === selectedBrand : true;
        const matchesSubBrand = selectedSubBrand ? item.subBrandId?.name === selectedSubBrand : true;
        return matchesSearch && matchesCategory && matchesSubCategory && matchesBrand && matchesSubBrand;
    });

    const handleEditClick = (item) => {
        setEditRow(item._id);
        setEditData({
            name: item.name,
            orderPrice: item.orderPrice || 0,
            sellingPrice: item.sellingPrice || 0,
            discount: item.discount || 0,
        });
    };

    const handleSave = (productId) => {
        setSavingState((prev) => ({ ...prev, [productId]: true }));

        updateProductApi(productId, {
            name: editData.name,
            orderPrice: Number(editData.orderPrice),
            sellingPrice: Number(editData.sellingPrice),
            discount: Number(editData.discount),
        }).then((data) => {
            setModalState({ error: data.error, message: data.message, open: true, loading: false });
            setSavingState((prev) => ({ ...prev, [productId]: false }));
            setEditRow(null);
        });
    };

    return (
        <div>
            {!product.error ? (
                <>
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border rounded-md shadow-sm w-full"
                        />
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border rounded-md w-full">
                            <option value="">All Categories</option>
                            {uniqueCategories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} className="px-4 py-2 border rounded-md w-full">
                            <option value="">All Subcategories</option>
                            {uniqueSubCategories.map((sub, idx) => (
                                <option key={idx} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="px-4 py-2 border rounded-md w-full">
                            <option value="">All Brands</option>
                            {uniqueBrands.map((brand, idx) => (
                                <option key={idx} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                        <select value={selectedSubBrand} onChange={(e) => setSelectedSubBrand(e.target.value)} className="px-4 py-2 border rounded-md w-full">
                            <option value="">All SubBrands</option>
                            {uniqueSubBrands.map((sb, idx) => (
                                <option key={idx} value={sb}>
                                    {sb}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Table */}
                    <div className="overflow-x-auto rounded-lg">
                        <table className="w-full table-auto border text-sm">
                            <thead className="bg-gray-100">
                                <tr className="">
                                    <th className="p-3">Image</th>
                                    <th>Name</th>
                                    <th>Order Price</th>
                                    <th>Selling Price</th>
                                    <th>Discount (%)</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((item) => {
                                    const isEditing = editRow === item._id;
                                    const isSaving = savingState[item._id];

                                    return (
                                        <tr key={item._id} className="hover:bg-green-50 align-top">
                                            <td className="p-2">
                                                <ClientImageWithLoader quality={100} width={80} height={80} className="rounded" src={imageSrc(item.featuredImage?.name)} alt={item.name.slice(0, 10)} />
                                            </td>
                                            <td className="p-2 w-64">
                                                {isEditing ? (
                                                    <textarea
                                                        rows={8}
                                                        value={editData.name}
                                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                        className="w-full border rounded p-1"
                                                    />
                                                ) : (
                                                    <p title={item.name}>
                                                        {item.name.slice(0, 80)}
                                                        {item.name.length > 80 && "..."}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editData.orderPrice}
                                                        onChange={(e) => setEditData({ ...editData, orderPrice: e.target.value })}
                                                        className="w-20 border rounded px-1"
                                                    />
                                                ) : (
                                                    item.orderPrice
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editData.sellingPrice}
                                                        onChange={(e) => setEditData({ ...editData, sellingPrice: e.target.value })}
                                                        className="w-20 border rounded px-1"
                                                    />
                                                ) : (
                                                    item.sellingPrice
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editData.discount}
                                                        onChange={(e) => setEditData({ ...editData, discount: e.target.value })}
                                                        className="w-16 border rounded px-1"
                                                    />
                                                ) : (
                                                    item.discount
                                                )}
                                            </td>
                                            <td className="p-2 text-center">{item.stock}</td>
                                            <td className="flex gap-2 items-center justify-center p-2 text-white text-xs text-center">
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={() => handleSave(item._id)} className="text-green-600 p-1 text-lg" title="Save" disabled={isSaving}>
                                                            <FontAwesomeIcon icon={faSave} />
                                                        </button>
                                                        <button onClick={() => setEditRow(null)} className="text-gray-500 p-1 text-lg" title="Cancel">
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleEditClick(item)} className="text-yellow-500 p-1 text-lg" title="Edit">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                )}

                                                <Link href={`/super-admin/dashboard/product/${item._id}`} className="text-blue-700 p-1 text-lg flex items-center justify-center" title="Details">
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                </Link>

                                                <button onClick={() => deleteProduct(item._id)} className="text-red-600 p-1 text-lg" title="Delete">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredProducts.length === 0 && <p className="text-center py-6 text-gray-500">No products found.</p>}
                    </div>
                </>
            ) : (
                <p>{product.message}</p>
            )}

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
