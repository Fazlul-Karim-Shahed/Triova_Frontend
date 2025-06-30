"use client";

import { getAllOrdersApi } from "@/src/api/SuperAdminApi/OrderApi";
import { getAProfileApi } from "@/src/api/SuperAdminApi/ProfileApi";
import AuthContext from "@/src/context/AuthContext";
import { imageSrc } from "@/src/functions/CustomFunction";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InvoiceTemplate from "../invoice/page";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import Spinner from "@/src/components/Common/Spinner/Spinner";

const YourOrders = () => {
    const store = useSelector((state) => state.triova);
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getAProfileApi(store.decodedToken._id, store.decodedToken.role).then((data) => {
            setLoading(false);
            console.log(data);
            if (!data.error) {
                getAllOrdersApi({ mobile: data.data.mobile }).then((data) => {
                    console.log(data);
                    if (!data.error) {
                        setOrders(data.data);
                        
                    }
                });
            }
        });
    }, []);

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

    if (loading) {
        return <Spinner message="Loading your orders..." />;
    }
    else return (
        <AuthContext>
            <div className="min-h-screen py-6">
                <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="md:text-xl font-bold">Your Orders</h1>
                        {/* <select className="border border-gray-300 rounded-md px-4 py-2 text-sm">
                            <option>Past 12 Weeks</option>
                            <option>Past 6 Months</option>
                            <option>Past Year</option>
                        </select> */}
                    </div>

                    {/* Orders */}
                    <div className="space-y-6">
                        {/* Order Card */}

                        {orders.length != 0 ? (
                            orders.map((order) => {
                                return (
                                    <div className="border-2 rounded-lg shadow-md p-5">
                                        {/* Order Header */}
                                        <div className="grid grid-cols-2 md:grid-cols-5 mb-4 text-sm gap-5">
                                            <div>
                                                <div className="font-semibold text-gray-400 md:mb-2">Order Number:</div> #{order.orderNo}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-400 md:mb-2">Order Date:</div> {new Date(order.createdAt).toDateString()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-400 md:mb-2">Total Amount:</div> Tk {order.totalPrice + order.deliveryCharge}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-400 md:mb-2">Status:</div>{" "}
                                                <span className={order.orderStatus === "Delivered" ? "text-white bg-green-600 p-1 rounded" : "text-black bg-yellow-300 p-1 rounded"}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                            <div className="flex md:justify-end">
                                                <button onClick={() => printInvoice(order)} className="border hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500 px-2 rounded text-sm">
                                                    View Invoice
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="my-10" />

                                        {/* Estimated Delivery */}
                                        {order.orderStatus != "Delivered" && (
                                            <p className="text-sm text-blue-500 mb-7 flex items-center space-x-2">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </span>
                                                <span>
                                                    Estimated Delivery: {new Date(new Date(order.createdAt).getTime() + 1 * 24 * 60 * 60 * 1000).toDateString()} -{" "}
                                                    {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toDateString()}
                                                </span>
                                            </p>
                                        )}

                                        {/* Product Details */}

                                        <div className="space-y-4">
                                            {order.orderList.map((product, index) => {
                                                //console.log(product && product.productId && product.productId.featuredImage.name);
                                                return (
                                                    product &&
                                                    product.productId &&
                                                    product.productId.featuredImage.name && (
                                                        <div>
                                                            <div className="grid md:grid-cols-12 gap-5">
                                                                <div className="col-span-2">
                                                                    <ClientImageWithLoader
                                                                        width={1000}
                                                                        height={1000}
                                                                        src={imageSrc(product.color && product.color != "" ? product.productId.colors.find((c) => c.color == product.color).image : product.productId.featuredImage.name)}
                                                                        alt="Travelling Bag"
                                                                        className="object-cover border rounded-2xl"
                                                                    />
                                                                </div>
                                                                <div className="col-span-10">
                                                                    <div className="flex justify-between">
                                                                        <div>
                                                                            <h2 className="text-base font-semibold">{product.productId.name}</h2>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-base font-bold text-gray-800">Tk {product.total}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="text-gray-400 text-sm my-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, inventore!...</div>

                                                                    <div className="flex flex-col md:flex-row md:justify-between ">
                                                                        <div className="text-sm text-gray-600 mt-2">
                                                                            <span>Size:</span> {product.size} | <span>Color:</span> {product.color} | <span>Quantity:</span> {product.quantity}
                                                                        </div>
                                                                        <div className="flex space-x-4 mt-2">
                                                                            <button className="text-blue-700 text-sm font-medium">View Product</button>
                                                                            <button className="text-blue-700 text-sm font-medium">Buy Again</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {index != order.orderList.length - 1 && <hr className="my-8" />}
                                                        </div>
                                                    )
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-400 p-20">No orders found</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="invoice">{order && <InvoiceTemplate order={order} />}</div>
        </AuthContext>
    );
};

export default YourOrders;
