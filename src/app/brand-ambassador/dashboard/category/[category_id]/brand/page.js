"use client";

import { useEffect, useState } from "react";
import { getBrandByCategoryApi } from "@/src/api/SuperAdminApi/BrandApi";
import { getACategoryApi } from "@/src/api/SuperAdminApi/CategoryApi";
import UpdateBrand from "@/src/components/Admin/Brand/UpdateBrand";
import Link from "next/link";
import Spinner from "@/src/components/Common/Spinner/Spinner";

const Brand = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState(null);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          getBrandByCategoryApi(params.category_id),
          getACategoryApi(params.category_id),
        ]);

        if (!brandRes.error) setBrands(brandRes.data);
        else setError(brandRes.message);

        if (!categoryRes.error) setCategory(categoryRes.data);
      } catch (err) {
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.category_id]);

  if (loading) {
    return <Spinner message={"Loading brands for you... 🛍️"} />;
  }

  return (
    <div>
      <div className="text-end space-x-3 mb-5">
        <button className="btn btn-primary text-white btn-sm">
          <Link href={`/super-admin/dashboard/category/${params.category_id}/brand/create`}>
            Create Brand
          </Link>
        </button>
      </div>

      {category && (
        <div className="text-2xl text-center my-10">
          Brands | Category ~ {category.name}
        </div>
      )}

      {error && (
        <div className="text-center text-xl text-red-600">
          {error}
        </div>
      )}

      {brands && <UpdateBrand brands={brands} />}
    </div>
  );
};

export default Brand;
