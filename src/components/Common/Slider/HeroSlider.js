"use client";

import { useEffect, useRef, useState } from "react";
import { getAllImageSliderApi } from "@/src/api/SuperAdminApi/ImageSliderApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import Spinner from "../Spinner/Spinner";
import ClientImageWithLoader from "../ImageLoader/ClientImageWithLoader";

export default function HeroSlider() {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState({});
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);
    const delay = 5000;

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleLoad = (url) => {
        setLoadedImages((prev) => ({ ...prev, [url]: true }));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const res = await getAllImageSliderApi();
                if (!res.error) {
                    setLoading(false);
                    const formatted = res.data.map((item) => imageSrc(item.promotionalImage.name));
                    setImages(formatted);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setLoading(false);
                // Optionally handle error
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length === 0) return;
        resetTimeout();
        timeoutRef.current = setTimeout(nextSlide, delay);
        return () => resetTimeout();
    }, [currentIndex, images]);

    if (loading) {
        return (
            <div className="w-full h-56 md:h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                <Spinner message="Loading Images..." />
            </div>
        );
    }

    if (images.length === 0) {
        return <div className="w-full h-56 md:h-96 flex items-center justify-center bg-gray-100 rounded-lg">No images found</div>;
    }

    return (
        <div className="relative w-full overflow-hidden rounded-lg">
            {/* Slider Track */}
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((img) => (
                    <div key={img} className="relative min-w-full h-64 md:h-[400px]">
                        {!loadedImages[img] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </div>
                        )}

                        <ClientImageWithLoader
                            src={img}
                            alt="Slider Image"
                            onLoad={() => handleLoad(img)}
                            onError={() => handleLoad(img)}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[img] ? "opacity-100" : "opacity-0"}`}
                        />
                    </div>
                ))}
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`w-3 h-3 rounded-full ${i === currentIndex ? "bg-white" : "bg-white/50"} transition duration-300`}
                        aria-label={`Slide ${i + 1}`}
                    ></button>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button onClick={prevSlide} className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 group focus:outline-none">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                    </svg>
                </span>
            </button>
            <button onClick={nextSlide} className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 group focus:outline-none">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                </span>
            </button>
        </div>
    );
}
