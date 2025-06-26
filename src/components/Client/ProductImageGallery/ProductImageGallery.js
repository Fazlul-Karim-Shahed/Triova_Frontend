"use client";

import { useState, useRef, useEffect } from "react";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import { imageSrc } from "@/src/functions/CustomFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function ProductImageGallery({ featuredImage, images, colorImages }) {
    const allImages = [featuredImage, ...images, ...colorImages];
    const [mainImage, setMainImage] = useState(featuredImage.name);
    const scrollRef = useRef(null);
    const zoomWrapperRef = useRef(null);
    const zoomImageRef = useRef(null);

    // ⬇️ Listen for color image changes from other components
    useEffect(() => {
        const handleColorImageChange = (e) => {
            const imageName = e.detail;
            if (imageName) setMainImage(imageName);
        };

        window.addEventListener("colorImageChange", handleColorImageChange);
        return () => window.removeEventListener("colorImageChange", handleColorImageChange);
    }, []);

    const scroll = (direction) => {
        const amount = 120;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            });
        }
    };

    const handleMouseMove = (e) => {
        const bounds = zoomWrapperRef.current.getBoundingClientRect();
        const x = ((e.clientX - bounds.left) / bounds.width) * 100;
        const y = ((e.clientY - bounds.top) / bounds.height) * 100;

        if (zoomImageRef.current) {
            zoomImageRef.current.style.transformOrigin = `${x}% ${y}%`;
            zoomImageRef.current.style.transform = "scale(2)";
        }
    };

    const handleMouseLeave = () => {
        if (zoomImageRef.current) {
            zoomImageRef.current.style.transform = "scale(1)";
            zoomImageRef.current.style.transformOrigin = "center";
        }
    };

    return (
        <>
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .zoom-transition {
                        transition: transform 0.2s ease;
                    }
                `}
            </style>

            <div>
                {/* Feature Image with Zoom on Hover */}
                <div ref={zoomWrapperRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative w-full aspect-[20/13] overflow-hidden rounded-2xl border shadow-lg">
                    <div ref={zoomImageRef} className="absolute inset-0 w-full h-full zoom-transition">
                        <ClientImageWithLoader src={imageSrc(mainImage)} alt="Feature Image" width={5000} height={5000} className="w-full h-full object-contain rounded" />
                    </div>
                </div>

                {/* Thumbnail Slider with Arrows */}
                <div className="relative mt-4">
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-brand-50 border shadow rounded-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>

                    <div ref={scrollRef} className="flex overflow-x-auto space-x-3 px-10 no-scrollbar">
                        {allImages.map((img, index) => (
                            <div key={index} className="shrink-0 cursor-pointer" onClick={() => setMainImage(img.name)}>
                                <ClientImageWithLoader
                                    src={imageSrc(img.name)}
                                    alt={`Thumbnail ${index}`}
                                    width={500}
                                    height={500}
                                    className={`w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border transition-all duration-200 ${
                                        mainImage === img.name ? "border-indigo-500" : "border-gray-200"
                                    }`}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-brand-50 border shadow rounded-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
        </>
    );
}
