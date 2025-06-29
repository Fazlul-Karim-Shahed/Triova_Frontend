"use client";

import React, { useEffect, useState } from "react";
import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import ShowAdminOrder from "@/src/components/Admin/AdminOrder/ShowAdminOrder";
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { useSelector } from "react-redux";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import InvoiceTemplate from "@/src/app/mytriova/invoice/page";

import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";

export default function OrderPage() {
    const [orderList, setOrderList] = useState([]);
    const [allOrders, setAllOrders] = useState([]); // New state
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [printOrder, setPrintOrder] = useState(null);

    const store = useSelector((store) => store.triova);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [formData, setFormData] = useState({
        mobile: searchParams.get("mobile") || "",
        orderStatus: "all",
    });

    useEffect(() => {
        async function fetchData() {
            setModalState({ message: "Fetching order data...", open: true, loading: 1 });
            try {
                const [ordersRes] = await Promise.all([getAllOrdersApi({})]);

                if (ordersRes.error) {
                    setModalState({ error: true, message: ordersRes.message });
                } else {
                    const filteredOrders = ordersRes.data.filter((order) => order.promoCode?.owner?._id === store?.decodedToken?._id);
                    setAllOrders(filteredOrders); // Save original list
                    setOrderList(filteredOrders); // Display filtered list
                    setModalState({ error: false, message: "", open: false, loading: 0 });
                }
            } catch (err) {
                setModalState({ error: true, message: "Failed to load order data.", open: true, loading: 0 });
            }
        }

        fetchData();
    }, [store?.decodedToken?._id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const filtered = allOrders.filter((o) => {
            const byMobile = formData.mobile ? Number(o.mobile) === Number(formData.mobile) : true;
            const byStatus = formData.orderStatus === "all" ? true : o.orderStatus === formData.orderStatus;
            return byMobile && byStatus;
        });

        setOrderList(filtered);

        const params = new URLSearchParams(searchParams.toString());
        if (formData.mobile) {
            params.set("mobile", formData.mobile);
        } else {
            params.delete("mobile");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleOrderStatus = (e) => {
        const status = e.target.value;
        setFormData((prev) => ({ ...prev, orderStatus: status }));

        const filtered = allOrders.filter((o) => {
            const byMobile = formData.mobile ? Number(o.mobile) === Number(formData.mobile) : true;
            const byStatus = status === "all" ? true : o.orderStatus === status;
            return byMobile && byStatus;
        });

        setOrderList(filtered);
    };

    const handleOrderDetails = (order) => {
        setSelectedOrder(order);
        document.getElementById("order_details_modal")?.showModal();
    };

    const printInvoice = (order) => {
        setPrintOrder(order);

        setTimeout(() => {
            const invoiceElement = document.querySelector(".invoice");
            if (invoiceElement) {
                const newWindow = window.open("", "_blank");
                if (!newWindow) {
                    alert("Popup blocked. Please allow popups for this site.");
                    return;
                }

                newWindow.document.write(`
                    <html>
                        <head>
                            <title>Triova Invoice</title>
                            <style>
                                .invoice { padding: 20px; font-family: sans-serif; }
                            </style>
                        </head>
                        <body>
                            ${invoiceElement.innerHTML}
                        </body>
                    </html>
                `);
                newWindow.document.close();
                newWindow.focus();
                newWindow.print();
                window.location.reload();
            }
        }, 200);
    };

    return (
        <div>
            <div className="text-end space-x-4">
                <Link href="/promoter/dashboard/order/summery">
                    <button className="btn mb-5 btn-neutral text-white btn-sm">Summary</button>
                </Link>
                <Link href="/promoter/dashboard/order/create">
                    <button className="btn mb-5 btn-primary text-white btn-sm">Manual order</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="mb-5 flex items-center gap-3">
                <input value={formData.mobile} name="mobile" onChange={handleChange} type="text" placeholder="Search by mobile" className="input input-bordered w-1/3" />
                <button type="submit" className="btn btn-primary">
                    Search
                </button>
            </form>

            <div className="flex flex-wrap gap-4 mb-6">
                {["all", "Pending", "Processing", "Shipped", "Delivered", "Pending Return", "Returned"].map((status) => (
                    <label key={status} className="cursor-pointer">
                        <input type="radio" name="orderStatus" value={status} onChange={handleOrderStatus} checked={formData.orderStatus === status} className="hidden peer" />
                        <div className="peer-checked:bg-blue-500 peer-checked:text-white px-3 py-1 rounded-full border border-blue-500 transition-all">
                            {status} ({allOrders.filter((o) => (status === "all" ? true : o.orderStatus === status)).length})
                        </div>
                    </label>
                ))}
            </div>

            <div className="overflow-x-auto rounded-lg bg-white bg-opacity-70 backdrop-blur-md shadow-lg">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Order No.</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Amount</th>
                            <th>Promo</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th>Delivery</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.map((item, index) => (
                            <tr key={index} className={`transition-all ${item.orderStatus === "Pending" ? "bg-red-100" : item.orderStatus === "Delivered" ? "bg-green-100" : ""}`}>
                                <td>{item.orderNo}</td>
                                <td>{item.name}</td>
                                <td>{item.mobile}</td>
                                <td>{item.totalPrice}</td>
                                <td>{item.promoCode?.code || "N/A"}</td>
                                <td>{item.paymentMethod}</td>
                                <td>{new Date(item.orderDate).toLocaleDateString()}</td>
                                <td>{item.deliveryMethod?.name || "N/A"}</td>
                                <td>{item.orderStatus}</td>
                                <td className="flex flex-col gap-2 md:flex-row">
                                    <button onClick={() => handleOrderDetails(item)} className="btn btn-sm btn-info">
                                        Details
                                    </button>
                                    <button onClick={() => printInvoice(item)} className="btn btn-sm btn-warning">
                                        Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            <dialog id="order_details_modal" className="modal">
                <div className="modal-box w-11/12 max-w-7xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    {selectedOrder && (
                        <div className="modal-content px-2">
                            <h2 className="text-xl mb-3 font-bold">Order Details</h2>
                            <hr className="mb-3" />

                            {/* Order Info */}
                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-yellow-200 font-semibold rounded p-2">Order</div>
                                <div className="p-4 space-y-2">
                                    <div>
                                        <strong>ID:</strong> {selectedOrder._id}
                                    </div>
                                    <div>
                                        <strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}
                                    </div>
                                    <div>
                                        <strong>Status:</strong> {selectedOrder.orderStatus}
                                    </div>
                                    <div>
                                        <strong>Notes:</strong> <span className="text-red-500">{selectedOrder.orderNotes}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-indigo-200 font-semibold rounded p-2">Product Info</div>
                                <div className="p-4 overflow-x-auto">
                                    <table className="table table-bordered border">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th>No.</th>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Color</th>
                                                <th>Size</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.orderList.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <ClientImageWithLoader
                                                            src={imageSrc(item.color ? item.productId.colors.find((c) => c.color === item.color)?.image : item.productId.featuredImage.name)}
                                                            width={500}
                                                            height={100}
                                                            className="w-40 h-40 rounded object-cover"
                                                        />
                                                    </td>
                                                    <td>{item.productId.name}</td>
                                                    <td>{item.color}</td>
                                                    <td>{item.size}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.total}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={5}></td>
                                                <td className="font-bold">Promo</td>
                                                <td colSpan={2}>{selectedOrder.promoCode?.discount || 0}%</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5}></td>
                                                <td className="font-bold">Total</td>
                                                <td colSpan={2}>{selectedOrder.totalPrice} BDT</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-purple-200 font-semibold rounded p-2">Shipping Info</div>
                                <div className="p-4 space-y-2">
                                    <div>
                                        <strong>Name:</strong> {selectedOrder.name}
                                    </div>
                                    <div>
                                        <strong>Mobile:</strong> {selectedOrder.mobile}
                                    </div>
                                    <div>
                                        <strong>Billing:</strong> {selectedOrder.billingAddress}
                                    </div>
                                    <div>
                                        <strong>Shipping:</strong> {selectedOrder.shippingAddress}
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Delivery */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border rounded-lg shadow-lg">
                                    <div className="bg-red-200 font-semibold rounded p-2">Payment</div>
                                    <div className="p-4 space-y-2">
                                        <div>
                                            <strong>Method:</strong> {selectedOrder.paymentMethod}
                                        </div>
                                        <div>
                                            <strong>Amount:</strong> {selectedOrder.totalPrice}
                                        </div>
                                        <div>
                                            <strong>Txn ID:</strong> {selectedOrder.transactionId}
                                        </div>
                                    </div>
                                </div>
                                <div className="border rounded-lg shadow-lg">
                                    <div className="bg-lime-200 font-semibold rounded p-2">Delivery</div>
                                    <div className="p-4 space-y-2">
                                        <div>
                                            <strong>Method:</strong> {selectedOrder.deliveryMethod?.name || "Not selected"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </dialog>

            {/* Hidden Invoice Template for Print */}
            <div className="hidden invoice">{printOrder && <InvoiceTemplate order={printOrder} />}</div>

            {/* Modal */}
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
