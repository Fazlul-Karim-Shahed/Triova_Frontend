"use client";
import { deleteCategoryApi, updateCategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import { Modal } from "@/src/components/Common/Modal/Modal";
import { imageSrc } from "@/src/functions/CustomFunction";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ClientImageWithLoader from "../../Common/ImageLoader/ClientImageWithLoader";

export default function UpdateCategory({ category }) {
    const router = useRouter();
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    const [formData, setFormData] = useState({
        name: category.name || "",
        description: category.description || "",
        featureImage: null,
        visible: category.visible || false,
        promotionalImage: null,
        promotionalDescription: category.promotionalDescription || "",
        promotionalLink: category.promotionalLink || "",
        departmentId: category.departmentId,
        categoryId: category.categoryId,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalState({ message: "Updating category...", open: 1, loading: 1 });
        const data = await updateCategoryApi(formData, category._id);
        setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        router.refresh();
    };

    const handleDelete = async () => {
        setModalState({ message: "Deleting category...", open: 1, loading: 1 });
        const data = await deleteCategoryApi(category._id);
        setModalState({ error: data.error, message: data.message, open: 1, loading: 0 });
        if (!data.error) window.location.href = "/super-admin/dashboard/category";
    };

    return (
        <div className="bg-white/50 backdrop-blur-lg border border-white/20 rounded-xl">
            <h3 className="text-2xl font-semibold text-center text-gray-700 mb-6">Update Category - {category.name}</h3>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                {/* Visibility */}
                <div className="flex items-center space-x-3">
                    <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} className="checkbox checkbox-success" />
                    <label className="text-gray-700 font-medium">Visible</label>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                    />
                </div>

                {/* Feature Image */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Feature Image</label>
                    {category.featureImage && (
                        <div className="mb-2">
                            <ClientImageWithLoader src={imageSrc(category.featureImage.name)} alt="Feature" className="h-40 w-auto rounded-lg shadow mb-2" />
                            <button type="button" onClick={() => setFormData({ ...formData, featureImage: false })} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
                                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                Remove Feature Image
                            </button>
                        </div>
                    )}
                    <input type="file" name="featureImage" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                {/* Promotional Image */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Promotional Image</label>
                    {category.promotionalImage && (
                        <div className="mb-2">
                            <ClientImageWithLoader src={imageSrc(category.promotionalImage.name)} alt="Promotional" className="h-40 w-auto rounded-lg shadow mb-2" />
                            <button type="button" onClick={() => setFormData({ ...formData, promotionalImage: false })} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
                                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                Remove Promotional Image
                            </button>
                        </div>
                    )}
                    <input type="file" name="promotionalImage" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                {/* Promo Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Promotional Description</label>
                    <input
                        type="text"
                        name="promotionalDescription"
                        value={formData.promotionalDescription}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300"
                    />
                </div>

                {/* Promo Link */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Promotional Link</label>
                    <input
                        type="text"
                        name="promotionalLink"
                        value={formData.promotionalLink}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300"
                    />
                </div>

                {/* Submit & Delete */}
                <div className="flex flex-col gap-4">
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow">
                        Update Category
                    </button>

                    <button type="button" onClick={handleDelete} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faTrash} />
                        Delete Category
                    </button>
                </div>
            </form>

            {/* Modal */}
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
