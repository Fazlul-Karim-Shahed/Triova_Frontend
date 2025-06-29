"use client";

import { getAllAdminApi } from "@/src/api/AuthApi";
import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import { getAllPromoApi } from "@/src/api/SuperAdminApi/PromoApi";
import React, { useEffect, useState } from "react";

export default function page() {
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const adminRes = await getAllAdminApi();
            const promoRes = await getAllPromoApi();
            const orderRes = await getAllOrdersApi({ promoFinder: true });

            if (!adminRes.error && !promoRes.error && !orderRes.error) {
                const promos = promoRes.data;
                const orders = orderRes.data.filter((order) => order.orderStatus === "Delivered"); // 🔥 Only delivered orders

                const summary = {};

                promos.forEach((promo) => {
                    if (promo.owner) {
                        const ownerId = promo.owner._id;
                        if (!summary[ownerId]) {
                            summary[ownerId] = {
                                employee: promo.owner,
                                role: promo.owner.role,
                                totalOrders: 0,
                                totalAmount: 0,
                            };
                        }

                        orders.forEach((order) => {
                            if (order.promoCode && order.promoCode._id === promo._id) {
                                summary[ownerId].totalOrders += 1;
                                summary[ownerId].totalAmount += order.totalPrice;
                            }
                        });
                    }
                });

                const finalData = Object.values(summary).map((emp) => ({
                    ...emp,
                    commission: emp.totalAmount * 0.1,
                }));

                setEmployeeData(finalData);
            }
        };

        fetchData();
    }, []);
    

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Employee Promo Commission Report</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Role</th>
                            <th className="px-4 py-2 border">Promo Orders</th>
                            <th className="px-4 py-2 border">Total Order Amount</th>
                            <th className="px-4 py-2 border">Commission (10%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeData.map((emp, idx) => (
                            <tr key={idx} className="text-center">
                                <td className="px-4 py-2 border">{emp.employee.name}</td>
                                <td className="px-4 py-2 border">{emp.employee.email}</td>
                                <td className="px-4 py-2 border">{emp.role}</td>
                                <td className="px-4 py-2 border">{emp.totalOrders}</td>
                                <td className="px-4 py-2 border">৳{emp.totalAmount.toFixed(2)}</td>
                                <td className="px-4 py-2 border text-green-600 font-semibold">৳{emp.commission.toFixed(2)}</td>
                            </tr>
                        ))}
                        {employeeData.length === 0 && (
                            <tr>
                                <td className="px-4 py-4 border text-center" colSpan={6}>
                                    No commission data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
