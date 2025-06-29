"use client";

import React, { useEffect, useState } from "react";
import { getAllDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import ShowDepartments from "@/src/components/Admin/Department/ShowDepartments";
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function Department() {
    const [departments, setDepartments] = useState(null);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: false });
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        async function fetchDepartments() {
            setModalState({ open: true, loading: true });
            try {
                const res = await getAllDepartmentApi({});
                if (res.error) {
                    setModalState({ error: res.error, message: res.message, open: true, loading: false });
                    setErrorMsg(res.message);
                } else {
                    setModalState({ error: res.error, message: res.message, open: false, loading: false });
                    setDepartments(res);
                }
            } catch (err) {
                setErrorMsg("Something went wrong while fetching departments.");
            }
        }

        fetchDepartments();
    }, []);

    return (
        <div>
            <div className="text-end">
                <button className="btn mb-5 btn-primary text-white btn-sm">
                    <Link href="/super-admin/dashboard/department/create">Create new department</Link>
                </button>
            </div>

            {departments && <ShowDepartments departments={departments.data} />}

            {/* Modal for Feedback */}
            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />

            <style jsx>{`
                .loader {
                    border-color: #e5e7eb;
                    border-top-color: #3b82f6;
                }
            `}</style>
        </div>
    );
}
