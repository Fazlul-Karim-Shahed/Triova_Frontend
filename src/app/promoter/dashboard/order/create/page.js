"use client";

import { getAllCourierApi } from "@/src/api/SuperAdminApi/CourierApi";
import { createOrderApi } from "@/src/api/SuperAdminApi/OrderApi";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { getAllPromoApi } from "@/src/api/SuperAdminApi/PromoApi";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import Image from "next/image";
import Link from "next/link";
import numberToText from "number-to-text/converters/en-us";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function CreateOrderPage({ category }) {
    const store = useSelector((state) => state.triova);

    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const [total, setTotal] = useState(0);
    const [discountedAmount, setDiscountedAmount] = useState(0);
    const [mainPrice, setMainPrice] = useState(0);
    const [promos, setPromos] = useState([]);
    const [formData, setFormData] = useState({
        orderTaker: store.decodedToken,
        name: "",
        email: "",
        mobile: "",
        billingAddress: "",
        shippingAddress: "",
        orderList: [],
        totalPrice: 0,
        discount: 0,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Unpaid",
        transactionId: "",
        deliveryMethod: "",
        orderStatus: "Pending",
        orderDate: "",
        orderNotes: "",
        deliveryCharge: 0,
        promoCode: "",

        temp_color: "",
        temp_size: "",
    });

    const [products, setProducts] = useState({ data: [], error: null });

    useEffect(() => {
        setModalState({ message: "Collecting product data...", open: 1, loading: 1 });
        const fetchProducts = async () => {
            const response = await getAllProductApi();
            if (response.error === true) {
                setModalState({ error: response.error, message: response.message, open: 1, loading: 0 });
            } else {
                setModalState({ open: 0, loading: 0 });
            }
            setProducts(response);
        };

        fetchProducts();
        fetchPromos();
    }, []);

    const fetchPromos = async () => {
        setModalState({ message: "Fetching all promos", open: 1, loading: 1 });
        const data = await getAllPromoApi();
        if (!data.error) {
            console.log(data.data);
            setModalState({ error: data.error, message: data.message, open: 0, loading: 0 });
            setPromos(data.data.filter((promo) => promo.owner?._id === store.decodedToken._id));
        } else {
            setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else if (name === "promoCode") {
            setFormData({
                ...formData,
                discount: value != "" ? promos.find((promo) => promo._id === value).discount : 0,
                promoCode: value,

            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = useMemo(() => {
        return products.data.filter((item) => Object.values(item).some((val) => typeof val === "string" && val.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [products.data, searchQuery]);

    const addProduct = (product) => {
        const quantity = document.getElementById(product._id + "_temp_quantity").value;
        const color = formData.temp_color;
        const size = formData.temp_size;

        if (quantity == "") {
            setModalState({ error: true, message: "Quantity should not zero", open: true });
            return;
        }
        if (product.stock < quantity) {
            setModalState({ error: true, message: `Stock is not available. Available only ${product.stock}`, open: true });
            return;
        }
        if (product.colors.length > 0 && color == "") {
            setModalState({ error: true, message: "Please select a color", open: true });
            return;
        }
        if (product.sizes.length > 0 && size == "") {
            setModalState({ error: true, message: "Please select a size", open: true });
            return;
        }
        if (product.colors.length > 0 && color != "") {
            if (product.colors.filter((c) => c.color == color)[0].stock < quantity) {
                setModalState({ error: true, message: `Stock is not available for ${color}. Available only ${product.colors.filter((c) => c.color == color)[0].stock}`, open: true });
                return;
            }
        }
        if (product.sizes.length > 0 && size != "") {
            let x = product.sizes.filter((s) => (s.size == size && (s.referenceColor == "" || s.referenceColor == 0 || s.referenceColor == null) ? true : s.referenceColor === color));
            if (!x || x.length == 0) {
                setModalState({ error: true, message: `Stock is not available for ${size}`, open: true });
                return;
            }
            if (x && x.length != 0 && x[0].stock < quantity) {
                setModalState({ error: true, message: `Stock is not available for ${size}. Available only ${product.sizes.filter((s) => s.size == size)[0].stock}`, open: true });
                return;
            }
        }

        let orderList = formData.orderList;

        const order = {
            productId: product._id,
            quantity: quantity,
            color: color,
            size: size,
            price: product.sellingPrice - product.sellingPrice * (product.discount / 100),
            total: product.sellingPrice * quantity,
        };

        orderList.push(order);

        // stock update in products array for specific color and size
        setProducts({
            ...products,
            data: products.data.map((product) => {
                if (product._id == order.productId) {
                    if (product.colors.length > 0) {
                        product.colors = product.colors.map((c) => {
                            if (c.color == color) {
                                c.stock -= Number(quantity);
                            }
                            return c;
                        });
                    }

                    if (product.sizes.length > 0) {
                        product.sizes = product.sizes.map((s) => {
                            if (s.size == size && (s.referenceColor == "" || s.referenceColor == 0 || s.referenceColor == null) ? true : s.referenceColor === color) {
                                s.stock -= Number(quantity);
                            }
                            return s;
                        });
                    }

                    product.stock -= Number(quantity);
                }

                return product;
            }),
        });

        setFormData({ ...formData, orderList: orderList });
        setFormData({ ...formData, temp_color: "", temp_size: "" });
        setTotal(total + order.price * quantity);
        setMainPrice(mainPrice + product.sellingPrice * order.quantity);
        setDiscountedAmount(discountedAmount + product.sellingPrice * (product.discount / 100) * order.quantity);

        document.getElementById(product._id + "_temp_quantity").value = "";
        document.getElementById(product._id + "_temp_color").value = "";
        document.getElementById(product._id + "_temp_size").value = "";
    };

    const deleteOrder = (product, index) => {
        let orderList = formData.orderList;

        const order = orderList[index];
        orderList.splice(index, 1);

        setFormData({ ...formData, orderList: orderList });
        setTotal(total - order.price * order.quantity);
        setMainPrice(mainPrice - product.sellingPrice * order.quantity);
        setDiscountedAmount(discountedAmount - product.sellingPrice * (product.discount / 100) * order.quantity);

        // stock update in products array for specific color and size

        setProducts({
            ...products,
            data: products.data.map((p) => {
                if (p._id == order.productId) {
                    if (p.colors.length > 0) {
                        p.colors = p.colors.map((c) => {
                            if (c.color == order.color) {
                                c.stock += Number(order.quantity);
                            }
                            return c;
                        });
                    }

                    if (p.sizes.length > 0) {
                        p.sizes = p.sizes.map((s) => {
                            if (s.size == order.size && (s.referenceColor == "" || s.referenceColor == 0 || s.referenceColor == null) ? true : s.referenceColor === order.color) {
                                s.stock += Number(order.quantity);
                            }
                            return s;
                        });
                    }

                    p.stock += Number(order.quantity);
                }
                return p;
            }),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const regex = /^(?:\+?88)?01[3-9]\d{8}$/;

        if (formData.orderList.length == 0) {
            setModalState({ error: true, message: "Please add product to order", open: true, loading: 0 });
            return;
        }
        if (regex.test(formData.mobile) == false) {
            setModalState({ error: true, message: "Invalid mobile number", open: true, loading: 0 });
            return;
        }

        setModalState({ message: "Creating order. Please wait...", open: 1, loading: 1 });

        createOrderApi({
            ...formData,
            totalPrice: Math.round(total - total * (formData.discount / 100)),
            orderDate: new Date().toISOString(),
            mainPrice: Math.round(mainPrice),
            deliveryCharge: formData.deliveryCharge,
            discountedAmount: Math.round(discountedAmount + total * (formData.discount / 100)),
            orderTaker: store.decodedToken ? store.decodedToken.firstName + store.decodedToken.lastName : "",
            orderTakerRole: store.decodedToken ? store.decodedToken.role : "user",
            promoCode: formData.promoCode != "" ? formData.promoCode : null,
            reffer: formData.promoCode != "" ? promos.find((promo) => promo._id === formData.promoCode).owner._id : null,
            commission: formData.promoCode != "" ? promos.find((promo) => promo._id === formData.promoCode).commission : 0,
        }).then((data) => {
            setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        });
    };

    return (
        <div className="mx-auto bg-white rounded pt-6 pb-8 mb-4">
            <h1 className="text-2xl font-bold text-center mb-10">New Order</h1>
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Other input fields */}
                <div className="grid md:grid-cols-3 gap-5">
                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Mobile</label>
                        <input
                            type="number"
                            placeholder="0123456789"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                            required
                        />
                        <Link target="blank" href={{ pathname: "/super-admin/dashboard/order", query: { mobile: formData.mobile } }} className="text-xs text-primary">
                            Check Status
                        </Link>
                    </div>
                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Customer Name</label>
                        <input
                            type="text"
                            placeholder="Sheikh Sample"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="sample@gmail.com"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                        />
                    </div>
                </div>
                <div>
                    <label className="font-bold block text-gray-700 mb-1">Billing Address</label>
                    <textarea type="text" name="billingAddress" value={formData.billingAddress} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>
                <div>
                    <label className="font-bold block text-gray-700 mb-1">Shipping Address</label>
                    <textarea
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                        required
                    />
                </div>
                <div>
                    <label className="font-bold block text-gray-700 mb-1">Product</label>

                    <input type="text" value={searchQuery} onChange={handleSearch} placeholder="search item..." className="input my-5 input-bordered" />

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-[700px]">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-16 py-3">
                                        <span className="sr-only">Image</span>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Qty
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Color
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Size
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Selling Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Discount (%)
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Stock
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!products.error &&
                                    filteredData.map((product, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="p-4">
                                                <ClientImageWithLoader
                                                    src={imageSrc(product.featuredImage.name)}
                                                    width={100}
                                                    height={100}
                                                    className="w-16 md:w-32 rounded max-w-full max-h-full"
                                                    alt={product.featuredImage.name}
                                                    quality={100}
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-xs text-gray-900 dark:text-white">
                                                <Link className="hover:underline" href={`/super-admin/dashboard/product/${product._id}`}>
                                                    {" "}
                                                    {product.name}{" "}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button className="bg-gray-200 p-1 font-bold rounded-full">-</button>
                                                    <input
                                                        type="number"
                                                        id={`${product._id}_temp_quantity`}
                                                        className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg"
                                                        placeholder="1"
                                                    />
                                                    <button className="bg-gray-200 p-1 font-bold rounded-full">+</button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                <select onChange={handleChange} name="temp_color" id={`${product._id}_temp_color`} className="bg-white">
                                                    <option value="">Select Color</option>
                                                    {product.colors.map((color, idx) => (
                                                        <option key={idx} value={color.color}>
                                                            {color.color}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                <select id={`${product._id}_temp_size`} onChange={handleChange} name="temp_size" className="bg-white">
                                                    <option value="">Select Size</option>
                                                    {product.sizes.map((size, idx) => (
                                                        <option key={idx} value={size.size}>
                                                            {size.size}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.sellingPrice}</td>

                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.discount}</td>

                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.sellingPrice - product.sellingPrice * (product.discount / 100)}</td>

                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-center">
                                                <div>{product.stock} </div>
                                                <div className="cursor-pointer text-primary text-xs hover:underline ">Details</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <button type="button" onClick={() => addProduct(product)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                    ADD
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <label className="font-bold block text-gray-700 mb-2 mt-10 fort-bold ">Order List</label>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                        <table className="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-red-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Qty
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Color
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Size
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.orderList.length === 0 ? (
                                    <div className="text-center p-10">No order found</div>
                                ) : (
                                    formData.orderList.map((order, index) => {
                                        let product = products.data.filter((p) => p._id == order.productId)[0];

                                        return (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.name}</td>
                                                <td className="px-6 py-4">{order.quantity}</td>
                                                <td className="px-6 py-4">{order.color}</td>
                                                <td className="px-6 py-4">{order.size}</td>
                                                <td className="px-6 py-4">
                                                    {" "}
                                                    {order.quantity} x {Number(order.price)}
                                                </td>
                                                <td className="px-6 py-4">{Number(order.price) * Number(order.quantity)}</td>
                                                <td className="px-6 py-4">
                                                    <button type="button" onClick={() => deleteOrder(product, index)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-5 pt-6 space-y-2">
                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Discount</label>
                        {/* <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required /> */}
                        <select name="promoCode" value={formData.promoCode} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200">
                            <option value="">Select Promo</option>
                            {promos.map((promo) => (
                                <option value={promo._id}>{promo.code}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Payment Method</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                            <option value="">Select Payment Method</option>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                            <option value="Bkash">Bkash</option>
                            <option value="Nagad">Nagad</option>
                            <option value="Card">Card</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Transaction ID</label>
                        <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                    </div>

                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Payment Status</label>
                        <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                            <option value="">Select Payment Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Delivery Charge</label>
                        <input
                            type="number"
                            name="deliveryCharge"
                            value={formData.deliveryCharge}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                            required
                        />
                        <span className="text-xs italic">Inside Dhaka 60 & Outside Dhaka 120</span>
                    </div>

                    <div>
                        <label className="font-bold block text-gray-700 mb-1">Order Status</label>
                        <select name="orderStatus" value={formData.orderStatus} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" required>
                            <option value="">Select Order Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Pending Return">Pending Return</option>
                            <option value="Returned">Returned</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="font-bold block text-gray-700 mb-1">Order Notes</label>
                    <textarea type="text" name="orderNotes" value={formData.orderNotes} onChange={handleChange} className="w-full p-2 border rounded focus:ring focus:ring-green-200" />
                </div>
                <br /> <br /> <br />
                <div className="w-full max-w-5xl mx-auto bg-white/30 backdrop-blur-md border border-indigo-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-4 px-6 text-xl font-bold tracking-wide">💎 Price Breakdown Summary</div>

                    <table className="w-full text-left text-gray-800">
                        <tbody className="divide-y divide-indigo-200">
                            <tr className="hover:bg-white/50 transition">
                                <td className="py-3 px-6 font-medium">Main Price</td>
                                <td className="py-3 px-6 text-right">{mainPrice} Tk</td>
                            </tr>
                            <tr className="hover:bg-white/50 transition">
                                <td className="py-3 px-6 font-medium">Product Discount</td>
                                <td className="py-3 px-6 text-right">{discountedAmount} Tk</td>
                            </tr>
                            <tr className="hover:bg-white/50 transition">
                                <td className="py-3 px-6 font-medium">Adjusted Price</td>
                                <td className="py-3 px-6 text-right">{mainPrice - discountedAmount} Tk</td>
                            </tr>
                            <tr className="hover:bg-white/50 transition">
                                <td className="py-3 px-6 font-medium">Additional Discount</td>
                                <td className="py-3 px-6 text-right">{formData.discount} %</td>
                            </tr>
                            <tr className="hover:bg-white/50 transition">
                                <td className="py-3 px-6 font-medium">Adjusted After Extra Discount</td>
                                <td className="py-3 px-6 text-right">{total - total * (formData.discount / 100)} Tk</td>
                            </tr>
                            <tr className="hover:bg-white/50 transition">
                                <td className="py-3 px-6 font-medium">Delivery Charge</td>
                                <td className="py-3 px-6 text-right">{formData.deliveryCharge} Tk</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="bg-indigo-100/60 text-indigo-800 font-bold">
                                <td className="py-4 px-6 text-lg">Grand Total</td>
                                <td className="py-4 px-6 text-right text-lg">{total - total * (formData.discount / 100) + Number(formData.deliveryCharge)} Tk</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="px-6 py-4 text-center italic text-sm text-gray-600 bg-white/30 backdrop-blur">
                        ({numberToText.convertToText(Math.round(total - total * (formData.discount / 100) + Number(formData.deliveryCharge)))} Taka Only)
                    </div>
                </div>
                <br /> <br />
                <div className="text-center">
                    <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-700">
                        Place order
                    </button>
                </div>
            </form>

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
