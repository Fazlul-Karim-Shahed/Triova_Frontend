"use client";

import { deleteProductApi, updateProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import React, { useState, useMemo } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import Link from "next/link";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle, faSave, faTimes, faTrash, faTh, faTable } from "@fortawesome/free-solid-svg-icons";

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
    const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setModalState({ message: "Deleting product", open: true, loading: true });
            deleteProductApi(id).then((data) => {
                setModalState({ error: data.error, message: data.message, open: true, loading: false });
            });
        }
    };

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
                    {/* Filters & View Switcher */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 items-center">
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

                        <button
                            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded-md flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={viewMode === "table" ? faTh : faTable} className="mr-2" />
                            {viewMode === "table" ? "Grid View" : "Table View"}
                        </button>
                    </div>

                    {/* Product Display */}
                    {viewMode === "table" ? (
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full table-auto border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
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
                                                    <ClientImageWithLoader
                                                        quality={100}
                                                        width={80}
                                                        height={80}
                                                        className="rounded"
                                                        src={imageSrc(item.featuredImage?.name)}
                                                        alt={item.name.slice(0, 10)}
                                                    />
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
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((item) => {
                                const isEditing = editRow === item._id;
                                const isSaving = savingState[item._id];

                                return (
                                    <div key={item._id} className="group border rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col justify-between">
                                        {/* Product Image */}
                                        <div className="overflow-hidden rounded-xl mb-3">
                                            <ClientImageWithLoader
                                                className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                                                src={imageSrc(item.featuredImage?.name)}
                                                alt={item.name}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 space-y-2">
                                            {isEditing ? (
                                                <>
                                                    <textarea
                                                        rows={2}
                                                        value={editData.name}
                                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                        className="w-full border rounded p-1 text-sm"
                                                    />
                                                    <div className="flex justify-between gap-2 text-sm">
                                                        <input
                                                            type="number"
                                                            value={editData.orderPrice}
                                                            onChange={(e) => setEditData({ ...editData, orderPrice: e.target.value })}
                                                            className="border rounded px-2 py-1 w-full"
                                                            placeholder="Order Price"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={editData.sellingPrice}
                                                            onChange={(e) => setEditData({ ...editData, sellingPrice: e.target.value })}
                                                            className="border rounded px-2 py-1 w-full"
                                                            placeholder="Selling Price"
                                                        />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={editData.discount}
                                                        onChange={(e) => setEditData({ ...editData, discount: e.target.value })}
                                                        className="border rounded px-2 py-1 w-full text-sm"
                                                        placeholder="Discount %"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2" title={item.name}>
                                                        {item.name}
                                                    </h3>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-green-600 font-semibold">৳{item.sellingPrice}</span>
                                                        <span className="text-gray-500">Stock: {item.stock}</span>
                                                    </div>
                                                    {item.discount > 0 && <p className="text-xs text-red-500">Discount: {item.discount}%</p>}
                                                </>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex space-x-7 items-center mt-5 py-3 text-sm">
                                            {isEditing ? (
                                                <>
                                                    <button onClick={() => handleSave(item._id)} className="text-green-600 hover:text-green-700" title="Save" disabled={isSaving}>
                                                        <FontAwesomeIcon icon={faSave} />
                                                    </button>
                                                    <button onClick={() => setEditRow(null)} className="text-gray-500 hover:text-gray-600" title="Cancel">
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEditClick(item)} className="text-yellow-500 hover:text-yellow-600" title="Edit">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <Link href={`/super-admin/dashboard/product/${item._id}`} className="text-blue-600 hover:text-blue-700" title="Details">
                                                        <FontAwesomeIcon icon={faInfoCircle} />
                                                    </Link>
                                                    <button onClick={() => deleteProduct(item._id)} className="text-red-500 hover:text-red-600" title="Delete">
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filteredProducts.length === 0 && <p className="text-center py-6 text-gray-500">No products found.</p>}
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
