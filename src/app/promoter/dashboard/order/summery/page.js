"use client";

import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import { cleanObject } from "@/src/functions/CustomFunction";
import { useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";

export default function SummeryPage() {
    const [order, setOrder] = useState([]);
    const [data, setData] = useState([]);
    const store = useSelector((state) => state.triova);
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
        const orderRes = await getAllOrdersApi(filters);

        const startDate = state.day ? normalizeDate(Date.now() - state.day * 24 * 60 * 60 * 1000) : normalizeDate(state.startDate);

        const endDate = state.day ? normalizeDate(new Date()) : state.endDate ? normalizeDate(state.endDate) : normalizeDate(new Date());

        if (!orderRes.error) {
            const filteredOrders = orderRes.data.filter((order) => order.promoCode?.owner?._id === store.decodedToken._id);
            setOrder(filteredOrders);

            let arr = [];

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const label = `${year}-${month}-${day}`;

                const orderCount = filteredOrders.filter((o) => {
                    const d = normalizeDate(o.createdAt);
                    return d.getDate() === day && d.getMonth() + 1 === month && d.getFullYear() === year && o.orderStatus !== "Returned" && o.orderStatus !== "Pending Return";
                }).length;

                const returnCount = filteredOrders.filter((o) => {
                    const d = normalizeDate(o.createdAt);
                    return d.getDate() === day && d.getMonth() + 1 === month && d.getFullYear() === year && (o.orderStatus === "Returned" || o.orderStatus === "Pending Return");
                }).length;

                arr.push([label, orderCount, returnCount]);
            }

            setData(arr);
        } else {
            setOrder([]);
            setData([]);
        }
    };

    const totalRevenue = order.reduce((acc, item) => acc + item.totalPrice, 0);

    // My Payment Calculation (10% commission)
    const COMMISSION_PERCENT = 10;
    const deliveredOrders = order.filter((o) => o.orderStatus === "Delivered");

    const myPayment = deliveredOrders.reduce((acc, o) => {
        const orderTotal = o.orderList.reduce((sum, item) => {
            const sellingPrice = item?.productId?.sellingPrice || 0;
            return sum + (sellingPrice * COMMISSION_PERCENT) / 100;
        }, 0);
        return acc + orderTotal;
    }, 0);

    const options = {
        title: "Orders Overview",
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <Card title="Total Orders" value={order.length} netWorth={totalRevenue} />
                <Card
                    title="Pending Orders"
                    value={order.filter((o) => o.orderStatus === "Pending").length}
                    netWorth={order.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Shipped").reduce((acc, item) => acc + item.totalPrice, 0)}
                    color="red"
                />
                <Card
                    title="Completed Orders"
                    value={order.filter((o) => o.orderStatus === "Delivered").length}
                    netWorth={order.filter((o) => o.orderStatus === "Delivered").reduce((acc, item) => acc + item.totalPrice, 0)}
                    color="green"
                />
                <Card
                    title="Returned Orders"
                    value={order.filter((o) => o.orderStatus === "Returned" || o.orderStatus === "Pending Return").length}
                    netWorth={order.filter((o) => o.orderStatus === "Returned" || o.orderStatus === "Pending Return").reduce((acc, item) => acc + item.totalPrice, 0)}
                    color="red"
                />
                <Card title="My Payment" value="" netWorth={myPayment} color="yellow" />
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
                        <Chart chartType={state.chartType} width="100%" height="500px" data={[["Date", "Orders", "Returned"], ...data]} options={options} legendToggle />
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
            <p className="text-sm mb-3">
                {title} {"(10%)"}{" "}
            </p>
            {value !== "" && <p className="text-2xl font-semibold">{value}</p>}
            <p className="text-sm font-bold">Net Worth Tk {netWorth.toFixed(2)} /=</p>
        </div>
    );
};
