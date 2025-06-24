"use client";

import { useEffect, useState } from "react";
import { imageSrc } from "@/src/functions/CustomFunction";
import { getAllEventApi } from "@/src/api/SuperAdminApi/EventApi";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function EventPopup() {
    const [show, setShow] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getAllEventApi("today").then((data) => {
            //console.log(data)
            if (!data.error) {
                setEvents(data.data);
                setShow(true);
            } else {
                setShow(false);
            }
        });
    }, []);

    const currentEvent = events[currentIndex];

    const nextEvent = () => setCurrentIndex((prev) => (prev + 1) % events.length);
    const prevEvent = () => setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);

    if (!show || !currentEvent) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm md:p-0 p-3">
            <div className="relative w-full max-w-3xl rounded-xl overflow-hidden animate-popup-fade">
                {/* Promotional Image */}
                <div className="w-full relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px]">
                    <ClientImageWithLoader src={imageSrc(currentEvent.promotionalImage.name)} alt="Promotion" className="w-full h-full object-contain rounded-xl" />
                    {/* Close Button (inside image) */}
                    <button
                        onClick={() => setShow(false)}
                        className="absolute top-1 right-0 text-white bg-emerald-500 hover:bg-emerald-400 px-3 py-0.5 rounded-full text-2xl font-bold z-20 shadow"
                        aria-label="Close"
                    >
                        ×
                    </button>
                    {/* Prev/Next Buttons */}
                    {events.length > 1 && (
                        <>
                            <button
                                onClick={prevEvent}
                                className="absolute top-1/2 -translate-y-1/2 left-3 bg-white/70 backdrop-blur-md hover:bg-white text-gray-800 p-2 rounded-full shadow border border-gray-300"
                                aria-label="Previous"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={nextEvent}
                                className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/70 backdrop-blur-md hover:bg-white text-gray-800 p-2 rounded-full shadow border border-gray-300"
                                aria-label="Next"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Fade Animation */}
            <style jsx>{`
                .animate-popup-fade {
                    animation: popupFadeIn 0.4s ease-out;
                }
                @keyframes popupFadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
