"use client";

import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import React, { useEffect, useState } from "react";

export default function page() {
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const orderRes = await getAllOrdersApi({ promoFinder: true });

            if (!orderRes.error) {
                const deliveredOrders = orderRes.data.filter(
                    (order) => order.orderStatus === "Delivered" && order.reffer // only if there's a referring employee
                );

                const summary = {};

                deliveredOrders.forEach((order) => {
                    const ref = order.reffer;
                    const ownerId = ref._id;

                    if (!summary[ownerId]) {
                        summary[ownerId] = {
                            employee: ref,
                            role: order.orderTakerRole || "N/A",
                            totalOrders: 0,
                            totalAmount: 0,
                            commission: 0,
                        };
                    }

                    const commissionRate = order.commission || 0;
                    const orderCommission = order.totalPrice * (commissionRate / 100);

                    summary[ownerId].totalOrders += 1;
                    summary[ownerId].totalAmount += order.totalPrice;
                    summary[ownerId].commission += orderCommission;
                });

                setEmployeeData(Object.values(summary));
            }
        };

        fetchData();
    }, []);

    console.log(employeeData);

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
                            <th className="px-4 py-2 border">Commission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeData.map((emp, idx) => (
                            <tr key={idx} className="text-center">
                                <td className="px-4 py-2 border">
                                    {emp.employee?.firstName} {emp.employee?.lastName}
                                </td>
                                <td className="px-4 py-2 border">{emp.employee?.email || "N/A"}</td>
                                <td className="px-4 py-2 border">{emp.employee.role}</td>
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
