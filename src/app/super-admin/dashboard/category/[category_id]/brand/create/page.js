"use client";

import React, { useEffect, useState } from "react";
import { getACategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import CreateBrand from "@/src/components/Admin/Brand/CreateBrand";

export default function CreateBrandPage({ params }) {
  const { category_id } = params;

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
        } else {
          setCategory(res.data);
        }
      } catch (err) {
        setError("Something went wrong while fetching the category.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [category_id]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="loader rounded-full border-8 border-t-8 border-blue-500 h-12 w-12 animate-spin"></div>
          <p className="text-lg font-semibold text-blue-700">Preparing the brand creation form...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-bold p-10">{error}</p>
      ) : (
        category && <CreateBrand category={category} />
      )}

      <style jsx>{`
        .loader {
          border-color: #e5e7eb;
          border-top-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
