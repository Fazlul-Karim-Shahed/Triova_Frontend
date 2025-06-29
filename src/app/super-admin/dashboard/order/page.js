"use client";

import React, { useEffect, useState } from "react";
import { getAllCourierApi } from "@/src/api/SuperAdminApi/CourierApi";
import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import ShowAdminOrder from "@/src/components/Admin/AdminOrder/ShowAdminOrder";
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function OrderPage() {
    const [orders, setOrders] = useState(null);
    const [courier, setCourier] = useState(null);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    useEffect(() => {
        async function fetchData() {
            setModalState({ message: "Fetching order data...", open: 1, loading: 1 });
            try {
                const [ordersRes, courierRes] = await Promise.all([getAllOrdersApi({}), getAllCourierApi()]);

                if (ordersRes.error || courierRes.error) {
                    setModalState({ error: true, message: ordersRes.message || courierRes.message, open: 1, loading: 0 });
                } else {
                    
                    setModalState({ error: false, message: "", open: 0, loading: 0 });
                    setOrders(ordersRes.data);
                    setCourier(courierRes.data);
                }
            } catch (err) {
                setModalState({ error: true, message: "Failed to load order or courier data.", open: 1, loading: 0 });
            }
        }

        fetchData();
    }, []);

    console.log(orders);
    console.log(courier);


    return (
        <div>
            <div className="text-end space-x-4">
                <Link href="/super-admin/dashboard/order/summery">
                    <button className="btn mb-5 btn-neutral text-white btn-sm">Summery</button>
                </Link>
                <Link href="/super-admin/dashboard/order/create">
                    <button className="btn mb-5 btn-primary text-white btn-sm">Manual order</button>
                </Link>
            </div>

            {orders && courier && <ShowAdminOrder orders={orders} courier={courier} />}

            {!orders && <div className="text-center text-red-600 p-10 font-bold text-xl">{modalState.message}</div>}

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
