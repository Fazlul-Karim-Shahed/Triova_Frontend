"use client";

import { useEffect, useState } from "react";
import { getBrandByCategoryApi } from "@/src/api/SuperAdminApi/BrandApi";
import { getACategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import CreateSubBrand from "@/src/components/Admin/SubBrand/CreateSubBrand";

export default function CreateSubBrandPage({ params }) {
  const category_id = params.category_id;

  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState({ brand: null, category: null });

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          getBrandByCategoryApi(category_id),
          getACategoryApi(category_id),
        ]);

        if (brandRes.error) {
          setError(prev => ({ ...prev, brand: "No brand name found. Create at least one brand." }));
        } else {
          setBrand(brandRes.data);
        }

        if (categoryRes.error) {
          setError(prev => ({ ...prev, category: categoryRes.message }));
        } else {
          setCategory(categoryRes.data);
        }
      } catch (err) {
        setError({ brand: "Failed to fetch brand.", category: "Failed to fetch category." });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold text-blue-600 animate-pulse">
          Preparing your Sub Brand creation form...
        </p>
      </div>
    );
  }

  return (
    <div>
      {error.brand && (
        <div className="text-center pt-20 text-xl text-red-600">
          {error.brand}
        </div>
      )}
      {error.category && (
        <div className="text-center text-xl text-red-600">
          {error.category}
        </div>
      )}
      {!error.brand && !error.category && category && brand && (
        <CreateSubBrand category={category} brand={brand} />
      )}
    </div>
  );
}
