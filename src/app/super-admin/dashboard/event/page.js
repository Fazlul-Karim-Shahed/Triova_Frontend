"use client";

import React, { useEffect, useState } from "react";
import { createEventApi, getAllEventApi, deleteEventApi, updateEventApi } from "@/src/api/SuperAdminApi/EventApi";
import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import { Modal } from "@/src/components/Common/Modal/Modal";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";

export default function EventPage() {
    const [events, setEvents] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const [formData, setFormData] = useState({
        _id: null,
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        link: "",
        promotionalImage: null,
        products: [],
    });

    useEffect(() => {
        fetchEvents();
        fetchProducts();
    }, []);

    const fetchEvents = async () => {
        setModalState({ message: "Fetching data. Please wair...", open: 1, loading: 1 });
        const res = await getAllEventApi();
        if (res.error) {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        } else {
            setModalState({ error: res.error, message: res.message, open: 0, loading: 0 });
            setEvents(res.data);
        }
    };

    const fetchProducts = async () => {
        setModalState({ message: "Fetching data. Please wair...", open: 1, loading: 1 });
        const res = await getAllProductApi();
        if (!res.error) {
            setModalState({ error: res.error, message: res.message, open: 0, loading: 0 });
            setProducts(res.data);
        } else {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "promotionalImage") {
            setFormData({ ...formData, promotionalImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const toggleProduct = (productId) => {
        setFormData((prev) => ({
            ...prev,
            products: prev.products.includes(productId) ? prev.products.filter((id) => id !== productId) : [...prev.products, productId],
        }));
    };

    const selectAllProducts = () => {
        setFormData((prev) => ({ ...prev, products: products.map((p) => p._id) }));
    };

    const unselectAllProducts = () => {
        setFormData((prev) => ({ ...prev, products: [] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if (key === "products") {
                val.forEach((id) => data.append("products[]", id));
            } else if (key === "_id" && val) {
                // ID in URL not body
            } else {
                data.append(key, val);
            }
        });

        let res;
        if (formData._id) {
            setModalState({ message: "Updating event. Please wait...", open: 1, loading: 1 });
            res = await updateEventApi(formData._id, data);
        } else {
            setModalState({ message: "Creating event. Please wait...", open: 1, loading: 1 });
            res = await createEventApi(data);
        }

        if (res.error) {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        } else {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            e.target.reset();
            setFormData({
                _id: null,
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                link: "",
                promotionalImage: null,
                products: [],
            });
            fetchEvents();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        setModalState({ message: "Deleting event...", open: 1, loading: 1 });
        const res = await deleteEventApi(id);
        if (res.error) {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
        } else {
            setModalState({ error: res.error, message: res.message, open: 1, loading: 0 });
            fetchEvents();
        }
    };

    const handleEdit = (event) => {
        setFormData({
            _id: event._id,
            name: event.name,
            description: event.description,
            startDate: event.startDate.slice(0, 10),
            endDate: event.endDate.slice(0, 10),
            link: event.link || "",
            promotionalImage: null,
            products: event.products.map((p) => (typeof p === "object" ? p._id : p)),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto space-y-12">
                

                {/* Create / Edit Event Form */}
                <div className="bg-white border-gray-200 rounded-xl py-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{formData._id ? "✏️ Update Event" : "🎉 Create New Event"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Event Name
                                </label>
                                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="link" className="text-sm font-medium text-gray-700">
                                    Event Link (optional)
                                </label>
                                <input type="text" id="link" name="link" value={formData.link} onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input type="date" id="startDate" name="startDate" required value={formData.startDate} onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input type="date" id="endDate" name="endDate" required value={formData.endDate} onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Event Description
                            </label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" rows={4} />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="promotionalImage" className="text-sm font-medium text-gray-700">
                                Promotional Image {formData._id && "(Leave empty to keep current)"}
                            </label>
                            <input type="file" id="promotionalImage" name="promotionalImage" accept="image/*" onChange={handleChange} className="file-input file-input-bordered w-full" />
                        </div>

                        {/* Product Selection */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Select Products</label>
                                <div className="flex flex-wrap gap-2">
                                    <input type="text" placeholder="🔍 Search products..." className="input input-sm input-bordered" onChange={(e) => setSearchTerm(e.target.value)} />
                                    <button type="button" onClick={selectAllProducts} className="btn btn-xs btn-outline whitespace-nowrap">
                                        Select All
                                    </button>
                                    <button type="button" onClick={unselectAllProducts} className="btn btn-xs btn-outline whitespace-nowrap">
                                        Unselect All
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto border rounded-lg">
                                <table className="table table-zebra table-sm min-w-[480px] text-sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Product</th>
                                            <th>Real Price</th>
                                            <th>Selling Price</th>
                                            <th>Discount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products
                                            .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((product) => (
                                                <tr key={product._id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.products.includes(product._id)}
                                                            onChange={() => toggleProduct(product._id)}
                                                            className="checkbox checkbox-sm"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap">{product.name}</td>
                                                    <td>{product.orderPrice?.toFixed(0)}/-</td>
                                                    <td>{product.sellingPrice?.toFixed(0)}/-</td>
                                                    <td>{product.discount}%</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full uppercase tracking-wide">
                            {formData._id ? "✏️ Update Event" : "➕ Submit Event"}
                        </button>
                    </form>
                </div>

                {/* Event List */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">📅 Upcoming Events</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.length === 0 ? (
                            <div className="col-span-full text-center text-gray-400">No events found.</div>
                        ) : (
                            events.map((event) => (
                                <div key={event._id} className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-all duration-300 overflow-hidden">
                                    {event.promotionalImage && <ClientImageWithLoader src={imageSrc(event.promotionalImage.name)} alt={event.name} className="w-full h-40 object-cover" />}
                                    <div className="p-4 space-y-2">
                                        <h4 className="text-lg font-semibold text-gray-800">{event.name}</h4>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}
                                        </p>
                                        {event.link && (
                                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-blue-500 hover:underline text-sm">
                                                🔗 Visit Event
                                            </a>
                                        )}
                                        <div className="pt-3 flex justify-between">
                                            <button className="btn btn-sm btn-outline" onClick={() => handleEdit(event)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-error" onClick={() => handleDelete(event._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
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
