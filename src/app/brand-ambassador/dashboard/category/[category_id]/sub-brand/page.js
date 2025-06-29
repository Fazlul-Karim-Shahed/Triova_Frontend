"use client";

import { useEffect, useState } from "react";
import { getSubBrandByCategoryApi } from "@/src/api/SuperAdminApi/SubBrandApi";
import { getACategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import UpdateSubBrand from "@/src/components/Admin/SubBrand/UpdateSubBrand";
import Link from "next/link";

export default function SubBrand({ params }) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [subBrands, setSubBrands] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [catRes, subBrandRes] = await Promise.all([
        getACategoryApi(params.category_id),
        getSubBrandByCategoryApi(params.category_id),
      ]);

      if (!catRes.error) setCategory(catRes.data);
      if (!subBrandRes.error) setSubBrands(subBrandRes.data);

      setLoading(false);
    }

    fetchData();
  }, [params.category_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold text-blue-600 animate-pulse">
          Loading your sub brands... 💫
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-end space-x-3 mb-5">
        <button className="btn btn-primary text-white btn-sm">
          <Link href={`/super-admin/dashboard/category/${params.category_id}/sub-brand/create`}>
            Create Sub Brand
          </Link>
        </button>
      </div>

      {category && (
        <div className="text-2xl text-center my-10">
          Sub Brands | Category ~ {category.name}
        </div>
      )}

      {!subBrands && (
        <div className="text-center text-xl text-red-600">
          No sub brands found for this category.
        </div>
      )}

      {subBrands && <UpdateSubBrand subBrands={subBrands} />}
    </div>
  );
}
