"use client";

import React, { useEffect, useState } from "react";
import { getACategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import CreateSubCategory from "@/src/components/Admin/SubCategory/CreateSubCategory";

export default function CreateSubCategoryPage({ params }) {
  const category_id = params.category_id;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      setError(null);
      try {
        const res = await getACategoryApi(category_id);
        if (res.error) {
          setError(res.message);
          setCategory(null);
        } else {
          setCategory(res.data);
        }
      } catch (err) {
        setError("Failed to fetch category");
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [category_id]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center p-20 space-x-4">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
          <p className="text-xl font-semibold text-gray-700">Loading category data...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-bold p-10">{error}</p>
      ) : (
        category && <CreateSubCategory category={category} />
      )}

      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
