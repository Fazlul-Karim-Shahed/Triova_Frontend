"use client";

import cartImage from "@/public/empty-cart.png";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import EmptyCart from "@/src/components/Client/Cart/EmptyCart";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import Spinner from "@/src/components/Common/Spinner/Spinner";
import { imageSrc } from "@/src/functions/CustomFunction";
import { addCart, removeCart } from "@/src/functions/cartFunctions";
import { getReduxCart } from "@/src/redux/store";
import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function CartPage() {
    const dispatch = useDispatch();
    const [cart, setCart] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [total, setTotal] = useState(0);
    const [savings, setSavings] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        setUpdating(true);

        let arr = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME) ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)) : [];

        getAllProductApi(null, { _id: arr.map((item) => item.productId) }).then((data) => {
            console.log(data);
            setUpdating(false);
            if (!data.error) {
                let newCart = arr.map((item) => {
                    let product = data.data.find((p) => p._id === item.productId);
                    return {
                        ...item,
                        product: product,
                    };
                });
                setCart(newCart);
                setPrice(newCart[0].product && newCart.reduce((acc, item) => acc + item.quantity * item.product.sellingPrice, 0));
                setSavings(newCart[0].product && newCart.reduce((acc, item) => acc + (item.quantity * item.product.sellingPrice * item.product.discount) / 100, 0));
                setTotal(newCart[0].product && newCart.reduce((acc, item) => acc + item.quantity * (item.product.sellingPrice - (item.product.sellingPrice * item.product.discount) / 100), 0));
            } else {
                // console.log(data.message === "No products found");
                data.message === "No products found" && localStorage.removeItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME);
            }
        });
    }, []);

    const removeCartItem = (item) => {
        removeCart(item.productId, item.color, item.size);
        let newCart = cart.filter((i) => i.productId != item.productId || i.color != item.color || i.size != item.size);
        setCart(newCart);

        dispatch(
            getReduxCart({
                cart: localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME) ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)).length : 0,
            })
        );

        setPrice(newCart.length > 0 && newCart[0].product && newCart.reduce((acc, item) => acc + item.quantity * item.product.sellingPrice, 0));
        setSavings(newCart.length > 0 && newCart[0].product && newCart.reduce((acc, item) => acc + (item.quantity * item.product.sellingPrice * item.product.discount) / 100, 0));
        setTotal(
            newCart.length > 0 && newCart[0].product && newCart.reduce((acc, item) => acc + item.quantity * (item.product.sellingPrice - (item.product.sellingPrice * item.product.discount) / 100), 0)
        );
    };

    const updateCartItem = (item, n) => {
        addCart(item.productId, item.color ? item.color : "", item.size, n);
        let newCart = cart.map((i) => {
            if (i.productId == item.productId && i.color == item.color && i.size == item.size) {
                i.quantity = n;
            }
            return i;
        });

        setCart(newCart);

        setPrice(newCart[0].product && newCart.reduce((acc, item) => acc + item.quantity * item.product.sellingPrice, 0));
        setSavings(newCart[0].product && newCart.reduce((acc, item) => acc + (item.quantity * item.product.sellingPrice * item.product.discount) / 100, 0));
        setTotal(newCart[0].product && newCart.reduce((acc, item) => acc + item.quantity * (item.product.sellingPrice - (item.product.sellingPrice * item.product.discount) / 100), 0));
    };

    const handleQuantityChange = (item, n) => {
        if (item.color && item.color != "" && item.size && item.size != "") {
            let stock = item.product.sizes.find((s) => s.size == item.size && s.referenceColor == item.color).stock;
            let q = Math.max(1, Math.min(stock, item.quantity + n));
            updateCartItem(item, q);
        } else if (item.color && item.color != "" && (item.size == "" || !item.size)) {
            let stock = item.product.colors.find((c) => c.color == item.color).stock;
            let q = Math.max(1, Math.min(stock, item.quantity + n));
            updateCartItem(item, q);
        } else if ((!item.color || item.color == "") && item.size && item.size != "") {
            let stock = item.product.sizes.find((s) => s.size == item.size).stock;
            let q = Math.max(1, Math.min(stock, item.quantity + n));
            updateCartItem(item, q);
        }
    };

    return (
        <div>
            <section className="bg-gradient-to-br from-white  py-5 antialiased dark:bg-gray-900 md:py-12">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    {cart && cart.length > 0 && (
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            {" "}
                            <FontAwesomeIcon icon={faCartShopping} className="me-2 text-brand-500" /> Yout Cart
                        </h2>
                    )}

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl">
                            <div className="space-y-6">
                                {updating ? (
                                    <div className="flex items-center justify-center h-52">
                                        <Spinner message={"Loading Products data..."} />
                                    </div>
                                ) : cart.length > 0 ? (
                                    cart.map((item, index) => {
                                        if (item.product) {
                                            return (
                                                <div className="rounded-lg border border-brand-200 bg-white  p-4 shadow-md hover:bg-gray-50 dark:border-brand-700 dark:bg-gray-800 md:p-6">
                                                    <div className="space-y-4 md:flex md:justify-between md:gap-6 md:space-y-0">
                                                        <a href="#" className="shrink-0 md:order-1">
                                                            {console.log(item)}

                                                            <ClientImageWithLoader
                                                                height={500}
                                                                width={500}
                                                                className="h-20 w-28 dark:hidden rounded-md object-cover"
                                                                src={imageSrc(
                                                                    item.color && item.color != "" ? item.product.colors.find((i) => i.color == item.color).image : item.product.featuredImage.name
                                                                )}
                                                                alt="image"
                                                            />
                                                        </a>

                                                        <label for="counter-input" className="sr-only">
                                                            Choose quantity:
                                                        </label>
                                                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                                                            <div className="flex items-center">
                                                                <button
                                                                    onClick={() => handleQuantityChange(item, -1)}
                                                                    type="button"
                                                                    id="decrement-button"
                                                                    data-input-counter-decrement="counter-input"
                                                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-brand-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-brand-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                                                >
                                                                    <svg
                                                                        className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 18 2"
                                                                    >
                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                                                                    </svg>
                                                                </button>

                                                                <input
                                                                    type="text"
                                                                    id="counter-input"
                                                                    data-input-counter
                                                                    className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                                                    placeholder=""
                                                                    value={item.quantity}
                                                                    required
                                                                />

                                                                <button
                                                                    onClick={() => handleQuantityChange(item, 1)}
                                                                    type="button"
                                                                    id="increment-button"
                                                                    data-input-counter-increment="counter-input"
                                                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-brand-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-brand-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                                                >
                                                                    <svg
                                                                        className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 18 18"
                                                                    >
                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="text-end md:order-4 md:w-32">
                                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                                    {item.quantity * (item.product.sellingPrice - (item.product.sellingPrice * item.product.discount) / 100)} ৳
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                                                            <a href="#" className="text-sm font-bold text-gray-900 hover:underline dark:text-white">
                                                                {item.product.name}
                                                            </a>

                                                            <div className="text-sm ">
                                                                <div className="flex space-x-3 text-xs">
                                                                    {item.color && item.color != "" && (
                                                                        <div className="flex">
                                                                            {item.color} (
                                                                            <svg className="-mt-0.5" width="20" height="20">
                                                                                <circle cx="10" cy="10" r="10" fill={item.product.colors.find((i) => i.color == item.color).colorCode} />
                                                                            </svg>
                                                                            ){" "}
                                                                        </div>
                                                                    )}

                                                                    {item.size && item.size != "" && <div className="flex">{item.size} </div>}
                                                                </div>

                                                                <div className="mt-5">
                                                                    <button
                                                                        onClick={() => removeCartItem(item)}
                                                                        type="button"
                                                                        className="text-sm font-medium text-red-600 dark:text-red-500 border border-error px-1 rounded-md hover:bg-red-500 hover:text-white"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} className="me-2" />
                                                                        <span className="text-sm">Remove</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })
                                ) : (
                                    <div className="h-80">
                                        {" "}
                                        <EmptyCart />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                            <div
                                className="space-y-4 rounded-lg border border-brand-200 
                               bg-white






 p-4 shadow-md backdrop-blur-md dark:border-brand-700 dark:bg-gray-800 sm:p-6"
                            >
                                <p className=" font-semibold text-gray-900 dark:text-white">Order summary</p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-sm font-normal text-gray-900 dark:text-gray-400">Original price</dt>
                                            <dd className="text-sm font-medium text-gray-900 dark:text-white"> {cart.length != 0 && price} ৳</dd>
                                        </dl>

                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-sm font-normal text-gray-900 dark:text-gray-400">Savings</dt>
                                            <dd className="text-sm font-medium text-brand-400">- {cart.length != 0 && savings} ৳</dd>
                                        </dl>

                                        {/* <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-900 dark:text-gray-400">Store Pickup</dt>
                                            <dd className="text-base font-medium text-gray-900 dark:text-white"> 99</dd>
                                        </dl> */}

                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-sm font-normal text-gray-900 dark:text-gray-400">Tax</dt>
                                            <dd className="text-sm font-medium text-gray-900 dark:text-white"> 0 ৳</dd>
                                        </dl>
                                    </div>

                                    <dl className="flex items-center justify-between gap-4 border-t border-brand-200 pt-2 dark:border-brand-700">
                                        <dt className="text-sm font-bold text-gray-900 dark:text-white">Total</dt>
                                        <dd className="text-sm font-bold text-gray-900 dark:text-white"> {cart.length != 0 && total} ৳</dd>
                                    </dl>
                                </div>

                                <Link
                                    href={total > 0 ? "/checkout" : ""}
                                    className="flex w-full items-center justify-center rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-blue-900 dark:focus:ring-primary-800"
                                >
                                    Proceed to Checkout
                                </Link>

                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
                                    <a href="/products" title="" className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 underline hover:no-underline dark:text-brand-500">
                                        Continue Shopping
                                        <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* <div className="space-y-4 rounded-lg border border-brand-200 bg-white p-4 shadow dark:border-brand-700 dark:bg-gray-800 sm:p-6">
                                <form className="space-y-4">
                                    <div>
                                        <label for="voucher" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            Do you have a voucher or gift card?{" "}
                                        </label>
                                        <input
                                            disabled
                                            type="text"
                                            id="voucher"
                                            className="block w-full rounded-lg border border-brand-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-brand-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                    <button
                                        disabled
                                        type="submit"
                                        className="flex w-full items-center justify-center rounded-lg bg-yellow-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        Apply Code
                                    </button>
                                </form>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
