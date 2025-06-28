"use client";

import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageSrc } from "@/src/functions/CustomFunction";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function SimilarProduct({ subCategory }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (subCategory?._id) {
            getAllProductApi(10, { subCategoryId: subCategory._id }).then((res) => {
                console.log(res);
                if (!res.error) {
                   
                    setProducts(res.data);
                }
            });
        }
    }, [subCategory]);

    if (!products.length) return null;

    return (
        <div className="mt-10 px-4 md:px-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 pb-2">
                {products.map((product) => (
                    <Link
                        key={product._id}
                        href={`/products/${product.name}`}
                        className="grid-cols-3 md:grid-cols-2 bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md transition p-3"
                    >
                        <div className="w-full h-40 relative rounded-xl overflow-hidden mb-2">
                            <ClientImageWithLoader src={imageSrc(product?.featuredImage?.name || "/placeholder.png")} alt={product.name} fill className="object-cover" />
                        </div>
                        <h3 className="text-xs md:text-sm font-medium text-gray-700 truncate">{product.name}</h3>
                        <p className="text-xs mdtext-sm font-semibold text-primary mt-1">৳{product.sellingPrice}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
