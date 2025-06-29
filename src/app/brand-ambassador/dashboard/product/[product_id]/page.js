"use client";

import React, { useEffect, useState } from "react";
import { getAllBatchApi } from "@/src/api/SuperAdminApi/BatchApi";
import { getAllBrandApi } from "@/src/api/SuperAdminApi/BrandApi";
import { getAllCategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import { getAllDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import { getAProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { getAllSubBrandApi } from "@/src/api/SuperAdminApi/SubBrandApi";
import { getAllSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import UpdateProduct from "@/src/components/Admin/Product/UpdateProduct";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function ProductDetailsPage({ params }) {
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });
    const [productData, setProductData] = useState({
        product: null,
        departments: [],
        categories: [],
        subCategories: [],
        brands: [],
        subBrands: [],
        batches: [],
    });

    useEffect(() => {
        async function fetchData() {
            setModalState({ message: "Collecting product data...", open: 1, loading: 1 });
            try {
                const [product, departments, categories, subCategories, brands, subBrands, batches] = await Promise.all([
                    getAProductApi(params.product_id),
                    getAllDepartmentApi(),
                    getAllCategoryApi(),
                    getAllSubCategoryApi(),
                    getAllBrandApi(),
                    getAllSubBrandApi(),
                    getAllBatchApi(),
                ]);

                const anyError = product.error || departments.error || categories.error || subCategories.error || brands.error || !subBrands.error || batches.error;

                if (anyError) {
                    setModalState({
                        error: true,
                        message:
                            product.message || departments.message || categories.message || subCategories.message || brands.message || subBrands.message || batches.message || "Something went wrong.",
                        open: 1,
                        loading: 0,
                    });
                } else {
                    setModalState({ error: false, message: "", open: 0, loading: 0 });
                    setProductData({
                        product: product.data,
                        departments: departments.data,
                        categories: categories.data,
                        subCategories: subCategories.data,
                        brands: brands.data,
                        subBrands: subBrands.data,
                        batches: batches.data,
                    });
                }
            } catch (error) {
                setModalState({ error: true, message: "Failed to load product data.", open: 1, loading: 0 });
            }
        }

        fetchData();
    }, [params.product_id]);

    return (
        <div>
            {!modalState.error && productData && productData.product && (
                <UpdateProduct
                    product={productData.product}
                    departments={productData.departments}
                    categories={productData.categories}
                    subCategories={productData.subCategories}
                    brands={productData.brands}
                    subBrands={productData.subBrands}
                    batches={productData.batches}
                />
            )}

            <Modal
                loading={modalState.loading}
                open={modalState.open}
                handleOpen={() => setModalState({ ...modalState, open: !modalState.open })}
                error={modalState.error}
                message={modalState.message}
            />

            <style jsx>{`
                .loader {
                    border-color: #e5e7eb;
                    border-top-color: #3b82f6;
                }
            `}</style>
        </div>
    );
}
