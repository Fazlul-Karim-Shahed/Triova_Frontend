// src/components/Client/ProductShowPageWrapper.jsx
"use client";

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductFilter from "@/src/components/Client/ProductFilter/ProductFilter";
import ProductFilterSM from "@/src/components/Client/ProductFilter/ProductFilterSM";
import AddtoCartBtn from "@/src/components/Client/AddtoCartBtn/AddtoCartBtn";
import Spinner from "@/src/components/Common/Spinner/Spinner";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function ProductShowPageWrapper({ initialProducts, initialSubCategory, searchParams }) {
    const [products, setProducts] = useState(initialProducts);
    const [subCategory, setSubCategory] = useState(initialSubCategory);
    const [imageLoaded, setImageLoaded] = useState(false);

    if (!products) return <Spinner message="Loading Products data..." />;

    return (
        <div className="mx-auto px-4 py-10 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md">
            <div className="border-y p-3 mb-8 lg:hidden rounded-lg shadow-sm bg-white/30 backdrop-blur-md">
                <ProductFilterSM products={products} categoryId={subCategory} searchParams={searchParams} />
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="hidden lg:block col-span-3">
                    <div className="sticky top-20 bg-white/20 backdrop-blur-md rounded-xl px-4">
                        <ProductFilter products={products} categoryId={subCategory} searchParams={searchParams} />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-9">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {products.length > 0 ? (
                            products.map((item, index) => (
                                <div key={index} className="flex flex-col backdrop-blur-xl bg-white/20 border-2 rounded-3xl p-2 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                                    <Link href={`/products/${encodeURIComponent(item.name)}`} className="relative rounded-2xl overflow-hidden group block">
                                        <ClientImageWithLoader
                                            width={1000}
                                            height={1000}
                                            className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300 ease-in-out"
                                            quality={100}
                                            src={imageSrc(item.featuredImage.name)}
                                            alt="product"
                                        />

                                        {item.discount > 0 && <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-semibold">{item.discount}% OFF</span>}
                                    </Link>

                                    <div className="mt-4 flex flex-col justify-between flex-grow">
                                        <h6 className="text-md font-semibold text-gray-800 truncate">{item.name}</h6>
                                        <div className="mt-3 mb-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-gray-900">৳ {(item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2)}</span>
                                                    {item.discount > 0 && <span className="text-xs line-through ml-2 text-gray-500">৳{item.sellingPrice}</span>}
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-yellow-400">
                                                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.897L19.335 24 12 19.897 4.665 24 6 15.32 0 9.423l8.332-1.268z" />
                                                    </svg>
                                                    <span className="text-yellow-700 font-medium">4.0</span>
                                                </div>
                                            </div>
                                            <div className="my-4 flex gap-1 flex-wrap">
                                                {item.colors?.map((c, idx) => (
                                                    <div key={idx} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c.colorCode || "#eee" }} title={c.color}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-5 items-center gap-2">
                                            <div className="col-span-1"></div>
                                            <div className="col-span-1 flex items-center justify-center">
                                                <div className="bg-white/40 p-2 rounded-full hover:scale-110 transition cursor-pointer shadow-inner">
                                                    <FontAwesomeIcon icon={faHeart} className="text-red-500 text-lg" />
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <AddtoCartBtn product={item} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <ClientImageWithLoader
                                    src="https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-illustration-download-in-svg-png-gif-file-formats--available-product-tokostore-pack-e-commerce-shopping-illustrations-2809510.png?f=webp"
                                    height={400}
                                    width={400}
                                    className="mx-auto"
                                    alt="No product found"
                                />
                                <div className="mt-4 text-xl font-semibold text-gray-700">No product found</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
