"use client";
import { deleteImageSliderApi, getAllImageSliderApi } from "@/src/api/SuperAdminApi/ImageSliderApi";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function SliderPage() {
    const [sliders, setSliders] = useState([]);
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    const fetchSliders = async () => {
        setModalState({ message: "Collecting product data...", open: 1, loading: 1 });
        const res = await getAllImageSliderApi();
        if (!res.error) {
            setSliders(res.data);
            setModalState({ error: res.error, message: res.message, open: 0, loading: 0 });
        } else {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this image slider?")) return;

        setModalState({ message: "Deleting slider...", open: 1, loading: 1 });
        const res = await deleteImageSliderApi(id);
        if (!res.error) {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            fetchSliders();
        } else {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    return (
        <div className="">
            <div className="text-end space-x-3 mb-5">
                <button className="btn btn-primary text-white btn-sm">
                    <Link href={`/super-admin/dashboard/slider/create`}>Create Image Slider</Link>
                </button>
            </div>

            <h1 className="text-2xl font-semibold mb-4">Image Sliders</h1>

            {modalState.error && <div className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded">{modalState.message}</div>}

            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                {sliders.map((slider) => (
                    <div key={slider._id} className="bg-white border rounded-lg shadow hover:shadow-md transition overflow-hidden">
                        <div className="w-full h-48 overflow-hidden">
                            <ClientImageWithLoader width={400} height={200} src={imageSrc(slider.promotionalImage.name)} alt={slider.name} className="w-full h-full object-cover" />
                        </div>
                        {console.log(slider.name)}

                        <div className="p-4">
                            <h2 className="text-lg font-medium text-black">{slider.name}</h2>
                            <p className="text-sm text-gray-600 mb-3">{slider.description}</p>
                            <button onClick={() => handleDelete(slider._id)} className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />
        </div>
    );
}
