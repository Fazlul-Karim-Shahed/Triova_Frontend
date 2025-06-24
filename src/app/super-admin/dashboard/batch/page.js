"use client";

import { useEffect, useState } from "react";
import { getAllBatchApi } from "@/src/api/SuperAdminApi/BatchApi";
import BatchDetails from "@/src/components/Admin/Batch/BatchDetails";
import Link from "next/link";

export default function BatchPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      const response = await getAllBatchApi();
      setData(response);
      setLoading(false);
    }

    fetchBatches();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-600 mb-4"></div>
        <p className="text-lg font-semibold text-purple-600 animate-pulse">
          Loading batch data...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-end">
        <button className="btn mb-5 btn-primary text-white btn-sm">
          <Link href="/super-admin/dashboard/batch/create">Create new batch</Link>
        </button>
      </div>

      <BatchDetails data={data} />
    </div>
  );
}
