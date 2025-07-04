"use client";

import { getAEventApi } from "@/src/api/SuperAdminApi/EventApi";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import { imageSrc } from "@/src/functions/CustomFunction";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventPage({ params }) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAEventApi(decodeURIComponent(params.name)).then((data) => {
            if (!data.error) {
                setEvent(data.data);
            }
            setLoading(false);
        });
    }, [params.name]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh] bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <p className="text-2xl font-semibold text-gray-500">Event not found!</p>
            </div>
        );
    }

    return (
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-100 min-h-screen">
            {/* Event Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-stretch">
                {/* Image Section */}
                <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-lg">
                    <ClientImageWithLoader
                        src={event.promotionalImage?.secure_url || "https://triova.vercel.app/Logo_Bg.png"}
                        alt={event.name}
                        className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{event.name}</h1>
                    </div>
                </div>

                {/* Description Section */}
                <div className="lg:col-span-10 rounded-2xl shadow-md flex flex-col justify-center bg-gradient-to-br from-[#f0f4ff] via-white to-[#e4f1ff] p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 tracking-wide">✨ Event Description</h2>
                    <p className="text-gray-800 text-md md:text-lg leading-relaxed font-medium">{event.description}</p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {event.products?.map((product) => (
                    <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300 flex flex-col">
                        <ClientImageWithLoader src={imageSrc(product.featuredImage.name)} alt={product.name} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h2>
                            <div className="mt-2 mb-5">
                                <p>
                                    <span className="text-xl font-semibold mr-2">BDT {product.sellingPrice - product.sellingPrice * (product.discount / 100)}</span>
                                    {product.discount > 0 && <span className="text-xs line-through">BDT {product.sellingPrice}</span>}
                                </p>
                            </div>
                            <div className="mt-2 flex gap-1 flex-wrap">
                                {product.colors?.map((c, idx) => (
                                    <div key={idx} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c.colorCode || "#eee" }} title={c.color}></div>
                                ))}
                            </div>
                            <Link href={`/products/${product.name}`} className="mt-4 inline-block text-center w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                                View Product
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
