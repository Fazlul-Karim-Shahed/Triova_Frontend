"use client";

import { useEffect, useState } from "react";
import { getACategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import UpdateCategory from "@/src/components/Admin/Caregory/UpdateCategory";
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function CategoryDetailsPage({ params }) {
    const [category, setCategory] = useState(null);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    useEffect(() => {
        setModalState({ message: "Fetching category...", open: 1, loading: 1 });
        async function fetchCategory() {
            const res = await getACategoryApi(params.category_id);
            if (!res.error) {
                setModalState({ open: 0 });
                setCategory(res.data);
            } else {
                setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            }
        }

        fetchCategory();
    }, [params.category_id]);

    return (
        <div>
            <div className="text-end space-x-3 mb-5">
                <button className="btn btn-primary text-white btn-sm">
                    <Link href={`/super-admin/dashboard/category/${params.category_id}/sub-category`}>Sub Category</Link>
                </button>
                <button className="btn btn-primary text-white btn-sm">
                    <Link href={`/super-admin/dashboard/category/${params.category_id}/brand`}>Brand</Link>
                </button>
                <button className="btn btn-primary text-white btn-sm">
                    <Link href={`/super-admin/dashboard/category/${params.category_id}/sub-brand`}>Sub Brand</Link>
                </button>
            </div>

            {category && <UpdateCategory category={category} />}

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
