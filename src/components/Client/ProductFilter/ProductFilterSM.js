"use client";

import { getAllSubCategoryApi, getSubCategoryByCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import { faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilterSM({ products, categoryId }) {
    const [subBrands, setSubBrands] = useState([]);
    const [brands, setBrands] = useState([]);
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [subCategory, setSubCategory] = useState([]);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (products?.length) {
            getSubCategoryByCategoryApi(products[0].categoryId._id).then((data) => {
                if (!data.error) {
                    setSubCategory(data.data.filter((item) => item.visible));
                }
            });
        }
    }, [categoryId]);

    useEffect(() => {
        if (products?.length) {
            const brandSet = new Set();
            const subBrandSet = new Set();
            const colorSet = new Set();
            const sizeSet = new Set();

            products.forEach((item) => {
                if (item.brandId?.name) brandSet.add(item.brandId.name);
                if (item.subBrandId?.name) subBrandSet.add(item.subBrandId.name);
                item.colors?.forEach((c) => colorSet.add(c.color));
                item.sizes?.forEach((s) => sizeSet.add(s.size));
            });

            setBrands(Array.from(brandSet));
            setSubBrands(Array.from(subBrandSet));
            setColor(Array.from(colorSet));
            setSize(Array.from(sizeSet));
        }
    }, [products]);

    return (
        <div>
            <button className="border px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-800 hover:text-white transition" onClick={() => document.getElementById("filterModal").showModal()}>
                Filter
            </button>

            <dialog id="filterModal" className="modal">
                <div className="modal-box bg-white/70 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200 text-gray-800 max-w-2xl md:w-full">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <div className="mt-8">
                        <Formik
                            initialValues={{
                                subbrand: searchParams.get("subbrand") || "",
                                brand: searchParams.get("brand") || "",
                                min: searchParams.get("min") || "",
                                max: searchParams.get("max") || "",
                                color: searchParams.get("color") || "",
                                size: searchParams.get("size") || "",
                                subcategory: searchParams.get("subcategory") || "",
                            }}
                            enableReinitialize
                            onSubmit={(val) => {
                                const params = new URLSearchParams();
                                for (const key in val) {
                                    if (val[key]) params.set(key, val[key]);
                                }
                                router.push(`/products?${new URLSearchParams(params).toString()}`);
                                document.getElementById("filterModal").close();
                            }}
                        >
                            {({ handleChange, handleSubmit, setValues, values }) => (
                                <form className="text-sm" onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <div className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                                            <FontAwesomeIcon icon={faArrowUpShortWide} className="text-gray-500" />
                                            All Filters
                                        </div>
                                    </div>

                                    {subCategory.length > 0 && (
                                        <div className="mb-4">
                                            <label className="font-medium block mb-1">Department</label>
                                            <div className="text-emerald-600">{subCategory[0].departmentId.name}</div>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="font-medium block mb-1">Sub Category</label>
                                        <select
                                            name="subcategory"
                                            value={values.subcategory}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                        >
                                            <option value="">Select</option>
                                            {subCategory.map((item) => (
                                                <option key={item._id} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium block mb-1">Price</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                name="min"
                                                placeholder="Min"
                                                value={values.min}
                                                onChange={handleChange}
                                                className="w-20 px-2 py-1 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                            />
                                            <input
                                                type="number"
                                                name="max"
                                                placeholder="Max"
                                                value={values.max}
                                                onChange={handleChange}
                                                className="w-20 px-2 py-1 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {[
                                        { name: "brand", label: "Brand", options: brands },
                                        { name: "subbrand", label: "Sub Brand", options: subBrands },
                                        { name: "color", label: "Color", options: color },
                                        { name: "size", label: "Size", options: size },
                                    ].map((field) => (
                                        <div className="mb-4" key={field.name}>
                                            <label className="font-medium block mb-1">{field.label}</label>
                                            <select
                                                name={field.name}
                                                value={values[field.name]}
                                                onChange={handleChange}
                                                className="w-full p-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                            >
                                                <option value="">Select</option>
                                                {field.options.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto flex-1 text-center py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-medium shadow-md hover:opacity-90 transition"
                                        >
                                            Apply Filters
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValues({
                                                    subbrand: "",
                                                    brand: "",
                                                    min: "",
                                                    max: "",
                                                    color: "",
                                                    size: "",
                                                    subcategory: "",
                                                });
                                                router.push("/products");
                                                document.getElementById("filterModal").close();
                                            }}
                                            className="w-full sm:w-auto flex-1 text-center py-2 px-4 rounded-xl border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
