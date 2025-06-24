"use client";

import { getAllSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import { faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductFilter({ products, categoryId, searchParams, onFilterChange }) {
    const [subBrands, setSubBrands] = useState([]);
    const [brands, setBrands] = useState([]);
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [subCategory, setSubCategory] = useState([]);

    const router = useRouter();

    useEffect(() => {
        if (categoryId) {
            getAllSubCategoryApi({ categoryId }).then((data) => {
                if (!data.error) {
                    setSubCategory(data.data);
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

    const initialFilterValues = {
        subbrand: searchParams.subbrand || "",
        brand: searchParams.brand || "",
        min: searchParams.min || "",
        max: searchParams.max || "",
        color: searchParams.color || "",
        size: searchParams.size || "",
        subcategory: searchParams.subcategory || "",
    };

    return (
        <div className="sticky top-28">
            <Formik
                initialValues={initialFilterValues}
                enableReinitialize
                onSubmit={(val) => {
                    const query = {};
                    for (const key in val) {
                        if (val[key]) {
                            query[key] = val[key];
                        }
                    }
                    router.push(`/products?${new URLSearchParams(query).toString()}`);
                    if (typeof onFilterChange === "function") {
                        onFilterChange(query);
                    }
                }}
            >
                {({ handleChange, handleSubmit, setValues, values }) => (
                    <form onSubmit={handleSubmit} className="bg-white/70 border-2 border-gray-200 text-sm rounded-2xl p-5  backdrop-blur-md">
                        <div className="mb-6">
                            <div className="flex items-center text-xl font-semibold text-gray-800">
                                <FontAwesomeIcon icon={faArrowUpShortWide} className="me-3 text-gray-500" />
                                All Filters
                            </div>
                        </div>

                        {subCategory.length > 0 && (
                            <div className="mb-4">
                                <label className="text-gray-700 font-semibold block mb-1">Department</label>
                                <div className="text-sm underline text-emerald-600">{subCategory[0].departmentId.name}</div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="text-gray-700 font-semibold block mb-1">Sub-Category</label>
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

                        <div className="mb-4 text-gray-700">
                            <label className="font-semibold block mb-1">Price</label>
                            <div className="flex gap-2 items-center">
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
                                <label className="text-gray-700 font-semibold block mb-1">{field.label}</label>
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

                        <div className="pt-2 flex flex-row gap-3">
                            <button type="submit" className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-medium shadow-md hover:opacity-90 transition">
                                Apply Filters
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const emptyFilters = {
                                        subbrand: "",
                                        brand: "",
                                        min: "",
                                        max: "",
                                        color: "",
                                        size: "",
                                        subcategory: "",
                                    };
                                    setValues(emptyFilters);
                                    router.push("/products");
                                    if (typeof onFilterChange === "function") {
                                        onFilterChange({});
                                    }
                                }}
                                className="w-full py-2 px-4 rounded-xl border border-emerald-400 text-emerald-600 hover:bg-emerald-50 font-medium transition"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}
