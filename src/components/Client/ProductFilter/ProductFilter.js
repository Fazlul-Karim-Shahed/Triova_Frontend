"use client";

import { getSubCategoryByCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import { faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductFilter({ products, categoryId, searchParams, onFilterChange }) {
    console.log(searchParams)
    const [subBrands, setSubBrands] = useState([]);
    const [brands, setBrands] = useState([]);
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [subCategory, setSubCategory] = useState([]);

    const router = useRouter();

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
        <div className="">
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
                    <form onSubmit={handleSubmit} className="bg-white/80 border border-gray-200 rounded-xl p-3 space-y-3">
                        <div className="flex items-center font-semibold text-gray-700 mb-4">
                            <FontAwesomeIcon icon={faArrowUpShortWide} className="me-2 text-gray-500" />
                            Filters
                        </div>

                        {subCategory.length > 0 && (
                            <div>
                                {/* <div className="text-[12px] font-semibold text-gray-500 mb-1">Department</div> */}
                                <Link href={`/products?department=${subCategory[0].departmentId.name}`} className=" text-emerald-600 hover:underline">
                                    {subCategory[0].departmentId.name}
                                </Link>
                            </div>
                        )}

                        <div>
                            <label className="block text-[12px] font-semibold text-gray-600 mb-1">Sub-Category</label>
                            <select name="subcategory" value={values.subcategory} onChange={handleChange} className="w-full p-1 rounded border border-gray-300">
                                <option value="">Select</option>
                                {subCategory.map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-gray-600 mb-1">Price</label>
                            <div className="flex gap-2">
                                <input type="number" name="min" placeholder="Min" value={values.min} onChange={handleChange} className="w-1/2 p-1 rounded border border-gray-300" />
                                <input type="number" name="max" placeholder="Max" value={values.max} onChange={handleChange} className="w-1/2 p-1 rounded border border-gray-300" />
                            </div>
                        </div>

                        {[
                            { name: "brand", label: "Brand", options: brands },
                            { name: "subbrand", label: "Sub Brand", options: subBrands },
                            { name: "color", label: "Color", options: color },
                            { name: "size", label: "Size", options: size },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-[12px] font-semibold text-gray-600 mb-1">{field.label}</label>
                                <select name={field.name} value={values[field.name]} onChange={handleChange} className="w-full p-1 rounded border border-gray-300">
                                    <option value="">Select</option>
                                    {field.options.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="w-full py-1.5 rounded bg-emerald-500 text-white font-medium hover:opacity-90">
                                Apply
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
                                    router.push(`/products?department=${subCategory[0].departmentId.name}`);
                                    if (typeof onFilterChange === "function") {
                                        onFilterChange({});
                                    }
                                }}
                                className="w-full py-1.5 rounded border border-emerald-500 text-emerald-600 font-medium hover:bg-emerald-50"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}
