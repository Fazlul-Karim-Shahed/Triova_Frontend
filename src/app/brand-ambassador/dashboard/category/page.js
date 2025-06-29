"use client";

import React, { useEffect, useState } from "react";
import { getAllCategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import ShowCategories from "@/src/components/Admin/Caregory/ShowCategories";
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function Category() {
    const [categories, setCategories] = useState(null);

    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });

    useEffect(() => {
        async function fetchCategories() {
            setModalState({ message: "Fetching category...", open: 1, loading: 1 });
            try {
                const res = await getAllCategoryApi();
                if (res.error) {
                    setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
                } else {
                    setModalState({ error: res.error, message: res.message, open: 0, loading: 0 });
                    setCategories(res);
                }
            } catch (err) {
                setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            }
        }
        fetchCategories();
    }, []);

    return (
        <div>
            <div className="text-end space-x-3 mb-5">
                <button className="btn btn-primary text-white btn-sm">
                    <Link href="/super-admin/dashboard/category/create">Create new category</Link>
                </button>
            </div>

            {categories && categories.data.length > 0 && <ShowCategories categories={categories.data} />}

            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />

            <style jsx>{`
                .loader {
                    border-top-color: #3498db;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
