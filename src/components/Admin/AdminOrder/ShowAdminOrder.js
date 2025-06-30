"use client";

import { deleteOrderApi, updateOrderStatusApi } from "@/src/api/SuperAdminApi/OrderApi";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Modal } from "../../Common/Modal/Modal";
import InvoiceTemplate from "@/src/app/mytriova/invoice/page";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";
import { imageSrc } from "@/src/functions/CustomFunction";

export default function ShowAdminOrder({ orders, courier }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShowAdminOrderContent orders={orders} courier={courier} />
        </Suspense>
    );
}

function ShowAdminOrderContent({ orders, courier }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const mobile = searchParams.get("mobile");
    const [order, setOrder] = useState(null);
    const { replace } = useRouter();

    const [formData, setFormData] = useState({
        mobile: mobile,
        orderStatus: "all",
    });

    const [statusFormData, setStatusFormData] = useState({
        orderStatus: selectedOrder ? selectedOrder.orderStatus : "",
        deliveryMethod: selectedOrder ? selectedOrder.deliveryMethod : "",
    });

    const [orderList, setOrderList] = useState(orders.filter((o) => (mobile ? Number(o.mobile) == Number(mobile) : true)));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOrderList(orders.filter((o) => (formData.mobile ? Number(o.mobile) == Number(formData.mobile) : true)));
        const params = new URLSearchParams(searchParams);
        if (formData.mobile) {
            params.set("mobile", formData.mobile);
        } else {
            params.delete("mobile");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleOrderStatus = (e) => {
        setFormData({ ...formData, orderStatus: e.target.value });
        setOrderList(orders.filter((o) => (formData.mobile ? Number(o.mobile) == Number(formData.mobile) : true)).filter((o) => (e.target.value == "all" ? true : o.orderStatus == e.target.value)));
    };

    const handleOrderDetails = (order) => {
        //console.log(order);
        setSelectedOrder(order);
        setStatusFormData({ orderStatus: order.orderStatus, deliveryMethod: order.deliveryMethod ? order.deliveryMethod._id : "" });
        document.getElementById("order_details_modal").showModal();
    };

    const printInvoice = (order) => {
        setOrder(order);

        const newWindow = window.open("", "_blank");
        if (!newWindow) {
            alert("Popup blocked. Please allow popups for this site.");
            return;
        }

        // Wait for React to render the invoice in the DOM
        setTimeout(() => {
            const invoiceElement = document.querySelector(".invoice");
            if (invoiceElement) {
                newWindow.document.write(`
                    <html>
                        <head>
                            <title>Triova Invoice</title>
                            <style>
                                .invoice { padding: 20px; }
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
                // newWindow.close();
                window.location.reload(); // Reload the current page after printing
            }
        }, 100);
    };

    const updateOrderStatus = (e, id) => {
        e.preventDefault();

        if (statusFormData.deliveryMethod) {
            setModalState({ message: "Updating...", open: 1, loading: 1 });
            updateOrderStatusApi(id, statusFormData).then((res) => {
                setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
                if (!res.error) {
                    setOrderList(orders.filter((o) => o._id != id));
                    document.getElementById("order_details_modal").close();
                }
            });
        } else {
            setModalState({ error: true, message: "Please select a delivery method", open: 1, loading: 0 });
        }
    };

    const deleteOrder = (id) => {
        setModalState({ message: "Deleting order...", open: 1, loading: 1 });
        deleteOrderApi(id).then((res) => {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            if (!res.error) {
                setOrderList(orderList.filter((o) => o._id != id));
            }
        });
        return false; // Prevent default link behavior
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="mb-5 flex items-center gap-3">
                <input value={formData.mobile} name="mobile" onChange={handleChange} type="text" placeholder="Search by mobile" className="input input-bordered w-1/3" />
                <button type="submit" className="btn btn-primary">
                    Search
                </button>
            </form>
            <div className="flex flex-wrap gap-4 mb-6">
                {["all", "Pending", "Processing", "Shipped", "Delivered", "Pending Return", "Returned"].map((status) => (
                    <label key={status} className="cursor-pointer">
                        <input type="radio" name="orderStatus" value={status} onChange={handleOrderStatus} defaultChecked={status === "all"} className="hidden peer" />
                        <div className="peer-checked:bg-blue-500 peer-checked:text-white px-3 py-1 rounded-full border border-blue-500 transition-all">
                            {status} ({orders.filter((o) => (status === "all" ? true : o.orderStatus === status)).length})
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
                                <td>{item.promoCode?.code || "--"}</td>
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
                                    <Link onClick={() => deleteOrder(item._id)} href="" className="btn btn-sm btn-error text-white">
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}

            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />
            <dialog id="order_details_modal" className="modal">
                <div className="modal-box w-11/12 max-w-7xl">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    {selectedOrder && (
                        <div className="modal-content px-2">
                            <h2 className="text-xl mb-3 font-bold">Order Details</h2>
                            <hr className="mb-3" />

                            <div className="border rounded-lg shadow-lg mb-7">
                                <div>
                                    <div className="bg-red-200 font-semibold rounded p-2">Update Status</div>
                                    <div className="p-4 space-y-2">
                                        <form onSubmit={(e) => updateOrderStatus(e, selectedOrder._id)} action="">
                                            <div className="flex items-center">
                                                <label className="me-2">Status</label>
                                                <select
                                                    name="orderStatus"
                                                    onChange={(e) => setStatusFormData({ ...statusFormData, orderStatus: e.target.value })}
                                                    value={statusFormData.orderStatus}
                                                    className="border px-2 py-1 rounded-lg"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Pending Return">Pending Return</option>
                                                    <option value="Returned">Returned</option>
                                                </select>
                                            </div>

                                            <div className="mt-4">
                                                <label className="me-2">Assign Courier</label>
                                                <select
                                                    className="border px-2 py-1 rounded-lg"
                                                    name="deliveryMethod"
                                                    onChange={(e) => setStatusFormData({ ...statusFormData, deliveryMethod: e.target.value })}
                                                    value={statusFormData.deliveryMethod}
                                                    id=""
                                                >
                                                    <option value="">Select</option>
                                                    {courier && courier.length > 0 && courier.map((item) => <option value={item._id}>{item.name}</option>)}
                                                </select>
                                            </div>

                                            <button disabled={selectedOrder.orderStatus == "Returned"} type="submit" className="mt-3 btn btn-sm btn-primary">
                                                Update
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-yellow-200 font-semibold rounded p-2">Order</div>
                                <div className="p-4 space-y-2">
                                    <div>
                                        <strong className="me-2">ID: </strong> {selectedOrder._id}
                                    </div>
                                    <div>
                                        <strong className="me-2">Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}
                                    </div>
                                    <div>
                                        <strong className="me-2">Status:</strong> {selectedOrder.orderStatus}
                                    </div>
                                    <div>
                                        <strong className="me-2 ">Notes:</strong> <span className="text-red-500">{selectedOrder.orderNotes}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-indigo-200 font-semibold rounded p-2">Product Info</div>
                                <div className="p-4 space-y-2">
                                    <div className="overflow-x-auto rounded-lg">
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
                                                {/* {selectedOrder.orderList.map()} */}
                                                {selectedOrder.orderList.map((item, index) => {
                                                    return (
                                                        <tr key={index} className={`hover:bg-green-50`}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <ClientImageWithLoader
                                                                    src={imageSrc(
                                                                        item.color && item.color != ""
                                                                            ? item.productId.colors.find((color) => color.color === item.color).image
                                                                            : item.productId.featuredImage.name
                                                                    )}
                                                                    width={500}
                                                                    height={100}
                                                                    className="w-40 h-40 rounded object-cover"
                                                                />
                                                            </td>
                                                            <td className="max-w-sm">{item.productId.name}</td>
                                                            <td>{item.color}</td>
                                                            <td>{item.size}</td>
                                                            <td>{item.price}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.total}</td>
                                                        </tr>
                                                    );
                                                })}

                                                <tr className={`hover:bg-green-50`}>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className="font-bold" colSpan={3}>Promo Code</td>
                                                    <td colSpan={3}>{selectedOrder.promoCode?.discount || "0"}% ({selectedOrder.promoCode?.code})</td>
                                                </tr>

                                                <tr className={`hover:bg-green-50`}>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className="font-bold" colSpan={3}>Total Price</td>
                                                    <td colSpan={3}>{selectedOrder.totalPrice} BDT</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-purple-200 font-semibold rounded p-2">Shipping Info</div>
                                <div className="p-4 space-y-2">
                                    <div>
                                        <strong className="me-2">Name: </strong> {selectedOrder.name}
                                    </div>
                                    <div>
                                        <strong className="me-2">Mobile:</strong> {selectedOrder.mobile}
                                    </div>
                                    <div>
                                        <strong className="me-2">Billing Address:</strong> {selectedOrder.billingAddress}
                                    </div>
                                    <div>
                                        <strong className="me-2">Shipping Address:</strong> {selectedOrder.shippingAddress}
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-red-200 font-semibold rounded p-2">Payment</div>
                                <div className="p-4 space-y-2">
                                    <div>
                                        <strong className="me-2">Method: </strong> {selectedOrder.paymentMethod}
                                    </div>
                                    <div>
                                        <strong className="me-2">Amount:</strong> {selectedOrder.totalPrice}
                                    </div>
                                    <div>
                                        <strong className="me-2">Transaction ID:</strong> {selectedOrder.transactionId}
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg shadow-lg mb-7">
                                <div className="bg-lime-200 font-semibold rounded p-2">Delivery</div>
                                <div className="p-4 space-y-2">
                                    <div>
                                        <strong className="me-2">Method: </strong> {selectedOrder.deliveryMethod ? selectedOrder.deliveryMethod.name : "Not selected"}
                                    </div>
                                    {/* <div><strong className='me-2'>Date:</strong> {selectedOrder.deliveryDate}</div> */}
                                    {/* <div><strong className='me-2'>Tracking ID:</strong> {selectedOrder.trackingId}</div> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </dialog>
            <div className="invoice">{order && <InvoiceTemplate order={order} />}</div>
        </div>
    );
}
