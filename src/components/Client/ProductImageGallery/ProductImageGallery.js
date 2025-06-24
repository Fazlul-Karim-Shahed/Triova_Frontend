"use client";

import { useState } from "react";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import { imageSrc } from "@/src/functions/CustomFunction";

export default function ProductImageGallery({ featuredImage, images }) {
    const allImages = [featuredImage, ...images];
    const [mainImage, setMainImage] = useState(featuredImage.name);

    return (
        <div>
            {/* Feature Image */}
            <div className="relative w-full aspect-[20/13] overflow-hidden rounded-2xl border shadow-lg">
                <ClientImageWithLoader src={imageSrc(mainImage)} alt="Feature Image" width={5000} height={5000} className="absolute inset-0 w-full h-full object-contain rounded" />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-6 gap-4 mt-4">
                {allImages.map((img, index) => (
                    <div key={index} className="mt-2 cursor-pointer" onClick={() => setMainImage(img.name)}>
                        <ClientImageWithLoader
                            src={imageSrc(img.name)}
                            alt={`Thumbnail ${index}`}
                            width={500}
                            height={500}
                            className={`w-full md:h-16 h-10 rounded-lg object-cover border ${mainImage === img.name ? "border-indigo-500" : "border-transparent"}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
