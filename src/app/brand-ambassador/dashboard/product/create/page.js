"use client";

import { useEffect, useState } from "react";
import { getAllBatchApi } from "@/src/api/SuperAdminApi/BatchApi";
import { getAllBrandApi } from "@/src/api/SuperAdminApi/BrandApi";
import { getAllCategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import { getAllDepartmentApi } from "@/src/api/SuperAdminApi/DepartmentApi";
import { getAllSubBrandApi } from "@/src/api/SuperAdminApi/SubBrandApi";
import { getAllSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import dynamic from "next/dynamic";

const CreateProduct = dynamic(() => import("@/src/components/Admin/Product/CreateProduct"), {
    ssr: false,
});
import Link from "next/link";
import { Modal } from "@/src/components/Common/Modal/Modal";

export default function CreateProductPage() {
    const [data, setData] = useState({
        departments: null,
        categories: null,
        subCategories: null,
        brands: null,
        subBrands: null,
        batches: null,
    });
    const [modalState, setModalState] = useState({ error: false, message: "", open: false, loading: 0 });

    useEffect(() => {
        setModalState({ message: "Loading product creation resources...", open: 1, loading: 1 });

        async function fetchAllData() {
            const [departments, categories, subCategories, brands, subBrands, batches] = await Promise.all([
                getAllDepartmentApi(),
                getAllCategoryApi(),
                getAllSubCategoryApi(),
                getAllBrandApi(),
                getAllSubBrandApi(),
                getAllBatchApi(),
            ]);

            setData({ departments, categories, subCategories, brands, subBrands, batches });

            setModalState({  open: 0, loading: 0 });
        }

        fetchAllData();
    }, []);

    const { departments, categories, subCategories, brands, subBrands, batches } = data;

    const renderError = (label, res, href) =>
        res?.error && (
            <div className="text-2xl text-center p-20 font-bold">
                {res.message} <br />
                <Link className="btn btn-sm mt-3 btn-success text-white" href={href}>
                    Create New {label}
                </Link>
            </div>
        );

    if (departments?.error || categories?.error || subCategories?.error || brands?.error || batches?.error) {
        return (
            <>
                {renderError("Department", departments, "/super-admin/dashboard/department/create")}
                {renderError("Category", categories, "/super-admin/dashboard/category/create")}
                {renderError("Sub Category", subCategories, "/super-admin/dashboard/sub-category/create")}
                {renderError("Brand", brands, "/super-admin/dashboard/brand/create")}
                {renderError("Batch", batches, "/super-admin/dashboard/batch/create")}
            </>
        );
    }

    return (
        <div>
            {data && data.batches && data.brands && data.categories && data.departments && data.subBrands && data.subCategories && (
                <CreateProduct departments={departments.data} categories={categories.data} subCategories={subCategories.data} brands={brands.data} subBrands={subBrands.data} batches={batches.data} />
            )}

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
