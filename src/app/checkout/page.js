"use client";

import { createOrderApi } from "@/src/api/SuperAdminApi/OrderApi";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { saveOrder } from "@/src/functions/orderFunctions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAPromoApi } from "@/src/api/SuperAdminApi/PromoApi";
export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false });
    const [promo, setPromo] = useState({ error: false, message: "", data: null, applied: false });
    const router = useRouter();
    const store = useSelector((state) => state.triova);

    const [loading, setLoading] = useState(false);
    // const [savings, setSavings] = useState(0)

    const [state, setState] = useState({
        name: store && store.decodedToken ? store.decodedToken.firstName + " " + store.decodedToken.lastName : "",
        email: "",
        city: "",
        mobile: store && store.decodedToken ? store.decodedToken.mobile : "",
        house: "",
        postalCode: "",
        division: "",
        paymentMethod: "",
        shippingAddress: "",
        orderList: [],
        mainPrice: 0,
        discountedAmount: 0,
        totalPrice: 0,
        paymentMethod: "",
        paymentStatus: "Unpaid",
        transactionId: "",
        orderStatus: "Pending",
        orderDate: "",
        orderNotes: "",
        deliveryCharge: 0,
        promo: "",
    });

    useEffect(() => {
        let arr = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME) ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)) : [];

        getAllProductApi(null, { _id: arr.map((item) => item.productId) }).then((data) => {
            if (!data.error) {
                let newCart = arr.map((item) => {
                    let product = data.data.find((p) => p._id === item.productId);
                    return {
                        ...item,
                        product: product,
                    };
                });
                setCart(newCart);

                setState({
                    ...state,
                    mainPrice: newCart.reduce((acc, item) => acc + item.quantity * item.product.sellingPrice, 0),
                    discountedAmount: newCart[0].product && newCart.reduce((acc, item) => acc + (item.quantity * item.product.sellingPrice * item.product.discount) / 100, 0),
                    deliveryCharge: state.division === "dhaka" ? 60 : 120,
                });
            }
        });
    }, []);

    const handleChange = (e) => {
        // //console.log(state);
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // setLoading(true);

        const regex = /^(?:\+?88)?01[3-9]\d{8}$/;

        if (state.mainPrice === 0) {
            setModalState({ error: true, message: "Total price should not be zero", open: true });
            setLoading(false);
            return;
        }

        if (regex.test(state.mobile) == false) {
            setModalState({ error: true, message: "Invalid mobile number", open: true });
            setLoading(false);
            return;
        }



        // createOrderApi({
        //     ...state,
        //     orderList: cart.map((item) => ({
        //         productId: item.productId,
        //         quantity: item.quantity,
        //         color: item.color ? item.color : "",
        //         size: item.size,
        //         price: item.product.sellingPrice - (item.product.sellingPrice * item.product.discount) / 100,
        //         total: (item.product.sellingPrice - (item.product.sellingPrice * item.product.discount) / 100) * item.quantity,
        //     })),

        //     promoCode: !promo.error && promo.data ? promo.data._id : null,
        //     reffer: !promo.error && promo.data ? promo.data.owner?._id : null,
        //     commission: !promo.error && promo.data ? promo.data.owner?.commissionRate : 0,

        //     totalPrice: state.mainPrice - state.discountedAmount,
        //     deliveryCharge: state.division === "dhaka" ? 60 : 120,

        //     shippingAddress: state.house + " | " + state.city + " | " + state.division + ", " + state.postalCode,
        //     orderDate: new Date().toISOString(),
        // }).then((data) => {
        //     //console.log(data);
        //     setLoading(false);
        //     setModalState({ error: data.error, message: data.message, open: true });
        //     if (!data.error) {
        //         localStorage.removeItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME);
        //         setCart([]);
        //         saveOrder(data.data._id);
        //         if (store.authenticated) {
        //             router.push("/mytriova/history");
        //         }
        //     }
        // });
    };

    const applyPromo = () => {
        if (promo.applied) {
            return setPromo({
                ...promo,
                error: true,
                message: "Promo already applied",
            });
        }

        if (!state.promo.trim()) {
            return setPromo({ error: true, message: "Enter a promo code", data: null, applied: false });
        }

        getAPromoApi(state.promo.trim()).then((data) => {
            if (data.error) {
                return setPromo({ error: true, message: data.message, data: null, applied: false });
            }

            const promoData = data.data;
            const now = new Date();
            const start = new Date(promoData.startDate);
            const end = new Date(promoData.endDate);

            // 1. Check date validity
            if (now < start || now > end) {
                return setPromo({ error: true, message: "Promo is not active now", data: null, applied: false });
            }

            // 2. Check minimum order
            const alreadyDiscountedPrice = state.mainPrice - state.discountedAmount;
            if (alreadyDiscountedPrice < promoData.minOrder) {
                return setPromo({
                    error: true,
                    message: `Minimum order value must be ৳${promoData.minOrder}`,
                    data: null,
                    applied: false,
                });
            }

            // 3. Check that ALL cart products are in promoData.products
            const promoProductIds = promoData.products.map((p) => p.toString());
            const allCartProductsValid = cart.every((item) => promoProductIds.includes(item.productId));

            if (!allCartProductsValid) {
                return setPromo({
                    error: true,
                    message: `Some items aren't eligible for this promo.`,
                    data: null,
                    applied: false,
                });
            }

            // ✅ Passed all checks — apply discount
            const promoDiscount = Math.min((alreadyDiscountedPrice * promoData.discount) / 100, promoData.maxAmount);

            setState((prev) => ({
                ...prev,
                discountedAmount: prev.discountedAmount + promoDiscount,
            }));

            setPromo({
                error: false,
                message: `Promo applied! ৳${promoDiscount.toFixed(2)} off`,
                data: promoData,
                applied: true,
            });
        });
    };
    
    

    return (
        <div>
            <section class="bg-white py-5 antialiased dark:bg-gray-900 md:py-5">
                <form onSubmit={handleSubmit} action="#" class="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div class="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                        <div class="min-w-0 flex-1 space-y-8">
                            <div class="space-y-4">
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Delivery Details</h2>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label for="your_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            Your name*{" "}
                                        </label>
                                        <input
                                            name="name"
                                            value={state.name}
                                            onChange={handleChange}
                                            type="text"
                                            id="your_name"
                                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            placeholder="Md. Sample Hossain"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label for="mobile-input-3" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            Mobile Number*{" "}
                                        </label>
                                        <div class="flex items-center">
                                            <button
                                                id="dropdown-mobile-button-3"
                                                data-dropdown-toggle="dropdown-mobile-3"
                                                class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                                type="button"
                                            >
                                                <svg fill="none" aria-hidden="true" class="me-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 15">
                                                    <rect width="20" height="15" fill="#006a4e" />
                                                    <circle cx="10" cy="7.5" r="4.5" fill="#f42a41" />
                                                </svg>
                                                +88
                                            </button>

                                            <div class="relative w-full">
                                                <input
                                                    name="mobile"
                                                    value={state.mobile}
                                                    onChange={handleChange}
                                                    type="number"
                                                    id="mobile-input"
                                                    class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500"
                                                    placeholder="01XXX-XXXXXX"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            Email{" "}
                                        </label>
                                        <input
                                            name="email"
                                            value={state.email}
                                            onChange={handleChange}
                                            type="email"
                                            id="email"
                                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            placeholder="name@triova.com"
                                        />
                                    </div>

                                    <div>
                                        <label for="your_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            House / Road / Village*{" "}
                                        </label>
                                        <input
                                            name="house"
                                            value={state.house}
                                            onChange={handleChange}
                                            type="text"
                                            id="your_name"
                                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            placeholder="#H20, #R2, #BA"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label for="your_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            City / Zilla*{" "}
                                        </label>
                                        <input
                                            name="city"
                                            value={state.city}
                                            onChange={handleChange}
                                            type="text"
                                            id="your_name"
                                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            placeholder="Bashundhara"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div class="mb-2 flex items-center gap-2">
                                            <label for="select-city-input-3" class="block text-sm font-medium text-gray-900 dark:text-white">
                                                {" "}
                                                Division*{" "}
                                            </label>
                                        </div>
                                        <select
                                            name="division"
                                            value={state.division}
                                            onChange={handleChange}
                                            required
                                            id="select-city-input-3"
                                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="dhaka">Dhaka</option>
                                            <option value="chittagong">Chittagong</option>
                                            <option value="khulna">Khulna</option>
                                            <option value="rajshahi">Rajshahi</option>
                                            <option value="barishal">Barishal</option>
                                            <option value="rangpur">Rangpur</option>
                                            <option value="sylhet">Sylhet</option>
                                            <option value="mymensingh ">Mymensingh </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="your_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            Postal Code{" "}
                                        </label>
                                        <input
                                            name="postalCode"
                                            value={state.postalCode}
                                            onChange={handleChange}
                                            type="text"
                                            id="your_name"
                                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            placeholder="1229"
                                        />
                                    </div>

                                    <div>
                                        <label for="your_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            Note{" "}
                                        </label>
                                        <input
                                            name="orderNotes"
                                            value={state.orderNotes}
                                            onChange={handleChange}
                                            type="text"
                                            id="your_name"
                                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            placeholder="write something..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Payment</h3>

                                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {/* <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div class="flex items-start">
                                            <div class="flex h-5 items-center">
                                                <input onChange={handleChange} id="credit-card" aria-describedby="credit-card-text" type="radio" name="paymentMethod" value="Card" class="h-4 w-4 border-gray-300 bg-white text-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
                                            </div>

                                            <div class="ms-4 text-sm">
                                                <label for="credit-card" class="font-medium leading-none text-gray-900 dark:text-white"> Credit Card </label>
                                                <p id="credit-card-text" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay with your credit card</p>
                                            </div>
                                        </div>

                                    </div> */}

                                    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div class="flex items-start">
                                            <div class="flex h-5 items-center">
                                                <input
                                                    onChange={handleChange}
                                                    id="pay-on-delivery"
                                                    aria-describedby="pay-on-delivery-text"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="Cash on Delivery"
                                                    class="h-4 w-4 border-gray-300 bg-white text-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                                    checked
                                                />
                                            </div>

                                            <div class="ms-4 text-sm">
                                                <label for="pay-on-delivery" class="font-medium leading-none text-gray-900 dark:text-white">
                                                    {" "}
                                                    Cash on delivery{" "}
                                                </label>
                                                <p id="pay-on-delivery-text" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                                    No payment processing fee
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div class="flex items-start">
                                            <div class="flex h-5 items-center">
                                                <input onChange={handleChange} id="paypal-2" aria-describedby="paypal-text" type="radio" name="paymentMethod" value='Bkash' class="h-4 w-4 border-gray-300 bg-white text-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
                                            </div>

                                            <div class="ms-4 text-sm">
                                                <label for="paypal-2" class="font-medium leading-none text-gray-900 dark:text-white"> Bkash </label>
                                                <p id="paypal-text" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Connect to your account</p>
                                            </div>
                                        </div>

                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 w-full space-y-6 sm:mt-8 lg:mt-2 lg:max-w-xs xl:max-w-md">
                            <div>
                                <label for="voucher" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    {" "}
                                    Enter a gift card, voucher or promotional code{" "}
                                </label>
                                <div class="flex items-center gap-4">
                                    <input
                                        onChange={handleChange}
                                        value={state.promo}
                                        type="text"
                                        id="voucher"
                                        name="promo"
                                        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        placeholder=""
                                    />
                                    <button
                                        onClick={() => applyPromo()}
                                        type="button"
                                        disabled={promo.applied} // 🔐 Prevent multiple clicks
                                        class={`flex items-center justify-center rounded-lg ${
                                            promo.applied ? "bg-gray-400 cursor-not-allowed" : "bg-primary-700 hover:bg-primary-800"
                                        } px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                                    >
                                        Apply
                                    </button>
                                </div>

                                {promo.message !== "" && (
                                    <div
                                        className={`${
                                            promo.error
                                                ? "mt-3 flex items-start gap-2 text-red-600 text-sm font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-md shadow-sm"
                                                : "mt-3 flex items-start gap-2 text-green-600 text-sm font-medium bg-green-50 border border-green-200 px-3 py-2 rounded-md shadow-sm"
                                        }`}
                                    >
                                        {promo.error ? (
                                            // Error icon (exclamation inside triangle)
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.502-1.273.732-2.004L13.732 4.996c-.77-.73-2.694-.73-3.464 0L4.35 17.996c-.77.73-.322 2.004.732 2.004z"
                                                />
                                            </svg>
                                        ) : (
                                            // Success icon (checkmark circle)
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        <span>{promo.message}</span>
                                    </div>
                                )}
                            </div>

                            <div class="flow-root">
                                <div class="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                                    <dl class="flex items-center justify-between gap-4 py-3">
                                        <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Main price</dt>
                                        <dd class="text-base font-medium text-gray-900 dark:text-white">৳ {cart.length != 0 && state.mainPrice}</dd>
                                    </dl>

                                    <dl class="flex items-center justify-between gap-4 py-3">
                                        <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Promo</dt>
                                        <dd class="text-base font-medium text-gray-900 dark:text-white"> {!promo.error && promo.data ? promo.data.discount : 0} %</dd>
                                    </dl>

                                    <dl class="flex items-center justify-between gap-4 py-3">
                                        <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                                        <dd class="text-base font-medium text-green-500"> - ৳ {cart.length != 0 && state.discountedAmount}</dd>
                                    </dl>

                                    <dl class="flex items-center justify-between gap-4 py-3">
                                        <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Delivery</dt>
                                        <dd class="text-base font-medium text-gray-900 dark:text-white">৳{state.division === "dhaka" ? 60 : 120}</dd>
                                    </dl>

                                    <dl class="flex items-center justify-between gap-4 py-3">
                                        <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                        <dd class="text-base font-bold text-gray-900 dark:text-white">৳ {state.mainPrice + (state.division === "dhaka" ? 60 : 120) - state.discountedAmount}</dd>
                                    </dl>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <button
                                    disabled={cart.length == 0}
                                    type="submit"
                                    class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    {" "}
                                    {loading ? <div className="loading loading-spinner loading-md"></div> : "Proceed to Payment"}{" "}
                                </button>

                                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    One or more items in your cart require an account.{" "}
                                    <a href="/signin" title="" class="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
                                        Sign in or create an account now.
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            <Modal open={modalState.open} handleOpen={() => setModalState({ ...modalState, open: !modalState.open })} error={modalState.error} message={modalState.message} />
        </div>
    );
}
