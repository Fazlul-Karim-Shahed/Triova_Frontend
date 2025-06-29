"use client";

import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import { getAllExpenseApi } from "@/src/api/SuperAdminApi/ExpenseApi";
import { cleanObject } from "@/src/functions/CustomFunction";
import { useState } from "react";
import { Chart } from "react-google-charts";

export default function SummeryPage() {
    const [order, setOrder] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [data, setData] = useState([]);
    const [state, setState] = useState({
        startDate: "",
        endDate: "",
        day: null,
        chartType: "ScatterChart",
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.name === "day" ? Number(e.target.value) : e.target.value,
        });
    };

    const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const filters = cleanObject(state);

        const [orderRes, expenseRes] = await Promise.all([getAllOrdersApi(filters), getAllExpenseApi()]);

        let filteredExpenses = [];

        const startDate = state.day ? normalizeDate(Date.now() - state.day * 24 * 60 * 60 * 1000) : normalizeDate(state.startDate);

        const endDate = state.day ? normalizeDate(new Date()) : state.endDate ? normalizeDate(state.endDate) : normalizeDate(new Date());

        if (!expenseRes.error) {
            filteredExpenses = expenseRes.data.filter((exp) => {
                const expenseDate = normalizeDate(exp.date);
                return expenseDate >= startDate && expenseDate <= endDate;
            });
            setExpenses(filteredExpenses);
        } else {
            setExpenses([]);
        }

        if (!orderRes.error) {
            setOrder(orderRes.data);

            let arr = [];

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const label = `${year}-${month}-${day}`;

                // Orders
                const orderCount = orderRes.data.filter((o) => {
                    const d = normalizeDate(o.createdAt);
                    return d.getDate() === day && d.getMonth() + 1 === month && d.getFullYear() === year && o.orderStatus !== "Returned" && o.orderStatus !== "Pending Return";
                }).length;

                // Returns
                const returnCount = orderRes.data.filter((o) => {
                    const d = normalizeDate(o.createdAt);
                    return d.getDate() === day && d.getMonth() + 1 === month && d.getFullYear() === year && (o.orderStatus === "Returned" || o.orderStatus === "Pending Return");
                }).length;

                // Expenses
                const expenseTotal = filteredExpenses
                    .filter((exp) => {
                        const d = normalizeDate(exp.date);
                        return d.getDate() === day && d.getMonth() + 1 === month && d.getFullYear() === year;
                    })
                    .reduce((acc, item) => acc + item.amount, 0);

                arr.push([label, orderCount, returnCount, expenseTotal]);
            }

            setData(arr);
        } else {
            setOrder([]);
            setData([]);
        }
    };

    // ✅ Calculate revenue only from Delivered orders
    const deliveredOrders = order.filter((o) => o.orderStatus === "Delivered");
    const totalRevenue = deliveredOrders.reduce((acc, item) => acc + item.totalPrice, 0);

    const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
    const profit = totalRevenue - totalExpenses;

    const options = {
        title: "Orders and Expenses Overview",
        curveType: "function",
        legend: { position: "bottom" },
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-5 grid md:grid-cols-7 gap-5">
                <div>
                    <label className="font-medium">Select Range</label>
                    <select disabled={state.startDate !== "" || state.endDate !== ""} className="mt-2 w-full input input-bordered input-sm me-4" name="day" value={state.day} onChange={handleChange}>
                        <option value={null}>---Select---</option>
                        <option value="7">Last 7 days</option>
                        <option value="15">Last 15 days</option>
                        <option value="30">Last 1 Month</option>
                        <option value="60">Last 2 Month</option>
                        <option value="90">Last 3 Month</option>
                        <option value="180">Last 6 month</option>
                        <option value="365">Last 1 year</option>
                    </select>
                </div>

                <div className="text-center font-bold flex md:items-end h-full">
                    <span className="w-full me-4">Or set custom</span>
                </div>

                <div>
                    <label className="font-medium">Select Start Date</label>
                    <input disabled={state.day} type="date" className="py-2 mt-2 w-full input input-bordered input-sm me-4" name="startDate" value={state.startDate} onChange={handleChange} />
                </div>

                <div>
                    <label className="font-medium">Select End Date</label>
                    <input disabled={state.day} type="date" className="mt-2 w-full input input-bordered input-sm me-4" name="endDate" value={state.endDate} onChange={handleChange} />
                </div>

                <div className="flex md:items-end">
                    <button className="btn btn-sm" type="submit">
                        Submit
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card title="Total Orders" value={order.length} netWorth={order.reduce((acc, item) => acc + item.totalPrice, 0)} />

                <Card
                    title="Pending Orders"
                    value={order.filter((o) => o.orderStatus === "Pending").length}
                    netWorth={order.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Shipped").reduce((acc, item) => acc + item.totalPrice, 0)}
                    color="red"
                />
                <Card title="Completed Orders" value={deliveredOrders.length} netWorth={totalRevenue} color="green" />
                <Card
                    title="Returned Orders"
                    value={order.filter((o) => o.orderStatus === "Returned" || o.orderStatus === "Pending Return").length}
                    netWorth={order.filter((o) => o.orderStatus === "Returned" || o.orderStatus === "Pending Return").reduce((acc, item) => acc + item.totalPrice, 0)}
                    color="red"
                />
                <Card title="Total Expenses" value={expenses.length} netWorth={totalExpenses} color="yellow" />
                <Card title="Net Profit" value="" netWorth={profit} color={profit >= 0 ? "green" : "red"} />
            </div>

            {order.length > 0 && (
                <div className="mb-6">
                    <div className="text-center mt-10">
                        <form onSubmit={handleSubmit}>
                            <span className="inline me-3 font-bold">Select Chart Mode: </span>
                            <select className="input input-bordered input-sm me-4" name="chartType" value={state.chartType} onChange={handleChange}>
                                <option value="Bar">Bar Chart</option>
                                <option value="LineChart">Line Chart</option>
                                <option value="AreaChart">Area Chart</option>
                                <option value="SteppedAreaChart">Stepped Area Chart</option>
                                <option value="ScatterChart">Scatter Chart</option>
                            </select>
                        </form>
                    </div>

                    <div>
                        <Chart chartType={state.chartType} width="100%" height="500px" data={[["Date", "Orders", "Returned", "Expenses"], ...data]} options={options} legendToggle />
                    </div>
                </div>
            )}
        </div>
    );
}

const Card = ({ title, value, netWorth, color = "gray" }) => {
    const bgColor = {
        red: "bg-red-50 text-red-800",
        green: "bg-green-50 text-green-800",
        yellow: "bg-yellow-50 text-yellow-800",
        gray: "bg-gray-50 text-gray-700",
    }[color];

    return (
        <div className={`p-4 ${bgColor} border rounded-lg text-center`}>
            <p className="text-sm">{title}</p>
            {value !== "" && <p className="text-2xl font-semibold">{value}</p>}
            <p className="text-sm font-bold">Net Worth Tk {netWorth.toFixed(2)} /=</p>
        </div>
    );
};
