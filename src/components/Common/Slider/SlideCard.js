import Link from "next/link";
import React from "react";
import ClientImageWithLoader from "../ImageLoader/ClientImageWithLoader";

export default function SlideCard({ item, index }) {
    return (
        <Link
            className="h-full mx-5 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border-2 border-gray-100 bg-white hover:shadow-lg"
            itemScope
            itemType="https://schema.org/Product"
            href={`/products/${encodeURIComponent(item.name)}`}
        >
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl text-center">
                <ClientImageWithLoader
                    width={300}
                    height={300}
                    src={imageSrc(item.featuredImage.name)}
                    alt={item.name || "Product image"}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.src = "/fallback-product.png";
                    }}
                />
                {item.discount > 0 && (
                    <span
                        style={{ color: "white" }}
                        className="absolute top-0 left-0 m-2 rounded-full bg-pink-600 px-2 text-center text-sm font-medium text-white"
                        aria-label={`${item.discount}% off`}
                    >
                        {item.discount}% OFF
                    </span>
                )}
            </div>
            <div className="mt-4 px-4">
                <h5 itemProp="name" className="tracking-tight text-slate-900 truncate" title={item.name}>
                    {item.name}
                </h5>
                <meta itemProp="sku" content={item.sku || ""} />
                <div className="mt-2 mb-5 flex items-center justify-between">
                    <p itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <span className="text-xl font-semibold mr-2" itemProp="price">
                            BDT {(item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2)}
                        </span>
                        <meta itemProp="priceCurrency" content="BDT" />
                        {item.discount > 0 && <span className="text-xs line-through">BDT {item.sellingPrice}</span>}
                    </p>
                </div>
                <div className="my-2 flex gap-1 flex-wrap" aria-label="Available colors">
                    {item.colors?.map((c, idx) => (
                        <div key={idx} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c.colorCode || "#eee" }} title={c.color} aria-label={c.color}></div>
                    ))}
                </div>
            </div>
            <div className="flex m-3 justify-content-center w-fit"></div>
        </Link>
    );
}
