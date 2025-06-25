"use client";
import { getReduxCart } from "@/src/redux/store";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../../../functions/cartFunctions";

export default function ProductDetailsForm({ product }) {
    const dispath = useDispatch();

    const [selectedColor, setSelectedColor] = useState(product.colors.length != 0 ? product.colors[0] : null); // Default color
    const [selectedSize, setSelectedSize] = useState(""); // Default size
    const [quantity, setQuantity] = useState(1);
    const [messageShow, setMessageShow] = useState(false);

    const handleQuantityChange = (amount) => {
        if (selectedColor && selectedSize != "") {
            setQuantity((prevQuantity) => Math.max(1, Math.min(selectedSize.stock, prevQuantity + amount)));
        } else if (selectedColor && selectedSize == "") {
            setQuantity((prevQuantity) => Math.max(1, Math.min(selectedColor.stock, prevQuantity + amount)));
        } else if (!selectedColor && selectedSize != "") {
            setQuantity((prevQuantity) => Math.max(1, Math.min(selectedSize.stock, prevQuantity + amount)));
        }
    };

    const handleColorSelect = (color) => {
        if (product.sizes && product.sizes.length > 0 && product.sizes[0].referenceColor != "") {
            setSelectedSize("");
            setQuantity(1);
        }
        setSelectedColor(color);
        setQuantity(1);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setQuantity(1);
    };

    const addToCart = () => {
        addCart(product._id, selectedColor ? selectedColor.color : "", selectedSize.size, quantity);
        dispath(
            getReduxCart({
                cart: localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME) ? JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_CART_NAME)).length : 0,
            })
        );
        setMessageShow(true);
    };

    return (
        <div>
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
                <div>
                    <p className="font-bold leading-8 text-gray-900 mb-4">Color</p>
                    <div className="flex items-center gap-3 mb-6">
                        {product.colors.map((color) => (
                            <div className="tooltip" data-tip={color.color}>
                                <button
                                    key={color}
                                    className={`p-1 border rounded-full transition-all duration-300 ${selectedColor.colorCode === color.colorCode ? "border-brand-600" : "border-brand-100"}`}
                                    onClick={() => handleColorSelect(color)}
                                >
                                    <svg width="30" height="30">
                                        <circle cx="15" cy="15" r="15" fill={color.colorCode} />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
                <div>
                    <p className="font-bold text leading-8 text-gray-900 mb-4">Size</p>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 mb-6">
                        {product.sizes
                            .filter((size) => (selectedColor ? size.referenceColor == selectedColor.color : true))
                            .map((size, index) => {
                                if (index == 0 && selectedSize == "") {
                                    setSelectedSize(size);
                                }
                                return (
                                    <button
                                        key={size}
                                        className={`border py-2 px-6 w-full rounded-full font-semibold transition-all duration-300 ${
                                            selectedSize === size ? "border-emerald-500 bg-gray-50" : "border-gray-200"
                                        }`}
                                        onClick={() => handleSizeSelect(size)}
                                    >
                                        {size.size}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                <div className="flex items-center w-full">
                    <button className="py-3 px-3 font-bold border border-gray-400 rounded-l-full transition-all duration-300 hover:bg-gray-50" onClick={() => handleQuantityChange(-1)}>
                        -
                    </button>
                    <input className="py-3 border-t border-b border-gray-400 text-center w-full outline-none" type="text" value={quantity} readOnly />
                    <button className="py-3 px-3 font-bold border border-gray-400 rounded-r-full transition-all duration-300 hover:bg-gray-50" onClick={() => handleQuantityChange(1)}>
                        +
                    </button>
                </div>
                <button
                    onClick={() => addToCart()}
                    className="flex items-center justify-center w-full rounded-full bg-yellow-600 text-white text-sm font-medium shadow-yellow-200 hover:bg-yellow-500 transition-all duration-300 py-1"
                >
                    Add to Cart
                </button>

                {/* <button className="flex items-center justify-center w-full rounded-full bg-green-700 text-white text-sm font-medium shadow-green-200 hover:bg-green-600 transition-all duration-300 py-1">
                    But Now
                </button> */}
            </div>

            {messageShow && (
                <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-gray-800 dark:text-green-400" role="alert">
                    Successfully added.{" "}
                    <Link href="/cart" class="font-bold hover:underline">
                        View Cart
                    </Link>
                </div>
            )}
        </div>
    );
}
