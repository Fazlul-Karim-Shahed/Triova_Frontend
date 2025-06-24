"use client";

import { deleteProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";

export default function ShowProduct({ product }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setModalState({ message: "Deleting product", open: 1, loading: 1 });
            deleteProductApi(id).then((data) => {
                setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
            });
        }
    };

    return (
        <div>
            {!product.error ? (
                <div className="overflow-x-auto rounded-lg">
                    <table className="table border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th></th>
                                {/* <th>Batch</th> */}
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.data.map((item, index) => {
                                return (
                                    <tr key={index} className="hover:bg-green-50">
                                        <td>
                                            <ClientImageWithLoader quality={100} width={100} height={100} className="rounded" src={imageSrc(item.featuredImage.name)} alt={item.name.slice(0, 10)} />
                                        </td>
                                        {/* <td>{item.batchId.name}</td> */}
                                        <td className="w-32 truncate text-sm" title={item.name}>
                                            {item.name.length > 25 ? item.name.slice(0, 25) + "..." : item.name}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>{item.stock}</td>
                                        <td>{item.sellingPrice}</td>
                                        <td>{item.discount}</td>
                                        <td className="space-y-4">
                                            <Link href={`/super-admin/dashboard/product/${item._id}`} className="bg-blue-700 py-1 px-2 md:m-4 rounded text-sm text-white font-bold">
                                                Details
                                            </Link>
                                            <button onClick={() => deleteProduct(item._id)} className="bg-error px-2 py-1 text-sm text-white rounded font-bold">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
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
