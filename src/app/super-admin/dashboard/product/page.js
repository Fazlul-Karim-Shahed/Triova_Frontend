"use client";

import { useEffect, useState } from "react";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import ShowProduct from "@/src/components/Admin/Product/ShowProduct";
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function ProductPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });

    useEffect(() => {
        async function fetchProducts() {
            setModalState({ message: "Loading products...", open: true, loading: true });
            try {
                const res = await getAllProductApi();
                if (res.error) {
                    setModalState({ error: res.error, message: res.message, open: true, loading: false });
                    setError(res.message || "Failed to load products.");
                } else {
                    setModalState({ error: res.error, message: res.message, open: false, loading: false });
                    setData(res);
                }
            } catch (err) {
                setError("Something went wrong while fetching products.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return (
        <div>
            <div className="text-end mb-10">
                <button className="btn btn-primary text-white btn-sm">
                    <Link href="/super-admin/dashboard/product/create">Create new Product</Link>
                </button>
            </div>

            {data && <ShowProduct product={data} />}

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
