"use client";

import { useEffect, useState } from "react";
import { getACategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import { getSubCategoryByCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import ShowSubCategories from "@/src/components/Admin/SubCategory/ShowSubCategories";
import Link from "next/link";

export default function SubCategoryPage({ params }) {
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const subCategoryRes = await getSubCategoryByCategoryApi(params.category_id);
      const categoryRes = await getACategoryApi(params.category_id);

      if (!subCategoryRes.error) {
        setSubCategories(subCategoryRes.data);
      }

      if (!categoryRes.error) {
        setCategory(categoryRes.data);
      }

      setLoading(false);
    }

    fetchData();
  }, [params.category_id]);

  if (loading) {
    return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500 mb-4"></div>
        <p className="text-lg font-semibold text-gray-600 animate-pulse">Fetching the subCategory magic... ✨</p>
    </div>)
  }

  if (!subCategories.length || !category) {
    return (

        <div>
            <div className="text-end space-x-3 mb-5">
                <button className="btn btn-primary text-white btn-sm">
                <Link href={`/super-admin/dashboard/category/${params.category_id}/sub-category/create`}>
                    Create Sub Category
                </Link>
                </button>
            </div>
            <div className="text-center py-10 text-red-500">Not found subcategories or category</div>;
        </div>

    )
        

  }

  return (
    <div>
      <div className="text-end space-x-3 mb-5">
        <button className="btn btn-primary text-white btn-sm">
          <Link href={`/super-admin/dashboard/category/${params.category_id}/sub-category/create`}>
            Create Sub Category
          </Link>
        </button>
      </div>

      <ShowSubCategories subCategories={subCategories} category={category} />
    </div>
  );
}
