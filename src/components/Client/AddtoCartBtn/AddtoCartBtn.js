"use client"

import { addCart } from "@/src/functions/cartFunctions";
import { getReduxCart } from "@/src/redux/store";
import { useDispatch } from "react-redux";

export default function AddtoCartBtn({ product }) {

    const dispatch = useDispatch();

    const addToCart = () => {
        addCart(
            product._id,
            product.colors.length > 0 ? product.colors[0].color : '',
            product.sizes.length > 0
                ? product.sizes.find(
                    s => s.referenceColor && s.referenceColor !== ''
                        ? s.referenceColor === (product.colors.length > 0 ? product.colors[0].color : true)
                        : true
                ).size
                : '',
            1
        );

        dispatch(getReduxCart({
            cart: localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)
                ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)).length
                : 0
        }));
    };

    return (
        <div className="cursor-pointer" onClick={addToCart}>
           <button className="
                w-full
                flex items-center justify-center 
                rounded-xl 
                backdrop-blur-md bg-white/30 
                border border-white/20 
                text-gray-800 text-sm font-semibold 
                px-4 py-2.5 
                transition-all duration-300 ease-in-out
                
                hover:shadow-md 
                hover:bg-gradient-to-r hover:from-[#FD9248] hover:to-[#FA1768]
                hover:text-white
                hover:border-none
                active:scale-95
            ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                Add to Cart
            </button>
        </div>
    );
}
